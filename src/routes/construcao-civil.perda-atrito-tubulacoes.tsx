import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import {
  totalHeadLoss,
  headLossCurve,
  toCSVHidraulica,
  toM3s,
  toMeters,
  type CalcOptions,
  type Piece,
  type Section,
} from "@/lib/hidraulica/calc";
import {
  DEFAULT_PERDA_FORM,
  PerdaForm,
  type PerdaFormState,
} from "@/components/Hidraulica/PerdaForm";
import { ResultsSummary, DetailTable } from "@/components/Hidraulica/ResultsSummary";
import { PerdaChart } from "@/components/Hidraulica/PerdaChart";
import { CalculatorShell } from "@/components/calc-ui";

const PATH = "/construcao-civil/perda-atrito-tubulacoes";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Construção Civil", path: "/construcao-civil" },
  { name: "Perda por Atrito em Tubulações", path: PATH },
];

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Qual a diferença entre Darcy-Weisbach e Hazen-Williams?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Darcy-Weisbach é fisicamente geral e vale para qualquer fluido, usando o fator de atrito f. Hazen-Williams é empírica, voltada para água em temperaturas comuns e mais simples de aplicar.",
      },
    },
    {
      "@type": "Question",
      name: "Como calcular a potência da bomba?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A potência depende da vazão e da altura manométrica total (desnível + perdas). Nossa calculadora estima essa potência considerando a eficiência do conjunto motobomba.",
      },
    },
  ],
};

export const Route = createFileRoute("/construcao-civil/perda-atrito-tubulacoes")({
  head: () =>
    pageHead({
      title: "Perda por Atrito em Tubulações — Darcy & Hazen | ObraMétrica",
      description:
        "Calcule perda de carga distribuída e localizada em tubulações. Suporte a Darcy-Weisbach e Hazen-Williams com potência de bomba.",
      path: PATH,
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Calculadora de Perda por Atrito em Tubulações",
        url: `https://obrametrica.com.br${PATH}`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      extraSchemas: [FAQ_SCHEMA],
    }),
  component: PerdaAtritoPage,
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

function buildInputs(state: PerdaFormState): {
  sections: Section[];
  pieces: Piece[];
  options: CalcOptions;
} {
  const sections: Section[] = state.trechos.map((t) => ({
    id: t.id,
    label: t.label,
    D_m: toMeters(t.D, state.unidadeD),
    L_m: t.L,
    eps_m: t.eps_mm / 1000,
    Q_m3s: toM3s(t.Q, state.unidadeQ),
    C: t.hazenC,
  }));
  const pieces: Piece[] = state.pecas.map((p) => ({
    label: p.label,
    K: p.K,
    qty: p.qty,
    sectionId: p.trechoId,
  }));
  const options: CalcOptions = {
    method: state.metodo,
    T_C: state.temperatura,
    desnivel_m: state.desnivel,
    eficienciaBomba: state.eficiencia,
  };
  return { sections, pieces, options };
}

function PerdaAtritoPage() {
  const [state, setState] = useState<PerdaFormState>(DEFAULT_PERDA_FORM);
  const [calculated, setCalculated] = useState(false);

  const { result, curva, erro } = useMemo(() => {
    if (!calculated) return { result: null, curva: [], erro: null as string | null };
    try {
      const { sections, pieces, options } = buildInputs(state);
      return {
        result: totalHeadLoss(sections, pieces, options),
        curva: headLossCurve(sections, pieces, options),
        erro: null as string | null,
      };
    } catch (e) {
      return {
        result: null,
        curva: [],
        erro: e instanceof Error ? e.message : "Erro no cálculo.",
      };
    }
  }, [state, calculated]);

  return (
    <CalculatorShell
      title="Perda por Atrito em Tubulações"
      description="Calcule perdas de carga, fator de atrito e potência de bomba para sistemas hidráulicos."
      breadcrumbs={CRUMBS}
      extrasId="/construcao-civil/perda-atrito-tubulacoes"
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(380px,460px)_minmax(0,1fr)]">
        <div className="rounded-xl border border-border bg-card p-6">
          <PerdaForm
            state={state}
            setState={setState}
            onCalculate={() => setCalculated(true)}
            onReset={() => {
              setState(DEFAULT_PERDA_FORM);
              setCalculated(false);
            }}
          />
        </div>

        <div className="min-w-0">
          {erro && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-foreground">
              {erro}
            </div>
          )}
          {!result && !erro ? (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center text-muted-foreground">
              <p>Preencha os dados da tubulação para gerar o perfil de carga.</p>
            </div>
          ) : result ? (
            <div className="space-y-6">
              <ResultsSummary
                result={result}
                onExportCSV={() => download("perda-carga.csv", toCSVHidraulica(result), "text/csv")}
                onExportJSON={() => download("perda-carga.json", JSON.stringify({ inputs: state, outputs: result, curvaSistema: curva }, null, 2), "application/json")}
              />
              <DetailTable result={result} />
              <PerdaChart result={result} curva={curva} />
            </div>
          ) : null}
        </div>
      </div>
    </CalculatorShell>
  );
}

