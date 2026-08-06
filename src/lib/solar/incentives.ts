/**
 * Incentivos e subsídios regionais para geração fotovoltaica.
 *
 * Funções puras de lookup, validação de elegibilidade e aplicação do impacto
 * financeiro sobre uma estimativa (CAPEX/OPEX/produção/tarifa). A base de dados
 * é versionada em `content/energia-solar/incentivos/presets.json`.
 *
 * IMPORTANTE (ética de dados): nenhum incentivo deve ser apresentado como
 * vigente sem `source.url` e `last_checked_date`. Registros com
 * `confidence: "baixa"` são placeholders de curadoria.
 */
import rawDB from "../../../content/energia-solar/incentivos/presets.json";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export type IncentiveScope = "federal" | "estadual" | "municipal" | "concessionaria";

export type IncentiveType =
  | "subsidy"
  | "tax_credit"
  | "rebate"
  | "net_metering_bonus"
  | "tariff_discount"
  | "financing_rate"
  | "feed_in_tariff"
  | "grant"
  | "accelerated_depreciation"
  | "exemption_icms"
  | "funding_program";

export type Confidence = "alta" | "media" | "baixa";

export type ClasseConsumidor =
  | "residencial"
  | "comercial"
  | "industrial"
  | "rural"
  | "condominio";

export type ImpactModel =
  | { kind: "direct_capex_discount"; percent: number; ceiling_R?: number | null }
  | { kind: "rebate_fixed"; amount_R: number }
  | { kind: "icms_exemption"; aliquota_icms_pct: number; percent: number; years: number }
  | {
      kind: "financing_rate";
      rate_annual_pct: number;
      subsidy_rate_delta_pp: number;
      term_years: number;
    }
  | { kind: "net_metering_bonus"; extra_credit_percent: number }
  | { kind: "tariff_discount"; percent: number }
  | { kind: "tax_credit"; percent_capex: number; years: number }
  | { kind: "opex_reduction_fixed"; amount_R_per_year: number; years: number };

export interface IncentiveEligibility {
  classes: ClasseConsumidor[];
  ufs?: string[];
  kwp_min?: number;
  kwp_max?: number;
  documentos: string[];
  observacoes?: string;
  teto_por_beneficiario_R?: number;
}

export interface IncentiveSource {
  organization: string;
  url: string;
  doc_reference: string;
  last_checked_date: string;
}

export interface Incentive {
  id: string;
  scope: IncentiveScope;
  uf?: string;
  municipio?: string;
  distribuidora?: string;
  title: string;
  type: IncentiveType;
  description: string;
  details: string;
  impact_model: ImpactModel;
  eligibility: IncentiveEligibility;
  validity: { start_date: string | null; end_date: string | null };
  source: IncentiveSource;
  confidence: Confidence;
  exclusive_group?: string;
  notes?: string;
}

export interface IncentiveDB {
  version: string;
  generated_at: string;
  curator: string;
  review_cycle_months: number;
  disclaimer: string;
  incentives: Incentive[];
}

/** Estimativa simplificada do projeto usada para calcular o impacto. */
export interface Estimate {
  uf: string;
  municipio: string;
  classe: ClasseConsumidor;
  potencia_kWp: number;
  capex_R: number;
  opexAnual_R: number;
  producaoAnual_kWh: number;
  tarifa_RporkWh: number;
  /** Data prevista de instalação (ISO yyyy-mm-dd) usada para checar vigência. */
  dataInstalacao: string;
}

export interface IncentiveImpact {
  id: string;
  title: string;
  capex_delta_R: number;
  opex_delta_R_por_ano: number;
  receita_delta_R_por_ano: number;
  beneficio_total_R: number;
  formula: string;
  notes: string[];
}

export interface EligibilityCheck {
  eligible: boolean;
  reasons: string[];
  warnings: string[];
}

export interface AppliedEstimate {
  antes: {
    capex_R: number;
    opexAnual_R: number;
    receitaAnual_R: number;
    liquidoAnual_R: number;
    payback_anos: number | null;
  };
  depois: {
    capex_R: number;
    opexAnual_R: number;
    receitaAnual_R: number;
    liquidoAnual_R: number;
    payback_anos: number | null;
  };
  impactos: IncentiveImpact[];
  conflitos: string[];
  avisos: string[];
}

// ---------------------------------------------------------------------------
// Utilitários numéricos
// ---------------------------------------------------------------------------

const safe = (n: unknown, fallback = 0): number =>
  typeof n === "number" && Number.isFinite(n) ? n : fallback;

const r2 = (n: number): number => Math.round(n * 100) / 100;

// ---------------------------------------------------------------------------
// Base de dados
// ---------------------------------------------------------------------------

/** Carrega a base versionada de incentivos (import estático, sem I/O). */
export function loadIncentivesDB(): IncentiveDB {
  return rawDB as unknown as IncentiveDB;
}

export const INCENTIVES_DB: IncentiveDB = loadIncentivesDB();

/** Faixas de CEP por UF (primeiros 5 dígitos, inclusivas). */
const CEP_RANGES: ReadonlyArray<[number, number, string]> = [
  [1000, 19999, "SP"],
  [20000, 28999, "RJ"],
  [29000, 29999, "ES"],
  [30000, 39999, "MG"],
  [40000, 48999, "BA"],
  [49000, 49999, "SE"],
  [50000, 56999, "PE"],
  [57000, 57999, "AL"],
  [58000, 58999, "PB"],
  [59000, 59999, "RN"],
  [60000, 63999, "CE"],
  [64000, 64999, "PI"],
  [65000, 65999, "MA"],
  [66000, 68899, "PA"],
  [68900, 68999, "AP"],
  [69000, 69299, "AM"],
  [69300, 69399, "RR"],
  [69400, 69899, "AM"],
  [69900, 69999, "AC"],
  [70000, 72799, "DF"],
  [72800, 72999, "GO"],
  [73000, 73699, "DF"],
  [73700, 76799, "GO"],
  [76800, 76999, "RO"],
  [77000, 77999, "TO"],
  [78000, 78899, "MT"],
  [79000, 79999, "MS"],
  [80000, 87999, "PR"],
  [88000, 89999, "SC"],
  [90000, 99999, "RS"],
];

/** Normaliza um CEP para 8 dígitos; retorna null se inválido. */
export function normalizeCEP(cep: string): string | null {
  const digits = (cep ?? "").replace(/\D/g, "");
  return digits.length === 8 ? digits : null;
}

/** Descobre a UF a partir de um CEP brasileiro. */
export function ufFromCEP(cep: string): string | null {
  const norm = normalizeCEP(cep);
  if (!norm) return null;
  const prefix = Number(norm.slice(0, 5));
  const hit = CEP_RANGES.find(([min, max]) => prefix >= min && prefix <= max);
  return hit ? hit[2] : null;
}

function withinValidity(inc: Incentive, isoDate: string): boolean {
  const d = isoDate || new Date().toISOString().slice(0, 10);
  const { start_date, end_date } = inc.validity;
  if (start_date && d < start_date) return false;
  if (end_date && d > end_date) return false;
  return true;
}

/**
 * Retorna os incentivos aplicáveis à localidade. Federais valem em todo o país;
 * estaduais exigem UF correspondente; municipais/concessionária são incluídos
 * quando genéricos (sem município definido) ou quando o município coincide.
 */
export function fetchIncentivesForLocation(
  uf: string,
  municipio?: string,
  cep?: string,
): Incentive[] {
  const targetUF = (uf || (cep ? (ufFromCEP(cep) ?? "") : "")).toUpperCase();
  const mun = (municipio ?? "").trim().toLowerCase();

  return INCENTIVES_DB.incentives.filter((inc) => {
    if (inc.scope === "federal") {
      const ufs = inc.eligibility.ufs;
      return !ufs || ufs.length === 0 || ufs.includes(targetUF);
    }
    if (inc.scope === "estadual") return (inc.uf ?? "").toUpperCase() === targetUF;
    if (inc.uf && inc.uf.toUpperCase() !== targetUF) return false;
    if (inc.municipio) return inc.municipio.trim().toLowerCase() === mun;
    return true;
  });
}

// ---------------------------------------------------------------------------
// Elegibilidade
// ---------------------------------------------------------------------------

export function validateIncentiveEligibility(
  estimate: Estimate,
  incentive: Incentive,
): EligibilityCheck {
  const reasons: string[] = [];
  const warnings: string[] = [];
  const e = incentive.eligibility;

  if (!e.classes.includes(estimate.classe)) {
    reasons.push(
      `Classe "${estimate.classe}" não atendida (aceitas: ${e.classes.join(", ")}).`,
    );
  }
  const kwp = safe(estimate.potencia_kWp);
  if (typeof e.kwp_min === "number" && kwp < e.kwp_min) {
    reasons.push(`Potência mínima de ${e.kwp_min} kWp não atingida.`);
  }
  if (typeof e.kwp_max === "number" && kwp > e.kwp_max) {
    reasons.push(`Potência acima do limite de ${e.kwp_max} kWp do programa.`);
  }
  if (e.ufs && e.ufs.length > 0 && !e.ufs.includes(estimate.uf.toUpperCase())) {
    reasons.push(`Programa restrito às UFs: ${e.ufs.join(", ")}.`);
  }
  if (!withinValidity(incentive, estimate.dataInstalacao)) {
    reasons.push("Data de instalação fora do período de vigência informado.");
  }
  if (incentive.confidence === "baixa") {
    warnings.push(
      "Registro com confiança baixa (placeholder). Confirme a norma oficial antes de usar comercialmente.",
    );
  }
  if (incentive.validity.start_date === null && incentive.validity.end_date === null) {
    warnings.push("Vigência não informada na fonte — confirme antes de contratar.");
  }
  if (e.observacoes) warnings.push(e.observacoes);

  return { eligible: reasons.length === 0, reasons, warnings };
}

// ---------------------------------------------------------------------------
// Impacto financeiro
// ---------------------------------------------------------------------------

/**
 * Calcula o impacto de um incentivo isolado sobre a estimativa.
 * Convenção de sinais: `capex_delta_R` e `opex_delta_R_por_ano` são negativos
 * quando representam economia; `receita_delta_R_por_ano` é positivo quando
 * representa ganho anual.
 */
export function computeIncentiveImpact(
  estimate: Estimate,
  incentive: Incentive,
): IncentiveImpact {
  const m = incentive.impact_model;
  const capex = Math.max(0, safe(estimate.capex_R));
  const receita = Math.max(0, safe(estimate.producaoAnual_kWh)) *
    Math.max(0, safe(estimate.tarifa_RporkWh));

  let capexDelta = 0;
  let opexDelta = 0;
  let receitaDelta = 0;
  let formula = "";
  const notes: string[] = [];

  switch (m.kind) {
    case "direct_capex_discount": {
      const bruto = capex * (safe(m.percent) / 100);
      const teto = typeof m.ceiling_R === "number" ? m.ceiling_R : null;
      const desconto = teto !== null ? Math.min(bruto, teto) : bruto;
      capexDelta = -desconto;
      formula =
        `CAPEX ${r2(capex)} × ${m.percent}% = ${r2(bruto)}` +
        (teto !== null ? ` → min(${r2(bruto)}; teto ${r2(teto)}) = ${r2(desconto)}` : "");
      if (teto !== null && bruto > teto) notes.push("Teto do programa aplicado.");
      break;
    }
    case "rebate_fixed": {
      const valor = Math.min(Math.max(0, safe(m.amount_R)), capex);
      capexDelta = -valor;
      formula = `Rebate fixo de R$ ${r2(safe(m.amount_R))} (limitado ao CAPEX de ${r2(capex)})`;
      break;
    }
    case "icms_exemption": {
      const isento = receita * (safe(m.aliquota_icms_pct) / 100) * (safe(m.percent) / 100);
      receitaDelta = isento;
      formula = `Receita ${r2(receita)} × ICMS ${m.aliquota_icms_pct}% × isenção ${m.percent}% = ${r2(isento)}/ano`;
      notes.push(`Benefício considerado por ${m.years} ano(s).`);
      break;
    }
    case "financing_rate": {
      const delta = Math.abs(safe(m.subsidy_rate_delta_pp)) / 100;
      // Saldo devedor médio de uma amortização linear ≈ 50% do principal.
      const economiaAno = capex * delta * 0.5;
      opexDelta = -economiaAno;
      formula = `CAPEX ${r2(capex)} × Δtaxa ${Math.abs(safe(m.subsidy_rate_delta_pp))} p.p. × 0,5 (saldo médio) = ${r2(economiaAno)}/ano`;
      notes.push(
        `Economia de juros ao longo de ${m.term_years} anos, assumindo financiamento de 100% do CAPEX.`,
      );
      break;
    }
    case "net_metering_bonus": {
      const ganho = receita * (safe(m.extra_credit_percent) / 100);
      receitaDelta = ganho;
      formula = `Receita ${r2(receita)} × bônus ${m.extra_credit_percent}% = ${r2(ganho)}/ano`;
      break;
    }
    case "tariff_discount": {
      const ganho = receita * (safe(m.percent) / 100);
      receitaDelta = ganho;
      formula = `Receita ${r2(receita)} × desconto tarifário ${m.percent}% = ${r2(ganho)}/ano`;
      break;
    }
    case "tax_credit": {
      const anual = (capex * (safe(m.percent_capex) / 100)) / Math.max(1, safe(m.years, 1));
      opexDelta = -anual;
      formula = `CAPEX ${r2(capex)} × ${m.percent_capex}% ÷ ${m.years} anos = ${r2(anual)}/ano`;
      break;
    }
    case "opex_reduction_fixed": {
      opexDelta = -Math.max(0, safe(m.amount_R_per_year));
      formula = `Redução fixa de R$ ${r2(Math.max(0, safe(m.amount_R_per_year)))}/ano por ${m.years} ano(s)`;
      break;
    }
  }

  return {
    id: incentive.id,
    title: incentive.title,
    capex_delta_R: r2(capexDelta),
    opex_delta_R_por_ano: r2(opexDelta),
    receita_delta_R_por_ano: r2(receitaDelta),
    beneficio_total_R: r2(-capexDelta + -opexDelta + receitaDelta),
    formula,
    notes,
  };
}

/** Ordem lógica de aplicação: subvenções de CAPEX → rebates → fiscais → financiamento. */
const ORDER: Record<ImpactModel["kind"], number> = {
  direct_capex_discount: 0,
  rebate_fixed: 1,
  icms_exemption: 2,
  tax_credit: 3,
  net_metering_bonus: 4,
  tariff_discount: 5,
  opex_reduction_fixed: 6,
  financing_rate: 7,
};

function payback(capex: number, liquido: number): number | null {
  return liquido > 0 ? r2(capex / liquido) : null;
}

/**
 * Aplica um conjunto de incentivos à estimativa, respeitando grupos mutuamente
 * exclusivos (mantém o de maior benefício) e a ordem lógica de aplicação.
 */
export function applyIncentiveToEstimate(
  estimate: Estimate,
  incentives: Incentive[],
): AppliedEstimate {
  const conflitos: string[] = [];
  const avisos: string[] = [];

  const elegiveis = incentives.filter((inc) => {
    const check = validateIncentiveEligibility(estimate, inc);
    check.warnings.forEach((w) => avisos.push(`${inc.title}: ${w}`));
    if (!check.eligible) {
      conflitos.push(`${inc.title}: ${check.reasons.join(" ")}`);
      return false;
    }
    return true;
  });

  // Resolve exclusividade mantendo o de maior benefício estimado.
  const porGrupo = new Map<string, Incentive>();
  const selecionados: Incentive[] = [];
  for (const inc of elegiveis) {
    if (!inc.exclusive_group) {
      selecionados.push(inc);
      continue;
    }
    const atual = porGrupo.get(inc.exclusive_group);
    if (!atual) {
      porGrupo.set(inc.exclusive_group, inc);
      continue;
    }
    const a = computeIncentiveImpact(estimate, atual).beneficio_total_R;
    const b = computeIncentiveImpact(estimate, inc).beneficio_total_R;
    const vencedor = b > a ? inc : atual;
    const perdedor = b > a ? atual : inc;
    porGrupo.set(inc.exclusive_group, vencedor);
    conflitos.push(
      `"${perdedor.title}" é mutuamente exclusivo com "${vencedor.title}" (grupo ${inc.exclusive_group}); mantido apenas o de maior benefício.`,
    );
  }
  selecionados.push(...porGrupo.values());
  selecionados.sort((x, y) => ORDER[x.impact_model.kind] - ORDER[y.impact_model.kind]);

  const capex0 = Math.max(0, safe(estimate.capex_R));
  const opex0 = Math.max(0, safe(estimate.opexAnual_R));
  const receita0 = r2(
    Math.max(0, safe(estimate.producaoAnual_kWh)) * Math.max(0, safe(estimate.tarifa_RporkWh)),
  );

  let capex = capex0;
  let opex = opex0;
  let receita = receita0;
  const impactos: IncentiveImpact[] = [];

  for (const inc of selecionados) {
    // Recalcula sobre o estado corrente para respeitar a ordem de aplicação.
    const parcial: Estimate = {
      ...estimate,
      capex_R: capex,
      opexAnual_R: opex,
    };
    const impacto = computeIncentiveImpact(parcial, inc);
    impactos.push(impacto);
    capex = Math.max(0, r2(capex + impacto.capex_delta_R));
    opex = Math.max(0, r2(opex + impacto.opex_delta_R_por_ano));
    receita = r2(receita + impacto.receita_delta_R_por_ano);
  }

  const liquido0 = r2(receita0 - opex0);
  const liquido1 = r2(receita - opex);

  return {
    antes: {
      capex_R: r2(capex0),
      opexAnual_R: r2(opex0),
      receitaAnual_R: receita0,
      liquidoAnual_R: liquido0,
      payback_anos: payback(capex0, liquido0),
    },
    depois: {
      capex_R: r2(capex),
      opexAnual_R: r2(opex),
      receitaAnual_R: receita,
      liquidoAnual_R: liquido1,
      payback_anos: payback(capex, liquido1),
    },
    impactos,
    conflitos,
    avisos,
  };
}

// ---------------------------------------------------------------------------
// Exportação de relatório
// ---------------------------------------------------------------------------

export function exportIncentivesReportJSON(
  estimate: Estimate,
  aplicados: Incentive[],
  resultado: AppliedEstimate,
): string {
  return JSON.stringify(
    {
      gerado_em: new Date().toISOString(),
      ferramenta: "ObraMétrica — Calculadora de Incentivos / Subsídios Regionais",
      dataset_version: INCENTIVES_DB.version,
      disclaimer: INCENTIVES_DB.disclaimer,
      estimativa: estimate,
      resultado,
      incentivos: aplicados.map((i) => ({
        id: i.id,
        titulo: i.title,
        escopo: i.scope,
        tipo: i.type,
        vigencia: i.validity,
        confianca: i.confidence,
        fonte: i.source,
        documentos: i.eligibility.documentos,
      })),
    },
    null,
    2,
  );
}

const csvCell = (v: string | number): string => `"${String(v).replace(/"/g, '""')}"`;

export function exportIncentivesReportCSV(
  aplicados: Incentive[],
  resultado: AppliedEstimate,
): string {
  const linhas: string[] = [];
  linhas.push(
    [
      "id",
      "titulo",
      "escopo",
      "tipo",
      "delta_capex_R",
      "delta_opex_ano_R",
      "delta_receita_ano_R",
      "beneficio_total_R",
      "formula",
      "confianca",
      "fonte",
      "url",
      "verificado_em",
      "documentos",
    ]
      .map(csvCell)
      .join(","),
  );

  for (const inc of aplicados) {
    const imp = resultado.impactos.find((i) => i.id === inc.id);
    linhas.push(
      [
        inc.id,
        inc.title,
        inc.scope,
        inc.type,
        imp?.capex_delta_R ?? 0,
        imp?.opex_delta_R_por_ano ?? 0,
        imp?.receita_delta_R_por_ano ?? 0,
        imp?.beneficio_total_R ?? 0,
        imp?.formula ?? "",
        inc.confidence,
        inc.source.organization,
        inc.source.url,
        inc.source.last_checked_date,
        inc.eligibility.documentos.join(" | "),
      ]
        .map(csvCell)
        .join(","),
    );
  }

  linhas.push("");
  linhas.push([csvCell("indicador"), csvCell("antes"), csvCell("depois")].join(","));
  linhas.push(
    [
      csvCell("CAPEX (R$)"),
      csvCell(resultado.antes.capex_R),
      csvCell(resultado.depois.capex_R),
    ].join(","),
  );
  linhas.push(
    [
      csvCell("OPEX anual (R$)"),
      csvCell(resultado.antes.opexAnual_R),
      csvCell(resultado.depois.opexAnual_R),
    ].join(","),
  );
  linhas.push(
    [
      csvCell("Receita anual (R$)"),
      csvCell(resultado.antes.receitaAnual_R),
      csvCell(resultado.depois.receitaAnual_R),
    ].join(","),
  );
  linhas.push(
    [
      csvCell("Payback (anos)"),
      csvCell(resultado.antes.payback_anos ?? "—"),
      csvCell(resultado.depois.payback_anos ?? "—"),
    ].join(","),
  );

  return linhas.join("\n");
}

export const UFS: ReadonlyArray<string> = [
  "AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MG", "MS", "MT",
  "PA", "PB", "PE", "PI", "PR", "RJ", "RN", "RO", "RR", "RS", "SC", "SE", "SP", "TO",
];

export const DEFAULT_ESTIMATE: Estimate = {
  uf: "SP",
  municipio: "São Paulo",
  classe: "residencial",
  potencia_kWp: 5,
  capex_R: 22000,
  opexAnual_R: 600,
  producaoAnual_kWh: 7300,
  tarifa_RporkWh: 0.95,
  dataInstalacao: "2026-09-01",
};

export default {
  loadIncentivesDB,
  fetchIncentivesForLocation,
  computeIncentiveImpact,
  applyIncentiveToEstimate,
  validateIncentiveEligibility,
};
