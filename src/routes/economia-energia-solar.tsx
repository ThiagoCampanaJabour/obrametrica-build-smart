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
import { pageHead } from "@/lib/seo";
import { faqSchemaFor } from "@/data/calculators";


const PATH = "/economia-energia-solar";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Energia Solar", path: "/energia-solar" },
  { name: "Economia com Energia Solar", path: PATH },
];

export const Route = createFileRoute("/economia-energia-solar")({
  head: () =>
    pageHead({
      title: "Economia com Energia Solar — Calculadora Mensal, Anual e 10 Anos | ObraMétrica",
      description:
        "Estime quanto você pode economizar instalando energia solar: economia mensal, anual e em 10 anos.",
      path: PATH,
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Calculadora de Economia com Energia Solar",
        url: `https://obrametrica.com.br${PATH}`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      extraSchemas: [faqSchemaFor(PATH)],
    }),
  component: EconomiaSolar,
});


const DEFAULT_SAVINGS_RATE = 0.9;

function EconomiaSolar() {
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
    const next: Record<string, string> = {};
    if (bill.error) next.billValue = bill.error;
    setErrors(next);
    if (!bill.value) return;
    const monthly = bill.value * DEFAULT_SAVINGS_RATE;
    const yearly = monthly * 12;
    setResult({ monthly, yearly, tenYears: yearly * 10 });
  };

  const reset = () => {
    setBillValue("");
    setResult(null);
    setErrors({});
  };
  const currency = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <CalculatorShell
      title="Economia com Energia Solar"
      description="Informe o valor atual da conta de luz para estimar a economia com um sistema de energia solar."
      breadcrumbs={CRUMBS}
    >
      <form onSubmit={(e) => onSubmit(e, calculate)} noValidate>
        <NumberField
          id="billValue"
          label="Valor atual da conta"
          unit="R$"
          value={billValue}
          onChange={setBillValue}
          error={submitted ? errors.billValue : undefined}
        />
        <div className="mt-4 rounded-lg border border-border bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            Economia padrão estimada:{" "}
            <strong className="text-foreground">{fmt(DEFAULT_SAVINGS_RATE * 100, 0)}%</strong>
          </p>
        </div>
        <div className="mt-6">
          <SubmitRow onReset={reset} />
        </div>
      </form>

      {result && (
        <ResultPanel
          items={[
            { label: "Economia mensal", value: currency(result.monthly), highlight: true },
            { label: "Economia anual", value: currency(result.yearly) },
            { label: "Economia em 10 anos", value: currency(result.tenYears) },
          ]}
        />
      )}

      <p className="mt-6 text-xs text-muted-foreground">
        Estimativa considera redução de {fmt(DEFAULT_SAVINGS_RATE * 100, 0)}% na conta de luz. A
        economia real pode variar conforme concessionária, tarifas e perfil de consumo.
      </p>
    </CalculatorShell>
  );
}
