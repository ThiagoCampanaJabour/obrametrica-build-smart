import type { AppliedEstimate, Incentive } from "@/lib/solar/incentives";
import { INCENTIVES_DB, exportIncentivesReportCSV, exportIncentivesReportJSON } from "@/lib/solar/incentives";
import type { Estimate } from "@/lib/solar/incentives";
import { brl } from "./IncentiveList";

function download(name: string, mime: string, content: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

const anos = (v: number | null) => (v === null ? "—" : `${v.toFixed(1)} anos`);

function Row({ label, antes, depois }: { label: string; antes: string; depois: string }) {
  return (
    <tr className="border-b border-border last:border-0">
      <th scope="row" className="py-2 pr-3 text-left text-sm font-medium text-muted-foreground">
        {label}
      </th>
      <td className="py-2 pr-3 text-sm text-muted-foreground">{antes}</td>
      <td className="py-2 text-sm font-semibold text-foreground">{depois}</td>
    </tr>
  );
}

export interface IncentiveImpactCalculatorProps {
  estimate: Estimate;
  aplicados: Incentive[];
  resultado: AppliedEstimate;
}

export function IncentiveImpactCalculator({
  estimate,
  aplicados,
  resultado,
}: IncentiveImpactCalculatorProps) {
  const { antes, depois } = resultado;

  return (
    <section aria-live="polite" className="mt-6 rounded-xl border border-border bg-card p-5">
      <h2 className="text-base font-semibold text-foreground">
        3. Impacto no custo e no payback ({aplicados.length} incentivo(s) aplicado(s))
      </h2>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="py-2 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Indicador
              </th>
              <th scope="col" className="py-2 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Antes
              </th>
              <th scope="col" className="py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Depois
              </th>
            </tr>
          </thead>
          <tbody>
            <Row label="CAPEX" antes={brl(antes.capex_R)} depois={brl(depois.capex_R)} />
            <Row label="OPEX anual" antes={brl(antes.opexAnual_R)} depois={brl(depois.opexAnual_R)} />
            <Row label="Receita anual" antes={brl(antes.receitaAnual_R)} depois={brl(depois.receitaAnual_R)} />
            <Row label="Economia líquida anual" antes={brl(antes.liquidoAnual_R)} depois={brl(depois.liquidoAnual_R)} />
            <Row label="Payback simples" antes={anos(antes.payback_anos)} depois={anos(depois.payback_anos)} />
          </tbody>
        </table>
      </div>

      {resultado.impactos.length > 0 && (
        <>
          <h3 className="mt-5 text-sm font-semibold text-foreground">Cálculo passo a passo</h3>
          <ol className="mt-2 space-y-2">
            {resultado.impactos.map((i, idx) => (
              <li key={i.id} className="rounded-md border border-border bg-background p-3">
                <p className="text-sm font-medium text-foreground">
                  {idx + 1}. {i.title}
                </p>
                <p className="mt-1 break-words font-mono text-xs text-muted-foreground">{i.formula}</p>
              </li>
            ))}
          </ol>
        </>
      )}

      {resultado.conflitos.length > 0 && (
        <ul className="mt-4 space-y-2">
          {resultado.conflitos.map((c) => (
            <li key={c} className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
              {c}
            </li>
          ))}
        </ul>
      )}

      {resultado.avisos.length > 0 && (
        <ul className="mt-3 space-y-2">
          {resultado.avisos.map((a) => (
            <li key={a} className="rounded-md border border-border bg-background p-3 text-xs text-muted-foreground">
              {a}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex flex-wrap gap-3 print:hidden">
        <button
          type="button"
          onClick={() =>
            download(
              "incentivos-obrametrica.csv",
              "text/csv;charset=utf-8",
              exportIncentivesReportCSV(aplicados, resultado),
            )
          }
          className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Exportar CSV
        </button>
        <button
          type="button"
          onClick={() =>
            download(
              "incentivos-obrametrica.json",
              "application/json",
              exportIncentivesReportJSON(estimate, aplicados, resultado),
            )
          }
          className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Exportar JSON
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Gerar relatório (PDF)
        </button>
      </div>

      <p className="mt-3 text-[11px] text-muted-foreground">
        Base de dados: {INCENTIVES_DB.version} · gerada em {INCENTIVES_DB.generated_at} · curadoria{" "}
        {INCENTIVES_DB.curator}.
      </p>
    </section>
  );
}
