import { z } from 'zod';

export const SheetRowSchema = z.object({
  id: z.string(),
  category: z.string(),
  subcategory: z.string(),
  date: z.string().optional().nullable(),
  account: z.string().optional().nullable(),
  unit: z.string().optional().nullable(),
  quantity: z.number().min(0).optional().nullable(),
  unitPrice: z.number().min(0).optional().nullable(),
  discountPct: z.number().min(0).max(100).optional().nullable(),
  periodicity: z.enum(['mensal', 'bimestral', 'trimestral', 'semestral', 'anual', 'evento']).default('mensal'),
  frequencyMonths: z.number().min(1).optional().nullable(),
  frequencyKm: z.number().min(1).optional().nullable(),
  total: z.number().optional().nullable(),
  note: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  paymentMethod: z.string().optional().nullable(),
  installments: z.number().optional().nullable(),
});

export type SheetRow = z.infer<typeof SheetRowSchema>;

export const SheetSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['Supermercado', 'Casa', 'Veículos', 'Educação', 'Lazer', 'Férias', 'Personalizado']),
  rows: z.array(SheetRowSchema),
  budgetMonthly: z.number().optional().nullable(),
  presetId: z.string().optional().nullable(),
  mode: z.enum(['detailed', 'direct']).default('detailed'),
  directTotal: z.number().optional().nullable(),
  metadata: z.record(z.any()).optional().nullable(),
});

export type Sheet = z.infer<typeof SheetSchema>;

export const BudgetWorkbookSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(),
  members: z.number().min(1).default(1),
  budgetTotalMonthly: z.number().optional().nullable(),
  inflationRateAnnualPct: z.number().min(0).default(4.5),
  sheets: z.array(SheetSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
  schemaVersion: z.number().default(1),
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
