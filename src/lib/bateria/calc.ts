// Motor de cálculo puro — Calculadora de Bateria / Armazenamento
// Todas as funções são determinísticas; nada de I/O.

export interface BateriaPreset {
  nome: string;
  quimica: "LFP" | "Li-ion NMC" | "Chumbo-ácido";
  capacidadeUnitariaKWh: number;
  dodPct: number;              // profundidade de descarga (%)
  eficienciaPct: number;       // round-trip (%)
  degradacaoPctAno: number;    // % por ano
  vidaCiclos: number;          // ciclos nominais
  custoUnitarioBRL: number;    // preço por unidade
}

export const BATERIAS_PRESET: BateriaPreset[] = [
  {
    nome: "LFP 5 kWh (Li-ion LFP)",
    quimica: "LFP",
    capacidadeUnitariaKWh: 5,
    dodPct: 80,
    eficienciaPct: 92,
    degradacaoPctAno: 0.7,
    vidaCiclos: 6000,
    custoUnitarioBRL: 12000,
  },
  {
    nome: "LFP 10 kWh (Li-ion LFP)",
    quimica: "LFP",
    capacidadeUnitariaKWh: 10,
    dodPct: 80,
    eficienciaPct: 92,
    degradacaoPctAno: 0.7,
    vidaCiclos: 6000,
    custoUnitarioBRL: 22000,
  },
  {
    nome: "NMC 5 kWh (Li-ion NMC)",
    quimica: "Li-ion NMC",
    capacidadeUnitariaKWh: 5,
    dodPct: 85,
    eficienciaPct: 90,
    degradacaoPctAno: 1.0,
    vidaCiclos: 4000,
    custoUnitarioBRL: 11000,
  },
  {
    nome: "Chumbo-ácido 2,4 kWh (VRLA)",
    quimica: "Chumbo-ácido",
    capacidadeUnitariaKWh: 2.4,
    dodPct: 50,
    eficienciaPct: 80,
    degradacaoPctAno: 3.0,
    vidaCiclos: 1200,
    custoUnitarioBRL: 2200,
  },
];

export interface BateriaInput {
  consumoDiarioKWh: number;
  autonomiaDias: number;
  fatorSeguranca: number;      // ex. 1.2
  ciclosPorAno: number;        // ex. 300
  horizonteAnos: number;       // ex. 10
  taxaDescontoPctAno: number;  // ex. 8
  bateria: BateriaPreset;
}

export const DEFAULT_INPUT: BateriaInput = {
  consumoDiarioKWh: 15,
  autonomiaDias: 1,
  fatorSeguranca: 1.2,
  ciclosPorAno: 300,
  horizonteAnos: 10,
  taxaDescontoPctAno: 8,
  bateria: BATERIAS_PRESET[0],
};

export interface AnoFluxo {
  ano: number;
  capacidadeRemanescenteKWh: number;
  substituicao: boolean;
  custoAno: number;
  custoAcumulado: number;
  custoAcumuladoVPL: number;
}

export interface BateriaResult {
  input: BateriaInput;
  energiaUtilKWh: number;
  capacidadeUtilKWh: number;
  capacidadeNominalKWh: number;
  numUnidades: number;
  capacidadeInstaladaKWh: number;
  custoInicialBRL: number;
  vidaAnosPorCiclos: number;
  autonomiaPraticaDias: number;
  fluxo: AnoFluxo[];
  custoTotalVPL: number;
  alerts: string[];
}

/**
 * Calcula o dimensionamento e fluxo de custos da bateria.
 * Fórmulas:
 *   energiaUtil = consumoDiario × autonomia × fatorSeguranca
 *   capacidadeUtil = energiaUtil / (eficiencia)
 *   capacidadeNominal = capacidadeUtil / DoD
 *   numUnidades = ceil(capacidadeNominal / unit)
 *   degradação: cap(n) = cap0 × (1 − d)^n
 *   vidaPorCiclos = ciclosNominais / ciclosPorAno
 */
export function calcBateria(input: BateriaInput): BateriaResult {
  const { bateria } = input;
  const eff = bateria.eficienciaPct / 100;
  const dod = bateria.dodPct / 100;
  const deg = bateria.degradacaoPctAno / 100;
  const r = input.taxaDescontoPctAno / 100;

  const energiaUtilKWh = input.consumoDiarioKWh * input.autonomiaDias * input.fatorSeguranca;
  const capacidadeUtilKWh = energiaUtilKWh / eff;
  const capacidadeNominalKWh = capacidadeUtilKWh / dod;
  const numUnidades = Math.max(1, Math.ceil(capacidadeNominalKWh / bateria.capacidadeUnitariaKWh));
  const capacidadeInstaladaKWh = numUnidades * bateria.capacidadeUnitariaKWh;
  const custoInicialBRL = numUnidades * bateria.custoUnitarioBRL;

  const vidaAnosPorCiclos = bateria.vidaCiclos / Math.max(1, input.ciclosPorAno);
  const autonomiaPraticaDias =
    (capacidadeInstaladaKWh * dod * eff) / Math.max(0.001, input.consumoDiarioKWh);

  const fluxo: AnoFluxo[] = [];
  let capAtual = capacidadeInstaladaKWh;
  let acumulado = custoInicialBRL;
  let acumuladoVPL = custoInicialBRL;
  let anosDesdeInstalacao = 0;

  for (let ano = 1; ano <= input.horizonteAnos; ano++) {
    anosDesdeInstalacao++;
    let custoAno = 0;
    let substituicao = false;
    // troca por ciclos ou por capacidade < 70% da inicial
    const capacidadeApos = capAtual * (1 - deg);
    const trocarPorCiclos = anosDesdeInstalacao >= vidaAnosPorCiclos;
    const trocarPorCapacidade = capacidadeApos / capacidadeInstaladaKWh < 0.7;
    if (trocarPorCiclos || trocarPorCapacidade) {
      substituicao = true;
      custoAno = custoInicialBRL;
      capAtual = capacidadeInstaladaKWh;
      anosDesdeInstalacao = 0;
    } else {
      capAtual = capacidadeApos;
    }
    acumulado += custoAno;
    acumuladoVPL += custoAno / Math.pow(1 + r, ano);
    fluxo.push({
      ano,
      capacidadeRemanescenteKWh: round(capAtual, 2),
      substituicao,
      custoAno: round(custoAno, 2),
      custoAcumulado: round(acumulado, 2),
      custoAcumuladoVPL: round(acumuladoVPL, 2),
    });
  }

  const alerts: string[] = [];
  if (bateria.dodPct < 60) alerts.push("DoD baixo aumenta o número de unidades necessárias.");
  if (numUnidades > 8) alerts.push("Número elevado de unidades — considere baterias de maior capacidade.");
  const custoPorKWh = custoInicialBRL / capacidadeInstaladaKWh;
  if (custoPorKWh > 3500) alerts.push("Custo por kWh acima da média de mercado (R$ 1.500–3.500).");
  if (vidaAnosPorCiclos < 5) alerts.push("Vida útil por ciclos < 5 anos: revise ciclos/ano.");

  return {
    input,
    energiaUtilKWh: round(energiaUtilKWh, 2),
    capacidadeUtilKWh: round(capacidadeUtilKWh, 2),
    capacidadeNominalKWh: round(capacidadeNominalKWh, 2),
    numUnidades,
    capacidadeInstaladaKWh: round(capacidadeInstaladaKWh, 2),
    custoInicialBRL: round(custoInicialBRL, 2),
    vidaAnosPorCiclos: round(vidaAnosPorCiclos, 1),
    autonomiaPraticaDias: round(autonomiaPraticaDias, 2),
    fluxo,
    custoTotalVPL: round(acumuladoVPL, 2),
    alerts,
  };
}

function round(v: number, d = 2) {
  const f = Math.pow(10, d);
  return Math.round(v * f) / f;
}

export default calcBateria;
