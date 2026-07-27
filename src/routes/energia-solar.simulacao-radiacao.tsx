import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageHead } from "@/lib/seo";
import { LocationForm } from "@/components/SimulacaoRadiacao/LocationForm";
import { Results } from "@/components/SimulacaoRadiacao/Results";
import { ExportButtons } from "@/components/SimulacaoRadiacao/ExportButtons";
import simulate, { type RadiacaoInput, type RadiacaoResult } from "@/lib/simulacao-radiacao/calc";

const PATH = "/energia-solar/simulacao-radiacao";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Energia Solar", path: "/energia-solar" },
  { name: "Simulação por Localização", path: PATH },
];

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "A Simulação por Localização substitui dados de medição local?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Não. O MVP usa presets internos com incerteza de ±10 a ±25%. Para projetos executivos, use PVGIS, NSRDB ou medições em campo.",
      },
    },
    {
      "@type": "Question",
      name: "Como interpretar kWh/kWp·ano?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "É a produção específica: quantos kWh cada kWp instalado gera em um ano. No Brasil, faixas típicas: Sul 1.200–1.350; Sudeste/Centro-Oeste 1.400–1.550; Nordeste 1.500–1.700.",
      },
    },
    {
      "@type": "Question",
      name: "Posso confiar no resultado para dimensionar sistema off-grid?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Como estimativa inicial sim; combine com margem de 20–30% e a Calculadora de Bateria da ObraMétrica.",
      },
    },
  ],
};

export const Route = createFileRoute("/energia-solar/simulacao-radiacao")({
  head: () =>
    pageHead({
      title: "Simulação por Localização / Radiação Solar — ObraMétrica",
      description:
        "Estime irradiância e produção fotovoltaica anual e mensal a partir de cidade, CEP ou coordenadas. Presets brasileiros e exportação CSV/JSON.",
      path: PATH,
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Simulação por Localização / Radiação Solar",
        url: `https://obrametrica.com.br${PATH}`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      extraSchemas: [FAQ_SCHEMA],
    }),
  component: SimulacaoRadiacaoPage,
});

function SimulacaoRadiacaoPage() {
  const [input, setInput] = useState<RadiacaoInput | null>(null);
  const [result, setResult] = useState<RadiacaoResult | null>(null);

  const handle = (i: RadiacaoInput) => { setInput(i); setResult(simulate(i)); };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumbs items={CRUMBS} />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Simulação por Localização · Radiação Solar
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Estime a irradiância média e a produção fotovoltaica anual e mensal para o seu local
          a partir de coordenadas, CEP ou cidade. Cálculos rodam localmente com presets brasileiros.
          Consulte a{" "}
          <a href="/metodologia" className="underline hover:text-accent">metodologia</a> e combine com o{" "}
          <a href="/energia-solar/calculadora-payback" className="underline hover:text-accent">payback</a>.
        </p>

        <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">
          <LocationForm onCalc={handle} />
        </div>

        <Results result={result} />
        <ExportButtons input={input} result={result} />

        <div className="mt-10 rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          <strong className="text-foreground">Aviso:</strong> estimativas educacionais baseadas em
          presets internos (incerteza ±10–25%). Para projeto executivo, valide com PVGIS/NSRDB e
          análise horária de sombreamento local.
        </div>
      </section>
    </SiteLayout>
  );
}
