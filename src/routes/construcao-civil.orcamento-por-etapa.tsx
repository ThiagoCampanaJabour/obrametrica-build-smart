import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageHead } from "@/lib/seo";
import {
  aggregateResults,
  type BudgetItem,
  type CalculatorsOutputs,
} from "@/lib/orcamento-etapas/aggregator";
import { computeOrcamento, fmtBRL, toCSV } from "@/lib/orcamento-etapas/calc";
import { OrcamentoForm } from "@/components/OrcamentoEtapas/OrcamentoForm";
import { PreviewTable } from "@/components/OrcamentoEtapas/PreviewTable";
import pricesJson from "@/data/orcamento-prices.json";

const PATH = "/construcao-civil/orcamento-por-etapa";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Construção Civil", path: "/construcao-civil" },
  { name: "Orçamento por Etapa", path: PATH },
];

export const Route = createFileRoute("/construcao-civil/orcamento-por-etapa")({
  head: () =>
    pageHead({
      title: "Orçamento de Materiais por Etapa — Construção Civil | ObraMétrica",
      description:
        "Consolide os quantitativos das calculadoras em um orçamento por etapa. Ajuste preços, aplique sobra e desconto, exporte em CSV ou JSON.",
      path: PATH,
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Orçamento de Materiais por Etapa",
        url: `https://obrametrica.com.br${PATH}`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
    }),
  component: OrcamentoPorEtapaPage,
});

type PriceRow = { sku: string; preco_medio_R: number };
const PRICE_INDEX = new Map<string, number>(
  (pricesJson.items as PriceRow[]).map((p) => [p.sku, p.preco_medio_R]),
);

function fillDefaults(items: BudgetItem[]): BudgetItem[] {
  return items.map((it) => ({
    ...it,
    custo_unitario: it.custo_unitario ?? PRICE_INDEX.get(it.sku) ?? 0,
    sobraPct: it.sobraPct ?? 0,
    descontoPct: it.descontoPct ?? 0,
  }));
}

function download(name: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function OrcamentoPorEtapaPage() {
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [descontoGlobal, setDescontoGlobal] = useState(0);
  const [impostos, setImpostos] = useState(0);

  const totais = useMemo(
    () =>
      computeOrcamento(items, {
        descontoGlobalPct: descontoGlobal,
        impostosPct: impostos,
      }),
    [items, descontoGlobal, impostos],
  );

  const handleLoad = (data: CalculatorsOutputs) => {
    setItems(fillDefaults(aggregateResults(data)));
  };

  const patch = (index: number, p: Partial<BudgetItem>) => {
    setItems((arr) => arr.map((it, i) => (i === index ? { ...it, ...p } : it)));
  };

  const exportCSV = () => download("orcamento.csv", toCSV(totais), "text/csv");
  const exportJSON = () =>
    download(
      "orcamento.json",
      JSON.stringify({ items, descontoGlobal, impostos, totais }, null, 2),
      "application/json",
    );

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumbs items={CRUMBS} />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Orçamento de Materiais por Etapa
        </h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Reúna os resultados das calculadoras da ObraMétrica em um orçamento consolidado por
          etapa. Ajuste preços, aplique sobra e desconto, e exporte para CSV ou JSON.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,340px)_1fr]">
          <div className="rounded-xl border border-border bg-card p-6">
            <OrcamentoForm
              onLoad={handleLoad}
              descontoGlobal={descontoGlobal}
              onDescontoGlobal={setDescontoGlobal}
              impostos={impostos}
              onImpostos={setImpostos}
            />
          </div>

          <div>
            {items.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-muted/40 p-8 text-sm text-muted-foreground">
                Selecione as calculadoras, carregue o exemplo ou importe um JSON para começar.
              </div>
            ) : (
              <>
                <PreviewTable totais={totais} items={items} onPatch={patch} />

                <div
                  aria-live="polite"
                  className="mt-6 rounded-xl border border-border bg-card p-6"
                >
                  <dl className="grid gap-2 text-sm sm:grid-cols-2">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Subtotal</dt>
                      <dd className="font-medium">{fmtBRL(totais.subtotal)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">
                        Desconto global ({totais.descontoGlobalPct}%)
                      </dt>
                      <dd className="text-destructive">- {fmtBRL(totais.descontoValor)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">
                        Impostos ({totais.impostosPct}%)
                      </dt>
                      <dd>+ {fmtBRL(totais.impostosValor)}</dd>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2 sm:col-span-2">
                      <dt className="text-base font-semibold text-foreground">Total geral</dt>
                      <dd className="text-lg font-bold text-foreground">
                        {fmtBRL(totais.total)}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={exportCSV}
                      className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:opacity-90"
                    >
                      Exportar CSV
                    </button>
                    <button
                      type="button"
                      onClick={exportJSON}
                      className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted"
                    >
                      Exportar JSON
                    </button>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted"
                    >
                      Imprimir / PDF
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          Os preços exibidos são médias de mercado. Cote sempre com fornecedores locais antes de
          fechar a compra.
        </p>
      </section>
    </SiteLayout>
  );
}
