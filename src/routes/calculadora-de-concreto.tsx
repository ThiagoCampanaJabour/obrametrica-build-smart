import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  CalculatorShell,
  NumberField,
  SubmitRow,
  ResultPanel,
  useCalcForm,
  validatePositive,
  fmt,
} from "@/components/calc-ui";
import { pageHead } from "@/lib/seo";
import { allSchemasFor } from "@/data/calculators";
import { calcConcreto } from "@/lib/formulas";

const PATH = "/calculadora-de-concreto";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Construção Civil", path: "/construcao-civil" },
  { name: "Calculadora de Concreto", path: PATH },
];

export const Route = createFileRoute("/calculadora-de-concreto")({
  head: () =>
    pageHead({
      title: "Calculadora de Concreto — Volume em m³ | ObraMétrica",
      description:
        "Calcule o volume de concreto em metros cúbicos a partir do comprimento, largura e espessura da peça.",
      path: PATH,
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Calculadora de Concreto",
        url: `https://obrametrica.com.br${PATH}`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      extraSchemas: allSchemasFor(PATH),
    }),
  component: ConcretoCalc,
});

function ConcretoCalc() {
  const [comprimento, setComprimento] = useState("");
  const [largura, setLargura] = useState("");
  const [espessura, setEspessura] = useState("");
  const [result, setResult] = useState<null | { volume: number }>(null);
  const [errors, setErrors] = useState<{
    comprimento?: string;
    largura?: string;
    espessura?: string;
  }>({});
  const { onSubmit } = useCalcForm();

  const submit = () => {
    const c = validatePositive(comprimento, "Comprimento");
    const l = validatePositive(largura, "Largura");
    const e = validatePositive(espessura, "Espessura");
    setErrors({ comprimento: c.error, largura: l.error, espessura: e.error });
    if (c.value && l.value && e.value) setResult(calcConcreto(c.value, l.value, e.value));
    else setResult(null);
  };

  const reset = () => {
    setComprimento("");
    setLargura("");
    setEspessura("");
    setErrors({});
    setResult(null);
  };

  return (
    <CalculatorShell
      extrasId={PATH}
      title="Calculadora de Concreto"
      description="Informe as três dimensões em metros para obter o volume de concreto necessário."
      breadcrumbs={CRUMBS}
    >
      <form onSubmit={(e) => onSubmit(e, submit)} className="space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-3">
          <NumberField
            id="comprimento"
            label="Comprimento"
            unit="m"
            value={comprimento}
            onChange={setComprimento}
            error={errors.comprimento}
          />
          <NumberField
            id="largura"
            label="Largura"
            unit="m"
            value={largura}
            onChange={setLargura}
            error={errors.largura}
          />
          <NumberField
            id="espessura"
            label="Espessura"
            unit="m"
            value={espessura}
            onChange={setEspessura}
            error={errors.espessura}
          />
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
