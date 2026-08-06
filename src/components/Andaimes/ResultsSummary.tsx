import { SISTEMA_LABEL, type QuantAndaimesResult } from "@/lib/andaimes/calc";
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

export function ResultsSummary({
  result,
  onExportCSV,
  onExportJSON,
  onCopy,
}: {
  result: QuantAndaimesResult;
  onExportCSV: () => void;
  onExportJSON: () => void;
  onCopy: () => Promise<void> | void;
}) {
  const t = result.totais;

  return (
    <div aria-live="polite">
      <div className="rounded-xl border border-accent/40 bg-accent/10 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
          Resumo geral — {result.trechos.length} trecho(s)
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Card label="Módulos de andaime" value={`${t.modulosTotal} un`} hint="com margem de segurança" />
          <Card label="Plataformas" value={`${t.plataformas} un`} hint={`${t.areaPlataformaM2} m² de piso`} />
          <Card label="Área de fachada" value={`${t.areaFachadaM2} m²`} />
          <Card label="Diagonais" value={`${t.diagonais} un`} />
          <Card label="Guarda-corpos" value={`${t.guardaCorpos} un`} />
          <Card label="Peso estimado" value={`${t.pesoTotalKg} kg`} hint="para logística de entrega" />
        </div>

        <ExportButtons onExportCSV={onExportCSV} onExportJSON={onExportJSON} onCopy={onCopy} />
      </div>

      {result.alertas.length > 0 && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-amber-500/40 bg-amber-500/10 p-5 text-sm text-foreground"
        >
          <h3 className="text-base font-semibold">Alertas de segurança</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {result.alertas.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
      )}

      {result.trechos.map((tr) => (
        <div key={tr.input.id} className="mt-6 rounded-xl border border-border bg-card p-5">
          <h3 className="text-base font-semibold text-foreground">
            {tr.input.nome} — {SISTEMA_LABEL[tr.input.sistema]}
          </h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Card label="Níveis" value={`${tr.niveis}`} />
            <Card label="Módulos / nível" value={`${tr.modulosPorNivel}`} />
            <Card label="Módulos totais" value={`${tr.modulosTotal} un`} />
            <Card label="Plataformas" value={`${tr.areaPlataformaM2} m²`} />
          </div>

          <LayoutPreview trecho={tr} />

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <caption className="pb-2 text-left text-sm font-semibold text-foreground">
                Itemização — {tr.input.nome}
              </caption>
              <thead className="text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-3 py-2">Item</th>
                  <th className="px-3 py-2">Unidade</th>
                  <th className="px-3 py-2">Quantidade</th>
                  <th className="px-3 py-2">Observação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tr.itens.map((i) => (
                  <tr key={i.item}>
                    <td className="px-3 py-2 font-medium text-foreground">{i.item}</td>
                    <td className="px-3 py-2">{i.unidade}</td>
                    <td className="px-3 py-2 font-semibold text-foreground">{i.quantidade}</td>
                    <td className="px-3 py-2 text-muted-foreground">{i.obs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4 className="mt-5 text-sm font-semibold text-foreground">Cálculo passo a passo</h4>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
            {tr.passos.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ol>
        </div>
      ))}

      <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card p-5">
        <table className="w-full text-left text-sm">
          <caption className="pb-2 text-left text-base font-semibold text-foreground">
            Lista de compra / locação consolidada
          </caption>
          <thead className="text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-3 py-2">Item</th>
              <th className="px-3 py-2">Unidade</th>
              <th className="px-3 py-2">Quantidade</th>
              <th className="px-3 py-2">Observação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {result.itens.map((i) => (
              <tr key={i.item}>
                <td className="px-3 py-2 font-medium text-foreground">{i.item}</td>
                <td className="px-3 py-2">{i.unidade}</td>
                <td className="px-3 py-2 font-semibold text-foreground">{i.quantidade}</td>
                <td className="px-3 py-2 text-muted-foreground">{i.obs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
