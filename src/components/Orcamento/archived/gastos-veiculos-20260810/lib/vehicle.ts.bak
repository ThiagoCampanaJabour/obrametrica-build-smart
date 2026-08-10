import { VehicleInput, VehicleResult, VehicleBreakdown } from '../types/vehicle';
import { generateAmortizationSchedule } from './budget';

/**
 * Cálculos de Veículos - Funções puras e exportadas
 */

export function calcMonthlyFuelCost(v: VehicleInput): number {
  if (v.kmPerMonth === 0) return 0;

  if (v.type === 'eletrico' || v.type === 'hibrido') {
    const consumption = v.consumptionKwhPer100Km || 0;
    const price = v.electricityPricePerKwh || 0;
    const efficiency = (v.chargingEfficiencyPct || 95) / 100;
    
    if (consumption === 0) return 0;
    
    // (km * kWh/100km) / 100 = kWh consumido
    const kwhPerMonth = (v.kmPerMonth * consumption) / 100;
    return (kwhPerMonth * price) / efficiency;
  }

  // Combustão
  const consumption = v.consumptionKmPerL || 0;
  const price = v.fuelPricePerL || 0;
  if (consumption === 0) return 0;
  
  return (v.kmPerMonth / consumption) * price;
}

export function calcMonthlyTireCost(v: VehicleInput): number {
  const tires = v.finiteItems?.tires;
  if (!tires || !tires.costPerSet || !tires.replacementIntervalKm || v.kmPerMonth === 0) return 0;
  
  return (v.kmPerMonth / tires.replacementIntervalKm) * tires.costPerSet;
}

export function calcMonthlyOilCost(v: VehicleInput): number {
  const oil = v.finiteItems?.oilChange;
  if (!oil || !oil.costPerChange || !oil.intervalKm || v.kmPerMonth === 0) return 0;
  
  return (v.kmPerMonth / oil.intervalKm) * oil.costPerChange;
}

export function calcMonthlyFinancing(v: VehicleInput): number {
  const f = v.financing;
  if (!f || !f.financedAmount || !f.termYears || !f.annualRatePct) return 0;

  const schedule = generateAmortizationSchedule({
    principal: f.financedAmount,
    annualRatePct: f.annualRatePct,
    years: f.termYears,
    amortizationType: f.amortizationType,
    paymentsPerYear: 12
  });

  return schedule.rows[0]?.payment || 0;
}

export function calcMonthlyDepreciation(v: VehicleInput): number {
  if (v.depreciationRateAnnualPct && v.vehicleValue) {
    return (v.vehicleValue * (v.depreciationRateAnnualPct / 100)) / 12;
  }
  
  if (v.vehicleValue && v.usefulLifeYears) {
    const residual = v.residualValue || 0;
    return (v.vehicleValue - residual) / (v.usefulLifeYears * 12);
  }
  
  return 0;
}

export function calculateVehicleExpenses(vehicles: VehicleInput[]): { list: VehicleResult[]; totalMonthly: number; totalAnnual: number } {
  if (!vehicles || vehicles.length === 0) {
    return { list: [], totalMonthly: 0, totalAnnual: 0 };
  }

  const list = vehicles.map(v => {
    const fuel = v.type === 'eletrico' ? 0 : calcMonthlyFuelCost(v);
    const energy = v.type === 'eletrico' ? calcMonthlyFuelCost(v) : (v.type === 'hibrido' ? 0 : 0); // Hybrid simplification
    
    const maintenance = v.maintenanceMonthly + (v.maintenanceAnnual / 12);
    const tires = calcMonthlyTireCost(v);
    const oil = calcMonthlyOilCost(v);
    const insurance = v.insuranceAnnual / 12;
    const ipva = v.ipvaAnnual / 12;
    const financing = calcMonthlyFinancing(v);
    const depreciation = calcMonthlyDepreciation(v);
    
    const parking = v.parkingMonthly || 0;
    const tolls = v.tollsMonthly || 0;
    const other = (v.carWashMonthly || 0) + (v.otherMonthly || 0);

    const monthlyTotal = fuel + energy + maintenance + tires + oil + insurance + ipva + financing + depreciation + parking + tolls + other;

    const monthly: VehicleBreakdown = {
      fuel, energy, maintenance, tires, oil, insurance, ipva, financing, depreciation, parking, tolls, other,
      total: monthlyTotal
    };

    const annual: VehicleBreakdown = {
      fuel: fuel * 12,
      energy: energy * 12,
      maintenance: maintenance * 12,
      tires: tires * 12,
      oil: oil * 12,
      insurance: insurance * 12,
      ipva: ipva * 12,
      financing: financing * 12,
      depreciation: depreciation * 12,
      parking: parking * 12,
      tolls: tolls * 12,
      other: other * 12,
      total: monthlyTotal * 12
    };

    const costPerKm = v.kmPerMonth > 0 ? monthlyTotal / v.kmPerMonth : null;

    const taxes = insurance + ipva + (v.licensingAnnual / 12);
    const totalM = monthlyTotal;
    const shares = {
      fuel: totalM > 0 ? (fuel + energy) / totalM : 0,
      maintenance: totalM > 0 ? (maintenance + tires + oil) / totalM : 0,
      taxes: totalM > 0 ? taxes / totalM : 0,
      depreciation: totalM > 0 ? depreciation / totalM : 0,
      financing: totalM > 0 ? financing / totalM : 0,
      admin: totalM > 0 ? (parking + tolls + other) / totalM : 0,
    };

    return {
      id: v.id,
      name: v.name,
      type: v.type,
      monthly,
      annual,
      costPerKm,
      shares
    };
  });

  const totalMonthly = list.reduce((sum, v) => sum + v.monthly.total, 0);
  const totalAnnual = totalMonthly * 12;

  return { list, totalMonthly, totalAnnual };
}
