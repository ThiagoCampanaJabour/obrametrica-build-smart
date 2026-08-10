import { VehicleInput, VehicleResult } from '../types/budget';
import { generateAmortizationSchedule } from './budget';

/**
 * Cálculos de Veículos - Funções puras e exportadas
 */

export function calcMonthlyFuelCost(v: VehicleInput): number {
  if (v.kmPerMonth === 0 || v.consumption === 0) return 0;

  if (v.type === 'eletrico' || v.type === 'hibrido') {
    // Para elétricos: consumption é kWh/100km, fuelPrice é R$/kWh
    // Se híbrido, podemos simplificar usando a mesma lógica ou km/l se for plug-in
    // Para simplificar conforme pedido: elétrico/híbrido usa kWh/100km e preço de energia
    // Se o usuário inseriu preço de combustível em R$/L para híbrido, a UI deve orientar
    
    // Lógica específica para elétrico se tiver preço de energia residencial e eficiência
    const price = v.electricityPriceResidential || v.fuelPrice;
    const efficiency = (v.chargingEfficiencyPct || 90) / 100;
    
    if (v.type === 'eletrico') {
      const kwhPerMonth = (v.kmPerMonth * v.consumption) / 100;
      return (kwhPerMonth * price) / efficiency;
    }
  }

  // Combustão: consumption é km/L, fuelPrice é R$/L
  return (v.kmPerMonth / v.consumption) * v.fuelPrice;
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

  // Retorna a primeira parcela como estimativa mensal (ou média se SAC, mas PRICE é constante)
  return schedule.rows[0]?.payment || 0;
}

export function calcMonthlyDepreciation(v: VehicleInput): number {
  if (!v.vehicleValue || !v.depreciationRateAnnualPct) return 0;
  return (v.vehicleValue * (v.depreciationRateAnnualPct / 100)) / 12;
}

export function calculateVehicleExpenses(vehicles: VehicleInput[]): { list: VehicleResult[]; totalMonthly: number; totalAnnual: number } {
  if (!vehicles || vehicles.length === 0) {
    return { list: [], totalMonthly: 0, totalAnnual: 0 };
  }

  const list = vehicles.map(v => {
    const monthlyFuelCost = calcMonthlyFuelCost(v);
    const monthlyMaintenance = v.maintenanceMonthly || 0;
    const monthlyInsurance = (v.insuranceAnnual || 0) / 12;
    const monthlyIpva = (v.ipvaAnnual || 0) / 12;
    const monthlyLicensing = (v.licensingAnnual || 0) / 12;
    const monthlyDepreciation = calcMonthlyDepreciation(v);
    const monthlyFinancing = calcMonthlyFinancing(v);
    
    const monthlyAdmin = (v.admin?.parkingMonthly || 0) + 
                         (v.admin?.tollsMonthly || 0) + 
                         (v.admin?.cleaningMonthly || 0);
                         
    const monthlyFiniteItems = calcMonthlyTireCost(v) + calcMonthlyOilCost(v);

    const totalMonthly = monthlyFuelCost + 
                         monthlyMaintenance + 
                         monthlyInsurance + 
                         monthlyIpva + 
                         monthlyLicensing +
                         monthlyDepreciation + 
                         monthlyFinancing + 
                         monthlyAdmin + 
                         monthlyFiniteItems;
                         
    const totalAnnual = totalMonthly * 12;
    const costPerKm = v.kmPerMonth > 0 ? totalMonthly / v.kmPerMonth : 0;

    // Shares
    const taxes = monthlyInsurance + monthlyIpva + monthlyLicensing;
    const shares = {
      fuel: totalMonthly > 0 ? monthlyFuelCost / totalMonthly : 0,
      maintenance: totalMonthly > 0 ? (monthlyMaintenance + monthlyFiniteItems) / totalMonthly : 0,
      taxes: totalMonthly > 0 ? taxes / totalMonthly : 0,
      depreciation: totalMonthly > 0 ? monthlyDepreciation / totalMonthly : 0,
      financing: totalMonthly > 0 ? monthlyFinancing / totalMonthly : 0,
      admin: totalMonthly > 0 ? monthlyAdmin / totalMonthly : 0,
    };

    return {
      id: v.id,
      name: v.name,
      monthlyFuelCost,
      monthlyMaintenance,
      monthlyInsurance,
      monthlyIpva,
      monthlyLicensing,
      monthlyDepreciation,
      monthlyFinancing,
      monthlyAdmin,
      monthlyFiniteItems,
      totalMonthly,
      totalAnnual,
      costPerKm,
      shares
    };
  });

  const totalMonthly = list.reduce((sum, v) => sum + v.totalMonthly, 0);
  const totalAnnual = totalMonthly * 12;

  return { list, totalMonthly, totalAnnual };
}
