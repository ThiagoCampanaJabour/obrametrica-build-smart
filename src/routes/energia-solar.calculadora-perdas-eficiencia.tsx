import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { pageHead } from "@/lib/seo";
import { LossesForm } from "@/components/SolarLosses/LossesForm";
import { ResultsSummary } from "@/components/SolarLosses/ResultsSummary";
import { LossBreakdownChart } from "@/components/SolarLosses/LossBreakdownChart";
import { ReportExport } from "@/components/SolarLosses/ReportExport";
import calcSystemLosses, { type SolarLossesInput, type SolarLossesResult } from "@/lib/solar/calc";
import { CalculatorShell } from "@/components/calc-ui";

const PATH = "/energia-solar/calculadora-perdas-eficiencia";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Energia Solar", path: "/energia-solar" },
  { name: "Perdas e Eficiência Fotovoltaica", path: PATH },
];

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Quais as principais perdas em um sistema solar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "As principais perdas são: temperatura nos módulos, sujeira (soiling), perdas no cabeamento (Ohmicas) e eficiência do inversor.",
      },
    },
  ],
};

export const Route = createFileRoute("/energia-solar/calculadora-perdas-eficiencia")({
  head: () =>
    pageHead({
      title: "Calculadora de Perdas e Eficiência Solar — ObraMétrica",
      description:
        "Quantifique as perdas do seu sistema fotovoltaico (temperatura, sombra, cabos, inversor) e descubra a eficiência real (PR).",
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
  component: SolarLossesPage,
});

function SolarLossesPage() {
  const [result, setResult] = useState<SolarLossesResult | null>(null);
  const [inputs, setInputs] = useState<SolarLossesInput | null>(null);

  const handleCalculate = (data: SolarLossesInput) => {
    setInputs(data);
    setResult(calcSystemLosses(data));
  };

  return (
    <CalculatorShell
      title="Perdas e Eficiência Solar"
      description="Calcule o Performance Ratio (PR) do seu sistema solar quantificando cada fonte de perda técnica."
      breadcrumbs={CRUMBS}
      extrasId="/energia-solar/calculadora-perdas-eficiencia"
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_1fr]">
        <div className="rounded-xl border border-border bg-card p-6">
          <LossesForm onCalc={handleCalculate} />
        </div>

        <div className="min-w-0">
          {!result ? (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center text-muted-foreground">
              <p>Configure os parâmetros do sistema para ver o detalhamento das perdas.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <ResultsSummary result={result} />
              <LossBreakdownChart result={result} />
              {result && <ReportExport result={result} />}
            </div>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}

