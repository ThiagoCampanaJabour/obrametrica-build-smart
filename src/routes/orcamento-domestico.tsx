import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SpreadsheetBudget } from "@/components/Orcamento/SpreadsheetBudget/SpreadsheetBudget";
import { pageHead } from "@/lib/seo";
import { Wallet } from "lucide-react";

const PATH = "/orcamento-domestico";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Orçamento Doméstico", path: PATH },
];

export const Route = createFileRoute("/orcamento-domestico")({
  head: () =>
    pageHead({
      title: "Orçamento Doméstico — Gestão em Planilha Excel-Like | ObraMétrica",
      description:
        "Controle seu orçamento doméstico com nossa planilha avançada. Módulos para mercado, casa, veículos, educação e lazer com agregação automática.",
      path: PATH,
      breadcrumbs: CRUMBS,
    }),
  component: OrcamentoDomesticoPage,
});

function OrcamentoDomesticoPage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumbs items={CRUMBS} />
        
        <div className="mt-8 mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
              <Wallet className="h-8 w-8" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary/80">
                Finanças Inteligentes
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                Orçamento Doméstico
              </h1>
            </div>
          </div>
        </div>

        <SpreadsheetBudget />
      </section>
    </SiteLayout>
  );
}
