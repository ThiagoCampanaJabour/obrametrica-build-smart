import { useState } from "react";
import {
  CIDADES_PRESET, CLIMAS_PRESET, DEFAULT_INPUT, type RadiacaoInput,
} from "@/lib/simulacao-radiacao/calc";

interface Props { onCalc: (input: RadiacaoInput) => void }

export function LocationForm({ onCalc }: Props) {
  const [state, setState] = useState<RadiacaoInput>(DEFAULT_INPUT);

  const setNum = <K extends keyof RadiacaoInput>(k: K, v: string) =>
    setState((s) => ({ ...s, [k]: v === "" ? undefined : Number(v) } as RadiacaoInput));

  const setStr = <K extends keyof RadiacaoInput>(k: K, v: string) =>
    setState((s) => ({ ...s, [k]: v || undefined } as RadiacaoInput));

  const submit = (e: React.FormEvent) => { e.preventDefault(); onCalc(state); };

  const field = "mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
  const label = "block text-sm font-medium text-foreground";

  const selectCidade = (idx: string) => {
    if (idx === "") return;
    const c = CIDADES_PRESET[Number(idx)];
    setState((s) => ({ ...s, cidade: c.nome, lat: c.lat, lng: c.lng }));
  };

  return (
    <form onSubmit={submit} aria-label="Formulário de simulação por localização" className="space-y-6">
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-foreground">Localização (prioridade: lat/lng → CEP → cidade)</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="cidadePreset" className={label}>Cidade (preset)</label>
            <select id="cidadePreset" className={field} onChange={(e) => selectCidade(e.target.value)} defaultValue="0">
              <option value="">— selecione —</option>
              {CIDADES_PRESET.map((c, i) => (
                <option key={c.nome} value={i}>{c.nome}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="cep" className={label}>CEP (opcional)</label>
            <input id="cep" type="text" placeholder="00000-000" value={state.cep ?? ""}
              onChange={(e) => setStr("cep", e.target.value)} className={field} />
          </div>
          <div>
            <label htmlFor="lat" className={label}>Latitude</label>
            <input id="lat" type="number" step="0.0001" value={state.lat ?? ""}
              onChange={(e) => setNum("lat", e.target.value)} className={field} />
          </div>
          <div>
            <label htmlFor="lng" className={label}>Longitude</label>
            <input id="lng" type="number" step="0.0001" value={state.lng ?? ""}
              onChange={(e) => setNum("lng", e.target.value)} className={field} />
          </div>
          <div>
            <label htmlFor="climaFallback" className={label}>Clima (fallback)</label>
            <select id="climaFallback" className={field} value={state.climaFallback ?? ""}
              onChange={(e) => setStr("climaFallback", e.target.value)}>
              <option value="">— não usar —</option>
              {CLIMAS_PRESET.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-foreground">Sistema</legend>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label htmlFor="kWp" className={label}>Capacidade DC (kWp)</label>
            <input id="kWp" type="number" min="0.1" step="0.1" value={state.kWp}
              onChange={(e) => setNum("kWp", e.target.value)} className={field} required />
          </div>
          <div>
            <label htmlFor="tiltDeg" className={label}>Inclinação (°)</label>
            <input id="tiltDeg" type="number" min="0" max="90" step="1" value={state.tiltDeg}
              onChange={(e) => setNum("tiltDeg", e.target.value)} className={field} />
          </div>
          <div>
            <label htmlFor="azimuteDeg" className={label}>Azimute (°)</label>
            <input id="azimuteDeg" type="number" min="-180" max="180" step="1" value={state.azimuteDeg}
              onChange={(e) => setNum("azimuteDeg", e.target.value)} className={field} />
            <p className="mt-1 text-xs text-muted-foreground">0 = norte geográfico (ótimo).</p>
          </div>
          <div>
            <label htmlFor="prPct" className={label}>PR (%)</label>
            <input id="prPct" type="number" min="60" max="95" step="1" value={state.prPct}
              onChange={(e) => setNum("prPct", e.target.value)} className={field} />
          </div>
          <div>
            <label htmlFor="perdasPct" className={label}>Perdas (%)</label>
            <input id="perdasPct" type="number" min="0" max="30" step="1" value={state.perdasPct}
              onChange={(e) => setNum("perdasPct", e.target.value)} className={field} />
          </div>
          <div>
            <label htmlFor="horizonteAnos" className={label}>Horizonte (anos)</label>
            <input id="horizonteAnos" type="number" min="1" max="30" step="1" value={state.horizonteAnos}
              onChange={(e) => setNum("horizonteAnos", e.target.value)} className={field} />
          </div>
          <div>
            <label htmlFor="degradacaoPctAno" className={label}>Degradação (%/ano)</label>
            <input id="degradacaoPctAno" type="number" min="0" max="3" step="0.1" value={state.degradacaoPctAno}
              onChange={(e) => setNum("degradacaoPctAno", e.target.value)} className={field} />
          </div>
        </div>
      </fieldset>

      <button type="submit"
        className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90">
        Simular produção
      </button>
    </form>
  );
}
