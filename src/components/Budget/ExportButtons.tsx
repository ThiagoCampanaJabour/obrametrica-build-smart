import React from 'react';
import { Download } from 'lucide-react';
import { BudgetResult } from '@/lib/types/budget';

interface ExportButtonsProps {
  results: BudgetResult;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({ results }) => {
  const handleExportCSV = () => {
    let content = "Simulador Energetico\nMes,Consumo (kWh),Geracao (kWh),Custo Rede (R$),Custo com Solar (R$)\n";
    results.monthlyData.forEach((d: any) => {
      content += `${d.month},${d.consumption.toFixed(2)},${d.generation.toFixed(2)},${d.costRede.toFixed(2)},${d.costWithPV.toFixed(2)}\n`;
    });

    if (results.market) {
      content += "\nGastos com Mercado\nAno,Gasto Anual (R$),Variacao (%)\n";
      results.market.projection.forEach((p: any) => {
        content += `${p.year},${p.amount.toFixed(2)},${p.variationPct.toFixed(2)}%\n`;
      });
    }

    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'obrametrica-orcamento-completo.csv';
    a.click();
  };

  const handleExportJSON = () => {
    const data = JSON.stringify(results, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'obrametrica-simulador-solar.json';
    a.click();
  };

  return (
    <div className="flex gap-2">
      <button 
        onClick={handleExportCSV}
        className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
      >
        <Download className="h-4 w-4" /> CSV
      </button>
      <button 
        onClick={handleExportJSON}
        className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
      >
        <Download className="h-4 w-4" /> JSON
      </button>
    </div>
  );
};
