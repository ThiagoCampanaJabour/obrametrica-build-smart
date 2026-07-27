import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageHead } from "@/lib/seo";
import { ComparadorForm } from "@/components/ComparadorSistemas/ComparadorForm";
import { ComparativeTable } from "@/components/ComparadorSistemas/ComparativeTable";
import { ResultsChart } from "@/components/ComparadorSistemas/ResultsChart";
import { compareSystems, type CompareOutput } from "@/lib/comparador-sistemas/calc";

const PATH = "/energia-solar/comparador-sistemas";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Energia Solar", path: "/energia-solar" },
  { name: "Comparador de Sistemas", path: PATH },
];

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Qual a diferença entre on-grid e off-grid?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "On-grid é conectado à rede da concessionária e não usa baterias; off-grid é autônomo, requer banco de baterias e dimensionamento para autonomia total.",
      },
    },
    {
      "@type": "Question",
      name: "Quando escolher um sistema híbrido?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sistemas híbridos combinam a economia do on-grid com o backup por baterias, sendo indicados para regiões com quedas frequentes de energia ou consumidores que valorizam resiliência sem abrir mão do menor payback.",
      },
    },
    {
      "@type": "Question",
      name: "Como estimo o banco de baterias necessário?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A calculadora usa consumo médio horário × horas de autonomia × fator de segurança (1,2) ÷ profundidade útil de descarga (DoD) para estimar o banco em kWh.",
      },
    },
  ],
};

export const Route = createFileRoute("/energia-solar/comparador-sistemas")({
  head: () =>
    pageHead({
      title: "Comparador On-Grid, Off-Grid e Híbrido | ObraMétrica",
      description:
        "Compare sistemas fotovoltaicos on-grid, off-grid e híbrido: custo inicial, payback, VPL, TIR, banco de baterias e autonomia. 100% no navegador.",
      path: PATH,
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Comparador de Sistemas Solares",
        url: `https://obrametrica.com.br${PATH}`,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      extraSchemas: [FAQ_SCHEMA],
    }),
  component: ComparadorPage,
});

function toCSV(out: CompareOutput): string {
  const header = [
    "sistema",
    "investimento_inicial",
    "banco_baterias_kwh",
    "economia_anual",
    "payback_simples",
    "payback_descontado",
    "vpl",
    "tir",
    "custo_total_25a",
  ].join(",");
  const rows = out.sistemas.map((s) =>
    [
      s.nome,
      s.investimentoInicial,
      s.bancoBateriasKWh,
      s.economiaAnual,
      s.paybackSimples ?? "",
      s.paybackDescontado ?? "",
      s.vpl,
      s.tir ?? "",
      s.custoTotal25,
    ].join(","),
  );
  return [header, ...rows].join("\n");
}

function download(name: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function ComparadorPage() {
  const [out, setOut] = useState<CompareOutput | null>(null);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumbs items={CRUMBS} />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Comparador On-Grid, Off-Grid e Híbrido
        </h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Compare de forma didática três configurações de sistemas fotovoltaicos, com custo,
          payback, VPL/TIR, banco de baterias e autonomia. Consulte a{" "}
          <a href="/metodologia" className="underline hover:text-accent">metodologia</a>.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <ComparadorForm onCompare={(input) => setOut(compareSystems(input))} />
          </div>

          <div aria-live="polite">
            {!out ? (
              <div className="flex h-full min-h-[240px] items-center justify-center rounded-xl border border-dashed border-border p-8 text-sm text-muted-foreground">
                Preencha os campos e clique em “Comparar sistemas” para gerar o comparativo.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-3">
                {out.sistemas.map((s) => (
                  <article key={s.tipo} className="rounded-xl border border-border bg-card p-4 shadow-sm">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">{s.nome}</h2>
                    <p className="mt-2 text-2xl font-bold text-foreground">
                      {s.investimentoInicial.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                        maximumFractionDigits: 0,
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground">investimento inicial</p>
                    <dl className="mt-3 space-y-1 text-xs">
                      <div className="flex justify-between"><dt>Payback</dt><dd>{s.paybackSimples ?? "—"} anos</dd></div>
                      <div className="flex justify-between"><dt>Economia/ano</dt><dd>R$ {s.economiaAnual.toLocaleString("pt-BR")}</dd></div>
                      <div className="flex justify-between"><dt>Baterias</dt><dd>{s.bancoBateriasKWh ? `${s.bancoBateriasKWh} kWh` : "—"}</dd></div>
                    </dl>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>

        {out && (
          <>
            <ComparativeTable sistemas={out.sistemas} />
            <ResultsChart sistemas={out.sistemas} />
            <div className="mt-6 rounded-lg border border-accent/40 bg-accent/10 p-4 text-sm text-foreground">
              <strong>Recomendação:</strong> {out.recomendacao}
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => download("comparador-sistemas.csv", toCSV(out), "text/csv")}
                className="rounded-md border border-input bg-background px-4 py-2 text-sm font-semibold hover:bg-accent/20"
              >
                Exportar CSV
              </button>
              <button
                type="button"
                onClick={() =>
                  download("comparador-sistemas.json", JSON.stringify(out, null, 2), "application/json")
                }
                className="rounded-md border border-input bg-background px-4 py-2 text-sm font-semibold hover:bg-accent/20"
              >
                Exportar JSON
              </button>
            </div>
          </>
        )}

        <div className="mt-10 rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          <strong className="text-foreground">Aviso:</strong> valores de baterias, DoD e custo por
          kWp são estimativas típicas de mercado. Ajuste conforme cotações reais. Não substitui um
          projeto assinado por profissional habilitado.
        </div>
      </section>
    </SiteLayout>
  );
}
