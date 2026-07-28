import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageHead } from "@/lib/seo";
import { calcInstalacao, toCSVCircuitos } from "@/lib/eletrico/calc";
import {
  DEFAULT_FORM,
  DimensionamentoForm,
  type EletricoFormState,
} from "@/components/Eletrico/DimensionamentoForm";
import { ResultsSummary } from "@/components/Eletrico/ResultsSummary";
import { CircuitTable } from "@/components/Eletrico/CircuitTable";

const PATH = "/construcao-civil/dimensionamento-eletrico";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Construção Civil", path: "/construcao-civil" },
  { name: "Dimensionamento Elétrico", path: PATH },
];

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Esta ferramenta substitui um projeto elétrico?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Não. Fornece estimativas preliminares de corrente, disjuntor e bitola. Projeto executivo, análise de curto-circuito e coordenação de proteções exigem engenheiro eletricista, conforme NBR 5410.",
      },
    },
    {
      "@type": "Question",
      name: "Como é calculada a queda de tensão?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Usamos ΔV = k · I · R · L, com k = 2 para monofásico e √3 para trifásico, R em ohm/km por bitola. Recomendamos aumentar a bitola quando a queda superar 4%.",
      },
    },
    {
      "@type": "Question",
      name: "Que valores de ampacidade a ferramenta considera?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tabela simplificada para cobre, em eletroduto, método B1, 2 condutores carregados. Valores devem ser confirmados na NBR 5410 para o método real de instalação.",
      },
    },
  ],
};

export const Route = createFileRoute("/construcao-civil/dimensionamento-eletrico")({
  head: () =>
    pageHead({
      title: "Dimensionamento de Instalações Elétricas — Cargas, Disjuntores e Bitolas | ObraMétrica",
      description:
        "Calcule demanda elétrica, corrente por circuito, disjuntor sugerido, bitola mínima e queda de tensão. Presets residenciais, export CSV/JSON e conformidade orientativa à NBR 5410.",
      path: PATH,
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Dimensionamento de Instalações Elétricas",
        url: `https://obrametrica.com.br${PATH}`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      extraSchemas: [FAQ_SCHEMA],
    }),
  component: EletricoPage,
});

function download(name: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function EletricoPage() {
  const [state, setState] = useState<EletricoFormState>(DEFAULT_FORM);
  const [calculated, setCalculated] = useState(false);

  const result = useMemo(
    () => (calculated ? calcInstalacao(state.circuitos) : null),
    [state, calculated],
  );

  const exportJSON = () => {
    if (!result) return;
    download(
      "dimensionamento-eletrico.json",
      JSON.stringify({ inputs: state, outputs: result }, null, 2),
      "application/json",
    );
  };
  const exportCSV = () => {
    if (!result) return;
    download("dimensionamento-eletrico.csv", toCSVCircuitos(result.circuitos), "text/csv");
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumbs items={CRUMBS} />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Dimensionamento de Instalações Elétricas
        </h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Informe as cargas por circuito para estimar corrente, disjuntor sugerido, bitola mínima
          de cabo e queda de tensão. Use os presets para começar e ajuste os parâmetros conforme o
          projeto.
        </p>

        <div
          role="note"
          className="mt-4 rounded-md border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-foreground"
        >
          <strong>Aviso:</strong> esta ferramenta fornece estimativas e não substitui projeto
          executivo. Consulte eletricista ou engenheiro eletricista para dimensionamento final,
          análise de curto-circuito e coordenação das proteções, conforme <em>ABNT NBR 5410</em>.
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,520px)_1fr]">
          <div className="rounded-xl border border-border bg-card p-6">
            <DimensionamentoForm
              state={state}
              setState={setState}
              onCalculate={() => setCalculated(true)}
              onReset={() => {
                setState(DEFAULT_FORM);
                setCalculated(false);
              }}
            />
          </div>

          <div>
            {!result ? (
              <div className="rounded-xl border border-dashed border-border bg-muted/40 p-8 text-sm text-muted-foreground">
                Adicione seus circuitos e clique em <strong>Calcular</strong> para ver o resumo e
                a tabela detalhada.
              </div>
            ) : (
              <>
                <ResultsSummary
                  resumo={result.resumo}
                  onExportCSV={exportCSV}
                  onExportJSON={exportJSON}
                />
                <CircuitTable circuitos={result.circuitos} />
              </>
            )}
          </div>
        </div>

        <div className="mt-10 grid gap-6 rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground sm:grid-cols-2">
          <div>
            <h2 className="text-base font-semibold text-foreground">Como interpretar</h2>
            <p className="mt-2">
              A corrente por circuito é obtida por <code>I = P·fs / (V · fp)</code> (monofásico)
              ou <code>I = P·fs / (√3 · V · fp)</code> (trifásico). O disjuntor sugerido usa
              margem de 25% sobre a corrente calculada, arredondando para o padrão comercial
              (6/10/16/20/25/32/40/50/63 A…). A bitola mínima é escolhida pela ampacidade e pela
              proteção adotada.
            </p>
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Limitações</h2>
            <p className="mt-2">
              Tabela de ampacidade simplificada (cobre, método B1). Não calcula curto-circuito,
              seletividade, DR ou aterramento. Consulte a{" "}
              <a href="/metodologia" className="underline">
                metodologia
              </a>{" "}
              e a NBR 5410 antes de executar.
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
