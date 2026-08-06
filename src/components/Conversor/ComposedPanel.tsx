import { useMemo, useState } from "react";
import { combine, formatOutput, parseInput, ConversionError } from "@/lib/conversor/calc";
import { CATEGORIES, unitsOf, findUnit, type CategoryId } from "@/lib/conversor/units";

/**
 * Conversão composta: multiplica ou divide duas grandezas convertidas ao SI.
 * Ex.: 2 m³ × 7850 kg/m³ = 15 700 kg.
 */
export function ComposedPanel({ decimals }: { decimals: number }) {
  const [catA, setCatA] = useState<CategoryId>("volume");
  const [catB, setCatB] = useState<CategoryId>("densidade");
  const [unitA, setUnitA] = useState("m3");
  const [unitB, setUnitB] = useState("kg_m3");
  const [valueA, setValueA] = useState("2");
  const [valueB, setValueB] = useState("7850");
  const [op, setOp] = useState<"multiply" | "divide">("multiply");

  const computed = useMemo(() => {
    try {
      const a = parseInput(valueA);
      const b = parseInput(valueB);
      return { result: combine({ value: a, unitId: unitA }, { value: b, unitId: unitB }, op), error: null as string | null };
    } catch (error) {
      return {
        result: null,
        error: error instanceof ConversionError ? error.message : "Operação inválida.",
      };
    }
  }, [valueA, valueB, unitA, unitB, op]);

  function renderSide(
    key: string,
    cat: CategoryId,
    setCat: (value: CategoryId) => void,
    unit: string,
    setUnit: (value: string) => void,
    value: string,
    setValue: (value: string) => void,
  ) {
    return (
      <div className="space-y-2">
        <select
          aria-label={`Categoria da grandeza ${key}`}
          value={cat}
          onChange={(event) => {
            const next = event.target.value as CategoryId;
            setCat(next);
            setUnit(unitsOf(next)[0]?.id ?? "");
          }}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
        >
          {CATEGORIES.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <input
            aria-label={`Valor da grandeza ${key}`}
            type="text"
            inputMode="decimal"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
          />
          <select
            aria-label={`Unidade da grandeza ${key}`}
            value={unit}
            onChange={(event) => setUnit(event.target.value)}
            className="rounded-md border border-input bg-background px-2 py-2 text-sm text-foreground"
          >
            {unitsOf(cat).map((item) => (
              <option key={item.id} value={item.id}>
                {item.symbol}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  const unitLabel = `${findUnit(unitA)?.symbol ?? ""} ${op === "multiply" ? "×" : "÷"} ${findUnit(unitB)?.symbol ?? ""}`;

  return (
    <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground">Conversão composta</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Combine duas grandezas em unidades SI — por exemplo volume × densidade para obter massa.
      </p>

      <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-start">
        {renderSide("A", catA, setCatA, unitA, setUnitA, valueA, setValueA)}
        <select
          aria-label="Operação"
          value={op}
          onChange={(event) => setOp(event.target.value as "multiply" | "divide")}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground md:mt-0"
        >
          <option value="multiply">×</option>
          <option value="divide">÷</option>
        </select>
        {renderSide("B", catB, setCatB, unitB, setUnitB, valueB, setValueB)}
      </div>

      <div className="mt-4 rounded-md border border-accent/40 bg-accent/10 px-3 py-2">
        <output aria-live="polite" className="text-base font-semibold text-foreground">
          {computed.result === null
            ? computed.error
            : `${formatOutput(computed.result, { decimals })} (unidade SI de ${unitLabel})`}
        </output>
      </div>
    </div>
  );
}
