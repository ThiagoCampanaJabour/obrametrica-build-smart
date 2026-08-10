import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { pageHead } from "@/lib/seo";
import { LayoutForm } from "@/components/SolarLayout/LayoutForm";
import { ResultsSummary } from "@/components/SolarLayout/ResultsSummary";
import { LayoutPreview2D } from "@/components/SolarLayout/LayoutPreview2D";
import { ExportLayout } from "@/components/SolarLayout/ExportLayout";
import { CalculatorShell } from "@/components/calc-ui";
import layoutPlaceModules, {
  type LayoutInput,
  type LayoutResult,
} from "@/lib/solar/layout-calc";

const PATH = "/energia-solar/calculadora-area-layout-paineis";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Energia Solar", path: "/energia-solar" },
  { name: "Área e Layout de Painéis", path: PATH },
];

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Quanto espaço devo reservar para manutenção entre os painéis?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Reserve corredores de 600 a 800 mm a cada 3 a 5 fileiras, além de recuos de 300 a 500 mm nas bordas do telhado. Esse espaço permite limpeza, inspeção termográfica, substituição de módulos e circulação segura de equipes com linha de vida.",
      },
    },
    {
      "@type": "Question",
      name: "Como escolho o número de módulos por string?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "O número de módulos em série deve manter a tensão da string dentro da faixa MPPT do inversor no verão e abaixo da tensão máxima DC no dia mais frio. Para módulos com Vmpp de 31 a 42 V, valores típicos ficam entre 8 e 15 módulos por string.",
      },
    },
    {
      "@type": "Question",
      name: "Quando preciso de análise 3D de sombreamento?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sempre que houver obstáculos altos e próximos, telhados com muitas águas, prédios vizinhos ou vegetação. O modelo 2D estima a sombra do meio-dia no solstício de inverno; ele não representa a variação horária nem o sombreamento oblíquo do início e fim do dia.",
      },
    },
    {
      "@type": "Question",
      name: "Qual a área necessária por kWp instalado?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Com módulos de 400 a 550 Wp coplanares ao telhado, considere de 5 a 6 m² por kWp. Em telhado plano ou solo com estrutura inclinada e espaçamento entre fileiras, a área sobe para 10 a 15 m² por kWp.",
      },
    },
  ],
};

export const Route = createFileRoute("/energia-solar/calculadora-area-layout-paineis")({
  head: () =>
    pageHead({
      title: "Calculadora de Área e Layout de Painéis Solares | ObraMétrica",
      description:
        "Calcule quantos painéis solares cabem no seu telhado ou terreno: número de módulos, kWp, strings, corredores de manutenção e preview 2D do arranjo.",
      path: PATH,
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Calculadora de Área e Layout de Painéis Fotovoltaicos",
        url: `https://obrametrica.com.br${PATH}`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      extraSchemas: [FAQ_SCHEMA],
    }),
  component: AreaLayoutPaineisPage,
});

function AreaLayoutPaineisPage() {
  const [result, setResult] = useState<LayoutResult | null>(null);
  const handleCalc = (input: LayoutInput) => setResult(layoutPlaceModules(input));

  return (
    <CalculatorShell
      title="Calculadora de Área e Layout de Painéis Solares"
      description="Informe as dimensões da área disponível, o módulo escolhido e as folgas de montagem para ver o arranjo em fileiras e strings."
      breadcrumbs={CRUMBS}
      extrasId="solar-layout"
    >
      <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">
        <LayoutForm onCalc={handleCalc} />
      </div>

      {result && (
        <>
          <ResultsSummary result={result} />
          <LayoutPreview2D result={result} />
          <ExportLayout result={result} />
        </>
      )}

      <div className="mt-10 rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
        <strong className="text-foreground">Aviso importante:</strong> esta ferramenta gera um
        layout heurístico 2D para pré-dimensionamento. Ela não substitui o projeto executivo nem a
        análise 3D de sombreamento.
      </div>
    </CalculatorShell>
  );
}
