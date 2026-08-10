import React from 'react';
import { Settings } from 'lucide-react';
import { BudgetInput } from '@/lib/types/budget';

interface PVComparisonFormProps {
  input: BudgetInput;
  onChange: (input: BudgetInput) => void;
}

export const PVComparisonForm: React.FC<PVComparisonFormProps> = ({ input, onChange }) => {
  const pv = input.pv || {
    kwp: 0,
    productionFactor: 1500,
    lossesPct: 14,
    overlapFactor: 0.45,
    opexAnnual: 0,
    lifespanYears: 25,
  };

  const updatePV = (field: string, value: any) => {
    onChange({
      ...input,
      pv: { ...pv, [field]: value }
    });
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Settings className="h-5 w-5 text-primary" /> Sistema Fotovoltaico
      </h2>
      
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Potência Instalada (kWp)</label>
          <input 
            type="number" 
            step="0.1"
            value={pv.kwp || ''} 
            onChange={(e) => updatePV('kwp', Number(e.target.value))}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="Ex: 4.5"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Investimento CAPEX (R$)</label>
          <input 
            type="number" 
            value={pv.capex || ''} 
            onChange={(e) => updatePV('capex', Number(e.target.value))}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="Ex: 18000"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 flex justify-between">
            Simultaneidade (Overlap) 
            <span className="text-primary text-xs font-bold">{((pv.overlapFactor || 0.45) * 100).toFixed(0)}%</span>
          </label>
          <input 
            type="range" 
            min="0.1" 
            max="1" 
            step="0.05"
            value={pv.overlapFactor || 0.45} 
            onChange={(e) => updatePV('overlapFactor', Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-slate-400">Residencial (45%)</span>
            <span className="text-[10px] text-slate-400">Comercial (70%)</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Custo de Manutenção Anual (R$)</label>
          <input 
            type="number" 
            value={pv.opexAnnual || ''} 
            onChange={(e) => updatePV('opexAnnual', Number(e.target.value))}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none" 
          />
        </div>
      </div>
    </section>
  );
};
