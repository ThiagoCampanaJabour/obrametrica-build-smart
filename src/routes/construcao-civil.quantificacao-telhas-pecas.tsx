import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { calcQuantification, toCSVTelhas } from "@/lib/telhas/calc";
import { DEFAULT_QUANT_FORM, QuantForm, type QuantFormState } from "@/components/TelhasQuant/QuantForm";
import { ResultsTable } from "@/components/TelhasQuant/ResultsTable";
import { CalculatorShell } from "@/components/calc-ui";

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
      title: "Quantificação e Corte de Telhas e Peças — ObraMétrica",
      description:
        "Calcule quantidade de telhas, pisos e revestimentos considerando layout de assentamento, recortes e perdas. Reduza o desperdício em sua obra.",
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
    if (!(state.areaM2 > 0) || state.areaM2 > 10000) return null;
    if (!(state.larguraMm > 0) || !(state.alturaMm > 0)) return null;
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
    <CalculatorShell
      title="Quantificação e Corte de Telhas e Peças"
      description="Descubra a quantidade ideal de materiais cerâmicos e revestimentos, prevendo cortes e perdas reais por layout."
      breadcrumbs={CRUMBS}
      extrasId="/construcao-civil/quantificacao-telhas-pecas"
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_1fr]">
        <div className="space-y-6">
          <div
            role="note"
            className="rounded-md border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-foreground"
          >
            <strong>Nota Técnica:</strong> Os percentuais de corte são baseados em padrões de assentamento NBR. Sempre valide as medidas no canteiro antes da compra.
          </div>
          
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
        </div>

        <div className="min-w-0">
          {invalido ? (
            <div
              role="alert"
              className="rounded-xl border border-destructive/40 bg-destructive/10 p-6 text-sm text-foreground"
            >
              Erro: Verifique se a área e as dimensões da peça são maiores que zero.
            </div>
          ) : !result ? (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center text-muted-foreground">
              <p>Preencha os dados da área e da peça para gerar o quantitativo.</p>
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
    </CalculatorShell>
  );
}

