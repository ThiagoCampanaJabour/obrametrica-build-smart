// Motor de cálculo — String Sizing / dimensionamento de inversor.
// Todas as funções são puras. Documentado em content/energia-solar/inversor/metodologia.md.

export interface ModuloSpec {
  nome: string;
  potenciaW: number;
  vmp: number;
  voc: number;
  imp: number;
  isc: number;
  /** Coeficiente de temperatura de Voc em %/°C (ex.: -0.27 → -0,27%/°C). */
  coefVocPctPerC: number;
}

export interface InversorSpec {
  nome: string;
  potenciaAcW: number;
  vocMax: number;
  mpptMin: number;
  mpptMax: number;
  numMPPT: number;
  /** Correntes máximas por MPPT (A). Opcional. */
  correnteMaxMPPT?: number;
}

export interface SizingInput {
  modulo: ModuloSpec;
  inversor: InversorSpec;
  numModulos: number;
  tempMinC: number;
  tempMaxC?: number;
  safetyFactor: number; // 0-1, típico 0.95
  minModulosString: number;
  maxModulosString: number;
}

export interface StringConfig {
  mppt: number;
  modulosPorString: number;
  numStrings: number;
  vmpSum: number;
  vocSum: number;
  vocCorr: number;
  potenciaDcW: number;
  status: "OK" | "AVISO" | "ERRO";
  warnings: string[];
}

export interface SizingResult {
  input: SizingInput;
  configuracoes: StringConfig[];
  melhor: StringConfig | null;
  totalModulosUsados: number;
  potenciaDcTotalW: number;
  dcAcRatio: number;
  warnings: string[];
  passos: {
    vmpUnit: number;
    vocUnit: number;
    coefDecimalPerC: number;
    deltaTFrio: number; // T_min - 25
    fatorCorrecao: number; // (1 + coef*ΔT)
  };
}

export const MODULOS_PRESET: ModuloSpec[] = [
  { nome: "Módulo 370 Wp (típico)", potenciaW: 370, vmp: 34.0, voc: 40.5, imp: 10.9, isc: 11.5, coefVocPctPerC: -0.27 },
  { nome: "Módulo 450 Wp (mono half-cell)", potenciaW: 450, vmp: 41.0, voc: 49.5, imp: 11.0, isc: 11.7, coefVocPctPerC: -0.27 },
  { nome: "Módulo 550 Wp (mono half-cell)", potenciaW: 550, vmp: 41.8, voc: 49.9, imp: 13.2, isc: 14.0, coefVocPctPerC: -0.26 },
  { nome: "Módulo 600 Wp (bifacial)", potenciaW: 600, vmp: 43.5, voc: 52.0, imp: 13.8, isc: 14.6, coefVocPctPerC: -0.26 },
];

export const INVERSORES_PRESET: InversorSpec[] = [
  { nome: "Inversor 3 kW (1 MPPT, 600 V)", potenciaAcW: 3000, vocMax: 600, mpptMin: 120, mpptMax: 550, numMPPT: 1, correnteMaxMPPT: 12 },
  { nome: "Inversor 5 kW (2 MPPT, 1000 V)", potenciaAcW: 5000, vocMax: 1000, mpptMin: 150, mpptMax: 850, numMPPT: 2, correnteMaxMPPT: 12.5 },
  { nome: "Inversor 8 kW (2 MPPT, 1000 V)", potenciaAcW: 8000, vocMax: 1000, mpptMin: 180, mpptMax: 850, numMPPT: 2, correnteMaxMPPT: 16 },
  { nome: "Inversor 15 kW (3 MPPT, 1100 V)", potenciaAcW: 15000, vocMax: 1100, mpptMin: 200, mpptMax: 950, numMPPT: 3, correnteMaxMPPT: 16 },
];

export const DEFAULT_INPUT: SizingInput = {
  modulo: MODULOS_PRESET[2],
  inversor: INVERSORES_PRESET[1],
  numModulos: 12,
  tempMinC: 5,
  tempMaxC: 65,
  safetyFactor: 0.95,
  minModulosString: 3,
  maxModulosString: 20,
};

/**
 * Corrige Voc pela temperatura mínima esperada.
 * Voc_corr = Voc × (1 + coef × ΔT), com coef em decimal por °C (ex.: -0.0027).
 */
export function vocCorrigido(vocTotal: number, coefPctPerC: number, tempMinC: number): number {
  const coef = coefPctPerC / 100; // percent → decimal
  const deltaT = tempMinC - 25;
  return vocTotal * (1 + coef * deltaT);
}

function round(n: number, d = 2): number {
  const p = Math.pow(10, d);
  return Math.round(n * p) / p;
}

/**
 * Enumera configurações candidatas (módulos por string × nº de strings)
 * e valida contra as faixas do inversor.
 */
export function sizeStrings(input: SizingInput): SizingResult {
  const { modulo, inversor, numModulos, tempMinC, safetyFactor, minModulosString, maxModulosString } = input;
  const coefDecimal = modulo.coefVocPctPerC / 100;
  const deltaTFrio = tempMinC - 25;
  const fatorCorrecao = 1 + coefDecimal * deltaTFrio;

  const configs: StringConfig[] = [];
  const maxCap = Math.min(maxModulosString, numModulos);

  for (let m = minModulosString; m <= maxCap; m++) {
    const totalStrings = Math.floor(numModulos / m);
    if (totalStrings < 1) continue;
    // Distribui strings entre MPPTs (balanceado)
    const stringsPorMppt = Math.max(1, Math.floor(totalStrings / inversor.numMPPT));
    const vmpSum = modulo.vmp * m;
    const vocSum = modulo.voc * m;
    const vocCorr = vocCorrigido(vocSum, modulo.coefVocPctPerC, tempMinC);
    const potenciaDcW = modulo.potenciaW * m * totalStrings;

    const warnings: string[] = [];
    let status: StringConfig["status"] = "OK";

    if (vocCorr > inversor.vocMax * safetyFactor) {
      status = "ERRO";
      warnings.push(
        `Voc corrigido (${round(vocCorr)} V) excede o limite seguro do inversor (${round(inversor.vocMax * safetyFactor)} V). Reduzir módulos por string.`,
      );
    } else if (vocCorr > inversor.vocMax * 0.9) {
      status = "AVISO";
      warnings.push(`Voc corrigido próximo do limite (${round(vocCorr)} V ≈ ${round((vocCorr / inversor.vocMax) * 100)}% do Voc máx).`);
    }
    if (vmpSum < inversor.mpptMin) {
      status = status === "ERRO" ? "ERRO" : "AVISO";
      warnings.push(`Vmp da string (${round(vmpSum)} V) abaixo do MPPT mínimo (${inversor.mpptMin} V).`);
    }
    if (vmpSum > inversor.mpptMax) {
      status = "ERRO";
      warnings.push(`Vmp da string (${round(vmpSum)} V) acima do MPPT máximo (${inversor.mpptMax} V).`);
    }
    if (inversor.correnteMaxMPPT && modulo.isc > inversor.correnteMaxMPPT) {
      status = status === "ERRO" ? "ERRO" : "AVISO";
      warnings.push(`Isc do módulo (${modulo.isc} A) acima da corrente máx por MPPT (${inversor.correnteMaxMPPT} A).`);
    }

    configs.push({
      mppt: inversor.numMPPT,
      modulosPorString: m,
      numStrings: totalStrings,
      vmpSum: round(vmpSum),
      vocSum: round(vocSum),
      vocCorr: round(vocCorr),
      potenciaDcW: round(potenciaDcW, 0),
      status,
      warnings,
    });
    // For informational purposes, stringsPorMppt only used internally.
    void stringsPorMppt;
  }

  // Melhor: OK que utiliza mais módulos e maior potência
  const okConfigs = configs.filter((c) => c.status === "OK");
  const melhor =
    okConfigs.sort((a, b) => b.potenciaDcW - a.potenciaDcW || b.modulosPorString - a.modulosPorString)[0] ?? null;

  const totalModulosUsados = melhor ? melhor.modulosPorString * melhor.numStrings : 0;
  const potenciaDcTotalW = melhor ? melhor.potenciaDcW : 0;
  const dcAcRatio = potenciaDcTotalW > 0 ? round(potenciaDcTotalW / inversor.potenciaAcW, 2) : 0;

  const globalWarnings: string[] = [];
  if (!melhor) globalWarnings.push("Nenhuma configuração válida encontrada. Ajuste temperatura, inversor ou nº de módulos.");
  if (dcAcRatio > 1.4) globalWarnings.push(`Relação DC/AC alta (${dcAcRatio}). Verifique clipping de potência.`);
  if (dcAcRatio > 0 && dcAcRatio < 1.05) globalWarnings.push(`Relação DC/AC baixa (${dcAcRatio}). Inversor subutilizado.`);

  return {
    input,
    configuracoes: configs,
    melhor,
    totalModulosUsados,
    potenciaDcTotalW,
    dcAcRatio,
    warnings: globalWarnings,
    passos: {
      vmpUnit: modulo.vmp,
      vocUnit: modulo.voc,
      coefDecimalPerC: coefDecimal,
      deltaTFrio,
      fatorCorrecao: round(fatorCorrecao, 4),
    },
  };
}

export default sizeStrings;
