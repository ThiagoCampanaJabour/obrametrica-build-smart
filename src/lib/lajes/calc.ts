// Cálculos de pré-dimensionamento de lajes (maciça unidirecional e nervurada).
// ESTIMATIVA preliminar — não substitui projeto estrutural (NBR 6118).

export type LajeTipo = "macica" | "nervurada";
export type LajeApoio = "simples" | "continua";

export type LajePainelInput = {
  id?: string;
  tipo: LajeTipo;
  L: number; // vão principal (m)
  W: number; // largura do painel (m)
  espessuraM?: number; // laje maciça (m) — se ausente, estimada como max(0.12, L/20)
  // Nervurada
  pitchNervuraM?: number; // distância entre eixos das nervuras
  larguraNervuraM?: number; // b_w
  alturaNervuraM?: number; // h_n
  espessuraMesaM?: number; // t_m
  // Cargas (kN/m²)
  gk?: number; // sobrecarga permanente adicional (revestimentos, etc.)
  qk?: number; // carga acidental
  apoio?: LajeApoio;
  // Materiais
  fckMPa?: number;
  fyMPa?: number;
  coberturaMm?: number;
  // Heurísticas
  kgAcoPorM3?: number;
  mVergalhaoPorM2?: number;
};

export type LajePainelResult = {
  id: string;
  tipo: LajeTipo;
  L: number;
  W: number;
  areaM2: number;
  espessuraEquivalenteM: number; // média ponderada para nervurada
  volumeConcretoM3: number;
  pesoProprioKNm2: number;
  cargaTotalKNm2: number; // gk_pp + gk + qk
  acoKg: number;
  vergalhoesM: number;
  formaM2: number;
  // Detalhamento (modo Engenharia)
  momentoKNm?: number; // Mu aproximado por metro de largura (kN·m/m)
  asCm2PorM?: number; // As necessária por metro
  warnings: string[];
};

export type LajesResumo = {
  totalArea: number;
  totalVolume: number;
  totalAco: number;
  totalVergalhoes: number;
  totalForma: number;
  totalCusto?: number;
};

export const DEFAULTS = {
  densidadeConcretoKNm3: 24,
  kgAcoPorM3Macica: 100, // 80–120
  kgAcoPorM3Nervurada: 70, // 50–90 aplicado ao volume total
  mVergalhaoPorM2: 10, // heurística
  gk: 1.5, // revestimentos padrão (kN/m²)
  qk: 2.0, // residencial (kN/m²)
  fckMPa: 25,
  fyMPa: 500,
  coberturaMm: 25,
  precoConcretoM3: 450,
  precoAcoKg: 12,
  precoFormaM2: 55,
};

// Coeficientes de momento para lajes unidirecionais (M = alpha * q * L²)
export const COEF_MOMENTO: Record<LajeApoio, number> = {
  simples: 1 / 8, // apoio simples
  continua: 1 / 10, // continuidade aproximada
};

function round(n: number, d = 2) {
  const f = 10 ** d;
  return Math.round(n * f) / f;
}

function espessuraSugerida(L: number): number {
  return Math.max(0.12, L / 20);
}

/** Volume de concreto para painel nervurado (mesa + nervuras em duas direções ou única). */
function volumeNervurado(
  L: number,
  W: number,
  pitch: number,
  bw: number,
  hn: number,
  tm: number,
): number {
  const areaM2 = L * W;
  const volumeMesa = areaM2 * tm;
  // nervuras principais na direção L, espaçadas por pitch, comprimento W cada
  const nNervuras = Math.max(0, Math.floor(W / pitch));
  const volumeNervuras = nNervuras * bw * hn * L;
  return volumeMesa + volumeNervuras;
}

export function calcLajePainel(input: LajePainelInput): LajePainelResult {
  const warnings: string[] = [];
  const id = input.id ?? "P1";
  const kgAcoM3Def =
    input.tipo === "nervurada" ? DEFAULTS.kgAcoPorM3Nervurada : DEFAULTS.kgAcoPorM3Macica;
  const kgAcoPorM3 = input.kgAcoPorM3 ?? kgAcoM3Def;
  const mVergalhaoPorM2 = input.mVergalhaoPorM2 ?? DEFAULTS.mVergalhaoPorM2;
  const gk = input.gk ?? DEFAULTS.gk;
  const qk = input.qk ?? DEFAULTS.qk;
  const apoio: LajeApoio = input.apoio ?? "simples";
  const fyMPa = input.fyMPa ?? DEFAULTS.fyMPa;
  const coberturaMm = input.coberturaMm ?? DEFAULTS.coberturaMm;

  const L = input.L;
  const W = input.W;
  const areaM2 = Math.max(0, L * W);

  if (areaM2 <= 0) warnings.push("Área do painel inválida — verifique L e W.");
  if (L > 8) warnings.push("Vão maior que 8 m — cálculo simplificado pouco confiável.");

  let volumeConcretoM3 = 0;
  let espessuraEquivM = 0;

  if (input.tipo === "macica") {
    const t = input.espessuraM ?? espessuraSugerida(L);
    if (t < 0.08) warnings.push("Espessura abaixo de 8 cm — inadequada para laje maciça.");
    if (t < L / 25)
      warnings.push(
        `Espessura ${(t * 100).toFixed(1)} cm menor que L/25 — verificar deformações.`,
      );
    espessuraEquivM = t;
    volumeConcretoM3 = areaM2 * t;
  } else {
    const pitch = input.pitchNervuraM ?? 0.6;
    const bw = input.larguraNervuraM ?? 0.1;
    const hn = input.alturaNervuraM ?? 0.2;
    const tm = input.espessuraMesaM ?? 0.05;
    if (tm < 0.04) warnings.push("Mesa muito fina (<4 cm) — reveja a seção da nervura.");
    if (pitch <= bw) warnings.push("Passo entre nervuras deve ser maior que a largura da alma.");
    volumeConcretoM3 = volumeNervurado(L, W, pitch, bw, hn, tm);
    espessuraEquivM = areaM2 > 0 ? volumeConcretoM3 / areaM2 : 0;
  }

  const pesoProprioKNm2 = espessuraEquivM * DEFAULTS.densidadeConcretoKNm3;
  const cargaTotalKNm2 = pesoProprioKNm2 + gk + qk;

  const acoKg = volumeConcretoM3 * kgAcoPorM3;
  const vergalhoesM = areaM2 * mVergalhaoPorM2;

  // Formas: fundo (área) + laterais aproximadas
  const perimetro = 2 * (L + W);
  const formaM2 =
    input.tipo === "macica"
      ? areaM2 + perimetro * (input.espessuraM ?? espessuraSugerida(L))
      : areaM2 + perimetro * espessuraEquivM;

  // Modo detalhado (aproximação): momento por metro de largura
  const alpha = COEF_MOMENTO[apoio];
  const momentoKNm = alpha * cargaTotalKNm2 * L * L; // kN·m por metro de largura
  // As ≈ Mu / (0.9 * d * fyd) ; simplificação. d ≈ t - cobrimento - 0.5*diam
  const dM =
    input.tipo === "macica"
      ? Math.max(0.05, (input.espessuraM ?? espessuraSugerida(L)) - coberturaMm / 1000 - 0.005)
      : Math.max(
          0.05,
          (input.alturaNervuraM ?? 0.2) + (input.espessuraMesaM ?? 0.05) - coberturaMm / 1000 - 0.005,
        );
  const fyd = (fyMPa * 1000) / 1.15; // kN/m² (kPa)
  // Mu em kN·m/m, dividir por (0.9 * d * fyd) → As em m²/m
  const asM2PorM = momentoKNm / (0.9 * dM * fyd);
  const asCm2PorM = asM2PorM * 1e4; // m²→cm²

  if (asCm2PorM > 20)
    warnings.push(
      `As calculada (${asCm2PorM.toFixed(2)} cm²/m) elevada — aumentar espessura ou revisar seção.`,
    );

  return {
    id,
    tipo: input.tipo,
    L,
    W,
    areaM2: round(areaM2, 2),
    espessuraEquivalenteM: round(espessuraEquivM, 3),
    volumeConcretoM3: round(volumeConcretoM3, 3),
    pesoProprioKNm2: round(pesoProprioKNm2, 2),
    cargaTotalKNm2: round(cargaTotalKNm2, 2),
    acoKg: round(acoKg, 1),
    vergalhoesM: round(vergalhoesM, 1),
    formaM2: round(formaM2, 2),
    momentoKNm: round(momentoKNm, 2),
    asCm2PorM: round(asCm2PorM, 2),
    warnings,
  };
}

export function calcLajes(paineis: LajePainelInput[]): {
  paineis: LajePainelResult[];
  resumo: LajesResumo;
} {
  const results = paineis.map((p, i) =>
    calcLajePainel({ ...p, id: p.id ?? `P${i + 1}` }),
  );
  const resumo: LajesResumo = {
    totalArea: round(results.reduce((s, r) => s + r.areaM2, 0), 2),
    totalVolume: round(results.reduce((s, r) => s + r.volumeConcretoM3, 0), 3),
    totalAco: round(results.reduce((s, r) => s + r.acoKg, 0), 1),
    totalVergalhoes: round(results.reduce((s, r) => s + r.vergalhoesM, 0), 1),
    totalForma: round(results.reduce((s, r) => s + r.formaM2, 0), 2),
  };
  return { paineis: results, resumo };
}

export function calcCustoLajes(
  resumo: LajesResumo,
  precos: { precoConcretoM3: number; precoAcoKg: number; precoFormaM2: number },
) {
  const cConc = resumo.totalVolume * precos.precoConcretoM3;
  const cAco = resumo.totalAco * precos.precoAcoKg;
  const cForma = resumo.totalForma * precos.precoFormaM2;
  return {
    custoConcreto: round(cConc, 2),
    custoAco: round(cAco, 2),
    custoForma: round(cForma, 2),
    custoTotal: round(cConc + cAco + cForma, 2),
  };
}

export function toCSVLajes(paineis: LajePainelResult[]): string {
  const header =
    "painel_id,tipo,L_m,W_m,area_m2,espessura_eq_m,volume_m3,aco_kg,vergalhoes_m,forma_m2,momento_kNm_por_m,As_cm2_por_m";
  const rows = paineis.map((r) =>
    [
      r.id,
      r.tipo,
      r.L,
      r.W,
      r.areaM2,
      r.espessuraEquivalenteM,
      r.volumeConcretoM3,
      r.acoKg,
      r.vergalhoesM,
      r.formaM2,
      r.momentoKNm ?? "",
      r.asCm2PorM ?? "",
    ].join(","),
  );
  return [header, ...rows].join("\n");
}

export function formatMoney(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
