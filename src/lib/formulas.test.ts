import { describe, it, expect } from "vitest";
import {
  calcArgamassa,
  calcConcreto,
  calcPiso,
  calcTijolos,
  calcTinta,
  cmParaPolegada,
  litrosParaM3,
  m2ParaHectare,
} from "./formulas";

describe("calcArgamassa", () => {
  it("calcula total e sacos para tipo interno", () => {
    // 10 m² * 5 kg/m² = 50 kg → 3 sacos de 20 kg
    expect(calcArgamassa(10, "interno")).toEqual({ total: 50, sacos: 3 });
  });
  it("usa 6 kg/m² para externo", () => {
    expect(calcArgamassa(10, "externo")).toEqual({ total: 60, sacos: 3 });
  });
  it("usa 7 kg/m² para porcelanato e arredonda sacos para cima", () => {
    // 15 m² * 7 = 105 kg → ceil(105/20) = 6
    expect(calcArgamassa(15, "porcelanato")).toEqual({ total: 105, sacos: 6 });
  });
});

describe("calcConcreto", () => {
  it("multiplica as três dimensões", () => {
    expect(calcConcreto(5, 4, 0.1)).toEqual({ volume: 2 });
  });
});

describe("calcPiso", () => {
  it("adiciona 10% de sobra e arredonda caixas para cima", () => {
    // 4x3 = 12 m² → 13.2 m² → ceil(13.2 / 2.5) = 6 caixas
    const r = calcPiso(4, 3, 2.5);
    expect(r.area).toBe(12);
    expect(r.areaSobra).toBeCloseTo(13.2, 5);
    expect(r.caixas).toBe(6);
  });
});

describe("calcTijolos", () => {
  it("aplica consumo do tipo 9x19x19 (25/m²) com 10% de perda", () => {
    // 5m x 2.5m = 12.5 m² * 25 = 312.5 → 313; *1.1 = 343.75 → 344
    const r = calcTijolos(5, 2.5, "9x19x19");
    expect(r.area).toBeCloseTo(12.5, 5);
    expect(r.qtd).toBe(313);
    expect(r.qtdPerda).toBe(344);
  });
  it("usa 16/m² para tijolos 14x19x29", () => {
    const r = calcTijolos(10, 3, "14x19x29");
    expect(r.qtd).toBe(480);
  });
});

describe("calcTinta", () => {
  it("calcula litros = área * demãos / 5 e reserva de 10%", () => {
    // 10m x 3m = 30 m², 2 demãos → 60/5 = 12 L → ceil(12*1.1) = 14
    const r = calcTinta(10, 3, 2);
    expect(r.area).toBe(30);
    expect(r.litros).toBe(12);
    expect(r.litrosRec).toBe(14);
  });
});

describe("conversores", () => {
  it("cm → polegada", () => {
    expect(cmParaPolegada(2.54)).toBeCloseTo(1, 10);
    expect(cmParaPolegada(100)).toBeCloseTo(39.3700787, 5);
  });
  it("litros → m³", () => {
    expect(litrosParaM3(1000)).toBe(1);
    expect(litrosParaM3(2500)).toBe(2.5);
  });
  it("m² → hectare", () => {
    expect(m2ParaHectare(10000)).toBe(1);
    expect(m2ParaHectare(25000)).toBe(2.5);
  });
});
