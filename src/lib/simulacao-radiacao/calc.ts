// Simulação por Localização / Radiação Solar — motor puro.
// Presets internos em content/energia-solar/simulacao-radiacao/presets/irradiancia-brasil.json.
// TODO: integração PVGIS/NSRDB — trocar getIrradiancePreset por chamada de API + cache.

import presetsJSON from "../../../content/energia-solar/simulacao-radiacao/presets/irradiancia-brasil.json";

export interface CidadePreset {
  nome: string;
  uf: string;
  lat: number;
  lng: number;
  anual: number;
  mensal: number[]; // 12 valores kWh/m²/mês
}

export type ClimaPreset = "tropical" | "semiarido" | "temperado";

export interface RadiacaoInput {
  lat?: number;
  lng?: number;
  cidade?: string; // "São Paulo, SP" ou "São Paulo"
  cep?: string;
  climaFallback?: ClimaPreset;
  kWp: number;
  tiltDeg: number;
  azimuteDeg: number; // 0 = norte geográfico (ótimo hemisfério sul)
  prPct: number; // 70–90
  perdasPct: number; // padrão 10
  horizonteAnos: number; // 1 ou 25
  degradacaoPctAno: number; // padrão 0.5
}

export interface RadiacaoResult {
  cidadePresetUsada: string;
  fonte: "lat_lng" | "cidade" | "cep" | "clima_fallback";
  irradianciaAnualKWhM2: number; // horizontal (preset)
  irradianciaTiltKWhM2: number; // no plano do módulo
  irradianciaMensalKWhM2: number[]; // 12
  producaoAnualKWh: number;
  producaoMensalKWh: number[]; // 12
  fatorEspecificoKWhKWp: number;
  incertezaPct: number;
  projecaoAnos?: { ano: number; producaoKWh: number }[];
}

const CIDADES: CidadePreset[] = (presetsJSON as { cidades: CidadePreset[] }).cidades;

const CLIMAS: Record<ClimaPreset, { anual: number; mensal: number[] }> = {
  tropical: { anual: 1900, mensal: [180, 165, 170, 155, 145, 135, 145, 160, 170, 180, 180, 185] },
  semiarido: { anual: 2200, mensal: [200, 185, 190, 175, 165, 155, 165, 185, 200, 210, 210, 210] },
  temperado: { anual: 1500, mensal: [170, 150, 140, 115, 95, 80, 90, 110, 120, 145, 165, 170] },
};

const FALLBACK: CidadePreset = {
  nome: "Clima padrão (Brasil)", uf: "-", lat: -15, lng: -47,
  anual: 1800, mensal: [165, 150, 155, 140, 125, 115, 125, 145, 155, 165, 170, 180],
};

function normalize(s: string) {
  return s.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/** Encontra o preset mais próximo por distância euclidiana em graus. */
export function nearestByLatLng(lat: number, lng: number): CidadePreset {
  let best = CIDADES[0];
  let bestD = Infinity;
  for (const c of CIDADES) {
    const d = (c.lat - lat) ** 2 + (c.lng - lng) ** 2;
    if (d < bestD) { bestD = d; best = c; }
  }
  return best;
}

export function findByCidade(name: string): CidadePreset | undefined {
  const n = normalize(name);
  return CIDADES.find((c) => normalize(c.nome).includes(n) || normalize(c.nome.split(",")[0]) === n);
}

/** Ajuste POA simplificado (ver metodologia.md). */
export function tiltFactor(latAbs: number, tilt: number): number {
  const delta = Math.abs(tilt - latAbs);
  const gainOpt = 1.06;
  const decay = Math.max(0.8, gainOpt - 0.0015 * delta);
  return tilt === 0 ? 1.0 : decay;
}

export function azimuteFactor(az: number): number {
  // az 0 = norte geográfico (ótimo). Distância angular ao ótimo:
  const delta = Math.min(Math.abs(az), 360 - Math.abs(az));
  const d = Math.min(delta, 180);
  return Math.max(0.8, 1 - 0.0015 * (d * d) / 90);
}

export function selectPreset(input: RadiacaoInput): { preset: CidadePreset; fonte: RadiacaoResult["fonte"] } {
  if (typeof input.lat === "number" && typeof input.lng === "number") {
    return { preset: nearestByLatLng(input.lat, input.lng), fonte: "lat_lng" };
  }
  if (input.cidade) {
    const c = findByCidade(input.cidade);
    if (c) return { preset: c, fonte: "cidade" };
  }
  if (input.cep) {
    // MVP: sem base de CEP → usa fallback ou clima.
    return { preset: FALLBACK, fonte: "cep" };
  }
  if (input.climaFallback) {
    const cl = CLIMAS[input.climaFallback];
    return {
      preset: { ...FALLBACK, nome: `Clima ${input.climaFallback}`, anual: cl.anual, mensal: cl.mensal },
      fonte: "clima_fallback",
    };
  }
  return { preset: FALLBACK, fonte: "clima_fallback" };
}

export function incertezaFor(fonte: RadiacaoResult["fonte"]): number {
  if (fonte === "cidade") return 10;
  if (fonte === "lat_lng") return 15;
  if (fonte === "cep") return 20;
  return 25;
}

/** Converte irradiância → produção (função de referência citada na doc). */
export function producaoAnual(kWp: number, ghiTilt: number, prPct: number, perdasPct: number): number {
  const pr = prPct / 100;
  const eff = 1 - perdasPct / 100;
  return kWp * ghiTilt * pr * eff;
}

export default function simulate(input: RadiacaoInput): RadiacaoResult {
  const { preset, fonte } = selectPreset(input);
  const latAbs = Math.abs(preset.lat);
  const fTilt = tiltFactor(latAbs, input.tiltDeg);
  const fAz = azimuteFactor(input.azimuteDeg);
  const factor = fTilt * fAz;

  const irradianciaTiltKWhM2 = preset.anual * factor;
  const irradianciaMensalKWhM2 = preset.mensal.map((m) => +(m * factor).toFixed(2));

  const producaoAnualKWh = producaoAnual(input.kWp, irradianciaTiltKWhM2, input.prPct, input.perdasPct);
  const scaleMonth = producaoAnualKWh / irradianciaTiltKWhM2 || 0;
  const producaoMensalKWh = irradianciaMensalKWhM2.map((m) => +(m * scaleMonth).toFixed(1));

  const fatorEspecificoKWhKWp = input.kWp > 0 ? producaoAnualKWh / input.kWp : 0;

  const result: RadiacaoResult = {
    cidadePresetUsada: preset.nome,
    fonte,
    irradianciaAnualKWhM2: +preset.anual.toFixed(0),
    irradianciaTiltKWhM2: +irradianciaTiltKWhM2.toFixed(0),
    irradianciaMensalKWhM2,
    producaoAnualKWh: +producaoAnualKWh.toFixed(0),
    producaoMensalKWh,
    fatorEspecificoKWhKWp: +fatorEspecificoKWhKWp.toFixed(0),
    incertezaPct: incertezaFor(fonte),
  };

  if (input.horizonteAnos > 1) {
    const deg = input.degradacaoPctAno / 100;
    result.projecaoAnos = Array.from({ length: input.horizonteAnos }, (_, i) => ({
      ano: i + 1,
      producaoKWh: +(producaoAnualKWh * Math.pow(1 - deg, i)).toFixed(0),
    }));
  }
  return result;
}

export const DEFAULT_INPUT: RadiacaoInput = {
  cidade: "São Paulo, SP",
  lat: -23.55,
  lng: -46.63,
  kWp: 5.5,
  tiltDeg: 23,
  azimuteDeg: 0,
  prPct: 80,
  perdasPct: 10,
  horizonteAnos: 1,
  degradacaoPctAno: 0.5,
};

export const CIDADES_PRESET = CIDADES;
export const CLIMAS_PRESET: ClimaPreset[] = ["tropical", "semiarido", "temperado"];
