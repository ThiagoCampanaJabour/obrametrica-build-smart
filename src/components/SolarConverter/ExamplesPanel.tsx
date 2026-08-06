import { EXAMPLE_PRESETS, type ExamplePreset } from "@/lib/solar/kwkwh-presets";

export interface ExamplesPanelProps {
  onLoad: (example: ExamplePreset) => void;
}

export function ExamplesPanel({ onLoad }: ExamplesPanelProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground">Exemplos prontos</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Clique para carregar as premissas no formulário e conferir o cálculo.
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {EXAMPLE_PRESETS.map((ex) => (
          <li key={ex.id}>
            <button
              type="button"
              onClick={() => onLoad(ex)}
              className="h-full w-full rounded-lg border border-border bg-muted/40 p-4 text-left transition-colors hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="block text-sm font-medium text-foreground">{ex.titulo}</span>
              <span className="mt-1 block text-xs text-muted-foreground">{ex.descricao}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
