/**
 * src/lib/solar/pv-economic.ts
 * Funções puras para cálculos econômicos simplificados de sistemas fotovoltaicos.
 * 
 * Observações:
 * - Valores monetários retornados em R$ (mesmo que entradas possam ser unit-less).
 * - Presume-se que factor_kwh_per_kwp_year seja em kWh/kWp/ano.
 * - Funções são puras e testáveis.
 * 
 * Limitações:
 * - Modelos simplificados apropriados para estimativas iniciais. Para análise detalhada
 * recomenda-se cálculo horário e análise NPV/IRR.
 */

export type PVCalculationResult = {
  production_kwh_year: number;
  used_on_site_kwh: number;
  exported_kwh: number;
  avoided_cost_R_per_year: number;
  credit_R_per_year: number;
  annualSavings_R: number;
  payback_years: number | null;
  lcoe_R_per_kwh: number | null;
};

export function energyFromPower(
  kWp: number,
  factor_kwh_per_kwp_year: number,
  losses_pct = 14
): number {
  if (kWp < 0 || factor_kwh_per_kwp_year < 0) {
    throw new Error('Invalid inputs to energyFromPower');
  }
  const lossesFrac = losses_pct / 100;
  return kWp * factor_kwh_per_kwp_year * (1 - lossesFrac);
}

export function calcUsedOnSite(
  production_kwh_year: number,
  overlap_factor = 0.45
): number {
  if (production_kwh_year < 0) throw new Error('production must be >= 0');
  return production_kwh_year * overlap_factor;
}

export function calcExported(
  production_kwh_year: number,
  used_on_site_kwh: number
): number {
  const exported = production_kwh_year - used_on_site_kwh;
  return exported >= 0 ? exported : 0;
}

export function calcAvoidedCost(
  used_on_site_kwh: number,
  tariff_R_per_kwh: number
): number {
  return used_on_site_kwh * tariff_R_per_kwh;
}

export function calcCredit(
  exported_kwh: number,
  credit_rate_R_per_kwh: number
): number {
  return exported_kwh * credit_rate_R_per_kwh;
}

export function calcAnnualSavings(
  used_on_site_kwh: number,
  tariff_R_per_kwh: number,
  exported_kwh: number,
  credit_rate_R_per_kwh: number,
  opex_annual = 0
): number {
  const avoided = calcAvoidedCost(used_on_site_kwh, tariff_R_per_kwh);
  const credit = calcCredit(exported_kwh, credit_rate_R_per_kwh);
  return avoided + credit - opex_annual;
}

export function calcPayback(capex: number | null, annualSavings: number): number | null {
  if (capex == null || capex <= 0) return null;
  if (annualSavings <= 0) return null;
  return capex / annualSavings;
}

export function calcLCOE(
  capex: number | null,
  opex_annual: number,
  production_kwh_year: number,
  lifespan_years = 25
): number | null {
  if (!capex || capex <= 0 || production_kwh_year <= 0) return null;
  // Simplified straight-line annualized capex
  const annualized_capex = capex / lifespan_years;
  return (annualized_capex + opex_annual) / production_kwh_year;
}

/**
 * Distribui um valor anual em 12 meses por um perfil mensal opcional (array[12] soma = 1)
 * Se não fornecido, faz distribuição uniforme.
 */
export function distributeAnnualToMonthly(annualValue: number, monthlyProfile?: number[]): number[] {
  if (annualValue < 0) throw new Error('annualValue must be >= 0');
  if (monthlyProfile) {
    if (!Array.isArray(monthlyProfile) || monthlyProfile.length !== 12) {
      throw new Error('monthlyProfile must be array of length 12');
    }
    const sum = monthlyProfile.reduce((s, v) => s + v, 0);
    if (Math.abs(sum - 1) > 1e-6) throw new Error('monthlyProfile must sum to 1');
    return monthlyProfile.map((p) => annualValue * p);
  }
  const perMonth = annualValue / 12;
  return new Array(12).fill(Math.round(perMonth * 100) / 100);
}
