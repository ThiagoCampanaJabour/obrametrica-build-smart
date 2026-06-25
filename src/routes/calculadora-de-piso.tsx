import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  CalculatorShell, NumberField, SubmitRow, ResultPanel,
  useCalcForm, validatePositive, fmt,
} from "@/components/calc-ui";
import { pageHead } from "@/lib/seo";

const PATH = "/calculadora-de-piso";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Construção Civil", path: "/construcao-civil" },
  { name: "Calculadora de Piso", path: PATH },
];

export const Route = createFileRoute("/calculadora-de-piso")({
  head: () => pageHead({
    title: "Calculadora de Piso — Caixas e Área com 10% de Sobra | ObraMétrica",
    description: "Calcule a área total do ambiente e a quantidade de caixas de piso necessárias, já com 10% de sobra.",
    path: PATH,
    breadcrumbs: CRUMBS,
  }),
  component: PisoCalc,
});

function PisoCalc() {
  const [comprimento, setComprimento] = useState("");
  const [largura, setLargura] = useState("");
  const [m2Caixa, setM2Caixa] = useState("");
  const [result, setResult] = useState<null | { area: number; areaSobra: number; caixas: number }>(null);
  const [errors, setErrors] = useState<{ comprimento?: string; largura?: string; m2Caixa?: string }>({});
  const { onSubmit } = useCalcForm();

  const submit = () => {
    const c = validatePositive(comprimento, "Comprimento");
    const l = validatePositive(largura, "Largura");
    const m = validatePositive(m2Caixa, "m² por caixa");
    setErrors({ comprimento: c.error, largura: l.error, m2Caixa: m.error });
    if (c.value && l.value && m.value) {
      const area = c.value * l.value;
      const areaSobra = area * 1.1;
      setResult({ area, areaSobra, caixas: Math.ceil(areaSobra / m.value) });
    } else setResult(null);
  };

  const reset = () => {
    setComprimento(""); setLargura(""); setM2Caixa(""); setErrors({}); setResult(null);
  };

  return (
    <CalculatorShell
      title="Calculadora de Piso"
      description="Informe as dimensões do ambiente e a metragem de cada caixa de piso."
      breadcrumbs={CRUMBS}
    >
      <form onSubmit={(e) => onSubmit(e, submit)} className="space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-3">
          <NumberField id="comprimento" label="Comprimento" unit="m"
            value={comprimento} onChange={setComprimento} error={errors.comprimento} />
          <NumberField id="largura" label="Largura" unit="m"
            value={largura} onChange={setLargura} error={errors.largura} />
          <NumberField id="m2Caixa" label="m² por caixa" unit="m²/cx"
            value={m2Caixa} onChange={setM2Caixa} error={errors.m2Caixa} />
        </div>
        <SubmitRow onReset={reset} />
      </form>

      {result && (
        <ResultPanel
          items={[
            { label: "Área total", value: `${fmt(result.area)} m²` },
            { label: "Com 10% de sobra", value: `${fmt(result.areaSobra)} m²` },
            { label: "Quantidade de caixas", value: `${fmt(result.caixas, 0)} cx`, highlight: true },
          ]}
        />
      )}
    </CalculatorShell>
  );
}
