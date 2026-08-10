import React from 'react';
import { MarketCategory } from '@/lib/types/budget';
import { Trash2 } from 'lucide-react';

interface CategoryRowProps {
  category: MarketCategory;
  onChange: (c: MarketCategory) => void;
  onDelete: () => void;
}

export const CategoryRow: React.FC<CategoryRowProps> = ({ category, onChange, onDelete }) => {
  return (
    <div className="grid grid-cols-12 gap-2 mb-2 items-center">
      <input
        className="col-span-5 rounded-lg border border-slate-200 p-2 text-sm"
        value={category.name}
        onChange={(e) => onChange({ ...category, name: e.target.value })}
      />
      <input
        type="number"
        className="col-span-3 rounded-lg border border-slate-200 p-2 text-sm text-right"
        value={category.amount}
        onChange={(e) => onChange({ ...category, amount: Number(e.target.value) })}
      />
      <input
        type="number"
        className="col-span-2 rounded-lg border border-slate-200 p-2 text-sm text-center"
        value={category.quantity || 0}
        onChange={(e) => onChange({ ...category, quantity: Number(e.target.value) })}
      />
      <button onClick={onDelete} className="col-span-2 text-red-500 hover:text-red-700">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
};
