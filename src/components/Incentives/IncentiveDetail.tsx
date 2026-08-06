import type {
  Estimate,
  Incentive,
  IncentiveImpact,
} from "@/lib/solar/incentives";
import { validateIncentiveEligibility } from "@/lib/solar/incentives";
import { brl } from "./IncentiveList";

export interface IncentiveDetailProps {
  incentive: Incentive;
  impacto: IncentiveImpact;
  estimate: Estimate;
  onClose: () => void;
  onApply: () => void;
  aplicado: boolean;
}

export function IncentiveDetail({
  incentive,
  impacto,
  estimate,
  onClose,
  onApply,
  aplicado,
}: IncentiveDetailProps) {
  const check = validateIncentiveEligibility(estimate, incentive);

  return (
    <section className="mt-6 rounded-xl border border-accent/40 bg-accent/10 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="min-w-0 text-base font-semibold text-foreground">{incentive.title}</h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          Fechar
        </button>
      </div>

      <p className="mt-2 text-sm text-muted-foreground">{incentive.details}</p>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="min-w-0 rounded-md border border-border bg-background p-4">
          <h3 className="text-sm font-semibold text-foreground">Cálculo do impacto</h3>
          <p className="mt-2 break-words font-mono text-xs text-muted-foreground">
            {impacto.formula}
          </p>
          <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
            <li>Δ CAPEX: <strong className="text-foreground">{brl(impacto.capex_delta_R)}</strong></li>
            <li>Δ OPEX anual: <strong className="text-foreground">{brl(impacto.opex_delta_R_por_ano)}</strong></li>
            <li>Δ Receita anual: <strong className="text-foreground">{brl(impacto.receita_delta_R_por_ano)}</strong></li>
          </ul>
          {impacto.notes.length > 0 && (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-muted-foreground">
              {impacto.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="min-w-0 rounded-md border border-border bg-background p-4">
          <h3 className="text-sm font-semibold text-foreground">Elegibilidade</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Status:{" "}
            <strong className={check.eligible ? "text-foreground" : "text-destructive"}>
              {check.eligible ? "Elegível com as premissas atuais" : "Não elegível"}
            </strong>
          </p>
          {check.reasons.length > 0 && (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-destructive">
              {check.reasons.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          )}
          <h4 className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Documentação exigida
          </h4>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-xs text-muted-foreground">
            {incentive.eligibility.documentos.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          {check.warnings.length > 0 && (
            <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
              {check.warnings.map((w) => (
                <li key={w}>⚠ {w}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-md border border-border bg-background p-4 text-xs text-muted-foreground">
        <p>
          <strong className="text-foreground">Fonte:</strong> {incentive.source.organization} —{" "}
          {incentive.source.doc_reference}
        </p>
        <p className="mt-1 break-all">
          <a
            href={incentive.source.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="underline hover:text-accent"
          >
            {incentive.source.url}
          </a>
        </p>
        <p className="mt-1">
          <strong className="text-foreground">Última verificação:</strong>{" "}
          {incentive.source.last_checked_date} ·{" "}
          <strong className="text-foreground">Vigência:</strong>{" "}
          {incentive.validity.start_date ?? "não informada"} →{" "}
          {incentive.validity.end_date ?? "sem prazo definido"}
        </p>
        {incentive.notes && <p className="mt-1">{incentive.notes}</p>}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onApply}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {aplicado ? "Remover do estimador" : "Copiar para o estimador de custo"}
        </button>
        <a
          href="/contato"
          className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Solicitar atualização deste incentivo
        </a>
      </div>
    </section>
  );
}
