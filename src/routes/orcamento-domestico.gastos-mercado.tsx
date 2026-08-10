import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageHead } from "@/lib/seo";
import { ShoppingCart } from "lucide-react";
import { MarketExpensesPage } from "@/components/Orcamento/MarketExpenses/MarketExpensesPage";

const PATH = "/orcamento-domestico/gastos-mercado";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Orçamento Doméstico", path: "/orcamento-domestico" },
  { name: "Gastos com Mercado", path: PATH },
];

export const Route = createFileRoute("/orcamento-domestico/gastos-mercado")({
  head: () =>
    pageHead({
      title: "Calculadora de Gastos com Mercado e Alimentação Detalhada | ObraMétrica",
      description: "Controle seu orçamento de mercado item por item. Defina um teto mensal, detalhe categorias e veja o saldo em tempo real com projeção de inflação.",
      path: PATH,
      breadcrumbs: CRUMBS,
    }),
  component: GastosMercadoRoute,
});

function GastosMercadoRoute() {
  return (
    <SiteLayout>
      <div className="bg-slate-50 min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <Breadcrumbs items={CRUMBS} />
          
          <div className="mt-8 mb-10">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                <ShoppingCart className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight sm:text-4xl">Orçamento de Mercado</h1>
                <p className="mt-1 text-slate-600">Gestão detalhada de alimentação, higiene e limpeza familiar.</p>
              </div>
            </div>
          </div>

          <MarketExpensesPage />
        </div>
      </div>
    </SiteLayout>
  );
}
