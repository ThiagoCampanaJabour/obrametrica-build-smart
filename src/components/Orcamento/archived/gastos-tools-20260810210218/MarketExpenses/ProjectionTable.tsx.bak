import React from 'react';
import { MarketResult } from '@/lib/types/budget';

interface ProjectionTableProps {
  result: MarketResult;
}

export const ProjectionTable: React.FC<ProjectionTableProps> = ({ result }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mt-4">
      <h3 className="font-bold text-slate-900 mb-4">Projeção Anual</h3>
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left">Ano</th>
            <th className="text-right">Valor Estimado</th>
          </tr>
        </thead>
        <tbody>
          {result.projection.map((p) => (
            <tr key={p.year}>
              <td>Ano {p.year}</td>
              <td className="text-right">R$ {p.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
