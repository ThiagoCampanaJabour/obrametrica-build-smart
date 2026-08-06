import type { TrechoResult } from "@/lib/andaimes/calc";

/** Representação 2D simplificada da fachada: níveis × módulos. */
export function LayoutPreview({ trecho }: { trecho: TrechoResult }) {
  const cols = Math.min(trecho.modulosPorNivel, 20);
  const rows = Math.min(trecho.niveis, 15);

  return (
    <div className="mt-4 rounded-lg border border-border bg-background p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Preview do arranjo — {trecho.niveis} níveis × {trecho.modulosPorNivel} módulos
      </p>
      <div
        role="img"
        aria-label={`Fachada ${trecho.input.nome} com ${trecho.niveis} níveis e ${trecho.modulosPorNivel} módulos por nível`}
        className="mt-3 grid gap-1"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: rows * cols }).map((_, i) => (
          <div
            key={i}
            className="aspect-[4/3] rounded-sm border border-accent/50 bg-accent/20"
          />
        ))}
      </div>
      {(trecho.modulosPorNivel > cols || trecho.niveis > rows) && (
        <p className="mt-2 text-xs text-muted-foreground">
          Visualização limitada a {rows} níveis × {cols} módulos por questão de legibilidade.
        </p>
      )}
    </div>
  );
}
