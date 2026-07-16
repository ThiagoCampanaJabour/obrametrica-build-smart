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
  calcEsquadrias,
  TipoEsquadria,
  MaterialEsquadria,
  TipoAbertura,
} from "@/lib/formulas";

const PATH = "/calculadora-de-esquadrias";

const BREADCRUMBS = [
  { label: "Início", href: "/" },
  { label: "Construção Civil", href: "/construcao-civil" },
  { label: "Calculadora de Esquadrias", href: PATH },
];

// Presets para os campos de seleção
const TIPOS_ESQUADRIA_OPTIONS = [
  { value: "Janela_Abrir", label: "Janela de Abrir" },
  { value: "Janela_Correr", label: "Janela de Correr" },
  { value: "Porta_Madeira", label: "Porta de Madeira" },
  { value: "Porta_Correr", label: "Porta de Correr" },
  { value: "Vitrô", label: "Vitrô" },
  { value: "Caixilho_Fixo", label: "Caixilho Fixo" },
  { value: "Personalizada", label: "Personalizada" },
];

const MATERIAL_ESQUADRIA_OPTIONS = [
  { value: "Alumínio", label: "Alumínio" },
  { value: "PVC", label: "PVC" },
  { value: "Madeira", label: "Madeira" },
  { value: "Ferro", label: "Ferro" },
  { value: "Aço_Galvanizado", label: "Aço Galvanizado" },
];

const TIPO_ABERTURA_OPTIONS = [
  { value: "Fixo", label: "Fixo" },
  { value: "1F", label: "1 Folha" },
  { value: "2F", label: "2 Folhas" },
  { value: "Correr", label: "Correr" },
  { value: "Basculante", label: "Basculante" },
];

const ESPESSURA_VIDRO_OPTIONS = [
  { value: "4", label: "4 mm (Float)" },
  { value: "6", label: "6 mm (Float)" },
  { value: "8", label: "8 mm (Temperado)" },
  { value: "10", label: "10 mm (Temperado)" },
  { value: "custom", label: "Personalizada" },
];

export const Route = createFileRoute("/calculadora-de-esquadrias")({
  head: () =>
    pageHead({
      title: "Calculadora de Esquadrias — Portas, Janelas, Vidros | ObraMétrica",
      description:
        "Estime quantidades, áreas, perímetros e custos de esquadrias (portas, janelas, vitrôs), vidros, ferragens e materiais auxiliares.",
      path: PATH,
      breadcrumbs: BREADCRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Calculadora de Esquadrias",
        url: `https://obrametrica.com.br${PATH}`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      extraSchemas: allSchemasFor(PATH),
    }),
  component: EsquadriasCalculator,
});

function EsquadriasCalculator() {
  const [tipoEsquadria, setTipoEsquadria] = useState<TipoEsquadria>("Janela_Abrir");
  const [materialEsquadria, setMaterialEsquadria] = useState<MaterialEsquadria>("Alumínio");
  const [larguraM, setLarguraM] = useState("1.20");
  const [alturaM, setAlturaM] = useState("1.00");
  const [numUnidades, setNumUnidades] = useState("1");
  const [tipoAbertura, setTipoAbertura] = useState<TipoAbertura>("1F");
  const [espessuraVidroMM, setEspessuraVidroMM] = useState("4");
  const [customEspessuraVidroMM, setCustomEspessuraVidroMM] = useState("");
  const [folgaVidroMM, setFolgaVidroMM] = useState("6");
  const [perdaPct, setPerdaPct] = useState("7");

  // Preços unitários (opcionais)
  const [precoPorMetroPerfil, setPrecoPorMetroPerfil] = useState("");
  const [precoPorM2Vidro, setPrecoPorM2Vidro] = useState("");
  const [precoPorUnidadeFerragem, setPrecoPorUnidadeFerragem] = useState("");
  const [precoPorMetroBorracha, setPrecoPorMetroBorracha] = useState("");

  const [result, setResult] = useState<null | {
    areaVaoTotalM2: number;
    perimetroVaoTotalM: number;
    areaVidroPorPecaM2: number;
    areaVidroTotalM2: number;
    massaVidroTotalKg: number;
    comprimentoPerfisTotalM: number;
    massaPerfisTotalKg: number;
    ferragens: {
      dobradicas?: number;
      fechaduras?: number;
      roldanas?: number;
      trilhos_m?: number;
      puxadores?: number;
    };
    comprimentoBorrachaTotalM: number;
    custoEstimadoTotal: number;
  }>(null);

  const [errors, setErrors] = useState<{
    larguraM?: string;
    alturaM?: string;
    numUnidades?: string;
    espessuraVidroMM?: string;
    customEspessuraVidroMM?: string;
    folgaVidroMM?: string;
    perdaPct?: string;
    precoPorMetroPerfil?: string;
    precoPorM2Vidro?: string;
    precoPorUnidadeFerragem?: string;
    precoPorMetroBorracha?: string;
    submit?: string;
  }>({});

  const validatePositive = (value: string, fieldName: string, min = 0.01, max = 100000) => {
    const num = parseFloat(value);
    if (isNaN(num) || num < min || num > max) {
      return `${fieldName} deve ser um número entre ${min} e ${max}.`;
    }
    return undefined;
  };

  const validateInteger = (value: string, fieldName: string, min = 1, max = 1000) => {
    const num = parseInt(value);
    if (isNaN(num) || num < min || num > max || !Number.isInteger(num)) {
      return `${fieldName} deve ser um número inteiro entre ${min} e ${max}.`;
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

  // Efeito para ajustar o tipo de abertura padrão ao mudar o tipo de esquadria
  useEffect(() => {
    if (tipoEsquadria === "Janela_Abrir" || tipoEsquadria === "Porta_Madeira") {
      setTipoAbertura("1F");
    } else if (tipoEsquadria === "Janela_Correr" || tipoEsquadria === "Porta_Correr") {
      setTipoAbertura("Correr");
    } else if (tipoEsquadria === "Vitrô") {
      setTipoAbertura("Basculante");
    } else if (tipoEsquadria === "Caixilho_Fixo" || tipoEsquadria === "Personalizada") {
      setTipoAbertura("Fixo");
    }
  }, [tipoEsquadria]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    let currentResult = null;

    try {
      newErrors.larguraM = validatePositive(larguraM, "Largura", 0.1, 20);
      newErrors.alturaM = validatePositive(alturaM, "Altura", 0.1, 20);
      newErrors.numUnidades = validateInteger(numUnidades, "Número de Unidades", 1, 1000);
      newErrors.folgaVidroMM = validatePositive(folgaVidroMM, "Folga do Vidro", 0, 50);
      newErrors.perdaPct = validatePercentage(perdaPct, "Perda", 0, 20);

      let vidroEspessura = parseFloat(espessuraVidroMM);
      if (espessuraVidroMM === "custom") {
        newErrors.customEspessuraVidroMM = validatePositive(customEspessuraVidroMM, "Espessura do Vidro Personalizada", 2, 25);
        vidroEspessura = parseFloat(customEspessuraVidroMM);
      } else {
        newErrors.espessuraVidroMM = validatePositive(espessuraVidroMM, "Espessura do Vidro", 2, 25);
      }

      // Validação de preços (opcionais, mas se preenchidos, devem ser válidos)
      if (precoPorMetroPerfil.trim()) newErrors.precoPorMetroPerfil = validatePositive(precoPorMetroPerfil, "Preço por Metro de Perfil", 0);
      if (precoPorM2Vidro.trim()) newErrors.precoPorM2Vidro = validatePositive(precoPorM2Vidro, "Preço por m² de Vidro", 0);
      if (precoPorUnidadeFerragem.trim()) newErrors.precoPorUnidadeFerragem = validatePositive(precoPorUnidadeFerragem, "Preço por Unidade de Ferragem", 0);
      if (precoPorMetroBorracha.trim()) newErrors.precoPorMetroBorracha = validatePositive(precoPorMetroBorracha, "Preço por Metro de Borracha", 0);

      if (Object.values(newErrors).some(e => e !== undefined)) {
        setErrors(newErrors);
        setResult(null);
        return;
      }

      const params = {
        tipoEsquadria: tipoEsquadria,
        materialEsquadria: materialEsquadria,
        larguraM: parseFloat(larguraM),
        alturaM: parseFloat(alturaM),
        numUnidades: parseInt(numUnidades),
        tipoAbertura: tipoAbertura,
        espessuraVidroMM: vidroEspessura,
        folgaVidroMM: parseFloat(folgaVidroMM),
        perdaPct: parseFloat(perdaPct),
        precoPorMetroPerfil: parseFloat(precoPorMetroPerfil) || undefined,
        precoPorM2Vidro: parseFloat(precoPorM2Vidro) || undefined,
        precoPorUnidadeFerragem: parseFloat(precoPorUnidadeFerragem) || undefined,
        precoPorMetroBorracha: parseFloat(precoPorMetroBorracha) || undefined,
      };

      const calcResult = calcEsquadrias(params);

      currentResult = { ...calcResult };
      setResult(currentResult);
      setErrors({});

    } catch (error: any) {
      setErrors({ submit: error.message });
      setResult(null);
    }
  };

  const reset = () => {
    setTipoEsquadria("Janela_Abrir");
    setMaterialEsquadria("Alumínio");
    setLarguraM("1.20");
    setAlturaM("1.00");
    setNumUnidades("1");
    setTipoAbertura("1F");
    setEspessuraVidroMM("4");
    setCustomEspessuraVidroMM("");
    setFolgaVidroMM("6");
    setPerdaPct("7");
    setPrecoPorMetroPerfil("");
    setPrecoPorM2Vidro("");
    setPrecoPorUnidadeFerragem("");
    setPrecoPorMetroBorracha("");
    setResult(null);
    setErrors({});
  };

  const isCustomEspessuraVidro = espessuraVidroMM === "custom";

  return (
    <CalculatorShell
      extrasId={PATH}
      title="Calculadora de Esquadrias"
      description="Estime quantidades, áreas, perímetros e custos de esquadrias (portas, janelas, vitrôs), vidros, ferragens e materiais auxiliares."
      breadcrumbs={BREADCRUMBS}
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <SelectField
          id="tipoEsquadria"
          label="Tipo de Esquadria"
          value={tipoEsquadria}
          onChange={(e) => setTipoEsquadria(e.target.value as TipoEsquadria)}
          options={TIPOS_ESQUADRIA_OPTIONS}
        />

        <SelectField
          id="materialEsquadria"
          label="Material da Esquadria"
          value={materialEsquadria}
          onChange={(e) => setMaterialEsquadria(e.target.value as MaterialEsquadria)}
          options={MATERIAL_ESQUADRIA_OPTIONS}
        />

        <NumberField
          id="larguraM"
          label="Largura do Vão"
          unit="m"
          value={larguraM}
          onChange={setLarguraM}
          error={errors.larguraM}
          placeholder="1.20"
          min="0.1"
          max="20"
        />

        <NumberField
          id="alturaM"
          label="Altura do Vão"
          unit="m"
          value={alturaM}
          onChange={setAlturaM}
          error={errors.alturaM}
          placeholder="1.00"
          min="0.1"
          max="20"
        />

        <NumberField
          id="numUnidades"
          label="Número de Unidades"
          unit="unidades"
          value={numUnidades}
          onChange={setNumUnidades}
          error={errors.numUnidades}
          placeholder="1"
          min="1"
          max="1000"
        />

        <SelectField
          id="tipoAbertura"
          label="Tipo de Abertura"
          value={tipoAbertura}
          onChange={(e) => setTipoAbertura(e.target.value as TipoAbertura)}
          options={TIPO_ABERTURA_OPTIONS}
        />

        <SelectField
          id="espessuraVidroMM"
          label="Espessura do Vidro"
          value={espessuraVidroMM}
          onChange={(e) => setEspessuraVidroMM(e.target.value)}
          options={ESPESSURA_VIDRO_OPTIONS}
          error={errors.espessuraVidroMM}
        />

        {isCustomEspessuraVidro && (
          <NumberField
            id="customEspessuraVidroMM"
            label="Espessura do Vidro (Personalizada)"
            unit="mm"
            value={customEspessuraVidroMM}
            onChange={setCustomEspessuraVidroMM}
            error={errors.customEspessuraVidroMM}
            placeholder="6"
            min="2"
            max="25"
          />
        )}

        <NumberField
          id="folgaVidroMM"
          label="Folga para o Vidro"
          unit="mm"
          value={folgaVidroMM}
          onChange={setFolgaVidroMM}
          error={errors.folgaVidroMM}
          placeholder="6"
          min="0"
          max="50"
        />

        <NumberField
          id="perdaPct"
          label="Perda para Cortes"
          unit="%"
          value={perdaPct}
          onChange={setPerdaPct}
          error={errors.perdaPct}
          placeholder="7"
          min="0"
          max="20"
        />

        <h3 className="text-lg font-semibold mt-6">Preços Unitários (Opcional para Custo)</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Informe os preços para obter uma estimativa de custo total.
        </p>

        <NumberField
          id="precoPorMetroPerfil"
          label="Preço por Metro de Perfil"
          unit="R$/m"
          value={precoPorMetroPerfil}
          onChange={setPrecoPorMetroPerfil}
          error={errors.precoPorMetroPerfil}
          placeholder="50.00"
          min="0"
          step="0.01"
        />
        <NumberField
          id="precoPorM2Vidro"
          label="Preço por m² de Vidro"
          unit="R$/m²"
          value={precoPorM2Vidro}
          onChange={setPrecoPorM2Vidro}
          error={errors.precoPorM2Vidro}
          placeholder="120.00"
          min="0"
          step="0.01"
        />
        <NumberField
          id="precoPorUnidadeFerragem"
          label="Preço por Unidade de Ferragem"
          unit="R$/unidade"
          value={precoPorUnidadeFerragem}
          onChange={setPrecoPorUnidadeFerragem}
          error={errors.precoPorUnidadeFerragem}
          placeholder="15.00"
          min="0"
          step="0.01"
        />
        <NumberField
          id="precoPorMetroBorracha"
          label="Preço por Metro de Borracha"
          unit="R$/m"
          value={precoPorMetroBorracha}
          onChange={setPrecoPorMetroBorracha}
          error={errors.precoPorMetroBorracha}
          placeholder="5.00"
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
            { label: "Área Total do Vão", value: `${fmt(result.areaVaoTotalM2, 2)} m²` },
            { label: "Perímetro Total do Vão", value: `${fmt(result.perimetroVaoTotalM, 2)} m` },
            { label: "Área de Vidro por Peça", value: `${fmt(result.areaVidroPorPecaM2, 2)} m²` },
            { label: "Área Total de Vidro", value: `${fmt(result.areaVidroTotalM2, 2)} m²` },
            { label: "Massa Total de Vidro", value: `${fmt(result.massaVidroTotalKg, 2)} kg` },
            { label: "Comprimento Total de Perfis", value: `${fmt(result.comprimentoPerfisTotalM, 2)} m` },
            { label: "Massa Total de Perfis", value: `${fmt(result.massaPerfisTotalKg, 2)} kg` },
            { label: "Comprimento Total de Borracha", value: `${fmt(result.comprimentoBorrachaTotalM, 2)} m` },
            (result.ferragens.dobradicas || 0) > 0 && { label: "Dobradiças", value: `${fmt(result.ferragens.dobradicas || 0, 0)} un` },
            (result.ferragens.fechaduras || 0) > 0 && { label: "Fechaduras", value: `${fmt(result.ferragens.fechaduras || 0, 0)} un` },
            (result.ferragens.roldanas || 0) > 0 && { label: "Roldanas", value: `${fmt(result.ferragens.roldanas || 0, 0)} un` },
            (result.ferragens.trilhos_m || 0) > 0 && { label: "Trilhos", value: `${fmt(result.ferragens.trilhos_m || 0, 2)} m` },
            (result.ferragens.puxadores || 0) > 0 && { label: "Puxadores", value: `${fmt(result.ferragens.puxadores || 0, 0)} un` },
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
