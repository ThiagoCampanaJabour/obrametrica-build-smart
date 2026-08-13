import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, ExternalLink, ShieldCheck, Info, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { PlantItem } from '@/lib/types/plant';
import { cn } from '@/lib/utils';

interface PlantCardProps {
  plant: PlantItem;
  onViewDetails: (plant: PlantItem) => void;
}

export const PlantCard: React.FC<PlantCardProps> = ({ plant, onViewDetails }) => {
  const isUnavailable = plant.status === 'unavailable';

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUnavailable) return;
    
    // Se for um projeto autoral com slug, navegamos para a página de detalhes
    // onde a geração do PDF real está implementada.
    if (plant.slug) {
      window.location.href = `/downloads/plantas/${plant.slug}`;
      return;
    }

    if (plant.hosted && plant.fileUrl) {
      window.open(plant.fileUrl, '_blank');
    } else if (plant.sourceUrl) {
      window.open(plant.sourceUrl, '_blank');
    }
  };

  const handleOpenSource = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUnavailable || !plant.sourceUrl) return;
    window.open(plant.sourceUrl, '_blank');
  };

  return (
    <Card 
      className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={() => {
        if (plant.slug) {
          window.location.href = `/downloads/plantas/${plant.slug}`;
        } else {
          onViewDetails(plant);
        }
      }}
      data-testid={`plant-card-${plant.id}`}
    >

      <div className="relative aspect-video overflow-hidden bg-muted">
        {plant.thumbnailUrl ? (
          <img 
            src={plant.thumbnailUrl} 
            alt={plant.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <Info className="h-10 w-10 opacity-20" />
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-1">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
            {Array.isArray(plant.format) ? plant.format.join('/') : plant.format}
          </Badge>
          <Badge 
            variant={plant.license.type.includes('CC0') || plant.license.type.includes('Domain') ? 'default' : 'outline'}
            className="bg-primary/90 text-primary-foreground"
          >
            {plant.license.type}
          </Badge>
          {isUnavailable && (
            <Badge variant="destructive" className="bg-destructive/90 text-destructive-foreground">
              Indisponível
            </Badge>
          )}
        </div>
      </div>
      
      <CardHeader className="p-4 pb-2">
        <div className="flex flex-wrap gap-1 mb-2">
          {plant.categories.map(cat => (
            <span key={cat} className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {cat}
            </span>
          ))}
        </div>
        <CardTitle className="text-lg line-clamp-1">{plant.title}</CardTitle>
        <CardDescription className="line-clamp-2 text-sm min-h-[40px]">
          {plant.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 pt-0 flex-grow">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
          <ShieldCheck className="h-3 w-3 text-green-600" />
          <span className="truncate">{plant.attributionText}</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        {isUnavailable && (
          <div className="flex items-center gap-1.5 text-[10px] text-destructive mb-1" data-testid={`plant-unavailable-reason-${plant.id}`}>
            <AlertCircle className="h-3 w-3" />
            <span>Arquivo indisponível na fonte</span>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-2 w-full">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs gap-1"
            onClick={handleOpenSource}
            disabled={isUnavailable}
            data-testid={`plant-open-${plant.id}`}
          >
            <ExternalLink className="h-3 w-3" />
            Fonte
          </Button>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-full">
                  <Button 
                    variant={isUnavailable ? "secondary" : "default"} 
                    size="sm" 
                    className="w-full text-xs gap-1"
                    onClick={handleDownload}
                    disabled={isUnavailable}
                    data-testid={isUnavailable ? `plant-unavailable-${plant.id}` : `plant-download-${plant.id}`}
                    aria-label={isUnavailable ? "Projeto indisponível" : `Baixar ${plant.title}`}
                  >
                    <Download className="h-3 w-3" />
                    {isUnavailable ? 'Indisponível' : (plant.hosted ? 'Baixar' : 'Acessar')}
                  </Button>
                </div>
              </TooltipTrigger>
              {!isUnavailable && (
                <TooltipContent>
                  <p>Clique para baixar os arquivos do projeto</p>
                </TooltipContent>
              )}
              {isUnavailable && (
                <TooltipContent>
                  <p>Fonte retornou 404 (verificado em {plant.lastCheckedAt ? new Date(plant.lastCheckedAt).toLocaleDateString('pt-BR') : 'data desconhecida'})</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardFooter>
    </Card>
  );
};
