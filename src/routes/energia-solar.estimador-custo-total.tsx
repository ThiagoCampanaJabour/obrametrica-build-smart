import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageHead } from "@/lib/seo";
import { EstimatorForm } from "@/components/CostEstimator/EstimatorForm";
import { ResultsSummary } from "@/components/CostEstimator/ResultsSummary";
import { CostBreakdownTable } from "@/components/CostEstimator/CostBreakdownTable";
import { CashflowChart } from "@/components/CostEstimator/CashflowChart";
import { ExportReport } from "@/components/CostEstimator/ExportReport";
import estimateCost, { type CostInput, type CostResult } from "@/lib/solar/cost-estimator";

const PATH = "/energia-solar/estimador-custo-total";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Energia Solar", path: "/energia-solar" },
  { name: "Estimador de Custo Total", path: PATH },
];

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "O que entra no CAPEX de um sistema fotovoltaico?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "O CAPEX reúne todo o investimento inicial: módulos, inversores, estrutura de fixação, cabos CC e CA, proteções e balance of plant, mão de obra de instalação, frete e descarregamento, projeto elétrico, ART, homologação junto à distribuidora, comissionamento e uma reserva de contingência de 5% a 10%.",
      },
    },
    {
      "@type": "Question",
      name: "Como tratar a substituição do inversor no custo total?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Inversores string têm vida útil típica de 10 a 15 anos, contra 25 a 30 anos dos módulos. No TCO, lança-se o custo de reposição no ano correspondente à vida útil e repete-se o lançamento a cada novo ciclo dentro do horizonte de análise, trazendo os valores a valor presente pela taxa de desconto adotada.",
      },
    },
    {
      "@type": "Question",
      name: "Qual a diferença entre payback simples e LCOE?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "O payback simples mede em quantos anos a economia líquida cobre o investimento, sem considerar o valor do dinheiro no tempo. O LCOE divide todos os custos descontados do ciclo de vida pela energia descontada gerada, resultando em um custo por kWh que pode ser comparado diretamente com a tarifa da distribuidora.",
      },
    },
    {
      "@type": "Question",
      name: "Quanto custa por kWp um sistema fotovoltaico no Brasil?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Em 2026, sistemas residenciais de 4 a 10 kWp ficam tipicamente entre R$ 3.500 e R$ 5.000 por kWp instalado, enquanto projetos comerciais acima de 50 kWp caem para a faixa de R$ 2.600 a R$ 3.600 por kWp por ganho de escala. Estruturas de solo e trackers elevam o custo por kWp.",
      },
    },
  ],
};

export const Route = createFileRoute("/energia-solar/estimador-custo-total")({
  head: () =>
    pageHead({
      title: "Estimador de Custo Total (TCO) de Sistema Solar | ObraMétrica",
      description:
        "Calcule CAPEX, OPEX, substituições, payback e LCOE de sistemas fotovoltaicos com lista de materiais detalhada, fluxo de caixa anual e exportação CSV/JSON.",
      path: PATH,
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Estimador de Custo Total do Sistema Fotovoltaico (TCO)",
        url: `https://obrametrica.com.br${PATH}`,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      extraSchemas: [FAQ_SCHEMA],
    }),
  component: EstimadorCustoTotalPage,
});

function EstimadorCustoTotalPage() {
  const [result, setResult] = useState<CostResult | null>(null);
  const handleCalc = (input: CostInput) => setResult(estimateCost(input));

  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumbs items={CRUMBS} />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Estimador de Custo Total do Sistema Solar (TCO)
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Monte o orçamento completo de um sistema fotovoltaico: a ferramenta dimensiona módulos,
          inversores, estrutura, cabos e proteções, calcula o CAPEX item a item, projeta o OPEX
          anual e as substituições ao longo da vida útil e devolve payback, LCOE e o fluxo de caixa
          ano a ano. Combine com a{" "}
          <a href="/energia-solar/calculadora-area-layout-paineis" className="underline hover:text-accent">
            calculadora de área e layout
          </a>{" "}
          e com a{" "}
          <a href="/energia-solar/calculadora-perdas-eficiencia" className="underline hover:text-accent">
            calculadora de perdas e eficiência
          </a>{" "}
          para obter comprimentos de cabo e produção anual mais realistas.
        </p>

        <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm print:hidden">
          <EstimatorForm onCalc={handleCalc} />
        </div>

        {result && (
          <>
            <ResultsSummary result={result} />
            <CostBreakdownTable result={result} />
            <CashflowChart result={result} />
            <ExportReport result={result} />
          </>
        )}

        <section className="mt-12 space-y-4 print:hidden">
          <h2 className="text-xl font-semibold text-foreground">Como o custo é estimado</h2>
          <p className="text-sm text-muted-foreground">
            A quantidade de módulos vem de ceil(kWp × 1000 / Pmp) e a compra é arredondada para
            caixas fechadas, somando os módulos reserva. O número de inversores é
            ceil(potência AC alvo / potência nominal da unidade), com a potência AC alvo derivada do
            DC/AC ratio informado. Perfis de fixação assumem dois trilhos por fileira multiplicados
            pelo fator do tipo de estrutura (telhado inclinado 1,0; telhado plano 1,6; solo 2,2;
            tracker 3,0). String boxes seguem a razão de strings por combinador e os fusíveis são
            lançados por string.
          </p>
          <p className="text-sm text-muted-foreground">
            Sobre a soma dos itens diretos aplicam-se o comissionamento (percentual) e a
            contingência. O OPEX anual combina parcelas por kWp (limpeza, manutenção, monitoramento)
            com o seguro proporcional ao CAPEX. As substituições de inversor e de bateria são
            lançadas nos múltiplos da vida útil dentro do horizonte. O LCOE usa o fator de
            recuperação de capital CRF = r(1+r)ⁿ / ((1+r)ⁿ − 1) e desconta tanto os custos quanto a
            energia gerada.
          </p>
          <h2 className="text-xl font-semibold text-foreground">Termos técnicos</h2>
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">CAPEX:</strong> investimento inicial total até a
              energização do sistema.
            </li>
            <li>
              <strong className="text-foreground">OPEX:</strong> despesa operacional recorrente —
              limpeza, manutenção, seguro e monitoramento.
            </li>
            <li>
              <strong className="text-foreground">BOP (balance of plant):</strong> tudo que não é
              módulo nem inversor: proteções, cabos, quadros, aterramento e infraestrutura.
            </li>
            <li>
              <strong className="text-foreground">BOM:</strong> lista de materiais com quantidades e
              preços unitários usada na compra.
            </li>
            <li>
              <strong className="text-foreground">LCOE:</strong> custo nivelado da energia, em
              R$/kWh, comparável diretamente à tarifa.
            </li>
            <li>
              <strong className="text-foreground">Contingência:</strong> reserva para imprevistos de
              obra, normalmente 5% a 10% do CAPEX.
            </li>
          </ul>
        </section>

        <div className="mt-10 rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          <strong className="text-foreground">Estimativas:</strong> os valores unitários pré-carregados
          são referências de mercado brasileiro coletadas em janeiro de 2026 e variam por região,
          fornecedor, câmbio e porte do projeto. Ajuste cada preço com as cotações reais antes de
          fechar a proposta final; esta ferramenta não substitui orçamento formal nem projeto
          executivo.
        </div>
      </section>
    </SiteLayout>
  );
}
