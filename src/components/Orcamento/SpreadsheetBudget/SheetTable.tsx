import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { SheetRow } from '@/lib/types/budget-sheets';
import { calcRowTotal } from '@/lib/finance/budgetSheets';
import { Trash2, Copy, Plus } from "lucide-react";

interface SheetTableProps {
  rows: SheetRow[];
  onChange: (rows: SheetRow[]) => void;
  type: string;
}

export function SheetTable({ rows, onChange, type }: SheetTableProps) {
  const addRow = () => {
    const newRow: SheetRow = {
      id: crypto.randomUUID(),
      category: "Outros",
      subcategory: "",
      unit: "un",
      quantity: 1,
      unitPrice: 0,
      periodicity: 'mensal',
    };
    onChange([...rows, newRow]);
  };

  const updateRow = (id: string, field: keyof SheetRow, value: any) => {
    const updatedRows = rows.map(row => {
      if (row.id === id) {
        const updatedRow = { ...row, [field]: value };
        // Recalcula o total da linha
        updatedRow.total = calcRowTotal(updatedRow);
        return updatedRow;
      }
      return row;
    });
    onChange(updatedRows);
  };

  const removeRow = (id: string) => {
    onChange(rows.filter(r => r.id !== id));
  };

  const duplicateRow = (id: string) => {
    const row = rows.find(r => r.id === id);
    if (row) {
      const newRow = { ...row, id: crypto.randomUUID() };
      onChange([...rows, newRow]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-slate-200 overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[150px]">Categoria</TableHead>
              <TableHead className="w-[200px]">Subcategoria</TableHead>
              <TableHead className="w-[100px]">Unid.</TableHead>
              <TableHead className="w-[100px]">Qtd.</TableHead>
              <TableHead className="w-[120px]">V. Unit.</TableHead>
              <TableHead className="w-[140px]">Periodicidade</TableHead>
              <TableHead className="text-right w-[120px]">Total</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Input 
                    value={row.category} 
                    onChange={(e) => updateRow(row.id, 'category', e.target.value)}
                    className="h-9"
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    value={row.subcategory} 
                    onChange={(e) => updateRow(row.id, 'subcategory', e.target.value)}
                    placeholder="Ex: Arroz"
                    className="h-9"
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    value={row.unit || ''} 
                    onChange={(e) => updateRow(row.id, 'unit', e.target.value)}
                    className="h-9"
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    type="number"
                    value={row.quantity || 0} 
                    onChange={(e) => updateRow(row.id, 'quantity', Number(e.target.value))}
                    className="h-9"
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    type="number"
                    value={row.unitPrice || 0} 
                    onChange={(e) => updateRow(row.id, 'unitPrice', Number(e.target.value))}
                    className="h-9"
                  />
                </TableCell>
                <TableCell>
                  <Select 
                    value={row.periodicity} 
                    onValueChange={(val) => updateRow(row.id, 'periodicity', val)}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mensal">Mensal</SelectItem>
                      <SelectItem value="anual">Anual</SelectItem>
                      <SelectItem value="evento">Evento</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calcRowTotal(row))}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => duplicateRow(row.id)} className="h-8 w-8">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => removeRow(row.id)} className="h-8 w-8 text-slate-400 hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-slate-500 italic">
                  Nenhuma linha adicionada. Comece clicando em "Adicionar Linha".
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Button variant="outline" onClick={addRow} className="w-full border-dashed">
        <Plus className="h-4 w-4 mr-2" /> Adicionar Linha
      </Button>
    </div>
  );
}
