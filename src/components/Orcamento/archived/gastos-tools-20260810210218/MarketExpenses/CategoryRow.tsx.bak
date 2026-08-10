import React from 'react';
import { MarketCategory } from '@/lib/types/budget';
import { Trash2, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CategoryRowProps {
  category: MarketCategory;
  onChange: (c: MarketCategory) => void;
  onDelete: () => void;
}

/**
 * Componente que representa uma linha de categoria de mercado.
 * 
 * Mapeamento de dados:
 * - Campo VALUE (valor mensal R$): categories[].value_month (ou amount para retrocompatibilidade)
 * - Campo QUANTITY (opcional): categories[].quantity - usado para contagem de unidades
 */
export const CategoryRow: React.FC<CategoryRowProps> = ({ category, onChange, onDelete }) => {
  const slug = category.id.toLowerCase().replace(/\s+/g, '-');
  
  // Garantimos que value_month esteja sincronizado com amount
  const currentValue = category.value_month ?? category.amount;

  return (
    <div className="grid grid-cols-12 gap-2 mb-3 items-center">
      <div className="col-span-4">
        <input
          className="w-full rounded-lg border border-slate-200 p-2 text-sm bg-slate-50"
          value={category.name}
          readOnly
          title={category.name}
        />
      </div>
      
      <div className="col-span-3 relative">
        <label htmlFor={`value-${category.id}`} className="sr-only">Valor mensal (R$)</label>
        <input
          id={`value-${category.id}`}
          type="number"
          step="0.01"
          min="0"
          placeholder="0,00"
          data-testid={`market-cat-${slug}-value`}
          aria-describedby={`help-value-${category.id}`}
          className="w-full rounded-lg border border-slate-200 p-2 text-sm text-right pr-8"
          value={currentValue || ''}
          onChange={(e) => {
            const val = e.target.value === '' ? 0 : Number(e.target.value);
            onChange({ ...category, amount: val, value_month: val });
          }}
        />
        <div className="absolute right-2 top-2.5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-slate-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent id={`help-value-${category.id}`}>
                <p>Valor total gasto com esta categoria no mês.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="col-span-3 relative">
        <label htmlFor={`qty-${category.id}`} className="sr-only">Quantidade</label>
        <input
          id={`qty-${category.id}`}
          type="number"
          min="0"
          placeholder="Qtd"
          data-testid={`market-cat-${slug}-qty`}
          aria-describedby={`help-qty-${category.id}`}
          className="w-full rounded-lg border border-slate-200 p-2 text-sm text-center"
          value={category.quantity === null || category.quantity === undefined ? '' : category.quantity}
          onChange={(e) => {
            const val = e.target.value === '' ? null : Number(e.target.value);
            onChange({ ...category, quantity: val });
          }}
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute -top-1 -right-1 bg-white rounded-full">
                <Info className="h-3 w-3 text-slate-300 cursor-help" />
              </div>
            </TooltipTrigger>
            <TooltipContent id={`help-qty-${category.id}`}>
              <p>Quantidade opcional (kg, litros, unidades).</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <button 
        onClick={onDelete} 
        className="col-span-2 flex justify-center text-slate-300 hover:text-red-500 transition-colors"
        title="Remover categoria"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
};