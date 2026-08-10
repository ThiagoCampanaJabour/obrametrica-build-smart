import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { BudgetInput } from '@/lib/types/budget';

interface MarketExpensesProps {
  input: BudgetInput;
  onChange: (input: BudgetInput) => void;
}

/**
 * Componente legado mantido por compatibilidade de tipos até a refatoração completa.
 */
export const MarketExpenses: React.FC<MarketExpensesProps> = ({ input, onChange }) => {
  const market = input.market || {
    budgetTotalMonth: 0,
    categories: [],
    familyMembers: 1,
    annualInflationPct: 5,
    projectionYears: 10
  };

  const updateBudget = (val: number) => {
    onChange({
      ...input,
      market: { ...market, budgetTotalMonth: val }
    });
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <ShoppingCart className="h-5 w-5 text-primary" /> Orçamento de Mercado
      </h2>
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Orçamento Mensal (R$)</label>
        <input 
          type="number" 
          value={market.budgetTotalMonth} 
          onChange={(e) => updateBudget(Number(e.target.value))}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none"
        />
      </div>
    </section>
  );
};