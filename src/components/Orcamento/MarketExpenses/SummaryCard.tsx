import React from 'react';
import { MarketResult, MarketInput } from '@/lib/types/budget';
import { AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';

interface SummaryCardProps {
  result: MarketResult;
  input: MarketInput;
  onReconcile: (mode: 'scale-categories' | 'adjust-budget') => void;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ result, input, onReconcile }) => {
  const categoriesSum = result.monthlyTotal;
  const budget = input.budgetTotalMonth;
  const mismatch = budget > 0 && Math.abs(budget - categoriesSum) > 0.01;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-slate-50 rounded-xl">
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Total Categorias</p>
          <p className="text-2xl font-black text-slate-900">R$ {result.monthlyTotal.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl">
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Per Capita</p>
          <p className="text-2xl font-black text-slate-900">R$ {result.perCapitaMonth.toFixed(2)}</p>
        </div>
      </div>

      <div className={`p-4 rounded-xl border ${result.budgetExceeded ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-bold flex items-center gap-2">
            {result.budgetExceeded ? (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            )}
            Saldo do Orçamento
          </p>
          <span className={`text-lg font-black ${result.budgetExceeded ? 'text-red-700' : 'text-green-700'}`}>
            R$ {result.remainingBudget.toFixed(2)}
          </span>
        </div>
        
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${result.budgetExceeded ? 'bg-red-500' : 'bg-green-500'}`}
            style={{ width: `${Math.min(100, (result.monthlyTotal / (budget || result.monthlyTotal)) * 100)}%` }}
          />
        </div>
      </div>

      {mismatch && (
        <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl space-y-3">
          <p className="text-xs font-bold text-amber-800 flex items-center gap-2">
            <RefreshCw className="h-3 w-3" /> Reconciliação Necessária
          </p>
          <p className="text-[11px] text-amber-700">A soma das categorias não bate com o orçamento total definido.</p>
          <div className="flex gap-2">
            <button 
              onClick={() => onReconcile('scale-categories')}
              className="flex-1 text-[10px] bg-white border border-amber-200 py-2 rounded-lg font-bold hover:bg-amber-100 transition-colors"
            >
              Ajustar Categorias
            </button>
            <button 
              onClick={() => onReconcile('adjust-budget')}
              className="flex-1 text-[10px] bg-white border border-amber-200 py-2 rounded-lg font-bold hover:bg-amber-100 transition-colors"
            >
              Ajustar Orçamento
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
