import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { cn } from "@/lib/utils";
import { 
  ShoppingCart, 
  Car, 
  ArrowRight, 
  Wallet,
  Calculator
} from "lucide-react";
import { pageHead } from "@/lib/seo";

const PATH = "/orcamento-domestico";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Orçamento Doméstico", path: PATH },
];

export const Route = createFileRoute("/orcamento-domestico")({
  head: () =>
    pageHead({
      title: "Orçamento Doméstico — Gestão de Mercado, Veículos e Energia | ObraMétrica",
      description:
        "Ferramentas modulares para controle orçamentário: gastos com mercado, veículos e simulador energético. Otimize suas finanças familiares.",
      path: PATH,
      breadcrumbs: CRUMBS,
    }),
  component: OrcamentoDomesticoLayout,
});

function OrcamentoDomesticoLayout() {
  const location = useLocation();
  const isHub = location.pathname === PATH;

  if (!isHub) {
    return <Outlet />;
  }

  return <OrcamentoHubPage />;
}

const tools: any[] = [];


function OrcamentoHubPage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumbs items={CRUMBS} />
        
        <div className="mt-8 flex items-center gap-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Wallet className="h-6 w-6" />
            </div>
            <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Finanças Familiares
                </span>
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                    Orçamento Doméstico
                </h1>
            </div>
        </div>
        
        <p className="mt-6 max-w-2xl text-lg text-slate-600">
          Conjunto de ferramentas especializadas para ajudar no controle de custos fixos e variáveis da sua casa, facilitando a tomada de decisões financeiras.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {tools.map(({ to, icon: Icon, title, desc, archived }) => (
            <Link
              key={to}
              to={archived ? undefined : to}
              disabled={archived}
              className={cn(
                "group rounded-2xl border border-slate-200 bg-white p-8 transition-all hover:border-primary hover:shadow-xl",
                archived && "opacity-60 cursor-not-allowed hover:border-slate-200 hover:shadow-none"
              )}
            >
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-slate-50 text-slate-900 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <Icon className="h-7 w-7" />
              </div>
              <h2 className="mt-6 text-xl font-bold text-slate-900">{title}</h2>
              <p className="mt-3 text-slate-600 leading-relaxed">{desc}</p>
              <div className="mt-6 flex items-center gap-2 text-sm font-bold text-primary opacity-80 group-hover:opacity-100">
                {archived ? "Em manutenção" : "Acessar calculadora"}
                {!archived && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
              </div>
            </Link>
          ))}
          
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-8 flex flex-col justify-center items-center text-center opacity-70 col-span-full">
              <Calculator className="h-10 w-10 text-slate-400 mb-4" />
              <h3 className="text-lg font-semibold text-slate-700">Módulos de Orçamento</h3>
              <p className="text-sm text-slate-500 mt-2">Estamos reestruturando nossas ferramentas de gestão financeira para oferecer uma experiência mais integrada. Em breve novidades.</p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
