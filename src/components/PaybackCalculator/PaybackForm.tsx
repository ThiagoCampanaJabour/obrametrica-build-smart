import { useState } from "react";
import { CENARIOS, type CenarioId, type PaybackInput } from "@/lib/payback/calc";

export interface PaybackFormProps {
  onSimulate: (input: PaybackInput) => void;
  onCompare: (input: Omit<PaybackInput, "cenario">) => void;
}

export function PaybackForm({ onSimulate, onCompare }: PaybackFormProps) {
  const [custo, setCusto] = useState("18000");
  const [producao, setProducao] = useState("7200");
  const [tarifa, setTarifa] = useState("0.95");
  const [uso, setUso] = useState("100");
  const [om, setOm] = useState("250");
  const [taxa, setTaxa] = useState("8");
  const [vida, setVida] = useState("25");
  const [incInicial, setIncInicial] = useState("0");
  const [incAnual, setIncAnual] = useState("0");
  const [cenarioId, setCenarioId] = useState<CenarioId>("padrao");

  const baseInput = (): Omit<PaybackInput, "cenario"> => ({
    custoSistema: Number(custo) || 0,
    producaoAnualKWh: Number(producao) || 0,
    tarifaKWh: Number(tarifa) || 0,
    usoLocalPct: Number(uso) || 0,
    omAnual: Number(om) || 0,
    taxaDesconto: Number(taxa) || 0,
    vidaUtilAnos: Number(vida) || 25,
    incentivoInicial: Number(incInicial) || 0,
    incentivoAnual: Number(incAnual) || 0,
  });

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    onSimulate({ ...baseInput(), cenario: CENARIOS[cenarioId] });
  };

  const field =
    "mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
  const label = "block text-sm font-medium text-foreground";

  return (
    <form
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={handleSimulate}
      aria-label="Formulário da calculadora de payback"
    >
      <div>
        <label htmlFor="custo" className={label}>Custo do sistema (R$)</label>
        <input id="custo" type="number" step="100" min="0" value={custo} onChange={(e) => setCusto(e.target.value)} className={field} required />
      </div>
      <div>
        <label htmlFor="producao" className={label}>Produção anual (kWh/ano)</label>
        <input id="producao" type="number" step="10" min="0" value={producao} onChange={(e) => setProducao(e.target.value)} className={field} required />
      </div>
      <div>
        <label htmlFor="tarifa" className={label}>Tarifa (R$/kWh)</label>
        <input id="tarifa" type="number" step="0.01" min="0" value={tarifa} onChange={(e) => setTarifa(e.target.value)} className={field} required />
      </div>
      <div>
        <label htmlFor="uso" className={label}>% uso local</label>
        <input id="uso" type="number" step="1" min="0" max="100" value={uso} onChange={(e) => setUso(e.target.value)} className={field} />
      </div>
      <div>
        <label htmlFor="om" className={label}>O&amp;M anual (R$)</label>
        <input id="om" type="number" step="10" min="0" value={om} onChange={(e) => setOm(e.target.value)} className={field} />
      </div>
      <div>
        <label htmlFor="taxa" className={label}>Taxa de desconto (% a.a.)</label>
        <input id="taxa" type="number" step="0.1" min="0" value={taxa} onChange={(e) => setTaxa(e.target.value)} className={field} />
      </div>
      <div>
        <label htmlFor="vida" className={label}>Vida útil (anos)</label>
        <input id="vida" type="number" step="1" min="1" max="30" value={vida} onChange={(e) => setVida(e.target.value)} className={field} />
      </div>
      <div>
        <label htmlFor="cenario" className={label}>Cenário</label>
        <select id="cenario" value={cenarioId} onChange={(e) => setCenarioId(e.target.value as CenarioId)} className={field}>
          {Object.values(CENARIOS).map((c) => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="incInicial" className={label}>Incentivo inicial (R$)</label>
        <input id="incInicial" type="number" step="100" min="0" value={incInicial} onChange={(e) => setIncInicial(e.target.value)} className={field} />
      </div>
      <div>
        <label htmlFor="incAnual" className={label}>Incentivo anual (R$)</label>
        <input id="incAnual" type="number" step="10" min="0" value={incAnual} onChange={(e) => setIncAnual(e.target.value)} className={field} />
      </div>
      <div className="sm:col-span-2 flex flex-wrap gap-3 pt-2">
        <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
          Calcular
        </button>
        <button
          type="button"
          onClick={() => onCompare(baseInput())}
          className="rounded-md border border-input bg-background px-4 py-2 text-sm font-semibold hover:bg-accent/20"
        >
          Comparar cenários
        </button>
      </div>
    </form>
  );
}
