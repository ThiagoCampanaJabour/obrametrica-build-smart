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
import { calcularRejunte } from "@/lib/formulas";

const PATH = "/calculadora-rejunte";

const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Construção Civil", path: "/construcao-civil" },
  { name: "Calculadora de Rejunte", path: PATH },
];

const TAMANHOS_COMUNS = [
  { label: "20×20 cm", width: 200, height: 200 },
  { label: "30×30 cm", width: 300, height: 300 },
  { label: "60×60 cm", width: 600, height: 600 },
  { label: "120×120 cm", width: 1200, height: 1200 },
  { label: "30×60 cm", width: 300, height: 600 },
];

export const Route = createFileRoute("/calculadora-rejunte")({
  head: () =>
    pageHead({
      title: "Calculadora de Rejunte — kg e litros | ObraMétrica",
      description:
        "Calcule a quantidade de rejunte necessária para revestimentos cerâmicos e porcelanato. Dimensionamento preciso em kg.",
      path: PATH,
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Calculadora de Rejunte",
        url: `https://obrametrica.com.br${PATH}`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      extraSchemas: allSchemasFor(PATH),
    }),
  component: RejunteCalc,
});

function RejunteCalc() {
  const [larguraPeca, setLarguraPeca] = useState("");
  const [alturaPeca, setAlturaPeca] = useState("");
  const [larguraJunta, setLarguraJunta] = useState("2");
  const [espessuraRejunte, setEspessuraRejunte] = useState("3");
  const [areaTotalM2, setAreaTotalM2] = useState("");
  const [tipoRejunte, setTipoRejunte] = useState<"cimenticio" | "acrilico" | "epoxi">(
    "cimenticio"
  );
  const [desperdicio, setDesperdicio] = useState("10");

  const [result, setResult] = useState<ReturnType<typeof calcularRejunte> | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { onSubmit } = useCalcForm();

  const submit = () => {
    const lp = validatePositive(larguraPeca, "Largura da peça");
    const ap = validatePositive(alturaPeca, "Altura da peça");
    const lj = validatePositive(larguraJunta, "Largura da junta");
    const er = validatePositive(espessuraRejunte, "Espessura do rejunte");
    const at = validatePositive(areaTotalM2, "Área total");
    const desp = validatePositive(desperdicio, "Desperdício");

    setErrors({
      larguraPeca: lp.error,
      alturaPeca: ap.error,
      larguraJunta: lj.error,
      espessuraRejunte: er.error,
      areaTotalM2: at.error,
      desperdicio: desp.error,
    });

    if (lp.value && ap.value && lj.value && er.value && at.value && desp.value) {
      const resultado = calcularRejunte({
        larguraPeca: lp.value,
        alturaPeca: ap.value,
        larguraJunta: lj.value,
        espessuraRejunte: er.value,
        areaTotalM2: at.value,
        tipoRejunte,
        desperdicio: desp.value,
      });
      setResult(resultado);
    } else {
      setResult(null);
    }
  };

  const reset = () => {
    setLarguraPeca("");
    setAlturaPeca("");
    setLarguraJunta("2");
    setEspessuraRejunte("3");
    setAreaTotalM2("");
    setTipoRejunte("cimenticio");
    setDesperdicio("10");
    setErrors({});
    setResult(null);
  };

  const preencherTamanho = (width: number, height: number) => {
    setLarguraPeca(width.toString());
    setAlturaPeca(height.toString());
  };

  return (
    <CalculatorShell
      extrasId={PATH}
      title="Calculadora de Rejunte"
      description="Dimensione a quantidade de rejunte necessária para revestimentos cerâmicos e porcelanato."
      breadcrumbs={CRUMBS}
    >
      <form onSubmit={(e) => onSubmit(e, submit)} className="space-y-4" noValidate>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-amber-800">
            <strong>⚠️ Aviso:</strong> Esta calculadora fornece uma estimativa. Para projetos
            críticos, consulte um profissional. Não substitui dimensionamento técnico.
          </p>
        </div>

        <div className="border-b pb-4">
          <p className="text-sm font-semibold text-gray-700 mb-3">Tamanhos comuns:</p>
          <div className="grid grid-cols-2 gap-2">
            {TAMANHOS_COMUNS.map((tamanho) => (
              <button
                key={tamanho.label}
                type="button"
                onClick={() => preencherTamanho(tamanho.width, tamanho.height)}
                className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-blue-50"
              >
                {tamanho.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <NumberField
            id="larguraPeca"
            label="Largura da peça"
            unit="mm"
            value={larguraPeca}
            onChange={setLarguraPeca}
            error={errors.larguraPeca}
            placeholder="200"
          />
          <NumberField
            id="alturaPeca"
            label="Altura da peça"
            unit="mm"
            value={alturaPeca}
            onChange={setAlturaPeca}
            error={errors.alturaPeca}
            placeholder="200"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <NumberField
            id="larguraJunta"
            label="Largura da junta"
            unit="mm"
            value={larguraJunta}
            onChange={setLarguraJunta}
            error={errors.larguraJunta}
            placeholder="2"
            min="1"
            max="10"
          />
          <NumberField
            id="espessuraRejunte"
            label="Espessura do rejunte"
            unit="mm"
            value={espessuraRejunte}
            onChange={setEspessuraRejunte}
            error={errors.espessuraRejunte}
            placeholder="3"
            min="1"
            max="10"
          />
        </div>

        <NumberField
          id="areaTotalM2"
          label="Área total a revestir"
          unit="m²"
          value={areaTotalM2}
          onChange={setAreaTotalM2}
          error={errors.areaTotalM2}
          placeholder="10"
        />

        <SelectField
          id="tipoRejunte"
          label="Tipo de rejunte"
          value={tipoRejunte}
          onChange={(val) => setTipoRejunte(val as "cimenticio" | "acrilico" | "epoxi")}
          options={[
            { value: "cimenticio", label: "Cimentício" },
            { value: "acrilico", label: "Acrílico" },
            { value: "epoxi", label: "Epóxi" },
          ]}
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
          max="20"
        />

        <SubmitRow onReset={reset} />
      </form>

      {result && (
        <ResultPanel
          items={[
            {
              label: "Volume total",
              value: `${fmt(result.volumeTotal, 2)} litros`,
            },
            {
              label: "Massa sem desperdício",
              value: `${fmt(result.massaTotalKg, 2)} kg`,
            },
            {
              label: "Massa com desperdício",
              value: `${fmt(result.massaTotalComDesperdicio, 2)} kg`,
              highlight: true,
            },
          ]}
        />
      )}

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Dicas Importantes</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>
            <strong>Rejunte cimentício:</strong> Mais econômico, indicado para áreas internas.
          </li>
          <li>
            <strong>Rejunte acrílico:</strong> Mais flexível, ideal para áreas com movimento.
          </li>
          <li>
            <strong>Rejunte epóxi:</strong> Mais resistente, recomendado para áreas molhadas.
          </li>
          <li>
            <strong>Desperdício:</strong> Sempre adicione 10-15% para perdas e retrabalho.
          </li>
        </ul>
      </div>
    </CalculatorShell>
  );
}
