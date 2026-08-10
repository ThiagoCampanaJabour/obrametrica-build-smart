import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingCart, Users, TrendingUp, Info } from 'lucide-react';
import { MarketInput, MarketCategory } from '@/lib/types/budget';
import { calculateMarketExpenses, reconcileMarketBudget } from '@/lib/finance/market';
import { BudgetInput } from './BudgetInput';
import { CategoryList } from './CategoryList';
import { SummaryCard } from './SummaryCard';
import { ProjectionTable } from './ProjectionTable';
import { HelpPanel } from './HelpPanel';
import { ExportButtons } from './ExportButtons';
import presets from '../../../../content/finance/presets.json';

export const MarketExpensesPage: React.FC = () => {
  const [input, setInput] = useState<MarketInput>(() => {
    const saved = localStorage.getItem('obrametrica_market_');
    if (saved) return JSON.parse(saved);
    
    return {
      budgetTotalMonth: 1500,
      familyMembers: 2,
      annualInflationPct: presets.market.defaultInflationPct,
      projectionYears: 10,
      categories: presets.market.categories.map((c: any) => ({
        ...c,
        amount: 0,
        isLocked: false
      }))
    };
  });

  useEffect(() => {
    localStorage.setItem('obrametrica_market_', JSON.stringify(input));
  }, [input]);

  const result = useMemo(() => calculateMarketExpenses(input), [input]);

  const handleReconcile = (mode: 'scale-categories' | 'adjust-budget') => {
    const reconciled = reconcileMarketBudget(input, mode);
    setInput(reconciled);
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BudgetInput input={input} onChange={setInput} />
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" /> Membros da Família
              </h3>
              <input
                type="number"
                min="1"
                value={input.familyMembers}
                onChange={(e) => setInput({ ...input, familyMembers: Number(e.target.value) })}
                className="w-full rounded-xl border border-slate-200 p-3"
              />
            </div>
          </div>
          
          <CategoryList 
            categories={input.categories} 
            onChange={(categories) => setInput({ ...input, categories })} 
          />

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" /> Configurações de Projeção
             </h3>
             <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Inflação Anual (%)</label>
                  <input
                    type="number"
                    value={input.annualInflationPct}
                    onChange={(e) => setInput({ ...input, annualInflationPct: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Anos de Projeção</label>
                  <input
                    type="number"
                    value={input.projectionYears}
                    onChange={(e) => setInput({ ...input, projectionYears: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 p-2 text-sm"
                  />
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-5 space-y-6">
          <SummaryCard result={result} input={input} onReconcile={handleReconcile} />
          
          <div className="flex justify-between items-center">
            <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">Análise & Projeções</h4>
            <ExportButtons input={input} result={result} />
          </div>

          <ProjectionTable result={result} />
          
          <HelpPanel />
        </div>
      </div>
    </div>
  );
};
