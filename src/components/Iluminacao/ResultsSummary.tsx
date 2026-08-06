import {
  RISCO_LABEL,
  STATUS_LABEL,
  ORIENTACAO_LABEL,
  type AmbienteResult,
  type IluminacaoResult,
  type StatusAlvo,
} from "@/lib/iluminacao/calc";
import { DaylightChart } from "./DaylightChart";
import { ShadowPreview } from "./ShadowPreview";
import { ProtectionRecommendations } from "./ProtectionRecommendations";
import { ExportButtons } from "./ExportButtons";

const statusCls: Record<StatusAlvo, string> = {
  ok: "border-emerald-500/40 bg-emerald-500/10",
  atencao: "border-amber-500/40 bg-amber-500/10",
  insuficiente: "border-destructive/40 bg-destructive/10",
};

function AmbienteCard({ a }: { a: AmbienteResult }) {
  return (
    <article className="rounded-xl border border-border bg-card p-6">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-lg font-semibold text-foreground">{a.input.nome}</h3>
        <p className="text-sm text-muted-foreground">
          {ORIENTACAO_LABEL[a.input.orientacao]} · {a.cidade.nome}
        </p>
      </header>

      <div className={`mt-4 rounded-lg border p-4 ${statusCls[a.status]}`}>
        <p className="text-sm font-semibold text-foreground">{STATUS_LABEL[a.status]}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Alvo de {a.input.targetLux} lux · risco de ofuscamento {RISCO_LABEL[a.risco].toLowerCase()}
        </p>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">Área de vidro</dt>
          <dd className="text-lg font-semibold text-foreground">{a.areaVidroM2.toFixed(2)} m²</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">Daylight factor</dt>
          <dd className="text-lg font-semibold text-foreground">{a.daylightFactorPct}%</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">
            E interna (DF, céu encoberto)
          </dt>
          <dd className="text-lg font-semibold text-foreground">{a.eInsideDFLux} lux</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-muted-foreground">
            E média (irradiância)
          </dt>
          <dd className="text-lg font-semibold text-foreground">{a.eMediaLux} lux</dd>
        </div>
      </dl>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[520px] text-sm">
          <caption className="sr-only">Resultados por faixa horária de {a.input.nome}</caption>
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th scope="col" className="py-2">Faixa</th>
              <th scope="col" className="py-2 text-right">E média (lux)</th>
              <th scope="col" className="py-2 text-right">Pico (lux)</th>
              <th scope="col" className="py-2 text-right">Direta / difusa</th>
              <th scope="col" className="py-2 text-right">Ofuscamento</th>
              <th scope="col" className="py-2 text-right">Situação</th>
            </tr>
          </thead>
          <tbody>
            {a.faixas.map((f) => (
              <tr key={f.label} className="border-b border-border/60">
                <td className="py-2 text-foreground">{f.label}</td>
                <td className="py-2 text-right text-foreground">{f.eMediaLux}</td>
                <td className="py-2 text-right text-muted-foreground">{f.ePicoLux}</td>
                <td className="py-2 text-right text-muted-foreground">
                  {f.percentualDireta}% / {f.percentualDifusa}%
                </td>
                <td className="py-2 text-right text-muted-foreground">{RISCO_LABEL[f.risco]}</td>
                <td className="py-2 text-right text-muted-foreground">{STATUS_LABEL[f.status]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DaylightChart ambiente={a} />
      <ShadowPreview ambiente={a} />
      <ProtectionRecommendations itens={a.recomendacoes} />

      {a.alertas.length > 0 && (
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          {a.alertas.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      )}

      <details className="mt-4 rounded-md border border-border bg-muted/30 p-4">
        <summary className="cursor-pointer text-sm font-medium text-foreground">
          Memória de cálculo
        </summary>
        <ol className="mt-2 space-y-1 text-xs text-muted-foreground">
          {a.passos.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ol>
      </details>
    </article>
  );
}

export function ResultsSummary({
  result,
  onExportCSV,
  onExportJSON,
  onCopy,
}: {
  result: IluminacaoResult;
  onExportCSV: () => void;
  onExportJSON: () => void;
  onCopy: () => Promise<void> | void;
}) {
  return (
    <div aria-live="polite" className="space-y-6">
      {result.ambientes.map((a) => (
        <AmbienteCard key={a.input.id} a={a} />
      ))}
      <ExportButtons onExportCSV={onExportCSV} onExportJSON={onExportJSON} onCopy={onCopy} />
    </div>
  );
}
