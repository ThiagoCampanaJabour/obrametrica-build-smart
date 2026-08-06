import { describe, it, expect } from "vitest";
import calcSystemLosses, {
  DEFAULT_INPUT,
  applyPctLoss,
  applyCableLoss,
  applyDegradation,
  applyTemperatureLoss,
  cellTemperature,
  estimateClippingPct,
  type SolarLossesInput,
} from "./calc";

const base = (over: Partial<SolarLossesInput> = {}): SolarLossesInput => ({
  ...DEFAULT_INPUT,
  ...over,
});

describe("funções unitárias", () => {
  it("aplica perda percentual", () => {
    const r = applyPctLoss(1000, 10);
    expect(r.loss_kWh).toBeCloseTo(100, 6);
    expect(r.energy_after_kWh).toBeCloseTo(900, 6);
  });

  it("calcula temperatura de célula pelo NOCT", () => {
    expect(cellTemperature(25, 45, 800)).toBeCloseTo(50, 6);
  });

  it("perda por temperatura usa |coef| × ΔT", () => {
    const r = applyTemperatureLoss(1000, -0.35, 25);
    expect(r.loss_pct).toBeCloseTo(8.75, 6);
  });

  it("ΔT negativo não gera ganho", () => {
    expect(applyTemperatureLoss(1000, -0.35, -10).loss_kWh).toBe(0);
  });

  it("cabo resistivo I²R", () => {
    const r = applyCableLoss(10000, {
      modo: "resistivo",
      corrente_A: 20,
      resistencia_ohm: 0.2,
      horas_h: 1400,
    });
    expect(r.loss_kWh).toBeCloseTo(112, 6);
  });

  it("clipping por DC/AC ratio", () => {
    expect(estimateClippingPct(1.05)).toBe(0);
    expect(estimateClippingPct(1.25)).toBe(1.5);
    expect(estimateClippingPct(1.5)).toBe(5);
    expect(estimateClippingPct(null)).toBe(0);
  });

  it("degradação composta", () => {
    const s = applyDegradation(1000, 0.5, 3);
    expect(s[0]!.energia_kWh).toBeCloseTo(1000, 6);
    expect(s[2]!.energia_kWh).toBeCloseTo(1000 * 0.995 ** 2, 6);
  });
});

describe("calcSystemLosses", () => {
  it("Caso 1 — soma do breakdown fecha com a perda total", () => {
    const r = calcSystemLosses(base({ energiaTeoricaDc_kWh: 10000 }));
    const soma = r.breakdown.reduce((a, b) => a + b.kWh, 0);
    expect(soma).toBeCloseTo(r.perdaTotal_kWh, 6);
    expect(r.energiaFinalAc_kWh + r.perdaTotal_kWh).toBeCloseTo(10000, 6);
    expect(r.eficienciaSistema_pct).toBeGreaterThan(70);
    expect(r.eficienciaSistema_pct).toBeLessThan(95);
  });

  it("Caso 2 — temperatura maior reduz a energia final", () => {
    const frio = calcSystemLosses(base({ tempAmbiente_C: 15 }));
    const quente = calcSystemLosses(base({ tempAmbiente_C: 35 }));
    expect(quente.energiaFinalAc_kWh).toBeLessThan(frio.energiaFinalAc_kWh);
  });

  it("Caso 3 — DC/AC alto aplica clipping e gera aviso", () => {
    const r = calcSystemLosses(base({ potenciaDc_kWp: 15, potenciaAc_kW: 10 }));
    expect(r.dcAcRatio).toBeCloseTo(1.5, 6);
    expect(r.clippingAplicado_pct).toBe(5);
    expect(r.avisos.some((a) => a.includes("DC/AC"))).toBe(true);
  });

  it("energia zero é sinalizada e não quebra", () => {
    const r = calcSystemLosses(base({ energiaTeoricaDc_kWh: 0 }));
    expect(r.energiaFinalAc_kWh).toBe(0);
    expect(r.eficienciaSistema_pct).toBe(0);
    expect(r.avisos.length).toBeGreaterThan(0);
  });

  it("entradas negativas são saneadas", () => {
    const r = calcSystemLosses(base({ energiaTeoricaDc_kWh: -500, soiling_pct: -3 }));
    expect(r.energiaTeorica_kWh).toBe(0);
    expect(r.breakdown.every((b) => b.kWh >= 0)).toBe(true);
  });

  it("clipping manual é respeitado", () => {
    const r = calcSystemLosses(base({ clippingModo: "manual", clipping_pct: 4 }));
    expect(r.clippingAplicado_pct).toBe(4);
  });

  it("série de degradação respeita o horizonte", () => {
    const r = calcSystemLosses(base({ horizonteAnos: 25 }));
    expect(r.serieDegradacao).toHaveLength(25);
    expect(r.serieDegradacao[0]!.energia_kWh).toBeCloseTo(r.energiaFinalAc_kWh, 6);
  });
});
