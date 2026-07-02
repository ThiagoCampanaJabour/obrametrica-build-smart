import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Sun, TrendingUp, ArrowRight } from "lucide-react";
import { pageHead } from "@/lib/seo";
import { CategoryLatestPosts } from "@/components/category-latest-posts";

const PATH = "/energia-solar";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Energia Solar", path: PATH },
];

export const Route = createFileRoute("/energia-solar")({
  head: () =>
    pageHead({
      title: "Calculadoras de Energia Solar — Placas e Economia | ObraMétrica",
      description:
        "Calculadoras de energia solar: dimensionamento de placas e estimativa de economia mensal, anual e em 10 anos.",
      path: PATH,
      breadcrumbs: CRUMBS,
    }),
  component: EnergiaSolarPage,
});

const tools = [
  {
    to: "/quantas-placas-solares-preciso" as const,
    icon: Sun,
    title: "Quantas Placas Solares Preciso",
    desc: "Dimensione o sistema fotovoltaico a partir do consumo mensal em kWh.",
  },
  {
    to: "/economia-energia-solar" as const,
    icon: TrendingUp,
    title: "Economia com Energia Solar",
    desc: "Estime a economia no mês, no ano e em 10 anos.",
  },
];

function EnergiaSolarPage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumbs items={CRUMBS} />
        <span className="mt-4 inline-block rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-foreground">
          Energia Solar
        </span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Calculadoras de Energia Solar
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Ferramentas rápidas para dimensionar seu sistema e estimar a economia na conta de luz.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {tools.map(({ to, icon: Icon, title, desc }) => (
            <Link
              key={to}
              to={to}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-accent hover:shadow-lg"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/20 text-foreground">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-foreground">{title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-foreground">
                Abrir{" "}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
        <CategoryLatestPosts slug="energia-solar" />
      </section>
    </SiteLayout>
  );
}
