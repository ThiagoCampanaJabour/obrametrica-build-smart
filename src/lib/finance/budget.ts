import { Appliance } from '../types/budget';

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
