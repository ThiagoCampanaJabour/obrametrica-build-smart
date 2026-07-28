import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageHead } from "@/lib/seo";
import {
  calcSapataCorrida,
  calcSapataIsolada,
  toCSVCorrida,
  toCSVIsolada,
} from "@/lib/fundacao/calc";
import { DEFAULT_FORM, FundacaoForm, type FormState } from "@/components/Fundacao/FundacaoForm";
import { ResultsCorrida, ResultsIsolada } from "@/components/Fundacao/ResultsSummary";

const PATH = "/construcao-civil/fundacao-sapata";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Construção Civil", path: "/construcao-civil" },
  { name: "Fundação e Sapatas", path: PATH },
];

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Quando usar esta calculadora?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use para estimativas iniciais de volume de concreto, aço e formas em fundações rasas (sapatas isoladas e corridas). Para execução, é obrigatório o dimensionamento por engenheiro estrutural, com base em sondagem e nas normas ABNT NBR 6122 e NBR 6118.",
      },
    },
    {
      "@type": "Question",
      name: "Preciso de sondagem para dimensionar corretamente?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim. A capacidade admissível do solo depende de ensaios (SPT) e da análise geotécnica. Os presets aqui (macio 100, médio 200, firme 300 kN/m²) são ilustrativos e servem apenas para estudos preliminares de custo.",
      },
    },
  ],
};

export const Route = createFileRoute("/construcao-civil/fundacao-sapata")({
  head: () =>
    pageHead({
      title: "Calculadora de Fundação e Sapatas — Concreto, Aço e Formas | ObraMétrica",
      description:
        "Estime volume de concreto, kg de aço e área de formas para sapatas isoladas e corridas. Presets de solo, fator de segurança e custos editáveis. Exportação CSV/JSON.",
      path: PATH,
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Calculadora de Fundação e Sapatas",
        url: `https://obrametrica.com.br${PATH}`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      extraSchemas: [FAQ_SCHEMA],
    }),
  component: FundacaoPage,
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

function FundacaoPage() {
  const [form, setFormState] = useState<FormState>(DEFAULT_FORM);
  const [calculated, setCalculated] = useState(false);

  const setForm = (patch: Partial<FormState>) =>
    setFormState((f) => ({ ...f, ...patch }));

  const precos = {
    precoConcretoM3: form.precoConcretoM3,
    precoAcoKg: form.precoAcoKg,
    precoFormaM2: form.precoFormaM2,
  };

  const resultIsolada = useMemo(
    () =>
      form.tipo === "isolada" && calculated
        ? calcSapataIsolada({
            cargaPorPilarKN: form.cargaPorPilarKN,
            numPilares: form.numPilares,
            capacidadeSoloKNm2: form.capacidadeSoloKNm2,
            safetyFactor: form.safetyFactor,
            kgAcoPorM3: form.kgAcoPorM3,
          })
        : null,
    [form, calculated],
  );

  const resultCorrida = useMemo(
    () =>
      form.tipo === "corrida" && calculated
        ? calcSapataCorrida({
            cargaLinearKNm: form.cargaLinearKNm,
            comprimentoTotalM: form.comprimentoTotalM,
            capacidadeSoloKNm2: form.capacidadeSoloKNm2,
            safetyFactor: form.safetyFactor,
            kgAcoPorM3: form.kgAcoPorM3,
          })
        : null,
    [form, calculated],
  );

  const exportJSON = () => {
    const payload = {
      inputs: form,
      outputs: resultIsolada ?? resultCorrida,
    };
    download("fundacao-sapata.json", JSON.stringify(payload, null, 2), "application/json");
  };
  const exportCSV = () => {
    if (resultIsolada) download("sapatas-isoladas.csv", toCSVIsolada(resultIsolada), "text/csv");
    else if (resultCorrida) download("sapata-corrida.csv", toCSVCorrida(resultCorrida), "text/csv");
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumbs items={CRUMBS} />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Calculadora de Fundação e Sapatas
        </h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Estime volume de concreto, aço e formas para sapatas isoladas e corridas. Ajuste
          capacidade do solo, fator de segurança e custos unitários para simular cenários.
        </p>

        <div
          role="note"
          className="mt-4 rounded-md border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-foreground"
        >
          <strong>Atenção:</strong> esta ferramenta fornece estimativas preliminares. Não substitui
          o projeto estrutural — a execução deve ser validada por engenheiro responsável, com base
          em sondagem do solo e nas normas <em>ABNT NBR 6122</em> (fundações) e{" "}
          <em>NBR 6118</em> (estruturas de concreto).
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,420px)_1fr]">
          <div className="rounded-xl border border-border bg-card p-6">
            <FundacaoForm
              form={form}
              setForm={setForm}
              onCalculate={() => setCalculated(true)}
              onReset={() => {
                setFormState(DEFAULT_FORM);
                setCalculated(false);
              }}
            />
          </div>

          <div>
            {!calculated ? (
              <div className="rounded-xl border border-dashed border-border bg-muted/40 p-8 text-sm text-muted-foreground">
                Preencha os dados e clique em <strong>Calcular</strong> para ver os resultados.
              </div>
            ) : resultIsolada ? (
              <ResultsIsolada
                result={resultIsolada}
                precos={precos}
                onExportCSV={exportCSV}
                onExportJSON={exportJSON}
              />
            ) : resultCorrida ? (
              <ResultsCorrida
                result={resultCorrida}
                precos={precos}
                onExportCSV={exportCSV}
                onExportJSON={exportJSON}
              />
            ) : null}
          </div>
        </div>

        <div className="mt-10 grid gap-6 rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground sm:grid-cols-2">
          <div>
            <h2 className="text-base font-semibold text-foreground">Como interpretar</h2>
            <p className="mt-2">
              O volume é calculado com base na área requerida (carga × fator de segurança ÷
              capacidade do solo) e altura heurística H ≈ 0,25 × lado. O aço usa 100 kg/m³ como
              referência empírica — ajuste conforme detalhamento do projeto.
            </p>
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Limitações</h2>
            <p className="mt-2">
              Não considera excentricidades, esforços de flexão/cisalhamento, lençol freático,
              aterros compressíveis ou reforço específico. Consulte a{" "}
              <a href="/metodologia" className="underline">
                metodologia
              </a>{" "}
              para o critério geral.
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
