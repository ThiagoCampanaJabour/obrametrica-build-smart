import React, { useState, useEffect } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Save, 
  Download, 
  Upload, 
  Users, 
  Trash2,
  PieChart,
  FolderOpen
} from "lucide-react";
import { BudgetWorkbook, Sheet, SheetRow } from '@/lib/types/budget-sheets';
import { 
  calculateWorkbookTotals, 
  saveWorkbookToStorage, 
  getSavedScenarios,
  loadWorkbookFromStorage,
  SavedScenarioInfo
} from '@/lib/finance/budgetSheets';
import { toast } from "sonner";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";

// Componentes internos
import { SheetTable } from './SheetTable';
import { EditableTabTrigger } from './EditableTabTrigger';
import { ExportControls } from './ExportControls';




export function SpreadsheetBudget() {
  const [workbook, setWorkbook] = useState<BudgetWorkbook | null>(null);
  const [activeTab, setActiveTab] = useState<string>("");
  const [isAddingNew, setIsAddingNew] = useState(false);


  useEffect(() => {
    const saved = localStorage.getItem('obrametrica_workbook_main');
    if (saved) {
      try {
        setWorkbook(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar workbook", e);
      }
    } else {
      // Workbook inicial
      const initial: BudgetWorkbook = {
        id: crypto.randomUUID(),
        name: "Meu Orçamento",
        members: 1,
        inflationRateAnnualPct: 4.5,
        sheets: [
          {
            id: crypto.randomUUID(),
            name: "Supermercado",
            type: "Supermercado",
            rows: [],
            mode: 'detailed'
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setWorkbook(initial);
      setActiveTab(initial.sheets[0].id);
    }
  }, []);

  const saveWorkbook = () => {
    if (!workbook) return;
    const updated = { ...workbook, updatedAt: new Date().toISOString() };
    localStorage.setItem('obrametrica_workbook_main', JSON.stringify(updated));
    setWorkbook(updated);
    toast.success("Orçamento salvo com sucesso!");
  };

  const addSheet = (type: Sheet['type'] = 'Personalizado') => {
    if (!workbook) return;
    const newSheet: Sheet = {
      id: crypto.randomUUID(),
      name: `Nova Aba`,
      type,
      rows: [],
      mode: 'detailed'
    };
    const updated = {
      ...workbook,
      sheets: [...workbook.sheets, newSheet]
    };
    setWorkbook(updated);
    setActiveTab(newSheet.id);
    setIsAddingNew(true); // Ativa o modo de edição no TabsBar
  };

  const renameSheet = (id: string, newName: string) => {
    if (!workbook) return;
    
    // Verifica duplicatas
    const nameExists = workbook.sheets.some(s => s.id !== id && s.name.trim().toLowerCase() === newName.trim().toLowerCase());
    if (nameExists) {
      toast.error("Já existe outra aba com este nome.");
      return;
    }

    const updatedSheets = workbook.sheets.map(s => {
      if (s.id === id) {
        return { ...s, name: newName };
      }
      return s;
    });
    setWorkbook({ ...workbook, sheets: updatedSheets });
    setIsAddingNew(false);
  };


  const removeSheet = (id: string) => {
    if (!workbook || workbook.sheets.length <= 1) return;
    const updated = {
      ...workbook,
      sheets: workbook.sheets.filter(s => s.id !== id)
    };
    setWorkbook(updated);
    if (activeTab === id) {
      setActiveTab(updated.sheets[0].id);
    }
  };

  const handleRowsChange = (sheetId: string, newRows: SheetRow[]) => {
    if (!workbook) return;
    const updatedSheets = workbook.sheets.map(s => {
      if (s.id === sheetId) {
        return { ...s, rows: newRows };
      }
      return s;
    });
    setWorkbook({ ...workbook, sheets: updatedSheets });
  };



  if (!workbook) return <div>Carregando...</div>;

  const totals = calculateWorkbookTotals(workbook);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900">{workbook.name}</h2>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <Input 
                  type="number" 
                  value={workbook.members} 
                  onChange={(e) => setWorkbook({ ...workbook, members: Number(e.target.value) })}
                  className="w-16 h-8 p-1 inline-flex"
                /> membros
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => addSheet()} data-testid="sheet-add-button">
            <Plus className="h-4 w-4 mr-2" /> Nova Aba
          </Button>

          <Button variant="outline" size="sm" onClick={saveWorkbook}>
            <Save className="h-4 w-4 mr-2" /> Salvar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" /> Exportar
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between overflow-x-auto pb-2 mb-4 scrollbar-hide">
          <TabsList className="bg-slate-100 p-1 h-auto flex-nowrap">
            {workbook.sheets.map((sheet, index) => (
              <TabsTrigger 
                key={sheet.id} 
                value={sheet.id}
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-4 py-2 text-sm font-medium transition-all"
              >
                <EditableTabTrigger
                  id={sheet.id}
                  name={sheet.name}
                  index={index}
                  isActive={activeTab === sheet.id}
                  isRenameable={true}
                  isNew={isAddingNew && activeTab === sheet.id}
                  onRename={(newName) => renameSheet(sheet.id, newName)}
                  onCancelNew={() => {
                    if (isAddingNew && activeTab === sheet.id) {
                      removeSheet(sheet.id);
                    }
                    setIsAddingNew(false);
                  }}
                />
              </TabsTrigger>
            ))}

            <TabsTrigger 
              value="resumo"
              className="data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-2 text-sm font-medium"
            >
              <PieChart className="h-4 w-4 mr-2" /> Resumo
            </TabsTrigger>
          </TabsList>
        </div>

        {workbook.sheets.map((sheet) => (
          <TabsContent key={sheet.id} value={sheet.id} className="mt-0 focus-visible:outline-none">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="space-y-1">
                  <CardTitle className="text-2xl font-bold">{sheet.name}</CardTitle>
                  <CardDescription>Gerencie seus gastos de {sheet.type.toLowerCase()}</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeSheet(sheet.id)} className="text-slate-400 hover:text-red-500">
                  <Trash2 className="h-5 w-5" />
                </Button>
              </CardHeader>
              <CardContent>
                <SheetTable 
                  rows={sheet.rows} 
                  onChange={(newRows) => handleRowsChange(sheet.id, newRows)} 
                  type={sheet.type}
                />
              </CardContent>

            </Card>
          </TabsContent>
        ))}

        <TabsContent value="resumo" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Resumo Geral do Orçamento</CardTitle>
              <CardDescription>Agregado de todas as abas e métricas per capita</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
                  <p className="text-sm font-medium text-primary uppercase">Total Mensal</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totals.monthly)}
                  </p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-sm font-medium text-slate-500 uppercase">Per Capita</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totals.perCapita)}
                  </p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-sm font-medium text-slate-500 uppercase">Projeção Anual</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totals.annual)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
