import { useMemo } from "react";
import type { CostResult } from "@/lib/solar/cost-estimator";
import { brl } from "./ResultsSummary";

/**
 * Gráfico SVG do fluxo de caixa anual: barras de custo (CAPEX, OPEX,
 * substituições) contra receita, com a linha do acumulado.
 */
export function CashflowChart({ result }: { result: CostResult }) {
  const rows = result.cashflow;

  const { W, H, pad, xFor, yFor, y0, maxAbs, linha } = useMemo(() => {
    const Wv = 900;
    const Hv = 320;
    const padv = { l: 64, r: 16, t: 16, b: 32 };
    const valores = rows.flatMap((r) => [
      r.receita_R,
      -(r.capex_R + r.opex_R + r.substituicao_R),
      r.acumulado_R,
    ]);
    const max = Math.max(1, ...valores.map((v) => Math.abs(v)));
    const innerW = Wv - padv.l - padv.r;
    const innerH = Hv - padv.t - padv.b;
    const step = innerW / rows.length;
    const x = (i: number) => padv.l + i * step;
    const y = (v: number) => padv.t + innerH / 2 - (v / max) * (innerH / 2);
    const pts = rows.map((r, i) => `${x(i) + step / 2},${y(r.acumulado_R)}`).join(" ");
    return { W: Wv, H: Hv, pad: padv, xFor: x, yFor: y, y0: y(0), maxAbs: max, linha: pts };
  }, [rows]);

  const step = (W - pad.l - pad.r) / rows.length;
  const bw = Math.max(2, step * 0.7);

  return (
    <section className="mt-8 rounded-xl border border-border bg-card p-5">
      <h2 className="text-base font-semibold text-foreground">Fluxo de caixa anual</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Barras: custos (abaixo do eixo) e receita (acima). Linha: caixa acumulado. Escala máxima{" "}
        {brl(maxAbs)}.
      </p>
      <div className="mt-4 min-w-0 overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label="Gráfico do fluxo de caixa anual do sistema fotovoltaico"
          className="h-auto w-full min-w-[640px]"
        >
          <title>Fluxo de caixa anual: custos, receita e caixa acumulado</title>
          <line x1={pad.l} y1={y0} x2={W - pad.r} y2={y0} className="stroke-border" strokeWidth={1} />
          {rows.map((r, i) => {
            const custo = r.capex_R + r.opex_R + r.substituicao_R;
            const x = xFor(i) + (step - bw) / 2;
            return (
              <g key={r.ano}>
                {r.receita_R > 0 && (
                  <rect
                    x={x}
                    y={yFor(r.receita_R)}
                    width={bw}
                    height={Math.max(0, y0 - yFor(r.receita_R))}
                    className="fill-accent/70"
                  />
                )}
                {custo > 0 && (
                  <rect
                    x={x}
                    y={y0}
                    width={bw}
                    height={Math.max(0, yFor(-custo) - y0)}
                    className={r.substituicao_R > 0 ? "fill-destructive/70" : "fill-muted-foreground/40"}
                  />
                )}
                {(i === 0 || r.ano % 5 === 0) && (
                  <text
                    x={xFor(i) + step / 2}
                    y={H - 10}
                    textAnchor="middle"
                    className="fill-muted-foreground text-[10px]"
                  >
                    {r.ano}
                  </text>
                )}
              </g>
            );
          })}
          <polyline points={linha} fill="none" strokeWidth={2} className="stroke-primary" />
          <text x={8} y={pad.t + 10} className="fill-muted-foreground text-[10px]">
            {brl(maxAbs)}
          </text>
          <text x={8} y={y0 + 4} className="fill-muted-foreground text-[10px]">
            R$ 0
          </text>
          <text x={8} y={H - pad.b + 4} className="fill-muted-foreground text-[10px]">
            −{brl(maxAbs)}
          </text>
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-sm bg-accent/70" /> receita anual
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-sm bg-muted-foreground/40" /> CAPEX / OPEX
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-sm bg-destructive/70" /> ano com substituição
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-0.5 w-4 bg-primary" /> caixa acumulado
        </span>
      </div>

      <details className="mt-4">
        <summary className="cursor-pointer text-sm font-medium text-foreground">
          Ver tabela do fluxo de caixa
        </summary>
        <div className="mt-3 max-h-80 overflow-auto">
          <table className="w-full min-w-[560px] border-collapse text-xs">
            <thead>
              <tr className="border-b border-border text-left uppercase tracking-wide text-muted-foreground">
                <th scope="col" className="py-1.5 pr-3">Ano</th>
                <th scope="col" className="py-1.5 pr-3 text-right">CAPEX</th>
                <th scope="col" className="py-1.5 pr-3 text-right">OPEX</th>
                <th scope="col" className="py-1.5 pr-3 text-right">Substituição</th>
                <th scope="col" className="py-1.5 pr-3 text-right">Receita</th>
                <th scope="col" className="py-1.5 text-right">Acumulado</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.ano} className="border-b border-border/60">
                  <td className="py-1.5 pr-3 text-foreground">{r.ano}</td>
                  <td className="py-1.5 pr-3 text-right tabular-nums text-muted-foreground">{brl(r.capex_R)}</td>
                  <td className="py-1.5 pr-3 text-right tabular-nums text-muted-foreground">{brl(r.opex_R)}</td>
                  <td className="py-1.5 pr-3 text-right tabular-nums text-muted-foreground">{brl(r.substituicao_R)}</td>
                  <td className="py-1.5 pr-3 text-right tabular-nums text-muted-foreground">{brl(r.receita_R)}</td>
                  <td className="py-1.5 text-right tabular-nums font-medium text-foreground">{brl(r.acumulado_R)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}
