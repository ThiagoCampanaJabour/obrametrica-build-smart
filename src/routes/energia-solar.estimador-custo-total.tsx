import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { pageHead } from "@/lib/seo";
import { EstimatorForm } from "@/components/CostEstimator/EstimatorForm";
import { ResultsSummary } from "@/components/CostEstimator/ResultsSummary";
import { CostBreakdownTable } from "@/components/CostEstimator/CostBreakdownTable";
import { CashflowChart } from "@/components/CostEstimator/CashflowChart";
import { ExportReport } from "@/components/CostEstimator/ExportReport";
import { CalculatorShell } from "@/components/calc-ui";
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
    <CalculatorShell
      title="Estimador de Custo Total do Sistema Solar (TCO)"
      description="Calcule CAPEX, OPEX, substituições, payback e LCOE de sistemas fotovoltaicos com lista de materiais detalhada."
      path={PATH}
      extrasId="solar-tco"
    >
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

      <div className="mt-10 rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
        <strong className="text-foreground">Estimativas:</strong> os valores unitários pré-carregados
        são referências de mercado brasileiro coletadas em janeiro de 2026 e variam por região,
        fornecedor, câmbio e porte do projeto. Ajuste cada preço com as cotações reais antes de
        fechar a proposta final; esta ferramenta não substitui orçamento formal nem projeto
        executivo.
      </div>
    </CalculatorShell>
  );
}
