import { describe, it, expect } from 'vitest';
import { energyFromPower, calcAnnualSavings, calcPayback } from './pv-economic';

describe('PV Economic Calculations', () => {
  it('should calculate energy production correctly', () => {
    const kwp = 4;
    const factor = 1500;
    const losses = 14;
    const expected = kwp * factor * (1 - losses / 100);
    expect(energyFromPower(kwp, factor, losses)).toBe(expected);
  });

  it('should calculate annual savings correctly', () => {
    const usedOnSite = 2000;
    const tariff = 0.85;
    const exported = 3000;
    const creditRate = 0.85;
    const opex = 200;
    const expected = (usedOnSite * tariff) + (exported * creditRate) - opex;
    expect(calcAnnualSavings(usedOnSite, tariff, exported, creditRate, opex)).toBe(expected);
  });

  it('should calculate payback correctly', () => {
    const capex = 20000;
    const annualSavings = 5000;
    expect(calcPayback(capex, annualSavings)).toBe(4);
  });
});
