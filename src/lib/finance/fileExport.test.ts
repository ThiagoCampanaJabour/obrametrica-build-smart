import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  sanitizeFilename, 
  convertToCSV, 
  prepareWorkbookForExport 
} from '../utils/fileExport';
import { BudgetWorkbook } from '../types/budget-sheets';

describe('fileExport utils', () => {
  it('sanitizeFilename handles spaces and special chars', () => {
    expect(sanitizeFilename('Meu Orçamento! @2026')).toBe('meu_orçamento_2026');
    expect(sanitizeFilename('  Trim  Test  ')).toBe('trim_test');
  });

  it('convertToCSV generates correct content', () => {
    const rows = [
      {
        id: '1',
        category: 'Alimentação',
        subcategory: 'Arroz',
        unit: 'kg',
        quantity: 2,
        unitPrice: 5.5,
        periodicity: 'mensal' as const,
        total: 11,
        note: 'Tipo 1'
      }
    ];
    const columns = ['category', 'subcategory', 'quantity', 'unitPrice', 'total'];
    const csv = convertToCSV(rows as any, columns);
    
    expect(csv).toContain('\uFEFFCategory,Subcategory,Quantity,UnitPrice,Total');
    expect(csv).toContain('Alimentação,Arroz,2,5.5,11');
  });

  it('convertToCSV escapes commas and quotes', () => {
    const rows = [
      {
        id: '1',
        category: 'Teste',
        subcategory: 'Sub, com vírgula',
        unit: 'un',
        quantity: 1,
        unitPrice: 10,
        periodicity: 'mensal' as const,
        total: 10,
        note: 'Nota "com" aspas'
      }
    ];
    const columns = ['subcategory', 'note'];
    const csv = convertToCSV(rows as any, columns);
    
    expect(csv).toContain('"Sub, com vírgula"');
    expect(csv).toContain('"Nota ""com"" aspas"');
  });

  it('prepareWorkbookForExport cleans up data', () => {
    const workbook: BudgetWorkbook = {
      id: 'wb1',
      name: 'Test',
      members: 2,
      inflationRateAnnualPct: 4.5,
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
      sheets: [
        {
          id: 's1',
          name: 'Sheet 1',
          type: 'Personalizado',
          mode: 'detailed',
          rows: [
            {
              id: 'r1',
              category: 'Cat',
              subcategory: 'Sub',
              periodicity: 'mensal'
            }
          ]
        }
      ]
    };
    
    const prepared = prepareWorkbookForExport(workbook);
    expect(prepared.sheets[0].rows[0].date).toBeNull();
    expect(prepared.sheets[0].rows[0].note).toBeNull();
  });
});
