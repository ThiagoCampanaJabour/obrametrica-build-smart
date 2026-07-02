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
import { calcArgamassa, type ArgamassaTipo } from "@/lib/formulas";


const PATH = "/calculadora-de-argamassa";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Construção Civil", path: "/construcao-civil" },
  { name: "Calculadora de Argamassa", path: PATH },
];

export const Route = createFileRoute("/calculadora-de-argamassa")({
  head: () =>
    pageHead({
      title: "Calculadora de Argamassa — Sacos por m² | ObraMétrica",
      description:
        "Calcule a quantidade de argamassa colante por m² para uso interno (5 kg), externo (6 kg) ou porcelanato (7 kg).",
      path: PATH,
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Calculadora de Argamassa",
        url: `https://obrametrica.com.br${PATH}`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      extraSchemas: allSchemasFor(PATH),
    }),
  component: ArgamassaCalc,
});


function ArgamassaCalc() {
  const [area, setArea] = useState("");
  const [tipo, setTipo] = useState<ArgamassaTipo>("interno");
  const [result, setResult] = useState<null | { total: number; sacos: number }>(null);
  const [errors, setErrors] = useState<{ area?: string }>({});
  const { onSubmit } = useCalcForm();

  const submit = () => {
    const a = validatePositive(area, "Área");
    setErrors({ area: a.error });
    if (a.value) setResult(calcArgamassa(a.value, tipo));
    else setResult(null);
  };

  const reset = () => {
    setArea("");
    setTipo("interno");
    setErrors({});
    setResult(null);
  };

  return (
    <CalculatorShell
      extrasId={PATH}
      title="Calculadora de Argamassa"
      description="Consumo médio: 5 kg/m² (interno), 6 kg/m² (externo), 7 kg/m² (porcelanato). Sacos de 20 kg."
      breadcrumbs={CRUMBS}
    >
      <form onSubmit={(e) => onSubmit(e, submit)} className="space-y-4" noValidate>
        <NumberField
          id="area"
          label="Área a assentar"
          unit="m²"
          value={area}
          onChange={setArea}
          error={errors.area}
        />
        <SelectField<ArgamassaTipo>
          id="tipo"
          label="Tipo de aplicação"
          value={tipo}
          onChange={setTipo}
          options={[
            { value: "interno", label: "Interno (5 kg/m²)" },
            { value: "externo", label: "Externo (6 kg/m²)" },
            { value: "porcelanato", label: "Porcelanato (7 kg/m²)" },
          ]}
        />
        <SubmitRow onReset={reset} />
      </form>

      {result && (
        <ResultPanel
          items={[
            { label: "Quantidade total", value: `${fmt(result.total)} kg` },
            { label: "Sacos de 20 kg", value: `${fmt(result.sacos, 0)} sacos`, highlight: true },
          ]}
        />
      )}
    </CalculatorShell>
  );
}
