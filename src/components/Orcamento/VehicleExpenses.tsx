import React, { useState } from 'react';
import { Car, Fuel, ShieldCheck, Wrench, Settings, CreditCard, Plus, Trash2, Info, ChevronDown, ChevronUp, History, Calculator } from 'lucide-react';
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
      consumptionKmPerL: 12,
      fuelPricePerL: 5.8,
      maintenanceMonthly: 150,
      maintenanceAnnual: 0,
      insuranceAnnual: 2200,
      ipvaAnnual: 1500,
      licensingAnnual: 160,
      vehicleValue: 65000,
      depreciationRateAnnualPct: 10,
      chargingEfficiencyPct: 95,
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
      parkingMonthly: 0,
      tollsMonthly: 0,
      carWashMonthly: 0,
      otherMonthly: 0
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
          <Car className="h-5 w-5 text-primary" /> Painel de Frota
        </h2>
        <button 
          onClick={addVehicle}
          className="text-xs font-bold text-primary hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
          data-testid="vehicle-add"
        >
          <Plus className="h-3 w-3" /> Adicionar Veículo
        </button>
      </div>

      <TooltipProvider>
        <div className="space-y-4">
          {vehicles.map((v, index) => (
            <div key={v.id} className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
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
                    data-testid={`vehicle-${index}-label`}
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

              {expandedVehicles[v.id] && (
                <div className="p-4 pt-0 border-t border-slate-200 bg-white space-y-6">
                  {/* Uso & Consumo */}
                  <div className="space-y-3 mt-4">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Fuel className="h-3 w-3" /> Uso & Consumo
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-500">KM por mês</label>
                        <input 
                          type="number" 
                          value={v.kmPerMonth} 
                          onChange={(e) => updateVehicle(v.id, 'kmPerMonth', Number(e.target.value))}
                          className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                          data-testid={`vehicle-${index}-km-per-month`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-500">Tipo de Veículo</label>
                        <select 
                          value={v.type} 
                          onChange={(e) => updateVehicle(v.id, 'type', e.target.value)}
                          className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                          data-testid={`vehicle-${index}-type`}
                        >
                          <option value="gasolina">Gasolina</option>
                          <option value="etanol">Etanol</option>
                          <option value="diesel">Diesel</option>
                          <option value="hibrido">Híbrido</option>
                          <option value="eletrico">Elétrico</option>
                          <option value="outro">Outro</option>
                        </select>
                      </div>
                      
                      {(v.type !== 'eletrico') && (
                        <div className="space-y-1">
                          <label className="text-xs text-slate-500">Consumo (km/L)</label>
                          <input 
                            type="number" 
                            value={v.consumptionKmPerL || ''} 
                            onChange={(e) => updateVehicle(v.id, 'consumptionKmPerL', Number(e.target.value))}
                            className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                            data-testid={`vehicle-${index}-consumption-km-per-l`}
                          />
                        </div>
                      )}

                      {(v.type === 'eletrico' || v.type === 'hibrido') && (
                        <div className="space-y-1">
                          <label className="text-xs text-slate-500">Consumo (kWh/100km)</label>
                          <input 
                            type="number" 
                            value={v.consumptionKwhPer100Km || ''} 
                            onChange={(e) => updateVehicle(v.id, 'consumptionKwhPer100Km', Number(e.target.value))}
                            className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                            data-testid={`vehicle-${index}-consumption-kwh-per-100km`}
                          />
                        </div>
                      )}

                      {(v.type !== 'eletrico') && (
                        <div className="space-y-1">
                          <label className="text-xs text-slate-500">Preço Comb. (R$/L)</label>
                          <input 
                            type="number" 
                            value={v.fuelPricePerL || ''} 
                            onChange={(e) => updateVehicle(v.id, 'fuelPricePerL', Number(e.target.value))}
                            className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                            data-testid={`vehicle-${index}-fuel-price-per-l`}
                          />
                        </div>
                      )}

                      {(v.type === 'eletrico' || v.type === 'hibrido') && (
                        <div className="space-y-1">
                          <label className="text-xs text-slate-500">Preço Energia (R$/kWh)</label>
                          <input 
                            type="number" 
                            value={v.electricityPricePerKwh || ''} 
                            onChange={(e) => updateVehicle(v.id, 'electricityPricePerKwh', Number(e.target.value))}
                            className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                            data-testid={`vehicle-${index}-electricity-price-per-kwh`}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Financiamento */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <CreditCard className="h-3 w-3" /> Financiamento
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-500">Valor Financiado (R$)</label>
                        <input 
                          type="number" 
                          value={v.financing?.financedAmount || 0} 
                          onChange={(e) => updateVehicle(v.id, 'financing.financedAmount', Number(e.target.value))}
                          className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                          data-testid={`vehicle-${index}-financed-amount`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-500">Taxa Anual (%)</label>
                        <input 
                          type="number" 
                          value={v.financing?.annualRatePct || 0} 
                          onChange={(e) => updateVehicle(v.id, 'financing.annualRatePct', Number(e.target.value))}
                          className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                          data-testid={`vehicle-${index}-annual-rate-pct`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-500">Prazo (anos)</label>
                        <input 
                          type="number" 
                          value={v.financing?.termYears || 0} 
                          onChange={(e) => updateVehicle(v.id, 'financing.termYears', Number(e.target.value))}
                          className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                          data-testid={`vehicle-${index}-term-years`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-500">Tipo</label>
                        <select 
                          value={v.financing?.amortizationType || 'PRICE'} 
                          onChange={(e) => updateVehicle(v.id, 'financing.amortizationType', e.target.value)}
                          className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                          data-testid={`vehicle-${index}-amortization-type`}
                        >
                          <option value="PRICE">PRICE</option>
                          <option value="SAC">SAC</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Manutenção & Pneus */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Wrench className="h-3 w-3" /> Manutenção & Pneus
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-500">Custo Jogo Pneus (R$)</label>
                        <input 
                          type="number" 
                          value={v.finiteItems?.tires?.costPerSet || 0} 
                          onChange={(e) => updateVehicle(v.id, 'finiteItems.tires.costPerSet', Number(e.target.value))}
                          className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                          data-testid={`vehicle-${index}-tires-cost-per-set`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-500">Vida Útil Pneu (KM)</label>
                        <input 
                          type="number" 
                          value={v.finiteItems?.tires?.replacementIntervalKm || 40000} 
                          onChange={(e) => updateVehicle(v.id, 'finiteItems.tires.replacementIntervalKm', Number(e.target.value))}
                          className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                          data-testid={`vehicle-${index}-tires-replacement-km`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-500">Manutenção Mensal (R$)</label>
                        <input 
                          type="number" 
                          value={v.maintenanceMonthly} 
                          onChange={(e) => updateVehicle(v.id, 'maintenanceMonthly', Number(e.target.value))}
                          className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                          data-testid={`vehicle-${index}-maintenance-monthly`}
                        />
                      </div>
                      {v.type !== 'eletrico' && (
                        <div className="space-y-1">
                          <label className="text-xs text-slate-500">Custo Troca Óleo (R$)</label>
                          <input 
                            type="number" 
                            value={v.finiteItems?.oilChange?.costPerChange || 0} 
                            onChange={(e) => updateVehicle(v.id, 'finiteItems.oilChange.costPerChange', Number(e.target.value))}
                            className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                            data-testid={`vehicle-${index}-oil-change-cost`}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tributos & Valor */}
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
                          data-testid={`vehicle-${index}-insurance-annual`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-500">IPVA Anual (R$)</label>
                        <input 
                          type="number" 
                          value={v.ipvaAnnual} 
                          onChange={(e) => updateVehicle(v.id, 'ipvaAnnual', Number(e.target.value))}
                          className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                          data-testid={`vehicle-${index}-ipva-annual`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-500">Valor do Veículo (R$)</label>
                        <input 
                          type="number" 
                          value={v.vehicleValue || 0} 
                          onChange={(e) => updateVehicle(v.id, 'vehicleValue', Number(e.target.value))}
                          className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                          data-testid={`vehicle-${index}-vehicle-value`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-500">Depreciação Anual (%)</label>
                        <input 
                          type="number" 
                          value={v.depreciationRateAnnualPct || 0} 
                          onChange={(e) => updateVehicle(v.id, 'depreciationRateAnnualPct', Number(e.target.value))}
                          className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                          data-testid={`vehicle-${index}-depreciation-rate-annual-pct`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Outros Custos */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Settings className="h-3 w-3" /> Outros Custos
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-500">Estacionamento (R$/mês)</label>
                        <input 
                          type="number" 
                          value={v.parkingMonthly} 
                          onChange={(e) => updateVehicle(v.id, 'parkingMonthly', Number(e.target.value))}
                          className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                          data-testid={`vehicle-${index}-parking-monthly`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-500">Pedágios (R$/mês)</label>
                        <input 
                          type="number" 
                          value={v.tollsMonthly} 
                          onChange={(e) => updateVehicle(v.id, 'tollsMonthly', Number(e.target.value))}
                          className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                          data-testid={`vehicle-${index}-tolls-monthly`}
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
              <p className="text-sm text-slate-400">Clique em "Adicionar Veículo" para começar.</p>
            </div>
          )}
        </div>
      </TooltipProvider>
    </section>
  );
};
