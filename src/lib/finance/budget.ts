/**
 * src/lib/finance/budget.ts
 * Funções financeiras puras: taxas periódicas, PRICE, SAC, amortization schedule, PV/FV utilities.
 * 
 * Observações:
 * - Usar paymentsPerYear default 12.
 * - Valores retornados não formatados (números). Arredonde na camada de apresentação.
 */

import { Appliance } from '../types/budget';
import { AmortizationRow, AmortizationSchedule, LoanParams } from '../types/index';

export function nominalToPeriodicRate(annualRatePct: number, paymentsPerYear = 12): number {
  if (annualRatePct < 0) throw new Error('annualRatePct must be >= 0');
  return annualRatePct / 100 / paymentsPerYear;
}

/**
 * PRICE (parcela fixa) - retorno da parcela periódica
 */
export function pricePayment(principal: number, periodicRate: number, nPeriods: number): number {
  if (nPeriods <= 0) throw new Error('nPeriods must be > 0');
  if (periodicRate === 0) return principal / nPeriods;
  const pow = Math.pow(1 + periodicRate, nPeriods);
  return (principal * periodicRate * pow) / (pow - 1);
}

/**
 * Gera cronograma de amortização (PRICE ou SAC)
 */
export function generateAmortizationSchedule(params: LoanParams): AmortizationSchedule {
  const paymentsPerYear = params.paymentsPerYear ?? 12;
  const nPeriods = params.years * paymentsPerYear;
  const i = nominalToPeriodicRate(params.annualRatePct, paymentsPerYear);
  const rows: AmortizationRow[] = [];
  let balance = params.principal;
  let totalPaid = 0;
  let totalInterest = 0;

  if (params.amortizationType === 'SAC') {
    const amortization = params.principal / nPeriods;
    for (let period = 1; period <= nPeriods; period++) {
      const interest = balance * i;
      const payment = amortization + interest;
      const principalPaid = amortization;
      balance = Math.max(0, balance - principalPaid);
      rows.push({
        period,
        payment,
        principal: principalPaid,
        interest,
        balance,
      });
      totalPaid += payment;
      totalInterest += interest;
    }
  } else {
    // Default to PRICE
    const payment = pricePayment(params.principal, i, nPeriods);
    for (let period = 1; period <= nPeriods; period++) {
      const interest = balance * i;
      const principalPaid = payment - interest;
      balance = Math.max(0, balance - principalPaid);
      rows.push({
        period,
        payment,
        principal: principalPaid,
        interest,
        balance,
      });
      totalPaid += payment;
      totalInterest += interest;
    }
  }

  return {
    rows,
    totalPaid,
    totalInterest,
  };
}

/**
 * Present value of cash flows
 */
export function presentValue(cashFlows: number[], periodicRate: number): number {
  if (periodicRate <= -1) throw new Error('periodicRate must be > -1');
  return cashFlows.reduce((pv, cf, idx) => pv + cf / Math.pow(1 + periodicRate, idx + 1), 0);
}

/**
 * Future value of monthly contributions (compounded monthly)
 */
export function futureValueMonthlyContributions(monthlyContribution: number, annualRatePct: number, months: number): number {
  const r = annualRatePct / 100 / 12;
  if (r === 0) return monthlyContribution * months;
  return monthlyContribution * (Math.pow(1 + r, months) - 1) / r;
}

/**
 * Totals from budget items (items assumed monthly values)
 */
export function totalsFromBudget(items: { amount: number; type: 'income' | 'expense' }[]) {
  const totalIncome = items.filter(i => i.type === 'income').reduce((s, it) => s + it.amount, 0);
  const totalExpense = items.filter(i => i.type === 'expense').reduce((s, it) => s + it.amount, 0);
  const surplus = totalIncome - totalExpense;
  return { totalIncome, totalExpense, surplus };
}

/* Utility rounding */
export function roundTo(value: number, decimals = 2) {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Calcula o consumo de um equipamento em kWh/mês.
 */
export function calcApplianceConsumption(appliance: Appliance): number {
  const powerKw = appliance.powerW / 1000;
  const dailyKwh = powerKw * appliance.hoursPerDay * appliance.quantity;
  return dailyKwh * appliance.daysPerMonth;
}

/**
 * Soma o consumo de uma lista de equipamentos.
 */
export function totalAppliancesConsumption(appliances: Appliance[]): number {
  return appliances.reduce((sum, app) => sum + calcApplianceConsumption(app), 0);
}

/**
 * Calcula o custo total incluindo impostos.
 */
export function calcCostWithTaxes(kwh: number, tariff: number, taxPct: number): number {
  const base = kwh * tariff;
  return base * (1 + taxPct / 100);
}

