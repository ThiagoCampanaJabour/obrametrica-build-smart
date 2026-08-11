import { 
  BudgetWorkbook, 
  BudgetWorkbookSchema
} from '../types/budget-sheets';
import { v4 as uuidv4 } from 'uuid';

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
    // Garante campos opcionais
    migrated.sheets = migrated.sheets.map((s: any) => ({
      ...s,
      mode: s.mode || 'detailed',
      rows: s.rows.map((r: any) => ({
        ...r,
        periodicity: r.periodicity || 'mensal'
      }))
    }));
  }

  return BudgetWorkbookSchema.parse(migrated);
}

/**
 * Salva o workbook no localStorage de forma atômica e robusta
 */
export function atomicSaveWorkbook(workbook: BudgetWorkbook, isCopy = false) {
  try {
    const id = isCopy ? uuidv4() : workbook.id;
    const timestamp = new Date().toISOString();
    const saveId = isCopy ? id : workbook.id;
    const key = `obrametrica_workbook_${saveId}`;
    const tempKey = `obrametrica_workbook_tmp_${saveId}`;
    
    const dataToSave = { 
      ...workbook, 
      id: saveId,
      updatedAt: timestamp,
      schemaVersion: 1 
    };
    const json = JSON.stringify(dataToSave);

    // 1. Tenta salvar em chave temporária primeiro
    try {
      localStorage.setItem(tempKey, json);
    } catch (e) {
      if (e instanceof Error && e.name === 'QuotaExceededError') {
        throw new Error("QUOTA_EXCEEDED");
      }
      throw e;
    }

    // 2. Move para a chave final
    localStorage.setItem(key, json);
    localStorage.removeItem(tempKey);

    // 3. Atualiza latest pointer
    localStorage.setItem(STORAGE_LATEST_KEY, json);

    // 4. Atualiza o índice
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
