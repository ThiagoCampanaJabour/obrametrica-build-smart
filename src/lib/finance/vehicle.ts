import { VehicleInput, VehicleResult } from '../types/budget';

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
