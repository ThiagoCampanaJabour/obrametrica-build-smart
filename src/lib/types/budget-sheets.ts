import { z } from 'zod';

export const SheetRowSchema = z.object({
  id: z.string(),
  category: z.string(),
  subcategory: z.string(),
  date: z.string().optional(),
  account: z.string().optional(),
  unit: z.string().optional(),
  quantity: z.number().min(0).optional(),
  unitPrice: z.number().min(0).optional(),
  discountPct: z.number().min(0).max(100).optional(),
  periodicity: z.enum(['mensal', 'bimestral', 'trimestral', 'semestral', 'anual', 'evento']).default('mensal'),
  frequencyMonths: z.number().min(1).optional(),
  frequencyKm: z.number().min(1).optional(),
  total: z.number().optional(),
  note: z.string().optional(),
  tags: z.array(z.string()).optional(),
  paymentMethod: z.string().optional(),
  installments: z.number().optional(),
});

export type SheetRow = z.infer<typeof SheetRowSchema>;

export const SheetSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['Supermercado', 'Casa', 'Veículos', 'Educação', 'Lazer', 'Férias', 'Personalizado']),
  rows: z.array(SheetRowSchema),
  budgetMonthly: z.number().optional(),
  presetId: z.string().optional(),
  mode: z.enum(['detailed', 'direct']).default('detailed'),
  directTotal: z.number().optional(),
  metadata: z.record(z.any()).optional(),
});

export type Sheet = z.infer<typeof SheetSchema>;

export const BudgetWorkbookSchema = z.object({
  id: z.string(),
  name: z.string(),
  members: z.number().min(1).default(1),
  budgetTotalMonthly: z.number().optional(),
  inflationRateAnnualPct: z.number().min(0).default(4.5),
  sheets: z.array(SheetSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type BudgetWorkbook = z.infer<typeof BudgetWorkbookSchema>;

export interface SheetTotals {
  monthly: number;
  annual: number;
  perCapita: number;
}

export interface WorkbookTotals {
  monthly: number;
  annual: number;
  perCapita: number;
  bySheet: Record<string, SheetTotals>;
}
