import { useState } from "react";
import { TIPO_LABEL, type ElementoResult, type EstruturasResult } from "@/lib/estruturas/calc";
import { DetailTable } from "./DetailTable";

const fmt = (n: number, d = 2) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });

function Card({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-md border border-border bg-background p-3">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-lg font-semibold text-foreground">{value}</dd>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function ElementoCard({ r }: { r: ElementoResult }) {
  const [aberto, setAberto] = useState(false);
  const s = r.sugerido;

  return (
    <article className="rounded-xl border border-border bg-card p-5">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-base font-semibold text-foreground">{r.input.nome}</h3>
        <span className="text-xs uppercase tracking-wide text-muted-foreground">
          {TIPO_LABEL[r.input.tipo]} · vão {fmt(r.input.vaoM, 2)} m · {r.input.quantidade} peça(s)
        </span>
      </header>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card label="Momento máximo" value={`${fmt(r.momentoMaxKnM)} kN·m`} />
        <Card label="Cortante máximo" value={`${fmt(r.cortanteMaxKn)} kN`} />
        <Card label="W mínimo exigido" value={`${fmt(r.wReqCm3, 1)} cm³`} hint={`σ_adm ${r.sigmaAdmMPa} MPa`} />
        <Card
          label="Perfil sugerido"
          value={s ? s.perfil.nome : "Nenhum compatível"}
          hint={s ? `${fmt(s.perfil.massaKgM, 1)} kg/m · ${Math.round(s.utilizacao * 100)}% da σ_adm` : undefined}
        />
      </dl>

      {s && (
        <dl className="mt-3 grid gap-3 sm:grid-cols-3">
          <Card label="Comprimento total" value={`${fmt(s.comprimentoTotalM)} m`} />
          <Card label="Peso do conjunto" value={`${fmt(s.pesoTotalKg, 1)} kg`} />
          <Card
            label="Flecha estimada"
            value={s.flechaMm === null ? "Não aplicável" : `${fmt(s.flechaMm, 1)} mm`}
            hint={s.flechaLimiteMm !== null ? `Limite L/250 = ${fmt(s.flechaLimiteMm, 0)} mm` : undefined}
          />
        </dl>
      )}

      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        className="mt-4 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
      >
        {aberto ? "Ocultar cálculo passo a passo" : "Ver cálculo passo a passo"}
      </button>

      {aberto && (
        <div className="mt-3 rounded-md border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
          <ol className="list-decimal space-y-2 pl-5">
            {r.passos.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ol>
        </div>
      )}

      <h4 className="mt-6 text-sm font-semibold text-foreground">Alternativas de perfis</h4>
      <DetailTable elemento={r} />

      <ul className="mt-4 list-disc space-y-1 pl-5 text-xs text-muted-foreground">
        {r.observacoes.map((o) => (
          <li key={o}>{o}</li>
        ))}
      </ul>
    </article>
  );
}

export function ResultsSummary({
  result,
  onExportCSV,
  onExportJSON,
  onCopy,
}: {
  result: EstruturasResult;
  onExportCSV: () => void;
  onExportJSON: () => void;
  onCopy: () => Promise<void> | void;
}) {
  const [copiado, setCopiado] = useState(false);
  const btn =
    "rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted";

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-accent/40 bg-accent/10 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
          Resumo do conjunto
        </h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-3">
          <Card label="Consumo total de aço" value={`${fmt(result.pesoTotalKg, 1)} kg`} />
          <Card label="Comprimento de perfis" value={`${fmt(result.comprimentoTotalM)} m`} />
          <Card label="Peças" value={String(result.totalPecas)} />
        </dl>

        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={onExportCSV} className={btn}>
            Exportar CSV
          </button>
          <button type="button" onClick={onExportJSON} className={btn}>
            Exportar JSON
          </button>
          <button
            type="button"
            className={btn}
            onClick={async () => {
              try {
                await onCopy();
                setCopiado(true);
                setTimeout(() => setCopiado(false), 2000);
              } catch {
                setCopiado(false);
              }
            }}
          >
            {copiado ? "Copiado!" : "Gerar lista de compra"}
          </button>
          <button type="button" onClick={() => window.print()} className={btn}>
            Imprimir
          </button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Estimativa preliminar — a exportação inclui o aviso de que os perfis devem ser validados
          por engenheiro estrutural responsável.
        </p>
      </div>

      {result.elementos.map((r) => (
        <ElementoCard key={r.input.id} r={r} />
      ))}
    </div>
  );
}
