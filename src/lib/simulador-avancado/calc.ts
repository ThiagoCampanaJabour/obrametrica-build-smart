/**
 * Simulador Avançado — Energia Solar
 * Funções puras para dimensionamento, sombreamento e otimização de strings.
 * Sem dependências externas. Irradiância padrão editável.
 * TODO: integrar API de irradiância (ex: PVGIS/NASA POWER) para
 * refinar `producEstimadaKWh` por localidade.
 */

export interface SimulateParams {
  /** Área útil disponível em m² (se dimensions omitido). */
  areaM2?: number;
  /** Dimensões alternativas (m). Se presentes, sobrescrevem areaM2. */
  length?: number;
  width?: number;
  /** Inclinação da superfície (graus). */
  tiltDeg: number;
  /** Azimute da superfície (0 = Norte no HS, 180 = Sul). */
  azimuthDeg: number;
  /** Módulo escolhido. */
  modulo: {
    largura: number; // m
    altura: number; // m
    potenciaW: number; // W
  };
  /** Percentual máximo de sombreamento aceitável (0–100). */
  sombreamentoMaxPct: number;
  /** Override manual da perda por sombreamento (0–100). */
  perdaOverridePct?: number;
  /** Ângulo ótimo do local (default 20°, latitude aproximada). */
  tiltOtimoDeg?: number;
  /** Azimute ótimo (default 0 = Norte geográfico p/ HS invertido; usamos 180 no Brasil). */
  azimuteOtimoDeg?: number;
  /** Irradiância média diária (kWh/m²/dia). Default 5.0 (média Brasil). */
  irradianciaKWhM2Dia?: number;
  /** Performance ratio (fração 0–1). Default 0.78. */
  performanceRatio?: number;
  /** Limites de módulos por string. */
  minPorString?: number;
  maxPorString?: number;
}

export interface StringConfig {
  string_id: number;
  modulos: number;
  potencia_total_W: number;
  perda_pct: number;
  producao_anual_kWh: number;
}

export interface SimulateResult {
  areaUsavel: number;
  numModulos: number;
  perdaSombreamentoPct: number;
  producEstimadaKWh: number;
  potenciaTotalKWp: number;
  stringsSuggested: StringConfig[];
  comparativo: {
    semOtimizacao: number;
    comOtimizacao: number;
    ganhoPct: number;
  };
}

/** Perda por sombreamento a partir da diferença angular. */
export function estimarPerdaSombreamento(diffAngular: number): number {
  const d = Math.abs(diffAngular);
  if (d < 15) return 1.5;
  if (d < 45) return 5.5;
  return 14;
}

/** Diferença angular combinada entre orientação real e ótima. */
export function diferencaAngular(
  tilt: number,
  azimute: number,
  tiltOtimo: number,
  azimuteOtimo: number,
): number {
  const dt = tilt - tiltOtimo;
  const da = ((azimute - azimuteOtimo + 540) % 360) - 180;
  return Math.sqrt(dt * dt + da * da) / 2;
}

/** Gera configurações de strings variando o tamanho da string. */
export function otimizarStrings(
  numModulos: number,
  perdaBasePct: number,
  potenciaW: number,
  irradiancia: number,
  pr: number,
  min = 2,
  max = 20,
): StringConfig[] {
  if (numModulos < min) return [];
  const opts: StringConfig[] = [];
  for (let s = min; s <= Math.min(max, numModulos); s++) {
    if (numModulos % s !== 0 && numModulos % s > s / 2) continue;
    const strings = Math.floor(numModulos / s);
    if (strings < 1) continue;
    // Strings maiores sofrem mais com sombreamento parcial (mismatch)
    const penalidade = Math.max(0, (s - 8) * 0.4);
    const perda = perdaBasePct + penalidade;
    const modUsados = strings * s;
    const potTotal = modUsados * potenciaW;
    const prodAnual = (potTotal / 1000) * irradiancia * 365 * pr * (1 - perda / 100);
    opts.push({
      string_id: opts.length + 1,
      modulos: s,
      potencia_total_W: potTotal,
      perda_pct: +perda.toFixed(2),
      producao_anual_kWh: +prodAnual.toFixed(0),
    });
  }
  return opts.sort((a, b) => b.producao_anual_kWh - a.producao_anual_kWh).slice(0, 5);
}

export default function simulate(params: SimulateParams): SimulateResult {
  const area =
    params.length && params.width
      ? params.length * params.width
      : (params.areaM2 ?? 0);
  const areaMod = params.modulo.largura * params.modulo.altura;
  const numModulos = areaMod > 0 ? Math.floor(area / areaMod) : 0;

  const tiltOtimo = params.tiltOtimoDeg ?? 20;
  const azOtimo = params.azimuteOtimoDeg ?? 0; // 0 = Norte geográfico
  const diff = diferencaAngular(params.tiltDeg, params.azimuthDeg, tiltOtimo, azOtimo);
  const perdaCalc = estimarPerdaSombreamento(diff);
  const perda = Math.min(
    params.perdaOverridePct ?? perdaCalc,
    params.sombreamentoMaxPct + perdaCalc,
  );

  const irr = params.irradianciaKWhM2Dia ?? 5.0;
  const pr = params.performanceRatio ?? 0.78;
  const potTotalW = numModulos * params.modulo.potenciaW;
  const potTotalKWp = potTotalW / 1000;

  const producBase = potTotalKWp * irr * 365 * pr;
  const producEstimada = producBase * (1 - perda / 100);

  const strings = otimizarStrings(
    numModulos,
    perda,
    params.modulo.potenciaW,
    irr,
    pr,
    params.minPorString ?? 2,
    params.maxPorString ?? 20,
  );

  const melhor = strings[0]?.producao_anual_kWh ?? producEstimada;
  const ganho = producEstimada > 0 ? ((melhor - producEstimada) / producEstimada) * 100 : 0;

  return {
    areaUsavel: +area.toFixed(2),
    numModulos,
    perdaSombreamentoPct: +perda.toFixed(2),
    producEstimadaKWh: +producEstimada.toFixed(0),
    potenciaTotalKWp: +potTotalKWp.toFixed(2),
    stringsSuggested: strings,
    comparativo: {
      semOtimizacao: +producEstimada.toFixed(0),
      comOtimizacao: +melhor.toFixed(0),
      ganhoPct: +ganho.toFixed(2),
    },
  };
}
