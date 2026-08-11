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

const STORAGE_INDEX_KEY = 'obrametrica_workbook_index';
const STORAGE_LATEST_KEY = 'obrametrica_workbook_latest';

export interface SavedScenarioInfo {
  id: string;
  name: string;
  createdAt: string;
  key: string;
}

/**
 * Salva o workbook no localStorage e atualiza o índice
 */
export function saveWorkbookToStorage(workbook: BudgetWorkbook) {
  try {
    const timestamp = new Date().toISOString();
    const key = `obrametrica_workbook_${timestamp.replace(/[:.]/g, '-')}`;
    const data = JSON.stringify(workbook);

    // 1. Salva o cenário específico
    localStorage.setItem(key, data);

    // 2. Salva como latest
    localStorage.setItem(STORAGE_LATEST_KEY, data);

    // 3. Atualiza o índice
    const indexRaw = localStorage.getItem(STORAGE_INDEX_KEY);
    let index: SavedScenarioInfo[] = indexRaw ? JSON.parse(indexRaw) : [];
    
    // Evita duplicados por ID (atualiza se já existe)
    index = index.filter(item => item.id !== workbook.id);
    index.unshift({
      id: workbook.id,
      name: workbook.name,
      createdAt: timestamp,
      key: key
    });

    // Mantém apenas os últimos 20
    if (index.length > 20) index = index.slice(0, 20);
    
    localStorage.setItem(STORAGE_INDEX_KEY, JSON.stringify(index));
    
    return { success: true, key };
  } catch (error) {
    console.error("Erro ao salvar no localStorage", error);
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      throw new Error("Espaço insuficiente no navegador para salvar.");
    }
    throw error;
  }
}

/**
 * Carrega a lista de cenários salvos
 */
export function getSavedScenarios(): SavedScenarioInfo[] {
  try {
    const indexRaw = localStorage.getItem(STORAGE_INDEX_KEY);
    return indexRaw ? JSON.parse(indexRaw) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Carrega um workbook específico
 */
export function loadWorkbookFromStorage(keyOrData: string, isData = false): BudgetWorkbook | null {
  try {
    const raw = isData ? keyOrData : localStorage.getItem(keyOrData);
    if (!raw) return null;
    
    const parsed = JSON.parse(raw);
    // Validação básica com Zod
    const validated = BudgetWorkbookSchema.parse(parsed);
    return validated;
  } catch (e) {
    console.error("Erro ao carregar workbook", e);
    return null;
  }
}

