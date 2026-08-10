/**
 * src/lib/solar/pv-economic.test.ts
 * Testes para motor de cálculo fotovoltaico.
 */

import { describe, it, expect } from 'vitest';
import { 
  energyFromPower, 
  calcAnnualSavings, 
  calcPayback, 
  calcLCOE 
} from './pv-economic';
import { roundTo } from '../finance/budget';

describe('PV Economic Lib', () => {
  it('energyFromPower calculates correct annual generation', () => {
    // 5 kWp, 1500 kWh/kWp, 14% losses -> 5 * 1500 * 0.86 = 6450
    const gen = energyFromPower(5, 1500, 14);
    expect(gen).toBe(6450);
  });

  it('calcAnnualSavings computes correct savings minus opex', () => {
    // usedOnSite: 3000 kWh, tariff: 0.8
    // exported: 3000 kWh, credit: 0.8
    // opex: 200
    // (3000 * 0.8) + (3000 * 0.8) - 200 = 2400 + 2400 - 200 = 4600
    const savings = calcAnnualSavings(3000, 0.8, 3000, 0.8, 200);
    expect(savings).toBe(4600);
  });

  it('calcPayback returns null for zero savings', () => {
    expect(calcPayback(10000, 0)).toBeNull();
  });

  it('calcPayback returns numeric value for valid inputs', () => {
    expect(calcPayback(20000, 5000)).toBe(4);
  });

  it('calcLCOE returns numeric cost per kwh', () => {
    // capex: 20000, opex: 200, gen: 10000, lifespan: 20
    // annualized capex = 1000
    // lcoe = (1000 + 200) / 10000 = 0.12
    const lcoe = calcLCOE(20000, 200, 10000, 20);
    expect(lcoe).toBe(0.12);
  });
});
