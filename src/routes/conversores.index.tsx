import { createFileRoute, Link } from "@tanstack/react-router";
import { Square, Ruler, Droplets, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/conversores/")({
  component: ConversoresIndex,
});

const converters = [
  {
    to: "/conversores/m2-hectare" as const,
    icon: Square,
    title: "m² para Hectare",
    desc: "Converte metros quadrados para hectares de forma instantânea.",
  },
  {
    to: "/conversores/cm-polegada" as const,
    icon: Ruler,
    title: "cm para Polegada",
    desc: "Converte centímetros para polegadas com precisão.",
  },
  {
    to: "/conversores/litros-m3" as const,
    icon: Droplets,
    title: "Litros para m³",
    desc: "Converte litros para metros cúbicos em tempo real.",
  },
];

function ConversoresIndex() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <span className="inline-block rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-foreground">
        Conversores
      </span>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        Conversores Técnicos
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Conversões de unidades usadas no dia a dia da construção e engenharia.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {converters.map(({ to, icon: Icon, title, desc }) => (
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
  );
}
