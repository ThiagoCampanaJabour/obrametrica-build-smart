import { z } from 'zod';

export const VehicleFinancingSchema = z.object({
  financedAmount: z.number().min(0).default(0),
  downPayment: z.number().min(0).default(0),
  annualRatePct: z.number().min(0).default(0),
  termYears: z.number().min(0).default(0),
  amortizationType: z.enum(['PRICE', 'SAC']).default('PRICE'),
});

export const VehicleFiniteItemsSchema = z.object({
  tires: z.object({
    costPerSet: z.number().min(0).default(0),
    replacementIntervalKm: z.number().min(1).default(40000),
    numberOfTires: z.number().int().min(1).default(4),
  }).default({}),
  oilChange: z.object({
    costPerChange: z.number().min(0).default(0),
    intervalKm: z.number().min(1).default(10000),
  }).default({}),
  battery: z.object({
    replaceCost: z.number().min(0).default(0),
    lifetimeYears: z.number().min(1).default(10),
  }).optional(),
});

export const VehicleInputSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['gasolina', 'etanol', 'diesel', 'hibrido', 'eletrico', 'outro']),
  year: z.number().int().min(1900).max(2100).optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  kmPerMonth: z.number().min(0),
  consumptionKmPerL: z.number().min(0.01).optional(),
  consumptionKwhPer100Km: z.number().min(0.01).optional(),
  fuelPricePerL: z.number().min(0).optional(),
  electricityPricePerKwh: z.number().min(0).optional(),
  publicChargingPricePerKwh: z.number().min(0).optional(),
  chargingEfficiencyPct: z.number().min(1).max(100).default(95),
  
  maintenanceMonthly: z.number().min(0).default(0),
  maintenanceAnnual: z.number().min(0).default(0),
  insuranceAnnual: z.number().min(0).default(0),
  ipvaAnnual: z.number().min(0).default(0),
  licensingAnnual: z.number().min(0).default(0),
  
  vehicleValue: z.number().min(0).optional(),
  depreciationRateAnnualPct: z.number().min(0).optional(),
  usefulLifeYears: z.number().min(1).optional(),
  residualValue: z.number().min(0).optional(),
  
  financing: VehicleFinancingSchema.optional(),
  finiteItems: VehicleFiniteItemsSchema.optional(),
  
  parkingMonthly: z.number().min(0).default(0),
  tollsMonthly: z.number().min(0).default(0),
  carWashMonthly: z.number().min(0).default(0),
  otherMonthly: z.number().min(0).default(0),
  notes: z.string().optional(),
});

export type VehicleInput = z.infer<typeof VehicleInputSchema>;

export interface VehicleBreakdown {
  fuel: number;
  energy: number;
  maintenance: number;
  tires: number;
  oil: number;
  insurance: number;
  ipva: number;
  financing: number;
  depreciation: number;
  parking: number;
  tolls: number;
  other: number;
  total: number;
}

export interface VehicleResult {
  id: string;
  name: string;
  type: string;
  monthly: VehicleBreakdown;
  annual: VehicleBreakdown;
  costPerKm: number | null;
  shares: {
    fuel: number;
    maintenance: number;
    taxes: number;
    depreciation: number;
    financing: number;
    admin: number;
  };
}
