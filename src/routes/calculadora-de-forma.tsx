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
  calcularAreaForma,
  calcularPaineisCompensado,
  calcularComprimentoTabuas,
  calcularNumeroEscoras,
  estimarConsumoPregos,
  estimarConsumoOleoDesmoldante,
  aplicarDesperdicioForma,
  calcForma,
} from "@/lib/formulas";

const PATH = "/calculadora-de-forma";

const BREADCRUMBS = [
  { label: "Início", href: "/" },
  { label: "Construção Civil", href: "/construcao-civil" },
  { label: "Calculadora de Forma", href: PATH },
];

// Presets de dimensões de compensado e tábuas
const COMPENSADO_PRESETS = {
  "6": { label: "6 mm", espessura: 6 },
  "9": { label: "9 mm", espessura: 9 },
  "12": { label: "12 mm", espessura: 12 },
};

const TABUA_PRESETS = {
  "25x100": { label: "25x100 mm", largura: 100, espessura: 25 },
  "25x150": { label: "25x150 mm", largura: 150, espessura: 25 },
  "50x100": { label: "50x100 mm", largura: 100, espessura: 50 },
};

type TipoElemento = 'viga' | 'pilar' | 'laje-borda' | 'parede' | 'personalizada';

export const Route = createFileRoute("/calculadora-de-forma")({
  head: () =>
    pageHead({
      title: "Calculadora de Forma — Materiais e Custo | ObraMétrica",
      description:
        "Estime materiais (madeira, compensado, escoras, pregos, óleo) e custo para fôrmas de concreto (vigas, pilares, lajes, paredes).",
      path: PATH,
      breadcrumbs: BREADCRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Calculadora de Forma",
        url: `https://obrametrica.com.br${PATH}`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      extraSchemas: allSchemasFor(PATH),
    }),
  component: FormaCalculator,
});

function FormaCalculator() {
  const [tipoElemento, setTipoElemento] = useState<TipoElemento>("viga");

  // Dimensões do elemento
  const [comprimentoElemento, setComprimentoElemento] = useState("5"); // m
  const [larguraElemento, setLarguraElemento] = useState("0.3"); // m
  const [alturaElemento, setAlturaElemento] = useState("0.5"); // m
  const [espessuraElemento, setEspessuraElemento] = useState("0.15"); // m (para laje/parede)
  const [areaTotalPersonalizada, setAreaTotalPersonalizada] = useState("10"); // m²

  // Materiais da fôrma
  const [espessuraCompensado, setEspessuraCompensado] = useState("12"); // mm
  const [larguraTabua, setLarguraTabua] = useState("100"); // mm
  const [espessuraTabua, setEspessuraTabua] = useState("25"); // mm
  const [espacamentoEscoras, setEspacamentoEscoras] = useState("1.5"); // m
  const [desperdicio, setDesperdicio] = useState("10"); // %
  const [reaproveitavel, setReaproveitavel] = useState(false); // Simplesmente para o futuro, não usado no cálculo ainda

  // Preços unitários (opcionais)
  const [precoCompensadoM2, setPrecoCompensadoM2] = useState("");
  const [precoTabuaM, setPrecoTabuaM] = useState("");
  const [precoEscoraUn, setPrecoEscoraUn] = useState("");
  const [precoPregoKg, setPrecoPregoKg] = useState("");
  const [precoOleoL, setPrecoOleoL] = useState("");

  const [result, setResult] = useState<null | {
    areaTotalFormaM2: number;
    paineisCompensado: number;
    comprimentoTabuasM: number;
    numeroEscoras: number;
    massaPregosKg: number;
    oleoDesmoldanteL: number;
    custoEstimado: number;
  }>(null);

  const [errors, setErrors] = useState<{
    comprimentoElemento?: string;
    larguraElemento?: string;
    alturaElemento?: string;
    espessuraElemento?: string;
    areaTotalPersonalizada?: string;
    espessuraCompensado?: string;
    larguraTabua?: string;
    espessuraTabua?: string;
    espacamentoEscoras?: string;
    desperdicio?: string;
    precoCompensadoM2?: string;
    precoTabuaM?: string;
    precoEscoraUn?: string;
    precoPregoKg?: string;
    precoOleoL?: string;
    submit?: string;
  }>({});

  const validatePositive = (value: string, fieldName: string, min = 0.01, max = 1000) => {
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

  const submit = () => {
    const newErrors: typeof errors = {};
    let currentResult = null;

    try {
      const dimensoes: {
        comprimento?: number;
        largura?: number;
        altura?: number;
        espessura?: number;
        areaTotalM2?: number;
      } = {};

      if (tipoElemento === "viga" || tipoElemento === "pilar" || tipoElemento === "parede") {
        dimensoes.comprimento = parseFloat(comprimentoElemento);
        dimensoes.largura = parseFloat(larguraElemento);
        dimensoes.altura = parseFloat(alturaElemento);

        if (isNaN(dimensoes.comprimento) || dimensoes.comprimento <= 0) newErrors.comprimentoElemento = "Comprimento deve ser > 0.";
        if (isNaN(dimensoes.largura) || dimensoes.largura <= 0) newErrors.larguraElemento = "Largura deve ser > 0.";
        if (isNaN(dimensoes.altura) || dimensoes.altura <= 0) newErrors.alturaElemento = "Altura deve ser > 0.";
      } else if (tipoElemento === "laje-borda") {
        dimensoes.comprimento = parseFloat(comprimentoElemento);
        dimensoes.espessura = parseFloat(espessuraElemento);

        if (isNaN(dimensoes.comprimento) || dimensoes.comprimento <= 0) newErrors.comprimentoElemento = "Comprimento deve ser > 0.";
        if (isNaN(dimensoes.espessura) || dimensoes.espessura <= 0) newErrors.espessuraElemento = "Espessura deve ser > 0.";
      } else if (tipoElemento === "personalizada") {
        dimensoes.areaTotalM2 = parseFloat(areaTotalPersonalizada);
        if (isNaN(dimensoes.areaTotalM2) || dimensoes.areaTotalM2 <= 0) newErrors.areaTotalPersonalizada = "Área total deve ser > 0.";
      }

      newErrors.espessuraCompensado = validatePositive(espessuraCompensado, "Espessura do compensado", 1, 50);
      newErrors.larguraTabua = validatePositive(larguraTabua, "Largura da tábua", 10, 300);
      newErrors.espessuraTabua = validatePositive(espessuraTabua, "Espessura da tábua", 10, 100);
      newErrors.espacamentoEscoras = validatePositive(espacamentoEscoras, "Espaçamento das escoras", 0.1, 5);
      newErrors.desperdicio = validatePercentage(desperdicio, "Desperdício", 0, 30);

      // Validação de preços (opcionais, mas se preenchidos, devem ser válidos)
      if (precoCompensadoM2.trim()) newErrors.precoCompensadoM2 = validatePositive(precoCompensadoM2, "Preço do compensado", 0);
      if (precoTabuaM.trim()) newErrors.precoTabuaM = validatePositive(precoTabuaM, "Preço da tábua", 0);
      if (precoEscoraUn.trim()) newErrors.precoEscoraUn = validatePositive(precoEscoraUn, "Preço da escora", 0);
      if (precoPregoKg.trim()) newErrors.precoPregoKg = validatePositive(precoPregoKg, "Preço do prego", 0);
      if (precoOleoL.trim()) newErrors.precoOleoL = validatePositive(precoOleoL, "Preço do óleo", 0);


      if (Object.values(newErrors).some(e => e !== undefined)) {
        setErrors(newErrors);
        setResult(null);
        return;
      }

      const calcParams = {
        tipoElemento: tipoElemento,
        dimensoes: dimensoes,
        espessuraCompensadoMM: parseFloat(espessuraCompensado),
        larguraTabuaMM: parseFloat(larguraTabua),
        espessuraTabuaMM: parseFloat(espessuraTabua),
        espacamentoEscorasM: parseFloat(espacamentoEscoras),
        desperdicioPct: parseFloat(desperdicio),
        reaproveitavel: reaproveitavel,
      };

      const calculated = calcForma(calcParams);

      let custoEstimado = 0;
      if (precoCompensadoM2.trim()) {
        custoEstimado += calculated.paineisCompensado * parseFloat(precoCompensadoM2) * (1.22 * 2.44); // Preço por m2 de compensado
      }
      if (precoTabuaM.trim()) {
        custoEstimado += calculated.comprimentoTabuasM * parseFloat(precoTabuaM);
      }
      if (precoEscoraUn.trim()) {
        custoEstimado += calculated.numeroEscoras * parseFloat(precoEscoraUn);
      }
      if (precoPregoKg.trim()) {
        custoEstimado += calculated.massaPregosKg * parseFloat(precoPregoKg);
      }
      if (precoOleoL.trim()) {
        custoEstimado += calculated.oleoDesmoldanteL * parseFloat(precoOleoL);
      }

      currentResult = { ...calculated, custoEstimado };

    } catch (error) {
      newErrors.submit = error instanceof Error ? error.message : "Erro desconhecido ao calcular.";
    }

    setErrors(newErrors);
    setResult(currentResult);
  };

  const reset = () => {
    setTipoElemento("viga");
    setComprimentoElemento("5");
    setLarguraElemento("0.3");
    setAlturaElemento("0.5");
    setEspessuraElemento("0.15");
    setAreaTotalPersonalizada("10");
    setEspessuraCompensado("12");
    setLarguraTabua("100");
    setEspessuraTabua("25");
    setEspacamentoEscoras("1.5");
    setDesperdicio("10");
    setReaproveitavel(false);
    setPrecoCompensadoM2("");
    setPrecoTabuaM("");
    setPrecoEscoraUn("");
    setPrecoPregoKg("");
    setPrecoOleoL("");
    setResult(null);
    setErrors({});
  };

  return (
    <CalculatorShell
      extrasId={PATH}
      title="Calculadora de Forma"
      description="Estime materiais (madeira, compensado, escoras, pregos, óleo) e custo para fôrmas de concreto (vigas, pilares, lajes, paredes)."
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
          id="tipoElemento"
          label="Tipo de Elemento Estrutural"
          value={tipoElemento}
          onChange={setTipoElemento}
          options={[
            { value: "viga", label: "Viga" },
            { value: "pilar", label: "Pilar" },
            { value: "laje-borda", label: "Laje (borda)" },
            { value: "parede", label: "Parede de Concreto" },
            { value: "personalizada", label: "Fôrma Personalizada (área total)" },
          ]}
        />

        {(tipoElemento === "viga" || tipoElemento === "pilar" || tipoElemento === "parede") && (
          <>
            <NumberField
              id="comprimentoElemento"
              label="Comprimento do Elemento"
              unit="m"
              value={comprimentoElemento}
              onChange={setComprimentoElemento}
              error={errors.comprimentoElemento}
              placeholder="5"
              min="0.01"
              max="1000"
              step="0.01"
            />
            <NumberField
              id="larguraElemento"
              label="Largura da Seção"
              unit="m"
              value={larguraElemento}
              onChange={setLarguraElemento}
              error={errors.larguraElemento}
              placeholder="0.3"
              min="0.01"
              max="10"
              step="0.01"
            />
            <NumberField
              id="alturaElemento"
              label="Altura da Seção"
              unit="m"
              value={alturaElemento}
              onChange={setAlturaElemento}
              error={errors.alturaElemento}
              placeholder="0.5"
              min="0.01"
              max="10"
              step="0.01"
            />
          </>
        )}

        {tipoElemento === "laje-borda" && (
          <>
            <NumberField
              id="comprimentoElemento"
              label="Comprimento da Borda da Laje"
              unit="m"
              value={comprimentoElemento}
              onChange={setComprimentoElemento}
              error={errors.comprimentoElemento}
              placeholder="10"
              min="0.01"
              max="1000"
              step="0.01"
            />
            <NumberField
              id="espessuraElemento"
              label="Espessura da Laje"
              unit="m"
              value={espessuraElemento}
              onChange={setEspessuraElemento}
              error={errors.espessuraElemento}
              placeholder="0.15"
              min="0.01"
              max="1"
              step="0.01"
            />
          </>
        )}

        {tipoElemento === "personalizada" && (
          <NumberField
            id="areaTotalPersonalizada"
            label="Área Total da Fôrma"
            unit="m²"
            value={areaTotalPersonalizada}
            onChange={setAreaTotalPersonalizada}
            error={errors.areaTotalPersonalizada}
            placeholder="10"
            min="0.01"
            max="10000"
            step="0.01"
          />
        )}

        <h3 className="text-lg font-semibold mt-6">Materiais da Fôrma</h3>

        <SelectField
          id="espessuraCompensado"
          label="Espessura do Compensado"
          value={espessuraCompensado}
          onChange={setEspessuraCompensado}
          options={Object.values(COMPENSADO_PRESETS).map(p => ({ value: String(p.espessura), label: p.label }))}
          error={errors.espessuraCompensado}
        />
        <NumberField
          id="espessuraCompensadoCustom"
          label="Espessura do Compensado (mm)"
          unit="mm"
          value={espessuraCompensado}
          onChange={setEspessuraCompensado}
          error={errors.espessuraCompensado}
          placeholder="12"
          min="1"
          max="50"
          step="1"
          hidden={Object.keys(COMPENSADO_PRESETS).includes(espessuraCompensado)}
        />

        <SelectField
          id="larguraTabua"
          label="Largura da Tábua"
          value={larguraTabua}
          onChange={setLarguraTabua}
          options={Object.values(TABUA_PRESETS).map(p => ({ value: String(p.largura), label: p.label }))}
          error={errors.larguraTabua}
        />
        <NumberField
          id="larguraTabuaCustom"
          label="Largura da Tábua (mm)"
          unit="mm"
          value={larguraTabua}
          onChange={setLarguraTabua}
          error={errors.larguraTabua}
          placeholder="100"
          min="10"
          max="300"
          step="1"
          hidden={Object.keys(TABUA_PRESETS).includes(larguraTabua)}
        />

        <SelectField
          id="espessuraTabua"
          label="Espessura da Tábua"
          value={espessuraTabua}
          onChange={setEspessuraTabua}
          options={Object.values(TABUA_PRESETS).map(p => ({ value: String(p.espessura), label: p.label }))}
          error={errors.espessuraTabua}
        />
        <NumberField
          id="espessuraTabuaCustom"
          label="Espessura da Tábua (mm)"
          unit="mm"
          value={espessuraTabua}
          onChange={setEspessuraTabua}
          error={errors.espessuraTabua}
          placeholder="25"
          min="10"
          max="100"
          step="1"
          hidden={Object.keys(TABUA_PRESETS).includes(espessuraTabua)}
        />

        {(tipoElemento === "viga" || tipoElemento === "laje-borda") && (
          <NumberField
            id="espacamentoEscoras"
            label="Espaçamento entre Escoras"
            unit="m"
            value={espacamentoEscoras}
            onChange={setEspacamentoEscoras}
            error={errors.espacamentoEscoras}
            placeholder="1.5"
            min="0.1"
            max="5"
            step="0.1"
          />
        )}

        <NumberField
          id="desperdicio"
          label="Margem de Desperdício"
          unit="%"
          value={desperdicio}
          onChange={setDesperdicio}
          error={errors.desperdicio}
          placeholder="10"
          min="0"
          max="30"
          step="1"
        />

        <h3 className="text-lg font-semibold mt-6">Preços Unitários (Opcional para Custo)</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Informe os preços para obter uma estimativa de custo total.
        </p>

        <NumberField
          id="precoCompensadoM2"
          label="Preço do Compensado"
          unit="R$/m²"
          value={precoCompensadoM2}
          onChange={setPrecoCompensadoM2}
          error={errors.precoCompensadoM2}
          placeholder="50.00"
          min="0"
          step="0.01"
        />
        <NumberField
          id="precoTabuaM"
          label="Preço da Tábua"
          unit="R$/m"
          value={precoTabuaM}
          onChange={setPrecoTabuaM}
          error={errors.precoTabuaM}
          placeholder="5.00"
          min="0"
          step="0.01"
        />
        <NumberField
          id="precoEscoraUn"
          label="Preço da Escora"
          unit="R$/un"
          value={precoEscoraUn}
          onChange={setPrecoEscoraUn}
          error={errors.precoEscoraUn}
          placeholder="15.00"
          min="0"
          step="0.01"
        />
        <NumberField
          id="precoPregoKg"
          label="Preço do Prego"
          unit="R$/kg"
          value={precoPregoKg}
          onChange={setPrecoPregoKg}
          error={errors.precoPregoKg}
          placeholder="10.00"
          min="0"
          step="0.01"
        />
        <NumberField
          id="precoOleoL"
          label="Preço do Óleo Desmoldante"
          unit="R$/L"
          value={precoOleoL}
          onChange={setPrecoOleoL}
          error={errors.precoOleoL}
          placeholder="20.00"
          min="0"
          step="0.01"
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
            { label: "Área Total de Fôrma", value: `${fmt(result.areaTotalFormaM2, 2)} m²` },
            { label: "Painéis de Compensado", value: `${fmt(result.paineisCompensado, 0)} un` },
            { label: "Comprimento de Tábuas", value: `${fmt(result.comprimentoTabuasM, 2)} m` },
            { label: "Número de Escoras", value: `${fmt(result.numeroEscoras, 0)} un` },
            { label: "Massa de Pregos", value: `${fmt(result.massaPregosKg, 2)} kg` },
            { label: "Óleo Desmoldante", value: `${fmt(result.oleoDesmoldanteL, 2)} L` },
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
