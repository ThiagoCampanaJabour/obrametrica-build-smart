import React from 'react';
import { Car } from 'lucide-react';
import { BudgetInput, VehicleInput } from '@/lib/types/budget';
import { cn } from '@/lib/utils';

interface VehicleExpensesProps {
  input: BudgetInput;
  onChange: (input: BudgetInput) => void;
}

export const VehicleExpenses: React.FC<VehicleExpensesProps> = ({ input, onChange }) => {
  const vehicles = input.vehicles || [];

  const addVehicle = () => {
    const newVehicle: VehicleInput = {
      id: crypto.randomUUID(),
      name: 'Novo Veículo',
      type: 'gasolina',
      kmPerMonth: 1000,
      consumption: 10,
      fuelPrice: 5.0,
      maintenanceMonthly: 100,
      insuranceAnnual: 1200,
      ipvaAnnual: 1000,
      vehicleValue: 50000,
      depreciationRateAnnualPct: 10,
    };
    onChange({ ...input, vehicles: [...vehicles, newVehicle] });
  };

  const removeVehicle = (id: string) => {
    onChange({ ...input, vehicles: vehicles.filter((v) => v.id !== id) });
  };

  const updateVehicle = (id: string, field: keyof VehicleInput, value: any) => {
    onChange({
      ...input,
      vehicles: vehicles.map((v) => (v.id === id ? { ...v, [field]: value } : v)),
    });
  };

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Car className="h-5 w-5 text-primary" /> Gastos com Veículos
      </h2>

      <div className="space-y-4">
        {vehicles.map((v) => (
          <div key={v.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <input 
                type="text" 
                value={v.name} 
                onChange={(e) => updateVehicle(v.id, 'name', e.target.value)}
                className="font-bold bg-transparent outline-none border-b border-transparent hover:border-slate-300"
              />
              <button onClick={() => removeVehicle(v.id)} className="text-red-500 text-sm">Remover</button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <label className="block text-[10px] text-slate-500 uppercase">Tipo</label>
                  <select value={v.type} onChange={(e) => updateVehicle(v.id, 'type', e.target.value)} className="w-full bg-transparent outline-none">
                    <option value="gasolina">Gasolina</option>
                    <option value="etanol">Etanol</option>
                    <option value="diesel">Diesel</option>
                    <option value="eletrico">Elétrico</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 uppercase">KM/mês</label>
                  <input type="number" value={v.kmPerMonth} onChange={(e) => updateVehicle(v.id, 'kmPerMonth', Number(e.target.value))} className="w-full bg-transparent outline-none"/>
                </div>
            </div>
          </div>
        ))}
        <button onClick={addVehicle} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:text-primary transition-all">
          + Adicionar Veículo
        </button>
      </div>
    </section>
  );
};