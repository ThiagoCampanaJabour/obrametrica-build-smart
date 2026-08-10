/**
 * src/lib/solar/pv-economic.ts
 * Funções puras para cálculos econômicos simplificados de sistemas fotovoltaicos.
 */

import { BudgetInput, BudgetResult } from '../types/budget';
import { calcCostWithTaxes, totalAppliancesConsumption } from '../finance/budget';

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
    return 0;
  }
  const lossesFrac = losses_pct / 100;
  return kWp * factor_kwh_per_kwp_year * (1 - lossesFrac);
}

export function calcUsedOnSite(
  production_kwh_year: number,
  overlap_factor = 0.45
): number {
  if (production_kwh_year < 0) return 0;
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
  const annualized_capex = capex / lifespan_years;
  return (annualized_capex + opex_annual) / production_kwh_year;
}

export function distributeAnnualToMonthly(annualValue: number, monthlyProfile?: number[]): number[] {
  if (annualValue < 0) return new Array(12).fill(0);
  if (monthlyProfile) {
    if (!Array.isArray(monthlyProfile) || monthlyProfile.length !== 12) {
      return new Array(12).fill(annualValue / 12);
    }
    const sum = monthlyProfile.reduce((s, v) => s + v, 0);
    if (Math.abs(sum - 1) > 1e-6) return new Array(12).fill(annualValue / 12);
    return monthlyProfile.map((p) => annualValue * p);
  }
  return new Array(12).fill(annualValue / 12);
}

/**
 * Função principal de orquestração para o Simulador de Orçamento
 */
export function calculateBudgetComparison(input: BudgetInput): BudgetResult {
  const monthlyKwh = input.consumptionMode === 'direct' 
    ? (input.monthlyKwh || 0) 
    : totalAppliancesConsumption(input.appliances);

  const annualKwh = monthlyKwh * 12;
  const monthlyCost = calcCostWithTaxes(monthlyKwh, input.tariff, input.taxPct);
  const annualCost = monthlyCost * 12;

  const pv = input.pv || {
    kwp: 0,
    productionFactor: 1500,
    lossesPct: 14,
    overlapFactor: 0.45,
    opexAnnual: 0,
    lifespanYears: 25,
    creditRate: input.tariff
  };

  const productionYear = energyFromPower(pv.kwp || 0, pv.productionFactor, pv.lossesPct);
  const usedOnSiteYear = calcUsedOnSite(productionYear, pv.overlapFactor);
  const exportedYear = calcExported(productionYear, usedOnSiteYear);
  
  const creditRate = pv.creditRate ?? input.tariff;
  const annualSavings = annualKwh > 0 ? calcAnnualSavings(usedOnSiteYear, input.tariff, exportedYear, creditRate, pv.opexAnnual) : 0;
  
  const payback = calcPayback(pv.capex || null, annualSavings);
  const lcoe = calcLCOE(pv.capex || null, pv.opexAnnual, productionYear, pv.lifespanYears);

  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const monthlyProd = productionYear / 12;
    const monthlyUsed = usedOnSiteYear / 12;
    const monthlyExport = exportedYear / 12;
    
    const baseMonthlyCost = calcCostWithTaxes(monthlyKwh, input.tariff, input.taxPct);
    const savingsFromUsed = monthlyUsed * input.tariff;
    const creditFromExport = monthlyExport * creditRate;
    const costWithPV = Math.max(0, baseMonthlyCost - savingsFromUsed - creditFromExport);

    return {
      month: months[i],
      consumption: monthlyKwh,
      generation: monthlyProd,
      export: monthlyExport,
      costRede: baseMonthlyCost,
      costWithPV: costWithPV
    };
  });

  // Calculate market expenses if input provided
  const market = input.market ? (import.meta.env.SSR ? undefined : require('../finance/budget').calculateMarketExpenses(input.market)) : undefined;

  return {
    monthlyConsumptionKwh: monthlyKwh,
    annualConsumptionKwh: annualKwh,
    monthlyCost,
    annualCost,
    pvProductionYear: productionYear,
    energyUsedOnSiteYear: usedOnSiteYear,
    energyExportedYear: exportedYear,
    annualSavings,
    paybackYears: payback,
    lcoe,
    monthlyData,
    market
  };
}

