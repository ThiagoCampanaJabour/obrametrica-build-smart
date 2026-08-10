import { describe, it, expect } from 'vitest';
import { calcMonthlyFuelCost, calcMonthlyTireCost, calcMonthlyOilCost, calcMonthlyDepreciation, calculateVehicleExpenses } from './vehicle';
import { VehicleInput } from '../types/vehicle';

describe('Motor de Cálculo de Veículos', () => {
  const sampleVehicle: VehicleInput = {
    id: 'test-1',
    name: 'Carro Teste',
    type: 'gasolina',
    kmPerMonth: 1000,
    consumptionKmPerL: 10,
    fuelPricePerL: 5,
    maintenanceMonthly: 100,
    maintenanceAnnual: 1200,
    insuranceAnnual: 2400,
    ipvaAnnual: 1200,
    licensingAnnual: 120,
    vehicleValue: 50000,
    depreciationRateAnnualPct: 12,
    finiteItems: {
      tires: { costPerSet: 2000, replacementIntervalKm: 40000, numberOfTires: 4 },
      oilChange: { costPerChange: 300, intervalKm: 10000 }
    },
    parkingMonthly: 100,
    tollsMonthly: 50,
    carWashMonthly: 50,
    otherMonthly: 0,
    chargingEfficiencyPct: 95
  };

  it('deve calcular custo mensal de combustível corretamente', () => {
    expect(calcMonthlyFuelCost(sampleVehicle)).toBe(500);
  });

  it('deve calcular custo mensal de pneus corretamente', () => {
    // (1000 / 40000) * 2000 = 0.025 * 2000 = 50
    expect(calcMonthlyTireCost(sampleVehicle)).toBe(50);
  });

  it('deve calcular custo mensal de óleo corretamente', () => {
    // (1000 / 10000) * 300 = 0.1 * 300 = 30
    expect(calcMonthlyOilCost(sampleVehicle)).toBe(30);
  });

  it('deve calcular depreciação mensal corretamente (taxa anual)', () => {
    // (50000 * 0.12) / 12 = 500
    expect(calcMonthlyDepreciation(sampleVehicle)).toBe(500);
  });

  it('deve calcular depreciação mensal corretamente (vida útil)', () => {
    const v = { ...sampleVehicle, depreciationRateAnnualPct: undefined, usefulLifeYears: 5, residualValue: 10000 };
    // (50000 - 10000) / (5 * 12) = 40000 / 60 = 666.666...
    expect(calcMonthlyDepreciation(v)).toBeCloseTo(666.67, 2);
  });

  it('deve calcular custo total mensal da frota', () => {
    const result = calculateVehicleExpenses([sampleVehicle]);
    // Fuel: 500
    // Maintenance: 100 + (1200/12) = 200
    // Tires: 50
    // Oil: 30
    // Insurance: 2400/12 = 200
    // IPVA: 1200/12 = 100
    // Financing: 0
    // Depreciation: 500
    // Parking: 100
    // Tolls: 50
    // Other: 50 (wash) + 0
    // Total: 500+200+50+30+200+100+0+500+100+50+50 = 1780
    expect(result.totalMonthly).toBe(1780);
    expect(result.list[0].costPerKm).toBe(1.78);
  });

  it('deve calcular custos para veículo elétrico corretamente', () => {
    const ev: VehicleInput = {
      ...sampleVehicle,
      type: 'eletrico',
      consumptionKwhPer100Km: 15,
      electricityPricePerKwh: 1,
      chargingEfficiencyPct: 100
    };
    // (1000 * 15) / 100 = 150 kWh
    // 150 * 1 / 1.0 = 150
    expect(calcMonthlyFuelCost(ev)).toBe(150);
  });
});
