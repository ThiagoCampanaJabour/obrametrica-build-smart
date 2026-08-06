import { useMemo } from "react";
import type { QuantResult } from "@/lib/telhas/calc";

/**
 * Preview simplificado do assentamento: grid de peças inteiras (miolo)
 * versus peças de borda (recortes). Puramente ilustrativo.
 */
export function LayoutPreview({ result }: { result: QuantResult }) {
  const { cols, rows, offset } = useMemo(() => {
    const c = Math.min(Math.max(result.colunas ?? 10, 3), 14);
    const r = Math.min(Math.max(result.fileiras ?? 8, 3), 12);
    const off =
      result.inputs.layout === "desloc50"
        ? 0.5
        : result.inputs.layout === "desloc33"
          ? 1 / 3
          : 0;
    return { cols: c, rows: r, offset: off };
  }, [result]);

  return (
    <div className="mt-6 rounded-xl border border-border bg-card p-5">
      <h3 className="text-base font-semibold text-foreground">Preview do assentamento</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Ilustração esquemática: peças inteiras no miolo e recortes nas bordas (destacados).
      </p>
      <div
        role="img"
        aria-label={`Esquema de assentamento com ${cols} colunas e ${rows} fileiras, bordas recortadas`}
        className="mt-4 space-y-1 overflow-hidden rounded-md border border-border p-2"
      >
        {Array.from({ length: rows }).map((_, r) => (
          <div
            key={r}
            className="flex gap-1"
            style={{ marginLeft: `${((r * offset) % 1) * (100 / cols)}%` }}
          >
            {Array.from({ length: cols }).map((_, c) => {
              const borda = r === 0 || r === rows - 1 || c === 0 || c === cols - 1;
              return (
                <div
                  key={c}
                  className={
                    borda
                      ? "h-5 flex-1 rounded-sm bg-accent/60"
                      : "h-5 flex-1 rounded-sm bg-muted"
                  }
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-sm bg-muted" /> peça inteira
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-sm bg-accent/60" /> peça cortada (borda)
        </span>
      </div>
    </div>
  );
}
