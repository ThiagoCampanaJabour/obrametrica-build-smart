import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageHead } from "@/lib/seo";
import { computeAll, formatMoney, toCSV, type LaborInput } from "@/lib/mao-obra/calc";
import {
  MaoObraForm,
  DEFAULT_COST,
  DEFAULT_SHIFT,
} from "@/components/MaoObra/MaoObraForm";
import { ResultsTable } from "@/components/MaoObra/ResultsTable";

const PATH = "/construcao-civil/calculadora-mao-obra";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Construção Civil", path: "/construcao-civil" },
  { name: "Calculadora de Mão de Obra", path: PATH },
];

export const Route = createFileRoute("/construcao-civil/calculadora-mao-obra")({
  head: () =>
    pageHead({
      title: "Calculadora de Mão de Obra — Construção Civil | ObraMétrica",
      description:
        "Calcule horas-homem, dias de execução e custo de mão de obra para reboco, alvenaria, piso, pintura, concretagem e mais. Presets editáveis e export CSV/JSON.",
      path: PATH,
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Calculadora de Mão de Obra",
        url: `https://obrametrica.com.br${PATH}`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
    }),
  component: MaoObraPage,
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

function MaoObraPage() {
  const [items, setItems] = useState<LaborInput[]>([]);
  const [costPerHour, setCostPerHour] = useState<number>(DEFAULT_COST);
  const [shiftHours, setShiftHours] = useState<number>(DEFAULT_SHIFT);

  const totals = useMemo(() => computeAll(items), [items]);

  const patch = (id: string, p: Partial<LaborInput>) =>
    setItems((arr) => arr.map((it) => (it.id === id ? { ...it, ...p } : it)));
  const remove = (id: string) => setItems((arr) => arr.filter((it) => it.id !== id));
  const add = (item: LaborInput) => setItems((arr) => [...arr, item]);
  const load = (list: LaborInput[]) =>
    setItems(list.map((it) => ({ ...it, id: it.id ?? Math.random().toString(36).slice(2, 10) })));

  const exportCSV = () => download("mao-obra.csv", toCSV(totals), "text/csv");
  const exportJSON = () =>
    download(
      "mao-obra.json",
      JSON.stringify({ items, costPerHour, shiftHours, totals }, null, 2),
      "application/json",
    );

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumbs items={CRUMBS} />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Calculadora de Mão de Obra
        </h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Converta serviços de obra em horas-homem, dias e custo total de mão de obra. Ajuste
          produtividade e custo por hora em tempo real, agrupe por etapa e exporte em CSV ou JSON.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,360px)_1fr]">
          <div className="rounded-xl border border-border bg-card p-6">
            <MaoObraForm
              onLoad={load}
              onAdd={add}
              costPerHour={costPerHour}
              onCostPerHour={setCostPerHour}
              shiftHours={shiftHours}
              onShiftHours={setShiftHours}
            />
          </div>

          <div>
            {items.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-muted/40 p-8 text-sm text-muted-foreground">
                Adicione um serviço, carregue o exemplo ou importe um JSON para começar.
              </div>
            ) : (
              <>
                <ResultsTable
                  totals={totals}
                  items={items}
                  onPatch={patch}
                  onRemove={remove}
                />

                <div
                  aria-live="polite"
                  className="mt-6 rounded-xl border border-border bg-card p-6"
                >
                  <dl className="grid gap-2 text-sm sm:grid-cols-2">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Horas totais</dt>
                      <dd className="font-medium tabular-nums">
                        {totals.hours_total.toFixed(1)} h
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">
                        Dias equivalentes (1 trab · {shiftHours}h/dia)
                      </dt>
                      <dd className="font-medium tabular-nums">
                        {(totals.hours_total / Math.max(1, shiftHours)).toFixed(1)} dias
                      </dd>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2 sm:col-span-2">
                      <dt className="text-base font-semibold text-foreground">
                        Custo total de mão de obra
                      </dt>
                      <dd className="text-lg font-bold text-foreground">
                        {formatMoney(totals.cost_total)}
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
                      Exportar JSON / Salvar cenário
                    </button>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted"
                    >
                      Imprimir / PDF
                    </button>
                    <button
                      type="button"
                      onClick={() => setItems([])}
                      className="ml-auto rounded-lg border border-border px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted"
                    >
                      Limpar tudo
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          Os valores de produtividade e custo por hora são estimativas típicas do mercado brasileiro
          e devem ser ajustados à realidade da sua obra e ao piso salarial local (SINDUSCON).
        </p>
      </section>
    </SiteLayout>
  );
}
