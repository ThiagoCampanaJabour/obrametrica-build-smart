import { useState } from "react";
import {
  BATERIAS_PRESET,
  DEFAULT_INPUT,
  type BateriaInput,
} from "@/lib/bateria/calc";

interface Props {
  onCalc: (input: BateriaInput) => void;
}

export function BateriaForm({ onCalc }: Props) {
  const [state, setState] = useState<BateriaInput>(DEFAULT_INPUT);

  const setNum = <K extends keyof BateriaInput>(k: K, v: string) =>
    setState((s) => ({ ...s, [k]: Number(v) } as BateriaInput));

  const setBateria = (idx: string) =>
    setState((s) => ({ ...s, bateria: BATERIAS_PRESET[Number(idx)] }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalc(state);
  };

  const field =
    "mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
  const label = "block text-sm font-medium text-foreground";

  return (
    <form onSubmit={submit} aria-label="Formulário do dimensionamento de bateria" className="space-y-5">
      <div>
        <label htmlFor="bateria" className={label}>Bateria (preset)</label>
        <select
          id="bateria"
          className={field}
          onChange={(e) => setBateria(e.target.value)}
          defaultValue={String(BATERIAS_PRESET.indexOf(DEFAULT_INPUT.bateria))}
        >
          {BATERIAS_PRESET.map((b, i) => (
            <option key={b.nome} value={i}>{b.nome}</option>
          ))}
        </select>
        <p className="mt-1 text-xs text-muted-foreground">
          {state.bateria.capacidadeUnitariaKWh} kWh · DoD {state.bateria.dodPct}% · efic.{" "}
          {state.bateria.eficienciaPct}% · {state.bateria.vidaCiclos} ciclos · R$
          {state.bateria.custoUnitarioBRL.toLocaleString("pt-BR")}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label htmlFor="consumoDiarioKWh" className={label}>Consumo diário (kWh)</label>
          <input id="consumoDiarioKWh" type="number" min="0" step="0.1" value={state.consumoDiarioKWh}
            onChange={(e) => setNum("consumoDiarioKWh", e.target.value)} className={field} />
        </div>
        <div>
          <label htmlFor="autonomiaDias" className={label}>Autonomia (dias)</label>
          <input id="autonomiaDias" type="number" min="0" step="0.25" value={state.autonomiaDias}
            onChange={(e) => setNum("autonomiaDias", e.target.value)} className={field} />
        </div>
        <div>
          <label htmlFor="fatorSeguranca" className={label}>Fator de segurança</label>
          <input id="fatorSeguranca" type="number" min="1" step="0.05" value={state.fatorSeguranca}
            onChange={(e) => setNum("fatorSeguranca", e.target.value)} className={field} />
        </div>
        <div>
          <label htmlFor="ciclosPorAno" className={label}>Ciclos por ano</label>
          <input id="ciclosPorAno" type="number" min="1" step="1" value={state.ciclosPorAno}
            onChange={(e) => setNum("ciclosPorAno", e.target.value)} className={field} />
        </div>
        <div>
          <label htmlFor="horizonteAnos" className={label}>Horizonte (anos)</label>
          <input id="horizonteAnos" type="number" min="1" max="30" step="1" value={state.horizonteAnos}
            onChange={(e) => setNum("horizonteAnos", e.target.value)} className={field} />
        </div>
        <div>
          <label htmlFor="taxaDescontoPctAno" className={label}>Taxa de desconto (% a.a.)</label>
          <input id="taxaDescontoPctAno" type="number" min="0" step="0.1" value={state.taxaDescontoPctAno}
            onChange={(e) => setNum("taxaDescontoPctAno", e.target.value)} className={field} />
        </div>
      </div>

      <div className="pt-2">
        <button type="submit"
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
          Calcular banco de baterias
        </button>
      </div>
    </form>
  );
}
