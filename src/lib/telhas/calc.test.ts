import { describe, expect, it } from "vitest";
import {
  applyLoss,
  areaPiece_mm,
  calcQuantification,
  defaultLossPct,
  estimateCutsByLayout,
  piecesBase,
} from "./calc";

describe("telhas/calc", () => {
  it("areaPiece_mm converte mm para m²", () => {
    expect(areaPiece_mm(600, 600)).toBeCloseTo(0.36, 6);
    expect(areaPiece_mm(0, 600)).toBe(0);
  });

  it("piecesBase arredonda para cima", () => {
    expect(piecesBase(12, 0.04)).toBe(300);
    expect(piecesBase(20, 0.36)).toBe(56);
    expect(piecesBase(0, 0.36)).toBe(0);
  });

  it("applyLoss aplica perda e margem", () => {
    expect(applyLoss(100, 10, 5)).toBe(116); // ceil(100*1.1*1.05)=116
    expect(applyLoss(0, 10, 5)).toBe(0);
  });

  it("defaultLossPct soma tipo, layout e tamanho", () => {
    expect(defaultLossPct("piso-ceramico", "alinhado", 0.04)).toBe(8);
    expect(defaultLossPct("porcelanato", "desloc50", 0.36)).toBe(18); // 12+2+4
    expect(defaultLossPct("telha", "alinhado", 0.09)).toBe(10); // 7+3
  });

  it("estimateCutsByLayout usa bordas quando há dimensões", () => {
    const r = estimateCutsByLayout(12, 4, 3, 0.2, 0.2, "alinhado");
    expect(r.colunas).toBe(20);
    expect(r.fileiras).toBe(15);
    expect(r.est_cuts).toBeGreaterThan(0);
    expect(r.est_whole_pieces + r.est_cuts).toBe(piecesBase(12, 0.04));
  });

  it("calcQuantification integra as etapas", () => {
    const r = calcQuantification({
      tipo: "piso-ceramico",
      larguraMm: 200,
      alturaMm: 200,
      areaM2: 12,
      layout: "alinhado",
      margemPct: 5,
      juntaMm: 0,
      pecasReserva: 0,
    });
    expect(r.pecasBase).toBe(300);
    expect(r.perdaPctUsada).toBe(8);
    expect(r.pecasFinal).toBe(applyLoss(300, 8, 5));
    expect(r.pecasComprar).toBe(r.pecasFinal);
  });

  it("respeita perda manual e reserva", () => {
    const r = calcQuantification({
      tipo: "porcelanato",
      larguraMm: 600,
      alturaMm: 600,
      areaM2: 20,
      layout: "desloc50",
      perdaPct: 10,
      margemPct: 5,
      juntaMm: 0,
      pecasReserva: 5,
    });
    expect(r.perdaPctUsada).toBe(10);
    expect(r.pecasBase).toBe(56);
    expect(r.pecasComprar).toBe(applyLoss(56, 10, 5) + 5);
  });
});
