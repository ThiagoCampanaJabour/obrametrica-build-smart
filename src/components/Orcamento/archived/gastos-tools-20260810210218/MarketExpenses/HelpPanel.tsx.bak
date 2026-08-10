import React from 'react';
import { Info, ExternalLink } from 'lucide-react';

export const HelpPanel: React.FC = () => {
  return (
    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <h3 className="font-bold text-slate-900 flex items-center gap-2">
        <Info className="h-4 w-4 text-primary" /> Metodologia e Referências
      </h3>
      
      <div className="text-sm text-slate-600 space-y-3">
        <p>
          <strong>Como funciona:</strong> O orçamento mensal é o valor que você reserva. 
          À medida que adiciona categorias, o saldo é debitado automaticamente.
        </p>
        
        <div className="pt-2 border-t border-slate-200">
          <p className="font-semibold text-slate-800 mb-1">Referências Utilizadas:</p>
          <ul className="space-y-1">
            <li>
              <a href="https://www.ibge.gov.br/estatisticas/sociais/saude/9221-pesquisa-de-orcamentos-familiares.html" target="_blank" rel="noopener" className="text-primary hover:underline flex items-center gap-1">
                POF/IBGE - Orçamentos Familiares [FONTE_A_VERIFICAR] <ExternalLink className="h-3 w-3" />
              </a>
            </li>
            <li>
              <a href="https://www.ers.usda.gov/data-products/food-plans/" target="_blank" rel="noopener" className="text-primary hover:underline flex items-center gap-1">
                USDA Food Plans (Benchmarks) [FONTE_A_VERIFICAR] <ExternalLink className="h-3 w-3" />
              </a>
            </li>
          </ul>
        </div>

        <p className="text-[10px] bg-amber-50 text-amber-700 p-2 rounded border border-amber-100">
          <strong>Nota:</strong> Os custos de mercado variam drasticamente por região e estilo de vida. 
          Os valores padrão são apenas sugestões.
        </p>
      </div>
    </div>
  );
};
