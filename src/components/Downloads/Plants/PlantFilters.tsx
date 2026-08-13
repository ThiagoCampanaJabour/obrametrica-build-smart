import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PlantCategory, PlantFormat } from '@/lib/types/plant';

interface PlantFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedFormat: string;
  setSelectedFormat: (format: string) => void;
  categories: string[];
  formats: string[];
}

export const PlantFilters: React.FC<PlantFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedFormat,
  setSelectedFormat,
  categories,
  formats
}) => {
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedFormat('all');
  };

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'all' || selectedFormat !== 'all';

  return (
    <div className="bg-card border rounded-lg p-4 shadow-sm space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Filter className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-sm">Filtros e Busca</h3>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="ml-auto h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-destructive"
          >
            <X className="h-3 w-3" />
            Limpar
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="search" className="text-xs">Buscar por nome ou tag</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Ex: residência, galpão..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category" className="text-xs">Categoria</Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="format" className="text-xs">Formato do Arquivo</Label>
          <Select value={selectedFormat} onValueChange={setSelectedFormat}>
            <SelectTrigger id="format">
              <SelectValue placeholder="Todos os formatos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os formatos</SelectItem>
              {formats.map(fmt => (
                <SelectItem key={fmt} value={fmt}>{fmt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
