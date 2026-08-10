import { Appliance, BudgetInput, BudgetResult, PVInput } from './budget';

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

export type { Appliance, BudgetInput, BudgetResult, PVInput };
export * from './budget';
