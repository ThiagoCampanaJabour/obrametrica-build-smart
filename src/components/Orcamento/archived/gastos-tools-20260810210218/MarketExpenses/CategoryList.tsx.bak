import React from 'react';
import { MarketCategory } from '@/lib/types/budget';
import { CategoryRow } from './CategoryRow';

interface CategoryListProps {
  categories: MarketCategory[];
  onChange: (c: MarketCategory[]) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({ categories, onChange }) => {
  const handleUpdate = (index: number, updated: MarketCategory) => {
    const newCategories = [...categories];
    newCategories[index] = updated;
    onChange(newCategories);
  };

  const handleDelete = (index: number) => {
    onChange(categories.filter((_, i) => i !== index));
  };

  const addCategory = () => {
    onChange([...categories, { id: Math.random().toString(), name: 'Nova Categoria', amount: 0, isLocked: false }]);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mt-4">
      <h3 className="font-bold text-slate-900 mb-4">Categorias</h3>
      {categories.map((c, i) => (
        <CategoryRow key={c.id} category={c} onChange={(u) => handleUpdate(i, u)} onDelete={() => handleDelete(i)} />
      ))}
      <button onClick={addCategory} className="text-primary text-sm font-bold mt-2 hover:underline">
        + Adicionar Categoria
      </button>
    </div>
  );
};
