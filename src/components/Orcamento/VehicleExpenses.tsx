import React, { useState } from 'react';
import { Car, Fuel, ShieldCheck, Wrench, Settings, CreditCard, Plus, Trash2, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { BudgetInput, VehicleInput } from '@/lib/types/budget';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface VehicleExpensesProps {
  input: BudgetInput;
  onChange: (input: BudgetInput) => void;
}

export const VehicleExpenses: React.FC<VehicleExpensesProps> = ({ input, onChange }) => {
  const vehicles = input.vehicles || [];
  const [expandedVehicles, setExpandedVehicles] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedVehicles(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const addVehicle = () => {
    const newVehicle: VehicleInput = {
      id: crypto.randomUUID(),
      name: 'Novo Veículo',
      type: 'gasolina',
      kmPerMonth: 1000,
      consumption: 12,
      fuelPrice: 5.8,
      maintenanceMonthly: 150,
      insuranceAnnual: 2200,
      ipvaAnnual: 1500,
      licensingAnnual: 160,
      vehicleValue: 65000,
      depreciationRateAnnualPct: 10,
      chargingEfficiencyPct: 90,
      financing: {
        financedAmount: 0,
        downPayment: 0,
        annualRatePct: 0,
        termYears: 0,
        amortizationType: 'PRICE'
      },
      finiteItems: {
        tires: { costPerSet: 0, replacementIntervalKm: 40000, numberOfTires: 4 },
        oilChange: { costPerChange: 0, intervalKm: 10000 }
      },
      admin: {
        parkingMonthly: 0,
        tollsMonthly: 0,
        cleaningMonthly: 0
      }
    };
    onChange({ ...input, vehicles: [...vehicles, newVehicle] });
    setExpandedVehicles(prev => ({ ...prev, [newVehicle.id]: true }));
  };

  const removeVehicle = (id: string) => {
    onChange({ ...input, vehicles: vehicles.filter((v) => v.id !== id) });
  };

  const updateVehicle = (id: string, path: string, value: any) => {
    const newVehicles = vehicles.map((v) => {
      if (v.id !== id) return v;
      
      const newV = { ...v };
      const keys = path.split('.');
      let current: any = newV;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newV;
    });
    onChange({ ...input, vehicles: newVehicles });
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Car className="h-5 w-5 text-primary" /> Gastos com Veículos
        </h2>
        <button 
          onClick={addVehicle}
          className="text-xs font-bold text-primary hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
          data-testid="add-vehicle-btn"
        >
          <Plus className="h-3 w-3" /> Adicionar
        </button>
      </div>

      <TooltipProvider>
        <div className="space-y-4">
          {vehicles.map((v) => (
            <div key={v.id} className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
              {/* Header do Veículo */}
              <div 
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-100/50 transition-colors"
                onClick={() => toggleExpand(v.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                    <Car className="h-4 w-4" />
                  </div>
                  <input 
                    type="text" 
                    value={v.name} 
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => updateVehicle(v.id, 'name', e.target.value)}
                    className="font-bold bg-transparent outline-none border-b border-transparent hover:border-slate-300 focus:border-primary text-slate-900"
                    data-testid={`vehicle-name-${v.id}`}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeVehicle(v.id); }}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  {expandedVehicles[v.id] ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                </div>
              </div>

              {/* Detalhes Expandidos */}
              {expandedVehicles[v.id] && (
                <div className="p-4 pt-0 border-t border-slate-200 bg-white space-y-6">
                  {/* Bloco 1: Uso e Consumo */}
                  <div className="space-y-3 mt-4">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Fuel className="h-3 w-3" /> Uso & Consumo
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-500 flex items-center gap-1">
                          KM/mês
                          <TooltipTrigger><Info className="h-3 w-3 cursor-help" /></TooltipTrigger>
                          <TooltipContent>Distância média percorrida mensalmente</TooltipContent>
                        </label>
                        <input 
                          type="number" 
                          value={v.kmPerMonth} 
                          onChange={(e) => updateVehicle(v.id, 'kmPerMonth', Number(e.target.value))}
                          className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                          data-testid={`km-per-month-${v.id}`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-500">Tipo de Motor</label>
                        <select 
                          value={v.type} 
                          onChange={(e) => updateVehicle(v.id, 'type', e.target.value)}
                          className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                        >
                          <option value="gasolina">Gasolina</option>
                          <option value="etanol">Etanol</option>
                          <option value="diesel">Diesel</option>
                          <option value="hibrido">Híbrido</option>
                          <option value="eletrico">Elétrico</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-500">
                          {v.type === 'eletrico' ? 'Consumo (kWh/100km)' : 'Consumo (km/L)'}
                        </label>
                        <input 
                          type="number" 
                          value={v.consumption} 
                          onChange={(e) => updateVehicle(v.id, 'consumption', Number(e.target.value))}
                          className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-500">
                          {v.type === 'eletrico' ? 'Preço Energia (R$/kWh)' : 'Preço Comb. (R$/L)'}
                        </label>
                        <input 
                          type="number" 
                          value={v.fuelPrice} 
                          onChange={(e) => updateVehicle(v.id, 'fuelPrice', Number(e.target.value))}
                          className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bloco 2: Manutenção e Itens Finitos */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Wrench className="h-3 w-3" /> Manutenção & Pneus
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-500">Revisão Mensal (R$)</label>
                        <input 
                          type="number" 
                          value={v.maintenanceMonthly} 
                          onChange={(e) => updateVehicle(v.id, 'maintenanceMonthly', Number(e.target.value))}
                          className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-500">Pneus (Jogo - R$)</label>
                        <input 
                          type="number" 
                          value={v.finiteItems?.tires?.costPerSet} 
                          onChange={(e) => updateVehicle(v.id, 'finiteItems.tires.costPerSet', Number(e.target.value))}
                          className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-500">Vida Pneu (KM)</label>
                        <input 
                          type="number" 
                          value={v.finiteItems?.tires?.replacementIntervalKm} 
                          onChange={(e) => updateVehicle(v.id, 'finiteItems.tires.replacementIntervalKm', Number(e.target.value))}
                          className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                        />
                      </div>
                      {v.type !== 'eletrico' && (
                        <div className="space-y-1">
                          <label className="text-xs text-slate-500">Troca de Óleo (R$)</label>
                          <input 
                            type="number" 
                            value={v.finiteItems?.oilChange?.costPerChange} 
                            onChange={(e) => updateVehicle(v.id, 'finiteItems.oilChange.costPerChange', Number(e.target.value))}
                            className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bloco 3: Tributos e Depreciação */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <ShieldCheck className="h-3 w-3" /> Tributos & Valor
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-500">Seguro Anual (R$)</label>
                        <input 
                          type="number" 
                          value={v.insuranceAnnual} 
                          onChange={(e) => updateVehicle(v.id, 'insuranceAnnual', Number(e.target.value))}
                          className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-500">IPVA Anual (R$)</label>
                        <input 
                          type="number" 
                          value={v.ipvaAnnual} 
                          onChange={(e) => updateVehicle(v.id, 'ipvaAnnual', Number(e.target.value))}
                          className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-500">Valor Veículo (R$)</label>
                        <input 
                          type="number" 
                          value={v.vehicleValue} 
                          onChange={(e) => updateVehicle(v.id, 'vehicleValue', Number(e.target.value))}
                          className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-500">Depreciação (% ano)</label>
                        <input 
                          type="number" 
                          value={v.depreciationRateAnnualPct} 
                          onChange={(e) => updateVehicle(v.id, 'depreciationRateAnnualPct', Number(e.target.value))}
                          className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bloco 4: Custos Administrativos e Extras */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <CreditCard className="h-3 w-3" /> Extras & Admin
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-500">Estacionamento (R$/mês)</label>
                        <input 
                          type="number" 
                          value={v.admin?.parkingMonthly} 
                          onChange={(e) => updateVehicle(v.id, 'admin.parkingMonthly', Number(e.target.value))}
                          className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-500">Pedágios (R$/mês)</label>
                        <input 
                          type="number" 
                          value={v.admin?.tollsMonthly} 
                          onChange={(e) => updateVehicle(v.id, 'admin.tollsMonthly', Number(e.target.value))}
                          className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {vehicles.length === 0 && (
            <div className="text-center py-8 px-4 border-2 border-dashed border-slate-100 rounded-2xl">
              <p className="text-sm text-slate-400">Clique em "Adicionar" para calcular os custos de um veículo.</p>
            </div>
          )}
        </div>
      </TooltipProvider>
    </section>
  );
};