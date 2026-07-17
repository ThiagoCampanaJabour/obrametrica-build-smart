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
import {
  calcImpermeabilizacao,
  TipoSistemaImpermeabilizacao,
} from "@/lib/formulas";

const PATH = "/calculadora-de-impermeabilizacao";

const BREADCRUMBS = [
  { label: "Início", href: "/" },
  { label: "Construção Civil", href: "/construcao-civil" },
  { label: "Calculadora de Impermeabilização", href: PATH },
];

// Presets para os campos de seleção
const TIPO_SISTEMA_OPTIONS = [
  { value: "Manta_Liquida", label: "Manta Líquida / Membrana Líquida" },
  { value: "Manta_Asfaltica", label: "Manta Asfáltica (rolos)" },
  { value: "Argamassa_Polimerica", label: "Argamassa Polimérica" },
  // { value: "EPDM", label: "Manta EPDM" }, // Opcional, mais complexo
  // { value: "Hibrido", label: "Sistema Híbrido" }, // Opcional, mais complexo
];

export const Route = createFileRoute("/calculadora-de-impermeabilizacao")({
  head: () =>
    pageHead({
      title: "Calculadora de Impermeabilização — Manta Líquida, Asfáltica | ObraMétrica",
      description:
        "Estime produtos e quantidades para impermeabilização de lajes, terraços, banheiros e piscinas.",
      path: PATH,
      breadcrumbs: BREADCRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Calculadora de Impermeabilização",
        url: `https://obrametrica.com.br${PATH}`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      extraSchemas: allSchemasFor(PATH),
    }),
  component: ImpermeabilizacaoCalculator,
});

function ImpermeabilizacaoCalculator() {
  const [areaTotalM2, setAreaTotalM2] = useState("50");
  const [areaVaoM2, setAreaVaoM2] = useState("");
  const [perimetroCantosM, setPerimetroCantosM] = useState("20");
  const [numRalos, setNumRalos] = useState("1");
  const [tipoSistema, setTipoSistema] = useState<TipoSistemaImpermeabilizacao>("Manta_Liquida");
  const [numDemaosMantaLiquida, setNumDemaosMantaLiquida] = useState("2");
  const [rendimentoMantaLiquidaKgM2Demaos, setRendimentoMantaLiquidaKgM2Demaos] = useState("1.5");
  const [numDemaosArgamassaPolimerica, setNumDemaosArgamassaPolimerica] = useState("2");
  const [rendimentoArgamassaPolimericaKgM2Demaos, setRendimentoArgamassaPolimericaKgM2Demaos] = useState("2.0");
  const [rendimentoPrimerLM2, setRendimentoPrimerLM2] = useState("0.1");
  const [areaPorRoloMantaAsfalticaM2, setAreaPorRoloMantaAsfalticaM2] = useState("10");
  const [perdaPct, setPerdaPct] = useState("10");

  // Preços unitários (opcionais)
  const [precoMantaLiquidaKg, setPrecoMantaLiquidaKg] = useState("");
  const [precoMantaAsfalticaRolo, setPrecoMantaAsfalticaRolo] = useState("");
  const [precoArgamassaPolimericaKg, setPrecoArgamassaPolimericaKg] = useState("");
  const [precoPrimerL, setPrecoPrimerL] = useState("");
  const [precoTelaReforcoM2, setPrecoTelaReforcoM2] = useState("");
  const [precoFitaCantoM, setPrecoFitaCantoM] = useState("");
  const [precoRaloUnidade, setPrecoRaloUnidade] = useState("");

  const [result, setResult] = useState<null | {
    areaLiquidaM2: number;
    consumoMantaLiquidaKg?: number;
    consumoArgamassaPolimericaKg?: number;
    consumoPrimerL?: number;
    rolosMantaAsfaltica?: number;
    comprimentoFitaCantoM?: number;
    numRalosCalculado?: number;
    custoEstimadoTotal: number;
  }>(null);

  const [errors, setErrors] = useState<{
    areaTotalM2?: string;
    areaVaoM2?: string;
    perimetroCantosM?: string;
    numRalos?: string;
    numDemaosMantaLiquida?: string;
    rendimentoMantaLiquidaKgM2Demaos?: string;
    numDemaosArgamassaPolimerica?: string;
    rendimentoArgamassaPolimericaKgM2Demaos?: string;
    rendimentoPrimerLM2?: string;
    areaPorRoloMantaAsfalticaM2?: string;
    perdaPct?: string;
    precoMantaLiquidaKg?: string;
    precoMantaAsfalticaRolo?: string;
    precoArgamassaPolimericaKg?: string;
    precoPrimerL?: string;
    precoTelaReforcoM2?: string;
    precoFitaCantoM?: string;
    precoRaloUnidade?: string;
    submit?: string;
  }>({});

  const validatePositive = (value: string, fieldName: string, min = 0, max = 100000) => {
    const num = parseFloat(value);
    if (isNaN(num) || num < min || num > max) {
      return `${fieldName} deve ser um número entre ${min} e ${max}.`;
    }
    return undefined;
  };

  const validateInteger = (value: string, fieldName: string, min = 0, max = 10) => {
    const num = parseInt(value);
    if (isNaN(num) || num < min || num > max || !Number.isInteger(num)) {
      return `${fieldName} deve ser um número inteiro entre ${min} e ${max}.`;
    }
    return undefined;
  };

  const validatePercentage = (value: string, fieldName: string, min = 0, max = 30) => {
    const num = parseFloat(value);
    if (isNaN(num) || num < min || num > max) {
      return `${fieldName} deve ser um número entre ${min} e ${max}%.`;
    }
    return undefined;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    let currentResult = null;

    try {
      newErrors.areaTotalM2 = validatePositive(areaTotalM2, "Área Total", 0.1, 10000);
      if (areaVaoM2.trim()) newErrors.areaVaoM2 = validatePositive(areaVaoM2, "Área de Vãos", 0);
      if (perimetroCantosM.trim()) newErrors.perimetroCantosM = validatePositive(perimetroCantosM, "Perímetro de Cantos", 0);
      if (numRalos.trim()) newErrors.numRalos = validateInteger(numRalos, "Número de Ralos", 0, 10);
      newErrors.perdaPct = validatePercentage(perdaPct, "Perda", 0, 30);

      // Validações específicas por sistema
      if (tipoSistema === "Manta_Liquida") {
        newErrors.numDemaosMantaLiquida = validateInteger(numDemaosMantaLiquida, "Número de Demãos", 1, 5);
        newErrors.rendimentoMantaLiquidaKgM2Demaos = validatePositive(rendimentoMantaLiquidaKgM2Demaos, "Rendimento Manta Líquida", 0.5, 5);
        newErrors.rendimentoPrimerLM2 = validatePositive(rendimentoPrimerLM2, "Rendimento Primer", 0.01, 0.5);
      } else if (tipoSistema === "Manta_Asfaltica") {
        newErrors.areaPorRoloMantaAsfalticaM2 = validatePositive(areaPorRoloMantaAsfalticaM2, "Área por Rolo", 1, 50);
        newErrors.rendimentoPrimerLM2 = validatePositive(rendimentoPrimerLM2, "Rendimento Primer", 0.01, 0.5);
      } else if (tipoSistema === "Argamassa_Polimerica") {
        newErrors.numDemaosArgamassaPolimerica = validateInteger(numDemaosArgamassaPolimerica, "Número de Demãos", 1, 5);
        newErrors.rendimentoArgamassaPolimericaKgM2Demaos = validatePositive(rendimentoArgamassaPolimericaKgM2Demaos, "Rendimento Argamassa Polimérica", 1, 10);
      }

      // Validação de preços (opcionais, mas se preenchidos, devem ser válidos)
      if (precoMantaLiquidaKg.trim()) newErrors.precoMantaLiquidaKg = validatePositive(precoMantaLiquidaKg, "Preço Manta Líquida", 0);
      if (precoMantaAsfalticaRolo.trim()) newErrors.precoMantaAsfalticaRolo = validatePositive(precoMantaAsfalticaRolo, "Preço Manta Asfáltica", 0);
      if (precoArgamassaPolimericaKg.trim()) newErrors.precoArgamassaPolimericaKg = validatePositive(precoArgamassaPolimericaKg, "Preço Argamassa Polimérica", 0);
      if (precoPrimerL.trim()) newErrors.precoPrimerL = validatePositive(precoPrimerL, "Preço Primer", 0);
      if (precoTelaReforcoM2.trim()) newErrors.precoTelaReforcoM2 = validatePositive(precoTelaReforcoM2, "Preço Tela Reforço", 0);
      if (precoFitaCantoM.trim()) newErrors.precoFitaCantoM = validatePositive(precoFitaCantoM, "Preço Fita de Canto", 0);
      if (precoRaloUnidade.trim()) newErrors.precoRaloUnidade = validatePositive(precoRaloUnidade, "Preço Ralo", 0);

      if (Object.values(newErrors).some(e => e !== undefined)) {
        setErrors(newErrors);
        setResult(null);
        return;
      }

      const params = {
        areaTotalM2: parseFloat(areaTotalM2),
        areaVaoM2: areaVaoM2.trim() ? parseFloat(areaVaoM2) : undefined,
        perimetroCantosM: perimetroCantosM.trim() ? parseFloat(perimetroCantosM) : undefined,
        numRalos: numRalos.trim() ? parseInt(numRalos) : undefined,
        tipoSistema: tipoSistema,
        numDemaosMantaLiquida: tipoSistema === "Manta_Liquida" ? parseInt(numDemaosMantaLiquida) : undefined,
        rendimentoMantaLiquidaKgM2Demaos: tipoSistema === "Manta_Liquida" ? parseFloat(rendimentoMantaLiquidaKgM2Demaos) : undefined,
        numDemaosArgamassaPolimerica: tipoSistema === "Argamassa_Polimerica" ? parseInt(numDemaosArgamassaPolimerica) : undefined,
        rendimentoArgamassaPolimericaKgM2Demaos: tipoSistema === "Argamassa_Polimerica" ? parseFloat(rendimentoArgamassaPolimericaKgM2Demaos) : undefined,
        rendimentoPrimerLM2: (tipoSistema === "Manta_Liquida" || tipoSistema === "Manta_Asfaltica") ? parseFloat(rendimentoPrimerLM2) : undefined,
        areaPorRoloMantaAsfalticaM2: tipoSistema === "Manta_Asfaltica" ? parseFloat(areaPorRoloMantaAsfalticaM2) : undefined,
        perdaPct: parseFloat(perdaPct),
        precoMantaLiquidaKg: precoMantaLiquidaKg.trim() ? parseFloat(precoMantaLiquidaKg) : undefined,
        precoMantaAsfalticaRolo: precoMantaAsfalticaRolo.trim() ? parseFloat(precoMantaAsfalticaRolo) : undefined,
        precoArgamassaPolimericaKg: precoArgamassaPolimericaKg.trim() ? parseFloat(precoArgamassaPolimericaKg) : undefined,
        precoPrimerL: precoPrimerL.trim() ? parseFloat(precoPrimerL) : undefined,
        precoTelaReforcoM2: precoTelaReforcoM2.trim() ? parseFloat(precoTelaReforcoM2) : undefined,
        precoFitaCantoM: precoFitaCantoM.trim() ? parseFloat(precoFitaCantoM) : undefined,
        precoRaloUnidade: precoRaloUnidade.trim() ? parseFloat(precoRaloUnidade) : undefined,
      };

      const calcResult = calcImpermeabilizacao(params);

      currentResult = { ...calcResult };
      setResult(currentResult);
      setErrors({});

    } catch (error: any) {
      setErrors({ submit: error.message });
      setResult(null);
    }
  };

  const reset = () => {
    setAreaTotalM2("50");
    setAreaVaoM2("");
    setPerimetroCantosM("20");
    setNumRalos("1");
    setTipoSistema("Manta_Liquida");
    setNumDemaosMantaLiquida("2");
    setRendimentoMantaLiquidaKgM2Demaos("1.5");
    setNumDemaosArgamassaPolimerica("2");
    setRendimentoArgamassaPolimericaKgM2Demaos("2.0");
    setRendimentoPrimerLM2("0.1");
    setAreaPorRoloMantaAsfalticaM2("10");
    setPerdaPct("10");
    setPrecoMantaLiquidaKg("");
    setPrecoMantaAsfalticaRolo("");
    setPrecoArgamassaPolimericaKg("");
    setPrecoPrimerL("");
    setPrecoTelaReforcoM2("");
    setPrecoFitaCantoM("");
    setPrecoRaloUnidade("");
    setResult(null);
    setErrors({});
  };

  return (
    <CalculatorShell
      extrasId={PATH}
      title="Calculadora de Impermeabilização"
      description="Estime produtos e quantidades para impermeabilização de lajes, terraços, banheiros e piscinas."
      breadcrumbs={BREADCRUMBS}
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <NumberField
          id="areaTotalM2"
          label="Área Total a Impermeabilizar"
          unit="m²"
          value={areaTotalM2}
          onChange={setAreaTotalM2}
          error={errors.areaTotalM2}
          placeholder="50"
          min="0.1"
          max="10000"
        />

        <NumberField
          id="areaVaoM2"
          label="Área de Vãos a Subtrair (opcional)"
          unit="m²"
          value={areaVaoM2}
          onChange={setAreaVaoM2}
          error={errors.areaVaoM2}
          placeholder="0"
          min="0"
          max="10000"
        />

        <NumberField
          id="perimetroCantosM"
          label="Perímetro de Cantos (opcional)"
          unit="m"
          value={perimetroCantosM}
          onChange={setPerimetroCantosM}
          error={errors.perimetroCantosM}
          placeholder="20"
          min="0"
          max="1000"
        />

        <NumberField
          id="numRalos"
          label="Número de Ralos (opcional)"
          unit="unidades"
          value={numRalos}
          onChange={setNumRalos}
          error={errors.numRalos}
          placeholder="1"
          min="0"
          max="10"
        />

        <SelectField
          id="tipoSistema"
          label="Tipo de Sistema de Impermeabilização"
          value={tipoSistema}
          onChange={(e) => setTipoSistema(e.target.value as TipoSistemaImpermeabilizacao)}
          options={TIPO_SISTEMA_OPTIONS}
        />

        {tipoSistema === "Manta_Liquida" && (
          <>
            <NumberField
              id="numDemaosMantaLiquida"
              label="Número de Demãos (Manta Líquida)"
              unit="demãos"
              value={numDemaosMantaLiquida}
              onChange={setNumDemaosMantaLiquida}
              error={errors.numDemaosMantaLiquida}
              placeholder="2"
              min="1"
              max="5"
            />
            <NumberField
              id="rendimentoMantaLiquidaKgM2Demaos"
              label="Rendimento Manta Líquida"
              unit="kg/m²/demão"
              value={rendimentoMantaLiquidaKgM2Demaos}
              onChange={setRendimentoMantaLiquidaKgM2Demaos}
              error={errors.rendimentoMantaLiquidaKgM2Demaos}
              placeholder="1.5"
              min="0.5"
              max="5"
              step="0.1"
            />
            <NumberField
              id="rendimentoPrimerLM2"
              label="Rendimento Primer"
              unit="L/m²"
              value={rendimentoPrimerLM2}
              onChange={setRendimentoPrimerLM2}
              error={errors.rendimentoPrimerLM2}
              placeholder="0.1"
              min="0.01"
              max="0.5"
              step="0.01"
            />
          </>
        )}

        {tipoSistema === "Manta_Asfaltica" && (
          <>
            <NumberField
              id="areaPorRoloMantaAsfalticaM2"
              label="Área por Rolo de Manta Asfáltica"
              unit="m²/rolo"
              value={areaPorRoloMantaAsfalticaM2}
              onChange={setAreaPorRoloMantaAsfalticaM2}
              error={errors.areaPorRoloMantaAsfalticaM2}
              placeholder="10"
              min="1"
              max="50"
            />
            <NumberField
              id="rendimentoPrimerLM2"
              label="Rendimento Primer"
              unit="L/m²"
              value={rendimentoPrimerLM2}
              onChange={setRendimentoPrimerLM2}
              error={errors.rendimentoPrimerLM2}
              placeholder="0.1"
              min="0.01"
              max="0.5"
              step="0.01"
            />
          </>
        )}

        {tipoSistema === "Argamassa_Polimerica" && (
          <>
            <NumberField
              id="numDemaosArgamassaPolimerica"
              label="Número de Demãos (Argamassa Polimérica)"
              unit="demãos"
              value={numDemaosArgamassaPolimerica}
              onChange={setNumDemaosArgamassaPolimerica}
              error={errors.numDemaosArgamassaPolimerica}
              placeholder="2"
              min="1"
              max="5"
            />
            <NumberField
              id="rendimentoArgamassaPolimericaKgM2Demaos"
              label="Rendimento Argamassa Polimérica"
              unit="kg/m²/demão"
              value={rendimentoArgamassaPolimericaKgM2Demaos}
              onChange={setRendimentoArgamassaPolimericaKgM2Demaos}
              error={errors.rendimentoArgamassaPolimericaKgM2Demaos}
              placeholder="2.0"
              min="1"
              max="10"
              step="0.1"
            />
          </>
        )}

        <NumberField
          id="perdaPct"
          label="Perda/Desperdício"
          unit="%"
          value={perdaPct}
          onChange={setPerdaPct}
          error={errors.perdaPct}
          placeholder="10"
          min="0"
          max="30"
        />

        <h3 className="text-lg font-semibold mt-6">Preços Unitários (Opcional para Custo)</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Informe os preços para obter uma estimativa de custo total.
        </p>

        {tipoSistema === "Manta_Liquida" && (
          <NumberField
            id="precoMantaLiquidaKg"
            label="Preço Manta Líquida"
            unit="R$/kg"
            value={precoMantaLiquidaKg}
            onChange={setPrecoMantaLiquidaKg}
            error={errors.precoMantaLiquidaKg}
            placeholder="25.00"
            min="0"
            step="0.01"
          />
        )}
        {tipoSistema === "Manta_Asfaltica" && (
          <NumberField
            id="precoMantaAsfalticaRolo"
            label="Preço Manta Asfáltica"
            unit="R$/rolo"
            value={precoMantaAsfalticaRolo}
            onChange={setPrecoMantaAsfalticaRolo}
            error={errors.precoMantaAsfalticaRolo}
            placeholder="150.00"
            min="0"
            step="0.01"
          />
        )}
        {tipoSistema === "Argamassa_Polimerica" && (
          <NumberField
            id="precoArgamassaPolimericaKg"
            label="Preço Argamassa Polimérica"
            unit="R$/kg"
            value={precoArgamassaPolimericaKg}
            onChange={setPrecoArgamassaPolimericaKg}
            error={errors.precoArgamassaPolimericaKg}
            placeholder="10.00"
            min="0"
            step="0.01"
          />
        )}
        {(tipoSistema === "Manta_Liquida" || tipoSistema === "Manta_Asfaltica") && (
          <NumberField
            id="precoPrimerL"
            label="Preço Primer"
            unit="R$/L"
            value={precoPrimerL}
            onChange={setPrecoPrimerL}
            error={errors.precoPrimerL}
            placeholder="30.00"
            min="0"
            step="0.01"
          />
        )}
        {(tipoSistema === "Manta_Liquida" || tipoSistema === "Argamassa_Polimerica") && (
          <NumberField
            id="precoTelaReforcoM2"
            label="Preço Tela de Reforço"
            unit="R$/m²"
            value={precoTelaReforcoM2}
            onChange={setPrecoTelaReforcoM2}
            error={errors.precoTelaReforcoM2}
            placeholder="5.00"
            min="0"
            step="0.01"
          />
        )}
        {(tipoSistema === "Manta_Liquida" || tipoSistema === "Argamassa_Polimerica") && (
          <NumberField
            id="precoFitaCantoM"
            label="Preço Fita de Canto"
            unit="R$/m"
            value={precoFitaCantoM}
            onChange={setPrecoFitaCantoM}
            error={errors.precoFitaCantoM}
            placeholder="2.00"
            min="0"
            step="0.01"
          />
        )}
        <NumberField
          id="precoRaloUnidade"
          label="Preço Ralo"
          unit="R$/unidade"
          value={precoRaloUnidade}
          onChange={setPrecoRaloUnidade}
          error={errors.precoRaloUnidade}
          placeholder="50.00"
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
            { label: "Área Líquida Impermeabilizada", value: `${fmt(result.areaLiquidaM2, 2)} m²` },
            (result.consumoMantaLiquidaKg || 0) > 0 && { label: "Manta Líquida", value: `${fmt(result.consumoMantaLiquidaKg || 0, 2)} kg` },
            (result.consumoArgamassaPolimericaKg || 0) > 0 && { label: "Argamassa Polimérica", value: `${fmt(result.consumoArgamassaPolimericaKg || 0, 2)} kg` },
            (result.consumoPrimerL || 0) > 0 && { label: "Primer", value: `${fmt(result.consumoPrimerL || 0, 2)} L` },
            (result.rolosMantaAsfaltica || 0) > 0 && { label: "Manta Asfáltica", value: `${fmt(result.rolosMantaAsfaltica || 0, 0)} rolos` },
            (result.comprimentoFitaCantoM || 0) > 0 && { label: "Fita de Canto", value: `${fmt(result.comprimentoFitaCantoM || 0, 2)} m` },
            (result.numRalosCalculado || 0) > 0 && { label: "Ralos", value: `${fmt(result.numRalosCalculado || 0, 0)} unidades` },
            result.custoEstimadoTotal > 0
              ? {
                  label: "Custo Estimado Total",
                  value: `R$ ${fmt(result.custoEstimadoTotal, 2)}`,
                  highlight: true,
                }
              : null,
          ].filter(Boolean)}
        />
      )}
    </CalculatorShell>
  );
}
