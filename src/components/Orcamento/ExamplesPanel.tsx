import React from 'react';
import { BookOpen } from 'lucide-react';
import examples from '@/../content/finance/examples.json';
import { BudgetInput } from '@/lib/types/budget';

interface ExamplesPanelProps {
  onSelect: (input: BudgetInput) => void;
}

export const ExamplesPanel: React.FC<ExamplesPanelProps> = ({ onSelect }) => {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-primary" /> Exemplos Reais
      </h2>
      <div className="space-y-3">
        {examples.scenarios.map((ex: any) => (
          <button
            key={ex.id}
            onClick={() => onSelect(ex.input as BudgetInput)}
            className="w-full text-left p-4 rounded-xl border border-slate-100 hover:border-primary/30 hover:bg-primary/5 transition-all group"
          >
            <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">{ex.name}</p>
            <p className="text-xs text-slate-500 mt-1">
              {ex.input.monthlyKwh} kWh/mês • {ex.input.pv.kwp} kWp
            </p>
          </button>
        ))}
      </div>
    </section>
  );
};
