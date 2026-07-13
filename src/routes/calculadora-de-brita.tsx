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
import { calcBrita } from "@/lib/formulas";

const PATH = "/calculadora-de-brita";

const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Construção Civil", path: "/construcao-civil" },
  { name: "Calculadora de Brita", path: PATH },
];

// Proporção de brita por traço do concreto
const TRACO_PROPORCOES: Record<string, number> = {
  "1:2:3": 0.5, // 3/(1+2+3) = 50%
  "1:3:3": 0.43, // 3/(1+3+3) = 43%
  "1:4:4": 0.44, // 4/(1+4+4) = 44%
  "1:3:2": 0.4, // 2/(1+3+2) = 40%
};

export const Route = createFileRoute("/calculadora-de-brita")({
  head: () =>
    pageHead({
      title: "Calculadora de Brita — m³ e sacos | ObraMétrica",
      description:
        "Calcule a quantidade de brita necessária para concreto estrutural, magro ou pavimentação. Dosagens técnicas com precisão.",
      path: PATH,
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Calculadora de Brita",
        url: `https://obrametrica.com.br${PATH}`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      extraSchemas: allSchemasFor(PATH),
    }),
  component: BritaCalc,
});

function BritaCalc() {
  const [area, setArea] = useState("");
  const [espessura, setEspessura] = useState("100"); // mm
  const [traco, setTraco] = useState("1:2:3");
  const [desperdicio, setDesperdicio] = useState("10");
  const [densidade, setDensidade] = useState("1500");
  const [volumeConhecido, setVolumeConhecido] = useState("");

  const [result, setResult] = useState<null | {
    volume: number;
    volumeFinal: number;
    sacos: number;
    massa: number;
  }>(null);

  const [errors, setErrors] = useState<{
    area?: string;
    espessura?: string;
    desperdicio?: string;
    densidade?: string;
    volumeConhecido?: string;
  }>({});

  const { onSubmit } = useCalcForm();

  const submit = () => {
    // Se volume conhecido foi preenchido, usar esse
    if (volumeConhecido.trim()) {
      const vol = validatePositive(volumeConhecido, "Volume conhecido");
      const desp = validatePositive(desperdicio, "Desperdício");
      const dens = validatePositive(densidade, "Densidade");

      setErrors({
        volumeConhecido: vol.error,
        desperdicio: desp.error,
        densidade: dens.error,
      });

      if (vol.value && desp.value && dens.value) {
        // Usar volume diretamente
        const proporcao = TRACO_PROPORCOES[traco] || 0.5;
        const volumeBrita = vol.value * proporcao;
        const volumeFinal = volumeBrita * (1 + desp.value / 100);
        const massa = volumeFinal * dens.value;
        const sacos = Math.ceil(volumeFinal / 0.02);

        setResult({ volume: volumeFinal, volumeFinal, sacos, massa });
      } else {
        setResult(null);
      }
    } else {
      // Usar área e espessura
      const a = validatePositive(area, "Área");
      const e = validatePositive(espessura, "Espessura");
      const desp = validatePositive(desperdicio, "Desperdício");
      const dens = validatePositive(densidade, "Densidade");

      setErrors({
        area: a.error,
        espessura: e.error,
        desperdicio: desp.error,
        densidade: dens.error,
      });

      if (a.value && e.value && desp.value && dens.value) {
        // Converter espessura de mm para m
        const espessuraM = e.value / 1000;
        const proporcao = TRACO_PROPORCOES[traco] || 0.5;

        const result = calcBrita(
          a.value,
          espessuraM,
          proporcao,
          desp.value,
          dens.value
        );

        setResult(result);
      } else {
        setResult(null);
      }
    }
  };

  const reset = () => {
    setArea("");
    setEspessura("100");
    setTraco("1:2:3");
    setDesperdicio("10");
    setDensidade("1500");
    setVolumeConhecido("");
    setErrors({});
    setResult(null);
  };

  return (
    <CalculatorShell
      extrasId={PATH}
      title="Calculadora de Brita"
      description="Dosagem técnica de brita para concreto estrutural, magro ou pavimentação. Baseado em normas ABNT."
      breadcrumbs={CRUMBS}
    >
      <form onSubmit={(e) => onSubmit(e, submit)} className="space-y-4" noValidate>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-blue-800">
            <strong>Dica:</strong> Preencha Área + Espessura OU Volume Conhecido (não ambos).
          </p>
        </div>

        <NumberField
          id="area"
          label="Área (m²)"
          unit="m²"
          value={area}
          onChange={setArea}
          error={errors.area}
          placeholder="50"
          disabled={!!volumeConhecido.trim()}
        />

        <NumberField
          id="espessura"
          label="Espessura"
          unit="mm"
          value={espessura}
          onChange={setEspessura}
          error={errors.espessura}
          placeholder="100"
          disabled={!!volumeConhecido.trim()}
        />

        <SelectField
          id="traco"
          label="Traço do concreto"
          value={traco}
          onChange={setTraco}
          options={[
            { value: "1:2:3", label: "1:2:3 (Concreto estrutural)" },
            { value: "1:3:3", label: "1:3:3 (Concreto magro)" },
            { value: "1:4:4", label: "1:4:4 (Pavimentação)" },
            { value: "1:3:2", label: "1:3:2 (Concreto bombeável)" },
          ]}
        />

        <NumberField
          id="desperdicio"
          label="Desperdício"
          unit="%"
          value={desperdicio}
          onChange={setDesperdicio}
          error={errors.desperdicio}
          placeholder="10"
          min="0"
          max="50"
        />

        <NumberField
          id="densidade"
          label="Densidade da brita"
          unit="kg/m³"
          value={densidade}
          onChange={setDensidade}
          error={errors.densidade}
          placeholder="1500"
          min="1000"
          max="2200"
        />

        <div className="border-t pt-4 mt-4">
          <p className="text-sm text-gray-600 mb-3">
            <strong>Ou use volume conhecido:</strong>
          </p>
          <NumberField
            id="volumeConhecido"
            label="Volume de concreto (m³)"
            unit="m³"
            value={volumeConhecido}
            onChange={setVolumeConhecido}
            error={errors.volumeConhecido}
            placeholder="5"
            disabled={!!(area.trim() && espessura.trim())}
          />
        </div>

        <SubmitRow onReset={reset} />
      </form>

      {result && (
        <ResultPanel
          items={[
            { label: "Volume de brita", value: `${fmt(result.volume, 3)} m³` },
            { label: "Massa aproximada", value: `${fmt(result.massa / 1000, 2)} t` },
            { label: "Sacos de 30 kg", value: `${fmt(result.sacos, 0)} sacos`, highlight: true },
          ]}
        />
      )}
    </CalculatorShell>
  );
}
