import type { EletricoResumo } from "@/lib/eletrico/calc";

const fmt = (n: number, d = 2) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });

export function ResultsSummary({
  resumo,
  onExportCSV,
  onExportJSON,
}: {
  resumo: EletricoResumo;
  onExportCSV: () => void;
  onExportJSON: () => void;
}) {
  const items = [
    { label: "Potência instalada", value: `${fmt(resumo.potenciaInstaladaKW)} kW` },
    { label: "Demanda estimada", value: `${fmt(resumo.demandaEstimadaKW)} kW`, highlight: true },
    { label: "Corrente principal", value: `${fmt(resumo.correntePrincipalA, 1)} A` },
    { label: "Quadro sugerido", value: `${resumo.quadroSugeridoA} A`, highlight: true },
  ];
  return (
    <div className="rounded-xl border border-border bg-card p-5" aria-live="polite">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-foreground">Resumo da instalação</h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onExportCSV}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted"
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={onExportJSON}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted"
          >
            Export JSON
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted"
          >
            Imprimir
          </button>
        </div>
      </div>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <div
            key={it.label}
            className={`rounded-md bg-background p-3 ${
              it.highlight ? "ring-2 ring-accent" : "border border-border"
            }`}
          >
            <dt className="text-xs font-medium text-muted-foreground">{it.label}</dt>
            <dd className="mt-1 text-lg font-semibold text-foreground">{it.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
