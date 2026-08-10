import { z } from 'zod';

export const ApplianceSchema = z.object({
  id: z.string(),
  name: z.string(),
  powerW: z.number().min(0),
  hoursPerDay: z.number().min(0).max(24),
  daysPerMonth: z.number().min(0).max(31),
  quantity: z.number().min(1),
});

export type Appliance = z.infer<typeof ApplianceSchema>;

export const PVInputSchema = z.object({
  kwp: z.number().min(0).optional(),
  targetProductionKwhYear: z.number().min(0).optional(),
  productionFactor: z.number().min(800).max(2200).default(1500),
  lossesPct: z.number().min(0).max(95).default(14),
  capex: z.number().min(0).optional(),
  opexAnnual: z.number().min(0).default(0),
  lifespanYears: z.number().min(1).max(40).default(25),
  overlapFactor: z.number().min(0).max(1).default(0.45),
  creditRate: z.number().min(0).optional(),
});

export type PVInput = z.infer<typeof PVInputSchema>;

export const MarketCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  parentCategory: z.string().optional(),
  amount: z.number().min(0), // Remapped to value_month in export
  value_month: z.number().min(0).optional(), // Direct mapping for value
  quantity: z.number().min(0).nullable().optional(),
  unit: z.string().optional(),
  note: z.string().optional(),
  isLocked: z.boolean().default(false),
});

export type MarketCategory = z.infer<typeof MarketCategorySchema>;

export const MarketInputSchema = z.object({
  budgetTotalMonth: z.number().min(0).default(0),
  categories: z.array(MarketCategorySchema).default([]),
  familyMembers: z.number().int().min(1).default(1),
  annualInflationPct: z.number().min(0).default(5),
  projectionYears: z.number().int().min(1).max(20).default(10),
});

export type MarketInput = z.infer<typeof MarketInputSchema>;

export const VehicleInputSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['gasolina', 'etanol', 'diesel', 'eletrico']),
  kmPerMonth: z.number().min(0),
  consumption: z.number().min(0.1), // km/L or kWh/100km
  fuelPrice: z.number().min(0), // R$/L or R$/kWh
  maintenanceMonthly: z.number().min(0).default(0),
  insuranceAnnual: z.number().min(0).default(0),
  ipvaAnnual: z.number().min(0).default(0),
  vehicleValue: z.number().min(0).optional(),
  depreciationRateAnnualPct: z.number().min(0).default(10),
});

export type VehicleInput = z.infer<typeof VehicleInputSchema>;

export const BudgetInputSchema = z.object({
  consumptionMode: z.enum(['direct', 'appliances']),
  monthlyKwh: z.number().min(0).optional(),
  appliances: z.array(ApplianceSchema).default([]),
  tariff: z.number().min(0).default(0.85),
  taxPct: z.number().min(0).max(100).default(25),
  pv: PVInputSchema.optional(),
  market: MarketInputSchema.optional(),
  vehicles: z.array(VehicleInputSchema).default([]),
});

export type BudgetInput = z.infer<typeof BudgetInputSchema>;

export interface MarketResult {
  monthlyTotal: number;
  perCapitaMonth: number;
  annualTotal: number;
  annualPerCapita: number;
  remainingBudget: number;
  budgetExceeded: boolean;
  exceededPct: number;
  projection: Array<{
    year: number;
    amount: number;
    variationPct: number;
  }>;
  categoryBreakdown: Array<{
    name: string;
    amount: number;
    percentage: number;
  }>;
}

export interface VehicleResult {
  id: string;
  name: string;
  monthlyFuelCost: number;
  monthlyMaintenance: number;
  monthlyInsurance: number;
  monthlyIpva: number;
  monthlyDepreciation: number;
  totalMonthly: number;
  totalAnnual: number;
  costPerKm: number;
}

export interface BudgetResult {
  monthlyConsumptionKwh: number;
  annualConsumptionKwh: number;
  monthlyCost: number;
  annualCost: number;
  pvProductionYear: number;
  energyUsedOnSiteYear: number;
  energyExportedYear: number;
  annualSavings: number;
  paybackYears: number | null;
  lcoe: number | null;
  monthlyData: Array<{
    month: string;
    consumption: number;
    generation: number;
    export: number;
    costRede: number;
    costWithPV: number;
  }>;
  market?: MarketResult;
  vehicles?: {
    list: VehicleResult[];
    totalMonthly: number;
    totalAnnual: number;
  };
}
