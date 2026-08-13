import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, ExternalLink, ShieldCheck, Info } from 'lucide-react';
import type { PlantItem } from '@/lib/types/plant';
import { cn } from '@/lib/utils';

interface PlantCardProps {
  plant: PlantItem;
  onViewDetails: (plant: PlantItem) => void;
}

export const PlantCard: React.FC<PlantCardProps> = ({ plant, onViewDetails }) => {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (plant.hosted) {
      window.open(plant.fileUrl, '_blank');
    } else {
      window.open(plant.sourceUrl, '_blank');
    }
  };

  const handleOpenSource = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(plant.sourceUrl, '_blank');
  };

  return (
    <Card 
      className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={() => onViewDetails(plant)}
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
            {plant.format}
          </Badge>
          <Badge 
            variant={plant.license.type.includes('CC0') || plant.license.type.includes('Domain') ? 'default' : 'outline'}
            className="bg-primary/90 text-primary-foreground"
          >
            {plant.license.type}
          </Badge>
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

      <CardFooter className="p-4 pt-0 grid grid-cols-2 gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-xs gap-1"
          onClick={handleOpenSource}
        >
          <ExternalLink className="h-3 w-3" />
          Fonte
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          className="w-full text-xs gap-1"
          onClick={handleDownload}
        >
          <Download className="h-3 w-3" />
          {plant.hosted ? 'Baixar' : 'Acessar'}
        </Button>
      </CardFooter>
    </Card>
  );
};
