import React from 'react';
import { BudgetResult } from '@/lib/types/budget';

interface ResultsSummaryProps {
  results: BudgetResult;
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({ results }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-primary/30 transition-colors">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Custo Rede/Mês</p>
        <p className="text-2xl font-black text-slate-900">R$ {results.monthlyCost.toFixed(2)}</p>
      </div>
      <div className="bg-primary p-5 rounded-2xl shadow-lg shadow-primary/20 text-white">
        <p className="text-xs font-medium text-white/80 uppercase tracking-wider mb-1">Novo Custo/Mês</p>
        <p className="text-2xl font-black">R$ {results.monthlyData[0]?.costWithPV.toFixed(2) || "0.00"}</p>
      </div>
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Economia Anual</p>
        <p className="text-2xl font-black text-emerald-600">R$ {results.annualSavings.toFixed(2)}</p>
      </div>
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Payback Simples</p>
        <p className="text-2xl font-black text-orange-600">
          {results.paybackYears ? `${results.paybackYears.toFixed(1)} anos` : "N/A"}
        </p>
      </div>
    </div>
  );
};
