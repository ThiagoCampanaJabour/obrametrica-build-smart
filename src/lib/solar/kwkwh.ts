/**
 * Conversor kW (kWp instalado) ↔ kWh (produção anual estimada).
 *
 * Todas as funções são puras e determinísticas — nenhuma dependência de DOM,
 * rede ou estado global — para permitir teste unitário direto.
 *
 * Modelo adotado (MVP, base anual):
 *   Energia_ano [kWh] = Potência [kWp] × Fator [kWh/kWp/ano] × (1 − perdas)
 * onde o "fator" é o specific yield já observado em campo ou derivado de
 * horas equivalentes de sol (HE) multiplicadas pelo Performance Ratio (PR).
 *
 * ATENÇÃO: o fator anual de presets já embute condições médias do local. Se o
 * usuário informar um fator medido em campo (que já contém perdas), aplicar
 * perdas novamente causa dupla contagem — a UI deve deixar isso explícito.
 */

/* ------------------------------------------------------------------ */
/* Tipos                                                               */
/* ------------------------------------------------------------------ */

export interface EnergyBreakdown {
  /** Energia bruta antes das perdas sistêmicas: kWp × fator. */
  base_energy_kwh: number;
  /** Energia descontada pelas perdas sistêmicas. */
  losses_kwh: number;
  /** Performance Ratio efetivo (1 − perdas). */
  pr: number;
  /** Fator de produção efetivamente utilizado (kWh/kWp/ano). */
  factor_kwh_per_kwp: number;
}

export interface EnergyFromPowerResult {
  energy_kwh: number;
  /** Produção média mensal (simples divisão por 12, sem sazonalidade). */
  energy_month_kwh: number;
  breakdown: EnergyBreakdown;
  avisos: string[];
}

export interface ModuleSuggestion {
  /** Quantidade de módulos, já incluindo a margem de reserva. */
  qty: number;
  /** Quantidade adicional atribuída à margem de reserva. */
  spare_qty: number;
  module_power_W: number;
  /** Potência real instalada com a quantidade sugerida. */
  kWp_instalado: number;
}

export interface PowerFromEnergyResult {
  kWp_required: number;
  /** Potência arredondada para 1 casa decimal, útil em propostas. */
  kWp_sugerido: number;
  modules_suggested: ModuleSuggestion;
  breakdown: EnergyBreakdown;
  avisos: string[];
}

export interface SensitivityRow {
  label: string;
  factor_kwh_per_kwp: number;
  losses_pct: number;
  value: number;
}

/* ------------------------------------------------------------------ */
/* Constantes                                                          */
/* ------------------------------------------------------------------ */

/** Perda sistêmica padrão (PR = 0,86). */
export const DEFAULT_LOSSES_PCT = 14;

/** Faixa plausível de specific yield no Brasil (kWh/kWp/ano). */
export const FACTOR_MIN_PLAUSIVEL = 800;
export const FACTOR_MAX_PLAUSIVEL = 2200;

/* ------------------------------------------------------------------ */
/* Helpers internos                                                    */
/* ------------------------------------------------------------------ */

/** Converte entradas possivelmente inválidas em número finito não negativo. */
function sane(value: number, fallback = 0): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return value < 0 ? 0 : value;
}

/** Limita as perdas ao intervalo [0, 95] % — 100% zeraria a divisão inversa. */
function clampLosses(losses_pct: number): number {
  const v = sane(losses_pct, DEFAULT_LOSSES_PCT);
  return Math.min(v, 95);
}

function factorWarnings(factor: number, avisos: string[]): void {
  if (factor <= 0) {
    avisos.push("Fator de produção deve ser maior que zero.");
    return;
  }
  if (factor < FACTOR_MIN_PLAUSIVEL) {
    avisos.push(
      `Fator de ${factor.toFixed(0)} kWh/kWp/ano é atipicamente baixo para o Brasil (típico: ${FACTOR_MIN_PLAUSIVEL}–${FACTOR_MAX_PLAUSIVEL}).`,
    );
  }
  if (factor > FACTOR_MAX_PLAUSIVEL) {
    avisos.push(
      `Fator de ${factor.toFixed(0)} kWh/kWp/ano é otimista demais; revise a premissa (típico: ${FACTOR_MIN_PLAUSIVEL}–${FACTOR_MAX_PLAUSIVEL}).`,
    );
  }
}

/* ------------------------------------------------------------------ */
/* 1) kWp → kWh                                                        */
/* ------------------------------------------------------------------ */

/**
 * Estima a produção anual a partir da potência instalada.
 *
 * @param kWp potência DC instalada em kWp
 * @param factor_kwh_per_kwp specific yield anual do local (kWh/kWp/ano)
 * @param losses_pct perdas sistêmicas em % (0–95)
 */
export function energyFromPower(
  kWp: number,
  factor_kwh_per_kwp: number,
  losses_pct: number = DEFAULT_LOSSES_PCT,
): EnergyFromPowerResult {
  const avisos: string[] = [];
  const potencia = sane(kWp);
  const factor = sane(factor_kwh_per_kwp);
  const perdas = clampLosses(losses_pct);

  if (potencia <= 0) avisos.push("Informe uma potência instalada maior que zero.");
  factorWarnings(factor, avisos);

  const pr = 1 - perdas / 100;
  const base_energy_kwh = potencia * factor;
  const energy_kwh = base_energy_kwh * pr;

  return {
    energy_kwh,
    energy_month_kwh: energy_kwh / 12,
    breakdown: {
      base_energy_kwh,
      losses_kwh: base_energy_kwh - energy_kwh,
      pr,
      factor_kwh_per_kwp: factor,
    },
    avisos,
  };
}

/* ------------------------------------------------------------------ */
/* 2) kWh → kWp                                                        */
/* ------------------------------------------------------------------ */

/**
 * Sugere a quantidade de módulos necessária para atingir uma potência alvo,
 * arredondando para cima e acrescentando uma margem de reserva.
 */
export function suggestModuleCount(
  kWp: number,
  module_power_W: number,
  spare_pct = 0,
): ModuleSuggestion {
  const potencia = sane(kWp);
  const pModulo = sane(module_power_W);
  const spare = sane(spare_pct);

  if (pModulo <= 0) {
    return { qty: 0, spare_qty: 0, module_power_W: 0, kWp_instalado: 0 };
  }

  const base = Math.ceil((potencia * 1000) / pModulo);
  const qty = Math.ceil(base * (1 + spare / 100));

  return {
    qty,
    spare_qty: qty - base,
    module_power_W: pModulo,
    kWp_instalado: (qty * pModulo) / 1000,
  };
}

/**
 * Estima a potência necessária para atingir uma meta anual de geração.
 */
export function powerFromEnergy(
  energy_kwh: number,
  factor_kwh_per_kwp: number,
  losses_pct: number = DEFAULT_LOSSES_PCT,
  options: { module_power_W?: number; spare_pct?: number } = {},
): PowerFromEnergyResult {
  const avisos: string[] = [];
  const meta = sane(energy_kwh);
  const factor = sane(factor_kwh_per_kwp);
  const perdas = clampLosses(losses_pct);
  const module_power_W = options.module_power_W ?? 550;
  const spare_pct = options.spare_pct ?? 3;

  if (meta <= 0) avisos.push("Informe uma meta anual de geração maior que zero.");
  factorWarnings(factor, avisos);

  const pr = 1 - perdas / 100;
  const denominador = factor * pr;

  // Guarda explícita: fator zero (ou perdas de 100%) tornaria a divisão infinita.
  const kWp_required = denominador > 0 ? meta / denominador : 0;
  const kWp_sugerido = Math.ceil(kWp_required * 10) / 10;

  return {
    kWp_required,
    kWp_sugerido,
    modules_suggested: suggestModuleCount(kWp_required, module_power_W, spare_pct),
    breakdown: {
      base_energy_kwh: meta / (pr || 1),
      losses_kwh: meta / (pr || 1) - meta,
      pr,
      factor_kwh_per_kwp: factor,
    },
    avisos,
  };
}

/* ------------------------------------------------------------------ */
/* 3) Fator a partir de HE e PR                                        */
/* ------------------------------------------------------------------ */

/**
 * Converte horas equivalentes de sol a pleno sol (HE, h/ano) e Performance
 * Ratio em fator de produção (kWh/kWp/ano).
 *
 * @param he_hours horas equivalentes anuais (ex.: 1700 h/ano)
 * @param pr Performance Ratio como fração (0–1) ou percentual (>1 é tratado como %)
 */
export function factorFromHEandPR(he_hours: number, pr: number): number {
  const he = sane(he_hours);
  let ratio = sane(pr);
  if (ratio > 1) ratio = ratio / 100; // aceita 78 como 0,78
  return he * ratio;
}

/** HE diária (h/dia) → HE anual (h/ano). Conveniência para presets de irradiação. */
export function heAnnualFromDaily(he_daily_hours: number): number {
  return sane(he_daily_hours) * 365;
}

/* ------------------------------------------------------------------ */
/* 4) Ajuste por inclinação e orientação                               */
/* ------------------------------------------------------------------ */

/**
 * Correção heurística do fator de produção para inclinação e azimute
 * diferentes do ótimo. Aproximação de primeira ordem, adequada para
 * pré-dimensionamento — não substitui simulação horária (PVGIS/Meteonorm).
 *
 * Convenção de azimute: 0° = Norte geográfico (ótimo no Hemisfério Sul),
 * 180° = Sul. Latitude negativa indica Hemisfério Sul.
 */
export function adjustFactorForTiltOrientation(
  base_factor: number,
  tilt_deg: number,
  azimuth_deg: number,
  latitude: number,
): number {
  const factor = sane(base_factor);
  if (factor <= 0) return 0;

  const tilt = Math.min(Math.max(sane(tilt_deg), 0), 90);
  const lat = Number.isFinite(latitude) ? Math.abs(latitude) : 20;

  // Inclinação ótima ≈ latitude; penalidade quadrática suave pelo desvio.
  const tiltOtimo = Math.min(Math.max(lat, 10), 35);
  const desvioTilt = Math.abs(tilt - tiltOtimo);
  const perdaTilt = Math.min(0.0009 * desvioTilt * desvioTilt, 0.25);

  // Azimute: desvio angular do Norte, normalizado para 0–180°.
  const azRaw = Number.isFinite(azimuth_deg) ? azimuth_deg : 0;
  let desvioAz = Math.abs(((azRaw % 360) + 360) % 360);
  if (desvioAz > 180) desvioAz = 360 - desvioAz;

  // O impacto do azimute cresce com a inclinação: telhado plano é quase neutro.
  const pesoTilt = Math.min(tilt / 30, 1);
  const perdaAz = Math.min((desvioAz / 180) * 0.35 * pesoTilt, 0.35);

  const resultado = factor * (1 - perdaTilt) * (1 - perdaAz);
  return resultado > 0 ? resultado : 0;
}

/* ------------------------------------------------------------------ */
/* 5) Sensibilidade                                                    */
/* ------------------------------------------------------------------ */

/**
 * Faixa de incerteza do resultado: ±10% no fator e ±5 p.p. nas perdas.
 * Retorna cenário pessimista, central e otimista para a direção escolhida.
 */
export function sensitivityRange(
  mode: "kwp-to-kwh" | "kwh-to-kwp",
  value: number,
  factor_kwh_per_kwp: number,
  losses_pct: number,
): SensitivityRow[] {
  const factor = sane(factor_kwh_per_kwp);
  const perdas = clampLosses(losses_pct);

  const cenarios: Array<{ label: string; f: number; l: number }> = [
    { label: "Conservador", f: factor * 0.9, l: Math.min(perdas + 5, 95) },
    { label: "Central", f: factor, l: perdas },
    { label: "Otimista", f: factor * 1.1, l: Math.max(perdas - 5, 0) },
  ];

  return cenarios.map((c) => ({
    label: c.label,
    factor_kwh_per_kwp: c.f,
    losses_pct: c.l,
    value:
      mode === "kwp-to-kwh"
        ? energyFromPower(value, c.f, c.l).energy_kwh
        : powerFromEnergy(value, c.f, c.l).kWp_required,
  }));
}

/* ------------------------------------------------------------------ */
/* 6) Cálculo alternativo por irradiância e área                       */
/* ------------------------------------------------------------------ */

/**
 * Caminho alternativo quando o usuário conhece a irradiância no plano dos
 * módulos e a área/eficiência do conjunto:
 *   E ≈ Irradiância × Área × Eficiência × PR
 */
export function energyFromIrradiance(
  irradiance_kwh_m2_yr: number,
  module_area_m2: number,
  module_efficiency_pct: number,
  module_count: number,
  losses_pct: number = DEFAULT_LOSSES_PCT,
): number {
  const irr = sane(irradiance_kwh_m2_yr);
  const area = sane(module_area_m2);
  let eff = sane(module_efficiency_pct);
  if (eff > 1) eff = eff / 100; // aceita 21 como 0,21
  const qty = sane(module_count);
  const pr = 1 - clampLosses(losses_pct) / 100;
  return irr * area * eff * qty * pr;
}

export default energyFromPower;
