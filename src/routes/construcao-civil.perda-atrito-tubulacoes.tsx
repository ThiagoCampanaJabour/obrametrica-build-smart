import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
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

const PATH = "/construcao-civil/perda-atrito-tubulacoes";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Construção Civil", path: "/construcao-civil" },
  { name: "Perda de Carga em Tubulações", path: PATH },
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
        text: "Darcy-Weisbach é fisicamente geral e vale para qualquer fluido e temperatura, usando o fator de atrito f em função de Reynolds e da rugosidade relativa. Hazen-Williams é empírica, usa apenas o coeficiente C do material e só é confiável para água entre 4 °C e 30 °C, com velocidades de 0,6 a 3,0 m/s.",
      },
    },
    {
      "@type": "Question",
      name: "Como o fator de atrito é calculado?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Para Re abaixo de 2000 aplica-se f = 64/Re (laminar). Acima disso, a calculadora resolve Colebrook-White por Newton-Raphson ou usa a fórmula explícita de Swamee-Jain, com fallback automático caso a iteração não convirja.",
      },
    },
    {
      "@type": "Question",
      name: "A calculadora substitui o projeto hidráulico?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Não. Ela fornece estimativas de anteprojeto. O projeto hidráulico executivo deve ser elaborado e assinado por profissional habilitado, conforme a ABNT NBR 5626 e demais normas aplicáveis.",
      },
    },
  ],
};

export const Route = createFileRoute("/construcao-civil/perda-atrito-tubulacoes")({
  head: () =>
    pageHead({
      title: "Calculadora de Perda de Carga em Tubulações — Darcy e Hazen | ObraMétrica",
      description:
        "Calcule perda por atrito em tubulações de água por Darcy-Weisbach (Colebrook/Swamee-Jain) ou Hazen-Williams, com perdas localizadas, curva do sistema e potência de bomba.",
      path: PATH,
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Calculadora de Perda de Carga em Tubulações",
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
        erro: e instanceof Error ? e.message : "Não foi possível calcular com os dados informados.",
      };
    }
  }, [state, calculated]);

  const exportJSON = () => {
    if (!result) return;
    download(
      "perda-carga.json",
      JSON.stringify({ inputs: state, outputs: result, curvaSistema: curva }, null, 2),
      "application/json",
    );
  };
  const exportCSV = () => {
    if (!result) return;
    download("perda-carga.csv", toCSVHidraulica(result), "text/csv");
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumbs items={CRUMBS} />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Calculadora de Perda de Carga em Tubulações
        </h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Estime a perda por atrito e as perdas localizadas em tubulações de água por{" "}
          <strong>Darcy-Weisbach</strong> (fator de atrito por Colebrook-White ou Swamee-Jain) ou por{" "}
          <strong>Hazen-Williams</strong>. Some trechos em série, inclua curvas e válvulas e obtenha
          a altura manométrica e a potência estimada do conjunto motobomba.
        </p>

        <div
          role="note"
          className="mt-4 rounded-md border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-foreground"
        >
          <strong>Estimativa:</strong> o projeto hidráulico final deve ser verificado e assinado por
          profissional qualificado (<em>ABNT NBR 5626</em> / <em>NBR 12218</em>).
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,540px)_1fr]">
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

          <div>
            {erro && (
              <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-foreground">
                {erro}
              </div>
            )}
            {!result && !erro ? (
              <div className="rounded-xl border border-dashed border-border bg-muted/40 p-8 text-sm text-muted-foreground">
                Preencha diâmetro, comprimento, vazão e material e clique em{" "}
                <strong>Calcular</strong> para ver velocidade, Reynolds, fator de atrito e perda de
                carga.
              </div>
            ) : result ? (
              <>
                <ResultsSummary
                  result={result}
                  onExportCSV={exportCSV}
                  onExportJSON={exportJSON}
                />
                <DetailTable result={result} />
                <PerdaChart result={result} curva={curva} />
              </>
            ) : null}
          </div>
        </div>

        <div className="mt-10 grid gap-6 rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground sm:grid-cols-2">
          <div>
            <h2 className="text-base font-semibold text-foreground">Como o cálculo é feito</h2>
            <p className="mt-2">
              A velocidade vem da continuidade <code>V = 4Q/(πD²)</code> e o regime é classificado
              por <code>Re = ρVD/μ</code>, com ρ e μ da água em função da temperatura. Em Darcy, a
              perda é <code>hf = f·(L/D)·V²/2g</code>; em regime laminar aplica-se{" "}
              <code>f = 64/Re</code>. Hazen-Williams usa{" "}
              <code>hf = 10,67·L·Q^1,852/(C^1,852·D^4,871)</code>. As peças somam{" "}
              <code>ΣK·V²/2g</code>.
            </p>
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Limitações</h2>
            <p className="mt-2">
              Não são modelados transiente hidráulico (golpe de aríete), redes malhadas, cavitação/
              NPSH, condutos não circulares nem envelhecimento da tubulação. Hazen-Williams só vale
              para água entre ~4 °C e 30 °C. Veja a{" "}
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
