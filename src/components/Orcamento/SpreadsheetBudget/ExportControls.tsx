import React from 'react';
import { 
  Download, 
  FileJson, 
  FileSpreadsheet, 
  Archive,
  ChevronDown,
  FileText
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
import { BudgetWorkbook } from '@/lib/types/budget-sheets';
import { 
  exportToJSON,
  exportSheetToCSV,
  exportToXLSX,
  exportAllAsZIP
} from '@/lib/utils/fileExport';
import { toast } from "sonner";

interface ExportControlsProps {
  workbook: BudgetWorkbook;
  activeSheetId: string;
}

export function ExportControls({ workbook, activeSheetId }: ExportControlsProps) {
  const currentSheet = workbook.sheets.find(s => s.id === activeSheetId);
  
  const handleExportJSON = async () => {
    try {
      await exportToJSON(workbook);
      toast.success("JSON exportado!");
    } catch (e) {
      toast.error("Erro ao exportar JSON");
    }
  };

  const handleExportCSV = async () => {
    if (!currentSheet) return;
    try {
      await exportSheetToCSV(currentSheet.name, currentSheet.rows);
      toast.success(`CSV da aba "${currentSheet.name}" exportado!`);
    } catch (e) {
      toast.error("Erro ao exportar CSV");
    }
  };

  const handleExportXLSX = async () => {
    try {
      await exportToXLSX(workbook);
      toast.success("Excel (XLSX) exportado!");
    } catch (e) {
      toast.error("Erro ao exportar Excel");
    }
  };

  const handleExportZIP = async () => {
    try {
      await exportAllAsZIP(workbook);
      toast.success("ZIP completo exportado!");
    } catch (e) {
      toast.error("Erro ao gerar ZIP");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" data-testid="workbook-export-button">
          <Download className="h-4 w-4 mr-2" /> Exportar <ChevronDown className="ml-1 h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56" data-testid="workbook-export-modal">
        <DropdownMenuLabel>Opções de Exportação</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleExportJSON} data-testid="workbook-export-json">
          <FileJson className="mr-2 h-4 w-4 text-amber-500" />
          <span>Exportar JSON</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleExportXLSX} data-testid="workbook-export-xlsx">
          <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
          <span>Exportar Excel (XLSX)</span>
        </DropdownMenuItem>

        {currentSheet && (
          <DropdownMenuItem onClick={handleExportCSV} data-testid="workbook-export-csv">
            <FileText className="mr-2 h-4 w-4 text-blue-500" />
            <span>CSV (Aba Atual)</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleExportZIP} data-testid="workbook-export-zip">
          <Archive className="mr-2 h-4 w-4 text-slate-600" />
          <span>Exportar Tudo (ZIP)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
