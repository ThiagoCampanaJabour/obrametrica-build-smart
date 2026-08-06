import { describe, it, expect } from "vitest";
import {
  energyFromPower,
  powerFromEnergy,
  factorFromHEandPR,
  heAnnualFromDaily,
  adjustFactorForTiltOrientation,
  suggestModuleCount,
  sensitivityRange,
  energyFromIrradiance,
} from "./kwkwh";

describe("energyFromPower", () => {
  it("Caso 1 — 5 kWp em São Paulo (1500, 14%) = 6450 kWh/ano", () => {
    const r = energyFromPower(5, 1500, 14);
    expect(r.energy_kwh).toBeCloseTo(6450, 6);
    expect(r.breakdown.pr).toBeCloseTo(0.86, 6);
    expect(r.breakdown.base_energy_kwh).toBeCloseTo(7500, 6);
    expect(r.breakdown.losses_kwh).toBeCloseTo(1050, 6);
    expect(r.avisos).toHaveLength(0);
  });

  it("média mensal é a anual dividida por 12", () => {
    const r = energyFromPower(5, 1500, 14);
    expect(r.energy_month_kwh).toBeCloseTo(6450 / 12, 6);
  });

  it("sinaliza potência zero ou negativa", () => {
    expect(energyFromPower(0, 1500, 14).avisos.length).toBeGreaterThan(0);
    const neg = energyFromPower(-5, 1500, 14);
    expect(neg.energy_kwh).toBe(0);
    expect(neg.avisos.length).toBeGreaterThan(0);
  });

  it("avisa fator implausível", () => {
    expect(energyFromPower(5, 3000, 14).avisos.length).toBeGreaterThan(0);
    expect(energyFromPower(5, 300, 14).avisos.length).toBeGreaterThan(0);
  });

  it("perdas acima de 95% são limitadas", () => {
    const r = energyFromPower(5, 1500, 150);
    expect(r.breakdown.pr).toBeCloseTo(0.05, 6);
    expect(r.energy_kwh).toBeGreaterThan(0);
  });
});

describe("powerFromEnergy", () => {
  it("Caso 2 — 9000 kWh/ano em Fortaleza (1850, 14%) ≈ 5,66 kWp", () => {
    const r = powerFromEnergy(9000, 1850, 14);
    expect(r.kWp_required).toBeCloseTo(9000 / (1850 * 0.86), 6);
    expect(r.kWp_required).toBeGreaterThan(5.6);
    expect(r.kWp_required).toBeLessThan(5.7);
    expect(r.kWp_sugerido).toBeCloseTo(5.7, 6);
  });

  it("sugere módulos com margem de reserva", () => {
    const r = powerFromEnergy(9000, 1850, 14, { module_power_W: 550, spare_pct: 3 });
    expect(r.modules_suggested.module_power_W).toBe(550);
    expect(r.modules_suggested.qty).toBeGreaterThanOrEqual(11);
    expect(r.modules_suggested.kWp_instalado).toBeGreaterThan(r.kWp_required);
  });

  it("é o inverso exato de energyFromPower", () => {
    const e = energyFromPower(7.3, 1600, 12).energy_kwh;
    expect(powerFromEnergy(e, 1600, 12).kWp_required).toBeCloseTo(7.3, 6);
  });

  it("fator zero não gera Infinity", () => {
    const r = powerFromEnergy(9000, 0, 14);
    expect(r.kWp_required).toBe(0);
    expect(r.avisos.length).toBeGreaterThan(0);
  });

  it("meta zero é sinalizada", () => {
    expect(powerFromEnergy(0, 1500, 14).avisos.length).toBeGreaterThan(0);
  });
});

describe("suggestModuleCount", () => {
  it("arredonda para cima e calcula a reserva", () => {
    const s = suggestModuleCount(5, 550, 0);
    expect(s.qty).toBe(10); // ceil(5000/550) = 10
    expect(s.spare_qty).toBe(0);
    expect(s.kWp_instalado).toBeCloseTo(5.5, 6);
  });

  it("aplica margem percentual", () => {
    const s = suggestModuleCount(10, 400, 10);
    expect(s.qty).toBe(28); // ceil(25 * 1.1)
    expect(s.spare_qty).toBe(3);
  });

  it("potência de módulo inválida retorna zeros", () => {
    expect(suggestModuleCount(5, 0).qty).toBe(0);
  });
});

describe("factorFromHEandPR", () => {
  it("Caso 3 — HE 1700 h/ano com PR 0,78 ≈ 1326 kWh/kWp/ano", () => {
    expect(factorFromHEandPR(1700, 0.78)).toBeCloseTo(1326, 6);
  });

  it("aceita PR em percentual", () => {
    expect(factorFromHEandPR(1700, 78)).toBeCloseTo(1326, 6);
  });

  it("converte HE diária em anual", () => {
    expect(heAnnualFromDaily(4.8)).toBeCloseTo(1752, 6);
  });
});

describe("adjustFactorForTiltOrientation", () => {
  it("inclinação próxima da latitude praticamente não penaliza", () => {
    const r = adjustFactorForTiltOrientation(1500, 23, 0, -23.5);
    expect(r).toBeGreaterThan(1490);
    expect(r).toBeLessThanOrEqual(1500);
  });

  it("orientação sul penaliza mais que norte", () => {
    const norte = adjustFactorForTiltOrientation(1500, 25, 0, -23.5);
    const sul = adjustFactorForTiltOrientation(1500, 25, 180, -23.5);
    expect(sul).toBeLessThan(norte);
  });

  it("telhado plano é quase neutro ao azimute", () => {
    const a = adjustFactorForTiltOrientation(1500, 0, 0, -23.5);
    const b = adjustFactorForTiltOrientation(1500, 0, 180, -23.5);
    expect(Math.abs(a - b)).toBeLessThan(1e-6);
  });

  it("fator base inválido retorna zero", () => {
    expect(adjustFactorForTiltOrientation(0, 20, 0, -23.5)).toBe(0);
  });
});

describe("sensitivityRange", () => {
  it("produz três cenários crescentes no modo direto", () => {
    const rows = sensitivityRange("kwp-to-kwh", 5, 1500, 14);
    expect(rows).toHaveLength(3);
    expect(rows[0]!.value).toBeLessThan(rows[1]!.value);
    expect(rows[1]!.value).toBeLessThan(rows[2]!.value);
  });

  it("no modo inverso o cenário otimista exige menos potência", () => {
    const rows = sensitivityRange("kwh-to-kwp", 9000, 1500, 14);
    expect(rows[2]!.value).toBeLessThan(rows[0]!.value);
  });
});

describe("energyFromIrradiance", () => {
  it("caminho alternativo por área e eficiência", () => {
    const e = energyFromIrradiance(1900, 2.58, 21.3, 10, 14);
    expect(e).toBeCloseTo(1900 * 2.58 * 0.213 * 10 * 0.86, 6);
  });
});
