import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  CalculatorShell,
  NumberField,
  SelectField,
  SubmitRow,
  ResultPanel,
  fmt,
} from "@/components/calc-ui";
import { pageHead } from "@/lib/seo";
import { allSchemasFor } from "@/data/calculators";
import {
  calcTubos,
  MaterialTubo,
  converterPolegadaParaMm,
} from "@/lib/formulas";

const PATH = "/calculadora-de-tubos";

const BREADCRUMBS = [
  { label: "Início", href: "/" },
  { label: "Construção Civil", href: "/construcao-civil" },
  { label: "Calculadora de Tubos", href: PATH },
];

// Presets de diâmetros nominais para seleção
const DIAMETROS_NOMINAIS_PRESETS = [
  { value: "DN 20 (1/2\") PVC", label: "DN 20 (1/2\") PVC" },
  { value: "DN 25 (3/4\") PVC", label: "DN 25 (3/4\") PVC" },
  { value: "DN 32 (1\") PVC", label: "DN 32 (1\") PVC" },
  { value: "DN 40 (1 1/4\") PVC", label: "DN 40 (1 1/4\") PVC" },
  { value: "DN 50 (1 1/2\") PVC", label: "DN 50 (1 1/2\") PVC" },
  { value: "DN 60 (2\") PVC", label: "DN 60 (2\") PVC" },
  { value: "DN 75 (2 1/2\") PVC", label: "DN 75 (2 1/2\") PVC" },
  { value: "DN 85 (3\") PVC", label: "DN 85 (3\") PVC" },
  { value: "DN 100 (4\") PVC", label: "DN 100 (4\") PVC" },

  { value: "DN 15 (1/2\") Aço", label: "DN 15 (1/2\") Aço" },
  { value: "DN 20 (3/4\") Aço", label: "DN 20 (3/4\") Aço" },
  { value: "DN 25 (1\") Aço", label: "DN 25 (1\") Aço" },
  { value: "DN 32 (1 1/4\") Aço", label: "DN 32 (1 1/4\") Aço" },
  { value: "DN 40 (1 1/2\") Aço", label: "DN 40 (1 1/2\") Aço" },
  { value: "DN 50 (2\") Aço", label: "DN 50 (2\") Aço" },
  { value: "DN 65 (2 1/2\") Aço", label: "DN 65 (2 1/2\") Aço" },
  { value: "DN 80 (3\") Aço", label: "DN 80 (3\") Aço" },
  { value: "DN 100 (4\") Aço", label: "DN 100 (4\") Aço" },

  { value: "DN 15 (1/2\") Cobre", label: "DN 15 (1/2\") Cobre" },
  { value: "DN 22 (3/4\") Cobre", label: "DN 22 (3/4\") Cobre" },
  { value: "DN 28 (1\") Cobre", label: "DN 28 (1\") Cobre" },
  { value: "DN 35 (1 1/4\") Cobre", label: "DN 35 (1 1/4\") Cobre" },
  { value: "DN 42 (1 1/2\") Cobre", label: "DN 42 (1 1/2\") Cobre" },

  { value: "custom", label: "Personalizado (informar DE e Espessura)" },
];

export const Route = createFileRoute("/calculadora-de-tubos")({
  head: () =>
    pageHead({
      title: "Calculadora de Tubos — PVC, Aço, Cobre | ObraMétrica",
      description:
        "Estime comprimentos, massas e quantidades de tubos (PVC, aço, cobre) para água, esgoto, gás, elétrica ou estrutura.",
      path: PATH,
      breadcrumbs: BREADCRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Calculadora de Tubos",
        url: `https://obrametrica.com.br${PATH}`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      extraSchemas: allSchemasFor(PATH),
    }),
  component: TubosCalculator,
});

function TubosCalculator() {
  const [material, setMaterial] = useState<MaterialTubo>("PVC");
  const [diametroNominal, setDiametroNominal] = useState("DN 25 (3/4\") PVC");
  const [diametroExternoMM, setDiametroExternoMM] = useState("");
  const [espessuraParedeMM, setEspessuraParedeMM] = useState("");
  const [comprimentoPecaM, setComprimentoPecaM] = useState("6");
  const [comprimentoTotalDesejadoM, setComprimentoTotalDesejadoM] = useState("100");
  const [quantidadePecasDesejada, setQuantidadePecasDesejada] = useState("");
  const [perdaPct, setPerdaPct] = useState("5");

  // Preços unitários (opcionais)
  const [precoPorMetro, setPrecoPorMetro] = useState("");
  const [precoPorPeca, setPrecoPorPeca] = useState("");

  const [result, setResult] = useState<null | {
    diametroExternoMM: number;
    diametroInternoMM: number;
    areaSecaoInternaM2: number;
    massaPorMetroKg: number;
    comprimentoTotalCalculadoM: number;
    numeroPecasRecomendado: number;
    massaTotalKg: number;
    custoEstimado: number;
  }>(null);

  const [errors, setErrors] = useState<{
    material?: string;
    diametroNominal?: string;
    diametroExternoMM?: string;
    espessuraParedeMM?: string;
    comprimentoPecaM?: string;
    comprimentoTotalDesejadoM?: string;
    quantidadePecasDesejada?: string;
    perdaPct?: string;
    precoPorMetro?: string;
    precoPorPeca?: string;
    submit?: string;
  }>({});

  const validatePositive = (value: string, fieldName: string, min = 0.01, max = 100000) => {
    const num = parseFloat(value);
    if (isNaN(num) || num < min || num > max) {
      return `${fieldName} deve ser um número entre ${min} e ${max}.`;
    }
    return undefined;
  };

  const validatePercentage = (value: string, fieldName: string, min = 0, max = 100) => {
    const num = parseFloat(value);
    if (isNaN(num) || num < min || num > max) {
      return `${fieldName} deve ser um número entre ${min} e ${max}%.`;
    }
    return undefined;
  };

  // Efeito para ajustar o diâmetro nominal padrão ao mudar o material
  useEffect(() => {
    if (material === "PVC") {
      setDiametroNominal("DN 25 (3/4\") PVC");
      setComprimentoPecaM("6");
    } else if (material === "Aço") {
      setDiametroNominal("DN 25 (1\") Aço");
      setComprimentoPecaM("6");
    } else if (material === "Cobre") {
      setDiametroNominal("DN 22 (3/4\") Cobre");
      setComprimentoPecaM("3");
    }
    setDiametroExternoMM("");
    setEspessuraParedeMM("");
  }, [material]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    let currentResult = null;

    try {
      newErrors.comprimentoPecaM = validatePositive(comprimentoPecaM, "Comprimento por peça", 0.1, 100);
      newErrors.perdaPct = validatePercentage(perdaPct, "Perda", 0, 20);

      if (diametroNominal === 'custom') {
        newErrors.diametroExternoMM = validatePositive(diametroExternoMM, "Diâmetro Externo", 1, 500);
        newErrors.espessuraParedeMM = validatePositive(espessuraParedeMM, "Espessura da Parede", 0.5, 50);
      }

      // Validação de comprimento total ou quantidade de peças
      const hasComprimentoTotal = comprimentoTotalDesejadoM.trim() !== "";
      const hasQuantidadePecas = quantidadePecasDesejada.trim() !== "";

      if (!hasComprimentoTotal && !hasQuantidadePecas) {
        newErrors.submit = "Informe o Comprimento Total Desejado OU a Quantidade de Peças Desejada.";
      } else if (hasComprimentoTotal && hasQuantidadePecas) {
        newErrors.submit = "Informe APENAS o Comprimento Total Desejado OU a Quantidade de Peças Desejada (não ambos).";
      } else if (hasComprimentoTotal) {
        newErrors.comprimentoTotalDesejadoM = validatePositive(comprimentoTotalDesejadoM, "Comprimento Total Desejado", 0.1, 100000);
      } else if (hasQuantidadePecas) {
        newErrors.quantidadePecasDesejada = validatePositive(quantidadePecasDesejada, "Quantidade de Peças Desejada", 1, 10000);
      }

      // Validação de preços (opcionais, mas se preenchidos, devem ser válidos)
      if (precoPorMetro.trim()) newErrors.precoPorMetro = validatePositive(precoPorMetro, "Preço por Metro", 0);
      if (precoPorPeca.trim()) newErrors.precoPorPeca = validatePositive(precoPorPeca, "Preço por Peça", 0);

      if (Object.values(newErrors).some(e => e !== undefined)) {
        setErrors(newErrors);
        setResult(null);
        return;
      }

      const params = {
        material: material,
        diametroNominal: diametroNominal,
        diametroExternoMM: parseFloat(diametroExternoMM) || undefined,
        espessuraParedeMM: parseFloat(espessuraParedeMM) || undefined,
        comprimentoPecaM: parseFloat(comprimentoPecaM),
        comprimentoTotalDesejadoM: parseFloat(comprimentoTotalDesejadoM) || undefined,
        quantidadePecasDesejada: parseFloat(quantidadePecasDesejada) || undefined,
        perdaPct: parseFloat(perdaPct),
      };

      const calcResult = calcTubos(params);

      let custoEstimado = 0;
      if (precoPorMetro.trim() && parseFloat(precoPorMetro) > 0) {
        custoEstimado = calcResult.comprimentoTotalCalculadoM * parseFloat(precoPorMetro);
      } else if (precoPorPeca.trim() && parseFloat(precoPorPeca) > 0) {
        custoEstimado = calcResult.numeroPecasRecomendado * parseFloat(precoPorPeca);
      }

      currentResult = { ...calcResult, custoEstimado };
      setResult(currentResult);
      setErrors({});

    } catch (error: any) {
      setErrors({ submit: error.message });
      setResult(null);
    }
  };

  const reset = () => {
    setMaterial("PVC");
    setDiametroNominal("DN 25 (3/4\") PVC");
    setDiametroExternoMM("");
    setEspessuraParedeMM("");
    setComprimentoPecaM("6");
    setComprimentoTotalDesejadoM("100");
    setQuantidadePecasDesejada("");
    setPerdaPct("5");
    setPrecoPorMetro("");
    setPrecoPorPeca("");
    setResult(null);
    setErrors({});
  };

  const isCustomDN = diametroNominal === 'custom';
  const hasComprimentoTotal = comprimentoTotalDesejadoM.trim() !== "";
  const hasQuantidadePecas = quantidadePecasDesejada.trim() !== "";

  return (
    <CalculatorShell
      extrasId={PATH}
      title="Calculadora de Tubos"
      description="Estime comprimentos, massas e quantidades de tubos (PVC, aço, cobre) para água, esgoto, gás, elétrica ou estrutura."
      breadcrumbs={BREADCRUMBS}
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <SelectField
          id="material"
          label="Material do Tubo"
          value={material}
          onChange={(e) => setMaterial(e.target.value as MaterialTubo)}
          options={[
            { value: "PVC", label: "PVC" },
            { value: "Aço", label: "Aço" },
            { value: "Cobre", label: "Cobre" },
          ]}
        />

        <SelectField
          id="diametroNominal"
          label="Diâmetro Nominal / Tipo"
          value={diametroNominal}
          onChange={(e) => setDiametroNominal(e.target.value)}
          options={DIAMETROS_NOMINAIS_PRESETS.filter(option =>
            option.value === 'custom' || option.value.includes(material)
          )}
          error={errors.diametroNominal}
        />

        {isCustomDN && (
          <>
            <NumberField
              id="diametroExternoMM"
              label="Diâmetro Externo"
              unit="mm"
              value={diametroExternoMM}
              onChange={setDiametroExternoMM}
              error={errors.diametroExternoMM}
              placeholder="50"
              min="1"
              max="500"
            />
            <NumberField
              id="espessuraParedeMM"
              label="Espessura da Parede"
              unit="mm"
              value={espessuraParedeMM}
              onChange={setEspessuraParedeMM}
              error={errors.espessuraParedeMM}
              placeholder="3.0"
              min="0.5"
              max="50"
            />
          </>
        )}

        <NumberField
          id="comprimentoPecaM"
          label="Comprimento por Peça"
          unit="m"
          value={comprimentoPecaM}
          onChange={setComprimentoPecaM}
          error={errors.comprimentoPecaM}
          placeholder="6"
          min="0.1"
          max="100"
        />

        <div className="border-t pt-4 mt-4">
          <p className="text-sm text-gray-600 mb-3">
            <strong>Informe:</strong> Comprimento Total Desejado OU Quantidade de Peças Desejada (não ambos).
          </p>
          <NumberField
            id="comprimentoTotalDesejadoM"
            label="Comprimento Total Desejado"
            unit="m"
            value={comprimentoTotalDesejadoM}
            onChange={setComprimentoTotalDesejadoM}
            error={errors.comprimentoTotalDesejadoM}
            placeholder="100"
            min="0.1"
            max="100000"
            disabled={hasQuantidadePecas}
          />
          <NumberField
            id="quantidadePecasDesejada"
            label="Quantidade de Peças Desejada"
            unit="peças"
            value={quantidadePecasDesejada}
            onChange={setQuantidadePecasDesejada}
            error={errors.quantidadePecasDesejada}
            placeholder="10"
            min="1"
            max="10000"
            disabled={hasComprimentoTotal}
          />
        </div>

        <NumberField
          id="perdaPct"
          label="Perda para Cortes"
          unit="%"
          value={perdaPct}
          onChange={setPerdaPct}
          error={errors.perdaPct}
          placeholder="5"
          min="0"
          max="20"
        />

        <h3 className="text-lg font-semibold mt-6">Preços Unitários (Opcional para Custo)</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Informe um dos preços para obter uma estimativa de custo total.
        </p>

        <NumberField
          id="precoPorMetro"
          label="Preço por Metro"
          unit="R$/m"
          value={precoPorMetro}
          onChange={setPrecoPorMetro}
          error={errors.precoPorMetro}
          placeholder="15.00"
          min="0"
          step="0.01"
          disabled={!!precoPorPeca.trim()}
        />
        <NumberField
          id="precoPorPeca"
          label="Preço por Peça"
          unit="R$/peça"
          value={precoPorPeca}
          onChange={setPrecoPorPeca}
          error={errors.precoPorPeca}
          placeholder="90.00"
          min="0"
          step="0.01"
          disabled={!!precoPorMetro.trim()}
        />

        <SubmitRow onReset={reset} />
      </form>

      {errors.submit && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{errors.submit}</p>
        </div>
      )}

      {result && (
        <ResultPanel
          items={[
            { label: "Diâmetro Externo", value: `${fmt(result.diametroExternoMM, 2)} mm` },
            { label: "Diâmetro Interno", value: `${fmt(result.diametroInternoMM, 2)} mm` },
            { label: "Área da Seção Interna", value: `${fmt(result.areaSecaoInternaM2 * 1000000, 2)} mm² (${fmt(result.areaSecaoInternaM2, 5)} m²)` },
            { label: "Massa por Metro", value: `${fmt(result.massaPorMetroKg, 2)} kg/m` },
            { label: "Comprimento Total Desejado", value: `${fmt(result.comprimentoTotalCalculadoM, 2)} m` },
            { label: "Número de Peças Recomendado", value: `${fmt(result.numeroPecasRecomendado, 0)} peças`, highlight: true },
            { label: "Massa Total", value: `${fmt(result.massaTotalKg, 2)} kg`, highlight: true },
            result.custoEstimado > 0
              ? {
                  label: "Custo Estimado",
                  value: `R$ ${fmt(result.custoEstimado, 2)}`,
                  highlight: true,
                }
              : null,
          ].filter(Boolean)}
        />
      )}
    </CalculatorShell>
  );
}
