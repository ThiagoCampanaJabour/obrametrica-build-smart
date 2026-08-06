import { useEffect, useMemo, useState } from "react";
import { ArrowLeftRight, Copy, Check, Eraser } from "lucide-react";
import { UnitPicker } from "./UnitPicker";
import { CATEGORIES, unitsOf, findUnit, type CategoryId } from "@/lib/conversor/units";
import { convert, parseInput, formatOutput, ConversionError } from "@/lib/conversor/calc";

export interface ConverterFormProps {
  decimals: number;
  scientific: boolean;
  favorites: string[];
  /** Registra a conversão bem-sucedida no histórico. */
  onResult: (entry: {
    category: string;
    input: string;
    valueFrom: number;
    fromUnit: string;
    toUnit: string;
    result: number;
  }) => void;
  /** Conversão vinda do histórico para reutilização. */
  restore?: { category: CategoryId; from: string; to: string; input: string } | null;
}

export function ConverterForm({
  decimals,
  scientific,
  favorites,
  onResult,
  restore,
}: ConverterFormProps) {
  const [category, setCategory] = useState<CategoryId>("comprimento");
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("cm");
  const [input, setInput] = useState("1");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!restore) return;
    setCategory(restore.category);
    setFrom(restore.from);
    setTo(restore.to);
    setInput(restore.input);
  }, [restore]);

  function changeCategory(next: CategoryId) {
    const units = unitsOf(next);
    setCategory(next);
    setFrom(units[0]?.id ?? "");
    setTo(units[1]?.id ?? units[0]?.id ?? "");
  }

  const computed = useMemo(() => {
    try {
      const value = parseInput(input);
      return { value, result: convert(value, from, to), error: null as string | null };
    } catch (error) {
      const message =
        error instanceof ConversionError ? error.message : "Não foi possível converter.";
      return { value: null, result: null, error: message };
    }
  }, [input, from, to]);

  const formatted =
    computed.result === null ? "—" : formatOutput(computed.result, { decimals, scientific });

  // Registra no histórico apenas conversões válidas e estáveis (debounce curto).
  useEffect(() => {
    if (computed.result === null || computed.value === null) return;
    const timer = setTimeout(() => {
      onResult({
        category,
        input,
        valueFrom: computed.value as number,
        fromUnit: from,
        toUnit: to,
        result: computed.result as number,
      });
    }, 900);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [computed.result, computed.value, from, to, category]);

  async function copyResult() {
    try {
      await navigator.clipboard.writeText(`${formatted} ${findUnit(to)?.symbol ?? ""}`.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  function swap() {
    setFrom(to);
    setTo(from);
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div>
        <label htmlFor="categoria" className="block text-sm font-medium text-foreground">
          Categoria
        </label>
        <select
          id="categoria"
          value={category}
          onChange={(event) => changeCategory(event.target.value as CategoryId)}
          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring sm:max-w-xs"
        >
          {CATEGORIES.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} — {item.description}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-end">
        <div className="space-y-3">
          <UnitPicker
            id="unidade-origem"
            label="De"
            category={category}
            value={from}
            favorites={favorites}
            onChange={setFrom}
          />
          <div>
            <label htmlFor="valor-entrada" className="block text-sm font-medium text-foreground">
              Valor (aceita 1.2e3 ou 3 * (2 + 1))
            </label>
            <input
              id="valor-entrada"
              type="text"
              inputMode="decimal"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 md:flex-col md:pb-2">
          <button
            type="button"
            onClick={swap}
            aria-label="Inverter unidades"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-foreground transition-colors hover:border-accent"
          >
            <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
            <span className="md:hidden">Inverter</span>
          </button>
          <button
            type="button"
            onClick={() => setInput("")}
            aria-label="Limpar valor"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-foreground transition-colors hover:border-accent"
          >
            <Eraser className="h-4 w-4" aria-hidden="true" />
            <span className="md:hidden">Limpar</span>
          </button>
        </div>

        <div className="space-y-3">
          <UnitPicker
            id="unidade-destino"
            label="Para"
            category={category}
            value={to}
            favorites={favorites}
            onChange={setTo}
          />
          <div>
            <span className="block text-sm font-medium text-foreground">Resultado</span>
            <div className="mt-1 flex items-center gap-3 rounded-md border border-accent/40 bg-accent/10 px-3 py-2">
              <output
                aria-live="polite"
                className="flex-1 truncate text-lg font-semibold text-foreground"
              >
                {formatted} {computed.result !== null ? findUnit(to)?.symbol : ""}
              </output>
              <button
                type="button"
                onClick={copyResult}
                aria-label="Copiar resultado"
                className="rounded-md border border-border bg-background p-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <span aria-live="polite" className="mt-1 block text-xs text-muted-foreground">
              {copied ? "Copiado para a área de transferência." : ""}
            </span>
          </div>
        </div>
      </div>

      {computed.error && (
        <p role="alert" className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-foreground">
          {computed.error}
        </p>
      )}
    </div>
  );
}
