import { PVInput, BudgetResult, BudgetInput } from '../types/budget';
import { calcCostWithTaxes, totalAppliancesConsumption } from '../finance/budget';

/**
 * Produção anual estimada: kWp × fator × (1 - perdas)
 */
export function calcPVProduction(kwp: number, factor: number, lossesPct: number): number {
  return kwp * factor * (1 - lossesPct / 100);
}

/**
 * Economia anual estimada
 */
export function calcPVEconomy(
  productionKwhYear: number,
  tariff: number,
  taxPct: number,
  overlapFactor: number,
  creditRate?: number
): { avoidedCost: number; creditValue: number } {
  const usedOnSite = productionKwhYear * overlapFactor;
  const exported = Math.max(0, productionKwhYear - usedOnSite);
  
  const effectiveTariff = tariff * (1 + taxPct / 100);
  const avoidedCost = usedOnSite * effectiveTariff;
  
  // Se não houver creditRate, assume net-metering 1:1 (ou seja, economiza a tarifa cheia)
  const rate = creditRate ?? effectiveTariff;
  const creditValue = exported * rate;
  
  return { avoidedCost, creditValue };
}

/**
 * Payback simples: Investimento / Economia Líquida Anual
 */
export function calcPayback(capex: number, annualSavings: number): number | null {
  if (annualSavings <= 0) return null;
  return capex / annualSavings;
}

/**
 * LCOE Simplificado = (Custo Anualizado do Capital + OPEX) / Produção Anual
 */
export function calcLCOE(
  capex: number,
  opexAnnual: number,
  lifespanYears: number,
  productionAnnual: number
): number | null {
  if (productionAnnual <= 0) return null;
  const annualizedCapex = capex / lifespanYears;
  return (annualizedCapex + opexAnnual) / productionAnnual;
}

/**
 * Orquestrador principal dos cálculos do Simulador
 */
export function calculateBudgetComparison(input: BudgetInput): BudgetResult {
  const monthlyConsumptionKwh = input.consumptionMode === 'direct' 
    ? (input.monthlyKwh ?? 0) 
    : totalAppliancesConsumption(input.appliances);
  
  const annualConsumptionKwh = monthlyConsumptionKwh * 12;
  const monthlyCost = calcCostWithTaxes(monthlyConsumptionKwh, input.tariff, input.taxPct);
  const annualCost = monthlyCost * 12;
  
  let pvProductionYear = 0;
  let energyUsedOnSiteYear = 0;
  let energyExportedYear = 0;
  let annualSavings = 0;
  let paybackYears: number | null = null;
  let lcoe: number | null = null;

  if (input.pv) {
    const kwp = input.pv.kwp ?? (input.pv.targetProductionKwhYear ? input.pv.targetProductionKwhYear / (input.pv.productionFactor * (1 - input.pv.lossesPct / 100)) : 0);
    
    pvProductionYear = calcPVProduction(kwp, input.pv.productionFactor, input.pv.lossesPct);
    
    const { avoidedCost, creditValue } = calcPVEconomy(
      pvProductionYear,
      input.tariff,
      input.taxPct,
      input.pv.overlapFactor,
      input.pv.creditRate
    );
    
    energyUsedOnSiteYear = pvProductionYear * input.pv.overlapFactor;
    energyExportedYear = Math.max(0, pvProductionYear - energyUsedOnSiteYear);
    
    annualSavings = avoidedCost + creditValue - (input.pv.opexAnnual ?? 0);
    
    if (input.pv.capex) {
      paybackYears = calcPayback(input.pv.capex, annualSavings);
      lcoe = calcLCOE(input.pv.capex, input.pv.opexAnnual ?? 0, input.pv.lifespanYears, pvProductionYear);
    }
  }

  // Dados mensais (simplificado: distribuição uniforme)
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const monthlyData = months.map(m => {
    const gen = pvProductionYear / 12;
    const cons = monthlyConsumptionKwh;
    const onSite = gen * (input.pv?.overlapFactor ?? 0.45);
    const exp = Math.max(0, gen - onSite);
    
    const costRede = monthlyCost;
    // O custo com PV é o consumo que não foi atendido on-site, menos os créditos da exportação
    const effectiveTariff = input.tariff * (1 + input.taxPct / 100);
    const costRemaining = Math.max(0, cons - onSite) * effectiveTariff;
    const creditVal = exp * (input.pv?.creditRate ?? effectiveTariff);
    
    return {
      month: m,
      consumption: cons,
      generation: gen,
      export: exp,
      costRede,
      costWithPV: Math.max(0, costRemaining - creditVal)
    };
  });

  return {
    monthlyConsumptionKwh,
    annualConsumptionKwh,
    monthlyCost,
    annualCost,
    pvProductionYear,
    energyUsedOnSiteYear,
    energyExportedYear,
    annualSavings,
    paybackYears,
    lcoe,
    monthlyData
  };
}
