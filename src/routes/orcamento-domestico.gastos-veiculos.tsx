import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Car } from "lucide-react";
import { pageHead } from "@/lib/seo";
import { VehicleExpenses } from "@/components/Orcamento/VehicleExpenses";
import { useState, useEffect } from "react";
import { BudgetInput, BudgetInputSchema } from "@/lib/types/budget";
import { Toaster, toast } from "sonner";

const PATH = "/orcamento-domestico/gastos-veiculos";
const CRUMBS = [
  { name: "Início", path: "/" },
  { name: "Orçamento Doméstico", path: "/orcamento-domestico" },
  { name: "Gastos com Veículos", path: PATH },
];

const STORAGE_KEY = "obrametrica_budget_data";

export const Route = createFileRoute("/orcamento-domestico/gastos-veiculos")({
  head: () =>
    pageHead({
      title: "Calculadora de Gastos com Veículos (TCO) | ObraMétrica",
      description:
        "Calcule o custo mensal real do seu veículo incluindo combustível, impostos, depreciação, pneus e manutenção preventiva.",
      path: PATH,
      breadcrumbs: CRUMBS,
    }),
  component: VehicleExpensesPage,
});

function VehicleExpensesPage() {
  const [input, setInput] = useState<BudgetInput>({
    consumptionMode: 'direct',
    monthlyKwh: 0,
    appliances: [],
    tariff: 0.85,
    taxPct: 25,
    vehicles: []
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setInput(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to load budget data", e);
      }
    }
  }, []);

  const handleUpdate = (newInput: BudgetInput) => {
    setInput(newInput);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newInput));
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <Breadcrumbs items={CRUMBS} />
        
        <div className="mt-8 mb-10 flex items-center gap-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Car className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Gastos com Veículos
            </h1>
            <p className="text-slate-500 mt-1">Simulador de Custo Total de Propriedade (TCO) mensal.</p>
          </div>
        </div>

        <VehicleExpenses input={input} onChange={handleUpdate} />
        
        <div className="mt-12 p-6 rounded-xl border border-blue-100 bg-blue-50 text-sm text-blue-800">
          <h3 className="font-bold mb-2">Por que calcular o TCO?</h3>
          <p>
            O custo de um carro vai muito além da prestação e do combustível. Depreciação, seguro, impostos e a troca periódica de itens como pneus e óleo representam uma fatia significativa do orçamento doméstico. Esta ferramenta ajuda você a enxergar o custo real por quilômetro rodado.
          </p>
        </div>
      </section>
      <Toaster position="top-right" />
    </SiteLayout>
  );
}
