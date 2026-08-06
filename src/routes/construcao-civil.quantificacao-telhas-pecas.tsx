import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageHead } from "@/lib/seo";
import { calcQuantification, toCSVTelhas } from "@/lib/telhas/calc";
import { DEFAULT_QUANT_FORM, QuantForm, type QuantFormState } from "@/components/TelhasQuant/QuantForm";
import { ResultsTable } from "@/components/TelhasQuant/ResultsTable";

const PATH = "/construcao-civil/quantificacao-telhas-pecas";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Construção Civil", path: "/construcao-civil" },
  { name: "Quantificação e Corte de Telhas/Peças", path: PATH },
];

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Quanto de sobra devo comprar de piso ou telha?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Para assentamento alinhado com peças pequenas, 7% a 10% de perda costuma bastar. Peças grandes e layouts com deslocamento pedem 12% a 15%, e o padrão espinha de peixe pode chegar a 25%. Some ainda uma margem de segurança de 5% e cerca de 5 peças de reserva do mesmo lote para reposições futuras.",
      },
    },
    {
      "@type": "Question",
      name: "Peças grandes exigem mais perda?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim. Em peças de 60×60 cm ou maiores, cada recorte descarta uma fração maior de material e é mais difícil reaproveitar sobras em outra borda. A calculadora acrescenta cerca de 4 pontos percentuais de perda para peças a partir de 40×40 cm.",
      },
    },
    {
      "@type": "Question",
      name: "A calculadora considera as juntas de assentamento?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim. A espessura da junta é somada às dimensões da peça para formar o módulo de repetição, o que reduz levemente o número de peças por metro quadrado. Informe a junta recomendada pelo fabricante do revestimento.",
      },
    },
  ],
};

export const Route = createFileRoute("/construcao-civil/quantificacao-telhas-pecas")({
  head: () =>
    pageHead({
      title: "Quantificação e Corte de Telhas e Peças — Piso e Revestimento | ObraMétrica",
      description:
        "Calcule quantas telhas, pisos ou porcelanatos comprar considerando layout de assentamento, cortes nas bordas, perdas e margem de segurança. Export CSV e JSON.",
      path: PATH,
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Calculadora de Quantificação e Corte de Telhas/Peças",
        url: `https://obrametrica.com.br${PATH}`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      extraSchemas: [FAQ_SCHEMA],
    }),
  component: QuantificacaoPage,
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

function QuantificacaoPage() {
  const [state, setState] = useState<QuantFormState>(DEFAULT_QUANT_FORM);
  const [calculated, setCalculated] = useState(false);

  const result = useMemo(() => {
    if (!calculated) return null;
    if (!(state.areaM2 > 0) || !(state.larguraMm > 0) || !(state.alturaMm > 0)) return null;
    return calcQuantification({
      tipo: state.tipo,
      larguraMm: state.larguraMm,
      alturaMm: state.alturaMm,
      areaM2: state.areaM2,
      comprimentoM: state.usarDimensoes ? state.comprimentoM : undefined,
      larguraAmbienteM: state.usarDimensoes ? state.larguraAmbienteM : undefined,
      layout: state.layout,
      perdaPct: state.perdaManual ? state.perdaPct : undefined,
      margemPct: state.margemPct,
      juntaMm: state.juntaMm,
      pecasReserva: state.pecasReserva,
    });
  }, [state, calculated]);

  const invalido = calculated && !result;

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumbs items={CRUMBS} />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Quantificação e Corte de Telhas e Peças
        </h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Descubra quantas telhas, pisos, porcelanatos ou revestimentos comprar considerando o
          padrão de assentamento, os cortes de borda, as perdas típicas por tipo de peça e uma
          margem de segurança. Exporte a lista de compra em CSV ou JSON.
        </p>

        <div
          role="note"
          className="mt-4 rounded-md border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-foreground"
        >
          <strong>Estimativa</strong> — os percentuais de corte são heurísticas de projeto. Confirme
          as medidas no local, a área útil real da peça com o fornecedor e compre algumas peças
          extras do mesmo lote para reposição.
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,520px)_1fr]">
          <div className="rounded-xl border border-border bg-card p-6">
            <QuantForm
              state={state}
              setState={setState}
              onCalculate={() => setCalculated(true)}
              onReset={() => {
                setState(DEFAULT_QUANT_FORM);
                setCalculated(false);
              }}
            />
          </div>

          <div>
            {invalido ? (
              <div
                role="alert"
                className="rounded-xl border border-destructive/40 bg-destructive/10 p-6 text-sm text-foreground"
              >
                Informe uma área maior que zero e dimensões válidas da peça.
              </div>
            ) : !result ? (
              <div className="rounded-xl border border-dashed border-border bg-muted/40 p-8 text-sm text-muted-foreground">
                Informe a área, escolha a peça e o layout e clique em <strong>Calcular</strong> para
                ver a quantidade, os cortes estimados e a lista de compra.
              </div>
            ) : (
              <ResultsTable
                result={result}
                onExportCSV={() =>
                  download("quantificacao-telhas.csv", toCSVTelhas(result), "text/csv")
                }
                onExportJSON={() =>
                  download(
                    "quantificacao-telhas.json",
                    JSON.stringify({ inputs: state, outputs: result }, null, 2),
                    "application/json",
                  )
                }
                onCopy={() =>
                  navigator.clipboard.writeText(
                    JSON.stringify({ inputs: state, outputs: result }, null, 2),
                  )
                }
              />

            )}
          </div>
        </div>

        <div className="mt-10 grid gap-6 rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground sm:grid-cols-2">
          <div>
            <h2 className="text-base font-semibold text-foreground">Como o cálculo funciona</h2>
            <p className="mt-2">
              A quantidade base é <code>teto(área ÷ área do módulo)</code>, onde o módulo inclui a
              junta. Sobre ela aplicamos a perda por corte e a margem de segurança:{" "}
              <code>teto(base × (1 + perda) × (1 + margem))</code>. Quando você informa comprimento e
              largura do ambiente, os cortes são estimados pelas peças de borda em vez da heurística
              por layout.
            </p>
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Limitações</h2>
            <p className="mt-2">
              O MVP não faz otimização de corte (nesting) nem considera recortes em torno de pilares,
              ralos e soleiras. Ambientes em L devem ser divididos em retângulos. Veja a{" "}
              <a href="/metodologia" className="underline">
                metodologia
              </a>{" "}
              geral e a{" "}
              <a href="/calculadora-de-telhas" className="underline">
                calculadora de telhas
              </a>{" "}
              para coberturas inclinadas.
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
