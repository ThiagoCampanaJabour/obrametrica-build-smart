import React from 'react';
import { MarketResult } from '@/lib/types/budget';

interface SummaryCardProps {
  result: MarketResult;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ result }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="font-bold text-slate-900 mb-4">Resumo</h3>
      <div className="space-y-2">
        <p>Total Mensal: R$ {result.monthlyTotal.toFixed(2)}</p>
        <p className={`font-bold ${result.budgetExceeded ? 'text-red-600' : 'text-green-600'}`}>
          Saldo: R$ {result.remainingBudget.toFixed(2)}
        </p>
        {result.budgetExceeded && <p className="text-xs text-red-500">Orçamento excedido em {result.exceededPct.toFixed(1)}%</p>}
      </div>
    </div>
  );
};
