import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Hammer, Boxes, LayoutGrid, Paintbrush, Layers, ArrowRight } from "lucide-react";
import { pageHead } from "@/lib/seo";

const PATH = "/construcao-civil";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Construção Civil", path: PATH },
];

export const Route = createFileRoute("/construcao-civil")({
  head: () =>
    pageHead({
      title: "Calculadoras de Construção Civil — Tijolos, Concreto, Piso, Tinta | ObraMétrica",
      description:
        "Calculadoras técnicas de construção civil: tijolos, concreto, piso, tinta e argamassa. Dimensione materiais com precisão.",
      path: PATH,
      breadcrumbs: CRUMBS,
    }),
  component: ConstrucaoCivilPage,
});

const calcs = [
  {
    to: "/calculadora-de-tijolos" as const,
    icon: Hammer,
    title: "Calculadora de Tijolos",
    desc: "Quantidade de tijolos por área e tipo.",
  },
  {
    to: "/calculadora-de-concreto" as const,
    icon: Boxes,
    title: "Calculadora de Concreto",
    desc: "Volume de concreto em m³.",
  },
  {
    to: "/calculadora-de-piso" as const,
    icon: LayoutGrid,
    title: "Calculadora de Piso",
    desc: "Área e quantidade de caixas com sobra.",
  },
  {
    to: "/calculadora-de-tinta" as const,
    icon: Paintbrush,
    title: "Calculadora de Tinta",
    desc: "Litros necessários por demão.",
  },
  {
    to: "/calculadora-de-argamassa" as const,
    icon: Layers,
    title: "Calculadora de Argamassa",
    desc: "Sacos de argamassa por aplicação.",
  },
];

function ConstrucaoCivilPage() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumbs items={CRUMBS} />
        <span className="mt-4 inline-block rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-foreground">
          Construção Civil
        </span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Calculadoras de Construção Civil
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Ferramentas precisas para dimensionar materiais e otimizar sua obra.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {calcs.map(({ to, icon: Icon, title, desc }) => (
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
      </section>
    </SiteLayout>
  );
}
