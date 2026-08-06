/**
 * Motor de cálculo — Estruturas Metálicas Básicas (MVP estimativo).
 *
 * IMPORTANTE: todas as funções aqui são heurísticas de pré-dimensionamento.
 * Não substituem verificação de estados limites últimos e de serviço,
 * flambagem lateral com torção, ligações, soldas ou combinações de ações.
 * Unidades internas: kN, m, kN·m para esforços; cm²/cm³/cm⁴ para seções.
 */

export type TipoElemento =
  | "viga-simples"
  | "viga-continua-2vaos"
  | "portico-simples"
  | "laje-metalica"
  | "pilar";

export type Apoio = "biapoiado" | "engastado";

export type FamiliaPerfil = "IPE" | "HEA" | "HEB" | "TUBO";

export type MaterialId = "S235" | "S275" | "S355";

export interface Perfil {
  /** Identificador único (ex.: "IPE-300"). */
  id: string;
  nome: string;
  familia: FamiliaPerfil;
  /** Altura da seção (mm). */
  hMm: number;
  /** Largura da mesa / lado (mm). */
  bMm: number;
  /** Espessura da alma (mm). */
  twMm: number;
  /** Espessura da mesa (mm). */
  tfMm: number;
  /** Área da seção (cm²). */
  areaCm2: number;
  /** Módulo resistente elástico em torno de x (cm³). */
  welCm3: number;
  /** Módulo resistente plástico em torno de x (cm³). */
  wplCm3: number;
  /** Momento de inércia em torno de x (cm⁴). */
  ixCm4: number;
  /** Massa linear (kg/m). */
  massaKgM: number;
}

export interface Material {
  id: MaterialId;
  nome: string;
  /** Tensão de escoamento característica (MPa). */
  fyMPa: number;
  /** Tensão admissível adotada para estimativa (MPa). */
  sigmaAdmMPa: number;
  /** Densidade (kg/m³). */
  densidadeKgM3: number;
}

export const MATERIAIS: Record<MaterialId, Material> = {
  S235: { id: "S235", nome: "Aço S235 (≈ ASTM A36)", fyMPa: 235, sigmaAdmMPa: 140, densidadeKgM3: 7850 },
  S275: { id: "S275", nome: "Aço S275", fyMPa: 275, sigmaAdmMPa: 160, densidadeKgM3: 7850 },
  S355: { id: "S355", nome: "Aço S355 (≈ ASTM A572 Gr.50)", fyMPa: 355, sigmaAdmMPa: 210, densidadeKgM3: 7850 },
};

/** Módulo de elasticidade do aço (GPa). */
export const E_GPA = 210;

export const TIPO_LABEL: Record<TipoElemento, string> = {
  "viga-simples": "Viga simplesmente apoiada",
  "viga-continua-2vaos": "Viga contínua (2 vãos)",
  "portico-simples": "Pórtico simples (2 pilares + viga)",
  "laje-metalica": "Laje metálica (vigas secundárias)",
  pilar: "Pilar metálico",
};

export const APOIO_LABEL: Record<Apoio, string> = {
  biapoiado: "Biapoiado",
  engastado: "Engastado (estimativa)",
};

export const FAMILIA_LABEL: Record<FamiliaPerfil | "auto", string> = {
  auto: "Sugerir automaticamente",
  IPE: "IPE (perfil I laminado)",
  HEA: "HEA (perfil H leve)",
  HEB: "HEB (perfil H robusto)",
  TUBO: "Tubo retangular / caixa",
};

/**
 * Tabela de perfis comerciais (valores nominais arredondados de catálogo).
 * Usada apenas para estimativa de ordens de grandeza.
 */
export const PERFIS: Perfil[] = [
  { id: "IPE-100", nome: "IPE 100", familia: "IPE", hMm: 100, bMm: 55, twMm: 4.1, tfMm: 5.7, areaCm2: 10.3, welCm3: 34.2, wplCm3: 39.4, ixCm4: 171, massaKgM: 8.1 },
  { id: "IPE-120", nome: "IPE 120", familia: "IPE", hMm: 120, bMm: 64, twMm: 4.4, tfMm: 6.3, areaCm2: 13.2, welCm3: 53.0, wplCm3: 60.7, ixCm4: 318, massaKgM: 10.4 },
  { id: "IPE-140", nome: "IPE 140", familia: "IPE", hMm: 140, bMm: 73, twMm: 4.7, tfMm: 6.9, areaCm2: 16.4, welCm3: 77.3, wplCm3: 88.3, ixCm4: 541, massaKgM: 12.9 },
  { id: "IPE-160", nome: "IPE 160", familia: "IPE", hMm: 160, bMm: 82, twMm: 5.0, tfMm: 7.4, areaCm2: 20.1, welCm3: 109, wplCm3: 124, ixCm4: 869, massaKgM: 15.8 },
  { id: "IPE-180", nome: "IPE 180", familia: "IPE", hMm: 180, bMm: 91, twMm: 5.3, tfMm: 8.0, areaCm2: 23.9, welCm3: 146, wplCm3: 166, ixCm4: 1317, massaKgM: 18.8 },
  { id: "IPE-200", nome: "IPE 200", familia: "IPE", hMm: 200, bMm: 100, twMm: 5.6, tfMm: 8.5, areaCm2: 28.5, welCm3: 194, wplCm3: 221, ixCm4: 1943, massaKgM: 22.4 },
  { id: "IPE-220", nome: "IPE 220", familia: "IPE", hMm: 220, bMm: 110, twMm: 5.9, tfMm: 9.2, areaCm2: 33.4, welCm3: 252, wplCm3: 285, ixCm4: 2772, massaKgM: 26.2 },
  { id: "IPE-240", nome: "IPE 240", familia: "IPE", hMm: 240, bMm: 120, twMm: 6.2, tfMm: 9.8, areaCm2: 39.1, welCm3: 324, wplCm3: 367, ixCm4: 3892, massaKgM: 30.7 },
  { id: "IPE-270", nome: "IPE 270", familia: "IPE", hMm: 270, bMm: 135, twMm: 6.6, tfMm: 10.2, areaCm2: 45.9, welCm3: 429, wplCm3: 484, ixCm4: 5790, massaKgM: 36.1 },
  { id: "IPE-300", nome: "IPE 300", familia: "IPE", hMm: 300, bMm: 150, twMm: 7.1, tfMm: 10.7, areaCm2: 53.8, welCm3: 557, wplCm3: 628, ixCm4: 8356, massaKgM: 42.2 },
  { id: "IPE-330", nome: "IPE 330", familia: "IPE", hMm: 330, bMm: 160, twMm: 7.5, tfMm: 11.5, areaCm2: 62.6, welCm3: 713, wplCm3: 804, ixCm4: 11770, massaKgM: 49.1 },
  { id: "IPE-360", nome: "IPE 360", familia: "IPE", hMm: 360, bMm: 170, twMm: 8.0, tfMm: 12.7, areaCm2: 72.7, welCm3: 904, wplCm3: 1019, ixCm4: 16270, massaKgM: 57.1 },
  { id: "IPE-400", nome: "IPE 400", familia: "IPE", hMm: 400, bMm: 180, twMm: 8.6, tfMm: 13.5, areaCm2: 84.5, welCm3: 1156, wplCm3: 1307, ixCm4: 23130, massaKgM: 66.3 },
  { id: "IPE-450", nome: "IPE 450", familia: "IPE", hMm: 450, bMm: 190, twMm: 9.4, tfMm: 14.6, areaCm2: 98.8, welCm3: 1500, wplCm3: 1702, ixCm4: 33740, massaKgM: 77.6 },
  { id: "IPE-500", nome: "IPE 500", familia: "IPE", hMm: 500, bMm: 200, twMm: 10.2, tfMm: 16.0, areaCm2: 116, welCm3: 1928, wplCm3: 2194, ixCm4: 48200, massaKgM: 90.7 },
  { id: "IPE-550", nome: "IPE 550", familia: "IPE", hMm: 550, bMm: 210, twMm: 11.1, tfMm: 17.2, areaCm2: 134, welCm3: 2441, wplCm3: 2787, ixCm4: 67120, massaKgM: 105.5 },
  { id: "IPE-600", nome: "IPE 600", familia: "IPE", hMm: 600, bMm: 220, twMm: 12.0, tfMm: 19.0, areaCm2: 156, welCm3: 3069, wplCm3: 3512, ixCm4: 92080, massaKgM: 122.4 },

  { id: "HEA-100", nome: "HEA 100", familia: "HEA", hMm: 96, bMm: 100, twMm: 5.0, tfMm: 8.0, areaCm2: 21.2, welCm3: 72.8, wplCm3: 83.0, ixCm4: 349, massaKgM: 16.7 },
  { id: "HEA-120", nome: "HEA 120", familia: "HEA", hMm: 114, bMm: 120, twMm: 5.0, tfMm: 8.0, areaCm2: 25.3, welCm3: 106, wplCm3: 119, ixCm4: 606, massaKgM: 19.9 },
  { id: "HEA-140", nome: "HEA 140", familia: "HEA", hMm: 133, bMm: 140, twMm: 5.5, tfMm: 8.5, areaCm2: 31.4, welCm3: 155, wplCm3: 173, ixCm4: 1033, massaKgM: 24.7 },
  { id: "HEA-160", nome: "HEA 160", familia: "HEA", hMm: 152, bMm: 160, twMm: 6.0, tfMm: 9.0, areaCm2: 38.8, welCm3: 220, wplCm3: 245, ixCm4: 1673, massaKgM: 30.4 },
  { id: "HEA-180", nome: "HEA 180", familia: "HEA", hMm: 171, bMm: 180, twMm: 6.0, tfMm: 9.5, areaCm2: 45.3, welCm3: 294, wplCm3: 325, ixCm4: 2510, massaKgM: 35.5 },
  { id: "HEA-200", nome: "HEA 200", familia: "HEA", hMm: 190, bMm: 200, twMm: 6.5, tfMm: 10.0, areaCm2: 53.8, welCm3: 389, wplCm3: 429, ixCm4: 3692, massaKgM: 42.3 },
  { id: "HEA-220", nome: "HEA 220", familia: "HEA", hMm: 210, bMm: 220, twMm: 7.0, tfMm: 11.0, areaCm2: 64.3, welCm3: 515, wplCm3: 568, ixCm4: 5410, massaKgM: 50.5 },
  { id: "HEA-240", nome: "HEA 240", familia: "HEA", hMm: 230, bMm: 240, twMm: 7.5, tfMm: 12.0, areaCm2: 76.8, welCm3: 675, wplCm3: 745, ixCm4: 7763, massaKgM: 60.3 },
  { id: "HEA-260", nome: "HEA 260", familia: "HEA", hMm: 250, bMm: 260, twMm: 7.5, tfMm: 12.5, areaCm2: 86.8, welCm3: 836, wplCm3: 920, ixCm4: 10450, massaKgM: 68.2 },
  { id: "HEA-300", nome: "HEA 300", familia: "HEA", hMm: 290, bMm: 300, twMm: 8.5, tfMm: 14.0, areaCm2: 113, welCm3: 1260, wplCm3: 1383, ixCm4: 18260, massaKgM: 88.3 },

  { id: "HEB-100", nome: "HEB 100", familia: "HEB", hMm: 100, bMm: 100, twMm: 6.0, tfMm: 10.0, areaCm2: 26.0, welCm3: 89.9, wplCm3: 104, ixCm4: 450, massaKgM: 20.4 },
  { id: "HEB-120", nome: "HEB 120", familia: "HEB", hMm: 120, bMm: 120, twMm: 6.5, tfMm: 11.0, areaCm2: 34.0, welCm3: 144, wplCm3: 165, ixCm4: 864, massaKgM: 26.7 },
  { id: "HEB-140", nome: "HEB 140", familia: "HEB", hMm: 140, bMm: 140, twMm: 7.0, tfMm: 12.0, areaCm2: 43.0, welCm3: 216, wplCm3: 246, ixCm4: 1509, massaKgM: 33.7 },
  { id: "HEB-160", nome: "HEB 160", familia: "HEB", hMm: 160, bMm: 160, twMm: 8.0, tfMm: 13.0, areaCm2: 54.3, welCm3: 311, wplCm3: 354, ixCm4: 2492, massaKgM: 42.6 },
  { id: "HEB-180", nome: "HEB 180", familia: "HEB", hMm: 180, bMm: 180, twMm: 8.5, tfMm: 14.0, areaCm2: 65.3, welCm3: 426, wplCm3: 481, ixCm4: 3831, massaKgM: 51.2 },
  { id: "HEB-200", nome: "HEB 200", familia: "HEB", hMm: 200, bMm: 200, twMm: 9.0, tfMm: 15.0, areaCm2: 78.1, welCm3: 570, wplCm3: 643, ixCm4: 5696, massaKgM: 61.3 },
  { id: "HEB-220", nome: "HEB 220", familia: "HEB", hMm: 220, bMm: 220, twMm: 9.5, tfMm: 16.0, areaCm2: 91.0, welCm3: 736, wplCm3: 827, ixCm4: 8091, massaKgM: 71.5 },
  { id: "HEB-240", nome: "HEB 240", familia: "HEB", hMm: 240, bMm: 240, twMm: 10.0, tfMm: 17.0, areaCm2: 106, welCm3: 938, wplCm3: 1053, ixCm4: 11260, massaKgM: 83.2 },
  { id: "HEB-260", nome: "HEB 260", familia: "HEB", hMm: 260, bMm: 260, twMm: 10.0, tfMm: 17.5, areaCm2: 118, welCm3: 1150, wplCm3: 1283, ixCm4: 14920, massaKgM: 93.0 },
  { id: "HEB-300", nome: "HEB 300", familia: "HEB", hMm: 300, bMm: 300, twMm: 11.0, tfMm: 19.0, areaCm2: 149, welCm3: 1678, wplCm3: 1869, ixCm4: 25170, massaKgM: 117.0 },

  { id: "TUBO-100x50x3", nome: "Tubo 100×50×3,0", familia: "TUBO", hMm: 100, bMm: 50, twMm: 3.0, tfMm: 3.0, areaCm2: 8.4, welCm3: 21.9, wplCm3: 27.4, ixCm4: 110, massaKgM: 6.6 },
  { id: "TUBO-120x60x4", nome: "Tubo 120×60×4,0", familia: "TUBO", hMm: 120, bMm: 60, twMm: 4.0, tfMm: 4.0, areaCm2: 13.3, welCm3: 41.6, wplCm3: 52.0, ixCm4: 250, massaKgM: 10.5 },
  { id: "TUBO-150x100x4", nome: "Tubo 150×100×4,0", familia: "TUBO", hMm: 150, bMm: 100, twMm: 4.0, tfMm: 4.0, areaCm2: 19.2, welCm3: 78.7, wplCm3: 94.4, ixCm4: 590, massaKgM: 15.1 },
  { id: "TUBO-200x100x6", nome: "Tubo 200×100×6,0", familia: "TUBO", hMm: 200, bMm: 100, twMm: 6.0, tfMm: 6.0, areaCm2: 33.4, welCm3: 176, wplCm3: 217, ixCm4: 1760, massaKgM: 26.2 },
  { id: "TUBO-250x150x8", nome: "Tubo 250×150×8,0", familia: "TUBO", hMm: 250, bMm: 150, twMm: 8.0, tfMm: 8.0, areaCm2: 59.7, welCm3: 400, wplCm3: 487, ixCm4: 5000, massaKgM: 46.9 },
  { id: "TUBO-300x200x10", nome: "Tubo 300×200×10", familia: "TUBO", hMm: 300, bMm: 200, twMm: 10.0, tfMm: 10.0, areaCm2: 94.0, welCm3: 755, wplCm3: 910, ixCm4: 11330, massaKgM: 73.8 },
];

export interface ElementoInput {
  id: string;
  nome: string;
  tipo: TipoElemento;
  /** Vão / comprimento livre (m). */
  vaoM: number;
  /** Altura do pilar, usada em pórtico e pilar (m). */
  alturaM: number;
  /** Carga uniformemente distribuída (kN/m). */
  cargaDistribuidaKnM: number;
  /** Carga concentrada no meio do vão ou no topo do pilar (kN). */
  cargaPontualKn: number;
  apoio: Apoio;
  material: MaterialId;
  /** Família preferida ou "auto" para deixar o algoritmo escolher. */
  familia: FamiliaPerfil | "auto";
  /** Multiplicador de margem sobre as cargas (>= 1). */
  fatorMargem: number;
  /** Número de peças iguais. */
  quantidade: number;
  /** Sobrecomprimento total por peça para corte/encaixe (m). */
  extraCorteM: number;
}

export interface PerfilCandidato {
  perfil: Perfil;
  /** Módulo resistente utilizado na verificação (cm³). */
  welCm3: number;
  /** Tensão de flexão estimada σ = M / W (MPa). */
  sigmaMPa: number;
  /** Taxa de utilização σ / σ_adm. */
  utilizacao: number;
  /** Flecha estimada (mm) — apenas para elementos fletidos. */
  flechaMm: number | null;
  /** Limite prático de flecha L/250 (mm). */
  flechaLimiteMm: number | null;
  flechaOk: boolean | null;
  /** Comprimento total considerado (m), já com extras de corte. */
  comprimentoTotalM: number;
  /** Peso total do conjunto (kg). */
  pesoTotalKg: number;
}

export interface ElementoResult {
  input: ElementoInput;
  /** Carga distribuída majorada pela margem (kN/m). */
  qMajoradoKnM: number;
  /** Carga pontual majorada pela margem (kN). */
  pMajoradoKn: number;
  momentoMaxKnM: number;
  cortanteMaxKn: number;
  /** Módulo resistente mínimo exigido (cm³). */
  wReqCm3: number;
  sigmaAdmMPa: number;
  /** Fórmulas aplicadas, para o modal "ver cálculo passo a passo". */
  passos: string[];
  /** Perfil sugerido (menor que atende) — null se nenhum perfil da tabela atende. */
  sugerido: PerfilCandidato | null;
  /** Alternativas ordenadas (inclui o sugerido). */
  alternativas: PerfilCandidato[];
  observacoes: string[];
}

export interface EstruturasResult {
  elementos: ElementoResult[];
  /** Peso total de aço de todos os elementos (kg). */
  pesoTotalKg: number;
  /** Número total de peças. */
  totalPecas: number;
  /** Comprimento total de perfis (m). */
  comprimentoTotalM: number;
}

const round = (n: number, d = 2) => {
  const f = 10 ** d;
  return Math.round(n * f) / f;
};

export function validarElemento(el: ElementoInput): string | null {
  const rotulo = el.nome || "Elemento";
  if (!Number.isFinite(el.vaoM) || el.vaoM <= 0) return `${rotulo}: informe um vão maior que zero.`;
  if (el.vaoM > 30) return `${rotulo}: vãos acima de 30 m exigem projeto específico.`;
  if (el.tipo === "portico-simples" || el.tipo === "pilar") {
    if (!Number.isFinite(el.alturaM) || el.alturaM <= 0)
      return `${rotulo}: informe a altura do pilar (m).`;
    if (el.alturaM > 20) return `${rotulo}: altura de pilar acima de 20 m exige projeto específico.`;
  }
  if (el.cargaDistribuidaKnM < 0 || el.cargaPontualKn < 0)
    return `${rotulo}: as cargas não podem ser negativas.`;
  if (el.cargaDistribuidaKnM === 0 && el.cargaPontualKn === 0)
    return `${rotulo}: informe pelo menos uma carga (distribuída ou pontual).`;
  if (el.fatorMargem < 1 || el.fatorMargem > 2)
    return `${rotulo}: o fator de margem deve ficar entre 1,0 e 2,0.`;
  if (!Number.isInteger(el.quantidade) || el.quantidade < 1)
    return `${rotulo}: a quantidade deve ser um número inteiro maior que zero.`;
  if (el.extraCorteM < 0 || el.extraCorteM > 2)
    return `${rotulo}: o extra de corte deve ficar entre 0 e 2 m.`;
  return null;
}

/** Esforços de viga simplesmente apoiada: M = qL²/8 + PL/4 ; V = qL/2 + P/2. */
export function esforcosVigaSimples(qKnM: number, pKn: number, lM: number) {
  return {
    momentoKnM: (qKnM * lM * lM) / 8 + (pKn * lM) / 4,
    cortanteKn: (qKnM * lM) / 2 + pKn / 2,
  };
}

/**
 * Viga contínua de 2 vãos iguais (aproximação clássica):
 * momento negativo sobre o apoio central ≈ qL²/8 e momento positivo no vão ≈ qL²/14.
 * O dimensionamento usa o maior valor absoluto (apoio central).
 */
export function esforcosVigaContinua(qKnM: number, pKn: number, lM: number) {
  const mApoio = (qKnM * lM * lM) / 8 + (3 * pKn * lM) / 16;
  const mVao = (qKnM * lM * lM) / 14 + (pKn * lM) / 6;
  return {
    momentoKnM: Math.max(mApoio, mVao),
    momentoApoioKnM: mApoio,
    momentoVaoKnM: mVao,
    cortanteKn: 0.625 * qKnM * lM + 0.6 * pKn,
  };
}

/**
 * Pórtico simples (estimativa indicativa): a viga é tratada como biapoiada com
 * redistribuição parcial (0,85·M) e o pilar recebe M ≈ P·h/2 da carga de topo.
 */
export function esforcosPortico(qKnM: number, pKn: number, lM: number, hM: number) {
  const viga = esforcosVigaSimples(qKnM, pKn, lM);
  const reacaoTopoKn = (qKnM * lM) / 2 + pKn / 2;
  return {
    momentoVigaKnM: viga.momentoKnM * 0.85,
    cortanteVigaKn: viga.cortanteKn,
    momentoPilarKnM: (reacaoTopoKn * hM) / 2,
    reacaoTopoKn,
  };
}

/** Flecha de viga biapoiada: δ = 5qL⁴/(384EI) + PL³/(48EI), em mm. */
export function flechaVigaSimplesMm(qKnM: number, pKn: number, lM: number, ixCm4: number): number {
  // E em kN/m²: 210 GPa = 210e6 kN/m² ; I em m⁴ = cm⁴ × 1e-8
  const eKnM2 = E_GPA * 1e6;
  const iM4 = ixCm4 * 1e-8;
  const ei = eKnM2 * iM4;
  if (ei <= 0) return 0;
  const dq = (5 * qKnM * lM ** 4) / (384 * ei);
  const dp = (pKn * lM ** 3) / (48 * ei);
  return (dq + dp) * 1000;
}

function fatorApoio(tipo: TipoElemento, apoio: Apoio): number {
  // Engastamento reduz o momento máximo de vãos fletidos (~2/3) e o de pilares (~1/2).
  if (apoio !== "engastado") return 1;
  if (tipo === "pilar" || tipo === "portico-simples") return 0.5;
  return 0.67;
}

function candidatosPara(
  el: ElementoInput,
  momentoKnM: number,
  wReqCm3: number,
  sigmaAdmMPa: number,
  comprimentoUnitarioM: number,
  calcularFlecha: boolean,
): PerfilCandidato[] {
  const familias: FamiliaPerfil[] =
    el.familia === "auto"
      ? el.tipo === "pilar" || el.tipo === "portico-simples"
        ? ["HEB", "HEA", "IPE", "TUBO"]
        : ["IPE", "HEA", "HEB", "TUBO"]
      : [el.familia];

  const pool = PERFIS.filter((p) => familias.includes(p.familia));
  const comprimentoTotalM = (comprimentoUnitarioM + el.extraCorteM) * el.quantidade;
  const flechaLimiteMm = calcularFlecha ? (el.vaoM * 1000) / 250 : null;

  const mapear = (perfil: Perfil): PerfilCandidato => {
    // σ = M / W  →  kN·m / cm³ ⇒ MPa: M[kN·m]×1e3 / (W[cm³]×1e-6) / 1e6
    const sigmaMPa = perfil.welCm3 > 0 ? (momentoKnM * 1e3) / (perfil.welCm3 * 1e-6) / 1e6 : Infinity;
    const flechaMm = calcularFlecha
      ? flechaVigaSimplesMm(
          el.cargaDistribuidaKnM * el.fatorMargem,
          el.cargaPontualKn * el.fatorMargem,
          el.vaoM,
          perfil.ixCm4,
        )
      : null;
    return {
      perfil,
      welCm3: perfil.welCm3,
      sigmaMPa: round(sigmaMPa, 1),
      utilizacao: round(sigmaMPa / sigmaAdmMPa, 3),
      flechaMm: flechaMm === null ? null : round(flechaMm, 1),
      flechaLimiteMm: flechaLimiteMm === null ? null : round(flechaLimiteMm, 1),
      flechaOk: flechaMm === null || flechaLimiteMm === null ? null : flechaMm <= flechaLimiteMm,
      comprimentoTotalM: round(comprimentoTotalM, 2),
      pesoTotalKg: round(perfil.massaKgM * comprimentoTotalM, 1),
    };
  };

  const atendem = pool
    .filter((p) => p.welCm3 >= wReqCm3)
    .sort((a, b) => a.massaKgM - b.massaKgM || a.welCm3 - b.welCm3)
    .map(mapear);

  if (atendem.length === 0) {
    // Nenhum perfil atende: devolve os maiores disponíveis como referência.
    return pool
      .sort((a, b) => b.welCm3 - a.welCm3)
      .slice(0, 3)
      .map(mapear);
  }
  return atendem.slice(0, 5);
}

export function calcElemento(el: ElementoInput): ElementoResult {
  const material = MATERIAIS[el.material];
  const sigmaAdmMPa = material.sigmaAdmMPa;
  const q = el.cargaDistribuidaKnM * el.fatorMargem;
  const p = el.cargaPontualKn * el.fatorMargem;
  const L = el.vaoM;
  const h = el.alturaM;
  const passos: string[] = [];
  const observacoes: string[] = [];

  passos.push(`Material ${material.nome} — σ_adm adotada = ${sigmaAdmMPa} MPa (fy = ${material.fyMPa} MPa).`);
  passos.push(
    `Cargas majoradas pelo fator de margem ${el.fatorMargem.toFixed(2)}: q = ${round(q, 3)} kN/m, P = ${round(p, 3)} kN.`,
  );

  let momentoKnM = 0;
  let cortanteKn = 0;
  let comprimentoUnitarioM = L;
  let calcularFlecha = false;

  switch (el.tipo) {
    case "viga-simples":
    case "laje-metalica": {
      const r = esforcosVigaSimples(q, p, L);
      momentoKnM = r.momentoKnM;
      cortanteKn = r.cortanteKn;
      calcularFlecha = true;
      passos.push(`M_max = qL²/8 + PL/4 = ${round(q, 3)}×${L}²/8 + ${round(p, 3)}×${L}/4 = ${round(momentoKnM)} kN·m.`);
      passos.push(`V_max = qL/2 + P/2 = ${round(cortanteKn)} kN.`);
      if (el.tipo === "laje-metalica")
        observacoes.push(
          "Cada viga secundária foi tratada como biapoiada; a carga informada já deve representar a faixa de influência (kN/m) de uma viga.",
        );
      break;
    }
    case "viga-continua-2vaos": {
      const r = esforcosVigaContinua(q, p, L);
      momentoKnM = r.momentoKnM;
      cortanteKn = r.cortanteKn;
      calcularFlecha = true;
      comprimentoUnitarioM = 2 * L;
      passos.push(
        `Apoio central: M ≈ qL²/8 + 3PL/16 = ${round(r.momentoApoioKnM)} kN·m; vão: M ≈ qL²/14 + PL/6 = ${round(r.momentoVaoKnM)} kN·m.`,
      );
      passos.push(`Dimensiona-se pelo maior valor: M_max = ${round(momentoKnM)} kN·m.`);
      passos.push(`V_max ≈ 0,625·qL + 0,6·P = ${round(cortanteKn)} kN.`);
      passos.push(`Comprimento da peça considerado = 2 × ${L} m (dois vãos).`);
      observacoes.push(
        "A viga contínua usa coeficientes aproximados para dois vãos iguais e carga uniforme. Vãos desiguais ou carregamentos alternados alteram os momentos.",
      );
      break;
    }
    case "portico-simples": {
      const r = esforcosPortico(q, p, L, h);
      momentoKnM = Math.max(r.momentoVigaKnM, r.momentoPilarKnM);
      cortanteKn = r.cortanteVigaKn;
      calcularFlecha = true;
      comprimentoUnitarioM = L + 2 * h;
      passos.push(`Viga do pórtico: M ≈ 0,85 × (qL²/8 + PL/4) = ${round(r.momentoVigaKnM)} kN·m.`);
      passos.push(
        `Reação de topo por pilar = qL/2 + P/2 = ${round(r.reacaoTopoKn)} kN; momento no pilar M ≈ N·h/2 = ${round(r.momentoPilarKnM)} kN·m.`,
      );
      passos.push(`Comprimento por pórtico = vão + 2 × altura = ${round(comprimentoUnitarioM)} m.`);
      observacoes.push(
        "O pórtico é tratado de forma indicativa, sem análise de rigidez relativa viga/pilar, ação do vento nem estabilidade global.",
      );
      break;
    }
    case "pilar": {
      const n = p + q * L;
      momentoKnM = (n * h) / 2;
      cortanteKn = 0;
      comprimentoUnitarioM = h;
      passos.push(`Carga axial estimada N = P + q·L = ${round(n)} kN.`);
      passos.push(`Momento indicativo no pilar M ≈ N·h/2 = ${round(momentoKnM)} kN·m (excentricidade suposta).`);
      observacoes.push(
        "Pilares exigem verificação de flambagem (Euler), esbeltez e ligações de base. Esta estimativa cobre apenas flexo-compressão indicativa.",
      );
      break;
    }
  }

  const fApoio = fatorApoio(el.tipo, el.apoio);
  if (fApoio !== 1) {
    momentoKnM *= fApoio;
    passos.push(
      `Condição de apoio "${APOIO_LABEL[el.apoio]}": momento reduzido pelo fator ${fApoio} → M = ${round(momentoKnM)} kN·m.`,
    );
    observacoes.push(
      "O engastamento foi considerado por fator de redução aproximado; o engaste real depende da rigidez das ligações e da fundação.",
    );
  }

  // W_req = M / σ_adm  →  (kN·m ×1e3 N·m) / (MPa ×1e6 N/m²) = m³ ; ×1e6 = cm³
  const wReqCm3 = round(((momentoKnM * 1e3) / (sigmaAdmMPa * 1e6)) * 1e6, 1);
  passos.push(
    `W_req = M / σ_adm = ${round(momentoKnM)} kN·m / ${sigmaAdmMPa} MPa = ${wReqCm3} cm³ (módulo resistente elástico mínimo).`,
  );

  const alternativas = candidatosPara(
    el,
    momentoKnM,
    wReqCm3,
    sigmaAdmMPa,
    comprimentoUnitarioM,
    calcularFlecha,
  );
  const sugerido = alternativas.find((c) => c.welCm3 >= wReqCm3) ?? null;

  if (!sugerido) {
    observacoes.push(
      "Nenhum perfil da tabela atende ao módulo resistente exigido. Considere perfis soldados, treliças, redução de vão ou aço de maior resistência.",
    );
  } else {
    passos.push(
      `Perfil sugerido: ${sugerido.perfil.nome} (W_el = ${sugerido.perfil.welCm3} cm³ ≥ ${wReqCm3} cm³), σ ≈ ${sugerido.sigmaMPa} MPa (${Math.round(sugerido.utilizacao * 100)}% da tensão admissível).`,
    );
    if (sugerido.flechaMm !== null && sugerido.flechaLimiteMm !== null) {
      passos.push(
        `Flecha estimada δ = 5qL⁴/(384EI) + PL³/(48EI) = ${sugerido.flechaMm} mm (limite prático L/250 = ${sugerido.flechaLimiteMm} mm).`,
      );
      if (sugerido.flechaOk === false)
        observacoes.push(
          "A flecha estimada ultrapassa L/250. Escolha um perfil mais alto na tabela de alternativas ou reduza o vão.",
        );
    }
    passos.push(
      `Peso: ${sugerido.perfil.massaKgM} kg/m × ${sugerido.comprimentoTotalM} m = ${sugerido.pesoTotalKg} kg (${el.quantidade} peça(s), extra de corte ${el.extraCorteM} m/peça).`,
    );
  }

  observacoes.push(
    "Verificar ligações, apoios, contraventamento e flambagem lateral com torção — não cobertos por esta estimativa.",
  );

  return {
    input: el,
    qMajoradoKnM: round(q, 3),
    pMajoradoKn: round(p, 3),
    momentoMaxKnM: round(momentoKnM),
    cortanteMaxKn: round(cortanteKn),
    wReqCm3,
    sigmaAdmMPa,
    passos,
    sugerido,
    alternativas,
    observacoes,
  };
}

export function calcEstruturas(elementos: ElementoInput[]): EstruturasResult {
  const results = elementos.map(calcElemento);
  const pesoTotalKg = results.reduce((acc, r) => acc + (r.sugerido?.pesoTotalKg ?? 0), 0);
  const comprimentoTotalM = results.reduce((acc, r) => acc + (r.sugerido?.comprimentoTotalM ?? 0), 0);
  const totalPecas = elementos.reduce((acc, e) => acc + e.quantidade, 0);
  return {
    elementos: results,
    pesoTotalKg: round(pesoTotalKg, 1),
    comprimentoTotalM: round(comprimentoTotalM, 2),
    totalPecas,
  };
}

export function toCSVEstruturas(result: EstruturasResult): string {
  const linhas: string[] = [
    "elemento;tipo;vao_m;M_max_kNm;V_max_kN;W_req_cm3;perfil;W_perfil_cm3;massa_kg_m;quantidade;comprimento_total_m;peso_total_kg;utilizacao_pct",
  ];
  for (const r of result.elementos) {
    const s = r.sugerido;
    linhas.push(
      [
        r.input.nome,
        TIPO_LABEL[r.input.tipo],
        r.input.vaoM,
        r.momentoMaxKnM,
        r.cortanteMaxKn,
        r.wReqCm3,
        s ? s.perfil.nome : "sem perfil compatível",
        s ? s.perfil.welCm3 : "-",
        s ? s.perfil.massaKgM : "-",
        r.input.quantidade,
        s ? s.comprimentoTotalM : "-",
        s ? s.pesoTotalKg : "-",
        s ? Math.round(s.utilizacao * 100) : "-",
      ].join(";"),
    );
  }
  linhas.push("");
  linhas.push(`TOTAL;;;;;;;;;${result.totalPecas};${result.comprimentoTotalM};${result.pesoTotalKg};`);
  return linhas.join("\n");
}
