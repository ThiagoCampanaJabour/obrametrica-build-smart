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
  Users, 
  Trash2,
  PieChart,
  FolderOpen,
  ChevronDown,
  Settings,
  History,
  Copy,
  Download,
  Upload
} from "lucide-react";
import { BudgetWorkbook, Sheet, SheetRow } from '@/lib/types/budget-sheets';
import { 
  calculateWorkbookTotals, 
  atomicSaveWorkbook, 
  listSavedScenarios,
  loadWorkbookById,
  migrateWorkbook,
  SavedScenarioInfo,
  deleteSavedScenario,
  duplicateSavedScenario
} from '@/lib/finance/budgetSheets';
import { toast } from "sonner";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

// Componentes internos
import { SheetTable } from './SheetTable';
import { EditableTabTrigger } from './EditableTabTrigger';
import { ExportControls } from './ExportControls';

export function SpreadsheetBudget() {
  const [workbook, setWorkbook] = useState<BudgetWorkbook | null>(null);
  const [activeTab, setActiveTab] = useState<string>("");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [savedScenarios, setSavedScenarios] = useState<SavedScenarioInfo[]>([]);
  
  // Modais
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isSavesListOpen, setIsSavesListOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Form de Save
  const [saveName, setSaveName] = useState("");
  const [saveDesc, setSaveDesc] = useState("");
  
  // Autosave
  const [autosaveEnabled, setAutosaveEnabled] = useState(false);

  useEffect(() => {
    setSavedScenarios(listSavedScenarios());
    const settings = localStorage.getItem('obrametrica_settings');
    if (settings) {
      const parsed = JSON.parse(settings);
      setAutosaveEnabled(parsed.autosave || false);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('obrametrica_workbook_latest');
    if (saved) {
      try {
        const loaded = migrateWorkbook(JSON.parse(saved));
        if (loaded) {
          setWorkbook(loaded);
          setActiveTab(loaded.sheets[0]?.id || "resumo");
        }
      } catch (e) {
        console.error("Erro ao carregar workbook", e);
      }
    } else {
      const initial: BudgetWorkbook = {
        id: crypto.randomUUID(),
        name: "Meu Orçamento",
        members: 1,
        inflationRateAnnualPct: 4.5,
        schemaVersion: 1,
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

  // Efeito de Autosave
  useEffect(() => {
    if (!autosaveEnabled || !workbook) return;

    const timer = setTimeout(() => {
      try {
        atomicSaveWorkbook(workbook);
      } catch (e) {
        console.error("Erro no autosave", e);
      }
    }, 5000); // 5 segundos de idle

    return () => clearTimeout(timer);
  }, [workbook, autosaveEnabled]);

  const handleOpenSaveModal = () => {
    if (!workbook) return;
    setSaveName(workbook.name || "Orçamento — ");
    setSaveDesc(workbook.description || "");
    setIsSaveModalOpen(true);
  };

  const confirmSave = (isCopy = false) => {
    if (!workbook || !saveName.trim()) return;

    try {
      const updated = { 
        ...workbook, 
        name: saveName.trim(),
        description: saveDesc.trim(),
        updatedAt: new Date().toISOString() 
      };
      const result = atomicSaveWorkbook(updated, isCopy);
      setWorkbook(result.data);
      setSavedScenarios(listSavedScenarios());
      setIsSaveModalOpen(false);
      toast.success(isCopy ? "Cópia salva com sucesso!" : "Orçamento salvo!");
    } catch (e) {
      if (e instanceof Error && e.message === "QUOTA_EXCEEDED") {
        toast.error("Espaço insuficiente no navegador. Exporte para JSON para não perder os dados.");
      } else {
        toast.error("Erro ao salvar orçamento.");
      }
    }
  };

  const handleSettingsChange = (key: string, value: any) => {
    const settings = JSON.parse(localStorage.getItem('obrametrica_settings') || '{}');
    settings[key] = value;
    localStorage.setItem('obrametrica_settings', JSON.stringify(settings));
    if (key === 'autosave') setAutosaveEnabled(value);
  };

  const handleDuplicate = (id: string) => {
    try {
      duplicateSavedScenario(id);
      setSavedScenarios(listSavedScenarios());
      toast.success("Cenário duplicado!");
    } catch (e) {
      toast.error("Erro ao duplicar.");
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Deseja realmente excluir este cenário?")) {
      deleteSavedScenario(id);
      setSavedScenarios(listSavedScenarios());
      toast.success("Cenário excluído.");
    }
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
    setIsAddingNew(true);
  };

  const renameSheet = (id: string, newName: string) => {
    if (!workbook) return;
    const nameExists = workbook.sheets.some(s => s.id !== id && s.name.trim().toLowerCase() === newName.trim().toLowerCase());
    if (nameExists) {
      toast.error("Já existe outra aba com este nome.");
      return;
    }
    const updatedSheets = workbook.sheets.map(s => s.id === id ? { ...s, name: newName } : s);
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
    if (activeTab === id) setActiveTab(updated.sheets[0].id);
  };

  const handleRowsChange = (sheetId: string, newRows: SheetRow[]) => {
    if (!workbook) return;
    const updatedSheets = workbook.sheets.map(s => s.id === sheetId ? { ...s, rows: newRows } : s);
    setWorkbook({ ...workbook, sheets: updatedSheets });
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const loaded = migrateWorkbook(JSON.parse(json));
        setWorkbook(loaded);
        setActiveTab(loaded.sheets[0]?.id || "resumo");
        toast.success("Orçamento importado com sucesso!");
      } catch (err) {
        toast.error("Falha ao importar JSON: arquivo inválido ou corrompido.");
      }
    };
    reader.readAsText(file);
  };

  if (!workbook) return <div className="p-8 text-center">Carregando...</div>;

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
                  data-testid="workbook-members"
                /> membros
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsSavesListOpen(true)} data-testid="workbook-history-button">
            <History className="h-4 w-4 mr-2" /> Histórico
          </Button>

          <Button variant="outline" size="sm" onClick={() => addSheet()} data-testid="sheet-add-button">
            <Plus className="h-4 w-4 mr-2" /> Nova Aba
          </Button>

          <Button 
            variant="default" 
            size="sm" 
            onClick={handleOpenSaveModal} 
            data-testid="workbook-save-button"
            className="bg-primary hover:bg-primary/90"
          >
            <Save className="h-4 w-4 mr-2" /> Salvar
          </Button>
          
          <ExportControls workbook={workbook} activeSheetId={activeTab} />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Configurações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem 
                checked={autosaveEnabled}
                onCheckedChange={(checked) => handleSettingsChange('autosave', checked)}
                data-testid="workbook-autosave-toggle"
              >
                Autosave (5s idle)
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <div className="p-2">
                <Label htmlFor="import-json" className="cursor-pointer flex items-center gap-2 text-sm">
                  <Upload className="h-4 w-4" /> Importar JSON
                  <Input 
                    id="import-json" 
                    type="file" 
                    accept=".json" 
                    className="hidden" 
                    onChange={handleImportJSON}
                    data-testid="workbook-import-json"
                  />
                </Label>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
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
                    if (isAddingNew && activeTab === sheet.id) removeSheet(sheet.id);
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

      {/* Modal de Salvar */}
      <Dialog open={isSaveModalOpen} onOpenChange={setIsSaveModalOpen}>
        <DialogContent data-testid="workbook-save-modal">
          <DialogHeader>
            <DialogTitle>Salvar Orçamento</DialogTitle>
            <DialogDescription>
              Os dados ficam apenas no seu navegador (localStorage).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="save-name">Nome do Cenário</Label>
              <Input 
                id="save-name" 
                value={saveName} 
                onChange={(e) => setSaveName(e.target.value.substring(0, 100))}
                placeholder="Ex: Orçamento Agosto 2026"
                data-testid="workbook-save-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="save-desc">Descrição (Opcional)</Label>
              <Textarea 
                id="save-desc" 
                value={saveDesc} 
                onChange={(e) => setSaveDesc(e.target.value)}
                placeholder="Detalhes adicionais sobre este cenário..."
                data-testid="workbook-save-desc"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => confirmSave(true)} data-testid="workbook-save-as-copy">
              Salvar como Cópia
            </Button>
            <Button onClick={() => confirmSave(false)} data-testid="workbook-save-confirm">
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Histórico/Cenários */}
      <Dialog open={isSavesListOpen} onOpenChange={setIsSavesListOpen}>
        <DialogContent className="max-w-2xl" data-testid="workbook-saves-panel">
          <DialogHeader>
            <DialogTitle>Cenários Salvos</DialogTitle>
            <DialogDescription>
              Gerencie seus orçamentos armazenados localmente.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto space-y-2 py-4" data-testid="workbook-saves-list">
            {savedScenarios.length === 0 ? (
              <div className="text-center py-8 text-slate-400">Nenhum cenário encontrado.</div>
            ) : (
              savedScenarios.map(s => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="font-semibold text-slate-900 truncate">{s.name}</p>
                    <p className="text-xs text-slate-500">
                      Atualizado em {new Date(s.updatedAt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => { loadWorkbookById(s.id) && setWorkbook(loadWorkbookById(s.id)); setIsSavesListOpen(false); }}
                      data-testid={`workbook-save-item-${s.id}-load`}
                    >
                      Abrir
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDuplicate(s.id)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(s.id)} data-testid={`workbook-save-item-${s.id}-delete`}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
