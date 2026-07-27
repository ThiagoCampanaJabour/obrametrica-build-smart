/**
 * Payback / Fluxo de Caixa — Energia Solar
 * Funções puras para VPL, TIR, payback simples e descontado.
 * Sem dependências externas.
 */

export type CenarioId = "conservador" | "padrao" | "otimista";

export interface CenarioPreset {
  id: CenarioId;
  nome: string;
  fatorProducao: number; // multiplica produção base
  inflacaoTarifaPct: number; // %/ano
  omMultiplicador: number; // multiplica O&M base
  degradacaoPct: number; // %/ano
}

export const CENARIOS: Record<CenarioId, CenarioPreset> = {
  conservador: {
    id: "conservador",
    nome: "Conservador",
    fatorProducao: 0.92,
    inflacaoTarifaPct: 1,
    omMultiplicador: 1.1,
    degradacaoPct: 1.0,
  },
  padrao: {
    id: "padrao",
    nome: "Padrão",
    fatorProducao: 1.0,
    inflacaoTarifaPct: 2,
    omMultiplicador: 1.0,
    degradacaoPct: 0.7,
  },
  otimista: {
    id: "otimista",
    nome: "Otimista",
    fatorProducao: 1.05,
    inflacaoTarifaPct: 3,
    omMultiplicador: 0.9,
    degradacaoPct: 0.5,
  },
};

export interface PaybackInput {
  custoSistema: number;
  producaoAnualKWh: number;
  tarifaKWh: number;
  usoLocalPct: number; // 0–100
  omAnual: number;
  taxaDesconto: number; // % a.a.
  vidaUtilAnos: number;
  incentivoInicial?: number;
  incentivoAnual?: number;
  cenario: CenarioPreset;
}

export interface AnoFluxo {
  ano: number;
  producaoKWh: number;
  tarifa: number;
  receita: number;
  om: number;
  incentivo: number;
  fluxoLiquido: number;
  fluxoAcumulado: number;
  vplAcumulado: number;
}

export interface PaybackResult {
  fluxo: AnoFluxo[];
  paybackSimples: number | null;
  paybackDescontado: number | null;
  vpl: number;
  tir: number | null;
  investimento: number;
  economiaTotal: number;
}

/** VPL de uma série de fluxos (fluxos[0] = ano 0 = -investimento). */
export function calcVPL(fluxos: number[], taxaPct: number): number {
  const r = taxaPct / 100;
  return fluxos.reduce((acc, f, i) => acc + f / Math.pow(1 + r, i), 0);
}

/** TIR por bissecção; retorna null se não converge. */
export function calcTIR(fluxos: number[]): number | null {
  if (fluxos.length < 2) return null;
  const soma = fluxos.reduce((a, b) => a + b, 0);
  if (soma <= 0) return null;
  let lo = -0.99;
  let hi = 10;
  const f = (r: number) =>
    fluxos.reduce((acc, v, i) => acc + v / Math.pow(1 + r, i), 0);
  let flo = f(lo);
  let fhi = f(hi);
  if (flo * fhi > 0) return null;
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    const fmid = f(mid);
    if (Math.abs(fmid) < 1e-6) return +(mid * 100).toFixed(4);
    if (flo * fmid < 0) {
      hi = mid;
      fhi = fmid;
    } else {
      lo = mid;
      flo = fmid;
    }
  }
  return +(((lo + hi) / 2) * 100).toFixed(4);
}

export function simulatePayback(input: PaybackInput): PaybackResult {
  const {
    custoSistema,
    producaoAnualKWh,
    tarifaKWh,
    usoLocalPct,
    omAnual,
    taxaDesconto,
    vidaUtilAnos,
    incentivoInicial = 0,
    incentivoAnual = 0,
    cenario,
  } = input;

  const investimento = custoSistema - incentivoInicial;
  const uso = usoLocalPct / 100;
  const r = taxaDesconto / 100;
  const producaoBase = producaoAnualKWh * cenario.fatorProducao;
  const om0 = omAnual * cenario.omMultiplicador;

  const fluxo: AnoFluxo[] = [];
  const fluxosVpl: number[] = [-investimento];
  let acumulado = -investimento;
  let vplAcum = -investimento;
  let paybackSimples: number | null = null;
  let paybackDescontado: number | null = null;

  for (let n = 1; n <= vidaUtilAnos; n++) {
    const producao = producaoBase * Math.pow(1 - cenario.degradacaoPct / 100, n - 1);
    const tarifa = tarifaKWh * Math.pow(1 + cenario.inflacaoTarifaPct / 100, n - 1);
    const receita = producao * tarifa * uso;
    const om = om0 * Math.pow(1 + cenario.inflacaoTarifaPct / 100, n - 1);
    const liq = receita - om + incentivoAnual;
    acumulado += liq;
    const vplAno = liq / Math.pow(1 + r, n);
    vplAcum += vplAno;
    fluxosVpl.push(liq);

    if (paybackSimples === null && acumulado >= 0) {
      const prev = acumulado - liq;
      paybackSimples = +(n - 1 + Math.abs(prev) / liq).toFixed(2);
    }
    if (paybackDescontado === null && vplAcum >= 0) {
      const prev = vplAcum - vplAno;
      paybackDescontado = +(n - 1 + Math.abs(prev) / vplAno).toFixed(2);
    }

    fluxo.push({
      ano: n,
      producaoKWh: +producao.toFixed(0),
      tarifa: +tarifa.toFixed(4),
      receita: +receita.toFixed(2),
      om: +om.toFixed(2),
      incentivo: incentivoAnual,
      fluxoLiquido: +liq.toFixed(2),
      fluxoAcumulado: +acumulado.toFixed(2),
      vplAcumulado: +vplAcum.toFixed(2),
    });
  }

  return {
    fluxo,
    paybackSimples,
    paybackDescontado,
    vpl: +vplAcum.toFixed(2),
    tir: calcTIR(fluxosVpl),
    investimento: +investimento.toFixed(2),
    economiaTotal: +fluxo.reduce((a, f) => a + f.fluxoLiquido, 0).toFixed(2),
  };
}
