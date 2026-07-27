import { useState } from "react";
import type { SimulateParams } from "@/lib/simulador-avancado/calc";

const MODULO_PRESETS = [
  { id: "550w", nome: "Monocristalino 550 W (2.28×1.13 m)", largura: 1.13, altura: 2.28, potenciaW: 550 },
  { id: "450w", nome: "Monocristalino 450 W (2.10×1.05 m)", largura: 1.05, altura: 2.10, potenciaW: 450 },
  { id: "330w", nome: "Policristalino 330 W (1.96×0.99 m)", largura: 0.99, altura: 1.96, potenciaW: 330 },
];

export interface SimuladorFormProps {
  onSimulate: (params: SimulateParams, action: "simular" | "otimizar") => void;
}

export function SimuladorForm({ onSimulate }: SimuladorFormProps) {
  const [length, setLength] = useState("10");
  const [width, setWidth] = useState("6");
  const [tilt, setTilt] = useState("20");
  const [azimuth, setAzimuth] = useState("0");
  const [preset, setPreset] = useState(MODULO_PRESETS[0].id);
  const [localidade, setLocalidade] = useState("Brasil (média)");
  const [sombra, setSombra] = useState("10");
  const [potencia, setPotencia] = useState(String(MODULO_PRESETS[0].potenciaW));

  const build = (): SimulateParams => {
    const mod = MODULO_PRESETS.find((m) => m.id === preset) ?? MODULO_PRESETS[0];
    return {
      length: Number(length) || undefined,
      width: Number(width) || undefined,
      tiltDeg: Number(tilt) || 0,
      azimuthDeg: Number(azimuth) || 0,
      modulo: { largura: mod.largura, altura: mod.altura, potenciaW: Number(potencia) || mod.potenciaW },
      sombreamentoMaxPct: Number(sombra) || 0,
    };
  };

  const handle = (e: React.FormEvent, action: "simular" | "otimizar") => {
    e.preventDefault();
    onSimulate(build(), action);
  };

  const field = "mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
  const label = "block text-sm font-medium text-foreground";

  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => handle(e, "simular")} aria-label="Formulário do simulador avançado">
      <div>
        <label htmlFor="length" className={label}>Comprimento (m)</label>
        <input id="length" type="number" step="0.1" min="0" value={length} onChange={(e) => setLength(e.target.value)} className={field} />
      </div>
      <div>
        <label htmlFor="width" className={label}>Largura (m)</label>
        <input id="width" type="number" step="0.1" min="0" value={width} onChange={(e) => setWidth(e.target.value)} className={field} />
      </div>
      <div>
        <label htmlFor="tilt" className={label}>Inclinação (°)</label>
        <input id="tilt" type="number" step="1" min="0" max="90" value={tilt} onChange={(e) => setTilt(e.target.value)} className={field} />
      </div>
      <div>
        <label htmlFor="azimuth" className={label}>Azimute (° — 0 = Norte)</label>
        <input id="azimuth" type="number" step="1" min="-180" max="180" value={azimuth} onChange={(e) => setAzimuth(e.target.value)} className={field} />
      </div>
      <div>
        <label htmlFor="preset" className={label}>Tipo de módulo</label>
        <select id="preset" value={preset} onChange={(e) => { setPreset(e.target.value); const m = MODULO_PRESETS.find(p => p.id === e.target.value); if (m) setPotencia(String(m.potenciaW)); }} className={field}>
          {MODULO_PRESETS.map((m) => <option key={m.id} value={m.id}>{m.nome}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="potencia" className={label}>Potência do módulo (W)</label>
        <input id="potencia" type="number" step="10" min="100" value={potencia} onChange={(e) => setPotencia(e.target.value)} className={field} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="localidade" className={label}>Localidade</label>
        <input id="localidade" type="text" value={localidade} onChange={(e) => setLocalidade(e.target.value)} className={field} placeholder="Ex.: Belo Horizonte, MG" />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="sombra" className={label}>Sombreamento aceitável: <strong>{sombra}%</strong></label>
        <input id="sombra" type="range" min="0" max="30" value={sombra} onChange={(e) => setSombra(e.target.value)} className="mt-2 w-full" />
      </div>
      <div className="sm:col-span-2 flex flex-wrap gap-3 pt-2">
        <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90" aria-label="Executar simulação">Simular</button>
        <button type="button" onClick={(e) => handle(e, "otimizar")} className="rounded-md border border-input bg-background px-4 py-2 text-sm font-semibold hover:bg-accent/20" aria-label="Otimizar strings">Otimizar strings</button>
      </div>
    </form>
  );
}
