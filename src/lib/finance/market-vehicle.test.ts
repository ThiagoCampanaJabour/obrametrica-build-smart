import { describe, it, expect } from 'vitest';
import { calculateMarketExpenses, calculateVehicleExpenses } from './budget';
import { MarketInput, VehicleInput } from '../types/budget';

describe('Cálculos Financeiros - Mercado', () => {
  it('deve calcular gasto per capita e projeção corretamente', () => {
    const input: MarketInput = {
      mode: 'total',
      monthlyTotal: 1500,
      familyMembers: 4,
      annualInflationPct: 5,
      projectionYears: 3,
      categories: []
    };
    const res = calculateMarketExpenses(input);
    expect(res.perCapitaMonth).toBe(375);
    expect(res.annualTotal).toBe(18000);
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
    // Combustível: (1000/10)*5 = 500
    // Manutenção: 100
    // Seguro: 1200/12 = 100
    // IPVA: 1200/12 = 100
    // Depreciação: (50000*0.1)/12 = 416.67
    // Total: 500+100+100+100+416.67 = 1216.67
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
    // Energia: (1000 * 15 / 100) * 0.8 = 150 * 0.8 = 120
    // Manutenção: 50
    // Seguro: 2400/12 = 200
    // IPVA: 0
    // Depreciação: (150000*0.08)/12 = 1000
    // Total: 120+50+200+0+1000 = 1370
    expect(res.totalMonthly).toBe(1370);
  });
});