import { describe, it, expect } from 'vitest';
import { calculateVehicleExpenses, calcMonthlyFuelCost, calcMonthlyTireCost, calcMonthlyFinancing } from './vehicle';
import { VehicleInput } from '../types/budget';

describe('Calculadora de Veículos - Motores de Cálculo', () => {
  const baseVehicle: VehicleInput = {
    id: 'test-1',
    name: 'Carro Teste',
    type: 'gasolina',
    kmPerMonth: 1000,
    consumption: 10,
    fuelPrice: 5.0,
    maintenanceMonthly: 100,
    insuranceAnnual: 1200,
    ipvaAnnual: 1000,
    licensingAnnual: 200,
    vehicleValue: 50000,
    depreciationRateAnnualPct: 10,
    chargingEfficiencyPct: 90
  };

  it('deve calcular combustível corretamente (combustão)', () => {
    expect(calcMonthlyFuelCost(baseVehicle)).toBe(500);
  });

  it('deve calcular combustível corretamente (elétrico)', () => {
    const ev = { ...baseVehicle, type: 'eletrico' as const, consumption: 15, fuelPrice: 0.8 };
    // (1000 * 15 / 100) * 0.8 / 0.9 = 150 * 0.8 / 0.9 = 120 / 0.9 = 133.33
    expect(calcMonthlyFuelCost(ev)).toBeCloseTo(133.33, 2);
  });

  it('deve calcular custo de pneus corretamente', () => {
    const v = { 
      ...baseVehicle, 
      finiteItems: { 
        tires: { costPerSet: 2000, replacementIntervalKm: 40000, numberOfTires: 4 },
        oilChange: { costPerChange: 0, intervalKm: 10000 }
      } 
    };
    // (1000 / 40000) * 2000 = 0.025 * 2000 = 50
    expect(calcMonthlyTireCost(v)).toBe(50);
  });

  it('deve calcular financiamento corretamente (PRICE)', () => {
    const v = {
      ...baseVehicle,
      financing: {
        financedAmount: 30000,
        downPayment: 10000,
        annualRatePct: 12, // 1% ao mês
        termYears: 3, // 36 meses
        amortizationType: 'PRICE' as const
      }
    };
    // Parcela PRICE: 30000 * 0.01 * (1.01^36) / (1.01^36 - 1) = 30000 * 0.01 * 1.4307 / 0.4307 = 996.43
    expect(calcMonthlyFinancing(v)).toBeCloseTo(996.43, 2);
  });

  it('deve consolidar o custo total mensal', () => {
    const res = calculateVehicleExpenses([baseVehicle]);
    // Fuel: 500
    // Maint: 100
    // Insurance: 1200/12 = 100
    // IPVA: 1000/12 = 83.33
    // Lic: 200/12 = 16.66
    // Depr: 50000 * 0.1 / 12 = 416.66
    // Total = 500 + 100 + 100 + 83.33 + 16.66 + 416.66 = 1216.66
    expect(res.totalMonthly).toBeCloseTo(1216.66, 1);
    expect(res.list[0].costPerKm).toBeCloseTo(1.216, 2);
  });

  it('deve incluir custos administrativos', () => {
    const v = {
      ...baseVehicle,
      admin: {
        parkingMonthly: 200,
        tollsMonthly: 50,
        cleaningMonthly: 50
      }
    };
    const res = calculateVehicleExpenses([v]);
    expect(res.list[0].monthlyAdmin).toBe(300);
  });
});
