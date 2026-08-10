import { energyFromPower, calcUsedOnSite, calcExported, calcAnnualSavings, calcPayback, calcLCOE } from '../../src/lib/solar/pv-economic';
import { describe, test, expect } from 'vitest';

describe('pv-economic', () => {
  test('energyFromPower basic', () => {
    const e = energyFromPower(5, 1500, 14);
    expect(e).toBeCloseTo(6450, 0);
  });

  test('calcAnnualSavings and payback', () => {
    const production = energyFromPower(5, 1500, 14);
    const used = calcUsedOnSite(production, 0.45);
    const exported = calcExported(production, used);
    const savings = calcAnnualSavings(used, 0.8, exported, 0.8, 0);
    expect(savings).toBeGreaterThan(5000);
    const payback = calcPayback(25000, savings);
    expect(payback).toBeGreaterThan(0);
  });

  test('lcoe returns number', () => {
    const e = energyFromPower(5, 1500, 14);
    const lcoe = calcLCOE(25000, 300, e, 25);
    expect(typeof lcoe).toBe('number');
  });
});
