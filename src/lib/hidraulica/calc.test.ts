import { describe, it, expect } from "vitest";
import {
  colebrook,
  swameeJain,
  darcyHeadLoss,
  hazenWilliamsHeadLoss,
  velocityFromQ,
  reynoldsNumber,
  densityWater,
  viscosityWater,
  localLoss,
  totalHeadLoss,
  toM3s,
  toMeters,
  toCSVHidraulica,
  type Section,
} from "./calc";

const opts = {
  method: "darcy-swamee-jain" as const,
  T_C: 20,
  desnivel_m: 0,
  eficienciaBomba: 0.6,
};

describe("propriedades da água", () => {
  it("densidade e viscosidade a 20 °C", () => {
    expect(densityWater(20)).toBeCloseTo(998.2, 1);
    expect(viscosityWater(20)).toBeCloseTo(1.002e-3, 6);
  });
});

describe("cinemática", () => {
  it("velocidade e Reynolds — caso 1 (D=50mm, Q=2 L/s)", () => {
    const V = velocityFromQ(0.002, 0.05);
    expect(V).toBeCloseTo(1.0186, 3);
    const Re = reynoldsNumber(998.2, V, 0.05, 1.002e-3);
    expect(Re).toBeGreaterThan(50000);
    expect(Re).toBeLessThan(52000);
  });
});

describe("fator de atrito", () => {
  it("laminar usa 64/Re", () => {
    expect(colebrook(1000, 0.05, 1.5e-6).f).toBeCloseTo(0.064, 5);
  });

  it("Colebrook converge e fica próximo de Swamee-Jain", () => {
    const Re = 1e5;
    const c = colebrook(Re, 0.05, 4.5e-5);
    const s = swameeJain(Re, 0.05, 4.5e-5);
    expect(c.converged).toBe(true);
    expect(Math.abs(c.f - s) / c.f).toBeLessThan(0.02);
  });

  it("Colebrook converge em Re muito altos", () => {
    for (const Re of [1e6, 1e7, 1e8]) {
      const r = colebrook(Re, 0.1, 2.6e-4);
      expect(r.converged).toBe(true);
      expect(r.f).toBeGreaterThan(0.005);
      expect(r.f).toBeLessThan(0.1);
    }
  });

  it("tubo liso a Re=1e5 tem f ≈ 0,018", () => {
    expect(colebrook(1e5, 0.05, 1.5e-6).f).toBeCloseTo(0.018, 2);
  });
});

describe("perdas", () => {
  it("Darcy-Weisbach", () => {
    const hf = darcyHeadLoss(0.02, 100, 0.05, 1.0186);
    expect(hf).toBeCloseTo(2.116, 2);
  });

  it("Hazen-Williams — caso 2 (D=100mm, L=200m, Q=10 L/s, C=140)", () => {
    const hf = hazenWilliamsHeadLoss(0.01, 140, 0.1, 200);
    expect(hf).toBeGreaterThan(1);
    expect(hf).toBeCloseTo(3.323, 2);
  });

  it("perdas localizadas", () => {
    expect(localLoss([0.9, 0.2], 2)).toBeCloseTo((1.1 * 4) / (2 * 9.80665), 6);
  });
});

describe("totalHeadLoss", () => {
  const A: Section = {
    id: "a",
    label: "Trecho A",
    D_m: 0.08,
    L_m: 50,
    eps_m: 1.5e-6,
    Q_m3s: 0.005,
  };
  const B: Section = {
    id: "b",
    label: "Trecho B",
    D_m: 0.05,
    L_m: 30,
    eps_m: 1.5e-6,
    Q_m3s: 0.005,
  };

  it("caso 3 — dois trechos em série com peças", () => {
    const r = totalHeadLoss(
      [A, B],
      [
        { label: "Curva 90°", K: 0.9, qty: 1, sectionId: "b" },
        { label: "Válvula gaveta", K: 0.2, qty: 1, sectionId: "b" },
      ],
      opts,
    );
    expect(r.sections).toHaveLength(2);
    expect(r.sections[0]!.hlocal_m).toBe(0);
    expect(r.sections[1]!.sumK).toBeCloseTo(1.1, 6);
    expect(r.hf_total_m).toBeCloseTo(r.hf_atrito_m + r.hf_local_m, 9);
    expect(r.sections[1]!.V_m_s).toBeGreaterThan(r.sections[0]!.V_m_s);
    expect(r.perfil.at(-1)!.h_m).toBeCloseTo(r.hf_total_m, 6);
  });

  it("potência de bomba considera desnível e eficiência", () => {
    const r = totalHeadLoss([A], [], { ...opts, desnivel_m: 10, eficienciaBomba: 0.5 });
    expect(r.head_total_m).toBeCloseTo(r.hf_total_m + 10, 6);
    expect(r.potenciaEletrica_kW).toBeCloseTo(r.potenciaHidraulica_kW / 0.5, 9);
  });

  it("Colebrook e Swamee-Jain produzem resultados próximos", () => {
    const c = totalHeadLoss([A, B], [], { ...opts, method: "darcy-colebrook" });
    const s = totalHeadLoss([A, B], [], opts);
    expect(Math.abs(c.hf_total_m - s.hf_total_m) / c.hf_total_m).toBeLessThan(0.03);
  });

  it("gera avisos de velocidade alta", () => {
    const r = totalHeadLoss([{ ...B, Q_m3s: 0.01 }], [], opts);
    expect(r.avisos.some((a) => a.includes("acima de 3 m/s"))).toBe(true);
  });

  it("erro para trecho inválido", () => {
    expect(() => totalHeadLoss([{ ...A, D_m: 0 }], [], opts)).toThrow();
    expect(() => totalHeadLoss([], [], opts)).toThrow();
  });

  it("CSV contém cabeçalho e totais", () => {
    const csv = toCSVHidraulica(totalHeadLoss([A], [], opts));
    expect(csv.split("\n")[0]).toContain("Reynolds");
    expect(csv).toContain("TOTAL perda (m)");
  });
});

describe("conversões", () => {
  it("vazão e diâmetro", () => {
    expect(toM3s(10, "L/s")).toBeCloseTo(0.01, 9);
    expect(toM3s(36, "m3/h")).toBeCloseTo(0.01, 9);
    expect(toM3s(100, "gpm")).toBeCloseTo(0.0063090, 6);
    expect(toMeters(50, "mm")).toBeCloseTo(0.05, 9);
    expect(toMeters(2, "in")).toBeCloseTo(0.0508, 9);
  });
});
