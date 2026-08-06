import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageHead } from "@/lib/seo";
import { calcAndaimes, toCSVAndaimes, validarTrecho, type TrechoInput } from "@/lib/andaimes/calc";
import { AndaimeForm, novoTrecho } from "@/components/Andaimes/AndaimeForm";
import { ResultsSummary } from "@/components/Andaimes/ResultsSummary";

const PATH = "/construcao-civil/andaimes-escoras";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Construção Civil", path: "/construcao-civil" },
  { name: "Andaimes e Escoras", path: PATH },
];

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Quando preciso de projeto estrutural para andaime?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sempre que a torre ultrapassar cerca de 12 m de altura, houver balanços, cargas concentradas ou exposição severa ao vento. Nesses casos a NR-18 exige projeto e memorial de montagem assinados por profissional legalmente habilitado.",
      },
    },
    {
      "@type": "Question",
      name: "Como contabilizar peças reserva de andaime?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Aplique uma margem de segurança de 10% sobre a quantidade base de módulos, plataformas e travamentos. Em obras longas ou com muitas remontagens, 15% é mais realista por causa de avarias e extravios.",
      },
    },
    {
      "@type": "Question",
      name: "Vale mais a pena alugar ou comprar andaime?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Para obras pontuais de até três meses a locação costuma ser mais barata, pois inclui transporte, manutenção e reposição. Compra se justifica quando o mesmo conjunto é reutilizado em várias obras ao longo do ano.",
      },
    },
  ],
};

export const Route = createFileRoute("/construcao-civil/andaimes-escoras")({
  head: () =>
    pageHead({
      title: "Calculadora de Andaimes e Escoras — Módulos, Plataformas e Peças | ObraMétrica",
      description:
        "Estime módulos de andaime, plataformas, diagonais, guarda-corpos, sapatas e escoras a partir da largura e altura da fachada. Presets editáveis e exportação CSV/JSON.",
      path: PATH,
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Calculadora de Andaimes e Escoras",
        url: `https://obrametrica.com.br${PATH}`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      extraSchemas: [FAQ_SCHEMA],
    }),
  component: AndaimesPage,
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

function AndaimesPage() {
  const [trechos, setTrechos] = useState<TrechoInput[]>([novoTrecho(1)]);
  const [calculado, setCalculado] = useState(false);

  const erros = useMemo(
    () => trechos.map(validarTrecho).filter((e): e is string => e !== null),
    [trechos],
  );

  const result = useMemo(() => {
    if (!calculado || erros.length > 0) return null;
    return calcAndaimes(trechos);
  }, [trechos, calculado, erros]);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumbs items={CRUMBS} />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Calculadora de Andaimes e Escoras
        </h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Estime a quantidade de módulos de andaime, plataformas, diagonais, guarda-corpos, sapatas
          e escoras a partir da largura e da altura de cada fachada ou trecho. Ideal para planejar
          locação, compra e logística de montagem.
        </p>

        <div
          role="note"
          className="mt-4 rounded-md border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-foreground"
        >
          <strong>Estimativa para planejamento</strong> — o projeto executivo e a montagem devem ser
          feitos por empresa certificada. Verifique as normas locais, a NR-18 e o limite de altura do
          sistema escolhido.
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,520px)_1fr]">
          <div className="rounded-xl border border-border bg-card p-6">
            <AndaimeForm
              trechos={trechos}
              setTrechos={setTrechos}
              onCalculate={() => setCalculado(true)}
              onReset={() => {
                setTrechos([novoTrecho(1)]);
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
                Informe largura, altura e sistema de cada trecho e clique em <strong>Calcular</strong>{" "}
                para ver módulos, plataformas e a lista de materiais.
              </div>
            ) : (
              <ResultsSummary
                result={result}
                onExportCSV={() =>
                  download("andaimes-escoras.csv", toCSVAndaimes(result), "text/csv")
                }
                onExportJSON={() =>
                  download(
                    "andaimes-escoras.json",
                    JSON.stringify({ inputs: trechos, outputs: result }, null, 2),
                    "application/json",
                  )
                }
                onCopy={() =>
                  navigator.clipboard.writeText(
                    JSON.stringify({ inputs: trechos, outputs: result }, null, 2),
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
              O número de níveis é <code>teto(altura ÷ espaçamento vertical)</code> e os módulos por
              nível são <code>teto(largura ÷ largura do módulo)</code>. As peças complementares
              (diagonais, travessas, guarda-corpos, sapatas) usam fatores por módulo definidos nos
              presets, ajustados pela carga de trabalho, com margem de segurança para reservas.
            </p>
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Limitações</h2>
            <p className="mt-2">
              As heurísticas não substituem projeto de montagem, verificação de ancoragens, ação do
              vento nem análise de fundação/apoio. Fachadas irregulares devem ser divididas em
              trechos retangulares. Consulte a{" "}
              <a href="/metodologia" className="underline">
                metodologia
              </a>{" "}
              geral do ObraMétrica.
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
