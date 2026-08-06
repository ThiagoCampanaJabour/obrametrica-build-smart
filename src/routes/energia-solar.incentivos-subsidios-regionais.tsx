import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageHead } from "@/lib/seo";
import { SearchLocation } from "@/components/Incentives/SearchLocation";
import { IncentiveList } from "@/components/Incentives/IncentiveList";
import { IncentiveDetail } from "@/components/Incentives/IncentiveDetail";
import { IncentiveImpactCalculator } from "@/components/Incentives/IncentiveImpactCalculator";
import {
  DEFAULT_ESTIMATE,
  applyIncentiveToEstimate,
  computeIncentiveImpact,
  fetchIncentivesForLocation,
  type Estimate,
  type IncentiveImpact,
} from "@/lib/solar/incentives";

const PATH = "/energia-solar/incentivos-subsidios-regionais";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Energia Solar", path: "/energia-solar" },
  { name: "Incentivos e Subsídios Regionais", path: PATH },
];

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Quais incentivos existem para energia solar no Brasil?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Os principais mecanismos são a isenção de ICMS sobre a energia injetada e compensada (Convênio ICMS 16/2015, com adesão estadual), a regra de transição da Lei 14.300/2022 para o pagamento do Fio B, linhas de financiamento com juros reduzidos como o FNE Sol e o BNDES Finame Baixo Carbono, chamadas públicas do Programa de Eficiência Energética das distribuidoras e leis municipais de desconto de IPTU para imóveis com geração fotovoltaica.",
      },
    },
    {
      "@type": "Question",
      name: "Como o incentivo altera o payback do sistema solar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Subvenções e rebates reduzem o CAPEX, diminuindo o numerador do payback. Isenções fiscais e bônus de compensação aumentam a receita anual, e descontos de juros ou de IPTU reduzem o OPEX. A calculadora aplica os incentivos em ordem lógica — primeiro CAPEX, depois receita e OPEX — e recalcula o payback simples com a economia líquida resultante.",
      },
    },
    {
      "@type": "Question",
      name: "Posso acumular dois incentivos diferentes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Depende do programa. Incentivos que atacam a mesma base — por exemplo, duas isenções de ICMS sobre a energia injetada, ou duas linhas de financiamento subsidiado — costumam ser mutuamente exclusivos. A ferramenta agrupa esses casos e mantém apenas o de maior benefício, sinalizando o conflito no relatório.",
      },
    },
    {
      "@type": "Question",
      name: "As informações de incentivos são oficiais?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Cada registro traz a organização responsável, a referência normativa, o link para a fonte e a data da última verificação. Registros marcados como placeholder ou de confiança baixa não devem ser apresentados como benefício vigente antes de confirmação junto ao órgão competente e à assessoria contábil.",
      },
    },
  ],
};

export const Route = createFileRoute("/energia-solar/incentivos-subsidios-regionais")({
  head: () =>
    pageHead({
      title: "Incentivos e Subsídios Solares por Região | ObraMétrica",
      description:
        "Descubra incentivos fiscais, subvenções e financiamentos para energia solar por estado e município, e veja o impacto em CAPEX, OPEX e payback com fontes oficiais.",
      path: PATH,
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Calculadora de Incentivos e Subsídios Regionais para Energia Solar",
        url: `https://obrametrica.com.br${PATH}`,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      extraSchemas: [FAQ_SCHEMA],
    }),
  component: IncentivosPage,
});

function IncentivosPage() {
  const [estimate, setEstimate] = useState<Estimate>(DEFAULT_ESTIMATE);
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [detalhe, setDetalhe] = useState<string | null>(null);
  const [filtro, setFiltro] = useState("todos");

  const disponiveis = useMemo(
    () => fetchIncentivesForLocation(estimate.uf, estimate.municipio),
    [estimate.uf, estimate.municipio],
  );

  const impactos = useMemo(() => {
    const map = new Map<string, IncentiveImpact>();
    for (const inc of disponiveis) map.set(inc.id, computeIncentiveImpact(estimate, inc));
    return map;
  }, [disponiveis, estimate]);

  const aplicados = useMemo(
    () => disponiveis.filter((i) => selecionados.includes(i.id)),
    [disponiveis, selecionados],
  );

  const resultado = useMemo(
    () => applyIncentiveToEstimate(estimate, aplicados),
    [estimate, aplicados],
  );

  const toggle = (id: string) =>
    setSelecionados((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const incDetalhe = disponiveis.find((i) => i.id === detalhe) ?? null;

  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumbs items={CRUMBS} />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Calculadora de Incentivos e Subsídios Regionais (Solar)
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Informe a localidade e as premissas do projeto para listar os incentivos aplicáveis —
          isenções de ICMS, subvenções de CAPEX, linhas de financiamento e benefícios municipais — e
          veja o impacto de cada um sobre CAPEX, OPEX e payback. Combine com o{" "}
          <a href="/energia-solar/estimador-custo-total" className="underline hover:text-accent">
            estimador de custo total (TCO)
          </a>{" "}
          e com a{" "}
          <a href="/energia-solar/calculadora-payback" className="underline hover:text-accent">
            calculadora de payback
          </a>{" "}
          para obter CAPEX e produção mais precisos.
        </p>

        <div className="mt-8 print:hidden">
          <SearchLocation value={estimate} onChange={setEstimate} />
        </div>

        <IncentiveList
          incentives={disponiveis}
          impactos={impactos}
          selecionados={selecionados}
          onToggle={toggle}
          onDetail={(id) => setDetalhe((prev) => (prev === id ? null : id))}
          filtro={filtro}
          onFiltro={setFiltro}
        />

        {incDetalhe && impactos.get(incDetalhe.id) && (
          <IncentiveDetail
            incentive={incDetalhe}
            impacto={impactos.get(incDetalhe.id)!}
            estimate={estimate}
            aplicado={selecionados.includes(incDetalhe.id)}
            onApply={() => toggle(incDetalhe.id)}
            onClose={() => setDetalhe(null)}
          />
        )}

        <IncentiveImpactCalculator
          estimate={estimate}
          aplicados={aplicados}
          resultado={resultado}
        />

        <section className="mt-12 space-y-4 print:hidden">
          <h2 className="text-xl font-semibold text-foreground">Como o impacto é calculado</h2>
          <p className="text-sm text-muted-foreground">
            Cada incentivo tem um modelo de impacto explícito. Descontos diretos aplicam
            CAPEX × percentual, limitado ao teto do programa. Rebates entram como valor fixo.
            Isenções de ICMS multiplicam a receita anual pela alíquota estadual e pelo percentual
            isento. Bônus de compensação e descontos tarifários aumentam a receita anual. Linhas de
            financiamento subsidiadas convertem a diferença de taxa em economia anual usando o saldo
            devedor médio (metade do principal em amortização linear). Créditos fiscais e descontos
            de IPTU reduzem o OPEX anual.
          </p>
          <p className="text-sm text-muted-foreground">
            Quando vários incentivos são aplicados, a ordem segue CAPEX → rebates → benefícios
            fiscais → receita → financiamento, e cada etapa recalcula sobre o valor já ajustado.
            Programas que atacam a mesma base são marcados com um grupo de exclusividade: apenas o
            de maior benefício é mantido, e o conflito é registrado no relatório.
          </p>
          <h2 className="text-xl font-semibold text-foreground">Transparência das fontes</h2>
          <p className="text-sm text-muted-foreground">
            Todo incentivo exibe organização, referência normativa, link oficial e data da última
            verificação. O indicador de confiança combina a origem (site oficial × imprensa) e a
            idade da verificação. Registros marcados como placeholder existem apenas para orientar a
            curadoria e não devem ser usados em proposta comercial.
          </p>
        </section>

        <div className="mt-10 rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          <strong className="text-foreground">Aviso legal:</strong> a informação sobre incentivos e
          subsídios é fornecida para orientação inicial. Incentivos podem mudar sem aviso; verifique
          a portaria, o decreto ou a norma vinculada antes de tomar decisões contratuais. A
          ObraMétrica não se responsabiliza por mudanças legislativas — consulte o órgão oficial e
          sua assessoria contábil ou fiscal, especialmente em benefícios de ICMS e imposto de renda.
        </div>
      </section>
    </SiteLayout>
  );
}
