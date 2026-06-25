import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  CalculatorShell, NumberField, ResultPanel, SubmitRow,
  useCalcForm, validatePositive, fmt,
} from "@/components/calc-ui";
import { pageHead } from "@/lib/seo";

const PATH = "/quantas-placas-solares-preciso";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Energia Solar", path: "/energia-solar" },
  { name: "Quantas placas solares preciso", path: PATH },
];

export const Route = createFileRoute("/quantas-placas-solares-preciso")({
  head: () => pageHead({
    title: "Quantas Placas Solares Eu Preciso? Calculadora Gratuita | ObraMétrica",
    description: "Descubra quantas placas solares você precisa a partir do consumo mensal em kWh, com potência estimada e produção mensal.",
    path: PATH,
    breadcrumbs: CRUMBS,
  }),
  component: PlacasSolares,
});

const PANEL_MONTHLY_KWH = 65;
const PANEL_POWER_KW = 0.55;

function PlacasSolares() {
  const [consumption, setConsumption] = useState("");
  const [result, setResult] = useState<{ panels: number; power: number; production: number } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { submitted, onSubmit } = useCalcForm();

  const calculate = () => {
    const c = validatePositive(consumption, "Consumo mensal");
    const next: Record<string, string> = {};
    if (c.error) next.consumption = c.error;
    setErrors(next);
    if (!c.value) return;
    const panels = Math.ceil(c.value / PANEL_MONTHLY_KWH);
    setResult({ panels, power: panels * PANEL_POWER_KW, production: panels * PANEL_MONTHLY_KWH });
  };

  const reset = () => { setConsumption(""); setResult(null); setErrors({}); };

  return (
    <CalculatorShell
      title="Quantas Placas Solares Preciso"
      description="Informe seu consumo mensal de energia elétrica para estimar o número de placas, potência do sistema e produção mensal."
      breadcrumbs={CRUMBS}
    >
      <form onSubmit={(e) => onSubmit(e, calculate)} noValidate>
        <NumberField id="consumption" label="Consumo mensal em kWh" unit="kWh/mês" step="0.1"
          value={consumption} onChange={setConsumption}
          error={submitted ? errors.consumption : undefined} />
        <div className="mt-6"><SubmitRow onReset={reset} /></div>
      </form>

      {result && (
        <ResultPanel
          items={[
            { label: "Quantidade de placas", value: `${result.panels} ${result.panels === 1 ? "placa" : "placas"}`, highlight: true },
            { label: "Potência estimada do sistema", value: `${fmt(result.power, 2)} kW` },
            { label: "Produção mensal estimada", value: `${fmt(result.production, 0)} kWh/mês` },
          ]}
        />
      )}

      <p className="mt-6 text-xs text-muted-foreground">
        Cálculo baseado em placas de {PANEL_MONTHLY_KWH} kWh/mês (aprox. {fmt(PANEL_POWER_KW * 1000, 0)} W por placa).
        Valores podem variar conforme região, orientação e sombreamento.
      </p>
    </CalculatorShell>
  );
}
