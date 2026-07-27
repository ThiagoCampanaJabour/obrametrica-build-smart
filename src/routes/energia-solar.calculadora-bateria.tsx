import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageHead } from "@/lib/seo";
import { BateriaForm } from "@/components/BateriaCalculator/BateriaForm";
import { Results } from "@/components/BateriaCalculator/Results";
import { CompareTable } from "@/components/BateriaCalculator/CompareTable";
import calcBateria, {
  DEFAULT_INPUT,
  type BateriaInput,
  type BateriaResult,
} from "@/lib/bateria/calc";

const PATH = "/energia-solar/calculadora-bateria";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Energia Solar", path: "/energia-solar" },
  { name: "Calculadora de Bateria", path: PATH },
];

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Qual a vida útil típica de uma bateria LFP?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Baterias LFP costumam ter 4.000–6.000 ciclos completos, o que equivale a 10–15 anos para uso residencial com 1 ciclo por dia. Degradação típica: 0,5–1% ao ano.",
      },
    },
    {
      "@type": "Question",
      name: "Quando devo substituir o banco de baterias?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Substitua quando a capacidade útil cair abaixo de 70–80% da nominal, quando os ciclos nominais forem atingidos ou quando houver falhas frequentes de tensão sob carga.",
      },
    },
    {
      "@type": "Question",
      name: "Baterias solares são seguras dentro de casa?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim, desde que instaladas por profissional habilitado, respeitando ventilação, temperatura e distância mínima. LFP tem maior estabilidade térmica que NMC ou chumbo-ácido.",
      },
    },
  ],
};

export const Route = createFileRoute("/energia-solar/calculadora-bateria")({
  head: () =>
    pageHead({
      title: "Calculadora de Bateria Solar — Dimensionamento e Custos | ObraMétrica",
      description:
        "Dimensione bancos de baterias fotovoltaicas: capacidade útil, número de unidades, custos, autonomia e substituições ao longo do tempo.",
      path: PATH,
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Calculadora de Bateria / Armazenamento Solar",
        url: `https://obrametrica.com.br${PATH}`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      extraSchemas: [FAQ_SCHEMA],
    }),
  component: BateriaPage,
});

function BateriaPage() {
  const [input, setInput] = useState<BateriaInput>(DEFAULT_INPUT);
  const [result, setResult] = useState<BateriaResult | null>(null);

  const handle = (i: BateriaInput) => {
    setInput(i);
    setResult(calcBateria(i));
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumbs items={CRUMBS} />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Calculadora de Bateria · Armazenamento Solar
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Dimensione o banco de baterias para o seu sistema fotovoltaico: capacidade útil,
          número de unidades, custos, autonomia prática e substituições ao longo do horizonte
          escolhido. Consulte também a{" "}
          <a href="/metodologia" className="underline hover:text-accent">metodologia</a>, o{" "}
          <a href="/energia-solar/calculadora-inversor" className="underline hover:text-accent">
            dimensionamento de inversor
          </a>{" "}e o{" "}
          <a href="/energia-solar/calculadora-payback" className="underline hover:text-accent">
            payback financeiro
          </a>.
        </p>

        <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">
          <BateriaForm onCalc={handle} />
        </div>

        <Results result={result} />
        {result && <CompareTable base={input} />}

        <div className="mt-10 rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          <strong className="text-foreground">Aviso:</strong> os resultados são estimativas
          técnico-econômicas. Preços de baterias variam com fornecedor e câmbio; valide o
          projeto final com engenheiro eletricista e integrador especializado.
        </div>
      </section>
    </SiteLayout>
  );
}
