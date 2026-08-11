import { 
  SheetRow, 
  Sheet, 
  BudgetWorkbook, 
  SheetTotals, 
  WorkbookTotals,
  BudgetWorkbookSchema
} from '../types/budget-sheets';
import { v4 as uuidv4 } from 'uuid';

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
      perCapita: 0 
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

const STORAGE_INDEX_KEY = 'obrametrica_workbook_index';
const STORAGE_LATEST_KEY = 'obrametrica_workbook_latest';

export interface SavedScenarioInfo {
  id: string;
  name: string;
  description?: string | null;
  tags?: string[] | null;
  createdAt: string;
  updatedAt: string;
  key: string;
  schemaVersion: number;
}

/**
 * Migrador de schema para garantir retrocompatibilidade
 */
export function migrateWorkbook(data: any): BudgetWorkbook {
  const version = data.schemaVersion || 0;
  let migrated = { ...data };

  if (version < 1) {
    migrated.schemaVersion = 1;
    migrated.description = migrated.description || "";
    migrated.tags = migrated.tags || [];
    migrated.sheets = migrated.sheets?.map((s: any) => ({
      ...s,
      mode: s.mode || 'detailed',
      rows: s.rows?.map((r: any) => ({
        ...r,
        periodicity: r.periodicity || 'mensal'
      })) || []
    })) || [];
  }

  return BudgetWorkbookSchema.parse(migrated);
}

/**
 * Salva o workbook no localStorage de forma atômica e robusta
 */
export function atomicSaveWorkbook(workbook: BudgetWorkbook, isCopy = false) {
  try {
    const saveId = isCopy ? uuidv4() : workbook.id;
    const timestamp = new Date().toISOString();
    const key = `obrametrica_workbook_${saveId}`;
    const tempKey = `obrametrica_workbook_tmp_${saveId}`;
    
    const dataToSave = { 
      ...workbook, 
      id: saveId,
      updatedAt: timestamp,
      schemaVersion: 1 
    };
    const json = JSON.stringify(dataToSave);

    try {
      localStorage.setItem(tempKey, json);
    } catch (e) {
      if (e instanceof Error && e.name === 'QuotaExceededError') {
        throw new Error("QUOTA_EXCEEDED");
      }
      throw e;
    }

    localStorage.setItem(key, json);
    localStorage.removeItem(tempKey);
    localStorage.setItem(STORAGE_LATEST_KEY, json);

    const indexRaw = localStorage.getItem(STORAGE_INDEX_KEY);
    let index: SavedScenarioInfo[] = indexRaw ? JSON.parse(indexRaw) : [];
    
    index = index.filter(item => item.id !== saveId);
    index.unshift({
      id: saveId,
      name: workbook.name,
      description: workbook.description,
      tags: workbook.tags,
      createdAt: isCopy ? timestamp : workbook.createdAt,
      updatedAt: timestamp,
      key: key,
      schemaVersion: 1
    });

    if (index.length > 50) index = index.slice(0, 50);
    localStorage.setItem(STORAGE_INDEX_KEY, JSON.stringify(index));
    
    return { success: true, id: saveId, data: dataToSave };
  } catch (error) {
    console.error("Erro ao salvar workbook", error);
    throw error;
  }
}

export function listSavedScenarios(): SavedScenarioInfo[] {
  try {
    const indexRaw = localStorage.getItem(STORAGE_INDEX_KEY);
    return indexRaw ? JSON.parse(indexRaw) : [];
  } catch (e) {
    return [];
  }
}

export function loadWorkbookById(id: string): BudgetWorkbook | null {
  try {
    const key = `obrametrica_workbook_${id}`;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return migrateWorkbook(JSON.parse(raw));
  } catch (e) {
    console.error("Erro ao carregar", e);
    return null;
  }
}

export function deleteSavedScenario(id: string) {
  const key = `obrametrica_workbook_${id}`;
  localStorage.removeItem(key);
  
  const indexRaw = localStorage.getItem(STORAGE_INDEX_KEY);
  if (indexRaw) {
    const index: SavedScenarioInfo[] = JSON.parse(indexRaw);
    const newIndex = index.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_INDEX_KEY, JSON.stringify(newIndex));
  }
}

export function renameSavedScenario(id: string, newName: string) {
  const workbook = loadWorkbookById(id);
  if (workbook) {
    atomicSaveWorkbook({ ...workbook, name: newName });
  }
}

export function duplicateSavedScenario(id: string) {
  const workbook = loadWorkbookById(id);
  if (workbook) {
    return atomicSaveWorkbook({ ...workbook, name: `${workbook.name} (Cópia)` }, true);
  }
  return null;
}
