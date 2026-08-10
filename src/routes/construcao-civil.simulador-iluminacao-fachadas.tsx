import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import {
  calcIluminacao,
  toCSVIluminacao,
  validarAmbiente,
  type AmbienteInput,
} from "@/lib/iluminacao/calc";
import { IluminacaoForm, novoAmbiente } from "@/components/Iluminacao/IluminacaoForm";
import { ResultsSummary } from "@/components/Iluminacao/ResultsSummary";
import { CalculatorShell } from "@/components/calc-ui";

const PATH = "/construcao-civil/simulador-iluminacao-fachadas";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Construção Civil", path: "/construcao-civil" },
  { name: "Iluminação Natural e Sombras", path: PATH },
];

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "O que é daylight factor e qual valor é considerado bom?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "O daylight factor (DF) é a razão entre a iluminância interna e a iluminância externa sob céu encoberto. Valores acima de 2% indicam boa iluminação natural para escritórios e salas de aula; entre 1% e 2% o ambiente é aceitável para uso residencial; acima de 6% há risco de ofuscamento e ganho térmico excessivo.",
      },
    },
    {
      "@type": "Question",
      name: "Beiral ou brise vertical: qual proteção usar em cada orientação?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Beirais e brises horizontais interceptam o sol alto, sendo eficazes em fachadas voltadas para o Norte no hemisfério sul. Brises verticais funcionam melhor contra o sol rasante do início da manhã (Leste) e do fim da tarde (Oeste), quando elementos horizontais têm pouco efeito.",
      },
    },
    {
      "@type": "Question",
      name: "Este simulador substitui uma simulação de iluminação natural em software especializado?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Não. Trata-se de uma ferramenta heurística para decisão conceitual, sem modelagem 3D nem inter-reflexões. Para comprovação normativa ou certificação, use ferramentas como Radiance, Daysim ou DIALux e consulte um especialista.",
      },
    },
  ],
};

export const Route = createFileRoute("/construcao-civil/simulador-iluminacao-fachadas")({
  head: () =>
    pageHead({
      title: "Simulador de Iluminação Natural e Sombras em Fachadas | ObraMétrica",
      description:
        "Estime daylight factor, iluminância interna por faixa horária, risco de ofuscamento e proteções solares (beiral, brise, película) por orientação de fachada.",
      path: PATH,
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Simulador de Iluminação Natural e Sombras",
        url: `https://obrametrica.com.br${PATH}`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      extraSchemas: [FAQ_SCHEMA],
    }),
  component: IluminacaoPage,
});

function download(name: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function IluminacaoPage() {
  const [ambientes, setAmbientes] = useState<AmbienteInput[]>([novoAmbiente(1)]);
  const [calculado, setCalculado] = useState(false);

  const erros = useMemo(
    () => ambientes.map(validarAmbiente).filter((e): e is string => e !== null),
    [ambientes],
  );

  const result = useMemo(() => {
    if (!calculado || erros.length > 0) return null;
    return calcIluminacao(ambientes);
  }, [ambientes, calculado, erros]);

  return (
    <CalculatorShell
      title="Simulador de Iluminação Natural e Sombras"
      description="Avalie a luz natural que chega a cada ambiente conforme orientação, vão e tipo de vidro."
      breadcrumbs={CRUMBS}
      extrasId="iluminacao"
    >
      <div
        role="note"
        className="mt-4 rounded-md border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-foreground"
      >
        <strong>Estimativas para projeto conceitual</strong> — o modelo é heurístico, não considera
        inter-reflexões nem geometria 3D do entorno.
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,540px)_1fr]">
        <div className="rounded-xl border border-border bg-card p-6">
          <IluminacaoForm
            ambientes={ambientes}
            setAmbientes={setAmbientes}
            onCalculate={() => setCalculado(true)}
            onReset={() => {
              setAmbientes([novoAmbiente(1)]);
              setCalculado(false);
            }}
          />
        </div>

        <div>
          {calculado && erros.length > 0 ? (
            <div
              role="alert"
              className="rounded-xl border border-destructive/40 bg-destructive/10 p-6 text-sm text-foreground"
            >
              <ul className="list-disc space-y-1 pl-5">
                {erros.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
          ) : !result ? (
            <div className="rounded-xl border border-dashed border-border bg-muted/40 p-8 text-sm text-muted-foreground">
              Preencha orientação, dimensões do vão, área do ambiente e faixas horárias e clique em{" "}
              <strong>Calcular</strong> para ver o daylight factor, o gráfico horário e as
              recomendações de proteção solar.
            </div>
          ) : (
            <ResultsSummary
              result={result}
              onExportCSV={() =>
                download("iluminacao-fachadas.csv", toCSVIluminacao(result), "text/csv")
              }
              onExportJSON={() =>
                download(
                  "iluminacao-fachadas.json",
                  JSON.stringify({ inputs: ambientes, outputs: result }, null, 2),
                  "application/json",
                )
              }
              onCopy={() =>
                navigator.clipboard.writeText(
                  JSON.stringify({ inputs: ambientes, outputs: result }, null, 2),
                )
              }
            />
          )}
        </div>
      </div>

      <div className="mt-10 grid gap-6 rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground sm:grid-cols-2">
        <div>
          <h2 className="text-base font-semibold text-foreground">Como o cálculo funciona</h2>
          <p className="mt-2">
            O daylight factor é estimado por{" "}
            <code>DF = 100 × Tv × (A_vidro / A_ambiente) × GF × MF</code>, com fator geométrico
            dependente da relação entre altura do vão e profundidade do ambiente e fator de
            manutenção 0,8. A iluminância horária usa a irradiância incidente na fachada e a
            conversão simplificada de <code>1 W/m² ≈ 120 lux</code>, descontando a redução das
            proteções solares selecionadas.
          </p>
        </div>
        <div>
          <h2 className="text-base font-semibold text-foreground">Limitações</h2>
          <p className="mt-2">
            Não há modelagem de inter-reflexões, prateleiras de luz, geometria real do entorno nem
            variação de nebulosidade. Os presets de irradiância por cidade são valores médios de céu
            limpo.
          </p>
        </div>
      </div>
    </CalculatorShell>
  );
}
