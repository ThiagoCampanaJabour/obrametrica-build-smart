/**
 * Motor de cálculo — Área e Layout de Painéis Fotovoltaicos (2D top-view).
 *
 * Todas as funções são puras e testáveis. Unidades internas em metros e graus.
 * O modelo é heurístico: geometria retangular, sombreamento por projeção linear
 * na pior hora (solstício de inverno ao meio-dia solar). Não substitui análise
 * 3D (PVsyst / Helioscope).
 */

export type TipoLocal = "telhado-plano" | "telhado-inclinado" | "solo";
export type Montagem = "retrato" | "paisagem";

export interface ModuloPV {
  /** Rótulo do preset ou modelo custom. */
  label: string;
  /** Potência nominal do módulo em watts-pico. */
  pmp_W: number;
  /** Maior dimensão do módulo (m). */
  comprimento_m: number;
  /** Menor dimensão do módulo (m). */
  largura_m: number;
  /** Tensão de máxima potência (V) — informativa para strings. */
  vmpp_V?: number;
}

export interface Obstaculo {
  id: string;
  label: string;
  /** Canto inferior-esquerdo, relativo à origem da área (m). */
  x_m: number;
  y_m: number;
  largura_m: number;
  profundidade_m: number;
  /** Altura acima do plano dos módulos (m). 0 = sem sombra projetada. */
  altura_m: number;
}

export interface LayoutInput {
  nome: string;
  tipoLocal: TipoLocal;
  /** Dimensão da área no eixo X (largura, m). */
  areaLargura_m: number;
  /** Dimensão da área no eixo Y (comprimento, m). */
  areaComprimento_m: number;
  /** Azimute da água/área (0 = Norte, 90 = Leste, 180 = Sul). */
  azimute_deg: number;
  /** Inclinação do telhado ou da estrutura (graus). */
  inclinacao_deg: number;
  /** Latitude do local (negativa no hemisfério sul). */
  latitude_deg: number;
  modulo: ModuloPV;
  montagem: Montagem;
  /** Folga entre módulos no eixo X (m). */
  gapTransversal_m: number;
  /** Folga entre módulos no eixo Y (m). */
  gapLongitudinal_m: number;
  /** Recuo livre nas bordas da área (m). */
  margemBorda_m: number;
  /** Largura do corredor de manutenção (m). */
  corredorManutencao_m: number;
  /** Nº de fileiras por bloco antes de inserir um corredor. 0 = sem corredores. */
  fileirasPorBloco: number;
  /** Limite de cobertura da área disponível (%). */
  coberturaMax_pct: number;
  /** Aplicar espaçamento entre fileiras para evitar sombreamento mútuo. */
  usarEspacamentoFileiras: boolean;
  obstaculos: Obstaculo[];
  /** Módulos em série por string. */
  modulosPorString: number;
  /** Limite opcional de módulos desejados. */
  alvoModulos?: number;
  /** Limite opcional de potência alvo (kWp). */
  alvoPotencia_kWp?: number;
  /** Módulos reserva (%). */
  reserva_pct: number;
}

export interface ModuloPosicionado {
  id: string;
  row: number;
  col: number;
  /** Canto inferior-esquerdo (m). */
  x_m: number;
  y_m: number;
  largura_m: number;
  altura_m: number;
  orientacao: Montagem;
  stringId: number;
}

export interface PosicaoExcluida {
  row: number;
  col: number;
  x_m: number;
  y_m: number;
  largura_m: number;
  altura_m: number;
  motivo: "obstaculo" | "sombra" | "cobertura" | "alvo";
}

export interface Corredor {
  y_m: number;
  altura_m: number;
}

export interface LayoutResult {
  input: LayoutInput;
  /** Dimensão efetiva ocupada por módulo, já com gaps. */
  moduloEfetivo: { largura_m: number; altura_m: number };
  /** Footprint físico do módulo no plano (sem gaps). */
  moduloFisico: { largura_m: number; altura_m: number };
  nColunas: number;
  nFileiras: number;
  /** Passo entre fileiras aplicado (m). */
  passoFileira_m: number;
  espacamentoFileiras_m: number;
  elevacaoSolarInverno_deg: number;
  nModulosGrade: number;
  nModulos: number;
  potencia_kWp: number;
  areaDisponivel_m2: number;
  areaUtil_m2: number;
  areaOcupada_m2: number;
  coberturaEfetiva_pct: number;
  modulos: ModuloPosicionado[];
  excluidos: PosicaoExcluida[];
  corredores: Corredor[];
  sombras: Array<{ id: string; x_m: number; y_m: number; largura_m: number; profundidade_m: number }>;
  nStrings: number;
  modulosUltimaString: number;
  modulosReserva: number;
  sugestao: { tilt_deg: number; azimute_deg: number; justificativa: string };
  avisos: string[];
}

const EPS = 1e-9;
const OBLIQUIDADE = 23.45;

const rad = (deg: number) => (deg * Math.PI) / 180;
const clampNum = (v: number, min: number, max: number) =>
  Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : min;

export const PRESET_MODULOS: ModuloPV[] = [
  { label: "330 Wp — 1,95 × 0,99 m", pmp_W: 330, comprimento_m: 1.95, largura_m: 0.99, vmpp_V: 34 },
  { label: "400 Wp — 1,95 × 0,99 m", pmp_W: 400, comprimento_m: 1.95, largura_m: 0.99, vmpp_V: 31 },
  { label: "550 Wp — 2,28 × 1,13 m", pmp_W: 550, comprimento_m: 2.28, largura_m: 1.13, vmpp_V: 42 },
  { label: "540 Wp — 2,30 × 1,16 m", pmp_W: 540, comprimento_m: 2.3, largura_m: 1.16, vmpp_V: 41 },
];

export const DEFAULT_LAYOUT_INPUT: LayoutInput = {
  nome: "Telhado plano — galpão",
  tipoLocal: "telhado-plano",
  areaLargura_m: 12,
  areaComprimento_m: 8,
  azimute_deg: 0,
  inclinacao_deg: 15,
  latitude_deg: -23.55,
  modulo: PRESET_MODULOS[1]!,
  montagem: "paisagem",
  gapTransversal_m: 0.03,
  gapLongitudinal_m: 0.01,
  margemBorda_m: 0.3,
  corredorManutencao_m: 0.6,
  fileirasPorBloco: 4,
  coberturaMax_pct: 80,
  usarEspacamentoFileiras: false,
  obstaculos: [],
  modulosPorString: 10,
  reserva_pct: 2,
};

/** Footprint do módulo (m) considerando a montagem escolhida. */
export function moduleFootprint(
  modulo: ModuloPV,
  montagem: Montagem,
): { largura_m: number; altura_m: number } {
  const maior = Math.max(modulo.comprimento_m, modulo.largura_m);
  const menor = Math.min(modulo.comprimento_m, modulo.largura_m);
  // paisagem: maior dimensão no eixo X. retrato: maior dimensão no eixo Y.
  return montagem === "paisagem"
    ? { largura_m: maior, altura_m: menor }
    : { largura_m: menor, altura_m: maior };
}

/** Dimensões efetivas (footprint + gaps). */
export function effectiveModuleDimensions(
  modulo: ModuloPV,
  montagem: Montagem,
  gapTransversal_m: number,
  gapLongitudinal_m: number,
): { width_eff_m: number; height_eff_m: number } {
  const f = moduleFootprint(modulo, montagem);
  return {
    width_eff_m: f.largura_m + Math.max(0, gapTransversal_m),
    height_eff_m: f.altura_m + Math.max(0, gapLongitudinal_m),
  };
}

/** Contagem de grade retangular simples. */
export function gridCount(
  availableW_m: number,
  availableL_m: number,
  module_w_eff: number,
  module_h_eff: number,
): { n_cols: number; n_rows: number; n_modules: number } {
  if (module_w_eff <= 0 || module_h_eff <= 0) return { n_cols: 0, n_rows: 0, n_modules: 0 };
  const n_cols = Math.max(0, Math.floor((availableW_m + EPS) / module_w_eff));
  const n_rows = Math.max(0, Math.floor((availableL_m + EPS) / module_h_eff));
  return { n_cols, n_rows, n_modules: n_cols * n_rows };
}

/** Aplica o limite percentual de cobertura ao número de módulos. */
export function applyCoverageLimit(n_modules: number, coverage_pct: number): number {
  const pct = clampNum(coverage_pct, 0, 100) / 100;
  return Math.max(0, Math.floor(n_modules * pct));
}

/**
 * Elevação solar ao meio-dia no solstício de inverno local.
 * Hemisfério sul: declinação +23,45°; hemisfério norte: −23,45°.
 */
export function winterSolarElevation(latitude_deg: number): number {
  const lat = clampNum(latitude_deg, -60, 60);
  const decl = lat < 0 ? OBLIQUIDADE : -OBLIQUIDADE;
  return Math.max(5, 90 - Math.abs(lat - decl));
}

/**
 * Passo mínimo entre fileiras (m) para evitar sombreamento mútuo:
 * S = h·cos(tilt) + h·sin(tilt)/tan(elev_inverno)
 */
export function computeRowSpacing(
  module_h_m: number,
  latitude_deg: number,
  tilt_deg = 15,
): number {
  const elev = winterSolarElevation(latitude_deg);
  const tilt = clampNum(tilt_deg, 0, 60);
  const base = module_h_m * Math.cos(rad(tilt));
  const sombra = (module_h_m * Math.sin(rad(tilt))) / Math.tan(rad(elev));
  return Number((base + sombra).toFixed(3));
}

/** Comprimento da sombra projetada por um obstáculo (m). */
export function projectShadowLength(height_m: number, solar_elevation_deg: number): number {
  if (height_m <= 0) return 0;
  const elev = clampNum(solar_elevation_deg, 1, 89);
  return Number((height_m / Math.tan(rad(elev))).toFixed(3));
}

/** Sugestão de tilt/azimute para máxima geração anual. */
export function suggestTiltOrientation(
  latitude_deg: number,
  roof_tilt_deg?: number,
  tipoLocal: TipoLocal = "telhado-plano",
): { tilt_deg: number; azimute_deg: number; justificativa: string } {
  const lat = Math.abs(latitude_deg);
  const hemisferioSul = latitude_deg < 0;
  const azimute = hemisferioSul ? 0 : 180;
  const face = hemisferioSul ? "Norte geográfico" : "Sul geográfico";
  if (tipoLocal === "telhado-inclinado" && roof_tilt_deg && roof_tilt_deg > 0) {
    return {
      tilt_deg: Number(roof_tilt_deg.toFixed(1)),
      azimute_deg: azimute,
      justificativa: `Em telhado inclinado a estrutura acompanha o plano da água (${roof_tilt_deg.toFixed(0)}°). O ideal seria ${Math.round(lat)}° voltado ao ${face}; desvios de até ±30° no azimute custam menos de 5% da geração anual.`,
    };
  }
  const tilt = Math.max(10, Math.round(lat));
  return {
    tilt_deg: tilt,
    azimute_deg: azimute,
    justificativa: `Para máxima geração anual use tilt ≈ latitude (${tilt}°) voltado ao ${face}. Inclinação mínima de 10° garante autolimpeza pela chuva.`,
  };
}

function rectsOverlap(
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number },
): boolean {
  return a.x < b.x + b.w - EPS && a.x + a.w > b.x + EPS && a.y < b.y + b.h - EPS && a.y + a.h > b.y + EPS;
}

/**
 * Posiciona os módulos na área respeitando gaps, margens de borda,
 * corredores de manutenção, obstáculos, sombras e limite de cobertura.
 */
export function layoutPlaceModules(input: LayoutInput): LayoutResult {
  const avisos: string[] = [];

  const areaW = Math.max(0, input.areaLargura_m);
  const areaL = Math.max(0, input.areaComprimento_m);
  const margem = clampNum(input.margemBorda_m, 0, Math.min(areaW, areaL) / 2);
  const usableW = Math.max(0, areaW - 2 * margem);
  const usableL = Math.max(0, areaL - 2 * margem);

  const fisico = moduleFootprint(input.modulo, input.montagem);
  const eff = effectiveModuleDimensions(
    input.modulo,
    input.montagem,
    input.gapTransversal_m,
    input.gapLongitudinal_m,
  );

  const elevacao = winterSolarElevation(input.latitude_deg);
  const tiltEstrutura =
    input.tipoLocal === "telhado-inclinado" ? input.inclinacao_deg : input.inclinacao_deg;
  const espacamento = computeRowSpacing(fisico.altura_m, input.latitude_deg, tiltEstrutura);
  const passoFileira = input.usarEspacamentoFileiras
    ? Math.max(eff.height_eff_m, espacamento)
    : eff.height_eff_m;

  const nColunas = eff.width_eff_m > 0 ? Math.floor((usableW + EPS) / eff.width_eff_m) : 0;

  // Distribui fileiras ao longo de Y, inserindo corredores de manutenção.
  const corredores: Corredor[] = [];
  const rowsY: number[] = [];
  const corredor = Math.max(0, input.corredorManutencao_m);
  const bloco = Math.max(0, Math.floor(input.fileirasPorBloco));
  let y = margem;
  let rowsNoBloco = 0;
  while (y + fisico.altura_m <= margem + usableL + EPS) {
    rowsY.push(y);
    rowsNoBloco += 1;
    let avanco = passoFileira;
    if (bloco > 0 && rowsNoBloco === bloco && corredor > 0) {
      const proximo = y + passoFileira;
      // só reserva o corredor se ainda houver espaço para outra fileira depois dele
      if (proximo + corredor + fisico.altura_m <= margem + usableL + EPS) {
        corredores.push({ y_m: proximo, altura_m: corredor });
        avanco = passoFileira + corredor;
      }
      rowsNoBloco = 0;
    }
    y += avanco;
  }
  const nFileiras = rowsY.length;

  // Sombras projetadas (obstáculo → direção oposta ao sol: para o Sul no
  // hemisfério sul, ou seja, +Y quando a área está orientada com Y = norte-sul).
  const sombras = input.obstaculos
    .filter((o) => o.altura_m > 0)
    .map((o) => {
      const comprimento = projectShadowLength(o.altura_m, elevacao);
      return {
        id: o.id,
        x_m: o.x_m,
        y_m: input.latitude_deg < 0 ? o.y_m + o.profundidade_m : o.y_m - comprimento,
        largura_m: o.largura_m,
        profundidade_m: comprimento,
      };
    })
    .filter((s) => s.profundidade_m > 0);

  const nModulosGrade = nColunas * nFileiras;
  const areaDisponivel = areaW * areaL;
  const areaUtil = usableW * usableL;
  const moduloArea = fisico.largura_m * fisico.altura_m;

  // Limites: cobertura da área e alvo do usuário.
  const limiteCobertura = Math.floor(
    (areaDisponivel * clampNum(input.coberturaMax_pct, 0, 100)) / 100 / Math.max(moduloArea, EPS),
  );
  let limiteAlvo = Number.POSITIVE_INFINITY;
  if (input.alvoModulos && input.alvoModulos > 0) limiteAlvo = Math.floor(input.alvoModulos);
  else if (input.alvoPotencia_kWp && input.alvoPotencia_kWp > 0)
    limiteAlvo = Math.ceil((input.alvoPotencia_kWp * 1000) / Math.max(input.modulo.pmp_W, EPS));

  const modulos: ModuloPosicionado[] = [];
  const excluidos: PosicaoExcluida[] = [];
  let colocados = 0;

  for (let r = 0; r < nFileiras; r += 1) {
    for (let c = 0; c < nColunas; c += 1) {
      const x = margem + c * eff.width_eff_m;
      const yy = rowsY[r]!;
      const rect = { x, y: yy, w: fisico.largura_m, h: fisico.altura_m };
      const base = {
        row: r + 1,
        col: c + 1,
        x_m: Number(x.toFixed(3)),
        y_m: Number(yy.toFixed(3)),
        largura_m: fisico.largura_m,
        altura_m: fisico.altura_m,
      };

      const emObstaculo = input.obstaculos.some((o) =>
        rectsOverlap(rect, { x: o.x_m, y: o.y_m, w: o.largura_m, h: o.profundidade_m }),
      );
      if (emObstaculo) {
        excluidos.push({ ...base, motivo: "obstaculo" });
        continue;
      }
      const emSombra = sombras.some((s) =>
        rectsOverlap(rect, { x: s.x_m, y: s.y_m, w: s.largura_m, h: s.profundidade_m }),
      );
      if (emSombra) {
        excluidos.push({ ...base, motivo: "sombra" });
        continue;
      }
      if (colocados >= limiteCobertura) {
        excluidos.push({ ...base, motivo: "cobertura" });
        continue;
      }
      if (colocados >= limiteAlvo) {
        excluidos.push({ ...base, motivo: "alvo" });
        continue;
      }

      colocados += 1;
      modulos.push({
        id: `M${String(colocados).padStart(3, "0")}`,
        ...base,
        orientacao: input.montagem,
        stringId: 0,
      });
    }
  }

  const modulosPorString = Math.max(1, Math.floor(input.modulosPorString) || 1);
  modulos.forEach((m, idx) => {
    m.stringId = Math.floor(idx / modulosPorString) + 1;
  });

  const nModulos = modulos.length;
  const nStrings = Math.ceil(nModulos / modulosPorString);
  const modulosUltimaString = nModulos === 0 ? 0 : nModulos - (nStrings - 1) * modulosPorString;
  const areaOcupada = nModulos * moduloArea;
  const potencia = (nModulos * input.modulo.pmp_W) / 1000;

  // Avisos técnicos.
  if (nModulos === 0) avisos.push("Nenhum módulo cabe na área informada com os parâmetros atuais.");
  if (nColunas === 0 && usableW > 0)
    avisos.push(
      `A largura útil (${usableW.toFixed(2)} m) é menor que o módulo efetivo (${eff.width_eff_m.toFixed(2)} m). Considere montagem em ${input.montagem === "paisagem" ? "retrato" : "paisagem"}.`,
    );
  if (colocados >= limiteCobertura && limiteCobertura < nModulosGrade)
    avisos.push(
      `Limite de cobertura de ${input.coberturaMax_pct}% ativo: a grade comportaria ${nModulosGrade} módulos, mas o limite permite ${limiteCobertura}.`,
    );
  if (Number.isFinite(limiteAlvo) && nModulos >= limiteAlvo)
    avisos.push(`Alvo do usuário atingido (${limiteAlvo} módulos) — há espaço remanescente na área.`);
  if (corredor < 0.6 && bloco > 0)
    avisos.push("Corredor de manutenção abaixo de 600 mm — revise o acesso para limpeza e resgate.");
  if (input.usarEspacamentoFileiras && espacamento > eff.height_eff_m)
    avisos.push(
      `Espaçamento entre fileiras de ${espacamento.toFixed(2)} m aplicado (elevação solar de inverno ≈ ${elevacao.toFixed(1)}°).`,
    );
  if (modulosUltimaString > 0 && modulosUltimaString < modulosPorString && nStrings > 1)
    avisos.push(
      `A última string ficou com ${modulosUltimaString} módulos — strings desiguais podem exigir MPPTs separados.`,
    );
  const vmpp = input.modulo.vmpp_V;
  if (vmpp && vmpp * modulosPorString > 800)
    avisos.push(
      `Tensão estimada da string (${(vmpp * modulosPorString).toFixed(0)} V em Vmpp) próxima ou acima de 800 V — verifique a tensão máxima DC do inversor.`,
    );
  if (input.obstaculos.length > 0)
    avisos.push(
      "Sombreamento estimado por projeção linear no solstício de inverno (pior caso ao meio-dia). Para telhados complexos, use análise 3D.",
    );

  return {
    input,
    moduloEfetivo: { largura_m: eff.width_eff_m, altura_m: eff.height_eff_m },
    moduloFisico: fisico,
    nColunas,
    nFileiras,
    passoFileira_m: Number(passoFileira.toFixed(3)),
    espacamentoFileiras_m: espacamento,
    elevacaoSolarInverno_deg: Number(elevacao.toFixed(2)),
    nModulosGrade,
    nModulos,
    potencia_kWp: Number(potencia.toFixed(3)),
    areaDisponivel_m2: Number(areaDisponivel.toFixed(2)),
    areaUtil_m2: Number(areaUtil.toFixed(2)),
    areaOcupada_m2: Number(areaOcupada.toFixed(2)),
    coberturaEfetiva_pct:
      areaDisponivel > 0 ? Number(((areaOcupada / areaDisponivel) * 100).toFixed(2)) : 0,
    modulos,
    excluidos,
    corredores,
    sombras,
    nStrings,
    modulosUltimaString,
    modulosReserva: Math.ceil((nModulos * clampNum(input.reserva_pct, 0, 20)) / 100),
    sugestao: suggestTiltOrientation(input.latitude_deg, input.inclinacao_deg, input.tipoLocal),
    avisos,
  };
}

/** CSV com a lista de módulos e posições. */
export function exportLayoutCSV(result: LayoutResult): string {
  const head = ["module_id", "row", "col", "x_m", "y_m", "largura_m", "altura_m", "orientacao", "string_id"];
  const linhas = result.modulos.map((m) =>
    [
      m.id,
      m.row,
      m.col,
      m.x_m.toFixed(3),
      m.y_m.toFixed(3),
      m.largura_m.toFixed(3),
      m.altura_m.toFixed(3),
      m.orientacao,
      m.stringId,
    ].join(";"),
  );
  const resumo = [
    "",
    ["n_modulos", result.nModulos].join(";"),
    ["potencia_kWp", result.potencia_kWp.toFixed(3)].join(";"),
    ["n_colunas", result.nColunas].join(";"),
    ["n_fileiras", result.nFileiras].join(";"),
    ["n_strings", result.nStrings].join(";"),
    ["area_ocupada_m2", result.areaOcupada_m2.toFixed(2)].join(";"),
    ["cobertura_efetiva_pct", result.coberturaEfetiva_pct.toFixed(2)].join(";"),
  ];
  return [head.join(";"), ...linhas, ...resumo].join("\n");
}

export default layoutPlaceModules;
