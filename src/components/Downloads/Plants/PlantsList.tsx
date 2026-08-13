import React from 'react';
import { PlantCard } from './PlantCard';
import type { PlantItem } from '@/lib/types/plant';

interface PlantsListProps {
  plants: PlantItem[];
  onViewDetails: (plant: PlantItem) => void;
}

export const PlantsList: React.FC<PlantsListProps> = ({ plants, onViewDetails }) => {
  if (plants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed rounded-lg bg-muted/30">
        <p className="text-muted-foreground text-center">
          Nenhuma planta encontrada para os filtros selecionados.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {plants.map((plant) => (
        <PlantCard 
          key={plant.id} 
          plant={plant} 
          onViewDetails={onViewDetails} 
        />
      ))}
    </div>
  );
};
