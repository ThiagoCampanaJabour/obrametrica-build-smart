import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/downloads/plantas/$slug')({
  component: PlantNotFoundComponent,
});

function PlantNotFoundComponent() {
  return (
    <div className="container mx-auto py-20 px-4 max-w-2xl text-center">
      <div className="bg-muted/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
        <Search className="h-10 w-10 text-muted-foreground" />
      </div>
      <h1 className="text-3xl font-bold mb-4">Planta não encontrada</h1>
      <p className="text-muted-foreground mb-8 text-lg">
        O projeto solicitado não está disponível em nosso catálogo ou foi removido permanentemente para atualização.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild variant="default">
          <Link to="/downloads/plantas">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Catálogo
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            Página Inicial
          </Link>
        </Button>
      </div>
    </div>
  );
}
