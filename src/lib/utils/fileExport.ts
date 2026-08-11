import { BudgetWorkbook, SheetRow } from '../types/budget-sheets';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';

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
        date: row.date || null,
        note: row.note || null,
      }))
    }))
  };
}

import JSZip from 'jszip';

/**
 * Sanitiza nomes para uso em nomes de arquivos
 */
export function sanitizeFilename(name: string): string {
  if (!name) return 'arquivo';
  return name
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[çÇ]/g, 'c')
    .replace(/[^\w-]/gi, '')
    .substring(0, 200)
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
 * Converte um array de objetos para CSV com suporte a UTF-8 BOM
 */
export function convertToCSV(rows: any[], columns: string[]): string {
  const header = columns.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(',');
  const body = rows.map(row => {
    return columns.map(col => {
      const val = row[col];
      if (val === undefined || val === null) return '';
      const str = String(val).replace(/"/g, '""');
      return str.includes(',') || str.includes('"') || str.includes('\n') ? `"${str}"` : str;
    }).join(',');
  }).join('\n');
  
  return '\uFEFF' + header + '\n' + body;
}

/**
 * Exporta o workbook completo para JSON
 */
export async function exportToJSON(workbook: BudgetWorkbook) {
  const data = JSON.stringify(workbook, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const filename = `obrametrica_orcamento_${sanitizeFilename(workbook.name)}_${new Date().toISOString().split('T')[0]}.json`;
  downloadBlob(blob, filename);
}

/**
 * Exporta uma aba específica para CSV
 */
export async function exportSheetToCSV(sheetName: string, rows: any[]) {
  const columns = ['category', 'subcategory', 'unit', 'quantity', 'unitPrice', 'periodicity', 'total', 'note'];
  const csv = convertToCSV(rows, columns);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const filename = `obrametrica_orcamento_${sanitizeFilename(sheetName)}_${new Date().toISOString().split('T')[0]}.csv`;
  downloadBlob(blob, filename);
}

/**
 * Exporta o workbook para XLSX usando SheetJS
 */
export async function exportToXLSX(workbook: BudgetWorkbook) {
  const wb = XLSX.utils.book_new();
  
  workbook.sheets.forEach(sheet => {
    const data = sheet.rows.map(row => ({
      Categoria: row.category,
      Subcategoria: row.subcategory,
      Unidade: row.unit,
      Quantidade: row.quantity,
      'Preço Unitário': row.unitPrice,
      Periodicidade: row.periodicity,
      Total: row.total,
      Notas: row.note
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, sheet.name.substring(0, 31));
  });
  
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const filename = `obrametrica_orcamento_${sanitizeFilename(workbook.name)}_${new Date().toISOString().split('T')[0]}.xlsx`;
  downloadBlob(blob, filename);
}

/**
 * Exporta tudo como ZIP
 */
export async function exportAllAsZIP(workbook: BudgetWorkbook) {
  const zip = new JSZip();
  
  // JSON
  zip.file("orcamento.json", JSON.stringify(workbook, null, 2));
  
  // CSVs
  const csvFolder = zip.folder("csvs");
  workbook.sheets.forEach(sheet => {
    const columns = ['category', 'subcategory', 'unit', 'quantity', 'unitPrice', 'periodicity', 'total', 'note'];
    const csv = convertToCSV(sheet.rows, columns);
    csvFolder?.file(`${sanitizeFilename(sheet.name)}.csv`, csv);
  });
  
  const content = await zip.generateAsync({ type: "blob" });
  const filename = `obrametrica_orcamento_completo_${sanitizeFilename(workbook.name)}.zip`;
  downloadBlob(content, filename);
}
