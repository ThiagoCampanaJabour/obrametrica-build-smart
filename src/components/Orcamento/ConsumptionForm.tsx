import React from 'react';
import { Trash2, Plus, Zap } from 'lucide-react';
import { BudgetInput, Appliance } from '@/lib/types/budget';
import { cn } from '@/lib/utils';

interface ConsumptionFormProps {
  input: BudgetInput;
  onChange: (input: BudgetInput) => void;
}

export const ConsumptionForm: React.FC<ConsumptionFormProps> = ({ input, onChange }) => {
  const addAppliance = () => {
    const newAppliance: Appliance = {
      id: crypto.randomUUID(),
      name: '',
      powerW: 0,
      hoursPerDay: 0,
      daysPerMonth: 30,
      quantity: 1,
    };
    onChange({
      ...input,
      appliances: [...input.appliances, newAppliance],
    });
  };

  const removeAppliance = (id: string) => {
    onChange({
      ...input,
      appliances: input.appliances.filter((a) => a.id !== id),
    });
  };

  const updateAppliance = (id: string, field: keyof Appliance, value: any) => {
    onChange({
      ...input,
      appliances: input.appliances.map((a) => (a.id === id ? { ...a, [field]: value } : a)),
    });
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Zap className="h-5 w-5 text-primary" /> Dados de Consumo
      </h2>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => onChange({ ...input, consumptionMode: 'direct' })}
          className={cn(
            "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all",
            input.consumptionMode === 'direct' ? "bg-primary text-white shadow-md" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          )}
        >
          Modo Direto
        </button>
        <button
          onClick={() => onChange({ ...input, consumptionMode: 'appliances' })}
          className={cn(
            "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all",
            input.consumptionMode === 'appliances' ? "bg-primary text-white shadow-md" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          )}
        >
          Por Equipamentos
        </button>
      </div>

      <div className="space-y-5">
        {input.consumptionMode === 'direct' ? (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Consumo Mensal (kWh)</label>
            <input
              type="number"
              value={input.monthlyKwh || ''}
              onChange={(e) => onChange({ ...input, monthlyKwh: Number(e.target.value) })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              placeholder="Ex: 500"
            />
          </div>
        ) : (
          <div className="space-y-4">
            {input.appliances.map((app) => (
              <div key={app.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 relative group">
                <button
                  onClick={() => removeAppliance(app.id)}
                  className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <input
                      type="text"
                      placeholder="Equipamento"
                      value={app.name}
                      onChange={(e) => updateAppliance(app.id, 'name', e.target.value)}
                      className="w-full bg-transparent border-b border-slate-200 pb-1 text-sm font-medium focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase">Potência (W)</label>
                    <input
                      type="number"
                      value={app.powerW || ''}
                      onChange={(e) => updateAppliance(app.id, 'powerW', Number(e.target.value))}
                      className="w-full bg-transparent text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase">Horas/Dia</label>
                    <input
                      type="number"
                      value={app.hoursPerDay || ''}
                      onChange={(e) => updateAppliance(app.id, 'hoursPerDay', Number(e.target.value))}
                      className="w-full bg-transparent text-sm outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={addAppliance}
              className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2 text-sm font-medium"
            >
              <Plus className="h-4 w-4" /> Adicionar Equipamento
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Tarifa (R$/kWh)</label>
            <input
              type="number"
              step="0.01"
              value={input.tariff}
              onChange={(e) => onChange({ ...input, tariff: Number(e.target.value) })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Impostos (%)</label>
            <input
              type="number"
              value={input.taxPct}
              onChange={(e) => onChange({ ...input, taxPct: Number(e.target.value) })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
