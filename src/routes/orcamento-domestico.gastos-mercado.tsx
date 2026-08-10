import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageHead } from "@/lib/seo";
import { ShoppingCart, TrendingUp, Users, Download, Info } from "lucide-react";
import { useState, useMemo } from "react";
import { MarketInput } from "@/lib/types/budget";
import { calculateMarketExpenses } from "@/lib/finance/market";
import { ExportButtons } from "@/components/Orcamento/ExportButtons";
import { MarketExpenses } from "@/components/Orcamento/MarketExpenses";

const PATH = "/orcamento-domestico/gastos-mercado";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Orçamento Doméstico", path: "/orcamento-domestico" },
  { name: "Gastos com Mercado", path: PATH },
];

export const Route = createFileRoute("/orcamento-domestico/gastos-mercado")({
  head: () =>
    pageHead({
      title: "Calculadora de Gastos com Mercado e Alimentação | ObraMétrica",
      description: "Estime seu gasto mensal com mercado, custo por pessoa e projeção com inflação. Planeje seu orçamento familiar com precisão.",
      path: PATH,
      breadcrumbs: CRUMBS,
    }),
  component: GastosMercadoPage,
});

function GastosMercadoPage() {
  const [marketInput, setMarketInput] = useState<MarketInput>({
    mode: 'total',
    monthlyTotal: 1500,
    categories: [],
    familyMembers: 2,
    annualInflationPct: 5,
    projectionYears: 5
  });

  const results = useMemo(() => calculateMarketExpenses(marketInput), [marketInput]);

  const mockBudgetInput = {
    consumptionMode: 'direct' as const,
    tariff: 0.85,
    taxPct: 25,
    market: marketInput,
    vehicles: [],
    appliances: []
  };

  return (
    <SiteLayout>
      <div className="bg-slate-50 min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <Breadcrumbs items={CRUMBS} />
          
          <div className="mt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                <ShoppingCart className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight sm:text-4xl">Gastos com Mercado</h1>
                <p className="mt-1 text-slate-600">Alimentação, higiene e limpeza sob controle.</p>
              </div>
            </div>
            <ExportButtons results={{ market: results } as any} />
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4 space-y-6">
              <MarketExpenses 
                input={mockBudgetInput} 
                onChange={(updated) => setMarketInput(updated.market!)} 
              />
              
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="flex items-center gap-2 font-bold text-slate-900 mb-4">
                  <Info className="h-4 w-4 text-primary" /> Ajuda & Dicas
                </h3>
                <ul className="text-sm text-slate-600 space-y-3">
                  <li>• Use o <strong>gasto mensal médio</strong> dos últimos 3 meses para maior precisão.</li>
                  <li>• A <strong>inflação</strong> (IPCA) impacta diretamente o poder de compra.</li>
                  <li>• Considere <strong>membros da família</strong> fixos para o cálculo per capita.</li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Users className="h-3 w-3" /> Per Capita / Mês
                  </p>
                  <p className="text-3xl font-black text-slate-900">R$ {results.perCapitaMonth.toFixed(2)}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <ShoppingCart className="h-3 w-3" /> Total Anual
                  </p>
                  <p className="text-3xl font-black text-slate-900">R$ {results.annualTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> Projeção ({marketInput.projectionYears} anos)
                  </p>
                  <p className="text-3xl font-black text-primary">
                    R$ {results.projection[results.projection.length - 1].amount.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                  </p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Projeção de Custos por Inflação</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="py-3 font-semibold text-slate-500">Ano</th>
                        <th className="py-3 font-semibold text-slate-500 text-right">Gasto Anual Est.</th>
                        <th className="py-3 font-semibold text-slate-500 text-right">Variação Acumulada</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {results.projection.map((p) => (
                        <tr key={p.year} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 text-slate-900 font-medium">Ano {p.year} {p.year === 0 && <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded ml-2">ATUAL</span>}</td>
                          <td className="py-4 text-right text-slate-700 font-semibold">R$ {p.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                          <td className="py-4 text-right font-bold text-red-500">+{p.variationPct.toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl text-sm text-slate-600 leading-relaxed">
                <h4 className="font-bold text-slate-900 mb-2">Nota Metodológica [FONTE_A_VERIFICAR]</h4>
                <p>Os cálculos consideram juros compostos baseados na taxa de inflação informada. O valor per capita é uma média aritmética simples entre o total e os membros informados.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
