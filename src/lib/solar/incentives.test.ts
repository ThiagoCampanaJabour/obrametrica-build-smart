import { describe, expect, it } from "vitest";
import {
  DEFAULT_ESTIMATE,
  INCENTIVES_DB,
  applyIncentiveToEstimate,
  computeIncentiveImpact,
  fetchIncentivesForLocation,
  normalizeCEP,
  ufFromCEP,
  validateIncentiveEligibility,
  exportIncentivesReportCSV,
  type Estimate,
  type Incentive,
} from "./incentives";

const base = (over: Partial<Estimate> = {}): Estimate => ({ ...DEFAULT_ESTIMATE, ...over });

const mk = (over: Partial<Incentive>): Incentive => ({
  id: "test",
  scope: "estadual",
  uf: "SP",
  title: "Teste",
  type: "subsidy",
  description: "d",
  details: "d",
  impact_model: { kind: "direct_capex_discount", percent: 20, ceiling_R: 10000 },
  eligibility: { classes: ["residencial"], kwp_min: 0, kwp_max: 100, documentos: [] },
  validity: { start_date: "2020-01-01", end_date: "2030-12-31" },
  source: { organization: "o", url: "u", doc_reference: "r", last_checked_date: "2026-07-15" },
  confidence: "alta",
  ...over,
});

describe("CEP", () => {
  it("normaliza e rejeita inválidos", () => {
    expect(normalizeCEP("01310-100")).toBe("01310100");
    expect(normalizeCEP("123")).toBeNull();
  });
  it("mapeia UF", () => {
    expect(ufFromCEP("01310100")).toBe("SP");
    expect(ufFromCEP("90010-000")).toBe("RS");
    expect(ufFromCEP("70000-000")).toBe("DF");
    expect(ufFromCEP("40010-000")).toBe("BA");
  });
});

describe("lookup", () => {
  it("inclui federais e estaduais da UF", () => {
    const sp = fetchIncentivesForLocation("SP", "São Paulo");
    expect(sp.some((i) => i.id === "sp-icms-energia-injetada")).toBe(true);
    expect(sp.some((i) => i.id === "mg-icms-energia-injetada")).toBe(false);
    expect(sp.some((i) => i.scope === "federal")).toBe(true);
  });
  it("respeita restrição de UF em programa federal regional", () => {
    const sp = fetchIncentivesForLocation("SP", "São Paulo");
    const ba = fetchIncentivesForLocation("BA", "Salvador");
    expect(sp.some((i) => i.id === "fed-fne-sol")).toBe(false);
    expect(ba.some((i) => i.id === "fed-fne-sol")).toBe(true);
  });
  it("a base tem versão e fontes em todos os registros", () => {
    expect(INCENTIVES_DB.version).toBeTruthy();
    for (const inc of INCENTIVES_DB.incentives) {
      expect(inc.source.url).toMatch(/^https?:\/\//);
      expect(inc.source.last_checked_date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});

describe("computeIncentiveImpact", () => {
  it("desconto de CAPEX respeita o teto", () => {
    const imp = computeIncentiveImpact(base({ capex_R: 100000 }), mk({}));
    expect(imp.capex_delta_R).toBe(-10000);
    expect(imp.formula).toContain("teto");
  });
  it("desconto de CAPEX sem atingir teto", () => {
    const imp = computeIncentiveImpact(base({ capex_R: 22000 }), mk({}));
    expect(imp.capex_delta_R).toBe(-4400);
  });
  it("rebate fixo é limitado ao CAPEX", () => {
    const imp = computeIncentiveImpact(
      base({ capex_R: 1000 }),
      mk({ impact_model: { kind: "rebate_fixed", amount_R: 5000 } }),
    );
    expect(imp.capex_delta_R).toBe(-1000);
  });
  it("isenção de ICMS vira receita anual", () => {
    const imp = computeIncentiveImpact(
      base({ producaoAnual_kWh: 10000, tarifa_RporkWh: 1 }),
      mk({ impact_model: { kind: "icms_exemption", aliquota_icms_pct: 18, percent: 100, years: 5 } }),
    );
    expect(imp.receita_delta_R_por_ano).toBe(1800);
  });
  it("financiamento subsidiado gera economia anual pelo saldo médio", () => {
    const imp = computeIncentiveImpact(
      base({ capex_R: 100000 }),
      mk({
        impact_model: {
          kind: "financing_rate",
          rate_annual_pct: 12,
          subsidy_rate_delta_pp: -2,
          term_years: 10,
        },
      }),
    );
    expect(imp.opex_delta_R_por_ano).toBe(-1000);
  });
  it("crédito fiscal distribui ao longo dos anos", () => {
    const imp = computeIncentiveImpact(
      base({ capex_R: 60000 }),
      mk({ impact_model: { kind: "tax_credit", percent_capex: 6, years: 3 } }),
    );
    expect(imp.opex_delta_R_por_ano).toBe(-1200);
  });
});

describe("elegibilidade", () => {
  it("bloqueia classe fora do escopo", () => {
    const r = validateIncentiveEligibility(base({ classe: "industrial" }), mk({}));
    expect(r.eligible).toBe(false);
    expect(r.reasons[0]).toContain("Classe");
  });
  it("bloqueia potência acima do teto", () => {
    const r = validateIncentiveEligibility(base({ potencia_kWp: 500 }), mk({}));
    expect(r.eligible).toBe(false);
  });
  it("bloqueia fora da vigência", () => {
    const r = validateIncentiveEligibility(base({ dataInstalacao: "2031-01-01" }), mk({}));
    expect(r.eligible).toBe(false);
  });
  it("avisa em registro placeholder", () => {
    const r = validateIncentiveEligibility(base(), mk({ confidence: "baixa" }));
    expect(r.warnings.join(" ")).toContain("confiança baixa");
  });
});

describe("applyIncentiveToEstimate", () => {
  it("cenário 1: subvenção 20% (teto 10k) + isenção ICMS reduz payback", () => {
    const est = base({ capex_R: 25000, opexAnual_R: 600, producaoAnual_kWh: 7300, tarifa_RporkWh: 1 });
    const r = applyIncentiveToEstimate(est, [
      mk({ id: "sub", impact_model: { kind: "direct_capex_discount", percent: 20, ceiling_R: 10000 } }),
      mk({
        id: "icms",
        impact_model: { kind: "icms_exemption", aliquota_icms_pct: 18, percent: 100, years: 5 },
      }),
    ]);
    expect(r.depois.capex_R).toBe(20000);
    expect(r.depois.receitaAnual_R).toBe(8614);
    expect(r.antes.payback_anos).not.toBeNull();
    expect(r.depois.payback_anos!).toBeLessThan(r.antes.payback_anos!);
  });

  it("cenário 2: desconto de 1 p.p. no financiamento melhora o fluxo", () => {
    const est = base({ potencia_kWp: 50, capex_R: 180000, classe: "comercial" });
    const r = applyIncentiveToEstimate(est, [
      mk({
        id: "fin",
        eligibility: { classes: ["comercial"], kwp_min: 0, kwp_max: 1000, documentos: [] },
        impact_model: {
          kind: "financing_rate",
          rate_annual_pct: 12,
          subsidy_rate_delta_pp: -1,
          term_years: 10,
        },
      }),
    ]);
    expect(r.depois.opexAnual_R).toBe(Math.max(0, est.opexAnual_R - 900));
    expect(r.depois.liquidoAnual_R).toBeGreaterThan(r.antes.liquidoAnual_R);
  });

  it("cenário 3: incentivos mutuamente exclusivos não somam", () => {
    const est = base({ capex_R: 30000 });
    const r = applyIncentiveToEstimate(est, [
      mk({
        id: "a",
        exclusive_group: "capex",
        impact_model: { kind: "direct_capex_discount", percent: 10, ceiling_R: null },
      }),
      mk({
        id: "b",
        exclusive_group: "capex",
        impact_model: { kind: "direct_capex_discount", percent: 20, ceiling_R: null },
      }),
    ]);
    expect(r.impactos).toHaveLength(1);
    expect(r.depois.capex_R).toBe(24000);
    expect(r.conflitos.join(" ")).toContain("mutuamente exclusivo");
  });

  it("incentivo inelegível é reportado e não aplicado", () => {
    const r = applyIncentiveToEstimate(base({ classe: "industrial" }), [mk({})]);
    expect(r.impactos).toHaveLength(0);
    expect(r.conflitos).toHaveLength(1);
    expect(r.depois.capex_R).toBe(r.antes.capex_R);
  });

  it("sem incentivos, antes e depois coincidem", () => {
    const r = applyIncentiveToEstimate(base(), []);
    expect(r.depois).toEqual(r.antes);
  });

  it("CSV inclui fonte e documentos", () => {
    const inc = mk({ eligibility: { classes: ["residencial"], documentos: ["ART"], kwp_max: 100 } });
    const r = applyIncentiveToEstimate(base(), [inc]);
    const csv = exportIncentivesReportCSV([inc], r);
    expect(csv).toContain("ART");
    expect(csv).toContain("Payback (anos)");
  });
});
