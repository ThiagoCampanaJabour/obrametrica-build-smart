import { useState } from "react";
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
import { calcBlocos } from "@/lib/formulas";

const PATH = "/calculadora-de-blocos";

const BREADCRUMBS = [
  { label: "Início", href: "/" },
  { label: "Construção Civil", href: "/construcao-civil" },
  { label: "Calculadora de Blocos", href: PATH },
];

// Presets de tipos de bloco com dimensões em mm
const TIPOS_BLOCO: Record<
  string,
  { comprimento: number; altura: number; largura: number; descricao: string }
> = {
  "bloco-concreto-19x19x39": {
    comprimento: 390,
    altura: 190,
    largura: 190,
    descricao: "Bloco de Concreto 19x19x39 cm",
  },
  "bloco-concreto-14x19x39": {
    comprimento: 390,
    altura: 190,
    largura: 140,
    descricao: "Bloco de Concreto 14x19x39 cm",
  },
  "bloco-concreto-9x19x39": {
    comprimento: 390,
    altura: 190,
    largura: 90,
    descricao: "Bloco de Concreto 9x19x39 cm",
  },
  "tijolo-ceramico-9x19x19": {
    comprimento: 190,
    altura: 190,
    largura: 90,
    descricao: "Tijolo Cerâmico 9x19x19 cm",
  },
  "tijolo-ceramico-11.5x14x24": {
    comprimento: 240,
    altura: 140,
    largura: 115,
    descricao: "Tijolo Cerâmico 11.5x14x24 cm",
  },
};

export const Route = createFileRoute("/calculadora-de-blocos")({
  head: () =>
    pageHead({
      title: "Calculadora de Blocos — Quantidade e Argamassa | ObraMétrica",
      description:
        "Calcule a quantidade de blocos e argamassa para sua alvenaria, considerando dimensões da parede, tipo de bloco, juntas e vãos.",
      path: PATH,
      breadcrumbs: BREADCRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Calculadora de Blocos",
        url: `https://obrametrica.com.br${PATH}`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      extraSchemas: allSchemasFor(PATH),
    }),
  component: BlocosCalculator,
});

function BlocosCalculator() {
  const [larguraParede, setLarguraParede] = useState("");
  const [alturaParede, setAlturaParede] = useState("");
  const [tipoBloco, setTipoBloco] = useState("bloco-concreto-19x19x39");
  const [comprimentoBloco, setComprimentoBloco] = useState("390"); // mm
  const [alturaBloco, setAlturaBloco] = useState("190"); // mm
  const [larguraBloco, setLarguraBloco] = useState("190"); // mm
  const [espessuraJuntaHorizontal, setEspessuraJuntaHorizontal] = useState("10"); // mm
  const [espessuraJuntaVertical, setEspessuraJuntaVertical] = useState("10"); // mm
  const [areaVao, setAreaVao] = useState("0"); // m²
  const [desperdicio, setDesperdicio] = useState("7"); // %

  const [result, setResult] = useState<null | {
    areaLiquidaParede: number;
    areaUtilBlocoM2: number;
    blocosPorM2: number;
    numeroTeoricoBlocos: number;
    numeroFinalBlocos: number;
    volumeArgamassaM3: number;
  }>(null);

  const [errors, setErrors] = useState<{
    larguraParede?: string;
    alturaParede?: string;
    comprimentoBloco?: string;
    alturaBloco?: string;
    larguraBloco?: string;
    espessuraJuntaHorizontal?: string;
    espessuraJuntaVertical?: string;
    areaVao?: string;
    desperdicio?: string;
    submit?: string;
  }>({});

  // Atualiza as dimensões do bloco quando o tipo de bloco muda
  const handleTipoBlocoChange = (value: string) => {
    setTipoBloco(value);
    const preset = TIPOS_BLOCO[value];
    if (preset) {
      setComprimentoBloco(String(preset.comprimento));
      setAlturaBloco(String(preset.altura));
      setLarguraBloco(String(preset.largura));
    }
  };

  const submit = () => {
    const newErrors: typeof errors = {};

    // Validações
    const lp = parseFloat(larguraParede);
    const ap = parseFloat(alturaParede);
    const cb = parseFloat(comprimentoBloco);
    const ab = parseFloat(alturaBloco);
    const lb = parseFloat(larguraBloco);
    const ejh = parseFloat(espessuraJuntaHorizontal);
    const ejv = parseFloat(espessuraJuntaVertical);
    const av = parseFloat(areaVao);
    const desp = parseFloat(desperdicio);

    if (isNaN(lp) || lp <= 0 || lp > 1000) newErrors.larguraParede = "Largura da parede deve ser entre 0.1 e 1000 m";
    if (isNaN(ap) || ap <= 0 || ap > 100) newErrors.alturaParede = "Altura da parede deve ser entre 0.1 e 100 m";
    if (isNaN(cb) || cb <= 0 || cb > 1000) newErrors.comprimentoBloco = "Comprimento do bloco deve ser entre 1 e 1000 mm";
    if (isNaN(ab) || ab <= 0 || ab > 500) newErrors.alturaBloco = "Altura do bloco deve ser entre 1 e 500 mm";
    if (isNaN(lb) || lb <= 0 || lb > 500) newErrors.larguraBloco = "Largura do bloco deve ser entre 1 e 500 mm";
    if (isNaN(ejh) || ejh < 0 || ejh > 50) newErrors.espessuraJuntaHorizontal = "Junta horizontal deve ser entre 0 e 50 mm";
    if (isNaN(ejv) || ejv < 0 || ejv > 50) newErrors.espessuraJuntaVertical = "Junta vertical deve ser entre 0 e 50 mm";
    if (isNaN(av) || av < 0 || av > (lp * ap)) newErrors.areaVao = "Área de vãos não pode ser negativa ou maior que a área da parede";
    if (isNaN(desp) || desp < 0 || desp > 15) newErrors.desperdicio = "Desperdício deve ser entre 0 e 15%";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    try {
      const calculatedResult = calcBlocos(
        lp,
        ap,
        cb,
        ab,
        lb,
        ejh,
        ejv,
        av,
        desp,
      );
      setResult(calculatedResult);
      setErrors({});
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : "Erro ao calcular",
      });
      setResult(null);
    }
  };

  const reset = () => {
    setLarguraParede("");
    setAlturaParede("");
    setTipoBloco("bloco-concreto-19x19x39");
    setComprimentoBloco("390");
    setAlturaBloco("190");
    setLarguraBloco("190");
    setEspessuraJuntaHorizontal("10");
    setEspessuraJuntaVertical("10");
    setAreaVao("0");
    setDesperdicio("7");
    setResult(null);
    setErrors({});
  };

  return (
    <CalculatorShell
      title="Calculadora de Blocos"
      breadcrumbs={BREADCRUMBS}
    >
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-gray-700">
          <strong>Dica:</strong> Selecione um tipo de bloco predefinido ou insira as dimensões manualmente. Lembre-se de descontar a área de portas e janelas.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="space-y-4"
        noValidate
      >
        <NumberField
          id="larguraParede"
          label="Largura da parede"
          unit="m"
          value={larguraParede}
          onChange={setLarguraParede}
          error={errors.larguraParede}
          placeholder="5"
          min="0.1"
          max="1000"
          step="0.1"
        />

        <NumberField
          id="alturaParede"
          label="Altura da parede"
          unit="m"
          value={alturaParede}
          onChange={setAlturaParede}
          error={errors.alturaParede}
          placeholder="3"
          min="0.1"
          max="100"
          step="0.1"
        />

        <SelectField
          id="tipoBloco"
          label="Tipo de bloco"
          value={tipoBloco}
          onChange={handleTipoBlocoChange}
          options={Object.entries(TIPOS_BLOCO).map(([key, value]) => ({
            value: key,
            label: value.descricao,
          }))}
        />

        <NumberField
          id="comprimentoBloco"
          label="Comprimento do bloco"
          unit="mm"
          value={comprimentoBloco}
          onChange={setComprimentoBloco}
          error={errors.comprimentoBloco}
          placeholder="390"
          min="1"
          max="1000"
          step="1"
        />

        <NumberField
          id="alturaBloco"
          label="Altura do bloco"
          unit="mm"
          value={alturaBloco}
          onChange={setAlturaBloco}
          error={errors.alturaBloco}
          placeholder="190"
          min="1"
          max="500"
          step="1"
        />

        <NumberField
          id="larguraBloco"
          label="Largura do bloco"
          unit="mm"
          value={larguraBloco}
          onChange={setLarguraBloco}
          error={errors.larguraBloco}
          placeholder="190"
          min="1"
          max="500"
          step="1"
        />

        <NumberField
          id="espessuraJuntaHorizontal"
          label="Espessura da junta horizontal"
          unit="mm"
          value={espessuraJuntaHorizontal}
          onChange={setEspessuraJuntaHorizontal}
          error={errors.espessuraJuntaHorizontal}
          placeholder="10"
          min="0"
          max="50"
          step="1"
        />

        <NumberField
          id="espessuraJuntaVertical"
          label="Espessura da junta vertical"
          unit="mm"
          value={espessuraJuntaVertical}
          onChange={setEspessuraJuntaVertical}
          error={errors.espessuraJuntaVertical}
          placeholder="10"
          min="0"
          max="50"
          step="1"
        />

        <NumberField
          id="areaVao"
          label="Área de vãos (portas/janelas)"
          unit="m²"
          value={areaVao}
          onChange={setAreaVao}
          error={errors.areaVao}
          placeholder="0"
          min="0"
          max={String(parseFloat(larguraParede) * parseFloat(alturaParede) || 10000)} // Max dinâmico
          step="0.1"
        />

        <NumberField
          id="desperdicio"
          label="Margem de desperdício"
          unit="%"
          value={desperdicio}
          onChange={setDesperdicio}
          error={errors.desperdicio}
          placeholder="7"
          min="0"
          max="15"
          step="1"
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
            {
              label: "Área líquida da parede",
              value: `${fmt(result.areaLiquidaParede, 2)} m²`,
            },
            {
              label: "Blocos por m²",
              value: `${fmt(result.blocosPorM2, 2)} un/m²`,
            },
            {
              label: "Número teórico de blocos",
              value: `${fmt(result.numeroTeoricoBlocos, 0)} un`,
            },
            {
              label: "Número final de blocos",
              value: `${fmt(result.numeroFinalBlocos, 0)} un`,
              highlight: true,
            },
            {
              label: "Volume de argamassa",
              value: `${fmt(result.volumeArgamassaM3, 3)} m³`,
              highlight: true,
            },
          ]}
        />
      )}
    </CalculatorShell>
  );
}
