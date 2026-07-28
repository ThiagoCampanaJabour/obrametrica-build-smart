import { formatMoney, type LajesResumo } from "@/lib/lajes/calc";

const fmt = (n: number, d = 2) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });

function Card({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className={`rounded-md bg-background p-3 ${
        highlight ? "ring-2 ring-accent" : "border border-border"
      }`}
    >
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-lg font-semibold text-foreground">{value}</dd>
    </div>
  );
}

export function ResultsSummary({
  resumo,
  custos,
  onExportCSV,
  onExportJSON,
}: {
  resumo: LajesResumo;
  custos?: { custoConcreto: number; custoAco: number; custoForma: number; custoTotal: number };
  onExportCSV: () => void;
  onExportJSON: () => void;
}) {
  return (
    <div
      role="region"
      aria-live="polite"
      className="rounded-xl border border-accent/40 bg-accent/10 p-5"
    >
      <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
        Resumo geral
      </h2>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Card label="Área total" value={`${fmt(resumo.totalArea)} m²`} />
        <Card label="Volume de concreto" value={`${fmt(resumo.totalVolume, 3)} m³`} highlight />
        <Card label="Aço estimado" value={`${fmt(resumo.totalAco, 1)} kg`} highlight />
        <Card label="Comprimento vergalhões" value={`${fmt(resumo.totalVergalhoes, 1)} m`} />
        <Card label="Área de formas" value={`${fmt(resumo.totalForma)} m²`} />
        {custos && <Card label="Custo total estimado" value={formatMoney(custos.custoTotal)} highlight />}
      </dl>

      {custos && (
        <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
          <span>Concreto: {formatMoney(custos.custoConcreto)}</span>
          <span>Aço: {formatMoney(custos.custoAco)}</span>
          <span>Formas: {formatMoney(custos.custoForma)}</span>
        </div>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        Estimativa preliminar (±15–25%). Não substitui projeto estrutural conforme NBR 6118.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onExportCSV}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted"
        >
          Exportar CSV
        </button>
        <button
          type="button"
          onClick={onExportJSON}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted"
        >
          Exportar JSON
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted"
        >
          Imprimir
        </button>
      </div>
    </div>
  );
}
