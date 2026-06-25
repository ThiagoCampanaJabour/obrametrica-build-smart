import { useState, type FormEvent, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export function CalculatorShell({
  title,
  description,
  children,
  backTo = "/construcao-civil",
  backLabel = "Voltar para Construção Civil",
}: {
  title: string;
  description: string;
  children: ReactNode;
  backTo?: string;
  backLabel?: string;
}) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        to={backTo}
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> {backLabel}
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h1>
      <p className="mt-2 text-muted-foreground">{description}</p>
      <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">{children}</div>
    </section>
  );
}

export function NumberField({
  id,
  label,
  value,
  onChange,
  unit,
  step = "0.01",
  min = "0",
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  unit?: string;
  step?: string;
  min?: string;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="mt-1 flex rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring">
        <input
          id={id}
          name={id}
          type="number"
          inputMode="decimal"
          step={step}
          min={min}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="w-full bg-transparent px-3 py-2 text-sm outline-none"
        />
        {unit && (
          <span className="flex items-center border-l border-input px-3 text-sm text-muted-foreground">
            {unit}
          </span>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export function SelectField<T extends string>({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: ReadonlyArray<{ value: T; label: string }>;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function SubmitRow({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-wrap gap-3 pt-2">
      <button
        type="submit"
        className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Calcular
      </button>
      <button
        type="button"
        onClick={onReset}
        className="rounded-md border border-input bg-background px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
      >
        Limpar
      </button>
    </div>
  );
}

export function ResultPanel({
  items,
}: {
  items: ReadonlyArray<{ label: string; value: string; highlight?: boolean }>;
}) {
  return (
    <div className="mt-6 rounded-lg border border-accent/40 bg-accent/10 p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Resultado</h2>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((it) => (
          <div
            key={it.label}
            className={`rounded-md bg-background p-3 ${
              it.highlight ? "ring-2 ring-accent" : "border border-border"
            }`}
          >
            <dt className="text-xs font-medium text-muted-foreground">{it.label}</dt>
            <dd className="mt-1 text-lg font-semibold text-foreground">{it.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/**
 * Validates a numeric string. Empty, non-numeric, negative, or zero values are rejected.
 */
export function validatePositive(raw: string, label: string): { value?: number; error?: string } {
  if (raw.trim() === "") return { error: `${label} é obrigatório.` };
  const n = Number(raw);
  if (!Number.isFinite(n)) return { error: `${label} deve ser um número válido.` };
  if (n < 0) return { error: `${label} não pode ser negativo.` };
  if (n === 0) return { error: `${label} deve ser maior que zero.` };
  return { value: n };
}

export function useCalcForm() {
  const [submitted, setSubmitted] = useState(false);
  const onSubmit = (e: FormEvent, fn: () => void) => {
    e.preventDefault();
    setSubmitted(true);
    fn();
  };
  return { submitted, setSubmitted, onSubmit };
}

export const fmt = (n: number, digits = 2) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: digits, maximumFractionDigits: digits });
