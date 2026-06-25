import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Building2, Sun, Calculator, ArrowRight } from "lucide-react";
import { pageHead, SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => pageHead({
    title: "ObraMétrica — Calculadoras para Construção Civil, Energia Solar e Conversores",
    description: SITE_DESCRIPTION,
    path: "/",
    schema: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  }),
  component: Index,
});

const categories = [
  { to: "/construcao-civil" as const, icon: Building2, title: "Construção Civil", desc: "Concreto, alvenaria, pisos, tinta e argamassa." },
  { to: "/energia-solar" as const, icon: Sun, title: "Energia Solar", desc: "Dimensionamento de sistemas e economia estimada." },
  { to: "/conversores" as const, icon: Calculator, title: "Conversores", desc: "Unidades técnicas para o dia a dia da obra." },
];

function Index() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground">
              ObraMétrica
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
              Cálculos inteligentes para <span className="text-accent">construir melhor</span>.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-primary-foreground/80">
              Portal de calculadoras para construção civil, energia solar e conversores técnicos.
              Ferramentas precisas, rápidas e gratuitas.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Categorias</h2>
        <p className="mt-2 text-muted-foreground">Escolha uma categoria para começar.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {categories.map(({ to, icon: Icon, title, desc }) => (
            <Link key={to} to={to} className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-accent hover:shadow-lg">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/20 text-foreground">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-foreground group-hover:text-accent-foreground">
                Explorar <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
