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
import { calcTijolos, type TijoloTipo } from "@/lib/formulas";


const PATH = "/calculadora-de-tijolos";
const TITLE = "Calculadora de Tijolos — Quantidade por m² | ObraMétrica";
const DESC =
  "Calcule a quantidade exata de tijolos por m² para tijolos 9×19×19, 11×14×24 e 14×19×29, já com 10% de perda incluído.";

export const Route = createFileRoute("/calculadora-de-tijolos")({
  head: () =>
    pageHead({
      title: TITLE,
      description: DESC,
      path: PATH,
      breadcrumbs: [
        { name: "Início", path: "/" },
        { name: "Construção Civil", path: "/construcao-civil" },
        { name: "Calculadora de Tijolos", path: PATH },
      ],
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Calculadora de Tijolos",
        url: `https://obrametrica.com.br${PATH}`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      extraSchemas: allSchemasFor(PATH),
    }),
  component: TijolosCalc,
});


function TijolosCalc() {
  const [comprimento, setComprimento] = useState("");
  const [altura, setAltura] = useState("");
  const [tipo, setTipo] = useState<TijoloTipo>("9x19x19");
  const [result, setResult] = useState<null | { area: number; qtd: number; qtdPerda: number }>(
    null,
  );
  const [errors, setErrors] = useState<{ comprimento?: string; altura?: string }>({});
  const { onSubmit } = useCalcForm();

  const submit = () => {
    const c = validatePositive(comprimento, "Comprimento");
    const a = validatePositive(altura, "Altura");
    setErrors({ comprimento: c.error, altura: a.error });
    if (c.value && a.value) setResult(calcTijolos(c.value, a.value, tipo));
    else setResult(null);
  };

  const reset = () => {
    setComprimento("");
    setAltura("");
    setTipo("9x19x19");
    setErrors({});
    setResult(null);
  };

  return (
    <CalculatorShell
      extrasId={PATH}
      title="Calculadora de Tijolos"
      description="Informe a área da parede e o tipo de tijolo para calcular a quantidade necessária."
      breadcrumbs={[
        { name: "Início", path: "/" },
        { name: "Construção Civil", path: "/construcao-civil" },
        { name: "Calculadora de Tijolos", path: PATH },
      ]}
    >
      <form onSubmit={(e) => onSubmit(e, submit)} className="space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
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
        </div>
        <SelectField<TijoloTipo>
          id="tipo"
          label="Tipo de tijolo"
          value={tipo}
          onChange={setTipo}
          options={[
            { value: "9x19x19", label: "9×19×19 cm (25 tijolos/m²)" },
            { value: "11x14x24", label: "11×14×24 cm (22 tijolos/m²)" },
            { value: "14x19x29", label: "14×19×29 cm (16 tijolos/m²)" },
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
