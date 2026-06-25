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

export const Route = createFileRoute("/energia-solar/placas-solares")({
  head: () => ({
    meta: [
      { title: "Quantas Placas Solares Preciso · ObraMétrica" },
      { name: "description", content: "Calcule a quantidade de placas solares necessárias a partir do consumo mensal em kWh." },
      { property: "og:title", content: "Quantas Placas Solares Preciso · ObraMétrica" },
      { property: "og:description", content: "Dimensionamento de placas solares por consumo mensal." },
    ],
  }),
  component: PlacasSolares,
});

// Cada placa produz 65 kWh/mês conforme especificação.
const PANEL_MONTHLY_KWH = 65;
// Placa fotovoltaica residencial padrão de 550 W (0,55 kW).
const PANEL_POWER_KW = 0.55;

function PlacasSolares() {
  const [consumption, setConsumption] = useState("");
  const [result, setResult] = useState<{
    panels: number;
    power: number;
    production: number;
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { submitted, onSubmit } = useCalcForm();

  const calculate = () => {
    const c = validatePositive(consumption, "Consumo mensal");
    const nextErrors: Record<string, string> = {};
    if (c.error) nextErrors.consumption = c.error;

    setErrors(nextErrors);
    if (!c.value) return;

    const panels = Math.ceil(c.value / PANEL_MONTHLY_KWH);
    const power = panels * PANEL_POWER_KW;
    const production = panels * PANEL_MONTHLY_KWH;

    setResult({ panels, power, production });
  };

  const reset = () => {
    setConsumption("");
    setResult(null);
    setErrors({});
  };

  return (
    <CalculatorShell
      title="Quantas Placas Solares Preciso"
      description="Informe seu consumo mensal de energia elétrica para estimar o número de placas, potência do sistema e produção mensal."
      backTo="/energia-solar"
      backLabel="Voltar para Energia Solar"
    >
      <form onSubmit={(e) => onSubmit(e, calculate)} noValidate>
        <div className="grid gap-6">
          <NumberField
            id="consumption"
            label="Consumo mensal em kWh"
            value={consumption}
            onChange={setConsumption}
            unit="kWh/mês"
            step="0.1"
            min="0"
            error={submitted ? errors.consumption : undefined}
          />
        </div>
        <div className="mt-6">
          <SubmitRow onReset={reset} />
        </div>
      </form>

      {result && (
        <ResultPanel
          items={[
            {
              label: "Quantidade de placas",
              value: `${result.panels} ${result.panels === 1 ? "placa" : "placas"}`,
              highlight: true,
            },
            {
              label: "Potência estimada do sistema",
              value: `${fmt(result.power, 2)} kW`,
            },
            {
              label: "Produção mensal estimada",
              value: `${fmt(result.production, 0)} kWh/mês`,
            },
          ]}
        />
      )}

      <p className="mt-6 text-xs text-muted-foreground">
        Cálculo baseado em placas de {PANEL_MONTHLY_KWH} kWh/mês (aprox. {fmt(PANEL_POWER_KW * 1000, 0)} W por placa). Valores podem variar conforme a região, orientação e sombreamento.
      </p>
    </CalculatorShell>
  );
}
