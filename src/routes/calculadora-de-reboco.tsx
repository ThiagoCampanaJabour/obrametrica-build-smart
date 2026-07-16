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
  calcReboco,
  TipoServicoReboco,
  TracoReboco,
} from "@/lib/formulas";

const PATH = "/calculadora-de-reboco";

const BREADCRUMBS = [
  { label: "Início", href: "/" },
  { label: "Construção Civil", href: "/construcao-civil" },
  { label: "Calculadora de Reboco", href: PATH },
];

export const Route = createFileRoute("/calculadora-de-reboco")({
  head: () =>
    pageHead({
      title: "Calculadora de Reboco — Cimento, Areia, Cal | ObraMétrica",
      description:
        "Estime materiais (cimento, areia, cal, massa pronta) e volumes para reboco de paredes internas/externas e chapisco.",
      path: PATH,
      breadcrumbs: BREADCRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Calculadora de Reboco",
        url: `https://obrametrica.com.br${PATH}`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      extraSchemas: allSchemasFor(PATH),
    }),
  component: RebocoCalculator,
});

function RebocoCalculator() {
  const [tipoServico, setTipoServico] = useState<TipoServicoReboco>("reboco-grosso");
  const [area, setArea] = useState("50"); // m²
  const [espessura, setEspessura] = useState("15"); // mm
  const [traco, setTraco] = useState<TracoReboco>("1:4");
  const [tracoCustom, setTracoCustom] = useState("1:4:0.5"); // cimento:areia:cal
  const [desperdicio, setDesperdicio] = useState("10"); // %
  const [fatorEmpacotamento, setFatorEmpacotamento] = useState("1.3"); // Fator de empacotamento

  // Preços unitários (opcionais)
  const [precoCimentoSaco, setPrecoCimentoSaco] = useState("");
  const [precoAreiaM3, setPrecoAreiaM3] = useState("");
  const [precoCalSaco, setPrecoCalSaco] = useState("");
  const [precoMassaProntaKg, setPrecoMassaProntaKg] = useState("");

  const [result, setResult] = useState<null | {
    volumeArgamassaM3: number;
    cimentoKg: number;
    cimentoSacos: number;
    areiaM3: number;
    areiaKg: number;
    calKg: number;
    calSacos: number;
    massaProntaKg: number;
    custoEstimado: number;
  }>(null);

  const [errors, setErrors] = useState<{
    area?: string;
    espessura?: string;
    tracoCustom?: string;
    desperdicio?: string;
    fatorEmpacotamento?: string;
    precoCimentoSaco?: string;
    precoAreiaM3?: string;
    precoCalSaco?: string;
    precoMassaProntaKg?: string;
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

  const validateTracoCustom = (value: string) => {
    const partes = value.split(':').map(Number);
    if (partes.length < 2 || partes.length > 3 || partes.some(isNaN) || partes[0] <= 0 || partes[1] <= 0) {
      return "Traço custom inválido. Use 'cimento:areia' ou 'cimento:areia:cal' (ex: 1:4 ou 1:4:0.5).";
    }
    return undefined;
  };

  const submit = () => {
    const newErrors: typeof errors = {};
    let currentResult = null;

    try {
      newErrors.area = validatePositive(area, "Área", 0.1, 10000);
      newErrors.espessura = validatePositive(espessura, "Espessura", 1, 200);
      newErrors.desperdicio = validatePercentage(desperdicio, "Desperdício", 0, 30);
      newErrors.fatorEmpacotamento = validatePositive(fatorEmpacotamento, "Fator de Empacotamento", 1, 2);

      if (traco === 'custom') {
        newErrors.tracoCustom = validateTracoCustom(tracoCustom);
      }

      // Validação de preços (opcionais, mas se preenchidos, devem ser válidos)
      if (precoCimentoSaco.trim()) newErrors.precoCimentoSaco = validatePositive(precoCimentoSaco, "Preço do cimento", 0);
      if (precoAreiaM3.trim()) newErrors.precoAreiaM3 = validatePositive(precoAreiaM3, "Preço da areia", 0);
      if (precoCalSaco.trim()) newErrors.precoCalSaco = validatePositive(precoCalSaco, "Preço da cal", 0);
      if (precoMassaProntaKg.trim()) newErrors.precoMassaProntaKg = validatePositive(precoMassaProntaKg, "Preço da massa pronta", 0);

      if (Object.values(newErrors).some(e => e !== undefined)) {
        setErrors(newErrors);
        setResult(null);
        return;
      }

      const calcParams = {
        tipoServico: tipoServico,
        areaM2: parseFloat(area),
        espessuraMM: parseFloat(espessura),
        traco: traco,
        tracoCustom: tracoCustom,
        desperdicioPct: parseFloat(desperdicio),
        fatorEmpacotamento: parseFloat(fatorEmpacotamento),
      };

      const calculated = calcReboco(calcParams);

      let custoEstimado = 0;
      if (precoCimentoSaco.trim()) {
        custoEstimado += calculated.cimentoSacos * parseFloat(precoCimentoSaco);
      }
      if (precoAreiaM3.trim()) {
        custoEstimado += calculated.areiaM3 * parseFloat(precoAreiaM3);
      }
      if (precoCalSaco.trim()) {
        custoEstimado += calculated.calSacos * parseFloat(precoCalSaco);
      }
      if (precoMassaProntaKg.trim()) {
        custoEstimado += calculated.massaProntaKg * parseFloat(precoMassaProntaKg);
      }

      currentResult = { ...calculated, custoEstimado };

    } catch (error) {
      newErrors.submit = error instanceof Error ? error.message : "Erro desconhecido ao calcular.";
    }

    setErrors(newErrors);
    setResult(currentResult);
  };

  const reset = () => {
    setTipoServico("reboco-grosso");
    setArea("50");
    setEspessura("15");
    setTraco("1:4");
    setTracoCustom("1:4:0.5");
    setDesperdicio("10");
    setFatorEmpacotamento("1.3");
    setPrecoCimentoSaco("");
    setPrecoAreiaM3("");
    setPrecoCalSaco("");
    setPrecoMassaProntaKg("");
    setResult(null);
    setErrors({});
  };

  // Ajusta a espessura padrão e traço conforme o tipo de serviço
  useEffect(() => {
    if (tipoServico === 'chapisco') {
      setEspessura("5");
      setTraco("1:2");
    } else if (tipoServico === 'reboco-grosso') {
      setEspessura("15");
      setTraco("1:4");
    } else if (tipoServico === 'reboco-fino') {
      setEspessura("5");
      setTraco("1:5"); // Traço com cal
    } else if (tipoServico === 'massa-corrida') {
      setEspessura("2");
      setTraco("1:4"); // Não se aplica, mas para evitar erro
    } else if (tipoServico === 'reboco-total') {
      setEspessura("25"); // Espessura total estimada (5+15+5)
      setTraco("1:4"); // Não se aplica diretamente, é uma combinação
    }
  }, [tipoServico]);


  return (
    <CalculatorShell
      extrasId={PATH}
      title="Calculadora de Reboco"
      description="Estime materiais (cimento, areia, cal, massa pronta) e volumes para reboco de paredes internas/externas e chapisco."
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
          id="tipoServico"
          label="Tipo de Serviço"
          value={tipoServico}
          onChange={setTipoServico}
          options={[
            { value: "chapisco", label: "Chapisco" },
            { value: "reboco-grosso", label: "Reboco Grosso (Emboço)" },
            { value: "reboco-fino", label: "Reboco Fino (Acabamento)" },
            { value: "reboco-total", label: "Reboco Total (Chapisco + Grosso + Fino)" },
            { value: "massa-corrida", label: "Massa Corrida / Acabamento" },
          ]}
        />

        <NumberField
          id="area"
          label="Área a Rebocar"
          unit="m²"
          value={area}
          onChange={setArea}
          error={errors.area}
          placeholder="50"
          min="0.1"
          max="10000"
          step="0.1"
        />

        {tipoServico !== "reboco-total" && (
          <NumberField
            id="espessura"
            label="Espessura Média"
            unit="mm"
            value={espessura}
            onChange={setEspessura}
            error={errors.espessura}
            placeholder="15"
            min="1"
            max="200"
            step="1"
          />
        )}

        {tipoServico !== "massa-corrida" && tipoServico !== "reboco-total" && (
          <>
            <SelectField
              id="traco"
              label="Traço da Argamassa"
              value={traco}
              onChange={setTraco}
              options={[
                { value: "1:2", label: "1:2 (Cimento:Areia) - Chapisco" },
                { value: "1:3", label: "1:3 (Cimento:Areia) - Reboco Externo" },
                { value: "1:4", label: "1:4 (Cimento:Areia) - Reboco Interno" },
                { value: "1:5", label: "1:5 (Cimento:Areia:Cal) - Reboco Interno com Cal" },
                { value: "custom", label: "Custom (Cimento:Areia:Cal)" },
              ]}
            />
            {traco === 'custom' && (
              <NumberField
                id="tracoCustom"
                label="Traço Customizado (Cimento:Areia:Cal)"
                unit=""
                value={tracoCustom}
                onChange={setTracoCustom}
                error={errors.tracoCustom}
                placeholder="1:4:0.5"
                min="0" // Validação mais complexa no submit
                max="100"
                step="0.1"
                type="text" // Para permitir ':'
              />
            )}
          </>
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

        {tipoServico !== "massa-corrida" && (
          <NumberField
            id="fatorEmpacotamento"
            label="Fator de Empacotamento da Argamassa"
            unit=""
            value={fatorEmpacotamento}
            onChange={setFatorEmpacotamento}
            error={errors.fatorEmpacotamento}
            placeholder="1.3"
            min="1"
            max="2"
            step="0.01"
            description="Considera a redução de volume dos materiais secos ao serem misturados."
          />
        )}

        <h3 className="text-lg font-semibold mt-6">Preços Unitários (Opcional para Custo)</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Informe os preços para obter uma estimativa de custo total.
        </p>

        {tipoServico !== "massa-corrida" && (
          <>
            <NumberField
              id="precoCimentoSaco"
              label="Preço do Cimento"
              unit="R$/saco (50kg)"
              value={precoCimentoSaco}
              onChange={setPrecoCimentoSaco}
              error={errors.precoCimentoSaco}
              placeholder="30.00"
              min="0"
              step="0.01"
            />
            <NumberField
              id="precoAreiaM3"
              label="Preço da Areia"
              unit="R$/m³"
              value={precoAreiaM3}
              onChange={setPrecoAreiaM3}
              error={errors.precoAreiaM3}
              placeholder="80.00"
              min="0"
              step="0.01"
            />
            <NumberField
              id="precoCalSaco"
              label="Preço da Cal"
              unit="R$/saco (20kg)"
              value={precoCalSaco}
              onChange={setPrecoCalSaco}
              error={errors.precoCalSaco}
              placeholder="15.00"
              min="0"
              step="0.01"
            />
          </>
        )}

        {tipoServico === "massa-corrida" && (
          <NumberField
            id="precoMassaProntaKg"
            label="Preço da Massa Pronta"
            unit="R$/kg"
            value={precoMassaProntaKg}
            onChange={setPrecoMassaProntaKg}
            error={errors.precoMassaProntaKg}
            placeholder="5.00"
            min="0"
            step="0.01"
          />
        )}

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
            result.volumeArgamassaM3 > 0
              ? { label: "Volume de Argamassa", value: `${fmt(result.volumeArgamassaM3, 3)} m³` }
              : null,
            result.cimentoKg > 0
              ? { label: "Cimento", value: `${fmt(result.cimentoKg, 2)} kg (${fmt(result.cimentoSacos, 0)} sacos)` }
              : null,
            result.areiaM3 > 0
              ? { label: "Areia", value: `${fmt(result.areiaM3, 3)} m³ (${fmt(result.areiaKg, 2)} kg)` }
              : null,
            result.calKg > 0
              ? { label: "Cal", value: `${fmt(result.calKg, 2)} kg (${fmt(result.calSacos, 0)} sacos)` }
              : null,
            result.massaProntaKg > 0
              ? { label: "Massa Pronta", value: `${fmt(result.massaProntaKg, 2)} kg`, highlight: true }
              : null,
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
