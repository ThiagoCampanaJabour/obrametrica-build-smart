import { useState } from "react";
import { type CompareInput, DEFAULT_INPUT, PRESETS } from "@/lib/comparador-sistemas/calc";

interface Props {
  onCompare: (input: CompareInput) => void;
}

export function ComparadorForm({ onCompare }: Props) {
  const [state, setState] = useState<CompareInput>(DEFAULT_INPUT);

  const set = <K extends keyof CompareInput>(k: K, v: string) =>
    setState((s) => ({ ...s, [k]: Number(v) || 0 }));

  const applyPreset = (key: keyof typeof PRESETS) => {
    setState((s) => ({ ...s, ...PRESETS[key] }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onCompare(state);
  };

  const field =
    "mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
  const label = "block text-sm font-medium text-foreground";

  const rows: Array<[keyof CompareInput, string, string?, string?]> = [
    ["potenciaKWp", "Potência instalada (kWp)", "0.1"],
    ["producaoAnualKWh", "Produção anual (kWh/ano)", "10"],
    ["tarifaKWh", "Tarifa (R$/kWh)", "0.01"],
    ["usoLocalPct", "% uso local", "1", "0-100"],
    ["consumoMensalKWh", "Consumo médio (kWh/mês)", "10"],
    ["custoPorKWp", "Custo por kWp (R$)", "50"],
    ["autonomiaHoras", "Autonomia desejada (h)", "1"],
    ["custoBateriaKWh", "Custo bateria (R$/kWh)", "50"],
    ["vidaUtilAnos", "Vida útil (anos)", "1"],
    ["taxaDesconto", "Taxa desconto (% a.a.)", "0.1"],
    ["omPct", "O&M (% inv./ano)", "0.1"],
    ["degradacaoPct", "Degradação (%/ano)", "0.1"],
    ["eficienciaInversorPct", "Eficiência inversor (%)", "1"],
    ["perdasSistemaPct", "Perdas do sistema (%)", "1"],
    ["dodPct", "Profundidade descarga (%)", "1"],
    ["vidaBateriaAnos", "Vida bateria (anos)", "1"],
  ];

  return (
    <form onSubmit={submit} aria-label="Formulário do comparador de sistemas solares" className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {Object.entries(PRESETS).map(([k, p]) => (
          <button
            key={k}
            type="button"
            onClick={() => applyPreset(k as keyof typeof PRESETS)}
            className="rounded-full border border-input bg-background px-3 py-1 text-xs font-medium hover:bg-accent/20"
          >
            {p.nome}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {rows.map(([key, lbl, step]) => (
          <div key={key}>
            <label htmlFor={String(key)} className={label}>{lbl}</label>
            <input
              id={String(key)}
              type="number"
              step={step ?? "1"}
              min="0"
              value={state[key]}
              onChange={(e) => set(key, e.target.value)}
              className={field}
            />
          </div>
        ))}
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Comparar sistemas
        </button>
      </div>
    </form>
  );
}
