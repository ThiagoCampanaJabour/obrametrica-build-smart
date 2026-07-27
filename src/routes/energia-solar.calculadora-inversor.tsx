import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageHead } from "@/lib/seo";
import { InversorForm } from "@/components/InversorSizing/InversorForm";
import { Results } from "@/components/InversorSizing/Results";
import sizeStrings, { type SizingInput, type SizingResult } from "@/lib/inversor-sizing/calc";

const PATH = "/energia-solar/calculadora-inversor";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Energia Solar", path: "/energia-solar" },
  { name: "Calculadora de Inversor", path: PATH },
];

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Por que corrigir Voc pela temperatura mínima?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A tensão em circuito aberto (Voc) aumenta com o frio. Se a Voc corrigida ultrapassar o Voc máximo do inversor, há risco de dano. A calculadora aplica Voc_corr = Voc × (1 + coef × ΔT).",
      },
    },
    {
      "@type": "Question",
      name: "Qual safety factor usar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Um safety factor de 0,95 sobre o Voc máximo do inversor é conservador e recomendado como padrão. Ajuste conforme instruções do fabricante do inversor.",
      },
    },
  ],
};

export const Route = createFileRoute("/energia-solar/calculadora-inversor")({
  head: () =>
    pageHead({
      title: "Calculadora de Inversor e String Sizing Solar | ObraMétrica",
      description:
        "Dimensione strings fotovoltaicas para inversores: Voc corrigido pela temperatura, faixa MPPT, DC/AC ratio e alertas de compatibilidade.",
      path: PATH,
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Calculadora de Inversor / String Sizing",
        url: `https://obrametrica.com.br${PATH}`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      extraSchemas: [FAQ_SCHEMA],
    }),
  component: InversorPage,
});

function InversorPage() {
  const [result, setResult] = useState<SizingResult | null>(null);

  const handle = (input: SizingInput) => setResult(sizeStrings(input));

  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumbs items={CRUMBS} />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Calculadora de Inversor · String Sizing
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Dimensione o número ideal de módulos por string para o seu inversor, com correção de Voc
          pela temperatura mínima e validação da faixa MPPT. Ideal para pré-projeto e memoriais
          técnicos. Consulte também a{" "}
          <a href="/metodologia" className="underline hover:text-accent">metodologia</a> e o{" "}
          <a href="/simulador-solar-avancado" className="underline hover:text-accent">
            simulador avançado
          </a>.
        </p>

        <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">
          <InversorForm onCalc={handle} />
        </div>

        <Results result={result} />

        <div className="mt-10 rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          <strong className="text-foreground">Aviso:</strong> os resultados são estimativas
          técnicas. Sempre valide o projeto executivo com um engenheiro eletricista responsável e
          consulte a datasheet oficial do inversor.
        </div>
      </section>
    </SiteLayout>
  );
}
