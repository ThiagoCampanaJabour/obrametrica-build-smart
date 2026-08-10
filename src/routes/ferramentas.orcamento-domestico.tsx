import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageHead } from "@/lib/seo";
import { LayoutDashboard, Calculator, Zap, Save, FileText, BarChart3, Settings, HelpCircle, Download } from "lucide-react";
import { useState, useMemo } from "react";
import { calculateBudgetComparison } from "@/lib/solar/pv-economic";
import { BudgetInput } from "@/lib/types/budget";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ferramentas/orcamento-domestico")({
  head: () =>
    pageHead({
      title: "Orçamento Doméstico & Simulador Energético — ObraMétrica",
      description: "Controle seus gastos com energia, compare custo rede vs solar e simule seu payback em minutos.",
      path: "/ferramentas/orcamento-domestico",
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

  const handleExportCSV = () => {
    const headers = "Mes,Consumo (kWh),Geracao (kWh),Custo Rede (R$),Custo com Solar (R$)\n";
    const rows = results.monthlyData.map((d: any) => `${d.month},${d.consumption.toFixed(2)},${d.generation.toFixed(2)},${d.costRede.toFixed(2)},${d.costWithPV.toFixed(2)}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'obrametrica-simulador-solar.csv';
    a.click();
  };

  return (
    <SiteLayout>
      <div className="bg-slate-50 min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <Breadcrumbs items={[{ name: "Início", path: "/" }, { name: "Ferramentas", path: "/conversores" }, { name: "Orçamento & Solar", path: "/ferramentas/orcamento-domestico" }]} />
          
          <div className="mt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Orçamento Doméstico & Simulador Energético</h1>
              <p className="mt-2 text-slate-600 max-w-2xl text-lg">
                Compare o custo da rede elétrica convencional contra a economia de um sistema fotovoltaico em tempo real.
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleExportCSV}
                className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
              >
                <Download className="h-4 w-4" /> Exportar CSV
              </button>
            </div>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-12">
            {/* Left Column: Inputs */}
            <div className="lg:col-span-4 space-y-6">
              <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" /> Dados de Consumo
                </h2>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Consumo Mensal (kWh)</label>
                    <input 
                      type="number" 
                      value={input.monthlyKwh} 
                      onChange={(e) => setInput({...input, monthlyKwh: Number(e.target.value)})}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                      placeholder="Ex: 500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Tarifa (R$/kWh)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={input.tariff} 
                        onChange={(e) => setInput({...input, tariff: Number(e.target.value)})} 
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Impostos (%)</label>
                      <input 
                        type="number" 
                        value={input.taxPct} 
                        onChange={(e) => setInput({...input, taxPct: Number(e.target.value)})} 
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none" 
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" /> Sistema Fotovoltaico
                </h2>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Potência Instalada (kWp)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={input.pv?.kwp} 
                      onChange={(e) => setInput({...input, pv: { ...input.pv!, kwp: Number(e.target.value) }})}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Investimento CAPEX (R$)</label>
                    <input 
                      type="number" 
                      value={input.pv?.capex} 
                      onChange={(e) => setInput({...input, pv: { ...input.pv!, capex: Number(e.target.value) }})}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex justify-between">
                      Simultaneidade (Overlap) 
                      <span className="text-primary text-xs font-normal">{(input.pv?.overlapFactor ?? 0.45) * 100}%</span>
                    </label>
                    <input 
                      type="range" 
                      min="0.1" 
                      max="1" 
                      step="0.05"
                      value={input.pv?.overlapFactor} 
                      onChange={(e) => setInput({...input, pv: { ...input.pv!, overlapFactor: Number(e.target.value) }})}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <p className="mt-1 text-[10px] text-slate-500 italic">Padrão: 45% residencial / 70% comercial</p>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Results & Charts */}
            <div className="lg:col-span-8 space-y-8">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-primary/30 transition-colors">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Custo Rede/Mês</p>
                  <p className="text-2xl font-black text-slate-900">R$ {results.monthlyCost.toFixed(2)}</p>
                </div>
                <div className="bg-primary p-5 rounded-2xl shadow-lg shadow-primary/20 text-white">
                  <p className="text-xs font-medium text-white/80 uppercase tracking-wider mb-1">Novo Custo/Mês</p>
                  <p className="text-2xl font-black">R$ {results.monthlyData[0].costWithPV.toFixed(2)}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Economia Anual</p>
                  <p className="text-2xl font-black text-emerald-600">R$ {results.annualSavings.toFixed(2)}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Payback Simples</p>
                  <p className="text-2xl font-black text-orange-600">
                    {results.paybackYears ? `${results.paybackYears.toFixed(1)} anos` : "N/A"}
                  </p>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" /> Comparativo Mensal (Geração vs Consumo)
                </h3>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={results.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend verticalAlign="top" height={36}/>
                      <Bar name="Consumo (kWh)" dataKey="consumption" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                      <Bar name="Geração (kWh)" dataKey="generation" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

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
