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

const PATH = "/calculadora-de-tinta";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Construção Civil", path: "/construcao-civil" },
  { name: "Calculadora de Tinta", path: PATH },
];

export const Route = createFileRoute("/calculadora-de-tinta")({
  head: () =>
    pageHead({
      title: "Calculadora de Tinta — Litros por m² e Demão | ObraMétrica",
      description:
        "Calcule quantos litros de tinta você precisa considerando rendimento de 1 L para cada 5 m² por demão.",
      path: PATH,
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Calculadora de Tinta",
        url: `https://obrametrica.com.br${PATH}`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
    }),
  component: TintaCalc,
});

const RENDIMENTO_M2_POR_LITRO = 5;

function TintaCalc() {
  const [comprimento, setComprimento] = useState("");
  const [altura, setAltura] = useState("");
  const [demaos, setDemaos] = useState("2");
  const [result, setResult] = useState<null | { area: number; litros: number; litrosRec: number }>(
    null,
  );
  const [errors, setErrors] = useState<{ comprimento?: string; altura?: string; demaos?: string }>(
    {},
  );
  const { onSubmit } = useCalcForm();

  const submit = () => {
    const c = validatePositive(comprimento, "Comprimento");
    const a = validatePositive(altura, "Altura");
    const d = validatePositive(demaos, "Demãos");
    setErrors({ comprimento: c.error, altura: a.error, demaos: d.error });
    if (c.value && a.value && d.value) {
      const area = c.value * a.value;
      const litros = (area * d.value) / RENDIMENTO_M2_POR_LITRO;
      setResult({ area, litros, litrosRec: Math.ceil(litros * 1.1) });
    } else setResult(null);
  };

  const reset = () => {
    setComprimento("");
    setAltura("");
    setDemaos("2");
    setErrors({});
    setResult(null);
  };

  return (
    <CalculatorShell
      title="Calculadora de Tinta"
      description="Considera rendimento médio de 1 litro para cada 5 m² por demão."
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
            id="altura"
            label="Altura"
            unit="m"
            value={altura}
            onChange={setAltura}
            error={errors.altura}
          />
          <NumberField
            id="demaos"
            label="Demãos"
            step="1"
            value={demaos}
            onChange={setDemaos}
            error={errors.demaos}
          />
        </div>
        <SubmitRow onReset={reset} />
      </form>

      {result && (
        <ResultPanel
          items={[
            { label: "Área a pintar", value: `${fmt(result.area)} m²` },
            { label: "Litros necessários", value: `${fmt(result.litros)} L` },
            {
              label: "Litros recomendados (+10%)",
              value: `${fmt(result.litrosRec, 0)} L`,
              highlight: true,
            },
          ]}
        />
      )}
    </CalculatorShell>
  );
}
