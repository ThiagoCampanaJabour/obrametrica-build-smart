import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageHead } from "@/lib/seo";
import { SimuladorForm } from "@/components/SimuladorAvancado/SimuladorForm";
import { Results } from "@/components/SimuladorAvancado/Results";
import { ExportButtons } from "@/components/SimuladorAvancado/ExportButtons";
import simulate, { type SimulateParams, type SimulateResult } from "@/lib/simulador-avancado/calc";

const PATH = "/simulador-solar-avancado";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Energia Solar", path: "/energia-solar" },
  { name: "Simulador Avançado", path: PATH },
];

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Qual a precisão do Simulador Avançado?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "É uma estimativa técnica com irradiância média e heurísticas de sombreamento. Para projetos executivos, recomenda-se validação em campo com irradiância local (PVGIS) e análise de sombra horária.",
      },
    },
    {
      "@type": "Question",
      name: "Como o simulador estima a perda por sombreamento?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Combina a diferença angular entre a orientação real e a ótima (tilt/azimute) e aplica faixas: <15° ≈ 1–2%, 15–45° ≈ 3–8%, >45° ≈ 8–20%, parametrizáveis pelo usuário.",
      },
    },
  ],
};

export const Route = createFileRoute("/simulador-solar-avancado")({
  head: () =>
    pageHead({
      title: "Simulador Avançado de Energia Solar — Dimensionamento e Strings | ObraMétrica",
      description:
        "Simulador avançado de dimensionamento solar com sombreamento simplificado e otimização de strings. Exporte resultados em JSON/CSV.",
      path: PATH,
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Simulador Solar Avançado",
        url: `https://obrametrica.com.br${PATH}`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      extraSchemas: [FAQ_SCHEMA],
    }),
  component: SimuladorAvancadoPage,
});

function SimuladorAvancadoPage() {
  const [result, setResult] = useState<SimulateResult | null>(null);

  const handle = (params: SimulateParams) => setResult(simulate(params));

  return (
    <SiteLayout>
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumbs items={CRUMBS} />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Simulador Avançado de Energia Solar
        </h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Dimensione o sistema fotovoltaico com heurísticas de sombreamento e otimização de
          strings. Todos os cálculos rodam localmente no seu navegador. Consulte a{" "}
          <a href="/metodologia" className="underline hover:text-accent">
            metodologia
          </a>{" "}
          para conhecer as suposições.
        </p>

        <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">
          <SimuladorForm onSimulate={handle} />
        </div>

        <Results result={result} />
        <ExportButtons result={result} />

        <div className="mt-10 rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          <strong className="text-foreground">Aviso:</strong> os resultados são estimativas
          educacionais. Para projetos executivos, valide com irradiância local (PVGIS/INMET) e
          análise de sombreamento horária.
        </div>
      </section>
    </SiteLayout>
  );
}
