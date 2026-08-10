import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageHead } from "@/lib/seo";
import { Car, Gauge, Fuel, ShieldCheck, Download, Plus, Trash2, Info } from "lucide-react";
import { useState, useMemo } from "react";
import { VehicleInput } from "@/lib/types/budget";
import { calculateVehicleExpenses } from "@/lib/finance/vehicle";
import { ExportButtons } from "@/components/Orcamento/ExportButtons";
import { VehicleExpenses } from "@/components/Orcamento/VehicleExpenses";

const PATH = "/orcamento-domestico/gastos-veiculos";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Orçamento Doméstico", path: "/orcamento-domestico" },
  { name: "Gastos com Veículos", path: PATH },
];

export const Route = createFileRoute("/orcamento-domestico/gastos-veiculos")({
  head: () =>
    pageHead({
      title: "Calculadora de Gastos com Veículos e Frota | ObraMétrica",
      description: "Gestão completa de custos automotivos: combustível, manutenção, seguro, IPVA e depreciação. Compare custos entre combustão e elétrico.",
      path: PATH,
      breadcrumbs: CRUMBS,
    }),
  component: GastosVeiculosPage,
});

function GastosVeiculosPage() {
  const [vehicles, setVehicles] = useState<VehicleInput[]>([]);

  const results = useMemo(() => calculateVehicleExpenses(vehicles), [vehicles]);

  const mockBudgetInput = {
    consumptionMode: 'direct' as const,
    tariff: 0.85,
    taxPct: 25,
    vehicles: vehicles,
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
                <Car className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight sm:text-4xl">Gastos com Veículos</h1>
                <p className="mt-1 text-slate-600">Custos operacionais e depreciação da sua frota.</p>
              </div>
            </div>
            <ExportButtons results={{ vehicles: results } as any} />
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4 space-y-6">
              <VehicleExpenses 
                input={mockBudgetInput} 
                onChange={(updated) => setVehicles(updated.vehicles || [])} 
              />
              
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="flex items-center gap-2 font-bold text-slate-900 mb-4">
                  <Info className="h-4 w-4 text-primary" /> Ajuda & Dicas
                </h3>
                <ul className="text-sm text-slate-600 space-y-3">
                  <li>• A <strong>depreciação</strong> é um custo invisível, mas real. A média é de 10% a 15% ao ano.</li>
                  <li>• Veículos <strong>elétricos</strong> têm consumo em kWh/100km e menor manutenção.</li>
                  <li>• Não esqueça de diluir o <strong>seguro e IPVA</strong> no custo mensal total.</li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Mensal (Frota)</p>
                  <p className="text-3xl font-black text-slate-900">R$ {results.totalMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Anual (Frota)</p>
                  <p className="text-3xl font-black text-primary">R$ {results.totalAnnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>

              {results.list.length > 0 ? (
                <div className="space-y-4">
                  {results.list.map((v) => (
                    <div key={v.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <div className="flex justify-between items-start mb-6">
                        <h3 className="text-lg font-bold text-slate-900">{v.name}</h3>
                        <div className="text-right">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Custo p/ KM</p>
                          <p className="text-xl font-black text-primary">R$ {v.costPerKm.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="p-3 bg-slate-50 rounded-xl">
                          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Combustível</p>
                          <p className="text-sm font-bold text-slate-900">R$ {v.monthlyFuelCost.toFixed(2)}</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl">
                          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Manutenção</p>
                          <p className="text-sm font-bold text-slate-900">R$ {(v.monthlyMaintenance + v.monthlyFiniteItems).toFixed(2)}</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl">
                          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Tributos/Seguro</p>
                          <p className="text-sm font-bold text-slate-900">R$ {(v.monthlyInsurance + v.monthlyIpva + v.monthlyLicensing).toFixed(2)}</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl">
                          <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Depreciação</p>
                          <p className="text-sm font-bold text-slate-900">R$ {v.monthlyDepreciation.toFixed(2)}</p>
                        </div>
                        {v.monthlyFinancing > 0 && (
                          <div className="p-3 bg-slate-50 rounded-xl">
                            <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Financiamento</p>
                            <p className="text-sm font-bold text-slate-900">R$ {v.monthlyFinancing.toFixed(2)}</p>
                          </div>
                        )}
                        <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 col-span-2 sm:col-span-1">
                          <p className="text-[10px] font-bold text-primary uppercase mb-1">Total Mês</p>
                          <p className="text-sm font-black text-primary">R$ {v.totalMonthly.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-12 rounded-2xl border-2 border-dashed border-slate-200 text-center">
                  <Car className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-900">Nenhum veículo adicionado</h3>
                  <p className="text-slate-500 mt-2 max-w-xs mx-auto text-sm">Adicione seu primeiro veículo no painel lateral para começar o cálculo.</p>
                </div>
              )}

              <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl text-sm text-slate-600 leading-relaxed">
                <h4 className="font-bold text-slate-900 mb-2">Nota Metodológica [FONTE_A_VERIFICAR]</h4>
                <p>O custo por KM é calculado dividindo o gasto total mensal pela quilometragem percorrida. A depreciação é calculada pelo método linear simples.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
