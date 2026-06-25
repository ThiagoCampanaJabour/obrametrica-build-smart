import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  CalculatorShell, NumberField, SubmitRow, ResultPanel,
  useCalcForm, validatePositive, fmt,
} from "@/components/calc-ui";

export const Route = createFileRoute("/construcao-civil/concreto")({
  head: () => ({
    meta: [
      { title: "Calculadora de Concreto · ObraMétrica" },
      { name: "description", content: "Calcule o volume de concreto em metros cúbicos a partir das dimensões da peça." },
      { property: "og:title", content: "Calculadora de Concreto · ObraMétrica" },
      { property: "og:description", content: "Volume de concreto em m³." },
    ],
  }),
  component: ConcretoCalc,
});

function ConcretoCalc() {
  const [comprimento, setComprimento] = useState("");
  const [largura, setLargura] = useState("");
  const [espessura, setEspessura] = useState("");
  const [result, setResult] = useState<null | { volume: number }>(null);
  const [errors, setErrors] = useState<{ comprimento?: string; largura?: string; espessura?: string }>({});
  const { onSubmit } = useCalcForm();

  const submit = () => {
    const c = validatePositive(comprimento, "Comprimento");
    const l = validatePositive(largura, "Largura");
    const e = validatePositive(espessura, "Espessura");
    setErrors({ comprimento: c.error, largura: l.error, espessura: e.error });
    if (c.value && l.value && e.value) {
      setResult({ volume: c.value * l.value * e.value });
    } else {
      setResult(null);
    }
  };

  const reset = () => {
    setComprimento(""); setLargura(""); setEspessura(""); setErrors({}); setResult(null);
  };

  return (
    <CalculatorShell
      title="Calculadora de Concreto"
      description="Informe as três dimensões em metros para obter o volume de concreto necessário."
    >
      <form onSubmit={(e) => onSubmit(e, submit)} className="space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-3">
          <NumberField id="comprimento" label="Comprimento" unit="m"
            value={comprimento} onChange={setComprimento} error={errors.comprimento} />
          <NumberField id="largura" label="Largura" unit="m"
            value={largura} onChange={setLargura} error={errors.largura} />
          <NumberField id="espessura" label="Espessura" unit="m"
            value={espessura} onChange={setEspessura} error={errors.espessura} />
        </div>
        <SubmitRow onReset={reset} />
      </form>

      {result && (
        <ResultPanel
          items={[
            { label: "Volume de concreto", value: `${fmt(result.volume, 3)} m³`, highlight: true },
          ]}
        />
      )}
    </CalculatorShell>
  );
}
