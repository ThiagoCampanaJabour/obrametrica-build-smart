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
  overlapFactor: z.number().min(0).max(1).default(0.45), // 0.45 residencial, 0.7 comercial
  creditRate: z.number().min(0).optional(), // Se null, usa tarifa 1:1
});

export type PVInput = z.infer<typeof PVInputSchema>;

export const BudgetInputSchema = z.object({
  consumptionMode: z.enum(['direct', 'appliances']),
  monthlyKwh: z.number().min(0).optional(),
  appliances: z.array(ApplianceSchema).default([]),
  tariff: z.number().min(0).default(0.85),
  taxPct: z.number().min(0).max(100).default(25),
  pv: PVInputSchema.optional(),
});

export type BudgetInput = z.infer<typeof BudgetInputSchema>;

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
}
