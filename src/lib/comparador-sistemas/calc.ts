/**
 * Comparador On-Grid / Off-Grid / Híbrido — Energia Solar
 * Funções puras. Sem dependências externas.
 */
import { calcVPL, calcTIR } from "@/lib/payback/calc";

export type SystemType = "on-grid" | "off-grid" | "hibrido";

export interface CompareInput {
  /** kWp instalados */
  potenciaKWp: number;
  /** kWh/ano estimado */
  producaoAnualKWh: number;
  /** R$/kWh tarifa da concessionária */
  tarifaKWh: number;
  /** % (0–100) da geração consumida no local */
  usoLocalPct: number;
  /** kWh/mês consumo médio da unidade */
  consumoMensalKWh: number;
  /** Custo por kWp instalado (paineis + inversor + instalação) — R$ */
  custoPorKWp: number;
  /** Horas de autonomia desejadas (off-grid/híbrido) */
  autonomiaHoras: number;
  /** R$/kWh de banco de baterias */
  custoBateriaKWh: number;
  /** Vida útil considerada (anos) */
  vidaUtilAnos: number;
  /** Taxa de desconto % a.a. */
  taxaDesconto: number;
  /** O&M anual como % do investimento */
  omPct: number;
  /** Degradação módulos %/ano */
  degradacaoPct: number;
  /** Eficiência inversor (%) */
  eficienciaInversorPct: number;
  /** Perdas do sistema (%) */
  perdasSistemaPct: number;
  /** Profundidade de descarga da bateria (%) */
  dodPct: number;
  /** Vida útil bateria (anos) — usada para reposição */
  vidaBateriaAnos: number;
}

export interface SystemResult {
  tipo: SystemType;
  nome: string;
  investimentoInicial: number;
  bancoBateriasKWh: number;
  custoBaterias: number;
  reposicoesBateria: number;
  economiaAnual: number;
  coberturaPct: number;
  autonomiaHoras: number;
  perdasTotaisPct: number;
  paybackSimples: number | null;
  paybackDescontado: number | null;
  vpl: number;
  tir: number | null;
  custoTotal25: number;
  complexidade: "Baixa" | "Média" | "Alta";
  observacoes: string;
  fluxo: { ano: number; liquido: number; acumulado: number }[];
}

export interface CompareOutput {
  sistemas: SystemResult[];
  recomendacao: string;
}

const NOMES: Record<SystemType, string> = {
  "on-grid": "On-Grid",
  "off-grid": "Off-Grid",
  hibrido: "Híbrido",
};

const COMPLEXIDADE: Record<SystemType, "Baixa" | "Média" | "Alta"> = {
  "on-grid": "Baixa",
  "off-grid": "Alta",
  hibrido: "Média",
};

function bancoBateriaKWh(input: CompareInput, tipo: SystemType): number {
  if (tipo === "on-grid") return 0;
  const consumoMedioHora = input.consumoMensalKWh / 30 / 24;
  const fatorSeguranca = 1.2;
  const dod = Math.max(input.dodPct, 10) / 100;
  const horas = tipo === "off-grid" ? input.autonomiaHoras : input.autonomiaHoras * 0.6;
  return +(consumoMedioHora * horas * fatorSeguranca / dod).toFixed(2);
}

function simulateSystem(input: CompareInput, tipo: SystemType): SystemResult {
  const perdas =
    (input.perdasSistemaPct + (100 - input.eficienciaInversorPct)) / 100;
  const perdasTotaisPct = +(perdas * 100).toFixed(1);
  const producaoLiquidaBase = input.producaoAnualKWh * (1 - perdas);

  const custoPaineis = input.potenciaKWp * input.custoPorKWp;
  const banco = bancoBateriaKWh(input, tipo);
  const custoBaterias = banco * input.custoBateriaKWh;
  const investimentoInicial = +(custoPaineis + custoBaterias).toFixed(2);

  const uso = input.usoLocalPct / 100;
  const consumoAnual = input.consumoMensalKWh * 12;
  const cobertura = Math.min(100, (producaoLiquidaBase / consumoAnual) * 100);

  const om0 = investimentoInicial * (input.omPct / 100);
  const r = input.taxaDesconto / 100;
  const fluxosVpl: number[] = [-investimentoInicial];
  const fluxo: SystemResult["fluxo"] = [];
  let acumulado = -investimentoInicial;
  let paybackSimples: number | null = null;
  let paybackDescontado: number | null = null;
  let vplAcum = -investimentoInicial;
  let reposicoesBateria = 0;

  for (let n = 1; n <= input.vidaUtilAnos; n++) {
    const producao =
      producaoLiquidaBase * Math.pow(1 - input.degradacaoPct / 100, n - 1);
    const receita = producao * input.tarifaKWh * uso;
    let om = om0;
    // reposição de banco de baterias
    if (banco > 0 && n > 1 && n % input.vidaBateriaAnos === 1) {
      om += custoBaterias;
      reposicoesBateria += 1;
    }
    const liq = receita - om;
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
    fluxo.push({ ano: n, liquido: +liq.toFixed(2), acumulado: +acumulado.toFixed(2) });
  }

  const economiaAnual = +(producaoLiquidaBase * input.tarifaKWh * uso).toFixed(2);
  const custoTotal25 = +(
    investimentoInicial +
    om0 * input.vidaUtilAnos +
    reposicoesBateria * custoBaterias
  ).toFixed(2);

  const observacoes =
    tipo === "on-grid"
      ? "Sem baterias; depende da rede. Menor CAPEX e menor complexidade."
      : tipo === "off-grid"
      ? "Autonomia total; banco de baterias grande e reposição periódica."
      : "Combina economia da rede com backup por baterias; ideal para áreas com quedas frequentes.";

  return {
    tipo,
    nome: NOMES[tipo],
    investimentoInicial,
    bancoBateriasKWh: banco,
    custoBaterias: +custoBaterias.toFixed(2),
    reposicoesBateria,
    economiaAnual,
    coberturaPct: +cobertura.toFixed(1),
    autonomiaHoras: tipo === "on-grid" ? 0 : input.autonomiaHoras,
    perdasTotaisPct,
    paybackSimples,
    paybackDescontado,
    vpl: +calcVPL(fluxosVpl, input.taxaDesconto).toFixed(2),
    tir: calcTIR(fluxosVpl),
    custoTotal25,
    complexidade: COMPLEXIDADE[tipo],
    observacoes,
    fluxo,
  };
}

export function compareSystems(input: CompareInput): CompareOutput {
  const sistemas: SystemResult[] = [
    simulateSystem(input, "on-grid"),
    simulateSystem(input, "off-grid"),
    simulateSystem(input, "hibrido"),
  ];

  // Recomendação simples baseada em autonomia + payback
  const onGrid = sistemas[0];
  const offGrid = sistemas[1];
  const hibrido = sistemas[2];
  let recomendacao =
    "Se o objetivo é o menor payback e você tem rede confiável, o sistema On-Grid é o mais indicado.";
  if (input.autonomiaHoras >= 24) {
    recomendacao =
      "Para autonomia superior a 24h, o Off-Grid ou Híbrido são recomendados. O Híbrido tende a oferecer melhor equilíbrio entre custo e independência.";
  } else if (input.autonomiaHoras > 0) {
    recomendacao = `O sistema Híbrido oferece backup por ~${input.autonomiaHoras}h e mantém o menor custo total (~R$ ${hibrido.custoTotal25.toLocaleString("pt-BR")}) frente ao Off-Grid (~R$ ${offGrid.custoTotal25.toLocaleString("pt-BR")}).`;
  } else {
    recomendacao = `On-Grid tem o menor investimento inicial (R$ ${onGrid.investimentoInicial.toLocaleString("pt-BR")}) e payback estimado de ${onGrid.paybackSimples ?? "—"} anos.`;
  }

  return { sistemas, recomendacao };
}

export const PRESETS: Record<string, Partial<CompareInput> & { nome: string }> = {
  residencial: {
    nome: "Residencial pequeno",
    potenciaKWp: 4,
    producaoAnualKWh: 5800,
    consumoMensalKWh: 400,
    custoPorKWp: 5500,
    autonomiaHoras: 8,
  },
  comercial: {
    nome: "Comercial médio",
    potenciaKWp: 20,
    producaoAnualKWh: 29000,
    consumoMensalKWh: 2000,
    custoPorKWp: 4500,
    autonomiaHoras: 12,
  },
  rural: {
    nome: "Rural isolado",
    potenciaKWp: 6,
    producaoAnualKWh: 8700,
    consumoMensalKWh: 500,
    custoPorKWp: 6000,
    autonomiaHoras: 48,
  },
};

export const DEFAULT_INPUT: CompareInput = {
  potenciaKWp: 5,
  producaoAnualKWh: 7200,
  tarifaKWh: 0.95,
  usoLocalPct: 100,
  consumoMensalKWh: 500,
  custoPorKWp: 5000,
  autonomiaHoras: 12,
  custoBateriaKWh: 1800,
  vidaUtilAnos: 25,
  taxaDesconto: 8,
  omPct: 1.5,
  degradacaoPct: 0.7,
  eficienciaInversorPct: 95,
  perdasSistemaPct: 10,
  dodPct: 80,
  vidaBateriaAnos: 10,
};
