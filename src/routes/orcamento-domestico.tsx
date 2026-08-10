import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageHead } from "@/lib/seo";
import { HelpCircle, FileText } from "lucide-react";
import { useState, useMemo } from "react";
import { calculateBudgetComparison } from "@/lib/solar/pv-economic";
import { BudgetInput } from "@/lib/types/budget";

import { ConsumptionForm } from "@/components/Budget/ConsumptionForm";
import { PVComparisonForm } from "@/components/Budget/PVComparisonForm";
import { ResultsSummary } from "@/components/Budget/ResultsSummary";
import { MonthlyChart } from "@/components/Budget/MonthlyChart";
import { SensitivitySliders } from "@/components/Budget/SensitivitySliders";
import { ExportButtons } from "@/components/Budget/ExportButtons";
import { ExamplesPanel } from "@/components/Budget/ExamplesPanel";
import { HelpPanel } from "@/components/Budget/HelpPanel";

export const Route = createFileRoute("/orcamento-domestico")({
  head: () =>
    pageHead({
      title: "Orçamento Doméstico & Simulador Energético — ObraMétrica",
      description: "Controle seus gastos com energia, compare custo rede vs solar e simule seu payback em minutos.",
      path: "/orcamento-domestico",
    }),
  component: OrcamentoPage,
});

function OrcamentoPage() {
  const [input, setInput] = useState<BudgetInput>({
    consumptionMode: "direct",
    monthlyKwh: 500,
    tariff: 0.85,
    taxPct: 25,
    pv: {
      productionFactor: 1500,
      lossesPct: 14,
      overlapFactor: 0.45,
      capex: 18000,
      lifespanYears: 25,
      opexAnnual: 200,
      kwp: 4
    },
    appliances: []
  });

  const results = useMemo(() => calculateBudgetComparison(input), [input]);

  return (
    <SiteLayout>
      <div className="bg-slate-50 min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <Breadcrumbs items={[
            { name: "Início", path: "/" }, 
            { name: "Ferramentas", path: "/conversores" }, 
            { name: "Orçamento & Solar", path: "/orcamento-domestico" }
          ]} />
          
          <div className="mt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Orçamento Doméstico & Simulador Energético</h1>
              <p className="mt-2 text-slate-600 max-w-2xl text-lg">
                Compare o custo da rede elétrica convencional contra a economia de um sistema fotovoltaico em tempo real.
              </p>
            </div>
            <ExportButtons results={results} />
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-12">
            {/* Coluna Esquerda: Formulários */}
            <div className="lg:col-span-4 space-y-6">
              <ConsumptionForm input={input} onChange={setInput} />
              <PVComparisonForm input={input} onChange={setInput} />
              <SensitivitySliders input={input} onChange={setInput} />
              <ExamplesPanel onSelect={setInput} />
              <HelpPanel />
            </div>

            {/* Coluna Direita: Resultados */}
            <div className="lg:col-span-8 space-y-8">
              <ResultsSummary results={results} />
              <MonthlyChart data={results.monthlyData} />

              {/* LCOE & Methodology Link */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex gap-4 items-center">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                    <HelpCircle className="h-6 w-6 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">LCOE Estimado</h4>
                    <p className="text-2xl font-black text-primary">
                      R$ {results.lcoe ? results.lcoe.toFixed(2) : "0.00"} <span className="text-xs font-medium text-slate-400">/kWh</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <a href="/blog/pv-vs-rede-orcamento-domestico" className="text-primary font-semibold hover:underline flex items-center gap-2 justify-end">
                    Ver metodologia completa <FileText className="h-4 w-4" />
                  </a>
                  <p className="text-[10px] text-slate-500 mt-1 max-w-xs ml-auto italic">
                    Baseado em vida útil de 25 anos e OPEX anual de R$ {input.pv?.opexAnnual}.
                  </p>
                </div>
              </div>
              
              <div className="p-4 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 text-center">
                <p><strong>Atenção:</strong> Os cálculos apresentados são aproximações baseadas nas premissas fornecidas. O retorno real pode variar dependendo de fatores climáticos, regulatórios e técnicos específicos da instalação.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
