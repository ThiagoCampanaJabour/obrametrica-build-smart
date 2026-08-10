import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { pageHead } from "@/lib/seo";
import { SearchLocation } from "@/components/Incentives/SearchLocation";
import { IncentiveList } from "@/components/Incentives/IncentiveList";
import { IncentiveDetail } from "@/components/Incentives/IncentiveDetail";
import { IncentiveImpactCalculator } from "@/components/Incentives/IncentiveImpactCalculator";
import { CalculatorShell } from "@/components/calc-ui";
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
      name: "Como funciona a isenção de ICMS para energia solar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A maioria dos estados brasileiros adere ao Convênio ICMS 16/15, que isenta a parcela da energia injetada na rede que é compensada pelo consumo. A isenção costuma incidir sobre a Tarifa de Energia (TE), mas nem sempre sobre a TUSD (Tarifa de Uso do Sistema de Distribuição), dependendo da legislação estadual específica.",
      },
    },
    {
      "@type": "Question",
      name: "Existem subsídios diretos para a compra de painéis?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Subsídios diretos (fundo perdido) são raros para o consumidor comum, mas existem programas para baixa renda ou produtores rurais em estados específicos. O benefício mais comum é o financiamento com taxas reduzidas via bancos públicos (BNDES, BB) ou bancos regionais de desenvolvimento.",
      },
    },
    {
      "@type": "Question",
      name: "O que é o PADIS para energia solar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "O Programa de Apoio ao Desenvolvimento Tecnológico da Indústria de Semicondutores (PADIS) foi estendido à indústria fotovoltaica, reduzindo a zero alíquotas de PIS, COFINS e IPI para insumos e equipamentos fabricados no Brasil ou importados sem similar nacional, o que impacta diretamente o preço final dos kits.",
      },
    },
  ],
};

export const Route = createFileRoute("/energia-solar/incentivos-subsidios-regionais")({
  head: () =>
    pageHead({
      title: "Calculadora de Incentivos e Subsídios Regionais | ObraMétrica",
      description:
        "Identifique incentivos fiscais, subvenções e linhas de financiamento solar por CEP/UF e calcule o impacto no payback e LCOE do seu projeto.",
      path: PATH,
      breadcrumbs: CRUMBS,
      schema: {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Calculadora de Incentivos Regionais Fotovoltaicos",
        url: `https://obrametrica.com.br${PATH}`,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
      },
      extraSchemas: [FAQ_SCHEMA],
    }),
  component: IncentivosRegionaisPage,
});

function IncentivosRegionaisPage() {
  const [estimate, setEstimate] = useState<Estimate>(DEFAULT_ESTIMATE);
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [detalhe, setDetalhe] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<string>("");

  const disponiveis = useMemo(() => fetchIncentivesForLocation(estimate.cep ?? "", estimate.uf), [
    estimate.cep,
    estimate.uf,
  ]);

  const impactos = useMemo(() => {
    const map = new Map<string, IncentiveImpact>();
    disponiveis.forEach((inc) => {
      map.set(inc.id, computeIncentiveImpact(inc, estimate as any));
    });
    return map;
  }, [disponiveis, estimate]);

  const aplicados = useMemo(() => disponiveis.filter((i) => selecionados.includes(i.id)), [
    disponiveis,
    selecionados,
  ]);

  const resultado = useMemo(
    () => applyIncentiveToEstimate(estimate, aplicados),
    [estimate, aplicados],
  );

  const toggle = (id: string) =>
    setSelecionados((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const incDetalhe = disponiveis.find((i) => i.id === detalhe) ?? null;

  return (
    <CalculatorShell
      title="Calculadora de Incentivos e Subsídios Regionais (Solar)"
      description="Informe a localidade e as premissas do projeto para listar os incentivos aplicáveis e veja o impacto financeiro."
      breadcrumbs={CRUMBS}
      extrasId="solar-incentivos"
    >
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

      <div className="mt-10 rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
        <strong className="text-foreground">Aviso legal:</strong> a informação sobre incentivos e
        subsídios é fornecida para orientação inicial. Incentivos podem mudar sem aviso; verifique
        a portaria, o decreto ou a norma vinculada antes de tomar decisões contratuais. A
        ObraMétrica não se responsabiliza por mudanças legislativas.
      </div>
    </CalculatorShell>
  );
}
