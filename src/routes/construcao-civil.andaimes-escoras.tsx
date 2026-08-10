import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { calcAndaimes, toCSVAndaimes, validarTrecho, type TrechoInput } from "@/lib/andaimes/calc";
import { AndaimeForm, novoTrecho } from "@/components/Andaimes/AndaimeForm";
import { ResultsSummary } from "@/components/Andaimes/ResultsSummary";
import { CalculatorShell } from "@/components/calc-ui";

const PATH = "/construcao-civil/andaimes-escoras";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Construção Civil", path: "/construcao-civil" },
  { name: "Andaimes e Escoras", path: PATH },
];

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Quando preciso de projeto estrutural para andaime?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sempre que a torre ultrapassar cerca de 12 m de altura, houver balanços, cargas concentradas ou exposição severa ao vento. Nesses casos a NR-18 exige projeto assinado por profissional habilitado.",
      },
    },
    {
      "@type": "Question",
      name: "Qual o peso suportado por uma escora metálica?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Depende da altura e do modelo. Escoras padrão de 3,20m costumam suportar entre 1.000 kg (aberta) e 2.000 kg (fechada). Sempre verifique a tabela de carga do fabricante.",
      },
    },
  ],
};

export const Route = createFileRoute("/construcao-civil/andaimes-escoras")({
  head: () =>
    pageHead({
      title: "Cálculo de Escoras & Andaimes — Quantidade de Materiais | ObraMétrica",
      description:
        "Estime a quantidade de módulos de andaime, travessas, pisos e escoras para sua obra. Planeje a locação com precisão e segurança.",
      path: PATH,
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Calculadora de Andaimes e Escoras",
        url: `https://obrametrica.com.br${PATH}`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      extraSchemas: [FAQ_SCHEMA],
    }),
  component: AndaimesPage,
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

function AndaimesPage() {
  const [trechos, setTrechos] = useState<TrechoInput[]>([novoTrecho(1)]);
  const [calculated, setCalculated] = useState(false);

  const result = useMemo(() => {
    if (!calculated) return null;
    const validos = trechos.filter((t) => !validarTrecho(t));
    if (validos.length === 0) return null;
    return calcAndaimes(validos);
  }, [trechos, calculated]);

  const exportJSON = () => {
    if (!result) return;
    download(
      "andaimes-escoras.json",
      JSON.stringify({ inputs: trechos, outputs: result }, null, 2),
      "application/json",
    );
  };

  const exportCSV = () => {
    if (!result) return;
    download("andaimes-escoras.csv", toCSVAndaimes(result), "text/csv");
  };

  return (
    <CalculatorShell
      title="Cálculo de Escoras & Andaimes"
      description="Planeje a locação de equipamentos de acesso e escoramento com base nas dimensões da sua fachada ou laje."
      breadcrumbs={CRUMBS}
      extrasId="/construcao-civil/andaimes-escoras"
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_1fr]">
        <div className="space-y-6">
          <div
            role="note"
            className="rounded-md border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-foreground"
          >
            <strong>Atenção:</strong> Esta ferramenta fornece uma estimativa de peças. A montagem deve seguir rigorosamente a <strong>NR-18</strong> e o projeto de escoramento.
          </div>
          
          <div className="rounded-xl border border-border bg-card p-6">
            <AndaimeForm
              trechos={trechos}
              setTrechos={setTrechos}
              onCalculate={() => setCalculated(true)}
              onReset={() => {
                setTrechos([novoTrecho(1)]);
                setCalculated(false);
              }}
            />
          </div>
        </div>

        <div className="min-w-0">
          {!result ? (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center text-muted-foreground">
              <p>Adicione os trechos da obra e clique em calcular para ver a lista de materiais.</p>
            </div>
          ) : (
            <ResultsSummary
              result={result}
              onExportCSV={exportCSV}
              onExportJSON={exportJSON}
              onCopy={() =>
                navigator.clipboard.writeText(
                  JSON.stringify({ inputs: trechos, outputs: result }, null, 2),
                )
              }
            />
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}

