import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageHead } from "@/lib/seo";
import { calcCustoLajes, calcLajes, toCSVLajes } from "@/lib/lajes/calc";
import { DEFAULT_FORM, LajesForm, type LajesFormState } from "@/components/Lajes/LajesForm";
import { ResultsSummary } from "@/components/Lajes/ResultsSummary";
import { DetailTable } from "@/components/Lajes/DetailTable";

const PATH = "/construcao-civil/calculadora-lajes";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Construção Civil", path: "/construcao-civil" },
  { name: "Calculadora de Lajes", path: PATH },
];

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Posso usar esta calculadora para projeto final?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Não. A ferramenta oferece estimativas preliminares de volume, aço e formas. O projeto executivo de lajes exige análise estrutural completa por engenheiro habilitado, conforme a NBR 6118.",
      },
    },
    {
      "@type": "Question",
      name: "Como interpretar o valor de kg/m³ de aço?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "É a taxa média empírica de armadura por m³ de concreto: 80–120 kg/m³ para lajes maciças e 50–90 kg/m³ para nervuradas. Serve para orçamento, não para detalhamento.",
      },
    },
    {
      "@type": "Question",
      name: "A calculadora considera o peso próprio da laje?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim. O peso próprio é somado automaticamente à carga total usando densidade do concreto armado de 24 kN/m³.",
      },
    },
  ],
};

export const Route = createFileRoute("/construcao-civil/calculadora-lajes")({
  head: () =>
    pageHead({
      title: "Calculadora de Lajes e Armaduras — Concreto, Aço e Formas | ObraMétrica",
      description:
        "Estime volume de concreto, kg de aço, comprimento de vergalhões e formas para lajes maciças e nervuradas. Modos Estimativa e Engenharia detalhada com exportação CSV/JSON.",
      path: PATH,
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Calculadora de Lajes e Armaduras",
        url: `https://obrametrica.com.br${PATH}`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      extraSchemas: [FAQ_SCHEMA],
    }),
  component: LajesPage,
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

function LajesPage() {
  const [state, setState] = useState<LajesFormState>(DEFAULT_FORM);
  const [calculated, setCalculated] = useState(false);

  const result = useMemo(() => (calculated ? calcLajes(state.paineis) : null), [state, calculated]);
  const custos = useMemo(
    () =>
      result
        ? calcCustoLajes(result.resumo, {
            precoConcretoM3: state.precoConcretoM3,
            precoAcoKg: state.precoAcoKg,
            precoFormaM2: state.precoFormaM2,
          })
        : null,
    [result, state.precoConcretoM3, state.precoAcoKg, state.precoFormaM2],
  );

  const exportJSON = () => {
    if (!result) return;
    download(
      "lajes.json",
      JSON.stringify({ inputs: state, outputs: result, custos }, null, 2),
      "application/json",
    );
  };
  const exportCSV = () => {
    if (!result) return;
    download("lajes.csv", toCSVLajes(result.paineis), "text/csv");
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumbs items={CRUMBS} />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Calculadora de Lajes e Armaduras
        </h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Estime volume de concreto, aço, comprimento de vergalhões e formas para lajes maciças
          unidirecionais e nervuradas simples. Escolha o modo <strong>Estimativa</strong> para uma
          projeção rápida ou <strong>Engenharia detalhada</strong> para valores orientativos de
          momento e área de aço.
        </p>

        <div
          role="note"
          className="mt-4 rounded-md border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-foreground"
        >
          <strong>Atenção:</strong> estimativa preliminar (±15–25%). Não substitui projeto
          estrutural. Consulte engenheiro responsável antes da execução, conforme{" "}
          <em>ABNT NBR 6118</em>.
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,480px)_1fr]">
          <div className="rounded-xl border border-border bg-card p-6">
            <LajesForm
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
                Preencha os painéis e clique em <strong>Calcular</strong> para ver o resumo e a
                tabela detalhada.
              </div>
            ) : (
              <>
                <ResultsSummary
                  resumo={result.resumo}
                  custos={custos ?? undefined}
                  onExportCSV={exportCSV}
                  onExportJSON={exportJSON}
                />
                <DetailTable
                  paineis={result.paineis}
                  showEngenharia={state.mode === "engenharia"}
                />
              </>
            )}
          </div>
        </div>

        <div className="mt-10 grid gap-6 rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground sm:grid-cols-2">
          <div>
            <h2 className="text-base font-semibold text-foreground">Como interpretar</h2>
            <p className="mt-2">
              O volume considera a espessura informada (ou t ≈ max(0,12; L/20) para maciças). O aço
              usa taxa de 100 kg/m³ (maciça) e 70 kg/m³ (nervurada); o comprimento de vergalhões
              adota heurística de 10 m/m². No modo Engenharia, o momento fletor por metro de
              largura é <code>M = α·q·L²</code>, com α = 1/8 (simples) ou 1/10 (contínua).
            </p>
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Limitações</h2>
            <p className="mt-2">
              Não substitui verificação de flechas, cisalhamento, punção ou detalhamento de
              armadura. Não cobre lajes protendidas ou bidirecionais complexas. Consulte a{" "}
              <a href="/metodologia" className="underline">
                metodologia
              </a>{" "}
              para o critério geral do site.
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
