import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  CalculatorShell,
  NumberField,
  ResultPanel,
  SubmitRow,
  useCalcForm,
  validatePositive,
  fmt,
} from "@/components/calc-ui";

export const Route = createFileRoute("/energia-solar/economia-mensal")({
  head: () => ({
    meta: [
      { title: "Economia Mensal · ObraMétrica" },
      { name: "description", content: "Estime a economia mensal, anual e em 10 anos com energia solar." },
      { property: "og:title", content: "Economia Mensal · ObraMétrica" },
      { property: "og:description", content: "Calculadora de economia com energia solar." },
    ],
  }),
  component: EconomiaMensal,
});

const DEFAULT_SAVINGS_RATE = 0.9;

function EconomiaMensal() {
  const [billValue, setBillValue] = useState("");
  const [result, setResult] = useState<{
    monthly: number;
    yearly: number;
    tenYears: number;
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { submitted, onSubmit } = useCalcForm();

  const calculate = () => {
    const bill = validatePositive(billValue, "Valor da conta");
    const nextErrors: Record<string, string> = {};
    if (bill.error) nextErrors.billValue = bill.error;

    setErrors(nextErrors);
    if (!bill.value) return;

    const monthly = bill.value * DEFAULT_SAVINGS_RATE;
    const yearly = monthly * 12;
    const tenYears = yearly * 10;

    setResult({ monthly, yearly, tenYears });
  };

  const reset = () => {
    setBillValue("");
    setResult(null);
    setErrors({});
  };

  const currency = (n: number) =>
    n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <CalculatorShell
      title="Economia Mensal"
      description="Informe o valor atual da conta de luz para estimar a economia com um sistema de energia solar."
      backTo="/energia-solar"
      backLabel="Voltar para Energia Solar"
    >
      <form onSubmit={(e) => onSubmit(e, calculate)} noValidate>
        <div className="grid gap-6">
          <NumberField
            id="billValue"
            label="Valor atual da conta"
            value={billValue}
            onChange={setBillValue}
            unit="R$"
            step="0.01"
            min="0"
            error={submitted ? errors.billValue : undefined}
          />
        </div>

        <div className="mt-4 rounded-lg border border-border bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            Economia padrão estimada: <strong className="text-foreground">{fmt(DEFAULT_SAVINGS_RATE * 100, 0)}%</strong>
          </p>
        </div>

        <div className="mt-6">
          <SubmitRow onReset={reset} />
        </div>
      </form>

      {result && (
        <ResultPanel
          items={[
            {
              label: "Economia mensal",
              value: currency(result.monthly),
              highlight: true,
            },
            {
              label: "Economia anual",
              value: currency(result.yearly),
            },
            {
              label: "Economia em 10 anos",
              value: currency(result.tenYears),
            },
          ]}
        />
      )}

      <p className="mt-6 text-xs text-muted-foreground">
        Estimativa considera redução de {fmt(DEFAULT_SAVINGS_RATE * 100, 0)}% na conta de luz. A economia real pode variar conforme a concessionária, tarifas e perfil de consumo.
      </p>
    </CalculatorShell>
  );
}
