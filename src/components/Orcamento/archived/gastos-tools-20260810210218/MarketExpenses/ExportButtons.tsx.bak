import React from 'react';
import { MarketResult, MarketInput } from '@/lib/types/budget';
import { Download, FileJson, FileSpreadsheet } from 'lucide-react';

export const ExportButtons: React.FC<{ input: MarketInput, result: MarketResult }> = ({ input, result }) => {
  const exportJSON = () => {
    const data = JSON.stringify({ 
      metadata: {
        app: "ObraMétrica",
        tool: "Orçamento de Mercado",
        date: new Date().toISOString()
      },
      input, 
      result 
    }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'orcamento-mercado.json';
    link.click();
  };

  const exportCSV = () => {
    let csv = "Categoria;Valor Mensal (R$);Quantidade;Percentual (%)\n";
    input.categories.forEach(c => {
      const breakdown = result.categoryBreakdown.find(b => b.name === c.name);
      const percentage = breakdown ? breakdown.percentage : 0;
      csv += `${c.name};${(c.value_month ?? c.amount).toFixed(2)};${c.quantity ?? ""};${percentage.toFixed(2)}\n`;
    });
    
    csv += "\nProjeção Anual com Inflação\n";
    csv += "Ano;Gasto Anual (R$);Variacao (%)\n";
    result.projection.forEach(p => {
      csv += `${p.year};${p.amount.toFixed(2)};${p.variationPct.toFixed(2)}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'orcamento-mercado.csv';
    link.click();
  };

  return (
    <div className="flex gap-2">
      <button 
        onClick={exportJSON} 
        title="Exportar JSON"
        className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-bold transition-colors"
      >
        <FileJson className="h-3 w-3" /> JSON
      </button>
      <button 
        onClick={exportCSV} 
        title="Exportar CSV"
        className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-bold transition-colors"
      >
        <FileSpreadsheet className="h-3 w-3" /> CSV
      </button>
    </div>
  );
};
