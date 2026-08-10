/**
 * src/lib/finance/budget.ts
 * Funções financeiras puras: taxas periódicas, PRICE, SAC, amortização, 
 * gastos domésticos e cálculos de mercado.
 */

import { Appliance, MarketInput, MarketResult, MarketCategory, VehicleInput, VehicleResult } from '../types/budget';
import { calculateMarketExpenses as calculateMarketExpensesBase } from './market';
import { calculateVehicleExpenses as calculateVehicleExpensesBase } from './vehicle';
import { AmortizationRow, AmortizationSchedule, LoanParams } from '../types/index';

export function nominalToPeriodicRate(annualRatePct: number, paymentsPerYear = 12): number {
  if (annualRatePct < 0) throw new Error('annualRatePct must be >= 0');
  return annualRatePct / 100 / paymentsPerYear;
}

export function pricePayment(principal: number, periodicRate: number, nPeriods: number): number {
  if (nPeriods <= 0) throw new Error('nPeriods must be > 0');
  if (periodicRate === 0) return principal / nPeriods;
  const pow = Math.pow(1 + periodicRate, nPeriods);
  return (principal * periodicRate * pow) / (pow - 1);
}

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

export function presentValue(cashFlows: number[], periodicRate: number): number {
  if (periodicRate <= -1) throw new Error('periodicRate must be > -1');
  return cashFlows.reduce((pv, cf, idx) => pv + cf / Math.pow(1 + periodicRate, idx + 1), 0);
}

export function futureValueMonthlyContributions(monthlyContribution: number, annualRatePct: number, months: number): number {
  const r = annualRatePct / 100 / 12;
  if (r === 0) return monthlyContribution * months;
  return monthlyContribution * (Math.pow(1 + r, months) - 1) / r;
}

export function totalsFromBudget(items: { amount: number; type: 'income' | 'expense' }[]) {
  const totalIncome = items.filter(i => i.type === 'income').reduce((s, it) => s + it.amount, 0);
  const totalExpense = items.filter(i => i.type === 'expense').reduce((s, it) => s + it.amount, 0);
  const surplus = totalIncome - totalExpense;
  return { totalIncome, totalExpense, surplus };
}

export function roundTo(value: number, decimals = 2) {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

export function calcApplianceConsumption(appliance: Appliance): number {
  const powerKw = appliance.powerW / 1000;
  const dailyKwh = powerKw * appliance.hoursPerDay * appliance.quantity;
  return dailyKwh * appliance.daysPerMonth;
}

export function totalAppliancesConsumption(appliances: Appliance[]): number {
  return appliances.reduce((sum, app) => sum + calcApplianceConsumption(app), 0);
}

export function calcCostWithTaxes(kwh: number, tariff: number, taxPct: number): number {
  const base = kwh * tariff;
  return base * (1 + taxPct / 100);
}

/**
 * Cálculos de Mercado / Alimentação
 */
export function calculateMarketExpenses(input: MarketInput): MarketResult {
  return calculateMarketExpensesBase(input);
}

/**
 * Cálculos de Veículos
 */
export function calculateVehicleExpenses(vehicles: VehicleInput[]): { list: VehicleResult[]; totalMonthly: number; totalAnnual: number } {
  if (!vehicles || vehicles.length === 0) {
    return { list: [], totalMonthly: 0, totalAnnual: 0 };
  }

  const list = vehicles.map(v => {
    let monthlyFuelCost = 0;
    if (v.type === 'eletrico') {
      // v.consumption is kWh/100km, v.fuelPrice is R$/kWh
      monthlyFuelCost = (v.kmPerMonth * v.consumption / 100) * v.fuelPrice;
    } else {
      // v.consumption is km/L, v.fuelPrice is R$/L
      monthlyFuelCost = v.kmPerMonth > 0 && v.consumption > 0 
        ? (v.kmPerMonth / v.consumption) * v.fuelPrice 
        : 0;
    }

    const monthlyMaintenance = v.maintenanceMonthly || 0;
    const monthlyInsurance = (v.insuranceAnnual || 0) / 12;
    const monthlyIpva = (v.ipvaAnnual || 0) / 12;
    
    let monthlyDepreciation = 0;
    if (v.vehicleValue) {
      monthlyDepreciation = (v.vehicleValue * ((v.depreciationRateAnnualPct || 10) / 100)) / 12;
    }

    const totalMonthly = monthlyFuelCost + monthlyMaintenance + monthlyInsurance + monthlyIpva + monthlyDepreciation;
    const totalAnnual = totalMonthly * 12;
    const costPerKm = v.kmPerMonth > 0 ? totalMonthly / v.kmPerMonth : 0;

    return {
      id: v.id,
      name: v.name,
      monthlyFuelCost,
      monthlyMaintenance,
      monthlyInsurance,
      monthlyIpva,
      monthlyDepreciation,
      totalMonthly,
      totalAnnual,
      costPerKm
    };
  });

  const totalMonthly = list.reduce((sum, v) => sum + v.totalMonthly, 0);
  const totalAnnual = totalMonthly * 12;

  return { list, totalMonthly, totalAnnual };
}




