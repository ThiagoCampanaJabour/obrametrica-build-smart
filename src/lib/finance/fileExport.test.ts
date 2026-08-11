import { describe, it, expect } from 'vitest';
import { 
  sanitizeFilename, 
  convertToCSV, 
  prepareWorkbookForExport 
} from '../utils/fileExport';
import { BudgetWorkbook } from '../types/budget-sheets';

describe('File Export Utils', () => {
  describe('sanitizeFilename', () => {
    it('replaces spaces with underscores', () => {
      expect(sanitizeFilename('meu orcamento')).toBe('meu_orcamento');
    });

    it('removes special characters and path markers', () => {
      expect(sanitizeFilename('orcamento/2024*?')).toBe('orcamento2024');
    });

    it('converts cedilla and accents to base characters', () => {
      expect(sanitizeFilename('promoção_itens')).toBe('promocao_itens');
    });
    
    it('limits length to 200 chars', () => {
      const longName = 'a'.repeat(300);
      expect(sanitizeFilename(longName)).toHaveLength(200);
    });
  });

  describe('convertToCSV', () => {
    it('generates correct header and rows', () => {
      const columns = ['name', 'value'];
      const rows = [{ name: 'Item 1', value: 10 }];
      const csv = convertToCSV(rows, columns);
      
      expect(csv).toContain('\uFEFFName,Value');
      expect(csv).toContain('Item 1,10');
    });

    it('escapes commas and quotes', () => {
      const columns = ['note'];
      const rows = [{ note: 'A text with , comma and "quotes"' }];
      const csv = convertToCSV(rows, columns);
      
      expect(csv).toContain('"A text with , comma and ""quotes"""');
    });
  });

  describe('prepareWorkbookForExport', () => {
    it('cleans undefined values for clean JSON', () => {
      const workbook: any = {
        id: '1',
        name: 'Test',
        sheets: [{
          id: 's1',
          rows: [{ id: 'r1', category: 'Cat', note: undefined }]
        }]
      };
      
      const prepared = prepareWorkbookForExport(workbook as BudgetWorkbook);
      expect(prepared.sheets[0].rows[0].note).toBeNull();
    });
  });
});
