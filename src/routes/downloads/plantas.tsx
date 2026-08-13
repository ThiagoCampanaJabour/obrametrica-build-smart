import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { PlantsList } from '@/components/Downloads/Plants/PlantsList';
import { PlantFilters } from '@/components/Downloads/Plants/PlantFilters';
import { PlantDetailModal } from '@/components/Downloads/Plants/PlantDetailModal';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, ShieldAlert, Download } from 'lucide-react';
import type { PlantItem, PlantCategory, PlantFormat } from '@/lib/types/plant';
import plantData from '../../../../content/downloads/plantas/index.json';

export const Route = createFileRoute('/downloads/plantas')({
  head: () => ({
    meta: [
      { title: 'Downloads de Plantas e Projetos | ObraMétrica' },
      { name: 'description', content: 'Catálogo curado de plantas de casas, galpões e projetos de engenharia em domínio público e CC0. Download gratuito de arquivos PDF, DWG e DXF.' },
      { property: 'og:title', content: 'Downloads de Plantas e Projetos | ObraMétrica' },
      { property: 'og:description', content: 'Baixe plantas baixas e projetos técnicos em domínio público e CC0 gratuitamente.' },
      { name: 'twitter:card', content: 'summary_large_image' }
    ]
  }),
  component: PlantsPageComponent,
});

function PlantsPageComponent() {
  const allPlants = plantData as PlantItem[];
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [selectedFormat, setSelectedFormat] = React.useState('all');
  const [selectedPlant, setSelectedPlant] = React.useState<PlantItem | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const categories = Array.from(new Set(allPlants.flatMap(p => p.categories))).sort();
  const formats = Array.from(new Set(allPlants.map(p => p.format))).sort();

  const filteredPlants = allPlants.filter(plant => {
    const matchesSearch = plant.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plant.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || plant.categories.includes(selectedCategory as PlantCategory);
    const matchesFormat = selectedFormat === 'all' || plant.format === selectedFormat;
    
    return matchesSearch && matchesCategory && matchesFormat;
  });

  const handleViewDetails = (plant: PlantItem) => {
    setSelectedPlant(plant);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Download className="h-8 w-8 text-primary" />
          Download de Plantas e Projetos
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Acesso gratuito a projetos arquitetônicos e complementares curados. Todos os arquivos são verificados quanto à licença de uso e redistribuição.
        </p>
      </div>

      <Alert variant="destructive" className="bg-destructive/5 border-destructive/20 text-destructive-foreground dark:text-destructive">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Aviso Legal Importante</AlertTitle>
        <AlertDescription className="text-xs sm:text-sm">
          Estes arquivos são disponibilizados sob licenças de domínio público ou Creative Commons. 
          <strong> Verifique a licença específica e a responsabilidade técnica (ART/RRT) antes de usar em obras reais. </strong>
          O ObraMétrica atua apenas como repositório curador e não se responsabiliza pelo uso indevido ou erros técnicos.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 gap-6">
        <PlantFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedFormat={selectedFormat}
          setSelectedFormat={setSelectedFormat}
          categories={categories}
          formats={formats}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Projetos Disponíveis ({filteredPlants.length})</h2>
          </div>
          <PlantsList 
            plants={filteredPlants} 
            onViewDetails={handleViewDetails}
          />
        </div>
      </div>

      <div className="bg-muted/50 p-6 rounded-lg border border-dashed flex flex-col items-center text-center space-y-3">
        <Info className="h-6 w-6 text-primary" />
        <h3 className="font-semibold">Tem um projeto para compartilhar?</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Aceitamos sugestões de plantas em domínio público ou de sua autoria com licença permissiva.
          Entre em contato para submeter seu material para nossa curadoria.
        </p>
      </div>

      <PlantDetailModal 
        plant={selectedPlant}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
