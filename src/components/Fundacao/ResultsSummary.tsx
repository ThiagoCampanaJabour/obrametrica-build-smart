import {
  calcCustos,
  formatMoney,
  type SapataCorridaResult,
  type SapataIsoladaResult,
} from "@/lib/fundacao/calc";

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

function Alerts({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <ul
      role="alert"
      aria-live="polite"
      className="mt-4 space-y-1 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
    >
      {items.map((a, i) => (
        <li key={i}>⚠ {a}</li>
      ))}
    </ul>
  );
}

export function ResultsIsolada({
  result,
  precos,
  onExportCSV,
  onExportJSON,
}: {
  result: SapataIsoladaResult;
  precos: { precoConcretoM3: number; precoAcoKg: number; precoFormaM2: number };
  onExportCSV: () => void;
  onExportJSON: () => void;
}) {
  const custos = calcCustos(result.volumeTotalM3, result.acoTotalKg, result.formaTotalM2, precos);
  return (
    <div className="mt-6 rounded-lg border border-accent/40 bg-accent/10 p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
        Resultado — Sapatas isoladas ({result.numPilares} un)
      </h2>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Card label="Dimensão da base (L × B)" value={`${fmt(result.ladoM)} × ${fmt(result.ladoM)} m`} />
        <Card label="Altura (H)" value={`${fmt(result.alturaM)} m`} />
        <Card label="Volume por sapata" value={`${fmt(result.volumeUnitM3, 3)} m³`} />
        <Card label="Volume total de concreto" value={`${fmt(result.volumeTotalM3, 2)} m³`} highlight />
        <Card label="Aço total (estimado)" value={`${fmt(result.acoTotalKg, 1)} kg`} highlight />
        <Card label="Área total de formas" value={`${fmt(result.formaTotalM2)} m²`} />
      </dl>

      <div className="mt-5 rounded-md border border-border bg-card p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Custo estimado
        </h3>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div className="flex justify-between"><dt>Concreto</dt><dd className="tabular-nums">{formatMoney(custos.custoConcreto)}</dd></div>
          <div className="flex justify-between"><dt>Aço</dt><dd className="tabular-nums">{formatMoney(custos.custoAco)}</dd></div>
          <div className="flex justify-between"><dt>Forma</dt><dd className="tabular-nums">{formatMoney(custos.custoForma)}</dd></div>
          <div className="flex justify-between border-t border-border pt-2 font-semibold sm:col-span-2">
            <dt>Total</dt><dd className="tabular-nums">{formatMoney(custos.custoTotal)}</dd>
          </div>
        </dl>
      </div>

      <Alerts items={result.alerts} />

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={onExportCSV} className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted">Exportar CSV</button>
        <button type="button" onClick={onExportJSON} className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted">Exportar JSON</button>
      </div>
    </div>
  );
}

export function ResultsCorrida({
  result,
  precos,
  onExportCSV,
  onExportJSON,
}: {
  result: SapataCorridaResult;
  precos: { precoConcretoM3: number; precoAcoKg: number; precoFormaM2: number };
  onExportCSV: () => void;
  onExportJSON: () => void;
}) {
  const custos = calcCustos(result.volumeTotalM3, result.acoTotalKg, result.formaTotalM2, precos);
  return (
    <div className="mt-6 rounded-lg border border-accent/40 bg-accent/10 p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
        Resultado — Sapata corrida ({fmt(result.comprimentoM)} m)
      </h2>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Card label="Largura da base" value={`${fmt(result.larguraM)} m`} />
        <Card label="Altura (H)" value={`${fmt(result.alturaM)} m`} />
        <Card label="Volume por metro" value={`${fmt(result.volumePorMetroM3, 3)} m³/m`} />
        <Card label="Volume total de concreto" value={`${fmt(result.volumeTotalM3, 2)} m³`} highlight />
        <Card label="Aço total (estimado)" value={`${fmt(result.acoTotalKg, 1)} kg`} highlight />
        <Card label="Área total de formas" value={`${fmt(result.formaTotalM2)} m²`} />
      </dl>

      <div className="mt-5 rounded-md border border-border bg-card p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Custo estimado
        </h3>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div className="flex justify-between"><dt>Concreto</dt><dd className="tabular-nums">{formatMoney(custos.custoConcreto)}</dd></div>
          <div className="flex justify-between"><dt>Aço</dt><dd className="tabular-nums">{formatMoney(custos.custoAco)}</dd></div>
          <div className="flex justify-between"><dt>Forma</dt><dd className="tabular-nums">{formatMoney(custos.custoForma)}</dd></div>
          <div className="flex justify-between border-t border-border pt-2 font-semibold sm:col-span-2">
            <dt>Total</dt><dd className="tabular-nums">{formatMoney(custos.custoTotal)}</dd>
          </div>
        </dl>
      </div>

      <Alerts items={result.alerts} />

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={onExportCSV} className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted">Exportar CSV</button>
        <button type="button" onClick={onExportJSON} className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted">Exportar JSON</button>
      </div>
    </div>
  );
}
