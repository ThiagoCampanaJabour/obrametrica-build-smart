import React from 'react';
import { HelpCircle, Info } from 'lucide-react';

export const HelpPanel: React.FC = () => {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <HelpCircle className="h-5 w-5 text-primary" /> Ajuda & Metodologia
      </h2>
      <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <p>
            <strong>Overlap (Simultaneidade):</strong> Representa quanto da energia gerada é consumida instantaneamente sem passar pela rede.
          </p>
        </div>
        <p>
          <strong>LCOE:</strong> Custo Levelizado de Energia. Representa o custo real de cada kWh gerado pelo sistema ao longo de 25 anos.
        </p>
        <p>
          <strong>Fator de Produção:</strong> Média de kWh gerados por cada kWp instalado ao ano. Varia conforme a irradiação solar da sua cidade.
        </p>
      </div>
    </section>
  );
};
