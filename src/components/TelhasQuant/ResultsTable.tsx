import { LAYOUT_LABEL, TIPO_LABEL, type QuantResult } from "@/lib/telhas/calc";
import { ExportButtons } from "./ExportButtons";
import { LayoutPreview } from "./LayoutPreview";

function Card({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function ResultsTable({
  result,
  onExportCSV,
  onExportJSON,
  onCopy,
}: {
  result: QuantResult;
  onExportCSV: () => void;
  onExportJSON: () => void;
  onCopy: () => Promise<void> | void;
}) {

  const r = result;
  return (
    <div aria-live="polite">
      <div className="rounded-xl border border-accent/40 bg-accent/10 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
          Resultado — {TIPO_LABEL[r.inputs.tipo]} · {LAYOUT_LABEL[r.inputs.layout]}
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Card
            label="Peças a comprar"
            value={`${r.pecasComprar} un`}
            hint={`inclui ${r.pecasReserva} de reserva`}
          />
          <Card label="Peças base (sem perda)" value={`${r.pecasBase} un`} />
          <Card label="Perda aplicada" value={`${r.perdaPctUsada}%`} hint={`sugerido ${r.perdaPctDefault}%`} />
          <Card label="Peças inteiras (est.)" value={`${r.pecasInteiras} un`} />
          <Card
            label="Peças cortadas (est.)"
            value={`${r.pecasCortadas} un`}
            hint={`${r.percentCortes}% do total`}
          />
          <Card label="Perda total" value={`${r.perdaTotalPct}%`} hint={`${r.pecasDescartadas} peças de sobra`} />
        </div>

        <ExportButtons onExportCSV={onExportCSV} onExportJSON={onExportJSON} onCopy={onCopy} />
      </div>

      <LayoutPreview result={r} />


      <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <caption className="px-4 pt-4 text-left text-base font-semibold text-foreground">
            Lista de compra
          </caption>
          <thead className="text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Peça</th>
              <th className="px-4 py-3">Área un.</th>
              <th className="px-4 py-3">Base</th>
              <th className="px-4 py-3">Perda</th>
              <th className="px-4 py-3">Margem</th>
              <th className="px-4 py-3">Reserva</th>
              <th className="px-4 py-3">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr>
              <td className="px-4 py-3 font-medium text-foreground">
                {r.inputs.larguraMm} × {r.inputs.alturaMm} mm
              </td>
              <td className="px-4 py-3">{r.areaPecaM2} m²</td>
              <td className="px-4 py-3">{r.pecasBase}</td>
              <td className="px-4 py-3">{r.perdaPctUsada}%</td>
              <td className="px-4 py-3">{r.margemPct}%</td>
              <td className="px-4 py-3">{r.pecasReserva}</td>
              <td className="px-4 py-3 font-semibold text-foreground">{r.pecasComprar} un</td>
            </tr>
          </tbody>
        </table>

        <table className="w-full text-left text-sm">
          <caption className="px-4 pt-6 text-left text-base font-semibold text-foreground">
            Distribuição da área
          </caption>
          <tbody className="divide-y divide-border">
            <tr>
              <td className="px-4 py-3">Área coberta por peças inteiras</td>
              <td className="px-4 py-3 font-medium text-foreground">{r.areaInteirasM2} m²</td>
            </tr>
            <tr>
              <td className="px-4 py-3">Área coberta por recortes</td>
              <td className="px-4 py-3 font-medium text-foreground">{r.areaCortesM2} m²</td>
            </tr>
            {r.colunas && r.fileiras ? (
              <tr>
                <td className="px-4 py-3">Grid estimado</td>
                <td className="px-4 py-3 font-medium text-foreground">
                  {r.colunas} colunas × {r.fileiras} fileiras
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
        <div className="h-4" />
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card p-5">
        <h3 className="text-base font-semibold text-foreground">Cálculo passo a passo</h3>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
          {r.passos.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ol>
        <h3 className="mt-5 text-base font-semibold text-foreground">Observações</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          {r.observacoes.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
