import { useMemo, useRef, useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { searchUnits, type CategoryId, type Unit } from "@/lib/conversor/units";

export interface UnitPickerProps {
  id: string;
  label: string;
  category: CategoryId;
  value: string;
  favorites: string[];
  onChange: (unitId: string) => void;
}

/** Seletor de unidade com busca textual por símbolo, nome ou sinônimo. */
export function UnitPicker({ id, label, category, value, favorites, onChange }: UnitPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => searchUnits(query, category), [query, category]);
  const selected: Unit | undefined = useMemo(
    () => searchUnits("", category).find((unit) => unit.id === value),
    [category, value],
  );

  const shortcuts = useMemo(
    () => searchUnits("", category).filter((unit) => favorites.includes(unit.id)).slice(0, 4),
    [category, favorites],
  );

  function pick(unitId: string) {
    onChange(unitId);
    setOpen(false);
    setQuery("");
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onBlur={(event) => {
        if (!containerRef.current?.contains(event.relatedTarget as Node)) setOpen(false);
      }}
    >
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="mt-1 flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-left text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <span>
          <span className="font-semibold">{selected?.symbol ?? "Selecione"}</span>
          {selected && (
            <span className="ml-2 text-muted-foreground">{selected.name}</span>
          )}
        </span>
        <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      </button>

      {shortcuts.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {shortcuts.map((unit) => (
            <button
              key={unit.id}
              type="button"
              onClick={() => pick(unit.id)}
              className="rounded-full border border-border bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
            >
              {unit.symbol}
            </button>
          ))}
        </div>
      )}

      {open && (
        <div className="absolute z-20 mt-1 w-full rounded-md border border-border bg-card shadow-lg">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <input
              autoFocus
              type="text"
              value={query}
              placeholder="Buscar (kg, libra, psi…)"
              aria-label="Buscar unidade"
              onChange={(event) => setQuery(event.target.value)}
              className="w-full bg-transparent text-sm text-foreground outline-none"
            />
          </div>
          <ul role="listbox" className="max-h-60 overflow-y-auto py-1">
            {results.length === 0 && (
              <li className="px-3 py-2 text-sm text-muted-foreground">Nenhuma unidade encontrada.</li>
            )}
            {results.map((unit) => (
              <li key={unit.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={unit.id === value}
                  onClick={() => pick(unit.id)}
                  className={`flex w-full items-baseline gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-muted ${
                    unit.id === value ? "bg-accent/20 font-medium text-foreground" : "text-foreground"
                  }`}
                >
                  <span className="w-16 shrink-0 font-semibold">{unit.symbol}</span>
                  <span className="text-muted-foreground">{unit.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
