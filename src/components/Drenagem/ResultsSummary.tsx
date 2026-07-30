import type { DrenagemResult } from "@/lib/drenagem/calc";

const fmt = (n: number, d = 2) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });

export function ResultsSummary({
  result,
  onExportCSV,
  onExportJSON,
}: {
  result: DrenagemResult;
  onExportCSV: () => void;
  onExportJSON: () => void;
}) {
  const { resumo } = result;
  const items = [
    { label: "Área total contribuinte", value: `${fmt(resumo.areaTotalM2)} m²` },
    { label: "Vazão de projeto total", value: `${fmt(resumo.vazaoTotalLs)} L/s`, highlight: true },
    {
      label: "Conduto geral sugerido",
      value: resumo.tuboGeral.diametroMm ? `DN ${resumo.tuboGeral.diametroMm} mm` : "n/d",
      highlight: true,
    },
    { label: "Velocidade no conduto", value: `${fmt(resumo.tuboGeral.velocidadeMs)} m/s` },
    {
      label: "Calha sugerida",
      value: `${resumo.calhaGeral.larguraMm} × ${resumo.calhaGeral.alturaMm} mm`,
    },
    { label: "Ralos / grelhas (total)", value: `${resumo.ralosTotais} un.` },
    { label: "Intensidade adotada", value: `${fmt(resumo.intensidadeMmH, 0)} mm/h` },
    { label: "Declividade adotada", value: `${fmt(resumo.declividadePct, 2)} %` },
  ];

  const warnings = [
    ...result.warnings,
    ...(resumo.tuboGeral.warning ? [resumo.tuboGeral.warning] : []),
    ...(resumo.calhaGeral.warning ? [resumo.calhaGeral.warning] : []),
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-5" aria-live="polite">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-foreground">Resumo do sistema de drenagem</h2>
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
            Gerar relatório
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

      {warnings.length > 0 && (
        <ul className="mt-4 space-y-2 text-sm">
          {warnings.map((w, i) => (
            <li
              key={i}
              className="rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-foreground"
            >
              {w}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
