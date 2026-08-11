import { 
  SheetRow, 
  Sheet, 
  BudgetWorkbook, 
  SheetTotals, 
  WorkbookTotals,
  BudgetWorkbookSchema
} from '../types/budget-sheets';
import { toast } from "sonner";



/**
 * Normaliza valores anuais para mensais
 */
export function normalizeAnnualToMonthly(value: number): number {
  return value / 12;
}

/**
 * Amortiza um evento pelo intervalo em meses
 */
export function amortizeEventByInterval(value: number, intervalMonths: number): number {
  if (intervalMonths <= 0) return value;
  return value / intervalMonths;
}

/**
 * Amortiza um evento pelo intervalo em KM e uso mensal
 */
export function amortizeEventByKm(value: number, intervalKm: number, kmPerMonth: number): number {
  if (intervalKm <= 0) return 0;
  return value * (kmPerMonth / intervalKm);
}

/**
 * Calcula o total de uma linha
 */
export function calcRowTotal(row: Partial<SheetRow>): number {
  const quantity = row.quantity || 0;
  const unitPrice = row.unitPrice || 0;
  const discountPct = row.discountPct || 0;
  
  const baseTotal = quantity * unitPrice;
  return baseTotal * (1 - discountPct / 100);
}

/**
 * Normaliza o total de uma linha para mensal baseada na periodicidade
 */
export function normalizeRowToMonthly(row: SheetRow, context?: { kmPerMonth?: number }): number {
  const rowTotal = row.total ?? calcRowTotal(row);
  
  switch (row.periodicity) {
    case 'mensal':
      return rowTotal;
    case 'bimestral':
      return rowTotal / 2;
    case 'trimestral':
      return rowTotal / 3;
    case 'semestral':
      return rowTotal / 6;
    case 'anual':
      return rowTotal / 12;
    case 'evento':
      if (row.frequencyMonths) {
        return amortizeEventByInterval(rowTotal, row.frequencyMonths);
      }
      if (row.frequencyKm && context?.kmPerMonth) {
        return amortizeEventByKm(rowTotal, row.frequencyKm, context.kmPerMonth);
      }
      return rowTotal;
    default:
      return rowTotal;
  }
}

/**
 * Calcula os totais de uma aba (Sheet)
 */
export function calculateSheetTotals(sheet: Sheet, workbookContext?: { kmPerMonth?: number }): SheetTotals {
  if (sheet.mode === 'direct') {
    const monthly = sheet.directTotal || 0;
    return {
      monthly,
      annual: monthly * 12,
      perCapita: 0 // Será calculado no nível do workbook
    };
  }
  
  const monthly = sheet.rows.reduce((sum: number, row: SheetRow) => {
    return sum + normalizeRowToMonthly(row, workbookContext);
  }, 0);

  
  return {
    monthly,
    annual: monthly * 12,
    perCapita: 0
  };
}

/**
 * Calcula os totais de todo o Workbook
 */
export function calculateWorkbookTotals(workbook: BudgetWorkbook): WorkbookTotals {
  const bySheet: Record<string, SheetTotals> = {};
  let totalMonthly = 0;
  
  // Primeiro calculamos os totais por aba
  // Nota: Implementação simplificada de kmPerMonth global por enquanto
  const context = { kmPerMonth: 1000 }; 
  
  workbook.sheets.forEach((sheet: Sheet) => {
    const totals = calculateSheetTotals(sheet, context);
    totals.perCapita = totals.monthly / workbook.members;
    bySheet[sheet.id] = totals;
    totalMonthly += totals.monthly;
  });
  
  return {
    monthly: totalMonthly,
    annual: totalMonthly * 12,
    perCapita: totalMonthly / workbook.members,
    bySheet
  };
}

/**
 * Projeção de inflação composta
 */
export function calcInflationProjection(value: number, annualInflationPct: number, years: number): number {
  return value * Math.pow(1 + annualInflationPct / 100, years);
}
