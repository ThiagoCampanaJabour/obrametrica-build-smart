import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageHead } from "@/lib/seo";
import { calcDrenagem, toCSVDrenagem } from "@/lib/drenagem/calc";
import {
  DEFAULT_DRENAGEM_FORM,
  DrenagemForm,
  type DrenagemFormState,
} from "@/components/Drenagem/DrenagemForm";
import { ResultsSummary } from "@/components/Drenagem/ResultsSummary";
import { DetailTable } from "@/components/Drenagem/DetailTable";

const PATH = "/construcao-civil/drenagem-calhas";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Construção Civil", path: "/construcao-civil" },
  { name: "Drenagem e Calhas", path: PATH },
];

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Como é calculada a vazão de projeto?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pelo método racional: Q = C × i × A, com a intensidade de chuva convertida de mm/h para m/s (i/1000/3600) e a área em m². O resultado sai em m³/s e é convertido para L/s.",
      },
    },
    {
      "@type": "Question",
      name: "Qual a declividade mínima recomendada para condutos pluviais?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Como referência prática, 0,5% para trechos curtos e 1% para trechos longos, sempre garantindo velocidade acima de 0,6 m/s para evitar sedimentação.",
      },
    },
    {
      "@type": "Question",
      name: "A ferramenta substitui o projeto hidráulico?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Não. Ela fornece estimativas iniciais com condutos considerados a seção plena. O projeto executivo deve seguir a NBR 10844 e ser assinado por profissional habilitado.",
      },
    },
  ],
};

export const Route = createFileRoute("/construcao-civil/drenagem-calhas")({
  head: () =>
    pageHead({
      title: "Cálculo de Drenagem e Calhas — Vazão, Tubos e Ralos | ObraMétrica",
      description:
        "Dimensione calhas, ralos e tubulações pluviais pelo método racional (Q = C·i·A) com presets de chuva por cidade, verificação de velocidade e exportação CSV/JSON.",
      path: PATH,
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Calculadora de Drenagem e Calhas",
        url: `https://obrametrica.com.br${PATH}`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      extraSchemas: [FAQ_SCHEMA],
    }),
  component: DrenagemPage,
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

function DrenagemPage() {
  const [state, setState] = useState<DrenagemFormState>(DEFAULT_DRENAGEM_FORM);
  const [calculated, setCalculated] = useState(false);

  const result = useMemo(
    () =>
      calculated
        ? calcDrenagem({
            bacias: state.bacias,
            intensidadeMmH: state.intensidadeMmH,
            fatorSeguranca: state.fatorSeguranca,
            material: state.material,
            declividadePct: state.declividadePct,
            diametroMinimoMm: state.diametroMinimoMm,
            formaCalha: state.formaCalha,
            velocidadeProjetoMs: state.velocidadeProjetoMs,
            capacidadeRaloLs: state.capacidadeRaloLs,
          })
        : null,
    [state, calculated],
  );

  const exportJSON = () => {
    if (!result) return;
    download(
      "drenagem.json",
      JSON.stringify({ inputs: state, outputs: result }, null, 2),
      "application/json",
    );
  };
  const exportCSV = () => {
    if (!result) return;
    download("drenagem.csv", toCSVDrenagem(result), "text/csv");
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumbs items={CRUMBS} />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Cálculo de Drenagem, Calhas e Ralos
        </h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Estime a vazão de projeto por área de contribuição pelo método racional
          (<strong>Q = C · i · A</strong>) e obtenha seções mínimas de calha, número de ralos e
          diâmetro comercial de conduto, com verificação de velocidade e declividade.
        </p>

        <div
          role="note"
          className="mt-4 rounded-md border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-foreground"
        >
          <strong>Atenção:</strong> ferramenta para estimativas iniciais; não substitui projeto
          hidráulico/executivo. Consultar engenheiro/hidrólogo para projetos finais
          (<em>ABNT NBR 10844</em> / <em>NBR 12218</em>).
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,520px)_1fr]">
          <div className="rounded-xl border border-border bg-card p-6">
            <DrenagemForm
              state={state}
              setState={setState}
              onCalculate={() => setCalculated(true)}
              onReset={() => {
                setState(DEFAULT_DRENAGEM_FORM);
                setCalculated(false);
              }}
            />
          </div>

          <div>
            {!result ? (
              <div className="rounded-xl border border-dashed border-border bg-muted/40 p-8 text-sm text-muted-foreground">
                Cadastre as bacias de contribuição e clique em <strong>Calcular</strong> para ver as
                vazões, seções sugeridas e a tabela de trechos.
              </div>
            ) : (
              <>
                <ResultsSummary
                  result={result}
                  onExportCSV={exportCSV}
                  onExportJSON={exportJSON}
                />
                <DetailTable result={result} material={state.material} />
              </>
            )}
          </div>
        </div>

        <div className="mt-10 grid gap-6 rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground sm:grid-cols-2">
          <div>
            <h2 className="text-base font-semibold text-foreground">Como interpretar</h2>
            <p className="mt-2">
              A vazão de cada bacia é <code>Q = C · i · A</code>, com <code>i</code> convertido de
              mm/h para m/s (<code>i/1000/3600</code>). O diâmetro é o menor comercial cuja
              capacidade a seção plena, pela fórmula de Manning
              <code> Q = (1/n)·A·R^(2/3)·S^(1/2)</code>, atende à vazão do trecho. A calha adota
              <code> A = Q/v</code> com velocidade de projeto entre 0,5 e 2,0 m/s.
            </p>
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Limitações</h2>
            <p className="mt-2">
              O MVP considera condutos a seção plena e não simula escoamento parcial, regime
              transiente ou pressurização. As intensidades de chuva dos presets são ilustrativas e
              devem ser confirmadas em curvas IDF locais. Veja a{" "}
              <a href="/metodologia" className="underline">
                metodologia
              </a>{" "}
              geral do site.
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
