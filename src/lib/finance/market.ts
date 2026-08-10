import { MarketInput, MarketResult, MarketCategory } from '../types/budget';

/**
 * Normaliza as categorias garantindo valores numéricos e preenchendo zeros se necessário.
 */
export function normalizeCategories(categories: MarketCategory[]): MarketCategory[] {
  return categories.map(c => ({
    ...c,
    amount: Math.max(0, c.amount || 0),
    quantity: Math.max(0, c.quantity || 0)
  }));
}

/**
 * Cálculos detalhados de Mercado / Alimentação
 */
export function calculateMarketExpenses(input: MarketInput): MarketResult {
  const normalizedCategories = normalizeCategories(input.categories);
  const monthlyTotal = normalizedCategories.reduce((sum, c) => sum + c.amount, 0);
  
  const familyMembers = Math.max(1, input.familyMembers);
  const perCapitaMonth = monthlyTotal / familyMembers;
  const annualTotal = monthlyTotal * 12;
  const annualPerCapita = perCapitaMonth * 12;
  
  const remainingBudget = input.budgetTotalMonth > 0 
    ? input.budgetTotalMonth - monthlyTotal 
    : 0;
  
  const budgetExceeded = remainingBudget < 0;
  const exceededPct = input.budgetTotalMonth > 0 && budgetExceeded
    ? (Math.abs(remainingBudget) / input.budgetTotalMonth) * 100
    : 0;

  const inflationRate = (input.annualInflationPct || 0) / 100;
  const projection = Array.from({ length: (input.projectionYears || 10) + 1 }, (_, t) => {
    const amount = annualTotal * Math.pow(1 + inflationRate, t);
    return {
      year: t,
      amount,
      variationPct: (Math.pow(1 + inflationRate, t) - 1) * 100
    };
  });
  
  const categoryBreakdown = normalizedCategories
    .filter(c => c.amount > 0)
    .map(c => ({
      name: c.name,
      amount: c.amount,
      percentage: monthlyTotal > 0 ? (c.amount / monthlyTotal) * 100 : 0
    }))
    .sort((a, b) => b.amount - a.amount);

  return {
    monthlyTotal,
    perCapitaMonth,
    annualTotal,
    annualPerCapita,
    remainingBudget,
    budgetExceeded,
    exceededPct,
    projection,
    categoryBreakdown
  };
}

/**
 * Calcula a projeção com inflação para um valor anual.
 */
export function projectionWithInflation(annualValue: number, inflationPct: number, years: number) {
  const rate = inflationPct / 100;
  return Array.from({ length: years + 1 }, (_, t) => ({
    year: t,
    value: annualValue * Math.pow(1 + rate, t),
    variationPct: (Math.pow(1 + rate, t) - 1) * 100
  }));
}

/**
 * Reconcilia as categorias com o orçamento total.
 * Opção A: Escala as categorias proporcionalmente.
 * Opção B: Ajusta o orçamento para a soma das categorias.
 */
export function reconcileMarketBudget(
  input: MarketInput, 
  mode: 'scale-categories' | 'adjust-budget'
): MarketInput {
  const categoriesSum = input.categories.reduce((sum, c) => sum + (c.amount || 0), 0);
  
  if (mode === 'adjust-budget') {
    return {
      ...input,
      budgetTotalMonth: categoriesSum
    };
  }

  if (mode === 'scale-categories' && input.budgetTotalMonth > 0 && categoriesSum > 0) {
    const factor = input.budgetTotalMonth / categoriesSum;
    return {
      ...input,
      categories: input.categories.map(c => ({
        ...c,
        amount: c.isLocked ? c.amount : c.amount * factor
      }))
    };
  }

  return input;
}
