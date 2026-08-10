import { describe, it, expect } from 'vitest';
import { calculateMarketExpenses, projectionWithInflation, reconcileMarketBudget } from '../market';
import { MarketInput } from '../../types/budget';

describe('Market Calculations', () => {
  const mockInput: MarketInput = {
    budgetTotalMonth: 1000,
    familyMembers: 2,
    annualInflationPct: 5,
    projectionYears: 2,
    categories: [
      { id: '1', name: 'Alimentação', amount: 800, isLocked: false },
      { id: '2', name: 'Limpeza', amount: 300, isLocked: false }
    ]
  };

  it('calculates totals and per capita correctly', () => {
    const result = calculateMarketExpenses(mockInput);
    expect(result.monthlyTotal).toBe(1100);
    expect(result.perCapitaMonth).toBe(550);
    expect(result.remainingBudget).toBe(-100);
    expect(result.budgetExceeded).toBe(true);
    expect(result.exceededPct).toBe(10);
  });

  it('calculates inflation projection correctly', () => {
    const projection = projectionWithInflation(12000, 10, 2);
    expect(projection[0].value).toBe(12000);
    expect(projection[1].value).toBe(13200);
    expect(projection[2].value).toBe(14520);
  });

  it('reconciles budget by adjusting budget to sum', () => {
    const reconciled = reconcileMarketBudget(mockInput, 'adjust-budget');
    expect(reconciled.budgetTotalMonth).toBe(1100);
  });

  it('reconciles budget by scaling categories', () => {
    const reconciled = reconcileMarketBudget(mockInput, 'scale-categories');
    const sum = reconciled.categories.reduce((s, c) => s + c.amount, 0);
    expect(sum).toBeCloseTo(1000, 0);
  });
});
