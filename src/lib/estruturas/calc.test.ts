import { describe, expect, it } from "vitest";
import {
  calcElemento,
  calcEstruturas,
  esforcosPortico,
  esforcosVigaContinua,
  esforcosVigaSimples,
  flechaVigaSimplesMm,
  toCSVEstruturas,
  type ElementoInput,
} from "./calc";

const base: ElementoInput = {
  id: "e1",
  nome: "Viga V1",
  tipo: "viga-simples",
  vaoM: 6,
  alturaM: 3,
  cargaDistribuidaKnM: 5,
  cargaPontualKn: 0,
  apoio: "biapoiado",
  material: "S275",
  familia: "IPE",
  fatorMargem: 1,
  quantidade: 1,
  extraCorteM: 0.1,
};

describe("esforços", () => {
  it("viga biapoiada com carga distribuída: M = qL²/8", () => {
    const r = esforcosVigaSimples(5, 0, 6);
    expect(r.momentoKnM).toBeCloseTo(22.5, 6);
    expect(r.cortanteKn).toBeCloseTo(15, 6);
  });

  it("viga biapoiada com carga pontual central: M = PL/4", () => {
    const r = esforcosVigaSimples(0, 20, 4);
    expect(r.momentoKnM).toBeCloseTo(20, 6);
    expect(r.cortanteKn).toBeCloseTo(10, 6);
  });

  it("viga contínua de 2 vãos usa o momento do apoio central", () => {
    const r = esforcosVigaContinua(5, 0, 6);
    expect(r.momentoApoioKnM).toBeCloseTo(22.5, 6);
    expect(r.momentoKnM).toBeCloseTo(22.5, 6);
    expect(r.momentoVaoKnM).toBeLessThan(r.momentoApoioKnM);
  });

  it("pórtico gera momento indicativo no pilar N·h/2", () => {
    const r = esforcosPortico(0, 10, 5, 3);
    expect(r.reacaoTopoKn).toBeCloseTo(5, 6);
    expect(r.momentoPilarKnM).toBeCloseTo(7.5, 6);
  });

  it("flecha de viga biapoiada é positiva e cresce com L⁴", () => {
    const d6 = flechaVigaSimplesMm(5, 0, 6, 8356);
    const d8 = flechaVigaSimplesMm(5, 0, 8, 8356);
    expect(d6).toBeGreaterThan(0);
    expect(d8 / d6).toBeCloseTo((8 / 6) ** 4, 1);
  });
});

describe("seleção de perfis", () => {
  it("caso 1: L=6 m, q=5 kN/m → M=22,5 kN·m e perfil com W ≥ W_req", () => {
    const r = calcElemento(base);
    expect(r.momentoMaxKnM).toBeCloseTo(22.5, 2);
    expect(r.wReqCm3).toBeCloseTo(140.6, 0);
    expect(r.sugerido).not.toBeNull();
    expect(r.sugerido!.perfil.welCm3).toBeGreaterThanOrEqual(r.wReqCm3);
    expect(r.sugerido!.utilizacao).toBeLessThanOrEqual(1);
  });

  it("caso 2: carga pontual P=20 kN, L=4 m → M=20 kN·m", () => {
    const r = calcElemento({
      ...base,
      cargaDistribuidaKnM: 0,
      cargaPontualKn: 20,
      vaoM: 4,
    });
    expect(r.momentoMaxKnM).toBeCloseTo(20, 2);
    expect(r.sugerido!.perfil.welCm3).toBeGreaterThanOrEqual(r.wReqCm3);
  });

  it("escolhe o perfil mais leve entre os que atendem", () => {
    const r = calcElemento(base);
    const maisLeve = r.alternativas.filter((c) => c.welCm3 >= r.wReqCm3)[0];
    expect(r.sugerido!.perfil.id).toBe(maisLeve.perfil.id);
  });

  it("respeita a família preferida", () => {
    const r = calcElemento({ ...base, familia: "HEB" });
    expect(r.sugerido!.perfil.familia).toBe("HEB");
  });

  it("fator de margem aumenta o momento proporcionalmente", () => {
    const a = calcElemento(base);
    const b = calcElemento({ ...base, fatorMargem: 1.25 });
    expect(b.momentoMaxKnM / a.momentoMaxKnM).toBeCloseTo(1.25, 2);
  });

  it("peso total considera quantidade e extra de corte", () => {
    const r = calcElemento({ ...base, quantidade: 4 });
    const s = r.sugerido!;
    expect(s.comprimentoTotalM).toBeCloseTo((6 + 0.1) * 4, 2);
    expect(s.pesoTotalKg).toBeCloseTo(s.perfil.massaKgM * s.comprimentoTotalM, 0);
  });
});

describe("agregação e exportação", () => {
  it("soma peso e peças de vários elementos", () => {
    const r = calcEstruturas([base, { ...base, id: "e2", nome: "Viga V2", quantidade: 2 }]);
    expect(r.totalPecas).toBe(3);
    expect(r.pesoTotalKg).toBeGreaterThan(0);
  });

  it("CSV contém cabeçalho, elemento e total", () => {
    const csv = toCSVEstruturas(calcEstruturas([base]));
    expect(csv).toContain("elemento;tipo;vao_m");
    expect(csv).toContain("Viga V1");
    expect(csv).toContain("TOTAL");
  });
});
