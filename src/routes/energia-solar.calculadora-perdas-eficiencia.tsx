import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageHead } from "@/lib/seo";
import { LossesForm } from "@/components/SolarLosses/LossesForm";
import { ResultsSummary } from "@/components/SolarLosses/ResultsSummary";
import { LossBreakdownChart } from "@/components/SolarLosses/LossBreakdownChart";
import { ReportExport } from "@/components/SolarLosses/ReportExport";
import calcSystemLosses, { type SolarLossesInput, type SolarLossesResult } from "@/lib/solar/calc";

const PATH = "/energia-solar/calculadora-perdas-eficiencia";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Energia Solar", path: "/energia-solar" },
  { name: "Calculadora de Perdas / Eficiência", path: PATH },
];

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "O que é clipping em um sistema fotovoltaico?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Clipping é a limitação da potência quando o arranjo DC gera mais do que o inversor consegue converter. Ocorre em relações DC/AC elevadas: até 1,1 a perda é desprezível; entre 1,1 e 1,4 fica na faixa de 0,5% a 3%; acima de 1,4 pode chegar a 8% da energia anual.",
      },
    },
    {
      "@type": "Question",
      name: "O que é perda por mismatch?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Mismatch é a diferença de desempenho entre módulos de uma mesma string (tolerância de fabricação, envelhecimento e sujeira desigual). Como a string opera pelo módulo mais fraco, perdem-se tipicamente 1% a 3% da energia.",
      },
    },
    {
      "@type": "Question",
      name: "Como estimar a perda por sujidade (soiling)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Depende do ambiente e da frequência de limpeza: 2% em áreas urbanas com chuva regular, 4% em áreas rurais ou com poeira, e 8% a 10% em regiões áridas ou próximas a estradas de terra sem limpeza periódica.",
      },
    },
  ],
};

export const Route = createFileRoute("/energia-solar/calculadora-perdas-eficiencia")({
  head: () =>
    pageHead({
      title: "Calculadora de Perdas e Eficiência Solar (PV) | ObraMétrica",
      description:
        "Estime perdas por temperatura, sombreamento, sujidade, mismatch, cabos, inversor e clipping, e calcule a eficiência global do sistema fotovoltaico.",
      path: PATH,
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Calculadora de Perdas / Eficiência Fotovoltaica",
        url: `https://obrametrica.com.br${PATH}`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      extraSchemas: [FAQ_SCHEMA],
    }),
  component: PerdasEficienciaPage,
});

function PerdasEficienciaPage() {
  const [result, setResult] = useState<SolarLossesResult | null>(null);

  const handleCalc = (input: SolarLossesInput) => setResult(calcSystemLosses(input));

  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumbs items={CRUMBS} />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Calculadora de Perdas · Eficiência Fotovoltaica
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Compare a geração teórica DC com a energia efetivamente entregue no ponto de conexão AC.
          A ferramenta quantifica perdas por temperatura, sombreamento, sujidade, mismatch,
          cabeamento, inversor, clipping e BOS, e devolve a eficiência global do sistema. Combine
          com a{" "}
          <a href="/energia-solar/simulacao-radiacao" className="underline hover:text-accent">
            simulação por localização
          </a>{" "}
          para obter a energia teórica e com o{" "}
          <a href="/energia-solar/calculadora-inversor" className="underline hover:text-accent">
            dimensionamento de inversor
          </a>{" "}
          para ajustar a relação DC/AC.
        </p>

        <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">
          <LossesForm onCalc={handleCalc} />
        </div>

        {result && (
          <>
            <ResultsSummary result={result} />
            <LossBreakdownChart result={result} />
            <ReportExport result={result} />
          </>
        )}

        <section className="mt-12 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Como as perdas são aplicadas</h2>
          <p className="text-sm text-muted-foreground">
            As perdas são aplicadas em cascata (multiplicativas), na ordem física do sistema:
            temperatura → sombreamento → sujidade → mismatch → cabeamento DC → inversor (η e
            clipping) → perdas AC/BOS → margem de segurança. A temperatura de célula usa o modelo
            NOCT: T<sub>cel</sub> = T<sub>amb</sub> + (NOCT − 20) × G / 800, e a perda térmica é
            |coef| (%/°C) × (T<sub>cel</sub> − 25 °C).
          </p>
          <p className="text-sm text-muted-foreground">
            O resultado é uma estimativa anual determinística — não substitui simulação horária
            (PVsyst e similares) em projetos executivos ou contratos de performance. Consulte a{" "}
            <a href="/metodologia" className="underline hover:text-accent">
              metodologia
            </a>{" "}
            para as referências e faixas de incerteza.
          </p>
        </section>

        <div className="mt-10 rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          <strong className="text-foreground">Aviso:</strong> valores default são típicos de
          mercado. Para projetos críticos, valide os coeficientes com as datasheets dos módulos e
          do inversor e com medições em campo.
        </div>
      </section>
    </SiteLayout>
  );
}
