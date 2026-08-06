import { describe, expect, it } from "vitest";
import layoutPlaceModules, {
  DEFAULT_LAYOUT_INPUT,
  applyCoverageLimit,
  computeRowSpacing,
  effectiveModuleDimensions,
  exportLayoutCSV,
  gridCount,
  moduleFootprint,
  projectShadowLength,
  suggestTiltOrientation,
  winterSolarElevation,
  type LayoutInput,
} from "./layout-calc";

const base = (over: Partial<LayoutInput> = {}): LayoutInput => ({
  ...DEFAULT_LAYOUT_INPUT,
  ...over,
});

describe("geometria do módulo", () => {
  it("paisagem coloca a maior dimensão no eixo X", () => {
    const f = moduleFootprint({ label: "t", pmp_W: 400, comprimento_m: 1.95, largura_m: 0.99 }, "paisagem");
    expect(f.largura_m).toBe(1.95);
    expect(f.altura_m).toBe(0.99);
  });

  it("retrato inverte os eixos", () => {
    const f = moduleFootprint({ label: "t", pmp_W: 400, comprimento_m: 1.95, largura_m: 0.99 }, "retrato");
    expect(f.largura_m).toBe(0.99);
    expect(f.altura_m).toBe(1.95);
  });

  it("soma os gaps nas dimensões efetivas", () => {
    const e = effectiveModuleDimensions(
      { label: "t", pmp_W: 400, comprimento_m: 1.95, largura_m: 0.99 },
      "paisagem",
      0.03,
      0.01,
    );
    expect(e.width_eff_m).toBeCloseTo(1.98, 6);
    expect(e.height_eff_m).toBeCloseTo(1.0, 6);
  });
});

describe("grade e limites", () => {
  it("conta colunas e fileiras por divisão inteira", () => {
    const g = gridCount(11.4, 7.4, 1.98, 1.0);
    expect(g.n_cols).toBe(5);
    expect(g.n_rows).toBe(7);
    expect(g.n_modules).toBe(35);
  });

  it("aplica o limite de cobertura", () => {
    expect(applyCoverageLimit(35, 80)).toBe(28);
    expect(applyCoverageLimit(35, 0)).toBe(0);
  });
});

describe("sol e espaçamento", () => {
  it("elevação de inverno cai com a latitude", () => {
    expect(winterSolarElevation(-23.45)).toBeCloseTo(43.1, 1);
    expect(winterSolarElevation(-30)).toBeLessThan(winterSolarElevation(-10));
  });

  it("passo entre fileiras cresce com o tilt", () => {
    const s0 = computeRowSpacing(1, -23.45, 0);
    const s20 = computeRowSpacing(1, -23.45, 20);
    expect(s0).toBeCloseTo(1, 3);
    expect(s20).toBeGreaterThan(s0);
  });

  it("sombra projetada usa h/tan(elev)", () => {
    expect(projectShadowLength(2, 45)).toBeCloseTo(2, 3);
    expect(projectShadowLength(0, 45)).toBe(0);
  });
});

describe("caso 1 — telhado plano 12 × 8 m, módulo 400 Wp paisagem", () => {
  const r = layoutPlaceModules(
    base({ margemBorda_m: 0.3, fileirasPorBloco: 0, coberturaMax_pct: 80 }),
  );

  it("calcula a grade esperada", () => {
    // útil 11,4 × 7,4 m → 11,4/1,98 = 5 colunas; 7,4/1,00 = 7 fileiras
    expect(r.nColunas).toBe(5);
    expect(r.nFileiras).toBe(7);
    expect(r.nModulosGrade).toBe(35);
  });

  it("respeita o limite de cobertura de 80%", () => {
    // 96 m² × 0,8 / 1,9305 m² = 39 módulos → grade (35) é o gargalo
    expect(r.nModulos).toBe(35);
    expect(r.potencia_kWp).toBeCloseTo(14, 3);
  });

  it("computa área ocupada e cobertura", () => {
    expect(r.areaOcupada_m2).toBeCloseTo(35 * 1.95 * 0.99, 1);
    expect(r.coberturaEfetiva_pct).toBeCloseTo(70.4, 0);
  });

  it("agrupa em strings de 10 módulos", () => {
    expect(r.nStrings).toBe(4);
    expect(r.modulosUltimaString).toBe(5);
  });
});

describe("corredores de manutenção", () => {
  it("reduzem o número de fileiras", () => {
    const semCorredor = layoutPlaceModules(base({ fileirasPorBloco: 0 }));
    const comCorredor = layoutPlaceModules(base({ fileirasPorBloco: 2, corredorManutencao_m: 0.6 }));
    expect(comCorredor.nFileiras).toBeLessThan(semCorredor.nFileiras);
    expect(comCorredor.corredores.length).toBeGreaterThan(0);
  });
});

describe("obstáculos e sombras", () => {
  const r = layoutPlaceModules(
    base({
      fileirasPorBloco: 0,
      obstaculos: [
        { id: "o1", label: "Chaminé", x_m: 1, y_m: 1, largura_m: 1, profundidade_m: 1, altura_m: 2 },
      ],
    }),
  );

  it("exclui módulos sob o obstáculo e sob a sombra", () => {
    expect(r.excluidos.some((e) => e.motivo === "obstaculo")).toBe(true);
    expect(r.excluidos.some((e) => e.motivo === "sombra")).toBe(true);
    expect(r.nModulos).toBeLessThan(35);
  });

  it("emite aviso sobre análise 3D", () => {
    expect(r.avisos.join(" ")).toMatch(/3D/);
  });
});

describe("alvo do usuário", () => {
  it("limita pela potência alvo", () => {
    const r = layoutPlaceModules(base({ fileirasPorBloco: 0, alvoPotencia_kWp: 4 }));
    expect(r.nModulos).toBe(10);
    expect(r.potencia_kWp).toBeCloseTo(4, 3);
  });

  it("limita pelo número de módulos", () => {
    const r = layoutPlaceModules(base({ fileirasPorBloco: 0, alvoModulos: 12 }));
    expect(r.nModulos).toBe(12);
  });
});

describe("sugestão de tilt/azimute", () => {
  it("hemisfério sul aponta para o Norte", () => {
    const s = suggestTiltOrientation(-23.55, undefined, "telhado-plano");
    expect(s.azimute_deg).toBe(0);
    expect(s.tilt_deg).toBe(24);
  });

  it("telhado inclinado adota o tilt do telhado", () => {
    const s = suggestTiltOrientation(-15, 27, "telhado-inclinado");
    expect(s.tilt_deg).toBe(27);
  });
});

describe("export CSV", () => {
  it("inclui uma linha por módulo e o resumo", () => {
    const r = layoutPlaceModules(base({ fileirasPorBloco: 0 }));
    const csv = exportLayoutCSV(r);
    const linhas = csv.split("\n");
    expect(linhas[0]).toContain("module_id");
    expect(linhas.filter((l) => l.startsWith("M")).length).toBe(r.nModulos);
    expect(csv).toContain("potencia_kWp");
  });
});
