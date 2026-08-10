import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Car, ArrowLeft, Construction } from "lucide-react";
import { pageHead } from "@/lib/seo";
import { Button } from "@/components/ui/button";

const PATH = "/orcamento-domestico/gastos-veiculos";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Orçamento Doméstico", path: "/orcamento-domestico" },
  { name: "Gastos com Veículos", path: PATH },
];

export const Route = createFileRoute("/orcamento-domestico/gastos-veiculos")({
  head: () =>
    pageHead({
      title: "Calculadora de Gastos com Veículos | Em Manutenção | ObraMétrica",
      description:
        "Estamos reestruturando a nossa calculadora de TCO e gastos com veículos para oferecer uma experiência ainda melhor. Volte em breve!",
      path: PATH,
      breadcrumbs: CRUMBS,
    }),
  component: VehicleStubPage,
});

function VehicleStubPage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 text-center">
        <Breadcrumbs items={CRUMBS} />
        
        <div className="mt-12 flex flex-col items-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-amber-600 mb-6">
            <Construction className="h-10 w-10" />
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Calculadora em Reestruturação
          </h1>
          
          <div className="mt-6 max-w-2xl text-lg text-slate-600 space-y-4">
            <p>
              A ferramenta <strong>Gastos com Veículos</strong> está temporariamente indisponível para manutenção e melhorias técnicas.
            </p>
            <p className="text-base text-slate-500">
              Estamos arquivando a versão atual para uma refatoração completa do motor de cálculos e da interface, visando maior precisão nos presets regionais e na análise de TCO.
            </p>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="default" size="lg">
              <Link to="/orcamento-domestico">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para Orçamento
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg">
              <Link to="/contato">
                Falar com o Suporte
              </Link>
            </Button>
          </div>
          
          <div className="mt-16 p-6 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-500 max-w-lg">
            <p className="font-medium text-slate-700 mb-2">Informação Técnica:</p>
            <p>
              Código arquivado em <code>src/components/Orcamento/archived/gastos-veiculos-20260810/</code>. 
              Para detalhes sobre a reimplantação, consulte o time de desenvolvimento.
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
