import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageHead } from "@/lib/seo";
import { PaybackForm } from "@/components/PaybackCalculator/PaybackForm";
import { ResultsTable } from "@/components/PaybackCalculator/ResultsTable";
import { Chart } from "@/components/PaybackCalculator/Chart";
import { ExportButtons } from "@/components/PaybackCalculator/ExportButtons";
import { ScenarioCompare } from "@/components/PaybackCalculator/ScenarioCompare";
import { CENARIOS, simulatePayback, type PaybackInput, type PaybackResult } from "@/lib/payback/calc";

const PATH = "/energia-solar/calculadora-payback";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Energia Solar", path: "/energia-solar" },
  { name: "Calculadora de Payback", path: PATH },
];

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "O que é payback simples e descontado?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Payback simples é o tempo até recuperar o investimento sem considerar o valor do dinheiro no tempo. Payback descontado utiliza uma taxa de desconto para refletir o custo de oportunidade.",
      },
    },
    {
      "@type": "Question",
      name: "Como o VPL e a TIR são calculados?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "O VPL soma os fluxos futuros descontados subtraindo o investimento inicial. A TIR é a taxa que zera o VPL, calculada por bissecção sobre os fluxos anuais.",
      },
    },
  ],
};

export const Route = createFileRoute("/energia-solar/calculadora-payback")({
  head: () =>
    pageHead({
      title: "Calculadora de Payback e Fluxo de Caixa Solar | ObraMétrica",
      description:
        "Simule payback simples e descontado, VPL, TIR e fluxo de caixa anual do seu sistema fotovoltaico com cenários conservador, padrão e otimista.",
      path: PATH,
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Calculadora de Payback Solar",
        url: `https://obrametrica.com.br${PATH}`,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      extraSchemas: [FAQ_SCHEMA],
    }),
  component: PaybackPage,
});

function PaybackPage() {
  const [result, setResult] = useState<PaybackResult | null>(null);
  const [compareBase, setCompareBase] = useState<Omit<PaybackInput, "cenario"> | null>(null);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumbs items={CRUMBS} />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Calculadora de Payback e Fluxo de Caixa — Energia Solar
        </h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Estime o tempo de retorno do investimento, VPL, TIR e projete o fluxo de caixa anual do
          seu sistema fotovoltaico. Compare cenários conservador, padrão e otimista. Todos os
          cálculos rodam localmente. Consulte a{" "}
          <a href="/metodologia" className="underline hover:text-accent">metodologia</a>.
        </p>

        <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">
          <PaybackForm
            onSimulate={(input) => {
              setResult(simulatePayback(input));
              setCompareBase(null);
            }}
            onCompare={(base) => {
              setResult(simulatePayback({ ...base, cenario: CENARIOS.padrao }));
              setCompareBase(base);
            }}
          />
        </div>

        <ResultsTable result={result} />
        {result && <Chart fluxo={result.fluxo} />}
        <ExportButtons result={result} />
        <ScenarioCompare base={compareBase} />

        <div className="mt-10 rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          <strong className="text-foreground">Aviso:</strong> os resultados são estimativas
          educacionais. Consulte um profissional para decisões de investimento.
        </div>
      </section>
    </SiteLayout>
  );
}
