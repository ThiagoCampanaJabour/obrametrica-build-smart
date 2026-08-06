import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageHead } from "@/lib/seo";
import { LayoutForm } from "@/components/SolarLayout/LayoutForm";
import { ResultsSummary } from "@/components/SolarLayout/ResultsSummary";
import { LayoutPreview2D } from "@/components/SolarLayout/LayoutPreview2D";
import { ExportLayout } from "@/components/SolarLayout/ExportLayout";
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
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumbs items={CRUMBS} />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Calculadora de Área e Layout de Painéis Solares
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Informe as dimensões da área disponível, o módulo escolhido e as folgas de montagem: a
          ferramenta calcula quantos módulos cabem, a potência resultante em kWp, o arranjo em
          fileiras e strings, os corredores de manutenção e devolve um desenho 2D em vista
          superior. Combine com a{" "}
          <a href="/energia-solar/calculadora-perdas-eficiencia" className="underline hover:text-accent">
            calculadora de perdas e eficiência
          </a>{" "}
          e com a{" "}
          <a href="/energia-solar/simulacao-radiacao" className="underline hover:text-accent">
            simulação por localização
          </a>{" "}
          para estimar a geração do arranjo projetado.
        </p>

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

        <section className="mt-12 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Como o layout é calculado</h2>
          <p className="text-sm text-muted-foreground">
            A área é tratada como um retângulo com recuo de borda. O footprint do módulo depende da
            montagem (paisagem ou retrato) e recebe os gaps de dilatação: largura efetiva = largura
            do módulo + gap transversal; altura efetiva = altura do módulo + gap longitudinal. O
            número de colunas é o piso da divisão da largura útil pela largura efetiva; as fileiras
            são distribuídas ao longo do comprimento, inserindo um corredor de manutenção a cada
            bloco de fileiras.
          </p>
          <p className="text-sm text-muted-foreground">
            Quando o espaçamento anti-sombra está ativo, o passo entre fileiras vira
            S = h·cos(tilt) + h·sen(tilt)/tan(elevação solar de inverno), com a elevação estimada
            pela latitude no solstício. Obstáculos projetam uma sombra de comprimento h/tan(elevação)
            e as posições atingidas são excluídas do arranjo.
          </p>
          <h2 className="text-xl font-semibold text-foreground">Termos técnicos</h2>
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Footprint:</strong> projeção horizontal do módulo
              no plano do telhado.
            </li>
            <li>
              <strong className="text-foreground">Gap:</strong> folga entre módulos para dilatação
              térmica, drenagem e limpeza (30–50 mm transversal, 10–20 mm longitudinal).
            </li>
            <li>
              <strong className="text-foreground">Inter-row spacing:</strong> distância entre
              fileiras que evita o sombreamento mútuo no inverno.
            </li>
            <li>
              <strong className="text-foreground">String:</strong> conjunto de módulos em série
              ligado a uma entrada MPPT do inversor.
            </li>
            <li>
              <strong className="text-foreground">Clearance:</strong> recuo livre até bordas,
              platibandas, chaminés e rufos.
            </li>
          </ul>
        </section>

        <div className="mt-10 rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          <strong className="text-foreground">Aviso importante:</strong> esta ferramenta gera um
          layout heurístico 2D para pré-dimensionamento e propostas comerciais. Ela não substitui o
          projeto executivo, a verificação estrutural do telhado nem a análise 3D de sombreamento
          (PVsyst, Helioscope) exigida em plantas com obstáculos relevantes ou contratos de
          performance.
        </div>
      </section>
    </SiteLayout>
  );
}
