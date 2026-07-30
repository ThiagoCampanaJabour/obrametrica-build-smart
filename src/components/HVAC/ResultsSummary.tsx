import type { HVACResult } from "@/lib/hvac/calc";

const fmt = (n: number, d = 2) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });

export function ResultsSummary({
  result,
  onExportCSV,
  onExportJSON,
}: {
  result: HVACResult;
  onExportCSV: () => void;
  onExportJSON: () => void;
}) {
  const t = result.totais;
  return (
    <div className="rounded-xl border border-border bg-card p-5" aria-live="polite">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-foreground">Resumo da carga térmica</h2>
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
        {[
          { label: "Área total climatizada", value: `${fmt(t.areaM2)} m²` },
          { label: "Carga sensível total", value: `${fmt(t.qTotalKW)} kW`, highlight: true },
          {
            label: "Capacidade recomendada",
            value: `${t.capacidadeTotalBTU.toLocaleString("pt-BR")} BTU/h`,
            highlight: true,
          },
          { label: "Carga com margem", value: `${fmt(t.qComMargemKW)} kW` },
          { label: "Ventilação total", value: `${fmt(t.vazaoLs, 1)} L/s` },
          { label: "Consumo estimado", value: `${fmt(t.consumoKWhMes, 0)} kWh/mês` },
          { label: "ΔT adotado", value: `${fmt(result.deltaT, 1)} °C` },
          { label: "Ambientes", value: `${result.ambientes.length}` },
        ].map((it) => (
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

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {result.ambientes.map((a) => (
          <div key={a.nome} className="rounded-lg border border-border bg-background p-4">
            <h3 className="text-sm font-semibold text-foreground">{a.nome}</h3>
            <p className="mt-1 text-2xl font-bold text-foreground">
              {a.capacidadeSugeridaBTU.toLocaleString("pt-BR")} BTU/h
            </p>
            <p className="text-xs text-muted-foreground">
              {fmt(a.qComMargemKW)} kW com margem · {fmt(a.qTotalKW)} kW sem margem ·{" "}
              {fmt(a.vazaoLs, 1)} L/s
            </p>
            <ul className="mt-2 grid grid-cols-2 gap-1 text-[11px] text-muted-foreground">
              <li>Transmissão: {fmt(a.qTransKW)} kW</li>
              <li>Solar: {fmt(a.qSolarKW)} kW</li>
              <li>Ocupantes: {fmt(a.qPessoasKW)} kW</li>
              <li>Equipamentos: {fmt(a.qEquipKW)} kW</li>
              <li>Ventilação: {fmt(a.qVentKW)} kW</li>
              <li>Latente estimada: {fmt(a.qLatenteKW)} kW</li>
            </ul>
          </div>
        ))}
      </div>

      {[...result.warnings, ...result.ambientes.flatMap((a) => a.warnings)].length > 0 && (
        <ul className="mt-4 space-y-2 text-sm">
          {[...result.warnings, ...result.ambientes.flatMap((a) => a.warnings)].map((w, i) => (
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
