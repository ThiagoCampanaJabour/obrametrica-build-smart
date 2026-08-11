import { BudgetWorkbook, SheetRow } from '../types/budget-sheets';

/**
 * Sanitiza nomes para uso em nomes de arquivos
 */
export function sanitizeFilename(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^\w-]/g, '')
    .toLowerCase();
}

/**
 * Gera um arquivo e dispara o download no browser
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Converte um array de objetos para CSV (simples)
 */
export function convertToCSV(rows: SheetRow[], columns: string[]): string {
  if (rows.length === 0) return columns.join(',');
  
  const header = columns.join(',');
  const body = rows.map(row => {
    return columns.map(col => {
      const val = (row as any)[col];
      if (val === undefined || val === null) return '';
      // Escapa vírgulas e aspas
      const str = String(val).replace(/"/g, '""');
      return str.includes(',') || str.includes('"') || str.includes('\n') ? `"${str}"` : str;
    }).join(',');
  }).join('\n');
  
  // Adiciona BOM para suporte a caracteres especiais no Excel
  return '\uFEFF' + header + '\n' + body;
}

/**
 * Prepara o workbook para exportação (remove funções, garante tipos)
 */
export function prepareWorkbookForExport(workbook: BudgetWorkbook): any {
  return {
    ...workbook,
    sheets: workbook.sheets.map(sheet => ({
      ...sheet,
      rows: sheet.rows.map(row => ({
        ...row,
        // Garante que campos opcionais não sejam undefined mas sim null ou omitidos para JSON limpo
        date: row.date || null,
        note: row.note || null,
      }))
    }))
  };
}
