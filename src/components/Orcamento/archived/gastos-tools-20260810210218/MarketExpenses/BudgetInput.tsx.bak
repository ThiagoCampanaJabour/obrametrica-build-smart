import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { MarketInput } from '@/lib/types/budget';

interface BudgetInputProps {
  input: MarketInput;
  onChange: (input: MarketInput) => void;
}

export const BudgetInput: React.FC<BudgetInputProps> = ({ input, onChange }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
        <ShoppingCart className="h-4 w-4 text-primary" /> Orçamento Mensal (R$)
      </h3>
      <input
        type="number"
        value={input.budgetTotalMonth}
        onChange={(e) => onChange({ ...input, budgetTotalMonth: Number(e.target.value) })}
        className="w-full rounded-xl border border-slate-200 p-3"
      />
    </div>
  );
};
