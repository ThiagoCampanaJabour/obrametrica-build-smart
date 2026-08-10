import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp } from 'lucide-react';
import { BudgetInput, PVInput } from '@/lib/types/budget';

interface SensitivitySlidersProps {
  input: BudgetInput;
  onChange: (input: BudgetInput) => void;
}

export const SensitivitySliders: React.FC<SensitivitySlidersProps> = ({ input, onChange }) => {
  const pv: PVInput = input.pv || { 
    productionFactor: 1500, 
    lossesPct: 14,
    opexAnnual: 0,
    lifespanYears: 25,
    overlapFactor: 0.45
  };

  const updatePV = (field: keyof PVInput, value: any) => {
    onChange({
      ...input,
      pv: { ...pv, [field]: value }
    });
  };

  return (
    <section className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border border-primary/20 p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" /> Sliders de Sensibilidade
      </h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 flex justify-between">
            Variação Tarifa 
            <span className={cn("text-xs font-bold", input.tariff > 0.85 ? "text-red-500" : "text-emerald-500")}>
              {input.tariff > 0.85 ? "+" : ""}{(((input.tariff - 0.85) / 0.85) * 100).toFixed(0)}%
            </span>
          </label>
          <input 
            type="range" 
            min="0.68" 
            max="1.02" 
            step="0.01"
            value={input.tariff} 
            onChange={(e) => onChange({...input, tariff: Number(e.target.value)})}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 flex justify-between">
            Fator de Produção 
            <span className="text-primary text-xs font-bold">{pv.productionFactor} kWh/kWp</span>
          </label>
          <input 
            type="range" 
            min="1350" 
            max="1650" 
            step="10"
            value={pv.productionFactor} 
            onChange={(e) => updatePV('productionFactor', Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 flex justify-between">
            Perdas Sistêmicas 
            <span className="text-primary text-xs font-bold">{pv.lossesPct}%</span>
          </label>
          <input 
            type="range" 
            min="9" 
            max="19" 
            step="1"
            value={pv.lossesPct} 
            onChange={(e) => updatePV('lossesPct', Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>
      </div>
    </section>
  );
};
