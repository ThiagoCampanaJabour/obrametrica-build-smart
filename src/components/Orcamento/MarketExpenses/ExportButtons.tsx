import React from 'react';
import { MarketResult, MarketInput } from '@/lib/types/budget';

export const ExportButtons: React.FC<{ input: MarketInput, result: MarketResult }> = ({ input, result }) => {
  const exportJSON = () => {
    const data = JSON.stringify({ input, result }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'orcamento-mercado.json';
    link.click();
  };

  return (
    <div className="flex gap-2">
      <button onClick={exportJSON} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold">
        Exportar JSON
      </button>
    </div>
  );
};
