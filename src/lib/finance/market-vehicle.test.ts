import { describe, it, expect } from 'vitest';
import { calculateMarketExpenses, calculateVehicleExpenses } from './budget';
import { MarketInput, VehicleInput } from '../types/budget';

describe('Cálculos Financeiros - Mercado', () => {
  it('deve calcular gasto per capita e projeção corretamente', () => {
    const input: MarketInput = {
      budgetTotalMonth: 2000,
      familyMembers: 4,
      annualInflationPct: 5,
      projectionYears: 3,
      categories: [
        { id: '1', name: 'Geral', amount: 1500, isLocked: false }
      ]
    };
    const res = calculateMarketExpenses(input);
    expect(res.monthlyTotal).toBe(1500);
    expect(res.perCapitaMonth).toBe(375);
    expect(res.annualTotal).toBe(18000);
    expect(res.remainingBudget).toBe(500);
    // Ano 1 (t=1): 18000 * 1.05 = 18900
    expect(res.projection[1].amount).toBeCloseTo(18900);
  });
});

describe('Cálculos Financeiros - Veículos', () => {
  it('deve calcular custo mensal de veículo a combustão', () => {
    const vehicle: VehicleInput = {
      id: '1',
      name: 'Carro Teste',
      type: 'gasolina',
      kmPerMonth: 1000,
      consumptionKmPerL: 10,
      fuelPricePerL: 5.0,
      maintenanceMonthly: 100,
      maintenanceAnnual: 0,
      insuranceAnnual: 1200,
      ipvaAnnual: 1200,
      vehicleValue: 50000,
      depreciationRateAnnualPct: 10,
      licensingAnnual: 0,
      chargingEfficiencyPct: 90,
      parkingMonthly: 0,
      tollsMonthly: 0,
      carWashMonthly: 0,
      otherMonthly: 0
    };
    const res = calculateVehicleExpenses([vehicle]);
    // Fuel: 500
    // Maint: 100
    // Insurance: 100
    // IPVA: 100
    // Depr: 50000 * 0.1 / 12 = 416.66...
    // Total = 500 + 100 + 100 + 100 + 416.66 = 1216.66
    expect(res.totalMonthly).toBeCloseTo(1216.67, 1);
    expect(res.list[0].costPerKm).toBeCloseTo(1.216, 2);
  });

  it('deve calcular custo mensal de veículo elétrico', () => {
    const vehicle: VehicleInput = {
      id: '2',
      name: 'Elétrico Teste',
      type: 'eletrico',
      kmPerMonth: 1000,
      consumptionKwhPer100Km: 15,
      electricityPricePerKwh: 0.8,
      chargingEfficiencyPct: 100, // simplify for exact match
      maintenanceMonthly: 50,
      maintenanceAnnual: 0,
      insuranceAnnual: 2400,
      ipvaAnnual: 0,
      vehicleValue: 150000,
      depreciationRateAnnualPct: 8,
      licensingAnnual: 0,
      parkingMonthly: 0,
      tollsMonthly: 0,
      carWashMonthly: 0,
      otherMonthly: 0
    };
    const res = calculateVehicleExpenses([vehicle]);
    // Energy: (1000 * 15 / 100) * 0.8 = 120
    // Maint: 50
    // Insurance: 200
    // IPVA: 0
    // Depr: 150000 * 0.08 / 12 = 1000
    // Total = 120 + 50 + 200 + 1000 = 1370
    expect(res.totalMonthly).toBe(1370);
  });
});
