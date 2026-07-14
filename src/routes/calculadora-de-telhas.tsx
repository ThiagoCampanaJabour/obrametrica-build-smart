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

  // Validações com conversão segura
  if (!comprimento || !String(comprimento).trim()) {
    newErrors.comprimento = "Comprimento é obrigatório";
  }
  if (!largura || !String(largura).trim()) {
    newErrors.largura = "Largura é obrigatória";
  }
  if (!inclinacao || !String(inclinacao).trim()) {
    newErrors.inclinacao = "Inclinação é obrigatória";
  }
  if (!beiral || !String(beiral).trim()) {
    newErrors.beiral = "Beiral é obrigatório";
  }
  if (!desperdicio || !String(desperdicio).trim()) {
    newErrors.desperdicio = "Desperdício é obrigatório";
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  try {
    // Converter para números
    const comp = parseFloat(String(comprimento).trim());
    const larg = parseFloat(String(largura).trim());
    const incl = parseFloat(String(inclinacao).trim());
    const ber = parseFloat(String(beiral).trim());
    const desp = parseFloat(String(desperdicio).trim());

    // Validações de valor
    if (comp <= 0) newErrors.comprimento = "Deve ser maior que 0";
    if (larg <= 0) newErrors.largura = "Deve ser maior que 0";
    if (incl < 0 || incl > 100) newErrors.inclinacao = "Deve estar entre 0% e 100%";
    if (ber < 0) newErrors.beiral = "Não pode ser negativo";
    if (desp < 0 || desp > 30) newErrors.desperdicio = "Deve estar entre 0% e 30%";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Obter rendimento e telhas por caixa do preset
    const telhaPreset = TIPOS_TELHA[tipoTelha];
    if (!telhaPreset) {
      newErrors.tipoTelha = "Tipo de telha inválido";
      setErrors(newErrors);
      return;
    }

    // Calcular
    const resultado = calcTelhas(
      comp,
      larg,
      incl,
      ber,
      telhaPreset.rendimento,
      telhaPreset.telhasPorCaixa,
      desp,
    );

    setResult(resultado);
    setErrors({});
    onSubmit();
  } catch (error) {
    setErrors({
      submit: error instanceof Error ? error.message : "Erro ao calcular",
    });
  }
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
