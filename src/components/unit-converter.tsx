import { useState, type ReactNode } from "react";
import { ArrowRightLeft } from "lucide-react";
import { SiteLayout } from "./site-layout";
import { Breadcrumbs } from "./breadcrumbs";
import { AdTop, AdMiddle, AdBottom } from "./ads";
import { CalcExtras, ResultActions } from "./calc-extras";
import type { Crumb } from "@/lib/seo";

export function UnitConverter({
  title,
  description,
  fromUnit,
  toUnit,
  fromLabel,
  toLabel,
  convert,
  formula,
  breadcrumbs,
  extrasId,
}: {
  title: string;
  description: string;
  fromUnit: string;
  toUnit: string;
  fromLabel: string;
  toLabel: string;
  convert: (value: number) => number;
  formula: ReactNode;
  breadcrumbs: Crumb[];
  /** Path do conversor — carrega conteúdo enriquecido do registro. */
  extrasId?: string;
}) {
  const [value, setValue] = useState("");

  const parsed = value.trim() === "" ? null : Number(value);
  const isValid = parsed !== null && Number.isFinite(parsed) && parsed >= 0;
  const result = isValid ? convert(parsed) : null;

  const fmt = (n: number) =>
    n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 6 });

  const shareText = isValid ? `${value} ${fromUnit} = ${fmt(result!)} ${toUnit}` : "";

  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-muted-foreground">{description}</p>

        <AdTop />

        <div className="mt-2 rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="fromValue" className="block text-sm font-medium text-foreground">
                {fromLabel}
              </label>
              <div className="mt-1 flex rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring">
                <input
                  id="fromValue"
                  type="number"
                  inputMode="decimal"
                  step="any"
                  min="0"
                  placeholder="0"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full bg-transparent px-3 py-2 text-sm outline-none"
                />
                <span className="flex items-center border-l border-input px-3 text-sm text-muted-foreground">
                  {fromUnit}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground">{toLabel}</label>
              <div className="mt-1 flex items-center gap-3 rounded-md border border-accent/40 bg-accent/10 px-3 py-2">
                <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
                <span className="text-lg font-semibold text-foreground">
                  {isValid ? fmt(result!) : "—"}
                </span>
                <span className="text-sm text-muted-foreground">{toUnit}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm font-medium text-foreground">Fórmula</p>
            <p className="mt-1 text-sm text-muted-foreground">{formula}</p>
          </div>

          {isValid && <ResultActions text={shareText} />}
        </div>

        <AdMiddle />
      </section>

      {extrasId && <CalcExtras id={extrasId} />}

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <AdBottom />
      </div>
    </SiteLayout>
  );
}
