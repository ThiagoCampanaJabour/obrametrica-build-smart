import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  atomicSaveWorkbook, 
  loadWorkbookById, 
  listSavedScenarios 
} from './budgetSheets';
import { BudgetWorkbook } from '../types/budget-sheets';

const mockWorkbook: BudgetWorkbook = {
  id: 'test-id',
  name: 'Test Workbook',
  members: 1,
  inflationRateAnnualPct: 4.5,
  sheets: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  schemaVersion: 1
};

describe('Budget Storage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('saves workbook and updates index', () => {
    const result = atomicSaveWorkbook(mockWorkbook);
    expect(result.success).toBe(true);
    
    const index = listSavedScenarios();
    expect(index).toHaveLength(1);
    expect(index[0].id).toBe(mockWorkbook.id);
    expect(index[0].name).toBe(mockWorkbook.name);
    
    const latest = localStorage.getItem('obrametrica_workbook_latest');
    expect(latest).not.toBeNull();
    expect(JSON.parse(latest!).id).toBe(mockWorkbook.id);
  });

  it('loads workbook from storage by id', () => {
    atomicSaveWorkbook(mockWorkbook);
    const loaded = loadWorkbookById(mockWorkbook.id);
    expect(loaded).not.toBeNull();
    expect(loaded?.id).toBe(mockWorkbook.id);
  });

  it('handles localStorage quota exceeded', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    setItemSpy.mockImplementation(() => {
      const error = new Error('Quota exceeded');
      error.name = 'QuotaExceededError';
      throw error;
    });

    expect(() => atomicSaveWorkbook(mockWorkbook)).toThrow("QUOTA_EXCEEDED");
  });
});
