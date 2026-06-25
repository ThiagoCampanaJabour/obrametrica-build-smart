import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  CalculatorShell, NumberField, SelectField, SubmitRow, ResultPanel,
  useCalcForm, validatePositive, fmt,
} from "@/components/calc-ui";

export const Route = createFileRoute("/construcao-civil/argamassa")({
  head: () => ({
    meta: [
      { title: "Calculadora de Argamassa · ObraMétrica" },
      { name: "description", content: "Calcule a quantidade de argamassa colante por m² para uso interno, externo ou porcelanato." },
      { property: "og:title", content: "Calculadora de Argamassa · ObraMétrica" },
      { property: "og:description", content: "Sacos de argamassa por aplicação." },
    ],
  }),
  component: ArgamassaCalc,
});

type Tipo = "interno" | "externo" | "porcelanato";
const CONSUMO_KG_M2: Record<Tipo, number> = { interno: 5, externo: 6, porcelanato: 7 };
const SACO_KG = 20;

function ArgamassaCalc() {
  const [area, setArea] = useState("");
  const [tipo, setTipo] = useState<Tipo>("interno");
  const [result, setResult] = useState<null | { total: number; sacos: number }>(null);
  const [errors, setErrors] = useState<{ area?: string }>({});
  const { onSubmit } = useCalcForm();

  const submit = () => {
    const a = validatePositive(area, "Área");
    setErrors({ area: a.error });
    if (a.value) {
      const total = a.value * CONSUMO_KG_M2[tipo];
      setResult({ total, sacos: Math.ceil(total / SACO_KG) });
    } else {
      setResult(null);
    }
  };

  const reset = () => {
    setArea(""); setTipo("interno"); setErrors({}); setResult(null);
  };

  return (
    <CalculatorShell
      title="Calculadora de Argamassa"
      description="Consumo médio: 5 kg/m² (interno), 6 kg/m² (externo), 7 kg/m² (porcelanato). Sacos de 20 kg."
    >
      <form onSubmit={(e) => onSubmit(e, submit)} className="space-y-4" noValidate>
        <NumberField id="area" label="Área a assentar" unit="m²"
          value={area} onChange={setArea} error={errors.area} />
        <SelectField<Tipo>
          id="tipo" label="Tipo de aplicação" value={tipo} onChange={setTipo}
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
