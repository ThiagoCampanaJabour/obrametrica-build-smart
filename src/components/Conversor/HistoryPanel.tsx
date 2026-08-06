import { Star, Copy, Trash2, RotateCcw, Download, Printer } from "lucide-react";
import { formatOutput, historyToCSV, historyToJSON, type HistoryEntry } from "@/lib/conversor/calc";
import { findUnit } from "@/lib/conversor/units";

export interface HistoryPanelProps {
  entries: HistoryEntry[];
  favorites: string[];
  decimals: number;
  onReuse: (entry: HistoryEntry) => void;
  onToggleFavorite: (unitId: string) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

function download(name: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function HistoryPanel({
  entries,
  favorites,
  decimals,
  onReuse,
  onToggleFavorite,
  onDelete,
  onClear,
}: HistoryPanelProps) {
  return (
    <aside className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Histórico</h2>
        <span className="text-xs text-muted-foreground">{entries.length} itens</span>
      </div>

      {entries.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Suas conversões recentes aparecem aqui e ficam salvas neste navegador.
        </p>
      ) : (
        <ul className="mt-3 max-h-96 space-y-2 overflow-y-auto pr-1">
          {entries.map((entry) => {
            const fromSymbol = findUnit(entry.fromUnit)?.symbol ?? entry.fromUnit;
            const toSymbol = findUnit(entry.toUnit)?.symbol ?? entry.toUnit;
            const text = `${formatOutput(entry.valueFrom, { decimals })} ${fromSymbol} = ${formatOutput(entry.result, { decimals })} ${toSymbol}`;
            return (
              <li
                key={entry.id}
                className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm"
              >
                <p className="text-foreground">{text}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  <button
                    type="button"
                    onClick={() => onReuse(entry)}
                    aria-label="Reutilizar conversão"
                    className="inline-flex items-center gap-1 rounded border border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw className="h-3 w-3" /> Reutilizar
                  </button>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(text)}
                    aria-label="Copiar conversão"
                    className="inline-flex items-center gap-1 rounded border border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <Copy className="h-3 w-3" /> Copiar
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleFavorite(entry.toUnit)}
                    aria-pressed={favorites.includes(entry.toUnit)}
                    aria-label="Favoritar unidade de destino"
                    className={`inline-flex items-center gap-1 rounded border border-border px-2 py-1 text-xs ${
                      favorites.includes(entry.toUnit)
                        ? "bg-accent/20 text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Star className="h-3 w-3" /> {toSymbol}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(entry.id)}
                    aria-label="Excluir do histórico"
                    className="inline-flex items-center gap-1 rounded border border-border px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={entries.length === 0}
          onClick={() => download("conversoes.csv", historyToCSV(entries), "text/csv;charset=utf-8")}
          className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs text-foreground transition-colors hover:border-accent disabled:opacity-50"
        >
          <Download className="h-3.5 w-3.5" /> CSV
        </button>
        <button
          type="button"
          disabled={entries.length === 0}
          onClick={() => download("conversoes.json", historyToJSON(entries), "application/json")}
          className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs text-foreground transition-colors hover:border-accent disabled:opacity-50"
        >
          <Download className="h-3.5 w-3.5" /> JSON
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs text-foreground transition-colors hover:border-accent"
        >
          <Printer className="h-3.5 w-3.5" /> Imprimir
        </button>
        <button
          type="button"
          disabled={entries.length === 0}
          onClick={onClear}
          className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
        >
          <Trash2 className="h-3.5 w-3.5" /> Limpar
        </button>
      </div>
    </aside>
  );
}
