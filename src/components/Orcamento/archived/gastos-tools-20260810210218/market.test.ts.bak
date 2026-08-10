import { describe, it, expect } from 'vitest';
import { calculateMarketExpenses, projectionWithInflation, reconcileMarketBudget, normalizeCategories } from './market';
import { MarketInput } from '../types/budget';

describe('Market Calculations', () => {
  const mockInput: MarketInput = {
    budgetTotalMonth: 1000,
    familyMembers: 2,
    annualInflationPct: 5,
    projectionYears: 2,
    categories: [
      { id: 'alimentacao', name: 'Alimentação', amount: 800, value_month: 800, quantity: 10, isLocked: false },
      { id: 'limpeza', name: 'Limpeza', amount: 300, value_month: 300, quantity: null, isLocked: false }
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
    expect(projection[0].value).toBeCloseTo(12000);
    expect(projection[1].value).toBeCloseTo(13200);
    expect(projection[2].value).toBeCloseTo(14520);
  });

  it('reconciles budget by adjusting budget to sum', () => {
    const reconciled = reconcileMarketBudget(mockInput, 'adjust-budget');
    expect(reconciled.budgetTotalMonth).toBe(1100);
  });

  it('reconciles budget by scaling categories', () => {
    const reconciled = reconcileMarketBudget(mockInput, 'scale-categories');
    const sum = reconciled.categories.reduce((s: number, c) => s + c.amount, 0);
    expect(sum).toBeCloseTo(1000, 0);
  });

  it('preserves value_month and quantity in normalization', () => {
    const input: any = [
      { id: 'test', name: 'Test', amount: 100, value_month: 100, quantity: 5 }
    ];
    const normalized = normalizeCategories(input);
    expect(normalized[0].value_month).toBe(100);
    expect(normalized[0].quantity).toBe(5);
  });

  it('handles null quantity correctly', () => {
    const input: any = [
      { id: 'test', name: 'Test', amount: 100, value_month: 100, quantity: null }
    ];
    const normalized = normalizeCategories(input);
    expect(normalized[0].quantity).toBe(null);
  });
});
