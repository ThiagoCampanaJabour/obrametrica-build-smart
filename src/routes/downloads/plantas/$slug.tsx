import React from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Download, 
  ArrowLeft, 
  Maximize2, 
  FileText, 
  ShieldAlert,
  Info,
  CheckCircle2,
  Calendar,
  Ruler,
  Compass,
  Map,
  Home,
  Waves
} from 'lucide-react';
import { CasaAuroraSVG } from '@/components/Downloads/Plants/CasaAurora/CasaAuroraSVG';
import plantData from '@/../content/downloads/plantas/index.json';
import { PlantItem } from '@/lib/types/plant';
import { toast } from 'sonner';

export const Route = createFileRoute('/downloads/plantas/$slug')({
  component: PlantDetailPage,
});

function PlantDetailPage() {
  const { slug } = useParams({ from: '/downloads/plantas/$slug' });
  const plant = (plantData as PlantItem[]).find(p => p.slug === slug);

  if (!plant) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold">Projeto não encontrado</h1>
        <Button asChild className="mt-4">
          <Link i18n-is-dynamic-link="false" to="/downloads/plantas">Voltar para a lista</Link>
        </Button>
      </div>
    );
  }

  const handleDownload = (format: string) => {
    toast.success(`Iniciando download da ${format}...`);
    // In a real scenario, this would trigger the actual file download
    // For now we simulate the interaction
    if (plant.fileUrl) {
      window.open(plant.fileUrl, '_blank');
    } else {
      window.print();
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link i18n-is-dynamic-link="false" to="/downloads/plantas" className="hover:text-primary flex items-center gap-1 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Voltar para Plantas
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lado Esquerdo: Visualização Técnica */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border-2 border-primary/10 shadow-xl bg-white dark:bg-zinc-950">
            <div className="p-4 border-b bg-muted/30 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Compass className="h-5 w-5 text-primary" />
                <span className="font-semibold text-sm tracking-tight uppercase">Planta Baixa Técnica</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => window.print()} className="gap-2">
                <Maximize2 className="h-4 w-4" /> Ampliar
              </Button>
            </div>
            <div className="p-4 sm:p-8 flex justify-center items-center min-h-[500px] overflow-auto">
              <div className="w-full max-w-[600px] bg-white p-4 shadow-sm border rounded">
                <CasaAuroraSVG className="w-full h-auto" />
              </div>
            </div>
          </Card>

          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 p-6 rounded-xl space-y-4">
            <div className="flex gap-3">
              <ShieldAlert className="h-6 w-6 text-amber-600 shrink-0" />
              <div className="space-y-2">
                <h3 className="font-bold text-amber-900 dark:text-amber-100 uppercase text-sm tracking-wider">Aviso de Segurança e Responsabilidade</h3>
                <p className="text-sm text-amber-800/90 dark:text-amber-200/80 leading-relaxed">
                  {plant.disclaimerLong}
                </p>
                <div className="pt-2 flex flex-col gap-1">
                  <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                    • Dimensões preliminares sujeitas a alteração.
                  </span>
                  <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                    • Necessário validação por profissional habilitado (ART/RRT).
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Direito: Informações e Downloads */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex gap-2 mb-2">
              <Badge variant="default" className="bg-primary">{plant.categories[0]}</Badge>
              <Badge variant="secondary">{plant.isAutoral ? 'Projeto Autoral' : 'Domínio Público'}</Badge>
            </div>
            <h1 className="text-3xl font-bold leading-tight">{plant.title}</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {plant.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-muted/30 border-none shadow-none">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <Ruler className="h-5 w-5 text-primary mb-2" />
                <span className="text-xs text-muted-foreground uppercase font-medium">Área Construída</span>
                <span className="font-bold text-lg">{plant.area} m²</span>
              </CardContent>
            </Card>
            <Card className="bg-muted/30 border-none shadow-none">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <Map className="h-5 w-5 text-primary mb-2" />
                <span className="text-xs text-muted-foreground uppercase font-medium">Terreno Mínimo</span>
                <span className="font-bold text-lg">{plant.terreno}</span>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" /> Programa de Ambientes
            </h3>
            <div className="bg-card border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 text-muted-foreground text-[10px] uppercase font-bold tracking-widest">
                    <th className="px-4 py-2 text-left">Ambiente</th>
                    <th className="px-4 py-2 text-right">Área Aprox.</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {plant.ambientes?.map((amb, idx) => (
                    <tr key={idx} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-2 text-muted-foreground">{amb.nome}</td>
                      <td className="px-4 py-2 text-right font-medium">{amb.area.toFixed(2)} m²</td>
                    </tr>
                  ))}
                  <tr className="bg-primary/5 font-bold">
                    <td className="px-4 py-3 text-primary">ÁREA TOTAL</td>
                    <td className="px-4 py-3 text-right text-primary">{plant.area} m²</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <Button className="w-full h-12 text-base gap-2" onClick={() => handleDownload('Planta PDF')}>
              <Download className="h-5 w-5" /> Baixar Planta em PDF
            </Button>
            <Button variant="outline" className="w-full h-12 text-base gap-2" onClick={() => handleDownload('Ficha Técnica')}>
              <FileText className="h-5 w-5" /> Baixar Ficha do Projeto
            </Button>
          </div>

          <div className="space-y-4 pt-6">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Diferenciais</h3>
            <ul className="space-y-2">
              {[
                "Integração sala/cozinha/varanda",
                "Suíte master com closet privativo",
                "Lavanderia reservada com pátio",
                "Ventilação cruzada e luz natural",
                "Design moderno e sofisticado"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Home className="h-5 w-5 text-primary" />
            <h4 className="font-bold uppercase text-xs tracking-widest">Materiais Sugeridos</h4>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Recomendamos o uso de grandes formatos de porcelanato para a área social, esquadrias em alumínio preto (linha suprema ou similar) e bancadas em quartzo para durabilidade e sofisticação.
          </p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Waves className="h-5 w-5 text-primary" />
            <h4 className="font-bold uppercase text-xs tracking-widest">Instalações</h4>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Previsão para ar-condicionado no quarto e sala. Sistema de aquecimento solar ou a gás centralizado. O pátio de serviço permite fácil acesso técnico para manutenção.
          </p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h4 className="font-bold uppercase text-xs tracking-widest">Ficha Técnica</h4>
          </div>
          <div className="text-xs space-y-1 text-muted-foreground">
            <p><span className="font-semibold">Código:</span> OM-AUR-001</p>
            <p><span className="font-semibold">Revisão:</span> 00 (Agosto 2026)</p>
            <p><span className="font-semibold">Licença:</span> {plant.license.type}</p>
            <p><span className="font-semibold">Autor:</span> {plant.author}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
