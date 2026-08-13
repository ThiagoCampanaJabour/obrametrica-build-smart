import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  User, 
  Calendar, 
  Tag, 
  FileText,
  AlertTriangle,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import type { PlantItem } from '@/lib/types/plant';
import { toast } from 'sonner';

interface PlantDetailModalProps {
  plant: PlantItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PlantDetailModal: React.FC<PlantDetailModalProps> = ({ plant, isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!plant) return null;

  const isUnavailable = plant.status === 'unavailable';

  const copyAttribution = () => {
    navigator.clipboard.writeText(plant.attributionText);
    setCopied(true);
    toast.success('Atribuição copiada para a área de transferência');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-wrap gap-2 mb-2">
            {plant.categories.map(cat => (
              <Badge key={cat} variant="secondary">{cat}</Badge>
            ))}
            {isUnavailable && (
              <Badge variant="destructive">Arquivo Indisponível</Badge>
            )}
          </div>
          <DialogTitle className="text-2xl">{plant.title}</DialogTitle>
          <DialogDescription className="text-base mt-2">
            {plant.description}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-4">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden border">
              {plant.thumbnailUrl ? (
                <img 
                  src={plant.thumbnailUrl} 
                  alt={plant.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground italic">
                  Visualização indisponível
                </div>
              )}
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 p-4 rounded-lg">
              <div className="flex gap-2 items-start">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-800 dark:text-amber-200">
                  <p className="font-bold mb-1">AVISO LEGAL:</p>
                  <p>Verifique a licença e a responsabilidade técnica (ART/RRT) antes de usar estes arquivos em obras reais. O ObraMétrica não se responsabiliza pelo uso indevido ou erros técnicos nos projetos de terceiros.</p>
                </div>
              </div>
            </div>

            {isUnavailable && (
              <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
                <div className="flex gap-2 items-start">
                  <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div className="text-xs text-destructive">
                    <p className="font-bold mb-1">ARQUIVO INDISPONÍVEL:</p>
                    <p>Este recurso não está mais disponível na fonte original. Ele foi marcado como indisponível no nosso catálogo para evitar redirecionamentos a páginas inexistentes.</p>
                    <p className="mt-1 font-medium" data-testid={`plant-unavailable-lastchecked-${plant.id}`}>
                      Última verificação: {plant.lastCheckedAt ? new Date(plant.lastCheckedAt).toLocaleString('pt-BR') : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 text-sm p-2 bg-muted/50 rounded-md">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Formato:</span>
                <span>{plant.format}</span>
              </div>
              <div className="flex items-center gap-3 text-sm p-2 bg-muted/50 rounded-md">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                <span className="font-medium">Licença:</span>
                <a 
                  href={plant.license.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  {plant.license.type}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm p-2 bg-muted/50 rounded-md">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Autor:</span>
                <span>{plant.author}</span>
              </div>
              <div className="flex items-center gap-3 text-sm p-2 bg-muted/50 rounded-md">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Adicionado em:</span>
                <span>{new Date(plant.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Tag className="h-4 w-4" /> Tags
              </h4>
              <div className="flex flex-wrap gap-1">
                {plant.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="text-sm font-semibold mb-2">Atribuição Necessária</h4>
              <div className="flex items-center gap-2 p-2 bg-muted rounded-md text-xs group">
                <code className="flex-grow overflow-x-auto whitespace-nowrap">
                  {plant.attributionText}
                </code>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 shrink-0" 
                  onClick={copyAttribution}
                >
                  {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button 
            variant="outline" 
            className="flex-grow sm:flex-grow-0 gap-2"
            onClick={() => plant.sourceUrl && window.open(plant.sourceUrl, '_blank')}
            disabled={isUnavailable || !plant.sourceUrl}
          >
            <ExternalLink className="h-4 w-4" />
            Visitar Fonte Original
          </Button>
          <Button 
            variant={isUnavailable ? "secondary" : "default"} 
            className="flex-grow sm:flex-grow-0 gap-2"
            onClick={() => {
              if (isUnavailable) return;
              const url = plant.hosted ? plant.fileUrl : plant.sourceUrl;
              if (url) window.open(url, '_blank');
            }}
            disabled={isUnavailable}
          >
            <Download className="h-4 w-4" />
            {isUnavailable ? 'Arquivo Indisponível' : (plant.hosted ? 'Baixar Arquivo' : 'Download Externo')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
