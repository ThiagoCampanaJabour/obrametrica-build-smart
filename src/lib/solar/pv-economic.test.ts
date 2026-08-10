import { calculateBudgetComparison } from './pv-economic';
import { BudgetInput } from '../types/budget';
import { describe, it, expect } from 'vitest';

describe('PV Economic Calculations', () => {
  it('should calculate correct monthly cost with taxes', () => {
    const input: BudgetInput = {
      consumptionMode: 'direct',
      monthlyKwh: 500,
      tariff: 0.80,
      taxPct: 25,
      appliances: []
    };
    const results = calculateBudgetComparison(input);
    // 500 * 0.80 * 1.25 = 500
    expect(results.monthlyCost).toBe(500);
    expect(results.annualCost).toBe(6000);
  });

  it('should calculate PV production correctly', () => {
    const input: BudgetInput = {
      consumptionMode: 'direct',
      monthlyKwh: 500,
      tariff: 0.80,
      taxPct: 25,
      pv: {
        kwp: 4,
        productionFactor: 1500,
        lossesPct: 14,
        overlapFactor: 0.45,
        opexAnnual: 0,
        lifespanYears: 25
      },
      appliances: []
    };
    const results = calculateBudgetComparison(input);
    // 4 * 1500 * 0.86 = 5160
    expect(results.pvProductionYear).toBe(5160);
  });

  it('should calculate payback correctly', () => {
    const input: BudgetInput = {
      consumptionMode: 'direct',
      monthlyKwh: 1000,
      tariff: 1.0,
      taxPct: 0,
      pv: {
        kwp: 10,
        productionFactor: 1000,
        lossesPct: 0,
        overlapFactor: 1.0, // consome tudo
        capex: 20000,
        opexAnnual: 0,
        lifespanYears: 25
      },
      appliances: []
    };
    const results = calculateBudgetComparison(input);
    // Prod = 10 * 1000 = 10000 kWh/ano
    // Savings = 10000 * 1.0 = 10000 R$/ano
    // Payback = 20000 / 10000 = 2 years
    expect(results.annualSavings).toBe(10000);
    expect(results.paybackYears).toBe(2);
  });
});
