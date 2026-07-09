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
import { calcCimento, type ResistenciaTipo } from "@/lib/formulas";

const PATH = "/calculadora-de-cimento";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Construção Civil", path: "/construcao-civil" },
  { name: "Calculadora de Cimento", path: PATH },
];

export const Route = createFileRoute("/calculadora-de-cimento")({
  head: () =>
    pageHead({
      title: "Calculadora de Cimento — kg por m³ | ObraMétrica",
      description:
        "Calcule a quantidade de cimento necessária para produzir concreto. Dosagens para fck 20, 25, 30 e 35 MPa com precisão técnica.",
      path: PATH,
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Calculadora de Cimento",
        url: `https://obrametrica.com.br${PATH}`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      extraSchemas: allSchemasFor(PATH),
    })
  }),
  component: CimentoCalc,
});

function CimentoCalc() {
  const [volume, setVolume] = useState("");
  const [resistencia, setResistencia] = useState<ResistenciaTipo>("fck25");
  const [result, setResult] = useState<null | { cimento: number; sacos: number }>(null);
  const [errors, setErrors] = useState<{ volume?: string }>({});
  const { onSubmit } = useCalcForm();

  const submit = () => {
    const v = validatePositive(volume, "Volume");
    setErrors({ volume: v.error });
    if (v.value) setResult(calcCimento(v.value, resistencia));
    else setResult(null);
  };

  const reset = () => {
    setVolume("");
    setResistencia("fck25");
    setErrors({});
    setResult(null);
  };

  return (
    <CalculatorShell
      extrasId={PATH}
      title="Calculadora de Cimento"
      description="Dosagem técnica de cimento para concreto. Baseado em NBR 12655 e recomendações ABNT. Sacos de 50 kg."
      breadcrumbs={CRUMBS}
    >
      <form onSubmit={(e) => onSubmit(e, submit)} className="space-y-4" noValidate>
        <NumberField
          id="volume"
          label="Volume de concreto"
          unit="m³"
          value={volume}
          onChange={setVolume}
          error={errors.volume}
        />
        <SelectField<ResistenciaTipo>
          id="resistencia"
          label="Resistência do concreto (fck)"
          value={resistencia}
          onChange={setResistencia}
          options={[
            { value: "fck20", label: "fck 20 MPa (340 kg/m³)" },
            { value: "fck25", label: "fck 25 MPa (360 kg/m³)" },
            { value: "fck30", label: "fck 30 MPa (380 kg/m³)" },
            { value: "fck35", label: "fck 35 MPa (400 kg/m³)" },
          ]}
        />
        <SubmitRow onReset={reset} />
      </form>

      {result && (
        <ResultPanel
          items={[
            { label: "Cimento necessário", value: `${fmt(result.cimento)} kg` },
            { label: "Sacos de 50 kg", value: `${fmt(result.sacos, 0)} sacos`, highlight: true },
          ]}
        />
      )}
    </CalculatorShell>
  );
}
