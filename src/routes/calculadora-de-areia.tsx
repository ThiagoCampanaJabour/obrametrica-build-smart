import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  CalculatorShell,
  NumberField,
  SelectField,
  SubmitRow,
  ResultPanel,
  useCalcForm,
  validatePositive,
  fmt,
} from "@/components/calc-ui";
import { pageHead } from "@/lib/seo";
import { allSchemasFor } from "@/data/calculators";
import { calcAreia } from "@/lib/formulas";

const PATH = "/calculadora-de-areia";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Construção Civil", path: "/construcao-civil" },
  { name: "Calculadora de Areia", path: PATH },
];

export const Route = createFileRoute("/calculadora-de-areia")({
  head: () =>
    pageHead({
      title: "Calculadora de Areia — m³ e sacos | ObraMétrica",
      description:
        "Calcule a quantidade de areia necessária para assentamento, reboco, concreto e nivelamento. Dosagens técnicas com precisão.",
      path: PATH,
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Calculadora de Areia",
        url: `https://obrametrica.com.br${PATH}`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      extraSchemas: allSchemasFor(PATH),
    }),
  component: AreiaCalc,
});

function AreiaCalc() {
  const [area, setArea] = useState("");
  const [espessura, setEspessura] = useState("10");
  const [traco, setTraco] = useState("1:3");
  const [desperdicio, setDesperdicio] = useState("10");
  const [result, setResult] = useState<null | { volume: number; massa: number; sacos: number }>(null);
  const [errors, setErrors] = useState<{ area?: string; espessura?: string }>({});

  const { onSubmit } = useCalcForm();

  const proporcaoTraco: Record<string, number> = {
    "1:3": 0.75,
    "1:4": 0.8,
    "1:2:3": 0.333,
    "1:3:3": 0.428,
  };

  const submit = () => {
    const a = validatePositive(area, "Área");
    const e = validatePositive(espessura, "Espessura");
    const d = validatePositive(desperdicio, "Desperdício");

    setErrors({
      area: a.error,
      espessura: e.error,
    });

    if (a.value && e.value && d.value !== undefined) {
      const proporcao = proporcaoTraco[traco] || 0.75;
      setResult(calcAreia(a.value, e.value, proporcao, d.value));
    } else {
      setResult(null);
    }
  };

  const reset = () => {
    setArea("");
    setEspessura("10");
    setTraco("1:3");
    setDesperdicio("10");
    setErrors({});
    setResult(null);
  };

  return (
    <CalculatorShell
      extrasId={PATH}
      title="Calculadora de Areia"
      description="Dosagem técnica de areia para assentamento, reboco, concreto e nivelamento. Baseado em normas ABNT."
      breadcrumbs={CRUMBS}
    >
      <form onSubmit={(e) => onSubmit(e, submit)} className="space-y-4" noValidate>
        <NumberField
          id="area"
          label="Área"
          unit="m²"
          value={area}
          onChange={setArea}
          error={errors.area}
          placeholder="50"
        />
        <NumberField
          id="espessura"
          label="Espessura"
          unit="mm"
          value={espessura}
          onChange={setEspessura}
          error={errors.espessura}
          step="1"
        />
        <SelectField
          id="traco"
          label="Traço / Proporção"
          value={traco}
          onChange={(e) => setTraco(e.target.value)}
          options={[
            { value: "1:3", label: "Argamassa 1:3 (simples)" },
            { value: "1:4", label: "Argamassa 1:4 (fraca)" },
            { value: "1:2:3", label: "Concreto 1:2:3" },
            { value: "1:3:3", label: "Concreto 1:3:3" },
          ]}
        />
        <NumberField
          id="desperdicio"
          label="Desperdício"
          unit="%"
          value={desperdicio}
          onChange={setDesperdicio}
          step="1"
          min="0"
          max="50"
        />
        <SubmitRow onReset={reset} />
      </form>

      {result && (
        <ResultPanel
          items={[
            { label: "Volume de areia", value: `${fmt(result.volume, 3)} m³` },
            { label: "Massa aproximada", value: `${fmt(result.massa, 0)} kg` },
            { label: "Sacos estimados", value: `${fmt(result.sacos, 0)} sacos`, highlight: true },
          ]}
        />
      )}
    </CalculatorShell>
  );
}
