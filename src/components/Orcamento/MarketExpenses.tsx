import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { MarketInput, BudgetInput } from '@/lib/types/budget';

interface MarketExpensesProps {
  input: BudgetInput;
  onChange: (input: BudgetInput) => void;
}

export const MarketExpenses: React.FC<MarketExpensesProps> = ({ input, onChange }) => {
  const market = input.market || {
    mode: 'total',
    monthlyTotal: 1500,
    categories: [],
    familyMembers: 1,
    annualInflationPct: 5,
    projectionYears: 1
  };

  const updateMarket = (field: keyof MarketInput, value: any) => {
    onChange({
      ...input,
      market: { ...market, [field]: value }
    });
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <ShoppingCart className="h-5 w-5 text-primary" /> Gastos com Mercado
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Gasto Mensal Total (R$)</label>
          <input 
            type="number" 
            value={market.monthlyTotal} 
            onChange={(e) => updateMarket('monthlyTotal', Number(e.target.value))}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Família (Membros)</label>
                <input 
                    type="number" 
                    value={market.familyMembers} 
                    onChange={(e) => updateMarket('familyMembers', Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none"
                />
            </div>
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Inflação Ano (%)</label>
                <input 
                    type="number" 
                    value={market.annualInflationPct} 
                    onChange={(e) => updateMarket('annualInflationPct', Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none"
                />
            </div>
        </div>
      </div>
    </section>
  );
};