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
      consumption: 10,
      fuelPrice: 5.0,
      maintenanceMonthly: 100,
      insuranceAnnual: 1200,
      ipvaAnnual: 1200,
      vehicleValue: 50000,
      depreciationRateAnnualPct: 10
    };
    const res = calculateVehicleExpenses([vehicle]);
    expect(res.totalMonthly).toBeCloseTo(1216.67, 1);
    expect(res.list[0].costPerKm).toBeCloseTo(1.216, 2);
  });

  it('deve calcular custo mensal de veículo elétrico', () => {
    const vehicle: VehicleInput = {
      id: '2',
      name: 'Elétrico Teste',
      type: 'eletrico',
      kmPerMonth: 1000,
      consumption: 15, // 15kWh/100km
      fuelPrice: 0.8, // R$/kWh
      maintenanceMonthly: 50,
      insuranceAnnual: 2400,
      ipvaAnnual: 0,
      vehicleValue: 150000,
      depreciationRateAnnualPct: 8
    };
    const res = calculateVehicleExpenses([vehicle]);
    expect(res.totalMonthly).toBe(1370);
  });
});
