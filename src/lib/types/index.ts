import { BudgetInput, BudgetResult } from './budget';

export interface AmortizationRow {
  period: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface AmortizationSchedule {
  rows: AmortizationRow[];
  totalPaid: number;
  totalInterest: number;
}

export interface LoanParams {
  principal: number;
  annualRatePct: number;
  years: number;
  paymentsPerYear?: number;
  amortizationType?: 'PRICE' | 'SAC';
}

export * from './budget';
