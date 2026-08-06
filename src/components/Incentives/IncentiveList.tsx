import type { Incentive, IncentiveImpact } from "@/lib/solar/incentives";

export const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 2 });

const SCOPE_LABEL: Record<Incentive["scope"], string> = {
  federal: "Federal",
  estadual: "Estadual",
  municipal: "Municipal",
  concessionaria: "Distribuidora",
};

const CONF_LABEL: Record<Incentive["confidence"], string> = {
  alta: "Confiança alta",
  media: "Confiança média",
  baixa: "Placeholder — confirmar",
};

export interface IncentiveListProps {
  incentives: Incentive[];
  impactos: Map<string, IncentiveImpact>;
  selecionados: string[];
  onToggle: (id: string) => void;
  onDetail: (id: string) => void;
  filtro: string;
  onFiltro: (f: string) => void;
}

const FILTROS = [
  { id: "todos", label: "Todos" },
  { id: "capex", label: "CAPEX" },
  { id: "opex", label: "OPEX / fiscal" },
  { id: "financing", label: "Financiamento" },
  { id: "receita", label: "Receita / tarifa" },
];

export function categoriaDe(inc: Incentive): string {
  switch (inc.impact_model.kind) {
    case "direct_capex_discount":
    case "rebate_fixed":
      return "capex";
    case "financing_rate":
      return "financing";
    case "icms_exemption":
    case "net_metering_bonus":
    case "tariff_discount":
      return "receita";
    default:
      return "opex";
  }
}

export function IncentiveList({
  incentives,
  impactos,
  selecionados,
  onToggle,
  onDetail,
  filtro,
  onFiltro,
}: IncentiveListProps) {
  const visiveis = incentives
    .filter((i) => filtro === "todos" || categoriaDe(i) === filtro)
    .sort(
      (a, b) =>
        (impactos.get(b.id)?.beneficio_total_R ?? 0) -
        (impactos.get(a.id)?.beneficio_total_R ?? 0),
    );

  return (
    <section className="mt-6 rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-foreground">
          2. Incentivos aplicáveis ({incentives.length})
        </h2>
        <div className="flex flex-wrap gap-2">
          {FILTROS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => onFiltro(f.id)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                filtro === f.id
                  ? "border-accent bg-accent/20 text-foreground"
                  : "border-input bg-background text-muted-foreground hover:bg-muted"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {visiveis.length === 0 && (
        <p className="mt-4 rounded-md border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          Nenhum incentivo cadastrado para esta localidade e filtro. Isso não significa que não
          existam programas locais — verifique a prefeitura e a distribuidora.
        </p>
      )}

      <ul className="mt-4 space-y-3">
        {visiveis.map((inc) => {
          const imp = impactos.get(inc.id);
          const ativo = selecionados.includes(inc.id);
          return (
            <li
              key={inc.id}
              className={`min-w-0 rounded-lg border p-4 transition-colors ${
                ativo ? "border-accent bg-accent/10" : "border-border bg-background"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {SCOPE_LABEL[inc.scope]}
                      {inc.uf ? ` · ${inc.uf}` : ""}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        inc.confidence === "baixa"
                          ? "bg-destructive/15 text-destructive"
                          : "bg-accent/20 text-foreground"
                      }`}
                    >
                      {CONF_LABEL[inc.confidence]}
                    </span>
                  </div>
                  <h3 className="mt-2 text-sm font-semibold text-foreground">{inc.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{inc.description}</p>
                  {imp && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Benefício estimado:{" "}
                      <strong className="text-foreground">{brl(imp.beneficio_total_R)}</strong>{" "}
                      {imp.capex_delta_R !== 0 ? "no CAPEX" : "por ano"}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => onToggle(inc.id)}
                    className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                      ativo
                        ? "border border-input bg-background text-foreground hover:bg-muted"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                  >
                    {ativo ? "Remover" : "Aplicar incentivo"}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDetail(inc.id)}
                    className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    Ver detalhe
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
