import React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  ArrowLeft, 
  Info, 
  ShieldAlert, 
  Maximize, 
  Bed, 
  Bath, 
  Square, 
  Layout,
  FileText,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import type { PlantItem } from '@/lib/types/plant';
import plantData from '@/../content/downloads/plantas/index.json';

// Os componentes SVG específicos de cada planta devem ser importados condicionalmente 
// ou mapeados conforme necessário. Se não houver plantas, mantemos as funções puras.
import { downloadPlantaBaixaPDF, downloadPlantFile } from '@/lib/plant-download-utils';

export const Route = createFileRoute('/downloads/plantas/$slug')({
  loader: ({ params }) => {
    const plant = (plantData as PlantItem[]).find(p => p.slug === params.slug);
    if (!plant) throw new Error('Planta não encontrada');
    return plant;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title || 'Planta'} | Downloads ObraMétrica` },
      { name: 'description', content: loaderData?.description || '' },
      { property: 'og:title', content: loaderData?.title || '' },
      { property: 'og:description', content: loaderData?.description || '' },
      { name: 'twitter:card', content: 'summary_large_image' }
    ]
  }),
  component: PlantDetailComponent,
});

function PlantDetailComponent() {
  const plant = Route.useLoaderData();
  const [isGenerating, setIsGenerating] = React.useState(false);
  const svgRef = React.useRef<SVGSVGElement>(null);

  const handleDownload = async (format: 'PDF' | 'SVG') => {
    setIsGenerating(true);
    const toastId = toast.loading(`Preparando arquivo ${format}...`);
    
    try {
      if (format === 'PDF' && svgRef.current) {
        await downloadPlantaBaixaPDF(plant, svgRef.current);
        toast.success('Download concluído!', { id: toastId });
      } else if (format === 'SVG' && svgRef.current) {
        const svgData = new XMLSerializer().serializeToString(svgRef.current);
        downloadPlantFile(`${plant.slug}.svg`, svgData, 'image/svg+xml');
        toast.success('Download concluído!', { id: toastId });
      }
    } catch (error) {
      console.error('Erro no download:', error);
      toast.error('Erro ao gerar arquivo para download.', { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <Link to="/downloads/plantas" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Voltar para a listagem
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-2">
                <Layout className="h-4 w-4 text-primary" />
                Visualização Técnica
              </span>
              <Badge variant="outline" className="bg-background">Escala 1:100</Badge>
            </div>
            <div className="aspect-[3/4] p-8 flex items-center justify-center bg-white dark:bg-slate-900">
               {plant.slug === 'casa-2q-6x10-v1' && (
                 <Casa2Q6x10SVG ref={svgRef} className="w-full h-full max-h-[800px]" />
               )}
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4 flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900 dark:text-amber-200">
              <p className="font-bold mb-1 uppercase tracking-wider text-xs">Aviso Legal Obrigatório</p>
              <p className="leading-relaxed">{plant.disclaimerLong}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {plant.categories.map(cat => (
                <Badge key={cat} variant="secondary" className="px-3">{cat}</Badge>
              ))}
              {plant.isAutoral && (
                <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">Projeto Autoral</Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold leading-tight">{plant.title}</h1>
            <p className="text-muted-foreground leading-relaxed">{plant.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/50 p-4 rounded-xl border border-border/50 flex flex-col gap-1">
              <Square className="h-5 w-5 text-primary mb-1" />
              <span className="text-xs text-muted-foreground uppercase font-semibold tracking-tighter">Área Útil</span>
              <span className="text-lg font-bold">{plant.area} m²</span>
            </div>
            <div className="bg-muted/50 p-4 rounded-xl border border-border/50 flex flex-col gap-1">
              <Maximize className="h-5 w-5 text-primary mb-1" />
              <span className="text-xs text-muted-foreground uppercase font-semibold tracking-tighter">Terreno</span>
              <span className="text-lg font-bold">{plant.terreno}</span>
            </div>
            <div className="bg-muted/50 p-4 rounded-xl border border-border/50 flex flex-col gap-1">
              <Bed className="h-5 w-5 text-primary mb-1" />
              <span className="text-xs text-muted-foreground uppercase font-semibold tracking-tighter">Quartos</span>
              <span className="text-lg font-bold">{plant.quartos} (1 Suíte)</span>
            </div>
            <div className="bg-muted/50 p-4 rounded-xl border border-border/50 flex flex-col gap-1">
              <Bath className="h-5 w-5 text-primary mb-1" />
              <span className="text-xs text-muted-foreground uppercase font-semibold tracking-tighter">Banheiros</span>
              <span className="text-lg font-bold">{plant.banheiros}</span>
            </div>
          </div>

          <div className="bg-card border rounded-xl p-6 shadow-sm space-y-6">
            <div className="space-y-4">
              <h3 className="font-bold flex items-center gap-2">
                <Download className="h-5 w-5 text-primary" />
                Opções de Download
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <Button 
                  onClick={() => handleDownload('PDF')} 
                  disabled={isGenerating}
                  className="w-full h-12 text-md font-semibold gap-2 shadow-lg shadow-primary/20"
                >
                  <FileText className="h-5 w-5" />
                  Baixar Planta Técnica (PDF)
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleDownload('SVG')}
                  disabled={isGenerating}
                  className="w-full h-12 gap-2"
                >
                  <Layout className="h-5 w-5" />
                  Vetor Editável (SVG)
                </Button>
              </div>
              <p className="text-[10px] text-center text-muted-foreground italic">
                {plant.disclaimerShort}
              </p>
            </div>

            <div className="pt-6 border-t space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">Licença:</span>
                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 dark:bg-green-950/20">
                  {plant.license.type}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">Autor:</span>
                <span className="font-semibold">{plant.author}</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg text-xs border border-dashed">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <p className="leading-tight">
                  <span className="font-bold uppercase block text-[9px] mb-1">Atribuição:</span>
                  {plant.attributionText}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
