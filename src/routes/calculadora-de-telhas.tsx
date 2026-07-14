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
import { calcTelhas } from "@/lib/formulas";

const PATH = "/calculadora-de-telhas";

const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Construção Civil", path: "/construcao-civil" },
  { name: "Calculadora de Telhas", path: PATH },
];

// Presets de tipos de telha com rendimento e quantidade por caixa
const TIPOS_TELHA: Record<
  string,
  { rendimento: number; telhasPorCaixa: number; descricao: string }
> = {
  "ceramica-colonial": {
    rendimento: 15,
    telhasPorCaixa: 40,
    descricao: "Cerâmica Colonial (40×25 cm)",
  },
  "ceramica-tegula": {
    rendimento: 15,
    telhasPorCaixa: 40,
    descricao: "Cerâmica Tegula (40×25 cm)",
  },
  "ceramica-francesa": {
    rendimento: 15,
    telhasPorCaixa: 40,
    descricao: "Cerâmica Francesa (41×25 cm)",
  },
  "fibrocimento-ondulado": {
    rendimento: 2,
    telhasPorCaixa: 6,
    descricao: "Fibrocimento Ondulado (110×53 cm)",
  },
  "metalica-galvanizada": {
    rendimento: 2.1,
    telhasPorCaixa: 5,
    descricao: "Metálica Galvanizada (100×50 cm)",
  },
  "metalica-telha": {
    rendimento: 1.5,
    telhasPorCaixa: 4,
    descricao: "Metálica Telha (120×60 cm)",
  },
};

export const Route = createFileRoute("/calculadora-de-telhas")({
  head: () =>
    pageHead({
      title: "Calculadora de Telhas — Quantidade e Caixas | ObraMétrica",
      description:
        "Calcule a quantidade de telhas necessárias para seu telhado considerando inclinação, beiral e tipo de telha. Dosagens técnicas com precisão.",
      path: PATH,
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Calculadora de Telhas",
        url: `https://obrametrica.com.br${PATH}`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Web",
        description:
          "Calcula quantidade de telhas necessárias para cobertura de telhado",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "BRL",
        },
      },
      extraSchemas: allSchemasFor(PATH),
    }),
  component: TelhasCalculator,
});

function TelhasCalculator() {
  const [comprimento, setComprimento] = useState("");
  const [largura, setLargura] = useState("");
  const [inclinacao, setInclinacao] = useState("30");
  const [beiral, setBeiral] = useState("0.5");
  const [tipoTelha, setTipoTelha] = useState("ceramica-colonial");
  const [desperdicio, setDesperdicio] = useState("10");
  const [result, setResult] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { onSubmit } = useCalcForm();

  const submit = () => {
    const newErrors: Record<string, string> = {};

    // Validações
    if (!comprimento.trim()) {
      newErrors.comprimento = "Comprimento é obrigatório";
    } else if (!validatePositive(parseFloat(comprimento))) {
      newErrors.comprimento = "Comprimento deve ser maior que zero";
    }

    if (!largura.trim()) {
      newErrors.largura = "Largura é obrigatória";
    } else if (!validatePositive(parseFloat(largura))) {
      newErrors.largura = "Largura deve ser maior que zero";
    }

    if (!inclinacao.trim()) {
      newErrors.inclinacao = "Inclinação é obrigatória";
    } else {
      const inc = parseFloat(inclinacao);
      if (inc < 0 || inc > 100) {
        newErrors.inclinacao = "Inclinação deve estar entre 0% e 100%";
      }
    }

    if (!beiral.trim()) {
      newErrors.beiral = "Beiral é obrigatório";
    } else if (!validatePositive(parseFloat(beiral))) {
      newErrors.beiral = "Beiral deve ser maior ou igual a zero";
    }

    if (!desperdicio.trim()) {
      newErrors.desperdicio = "Desperdício é obrigatório";
    } else {
      const desp = parseFloat(desperdicio);
      if (desp < 0 || desp > 30) {
        newErrors.desperdicio = "Desperdício deve estar entre 0% e 30%";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Obter dados do tipo de telha
    const telha = TIPOS_TELHA[tipoTelha];
    if (!telha) {
      setErrors({ tipoTelha: "Tipo de telha inválido" });
      return;
    }

    // Calcular
    const resultado = calcTelhas(
      parseFloat(comprimento),
      parseFloat(largura),
      parseFloat(inclinacao),
      parseFloat(beiral),
      telha.rendimento,
      telha.telhasPorCaixa,
      parseFloat(desperdicio)
    );

    setResult(resultado);
    onSubmit();
    setErrors({});
  };

  const reset = () => {
    setComprimento("");
    setLargura("");
    setInclinacao("30");
    setBeiral("0.5");
    setTipoTelha("ceramica-colonial");
    setDesperdicio("10");
    setResult(null);
    setErrors({});
  };

  return (
    <CalculatorShell
      title="Calculadora de Telhas"
      intro="Calcule a quantidade de telhas necessárias para cobrir seu telhado considerando inclinação, beiral e tipo de telha."
      breadcrumbs={CRUMBS}
    >
      <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800">
          <p>
            <strong>Dica:</strong> Informe as dimensões da projeção horizontal do telhado (sem inclinação).
            A calculadora ajusta automaticamente pela inclinação real.
          </p>
        </div>

        <NumberField
          id="comprimento"
          label="Comprimento da projeção"
          unit="m"
          value={comprimento}
          onChange={setComprimento}
          error={errors.comprimento}
          placeholder="8"
        />

        <NumberField
          id="largura"
          label="Largura da projeção"
          unit="m"
          value={largura}
          onChange={setLargura}
          error={errors.largura}
          placeholder="6"
        />

        <SelectField
          id="tipoTelha"
          label="Tipo de telha"
          value={tipoTelha}
          onChange={setTipoTelha}
          options={Object.entries(TIPOS_TELHA).map(([key, val]) => ({
            value: key,
            label: val.descricao,
          }))}
        />

        <NumberField
          id="inclinacao"
          label="Inclinação do telhado"
          unit="%"
          value={inclinacao}
          onChange={setInclinacao}
          error={errors.inclinacao}
          placeholder="30"
          min="0"
          max="100"
          step="5"
        />

        <NumberField
          id="beiral"
          label="Tamanho do beiral"
          unit="m"
          value={beiral}
          onChange={setBeiral}
          error={errors.beiral}
          placeholder="0.5"
          min="0"
          max="2"
          step="0.1"
        />

        <NumberField
          id="desperdicio"
          label="Margem de desperdício"
          unit="%"
          value={desperdicio}
          onChange={setDesperdicio}
          error={errors.desperdicio}
          placeholder="10"
          min="0"
          max="30"
        />

        <SubmitRow onReset={reset} />
      </form>

      {result && (
        <ResultPanel
          items={[
            {
              label: "Área de planta",
              value: `${fmt(result.areaPlanta, 2)} m²`,
            },
            {
              label: "Área inclinada",
              value: `${fmt(result.areaInclinada, 2)} m²`,
            },
            {
              label: "Quantidade teórica",
              value: `${fmt(result.numeroTeorico, 0)} telhas`,
            },
            {
              label: "Quantidade com desperdício",
              value: `${fmt(result.numeroFinal, 0)} telhas`,
              highlight: true,
            },
            {
              label: "Caixas necessárias",
              value: `${fmt(result.numeroCaixas, 0)} caixas`,
              highlight: true,
            },
          ]}
        />
      )}
    </CalculatorShell>
  );
}
