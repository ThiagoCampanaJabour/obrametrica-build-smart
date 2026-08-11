import React from 'react';
import { 
  Download, 
  FileJson, 
  FileSpreadsheet, 
  Archive,
  ChevronDown
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BudgetWorkbook, Sheet } from '@/lib/types/budget-sheets';
import { 
  sanitizeFilename, 
  downloadBlob, 
  convertToCSV, 
  prepareWorkbookForExport 
} from '@/lib/utils/fileExport';
import { toast } from "sonner";

interface ExportControlsProps {
  workbook: BudgetWorkbook;
  activeSheetId: string;
}

export function ExportControls({ workbook, activeSheetId }: ExportControlsProps) {
  const currentSheet = workbook.sheets.find(s => s.id === activeSheetId);
  
  const exportJSON = () => {
    try {
      const exportData = prepareWorkbookForExport(workbook);
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const filename = `obrametrica_orcamento_${sanitizeFilename(workbook.name)}_${new Date().toISOString().split('T')[0]}.json`;
      
      downloadBlob(blob, filename);
      toast.success("JSON exportado com sucesso!");
    } catch (e) {
      toast.error("Erro ao exportar JSON");
    }
  };

  const exportCSV = (sheet: Sheet) => {
    try {
      const columns = [
        'category', 'subcategory', 'unit', 'quantity', 
        'unitPrice', 'periodicity', 'total', 'note'
      ];
      
      const csv = convertToCSV(sheet.rows, columns);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const filename = `obrametrica_orcamento_${sanitizeFilename(sheet.name)}_${new Date().toISOString().split('T')[0]}.csv`;
      
      downloadBlob(blob, filename);
      toast.success(`CSV da aba "${sheet.name}" exportado!`);
    } catch (e) {
      toast.error("Erro ao exportar CSV");
    }
  };

  const exportAll = () => {
    // Como não temos lib de ZIP instalada e a regra prefere não adicionar novas, 
    // vamos exportar um JSON combinado (que é o padrão do exportJSON atual)
    // Mas se o usuário quiser especificamente "Exportar Tudo", podemos garantir que inclua totais calculados se necessário.
    exportJSON();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" data-testid="workbook-export-trigger">
          <Download className="h-4 w-4 mr-2" /> Exportar <ChevronDown className="ml-1 h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Opções de Exportação</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={exportJSON} data-testid="workbook-export-json">
          <FileJson className="mr-2 h-4 w-4" />
          <span>Exportar JSON (Full)</span>
        </DropdownMenuItem>

        {currentSheet && (
          <DropdownMenuItem 
            onClick={() => exportCSV(currentSheet)} 
            data-testid={`workbook-export-csv-${activeSheetId}`}
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            <span>CSV: Aba Atual</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={exportAll} data-testid="workbook-export-all">
          <Archive className="mr-2 h-4 w-4" />
          <span>Exportar Tudo (JSON)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
