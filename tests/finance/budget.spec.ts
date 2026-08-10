import { pricePayment, generateAmortizationSchedule, presentValue, futureValueMonthlyContributions } from '../../src/lib/finance/budget';
import { describe, test, expect } from 'vitest';

describe('finance budget', () => {
  test('price payment basic', () => {
    const rate = 0.08 / 12;
    const pmt = pricePayment(100000, rate, 240);
    expect(pmt).toBeGreaterThan(700);
  });

  test('generate schedule has correct last balance', () => {
    const schedule = generateAmortizationSchedule({
      principal: 100000,
      annualRatePct: 8,
      years: 20,
      amortizationType: 'PRICE'
    });
    const last = schedule.rows[schedule.rows.length - 1];
    expect(last.balance).toBeCloseTo(0, 1);
  });

  test('fv monthly contributions', () => {
    const fv = futureValueMonthlyContributions(100, 12, 12);
    expect(fv).toBeGreaterThan(1200);
  });
});
