import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Calculator, Wallet } from "lucide-react";
import { pageHead } from "@/lib/seo";

const PATH = "/orcamento-domestico/gastos-mercado";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Orçamento Doméstico", path: "/orcamento-domestico" },
  { name: "Gastos com Mercado", path: PATH },
];

export const Route = createFileRoute("/orcamento-domestico/gastos-mercado")({
  head: () =>
    pageHead({
      title: "Página Removida | ObraMétrica",
      description: "Esta ferramenta foi removida para reestruturação.",
      path: PATH,
      breadcrumbs: CRUMBS,
    }),
  component: RemovedToolPage,
});

function RemovedToolPage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-8">
          <Calculator className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Ferramenta Removida</h1>
        <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
          A calculadora de "Gastos com Mercado" foi desativada permanentemente desta rota como parte de uma reestruturação do módulo de Orçamento Doméstico.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/orcamento-domestico"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary/90"
          >
            Voltar ao Hub de Orçamento
          </a>
        </div>
      </section>
    </SiteLayout>
  );
}
