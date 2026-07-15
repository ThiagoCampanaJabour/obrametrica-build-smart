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
  massaPorMetroAco,
  massaTotalAco,
  aplicarDesperdicioAco,
  numeroVergalhoesAco,
  agruparComprimentosAco,
  quantidadeBarrasPorAreaAco,
} from "@/lib/formulas";

const PATH = "/calculadora-de-aco";

const BREADCRUMBS = [
  { label: "Início", href: "/" },
  { label: "Construção Civil", href: "/construcao-civil" },
  { label: "Calculadora de Aço", href: PATH },
];

// Presets de diâmetros de barra em mm e suas massas nominais (kg/m)
const DIAMETROS_ACO_PRESETS: Record<string, { diametro: number; massaKgM: number }> = {
  "5.0": { diametro: 5.0, massaKgM: 0.196 },
  "6.3": { diametro: 6.3, massaKgM: 0.307 },
  "8.0": { diametro: 8.0, massaKgM: 0.395 },
  "10.0": { diametro: 10.0, massaKgM: 0.617 },
  "12.5": { diametro: 12.5, massaKgM: 0.963 },
  "16.0": { diametro: 16.0, massaKgM: 1.578 },
  "20.0": { diametro: 20.0, massaKgM: 2.466 },
  "25.0": { diametro: 25.0, massaKgM: 3.853 },
  "32.0": { diametro: 32.0, massaKgM: 6.313 },
};

type TipoCalculo = "conversao" | "compras" | "dimensionamento";

export const Route = createFileRoute("/calculadora-de-aco")({
  head: () =>
    pageHead({
      title: "Calculadora de Aço — Vergalhões, Massa e Comprimento | ObraMétrica",
      description:
        "Calcule a quantidade de aço (vergalhões, barras) e a massa necessária para suas estruturas de concreto armado.",
      path: PATH,
      breadcrumbs: BREADCRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Calculadora de Aço",
        url: `https://obrametrica.com.br${PATH}`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      extraSchemas: allSchemasFor(PATH),
    }),
  component: AcoCalculator,
});

function AcoCalculator() {
  const [tipoCalculo, setTipoCalculo] = useState<TipoCalculo>("compras");

  // Conversão Rápida
  const [diametroConversao, setDiametroConversao] = useState("10.0");
  const [massaPorMetroResult, setMassaPorMetroResult] = useState<number | null>(null);

  // Compras por Comprimento
  const [diametroCompras, setDiametroCompras] = useState("10.0");
  const [quantidadeBarras, setQuantidadeBarras] = useState("10");
  const [comprimentoBarra, setComprimentoBarra] = useState("6");

  // Dimensionamento Simplificado
  const [diametroDimensionamento, setDiametroDimensionamento] = useState("10.0");
  const [areaAcoNecessaria, setAreaAcoNecessaria] = useState("5"); // cm²

  // Comuns
  const [desperdicio, setDesperdicio] = useState("5"); // %
  const [comprimentoVergalhaoPadrao, setComprimentoVergalhaoPadrao] = useState("12"); // m

  const [result, setResult] = useState<null | {
    massaTotalKg: number;
    massaTotalTon: number;
    comprimentoTotalM: number;
    numeroVergalhoes: number;
    massaDesperdicioKg: number;
    agrupamentoComprimentos?: Record<string, number>;
    quantidadeBarrasDimensionamento?: number;
  }>(null);

  const [errors, setErrors] = useState<{
    diametroConversao?: string;
    diametroCompras?: string;
    quantidadeBarras?: string;
    comprimentoBarra?: string;
    diametroDimensionamento?: string;
    areaAcoNecessaria?: string;
    desperdicio?: string;
    comprimentoVergalhaoPadrao?: string;
    submit?: string;
  }>({});

  const handleDiametroChange = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setter(value);
  };

  const submit = () => {
    const newErrors: typeof errors = {};
    let currentResult = null;

    try {
      const desp = parseFloat(desperdicio);
      if (isNaN(desp) || desp < 0 || desp > 15) {
        newErrors.desperdicio = "Desperdício deve ser entre 0 e 15%.";
      }

      const compVergalhao = parseFloat(comprimentoVergalhaoPadrao);
      if (isNaN(compVergalhao) || compVergalhao <= 0 || compVergalhao > 24) {
        newErrors.comprimentoVergalhaoPadrao = "Comprimento do vergalhão deve ser entre 1 e 24 m.";
      }

      if (tipoCalculo === "conversao") {
        const diam = parseFloat(diametroConversao);
        if (isNaN(diam) || diam <= 0 || diam > 50) {
          newErrors.diametroConversao = "Diâmetro deve ser entre 0.1 e 50 mm.";
        }
        if (Object.keys(newErrors).length === 0) {
          const massa = massaPorMetroAco(diam);
          setMassaPorMetroResult(massa);
          setResult(null); // Limpa resultados de outros cálculos
        } else {
          setMassaPorMetroResult(null);
        }
      } else {
        setMassaPorMetroResult(null); // Limpa o resultado de conversão

        let itemsParaCalculo: { diametro_mm: number; quantidade: number; comprimento_m: number }[] = [];
        let comprimentoTotalM = 0;

        if (tipoCalculo === "compras") {
          const diam = parseFloat(diametroCompras);
          const qtd = parseInt(quantidadeBarras);
          const comp = parseFloat(comprimentoBarra);

          if (isNaN(diam) || diam <= 0 || diam > 50) newErrors.diametroCompras = "Diâmetro deve ser entre 0.1 e 50 mm.";
          if (isNaN(qtd) || qtd <= 0 || qtd > 10000) newErrors.quantidadeBarras = "Quantidade deve ser entre 1 e 10000.";
          if (isNaN(comp) || comp <= 0 || comp > 100) newErrors.comprimentoBarra = "Comprimento deve ser entre 0.1 e 100 m.";

          if (Object.keys(newErrors).length === 0) {
            itemsParaCalculo.push({ diametro_mm: diam, quantidade: qtd, comprimento_m: comp });
            comprimentoTotalM = qtd * comp;
          }
        } else if (tipoCalculo === "dimensionamento") {
          const diam = parseFloat(diametroDimensionamento);
          const asCm2 = parseFloat(areaAcoNecessaria);

          if (isNaN(diam) || diam <= 0 || diam > 50) newErrors.diametroDimensionamento = "Diâmetro deve ser entre 0.1 e 50 mm.";
          if (isNaN(asCm2) || asCm2 <= 0 || asCm2 > 1000) newErrors.areaAcoNecessaria = "Área de aço deve ser entre 0.1 e 1000 cm².";

          if (Object.keys(newErrors).length === 0) {
            const qtdBarras = quantidadeBarrasPorAreaAco(asCm2, diam);
            // Para o dimensionamento, assumimos um comprimento de 1m para calcular a massa por metro
            // e depois multiplicamos pelo comprimento total da estrutura, se aplicável.
            // Aqui, para simplificar, vamos calcular a massa para a quantidade de barras encontradas
            // para um comprimento hipotético de 1m, e o usuário pode escalar.
            // Ou, podemos pedir um comprimento da estrutura para o dimensionamento.
            // Por enquanto, vamos focar na quantidade de barras e massa por metro.
            // Para ter um resultado de massa total, precisamos de um comprimento.
            // Vamos assumir que o usuário quer saber a massa para um comprimento total de 12m (vergalhão padrão)
            // para a quantidade de barras calculada.
            itemsParaCalculo.push({ diametro_mm: diam, quantidade: qtdBarras, comprimento_m: compVergalhao });
            comprimentoTotalM = qtdBarras * compVergalhao;
            currentResult = { ...currentResult, quantidadeBarrasDimensionamento: qtdBarras };
          }
        }

        if (Object.keys(newErrors).length === 0 && itemsParaCalculo.length > 0) {
          const massaTeoricaKg = massaTotalAco(itemsParaCalculo);
          const massaFinalKg = aplicarDesperdicioAco(massaTeoricaKg, desp);
          const massaDesperdicioKg = massaFinalKg - massaTeoricaKg;
          const numeroVergalhoes = numeroVergalhoesAco(comprimentoTotalM, compVergalhao);
          const agrupamentoComprimentos = agruparComprimentosAco(itemsParaCalculo);

          currentResult = {
            ...currentResult,
            massaTotalKg: massaFinalKg,
            massaTotalTon: massaFinalKg / 1000,
            comprimentoTotalM: comprimentoTotalM,
            numeroVergalhoes: numeroVergalhoes,
            massaDesperdicioKg: massaDesperdicioKg,
            agrupamentoComprimentos: agrupamentoComprimentos,
          };
        }
      }
    } catch (error) {
      newErrors.submit = error instanceof Error ? error.message : "Erro desconhecido ao calcular.";
    }

    setErrors(newErrors);
    setResult(currentResult);
  };

  const reset = () => {
    setTipoCalculo("compras");
    setDiametroConversao("10.0");
    setMassaPorMetroResult(null);
    setDiametroCompras("10.0");
    setQuantidadeBarras("10");
    setComprimentoBarra("6");
    setDiametroDimensionamento("10.0");
    setAreaAcoNecessaria("5");
    setDesperdicio("5");
    setComprimentoVergalhaoPadrao("12");
    setResult(null);
    setErrors({});
  };

  return (
    <CalculatorShell
      extrasId={PATH}
      title="Calculadora de Aço"
      description="Estime a quantidade de aço (vergalhões, barras) e a massa necessária para suas estruturas de concreto armado."
      breadcrumbs={BREADCRUMBS}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="space-y-6"
        noValidate
      >
        <SelectField
          id="tipoCalculo"
          label="Tipo de Cálculo"
          value={tipoCalculo}
          onChange={setTipoCalculo}
          options={[
            { value: "compras", label: "Compras por Comprimento (Qtd. x Comp.)" },
            { value: "dimensionamento", label: "Dimensionamento Simplificado (por Área de Aço)" },
            { value: "conversao", label: "Conversão Rápida (Diâmetro para kg/m)" },
          ]}
        />

        {tipoCalculo === "conversao" && (
          <NumberField
            id="diametroConversao"
            label="Diâmetro da barra"
            unit="mm"
            value={diametroConversao}
            onChange={(val) => handleDiametroChange(val, setDiametroConversao)}
            error={errors.diametroConversao}
            placeholder="10.0"
            min="0.1"
            max="50"
            step="0.1"
            list="diametro-presets"
          />
        )}

        {tipoCalculo === "compras" && (
          <>
            <NumberField
              id="diametroCompras"
              label="Diâmetro da barra"
              unit="mm"
              value={diametroCompras}
              onChange={(val) => handleDiametroChange(val, setDiametroCompras)}
              error={errors.diametroCompras}
              placeholder="10.0"
              min="0.1"
              max="50"
              step="0.1"
              list="diametro-presets"
            />
            <NumberField
              id="quantidadeBarras"
              label="Quantidade de barras"
              unit="un"
              value={quantidadeBarras}
              onChange={setQuantidadeBarras}
              error={errors.quantidadeBarras}
              placeholder="10"
              min="1"
              max="10000"
              step="1"
            />
            <NumberField
              id="comprimentoBarra"
              label="Comprimento por barra"
              unit="m"
              value={comprimentoBarra}
              onChange={setComprimentoBarra}
              error={errors.comprimentoBarra}
              placeholder="6"
              min="0.1"
              max="100"
              step="0.1"
            />
          </>
        )}

        {tipoCalculo === "dimensionamento" && (
          <>
            <NumberField
              id="diametroDimensionamento"
              label="Diâmetro da barra a usar"
              unit="mm"
              value={diametroDimensionamento}
              onChange={(val) => handleDiametroChange(val, setDiametroDimensionamento)}
              error={errors.diametroDimensionamento}
              placeholder="10.0"
              min="0.1"
              max="50"
              step="0.1"
              list="diametro-presets"
            />
            <NumberField
              id="areaAcoNecessaria"
              label="Área de aço necessária (As)"
              unit="cm²"
              value={areaAcoNecessaria}
              onChange={setAreaAcoNecessaria}
              error={errors.areaAcoNecessaria}
              placeholder="5"
              min="0.1"
              max="1000"
              step="0.1"
            />
          </>
        )}

        {(tipoCalculo === "compras" || tipoCalculo === "dimensionamento") && (
          <>
            <NumberField
              id="desperdicio"
              label="Margem de desperdício"
              unit="%"
              value={desperdicio}
              onChange={setDesperdicio}
              error={errors.desperdicio}
              placeholder="5"
              min="0"
              max="15"
              step="1"
            />
            <NumberField
              id="comprimentoVergalhaoPadrao"
              label="Comprimento do vergalhão comercial"
              unit="m"
              value={comprimentoVergalhaoPadrao}
              onChange={setComprimentoVergalhaoPadrao}
              error={errors.comprimentoVergalhaoPadrao}
              placeholder="12"
              min="1"
              max="24"
              step="0.1"
            />
          </>
        )}

        <datalist id="diametro-presets">
          {Object.values(DIAMETROS_ACO_PRESETS).map((preset) => (
            <option key={preset.diametro} value={preset.diametro}>
              {preset.diametro} mm ({fmt(preset.massaKgM, 3)} kg/m)
            </option>
          ))}
        </datalist>

        <SubmitRow onReset={reset} />
      </form>

      {errors.submit && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{errors.submit}</p>
        </div>
      )}

      {massaPorMetroResult !== null && tipoCalculo === "conversao" && (
        <ResultPanel
          items={[
            {
              label: "Massa por metro",
              value: `${fmt(massaPorMetroResult, 3)} kg/m`,
              highlight: true,
            },
          ]}
        />
      )}

      {result && (tipoCalculo === "compras" || tipoCalculo === "dimensionamento") && (
        <ResultPanel
          items={[
            result.quantidadeBarrasDimensionamento
              ? {
                  label: "Barras necessárias",
                  value: `${fmt(result.quantidadeBarrasDimensionamento, 0)} un`,
                }
              : null,
            {
              label: "Comprimento total",
              value: `${fmt(result.comprimentoTotalM, 2)} m`,
            },
            {
              label: "Massa total de aço",
              value: `${fmt(result.massaTotalKg, 2)} kg`,
              highlight: true,
            },
            {
              label: "Massa total de aço",
              value: `${fmt(result.massaTotalTon, 3)} t`,
            },
            {
              label: "Número de vergalhões de 12m",
              value: `${fmt(result.numeroVergalhoes, 0)} un`,
            },
            {
              label: "Massa de desperdício",
              value: `${fmt(result.massaDesperdicioKg, 2)} kg`,
            },
            result.agrupamentoComprimentos && {
              label: "Comprimento por diâmetro",
              value: Object.entries(result.agrupamentoComprimentos)
                .map(([diam, comp]) => `${diam}mm: ${fmt(comp, 2)}m`)
                .join(", "),
            },
          ].filter(Boolean)}
        />
      )}
    </CalculatorShell>
  );
}
