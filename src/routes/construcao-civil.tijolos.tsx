import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  CalculatorShell, NumberField, SelectField, SubmitRow, ResultPanel,
  useCalcForm, validatePositive, fmt,
} from "@/components/calc-ui";

export const Route = createFileRoute("/construcao-civil/tijolos")({
  head: () => ({
    meta: [
      { title: "Calculadora de Tijolos · ObraMétrica" },
      { name: "description", content: "Calcule a quantidade de tijolos por m² conforme o tipo (9x19x19, 11x14x24, 14x19x29) com 10% de perda." },
      { property: "og:title", content: "Calculadora de Tijolos · ObraMétrica" },
      { property: "og:description", content: "Quantidade de tijolos por área e tipo." },
    ],
  }),
  component: TijolosCalc,
});

type Tipo = "9x19x19" | "11x14x24" | "14x19x29";
const CONSUMO: Record<Tipo, number> = { "9x19x19": 25, "11x14x24": 22, "14x19x29": 17 };

function TijolosCalc() {
  const [comprimento, setComprimento] = useState("");
  const [altura, setAltura] = useState("");
  const [tipo, setTipo] = useState<Tipo>("9x19x19");
  const [result, setResult] = useState<null | { area: number; qtd: number; qtdPerda: number }>(null);
  const [errors, setErrors] = useState<{ comprimento?: string; altura?: string }>({});
  const { onSubmit } = useCalcForm();

  const submit = () => {
    const c = validatePositive(comprimento, "Comprimento");
    const a = validatePositive(altura, "Altura");
    const errs = { comprimento: c.error, altura: a.error };
    setErrors(errs);
    if (c.value && a.value) {
      const area = c.value * a.value;
      const qtd = area * CONSUMO[tipo];
      setResult({ area, qtd: Math.ceil(qtd), qtdPerda: Math.ceil(qtd * 1.1) });
    } else {
      setResult(null);
    }
  };

  const reset = () => {
    setComprimento(""); setAltura(""); setTipo("9x19x19"); setErrors({}); setResult(null);
  };

  return (
    <CalculatorShell
      title="Calculadora de Tijolos"
      description="Informe a área da parede e o tipo de tijolo para calcular a quantidade necessária."
    >
      <form onSubmit={(e) => onSubmit(e, submit)} className="space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField id="comprimento" label="Comprimento" unit="m"
            value={comprimento} onChange={setComprimento} error={errors.comprimento} />
          <NumberField id="altura" label="Altura" unit="m"
            value={altura} onChange={setAltura} error={errors.altura} />
        </div>
        <SelectField<Tipo>
          id="tipo" label="Tipo de tijolo" value={tipo} onChange={setTipo}
          options={[
            { value: "9x19x19", label: "9×19×19 cm (25 tijolos/m²)" },
            { value: "11x14x24", label: "11×14×24 cm (22 tijolos/m²)" },
            { value: "14x19x29", label: "14×19×29 cm (17 tijolos/m²)" },
          ]}
        />
        <SubmitRow onReset={reset} />
      </form>

      {result && (
        <ResultPanel
          items={[
            { label: "Área da parede", value: `${fmt(result.area)} m²` },
            { label: "Quantidade de tijolos", value: `${fmt(result.qtd, 0)} un` },
            { label: "Com 10% de perda", value: `${fmt(result.qtdPerda, 0)} un`, highlight: true },
          ]}
        />
      )}
    </CalculatorShell>
  );
}
