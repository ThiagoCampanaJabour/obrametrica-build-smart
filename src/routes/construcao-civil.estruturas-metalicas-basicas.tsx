import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import {
  calcEstruturas,
  toCSVEstruturas,
  validarElemento,
  type ElementoInput,
} from "@/lib/estruturas/calc";
import { StructureForm, novoElemento } from "@/components/EstruturasMetalicas/StructureForm";
import { ResultsSummary } from "@/components/EstruturasMetalicas/ResultsSummary";
import { CalculatorShell } from "@/components/calc-ui";

const PATH = "/construcao-civil/estruturas-metalicas-basicas";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Construção Civil", path: "/construcao-civil" },
  { name: "Estruturas Metálicas Básicas", path: PATH },
];

const DISCLAIMER =
  "Ferramenta de estimativa — não substitui projeto estrutural ou cálculo executivo. Todas as recomendações devem ser verificadas por engenheiro estrutural responsável antes da fabricação e montagem.";

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Esta calculadora substitui o cálculo estrutural?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Não. Ela fornece ordens de grandeza de momento, cortante, perfil e peso de aço para estudos preliminares e orçamentos. O dimensionamento definitivo exige combinações de ações, verificação de estados limites, flambagem, ligações e ART de engenheiro habilitado.",
      },
    },
    {
      "@type": "Question",
      name: "Qual tensão admissível é usada na estimativa?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Adotamos tensões admissíveis simplificadas de serviço: 140 MPa para o aço S235, 160 MPa para o S275 e 210 MPa para o S355. São valores conservadores em relação ao escoamento, usados apenas para pré-dimensionar o módulo resistente.",
      },
    },
    {
      "@type": "Question",
      name: "Como o perfil é escolhido?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Calculamos o módulo resistente mínimo W_req = M_max / σ_adm e percorremos a tabela de perfis comerciais (IPE, HEA, HEB e tubos retangulares), selecionando o perfil mais leve cujo W elástico seja maior ou igual ao exigido.",
      },
    },
    {
      "@type": "Question",
      name: "A flecha é verificada?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim, de forma estimativa para elementos fletidos, usando δ = 5qL⁴/(384EI) + PL³/(48EI) com E = 210 GPa e o momento de inércia do perfil. O limite prático comparado é L/250; o projeto pode exigir critérios mais rigorosos.",
      },
    },
  ],
};

export const Route = createFileRoute("/construcao-civil/estruturas-metalicas-basicas")({
  head: () =>
    pageHead({
      title: "Cálculo de Estruturas Metálicas Básicas — Perfis, Aço e Peso | ObraMétrica",
      description:
        "Estime momento, cortante, perfil metálico (IPE, HEA, HEB, tubo) e consumo de aço para vigas simples, vigas contínuas, pórticos e pilares. Exportação CSV/JSON.",
      path: PATH,
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Cálculo de Estruturas Metálicas Básicas",
        url: `https://obrametrica.com.br${PATH}`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      extraSchemas: [FAQ_SCHEMA],
    }),
  component: EstruturasMetalicasPage,
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

function EstruturasMetalicasPage() {
  const [elementos, setElementos] = useState<ElementoInput[]>([novoElemento(1)]);
  const [calculado, setCalculado] = useState(false);

  const erros = useMemo(
    () => elementos.map(validarElemento).filter((e): e is string => e !== null),
    [elementos],
  );

  const result = useMemo(() => {
    if (!calculado || erros.length > 0) return null;
    return calcEstruturas(elementos);
  }, [elementos, calculado, erros]);

  return (
    <CalculatorShell
      title="Cálculo de Estruturas Metálicas Básicas"
      description="Estime momento, cortante, perfil metálico e consumo de aço."
      breadcrumbs={CRUMBS}
      extrasId="estruturas-metalicas"
    >
      <div
        role="note"
        className="mt-4 rounded-md border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-foreground"
      >
        <strong>Aviso importante</strong> — {DISCLAIMER}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,520px)_1fr]">
        <div className="rounded-xl border border-border bg-card p-6">
          <StructureForm
            elementos={elementos}
            setElementos={setElementos}
            onCalculate={() => setCalculado(true)}
            onReset={() => {
              setElementos([novoElemento(1)]);
              setCalculado(false);
            }}
          />
        </div>

        <div>
          {calculado && erros.length > 0 ? (
            <div
              role="alert"
              className="rounded-xl border border-destructive/40 bg-destructive/10 p-6 text-sm text-foreground"
            >
              <ul className="list-disc space-y-1 pl-5">
                {erros.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
          ) : !result ? (
            <div className="rounded-xl border border-dashed border-border bg-muted/40 p-8 text-sm text-muted-foreground">
              Informe o tipo de elemento, o vão e as cargas e clique em <strong>Calcular</strong>{" "}
              para ver os esforços, o perfil sugerido e o consumo de aço.
            </div>
          ) : (
            <ResultsSummary
              result={result}
              onExportCSV={() =>
                download("estruturas-metalicas.csv", toCSVEstruturas(result), "text/csv")
              }
              onExportJSON={() =>
                download(
                  "estruturas-metalicas.json",
                  JSON.stringify(
                    { aviso: DISCLAIMER, inputs: elementos, outputs: result },
                    null,
                    2,
                  ),
                  "application/json",
                )
              }
              onCopy={() =>
                navigator.clipboard.writeText(
                  JSON.stringify(
                    { aviso: DISCLAIMER, inputs: elementos, outputs: result },
                    null,
                    2,
                  ),
                )
              }
            />
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
