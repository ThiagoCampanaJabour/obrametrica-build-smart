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
import { calcularCargaTermicaAC } from "@/lib/formulas";

const PATH = "/climatizacao/ar-condicionado";

const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Climatização", path: "/climatizacao" },
  { name: "Calculadora de Ar-Condicionado", path: PATH },
];

export const Route = createFileRoute("/climatizacao/ar-condicionado")({
  head: () =>
    pageHead({
      title: "Calculadora de Ar-Condicionado — BTU/h e kW | ObraMétrica",
      description:
        "Calcule a carga térmica e capacidade de ar-condicionado necessária para seu ambiente. Dimensionamento rápido e preciso em BTU/h e kW.",
      path: PATH,
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Calculadora de Ar-Condicionado",
        url: `https://obrametrica.com.br${PATH}`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      extraSchemas: allSchemasFor(PATH),
    }),
  component: ArCondicionadoCalc,
});

function ArCondicionadoCalc() {
  // Inputs principais
  const [area, setArea] = useState("");
  const [peDireito, setPeDireito] = useState("2.7");
  const [exposicaoSolar, setExposicaoSolar] = useState<"baixa" | "media" | "alta">("media");
  const [isolamentoTermico, setIsolamentoTermico] = useState<"bom" | "regular" | "ruim">(
    "regular"
  );
  const [numeroPessoas, setNumeroPessoas] = useState("1");
  const [numeroEquipamentos, setNumeroEquipamentos] = useState("0");
  const [numeroJanelas, setNumeroJanelas] = useState("1");
  const [tamanhoJanelas, setTamanhoJanelas] = useState<"pequenas" | "medianas" | "grandes">(
    "medianas"
  );
  const [margem, setMargem] = useState("10");
  const [metodo, setMetodo] = useState<"simplificado" | "volumetrico">("volumetrico");
  const [unidade, setUnidade] = useState<"btu" | "kw">("btu");
  const [volumeConhecido, setVolumeConhecido] = useState("");

  // Resultado
  const [result, setResult] = useState<ReturnType<typeof calcularCargaTermicaAC> | null>(null);

  // Erros
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { onSubmit } = useCalcForm();

  const submit = () => {
    // Validações
    const a = validatePositive(area, "Área");
    const p = validatePositive(peDireito, "Pé-direito");
    const m = validatePositive(margem, "Margem");

    setErrors({
      area: a.error,
      peDireito: p.error,
      margem: m.error,
    });

    if (!a.value || !p.value || !m.value) {
      setResult(null);
      return;
    }

    // Calcular
    const resultado = calcularCargaTermicaAC({
      area: a.value,
      peDireito: p.value,
      exposicaoSolar,
      isolamentoTermico,
      numeroPessoas: parseInt(numeroPessoas) || 1,
      numeroEquipamentos: parseInt(numeroEquipamentos) || 0,
      numeroJanelas: parseInt(numeroJanelas) || 0,
      tamanhoJanelas,
      margem: m.value,
      metodo,
      volumeConhecido: volumeConhecido ? parseFloat(volumeConhecido) : undefined,
    });

    setResult(resultado);
  };

  const reset = () => {
    setArea("");
    setPeDireito("2.7");
    setExposicaoSolar("media");
    setIsolamentoTermico("regular");
    setNumeroPessoas("1");
    setNumeroEquipamentos("0");
    setNumeroJanelas("1");
    setTamanhoJanelas("medianas");
    setMargem("10");
    setMetodo("volumetrico");
    setUnidade("btu");
    setVolumeConhecido("");
    setErrors({});
    setResult(null);
  };

  return (
    <CalculatorShell
      extrasId={PATH}
      title="Calculadora de Ar-Condicionado"
      description="Dimensione a capacidade de ar-condicionado necessária para seu ambiente com base em carga térmica estimada."
      breadcrumbs={CRUMBS}
    >
      <form onSubmit={(e) => onSubmit(e, submit)} className="space-y-4" noValidate>
        {/* Aviso importante */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-amber-800">
            <strong>⚠️ Aviso:</strong> Esta calculadora fornece uma estimativa. Para projetos
            críticos, consulte um profissional HVAC certificado. Não substitui dimensionamento
            técnico.
          </p>
        </div>

        {/* Método de cálculo */}
        <SelectField
          id="metodo"
          label="Método de cálculo"
          value={metodo}
          onChange={(val) => setMetodo(val as "simplificado" | "volumetrico")}
          options={[
            { value: "simplificado", label: "Simplificado (por área)" },
            { value: "volumetrico", label: "Volumétrico (mais preciso)" },
          ]}
        />

        {/* Inputs básicos */}
        <NumberField
          id="area"
          label="Área do ambiente"
          unit="m²"
          value={area}
          onChange={setArea}
          error={errors.area}
          placeholder="25"
        />

        <NumberField
          id="peDireito"
          label="Pé-direito"
          unit="m"
          value={peDireito}
          onChange={setPeDireito}
          error={errors.peDireito}
          placeholder="2.7"
          min="1.8"
          max="10"
        />

        {/* Exposição solar */}
        <SelectField
          id="exposicaoSolar"
          label="Exposição solar"
          value={exposicaoSolar}
          onChange={(val) => setExposicaoSolar(val as "baixa" | "media" | "alta")}
          options={[
            { value: "baixa", label: "Baixa (sombra)" },
            { value: "media", label: "Média" },
            { value: "alta", label: "Alta (sol direto)" },
          ]}
        />

        {/* Isolamento térmico */}
        <SelectField
          id="isolamentoTermico"
          label="Isolamento térmico"
          value={isolamentoTermico}
          onChange={(val) => setIsolamentoTermico(val as "bom" | "regular" | "ruim")}
          options={[
            { value: "bom", label: "Bom" },
            { value: "regular", label: "Regular" },
            { value: "ruim", label: "Ruim" },
          ]}
        />

        {/* Número de pessoas */}
        <NumberField
          id="numeroPessoas"
          label="Número de pessoas"
          unit="pessoas"
          value={numeroPessoas}
          onChange={setNumeroPessoas}
          min="0"
          max="500"
          placeholder="1"
        />

        {/* Equipamentos eletrônicos */}
        <NumberField
          id="numeroEquipamentos"
          label="Equipamentos eletrônicos (TV, computador, etc)"
          unit="unidades"
          value={numeroEquipamentos}
          onChange={setNumeroEquipamentos}
          min="0"
          max="50"
          placeholder="0"
        />

        {/* Janelas */}
        <div className="grid grid-cols-2 gap-4">
          <NumberField
            id="numeroJanelas"
            label="Número de janelas"
            unit="unidades"
            value={numeroJanelas}
            onChange={setNumeroJanelas}
            min="0"
            max="20"
            placeholder="1"
          />

          <SelectField
            id="tamanhoJanelas"
            label="Tamanho das janelas"
            value={tamanhoJanelas}
            onChange={(val) => setTamanhoJanelas(val as "pequenas" | "medianas" | "grandes")}
            options={[
              { value: "pequenas", label: "Pequenas" },
              { value: "medianas", label: "Medianas" },
              { value: "grandes", label: "Grandes" },
            ]}
          />
        </div>

        {/* Margem de conforto */}
        <NumberField
          id="margem"
          label="Margem de conforto"
          unit="%"
          value={margem}
          onChange={setMargem}
          error={errors.margem}
          min="0"
          max="30"
          placeholder="10"
        />

        {/* Unidade de saída */}
        <SelectField
          id="unidade"
          label="Unidade de saída"
          value={unidade}
          onChange={(val) => setUnidade(val as "btu" | "kw")}
          options={[
            { value: "btu", label: "BTU/h" },
            { value: "kw", label: "kW" },
          ]}
        />

        {/* Volume conhecido (opcional) */}
        <div className="border-t pt-4 mt-4">
          <p className="text-sm text-gray-600 mb-3">
            <strong>Ou use volume conhecido:</strong>
          </p>
          <NumberField
            id="volumeConhecido"
            label="Volume do ambiente (m³)"
            unit="m³"
            value={volumeConhecido}
            onChange={setVolumeConhecido}
            placeholder="67.5"
          />
        </div>

        <SubmitRow onReset={reset} />
      </form>

      {/* Resultado */}
      {result && (
        <ResultPanel
          items={[
            {
              label: "Carga térmica total",
              value: `${fmt(result.cargaTotalBTU, 0)} BTU/h (${fmt(result.cargaTotalKW, 2)} kW)`,
            },
            {
              label: "Capacidade recomendada",
              value: `${fmt(result.capacidadeRecomendadaBTU, 0)} BTU/h (${fmt(result.capacidadeRecomendadaKW, 2)} kW)`,
              highlight: true,
            },
            {
              label: "Número de aparelhos sugerido",
              value: `${result.numeroAparelhos} aparelho${result.numeroAparelhos > 1 ? "s" : ""} de 12.000 BTU/h`,
            },
          ]}
        />
      )}

      {/* Dicas */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Dicas Importantes</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>
            <strong>Posicionamento:</strong> Instale o aparelho na parede oposta às janelas para
            melhor circulação de ar.
          </li>
          <li>
            <strong>Eficiência energética:</strong> Procure por aparelhos com selo PROCEL/INMETRO
            para economizar energia.
          </li>
          <li>
            <strong>Manutenção:</strong> Limpe os filtros a cada 2 semanas para manter a
            eficiência.
          </li>
          <li>
            <strong>Isolamento:</strong> Feche portas e janelas para melhorar a eficiência do
            aparelho.
          </li>
          <li>
            <strong>Temperatura:</strong> Mantenha entre 22-24°C para conforto e economia.
          </li>
        </ul>
      </div>
    </CalculatorShell>
  );
}
