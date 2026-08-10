import { MarketInput, MarketResult } from '../types/budget';

/**
 * Cálculos de Mercado / Alimentação
 */
export function calculateMarketExpenses(input: MarketInput): MarketResult {
  const monthlyTotal = input.mode === 'total' 
    ? input.monthlyTotal 
    : (input.categories || []).reduce((sum, c) => sum + (c.amount || 0), 0);
  
  const familyMembers = Math.max(1, input.familyMembers);
  const perCapitaMonth = monthlyTotal / familyMembers;
  const annualTotal = monthlyTotal * 12;
  const annualPerCapita = perCapitaMonth * 12;
  
  const inflationRate = (input.annualInflationPct || 0) / 100;
  const projection = Array.from({ length: (input.projectionYears || 1) + 1 }, (_, t) => {
    const amount = annualTotal * Math.pow(1 + inflationRate, t);
    return {
      year: t,
      amount,
      variationPct: (Math.pow(1 + inflationRate, t) - 1) * 100
    };
  });
  
  const categoryBreakdown = input.mode === 'categories' && monthlyTotal > 0 && input.categories
    ? input.categories.map(c => ({
        name: c.name,
        amount: c.amount,
        percentage: (c.amount / monthlyTotal) * 100
      }))
    : [];

  return {
    perCapitaMonth,
    annualTotal,
    annualPerCapita,
    projection,
    categoryBreakdown
  };
}
