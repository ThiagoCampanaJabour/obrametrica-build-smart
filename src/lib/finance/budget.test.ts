/**
 * tests/finance/budget.spec.ts
 * Testes para funções financeiras do ObraMétrica.
 */

import { describe, it, expect } from 'vitest';
import { 
  nominalToPeriodicRate, 
  pricePayment, 
  generateAmortizationSchedule, 
  futureValueMonthlyContributions,
  roundTo
} from '../../src/lib/finance/budget';

describe('Budget Finance Lib', () => {
  it('nominalToPeriodicRate converts annual to monthly', () => {
    expect(nominalToPeriodicRate(12, 12)).toBe(0.01);
    expect(nominalToPeriodicRate(6, 12)).toBe(0.005);
  });

  it('pricePayment calculates correct monthly payment (PMT)', () => {
    // R$ 10.000, 1% am, 12 meses -> R$ 888.48...
    const pmt = pricePayment(10000, 0.01, 12);
    expect(roundTo(pmt, 2)).toBe(888.49);
  });

  it('generateAmortizationSchedule (PRICE) results in zero balance', () => {
    const schedule = generateAmortizationSchedule({
      principal: 10000,
      annualRatePct: 12,
      years: 1,
      amortizationType: 'PRICE'
    });
    expect(schedule.rows.length).toBe(12);
    expect(roundTo(schedule.rows[11].balance, 2)).toBe(0);
  });

  it('futureValueMonthlyContributions calculates correct FV', () => {
    // R$ 100/mês, 12% aa (1% am), 12 meses
    const fv = futureValueMonthlyContributions(100, 12, 12);
    // FV = 100 * ((1.01^12 - 1) / 0.01) = 100 * (0.1268... / 0.01) = 1268.25
    expect(roundTo(fv, 2)).toBe(1268.25);
  });
});
