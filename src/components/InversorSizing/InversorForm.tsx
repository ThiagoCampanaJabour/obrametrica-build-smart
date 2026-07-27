import { useState } from "react";
import {
  DEFAULT_INPUT,
  INVERSORES_PRESET,
  MODULOS_PRESET,
  type SizingInput,
} from "@/lib/inversor-sizing/calc";

interface Props {
  onCalc: (input: SizingInput) => void;
}

export function InversorForm({ onCalc }: Props) {
  const [state, setState] = useState<SizingInput>(DEFAULT_INPUT);

  const setNum = <K extends keyof SizingInput>(k: K, v: string) =>
    setState((s) => ({ ...s, [k]: Number(v) } as SizingInput));

  const setModulo = (idx: string) =>
    setState((s) => ({ ...s, modulo: MODULOS_PRESET[Number(idx)] }));
  const setInversor = (idx: string) =>
    setState((s) => ({ ...s, inversor: INVERSORES_PRESET[Number(idx)] }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalc(state);
  };

  const field =
    "mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
  const label = "block text-sm font-medium text-foreground";

  return (
    <form onSubmit={submit} aria-label="Formulário do dimensionamento de inversor" className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="modulo" className={label}>Módulo (preset)</label>
          <select id="modulo" className={field} onChange={(e) => setModulo(e.target.value)}
            defaultValue={String(MODULOS_PRESET.indexOf(DEFAULT_INPUT.modulo))}>
            {MODULOS_PRESET.map((m, i) => (
              <option key={m.nome} value={i}>{m.nome}</option>
            ))}
          </select>
          <p className="mt-1 text-xs text-muted-foreground">
            Vmp {state.modulo.vmp} V · Voc {state.modulo.voc} V · coef {state.modulo.coefVocPctPerC} %/°C
          </p>
        </div>
        <div>
          <label htmlFor="inversor" className={label}>Inversor (preset)</label>
          <select id="inversor" className={field} onChange={(e) => setInversor(e.target.value)}
            defaultValue={String(INVERSORES_PRESET.indexOf(DEFAULT_INPUT.inversor))}>
            {INVERSORES_PRESET.map((iv, i) => (
              <option key={iv.nome} value={i}>{iv.nome}</option>
            ))}
          </select>
          <p className="mt-1 text-xs text-muted-foreground">
            MPPT {state.inversor.mpptMin}–{state.inversor.mpptMax} V · Voc máx {state.inversor.vocMax} V · {state.inversor.numMPPT} MPPT
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label htmlFor="numModulos" className={label}>Nº de módulos disponíveis</label>
          <input id="numModulos" type="number" min="1" step="1" value={state.numModulos}
            onChange={(e) => setNum("numModulos", e.target.value)} className={field} />
        </div>
        <div>
          <label htmlFor="tempMinC" className={label}>Temp. mínima (°C)</label>
          <input id="tempMinC" type="number" step="1" value={state.tempMinC}
            onChange={(e) => setNum("tempMinC", e.target.value)} className={field} />
        </div>
        <div>
          <label htmlFor="safetyFactor" className={label}>Safety factor (0–1)</label>
          <input id="safetyFactor" type="number" step="0.01" min="0.5" max="1" value={state.safetyFactor}
            onChange={(e) => setNum("safetyFactor", e.target.value)} className={field} />
        </div>
        <div>
          <label htmlFor="minModulosString" className={label}>Mín. módulos/string</label>
          <input id="minModulosString" type="number" min="2" step="1" value={state.minModulosString}
            onChange={(e) => setNum("minModulosString", e.target.value)} className={field} />
        </div>
        <div>
          <label htmlFor="maxModulosString" className={label}>Máx. módulos/string</label>
          <input id="maxModulosString" type="number" min="2" step="1" value={state.maxModulosString}
            onChange={(e) => setNum("maxModulosString", e.target.value)} className={field} />
        </div>
      </div>

      <div className="pt-2">
        <button type="submit"
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
          Calcular dimensionamento
        </button>
      </div>
    </form>
  );
}
