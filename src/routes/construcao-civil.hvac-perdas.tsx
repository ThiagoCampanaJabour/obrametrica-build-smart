import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageHead } from "@/lib/seo";
import { calcTotalLoad, toCSVHvac } from "@/lib/hvac/calc";
import { DEFAULT_HVAC_FORM, HVACForm, type HVACFormState } from "@/components/HVAC/HVACForm";
import { ResultsSummary } from "@/components/HVAC/ResultsSummary";
import { DetailReport } from "@/components/HVAC/DetailReport";

const PATH = "/construcao-civil/hvac-perdas";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Construção Civil", path: "/construcao-civil" },
  { name: "Perdas Térmicas e HVAC", path: PATH },
];

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Como a carga térmica do ambiente é calculada?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Somando transmissão pela envoltória (U×A×ΔT), ganho solar pelas janelas (A×SHGC×fator de orientação×irradiância), calor dos ocupantes, equipamentos e iluminação, e a carga de ventilação (0,33×V̇×ΔT). O total recebe uma margem de segurança configurável.",
      },
    },
    {
      "@type": "Question",
      name: "Como converter kW em BTU/h?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "1 kW equivale a aproximadamente 3.412 BTU/h. A calculadora converte a carga com margem e sugere a menor capacidade comercial disponível (9.000, 12.000, 18.000, 24.000 BTU/h etc.).",
      },
    },
    {
      "@type": "Question",
      name: "A calculadora substitui um projeto de ar-condicionado?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Não. É uma estimativa preliminar com incerteza de ±10% a ±20%. A seleção final de equipamentos, dutos, difusores e critérios de conforto deve ser feita por engenheiro ou instalador habilitado.",
      },
    },
  ],
};

export const Route = createFileRoute("/construcao-civil/hvac-perdas")({
  head: () =>
    pageHead({
      title: "Perdas Térmicas e Dimensionamento de HVAC (kW e BTU) | ObraMétrica",
      description:
        "Calcule a carga térmica por ambiente (transmissão, solar, ocupantes, equipamentos e ventilação) e descubra a capacidade de ar-condicionado em kW e BTU/h, com export CSV/JSON.",
      path: PATH,
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Calculadora de Perdas Térmicas e HVAC",
        url: `https://obrametrica.com.br${PATH}`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      extraSchemas: [FAQ_SCHEMA],
    }),
  component: HvacPage,
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

function HvacPage() {
  const [state, setState] = useState<HVACFormState>(DEFAULT_HVAC_FORM);
  const [calculated, setCalculated] = useState(false);

  const result = useMemo(
    () =>
      calculated
        ? calcTotalLoad({
            modo: state.modo,
            ambientes: state.ambientes,
            tIntC: state.tIntC,
            tExtC: state.tExtC,
            margemPct: state.margemPct,
            cop: state.cop,
            horasDia: state.horasDia,
            diasMes: state.diasMes,
          })
        : null,
    [state, calculated],
  );

  const exportJSON = () => {
    if (!result) return;
    download(
      "hvac-perdas.json",
      JSON.stringify({ inputs: state, outputs: result }, null, 2),
      "application/json",
    );
  };
  const exportCSV = () => {
    if (!result) return;
    download("hvac-perdas.csv", toCSVHvac(result), "text/csv");
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumbs items={CRUMBS} />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Perdas Térmicas e Dimensionamento de HVAC
        </h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Estime a carga térmica de cada ambiente somando transmissão pela envoltória
          (<strong>U · A · ΔT</strong>), ganho solar pelas janelas, calor de ocupantes e
          equipamentos e a parcela de ventilação. A ferramenta indica a capacidade de
          ar-condicionado em kW e BTU/h, a vazão mínima de ar e o consumo estimado.
        </p>

        <div
          role="note"
          className="mt-4 rounded-md border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-foreground"
        >
          <strong>Estimativa preliminar</strong> — não substitui projeto HVAC/ar-condicionado.
          Consulte engenheiro/instalador para dimensionamento final, seleção de equipamentos,
          tubulações e critérios de conforto (<em>ABNT NBR 16401</em>).
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,540px)_1fr]">
          <div className="rounded-xl border border-border bg-card p-6">
            <HVACForm
              state={state}
              setState={setState}
              onCalculate={() => setCalculated(true)}
              onReset={() => {
                setState(DEFAULT_HVAC_FORM);
                setCalculated(false);
              }}
            />
          </div>

          <div>
            {!result ? (
              <div className="rounded-xl border border-dashed border-border bg-muted/40 p-8 text-sm text-muted-foreground">
                Cadastre os ambientes, ajuste o clima de projeto e clique em{" "}
                <strong>Calcular</strong> para ver a carga térmica, a capacidade sugerida e o
                relatório detalhado.
              </div>
            ) : (
              <>
                <ResultsSummary
                  result={result}
                  onExportCSV={exportCSV}
                  onExportJSON={exportJSON}
                />
                <DetailReport result={result} />
              </>
            )}
          </div>
        </div>

        <div className="mt-10 grid gap-6 rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground sm:grid-cols-2">
          <div>
            <h2 className="text-base font-semibold text-foreground">Como interpretar</h2>
            <p className="mt-2">
              O modo <strong>Rápido</strong> usa presets de U-value por qualidade da envoltória,
              carga por ocupante e potência por m². O modo <strong>Avançado</strong> permite editar
              U-values, SHGC, sombreamento, número de fachadas expostas e taxa de infiltração. A
              conversão usa <code>1 kW ≈ 3.412 BTU/h</code> e arredonda para a capacidade comercial
              imediatamente superior.
            </p>
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Limitações</h2>
            <p className="mt-2">
              Os presets climáticos e de U-value são valores médios editáveis; a carga latente é
              estimada de forma simplificada e não há simulação horária nem inércia térmica.
              Incerteza típica de ±10% a ±20%. Veja a{" "}
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
