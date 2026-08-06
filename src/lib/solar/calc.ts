/**
 * Motor de cálculo — Calculadora de Perdas / Eficiência (Energia Solar).
 *
 * Todas as funções são puras e testáveis. A ordem de aplicação das perdas é
 * multiplicativa (em cascata), do lado DC para o lado AC:
 *
 *   temperatura → sombreamento → soiling → mismatch → cabos DC
 *   → inversor (η + clipping) → perdas AC / BOS
 *
 * Cada item do breakdown reporta a energia perdida em kWh/ano e o percentual
 * dessa perda em relação à energia teórica DC de entrada (para que a soma dos
 * itens seja igual à perda total do sistema).
 */

export interface LossItem {
  /** Identificador estável (usado em export CSV/JSON). */
  id: string;
  name: string;
  /** Percentual da perda em relação à energia teórica DC (0–100). */
  pct: number;
  /** Energia perdida em kWh/ano. */
  kWh: number;
  /** Fator aplicado nessa etapa (0–1), útil para auditoria. */
  factor: number;
  /** Fórmula / premissa adotada. */
  formula: string;
}

export interface StepResult {
  loss_kWh: number;
  loss_pct: number;
  energy_after_kWh: number;
}

export interface SolarLossesInput {
  /** Energia teórica DC no ano (kWh/ano). Obrigatória e > 0. */
  energiaTeoricaDc_kWh: number;
  /** Potência DC instalada (kWp) — usada para DC/AC ratio e relatórios. */
  potenciaDc_kWp: number;
  /** Potência nominal AC do inversor (kW). 0 = ignorar clipping automático. */
  potenciaAc_kW: number;

  /** Coeficiente térmico de potência do módulo, %/°C (valor negativo, ex.: -0.35). */
  coefTermico_pctPerC: number;
  /** Temperatura ambiente média de operação (°C). */
  tempAmbiente_C: number;
  /** NOCT do módulo (°C). */
  noct_C: number;
  /** Irradiância média de operação (W/m²) usada no modelo de célula. */
  irradianciaMedia_Wm2: number;
  /** Se true, usa tempCelulaManual_C em vez do modelo NOCT. */
  usarTempCelulaManual: boolean;
  tempCelulaManual_C: number;

  /** Perdas percentuais (0–100). */
  sombreamento_pct: number;
  soiling_pct: number;
  mismatch_pct: number;

  /** Cabos DC: modo percentual ou cálculo por I²R. */
  cabosModo: "percentual" | "resistivo";
  cabosDc_pct: number;
  /** Corrente de operação total (A) — modo resistivo. */
  correnteOperacao_A: number;
  /** Resistência total do circuito DC (Ω) — modo resistivo. */
  resistenciaTotal_ohm: number;
  /** Horas equivalentes de operação a plena carga (h/ano) — modo resistivo. */
  horasEquivalentes_h: number;

  /** Eficiência do inversor (%) — tipicamente 96–98. */
  eficienciaInversor_pct: number;
  /** Clipping: automático pelo DC/AC ratio ou manual. */
  clippingModo: "auto" | "manual";
  clipping_pct: number;

  /** Perdas AC / balance-of-system (%). */
  perdasAc_pct: number;
  /** Margem para perdas não previstas (%). */
  margemSeguranca_pct: number;

  /** Degradação anual (%) e horizonte para a série. */
  degradacaoAnual_pct: number;
  horizonteAnos: number;
}

export interface SolarLossesResult {
  input: SolarLossesInput;
  breakdown: LossItem[];
  /** Temperatura de célula usada no cálculo (°C). */
  tempCelula_C: number;
  deltaT_C: number;
  dcAcRatio: number | null;
  clippingAplicado_pct: number;
  energiaTeorica_kWh: number;
  energiaFinalAc_kWh: number;
  perdaTotal_kWh: number;
  perdaTotal_pct: number;
  /** Eficiência global do sistema (%) = final AC / teórica DC. */
  eficienciaSistema_pct: number;
  /** Série de degradação (ano 1..horizonte) em kWh/ano. */
  serieDegradacao: Array<{ ano: number; energia_kWh: number }>;
  avisos: string[];
}

const clampPct = (v: number) => Math.min(100, Math.max(0, Number.isFinite(v) ? v : 0));

/** Aplica um fator de perda percentual genérico sobre a energia corrente. */
export function applyPctLoss(energy_kWh: number, loss_pct: number): StepResult {
  const pct = clampPct(loss_pct);
  const loss = energy_kWh * (pct / 100);
  return { loss_kWh: loss, loss_pct: pct, energy_after_kWh: energy_kWh - loss };
}

/**
 * Temperatura de célula pelo modelo NOCT:
 *   T_cell = T_amb + (NOCT - 20) * (G / 800)
 */
export function cellTemperature(
  tempAmbiente_C: number,
  noct_C: number,
  irradiancia_Wm2: number,
): number {
  return tempAmbiente_C + ((noct_C - 20) * irradiancia_Wm2) / 800;
}

/**
 * Perda por temperatura: |coef| (%/°C) × ΔT, com ΔT = T_cell − 25 °C.
 * ΔT negativo (célula abaixo de STC) é tratado como ganho e limitado a 0.
 */
export function applyTemperatureLoss(
  energy_kWh: number,
  coeff_pct_perC: number,
  deltaT_C: number,
): StepResult {
  const pct = clampPct(Math.abs(coeff_pct_perC) * Math.max(0, deltaT_C));
  return applyPctLoss(energy_kWh, pct);
}

export function applySoilingLoss(energy_kWh: number, soiling_pct: number): StepResult {
  return applyPctLoss(energy_kWh, soiling_pct);
}

export function applyShadingLoss(energy_kWh: number, shading_pct: number): StepResult {
  return applyPctLoss(energy_kWh, shading_pct);
}

export function applyMismatchLoss(energy_kWh: number, mismatch_pct: number): StepResult {
  return applyPctLoss(energy_kWh, mismatch_pct);
}

/**
 * Perdas em cabos DC.
 * - modo "percentual": aplica diretamente o percentual informado.
 * - modo "resistivo": P = I²R (W); E_perdida = P × horas_equivalentes / 1000.
 */
export function applyCableLoss(
  energy_kWh: number,
  params:
    | { modo: "percentual"; pct: number }
    | { modo: "resistivo"; corrente_A: number; resistencia_ohm: number; horas_h: number },
): StepResult {
  if (params.modo === "percentual") return applyPctLoss(energy_kWh, params.pct);
  const perdaWh =
    params.corrente_A * params.corrente_A * params.resistencia_ohm * Math.max(0, params.horas_h);
  const loss = Math.min(energy_kWh, perdaWh / 1000);
  const pct = energy_kWh > 0 ? (loss / energy_kWh) * 100 : 0;
  return { loss_kWh: loss, loss_pct: pct, energy_after_kWh: energy_kWh - loss };
}

/** Clipping estimado a partir do DC/AC ratio (ver metodologia). */
export function estimateClippingPct(dcAcRatio: number | null): number {
  if (dcAcRatio === null || !Number.isFinite(dcAcRatio) || dcAcRatio <= 1.1) return 0;
  if (dcAcRatio <= 1.2) return 0.5;
  if (dcAcRatio <= 1.3) return 1.5;
  if (dcAcRatio <= 1.4) return 3;
  if (dcAcRatio <= 1.6) return 5;
  return 8;
}

/** Perda do inversor: (1 − η) e, em seguida, o clipping. */
export function applyInverterLoss(
  energy_kWh: number,
  inverter_eff_pct: number,
  clipping_pct: number,
): { inversor: StepResult; clipping: StepResult } {
  const eff = Math.min(100, Math.max(1, inverter_eff_pct));
  const inversor = applyPctLoss(energy_kWh, 100 - eff);
  const clipping = applyPctLoss(inversor.energy_after_kWh, clipping_pct);
  return { inversor, clipping };
}

export function applyACLoss(energy_kWh: number, ac_loss_pct: number): StepResult {
  return applyPctLoss(energy_kWh, ac_loss_pct);
}

/** Degradação linear composta: E_n = E_0 × (1 − d)^(n−1) para o ano n. */
export function applyDegradation(
  energy_kWh_year0: number,
  deg_pct: number,
  years: number,
): Array<{ ano: number; energia_kWh: number }> {
  const d = clampPct(deg_pct) / 100;
  const n = Math.max(1, Math.min(40, Math.floor(years)));
  const serie: Array<{ ano: number; energia_kWh: number }> = [];
  for (let ano = 1; ano <= n; ano++) {
    serie.push({ ano, energia_kWh: energy_kWh_year0 * Math.pow(1 - d, ano - 1) });
  }
  return serie;
}

export const DEFAULT_INPUT: SolarLossesInput = {
  energiaTeoricaDc_kWh: 14000,
  potenciaDc_kWp: 10,
  potenciaAc_kW: 8,
  coefTermico_pctPerC: -0.35,
  tempAmbiente_C: 28,
  noct_C: 45,
  irradianciaMedia_Wm2: 800,
  usarTempCelulaManual: false,
  tempCelulaManual_C: 50,
  sombreamento_pct: 2,
  soiling_pct: 2,
  mismatch_pct: 1.5,
  cabosModo: "percentual",
  cabosDc_pct: 1.5,
  correnteOperacao_A: 20,
  resistenciaTotal_ohm: 0.2,
  horasEquivalentes_h: 1400,
  eficienciaInversor_pct: 97,
  clippingModo: "auto",
  clipping_pct: 0,
  perdasAc_pct: 1,
  margemSeguranca_pct: 2,
  degradacaoAnual_pct: 0.5,
  horizonteAnos: 25,
};

/** Calcula o breakdown completo de perdas e a eficiência global do sistema. */
export function calcSystemLosses(params: SolarLossesInput): SolarLossesResult {
  const avisos: string[] = [];
  const base = Math.max(0, params.energiaTeoricaDc_kWh);

  if (base <= 0) {
    avisos.push("Informe uma energia teórica DC maior que zero para calcular as perdas.");
  }

  const tempCelula = params.usarTempCelulaManual
    ? params.tempCelulaManual_C
    : cellTemperature(params.tempAmbiente_C, params.noct_C, params.irradianciaMedia_Wm2);
  const deltaT = tempCelula - 25;

  const dcAcRatio =
    params.potenciaAc_kW > 0 && params.potenciaDc_kWp > 0
      ? params.potenciaDc_kWp / params.potenciaAc_kW
      : null;
  const clippingPct =
    params.clippingModo === "auto" ? estimateClippingPct(dcAcRatio) : clampPct(params.clipping_pct);

  const items: LossItem[] = [];
  let energia = base;

  const push = (
    id: string,
    name: string,
    step: StepResult,
    formula: string,
    factorPct: number,
  ) => {
    items.push({
      id,
      name,
      kWh: step.loss_kWh,
      pct: base > 0 ? (step.loss_kWh / base) * 100 : 0,
      factor: 1 - factorPct / 100,
      formula,
    });
    energia = step.energy_after_kWh;
  };

  const temp = applyTemperatureLoss(energia, params.coefTermico_pctPerC, deltaT);
  push(
    "temperatura",
    "Temperatura",
    temp,
    `|${params.coefTermico_pctPerC} %/°C| × ΔT ${deltaT.toFixed(1)} °C (T_cel ${tempCelula.toFixed(1)} °C)`,
    temp.loss_pct,
  );

  const shade = applyShadingLoss(energia, params.sombreamento_pct);
  push("sombreamento", "Sombreamento", shade, `E × ${params.sombreamento_pct}%`, shade.loss_pct);

  const soil = applySoilingLoss(energia, params.soiling_pct);
  push("soiling", "Sujidade (soiling)", soil, `E × ${params.soiling_pct}%`, soil.loss_pct);

  const mm = applyMismatchLoss(energia, params.mismatch_pct);
  push("mismatch", "Mismatch", mm, `E × ${params.mismatch_pct}%`, mm.loss_pct);

  const cable = applyCableLoss(
    energia,
    params.cabosModo === "percentual"
      ? { modo: "percentual", pct: params.cabosDc_pct }
      : {
          modo: "resistivo",
          corrente_A: params.correnteOperacao_A,
          resistencia_ohm: params.resistenciaTotal_ohm,
          horas_h: params.horasEquivalentes_h,
        },
  );
  push(
    "cabos_dc",
    "Cabeamento DC",
    cable,
    params.cabosModo === "percentual"
      ? `E × ${params.cabosDc_pct}%`
      : `P = I²R = ${params.correnteOperacao_A}² × ${params.resistenciaTotal_ohm} Ω × ${params.horasEquivalentes_h} h`,
    cable.loss_pct,
  );

  const inv = applyInverterLoss(energia, params.eficienciaInversor_pct, clippingPct);
  push(
    "inversor",
    "Inversor (η)",
    inv.inversor,
    `E × (1 − η) = E × ${(100 - params.eficienciaInversor_pct).toFixed(2)}%`,
    inv.inversor.loss_pct,
  );
  push(
    "clipping",
    "Clipping (MPPT/limitação AC)",
    inv.clipping,
    dcAcRatio
      ? `DC/AC = ${dcAcRatio.toFixed(2)} → ${clippingPct}%`
      : `E × ${clippingPct}%`,
    inv.clipping.loss_pct,
  );

  const ac = applyACLoss(energia, params.perdasAc_pct);
  push("ac_bos", "Perdas AC / BOS", ac, `E × ${params.perdasAc_pct}%`, ac.loss_pct);

  const margem = applyPctLoss(energia, params.margemSeguranca_pct);
  push(
    "margem",
    "Margem / perdas não previstas",
    margem,
    `E × ${params.margemSeguranca_pct}%`,
    margem.loss_pct,
  );

  const energiaFinal = energia;
  const perdaTotal = base - energiaFinal;
  const eficiencia = base > 0 ? (energiaFinal / base) * 100 : 0;

  if (dcAcRatio !== null && dcAcRatio > 1.4) {
    avisos.push(
      `Relação DC/AC de ${dcAcRatio.toFixed(2)} é alta — o clipping estimado (${clippingPct}%) pode ser significativo.`,
    );
  }
  if (eficiencia > 0 && eficiencia < 65) {
    avisos.push(
      "Eficiência global abaixo de 65%: revise as premissas de sombreamento, temperatura e cabeamento.",
    );
  }
  if (params.sombreamento_pct > 10) {
    avisos.push(
      "Sombreamento acima de 10%: perdas reais podem ser maiores que o estimado por efeito de string e diodos de bypass.",
    );
  }
  if (deltaT <= 0) {
    avisos.push("ΔT ≤ 0 °C: perda por temperatura considerada nula (sem bônus de baixa temperatura).");
  }

  return {
    input: params,
    breakdown: items,
    tempCelula_C: tempCelula,
    deltaT_C: deltaT,
    dcAcRatio,
    clippingAplicado_pct: clippingPct,
    energiaTeorica_kWh: base,
    energiaFinalAc_kWh: energiaFinal,
    perdaTotal_kWh: perdaTotal,
    perdaTotal_pct: base > 0 ? (perdaTotal / base) * 100 : 0,
    eficienciaSistema_pct: eficiencia,
    serieDegradacao: applyDegradation(energiaFinal, params.degradacaoAnual_pct, params.horizonteAnos),
    avisos,
  };
}

export default calcSystemLosses;
