import { describe, expect, it } from "vitest";
import { calcAndaimes, calcTrecho, comMargem, validarTrecho, type TrechoInput } from "./calc";

const base: TrechoInput = {
  id: "t1",
  nome: "Fachada A",
  larguraM: 10,
  alturaM: 6,
  carga: "leve",
  sistema: "tubular-fachada",
  moduleWidthM: 2,
  spacingVerticalM: 2,
  platformDepthM: 0.75,
  margemPct: 10,
};

describe("calc andaimes", () => {
  it("caso 1: fachada 10x6 leve", () => {
    const r = calcTrecho(base);
    expect(r.niveis).toBe(3);
    expect(r.modulosPorNivel).toBe(5);
    expect(r.areaPlataformaM2).toBe(22.5);
    expect(r.modulosTotal).toBe(17); // ceil(15 * 1.1)
    expect(r.alertas).toHaveLength(0);
  });

  it("caso 2: fachada 20x12 média dispara alerta de altura", () => {
    const r = calcTrecho({ ...base, id: "t2", nome: "Fachada B", larguraM: 20, alturaM: 12, carga: "media" });
    expect(r.niveis).toBe(6);
    expect(r.modulosPorNivel).toBe(10);
    expect(r.alertas.some((a) => a.includes("12 m"))).toBe(true);
  });

  it("escoramento gera escoras e nenhum guarda-corpo", () => {
    const r = calcTrecho({ ...base, sistema: "escora-metalica", moduleWidthM: undefined, spacingVerticalM: undefined, platformDepthM: undefined });
    expect(r.escoras).toBeGreaterThan(0);
    expect(r.guardaCorpos).toBe(0);
  });

  it("soma múltiplos trechos", () => {
    const r = calcAndaimes([base, { ...base, id: "t2", nome: "B" }]);
    expect(r.totais.modulosTotal).toBe(34);
    expect(r.trechos).toHaveLength(2);
  });

  it("margem e validação", () => {
    expect(comMargem(15, 10)).toBe(17);
    expect(validarTrecho({ ...base, larguraM: 0 })).toContain("largura");
    expect(validarTrecho({ ...base, alturaM: 500 })).toContain("altura");
    expect(validarTrecho(base)).toBeNull();
  });
});
