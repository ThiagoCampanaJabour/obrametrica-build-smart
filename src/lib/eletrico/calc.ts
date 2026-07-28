// Dimensionamento simplificado de instalações elétricas de baixa tensão.
// ESTIMATIVA — não substitui projeto por engenheiro eletricista (NBR 5410).

export type Phases = 1 | 2 | 3;

export type LoadType =
  | "iluminacao"
  | "tomadas_gerais"
  | "tomadas_motor"
  | "chuveiro"
  | "ar_condicionado"
  | "forno"
  | "microondas"
  | "maquina_lavar"
  | "bomba"
  | "outros";

export type CircuitInput = {
  id?: string;
  nome: string;
  tipo: LoadType;
  potenciaW?: number;
  correnteA?: number; // alternativa a potência
  tensaoV: number; // 127, 220, 380
  phases: Phases;
  fatorSimultaneidade?: number; // 0..1 (default por tipo)
  fatorPotencia?: number; // default 1
  comprimentoM: number; // metros (1 sentido)
  bitolaOverrideMm2?: number;
  disjuntorOverrideA?: number;
};

export type CircuitResult = {
  id: string;
  nome: string;
  tipo: LoadType;
  potenciaEfetivaW: number;
  correnteA: number;
  disjuntorSugeridoA: number;
  bitolaMinimaMm2: number;
  quedaTensaoPct: number;
  warnings: string[];
};

export type EletricoResumo = {
  potenciaInstaladaKW: number;
  demandaEstimadaKW: number;
  correntePrincipalA: number;
  quadroSugeridoA: number;
};

// Tabelas simplificadas (aproximadas — verificar NBR 5410 tab. 36-39).
// Ampacidade típica (A) para cobre em eletroduto, método B1, 2 condutores carregados.
export const AMPACITY_TABLE: Record<number, number> = {
  1.5: 15.5,
  2.5: 21,
  4: 28,
  6: 36,
  10: 50,
  16: 68,
  25: 89,
  35: 111,
  50: 134,
  70: 171,
  95: 207,
  120: 239,
};

// Resistividade cobre a 70°C aprox. (ohm·mm²/m) ≈ 0.0225 → ohm/km por bitola
export const OHM_PER_KM: Record<number, number> = {
  1.5: 15.0,
  2.5: 9.0,
  4: 5.6,
  6: 3.75,
  10: 2.25,
  16: 1.41,
  25: 0.9,
  35: 0.65,
  50: 0.48,
  70: 0.33,
  95: 0.24,
  120: 0.19,
};

export const STANDARD_BREAKERS = [
  6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200,
];

export const DEFAULT_SIMULTANEIDADE: Record<LoadType, number> = {
  iluminacao: 0.66,
  tomadas_gerais: 0.4,
  tomadas_motor: 0.5,
  chuveiro: 1.0,
  ar_condicionado: 1.0,
  forno: 0.7,
  microondas: 0.5,
  maquina_lavar: 0.5,
  bomba: 0.8,
  outros: 1.0,
};

export const QUEDA_LIMITE_PCT = 4;

export function powerToCurrent(
  potenciaW: number,
  tensaoV: number,
  phases: Phases,
  fatorPotencia = 1,
): number {
  if (!tensaoV || !potenciaW) return 0;
  const fp = fatorPotencia || 1;
  if (phases === 3) return potenciaW / (Math.sqrt(3) * tensaoV * fp);
  return potenciaW / (tensaoV * fp);
}

export function selectBreaker(correnteA: number, margem = 1.25): number {
  const target = correnteA * margem;
  for (const b of STANDARD_BREAKERS) {
    if (b >= target) return b;
  }
  return STANDARD_BREAKERS[STANDARD_BREAKERS.length - 1];
}

export function selectBitola(correnteA: number, breakerA: number): number {
  // A bitola precisa suportar >= corrente de projeto E >= disjuntor.
  const target = Math.max(correnteA, breakerA);
  const bitolas = Object.keys(AMPACITY_TABLE)
    .map(Number)
    .sort((a, b) => a - b);
  for (const b of bitolas) {
    if (AMPACITY_TABLE[b] >= target) return b;
  }
  return bitolas[bitolas.length - 1];
}

export function quedaTensaoPct(
  correnteA: number,
  bitolaMm2: number,
  comprimentoM: number,
  tensaoV: number,
  phases: Phases,
): number {
  const ohmKm = OHM_PER_KM[bitolaMm2];
  if (!ohmKm || !tensaoV) return 0;
  // ida e volta para monofásico; para trifásico usa sqrt(3)
  const R = (ohmKm * comprimentoM) / 1000; // ohm por condutor
  const dv = phases === 3 ? Math.sqrt(3) * correnteA * R : 2 * correnteA * R;
  return (dv / tensaoV) * 100;
}

export function calcCircuit(input: CircuitInput): CircuitResult {
  const warnings: string[] = [];
  const fp = input.fatorPotencia ?? 1;
  const fs =
    input.fatorSimultaneidade ?? DEFAULT_SIMULTANEIDADE[input.tipo] ?? 1;

  let potenciaNominal = input.potenciaW ?? 0;
  if (!potenciaNominal && input.correnteA) {
    // reconstroi a partir da corrente informada
    potenciaNominal =
      input.phases === 3
        ? input.correnteA * input.tensaoV * Math.sqrt(3) * fp
        : input.correnteA * input.tensaoV * fp;
  }
  const potenciaEfetiva = potenciaNominal * fs;
  const correnteCalc =
    input.correnteA && !input.potenciaW
      ? input.correnteA * fs
      : powerToCurrent(potenciaEfetiva, input.tensaoV, input.phases, fp);

  const disjuntor =
    input.disjuntorOverrideA ?? selectBreaker(correnteCalc);
  const bitola =
    input.bitolaOverrideMm2 ?? selectBitola(correnteCalc, disjuntor);
  const queda = quedaTensaoPct(
    correnteCalc,
    bitola,
    input.comprimentoM,
    input.tensaoV,
    input.phases,
  );

  if (queda > QUEDA_LIMITE_PCT) {
    warnings.push(
      `Queda de tensão ${queda.toFixed(2)}% acima do limite recomendado (${QUEDA_LIMITE_PCT}%). Aumente a bitola ou reduza o comprimento.`,
    );
  }
  if (
    input.bitolaOverrideMm2 &&
    AMPACITY_TABLE[input.bitolaOverrideMm2] &&
    AMPACITY_TABLE[input.bitolaOverrideMm2] < correnteCalc
  ) {
    warnings.push(
      `Bitola ${input.bitolaOverrideMm2} mm² é insuficiente para ${correnteCalc.toFixed(1)} A.`,
    );
  }
  if (input.tipo === "iluminacao" && bitola < 1.5) {
    warnings.push("Circuito de iluminação: mínimo 1,5 mm² (NBR 5410).");
  }
  if (input.tipo === "tomadas_gerais" && bitola < 2.5) {
    warnings.push("Circuito de tomadas: mínimo 2,5 mm² (NBR 5410).");
  }

  return {
    id: input.id ?? input.nome,
    nome: input.nome,
    tipo: input.tipo,
    potenciaEfetivaW: potenciaEfetiva,
    correnteA: correnteCalc,
    disjuntorSugeridoA: disjuntor,
    bitolaMinimaMm2: bitola,
    quedaTensaoPct: queda,
    warnings,
  };
}

export function calcInstalacao(circuits: CircuitInput[]): {
  circuitos: CircuitResult[];
  resumo: EletricoResumo;
} {
  const circuitos = circuits.map(calcCircuit);
  const potenciaInstaladaW = circuits.reduce(
    (acc, c) => acc + (c.potenciaW ?? 0),
    0,
  );
  const demandaW = circuitos.reduce((acc, c) => acc + c.potenciaEfetivaW, 0);
  // Assume alimentação principal na maior tensão informada
  const tensaoRef =
    Math.max(...circuits.map((c) => c.tensaoV || 0), 0) || 220;
  const trifasico = circuits.some((c) => c.phases === 3);
  const correntePrincipal = trifasico
    ? demandaW / (Math.sqrt(3) * tensaoRef)
    : demandaW / tensaoRef;
  const quadroSugerido = selectBreaker(correntePrincipal, 1.15);

  return {
    circuitos,
    resumo: {
      potenciaInstaladaKW: potenciaInstaladaW / 1000,
      demandaEstimadaKW: demandaW / 1000,
      correntePrincipalA: correntePrincipal,
      quadroSugeridoA: quadroSugerido,
    },
  };
}

export function toCSVCircuitos(circuitos: CircuitResult[]): string {
  const header = [
    "id",
    "nome",
    "tipo",
    "potencia_efetiva_W",
    "corrente_A",
    "disjuntor_A",
    "bitola_mm2",
    "queda_tensao_pct",
    "warnings",
  ].join(",");
  const rows = circuitos.map((c) =>
    [
      c.id,
      JSON.stringify(c.nome),
      c.tipo,
      c.potenciaEfetivaW.toFixed(1),
      c.correnteA.toFixed(2),
      c.disjuntorSugeridoA,
      c.bitolaMinimaMm2,
      c.quedaTensaoPct.toFixed(2),
      JSON.stringify(c.warnings.join(" | ")),
    ].join(","),
  );
  return [header, ...rows].join("\n");
}

export const CARGA_PRESETS: Record<
  string,
  Omit<CircuitInput, "id"> & { descricao: string }
> = {
  chuveiro_4500: {
    descricao: "Chuveiro elétrico 4500 W",
    nome: "Chuveiro",
    tipo: "chuveiro",
    potenciaW: 4500,
    tensaoV: 220,
    phases: 1,
    comprimentoM: 15,
  },
  chuveiro_5500: {
    descricao: "Chuveiro elétrico 5500 W",
    nome: "Chuveiro",
    tipo: "chuveiro",
    potenciaW: 5500,
    tensaoV: 220,
    phases: 1,
    comprimentoM: 15,
  },
  ar_9k: {
    descricao: "Ar-condicionado 9.000 BTU",
    nome: "AC 9k",
    tipo: "ar_condicionado",
    potenciaW: 1000,
    tensaoV: 220,
    phases: 1,
    comprimentoM: 12,
  },
  ar_12k: {
    descricao: "Ar-condicionado 12.000 BTU",
    nome: "AC 12k",
    tipo: "ar_condicionado",
    potenciaW: 1400,
    tensaoV: 220,
    phases: 1,
    comprimentoM: 12,
  },
  ilum_sala: {
    descricao: "Iluminação sala (LED, ~200 W)",
    nome: "Iluminação",
    tipo: "iluminacao",
    potenciaW: 200,
    tensaoV: 127,
    phases: 1,
    comprimentoM: 10,
  },
  tomadas_cozinha: {
    descricao: "Tomadas cozinha (6 pontos)",
    nome: "Tomadas cozinha",
    tipo: "tomadas_gerais",
    potenciaW: 3600,
    tensaoV: 127,
    phases: 1,
    comprimentoM: 12,
  },
  forno: {
    descricao: "Forno elétrico 2500 W",
    nome: "Forno",
    tipo: "forno",
    potenciaW: 2500,
    tensaoV: 220,
    phases: 1,
    comprimentoM: 10,
  },
  microondas: {
    descricao: "Microondas 1500 W",
    nome: "Microondas",
    tipo: "microondas",
    potenciaW: 1500,
    tensaoV: 127,
    phases: 1,
    comprimentoM: 10,
  },
  maquina_lavar: {
    descricao: "Máquina de lavar 1500 W",
    nome: "Máquina lavar",
    tipo: "maquina_lavar",
    potenciaW: 1500,
    tensaoV: 127,
    phases: 1,
    comprimentoM: 12,
  },
  bomba_1cv: {
    descricao: "Bomba d'água 1 CV",
    nome: "Bomba 1 CV",
    tipo: "bomba",
    potenciaW: 900,
    tensaoV: 220,
    phases: 1,
    comprimentoM: 20,
  },
};
