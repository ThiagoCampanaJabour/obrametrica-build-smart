// Motor puro do Simulador de Iluminação Natural e Sombras (fachadas).
// Heurístico e determinístico: sem I/O, sem Date, sem Math.random.
// Todas as fórmulas estão documentadas em content/construcao-civil/iluminacao/metodologia.md

export type Orientacao = "N" | "NE" | "L" | "SE" | "S" | "SO" | "O" | "NO";

export const ORIENTACAO_LABEL: Record<Orientacao, string> = {
  N: "Norte",
  NE: "Nordeste",
  L: "Leste",
  SE: "Sudeste",
  S: "Sul",
  SO: "Sudoeste",
  O: "Oeste",
  NO: "Noroeste",
};

/** Azimute da fachada em graus a partir do Norte (sentido horário). */
export const ORIENTACAO_AZIMUTE: Record<Orientacao, number> = {
  N: 0,
  NE: 45,
  L: 90,
  SE: 135,
  S: 180,
  SO: 225,
  O: 270,
  NO: 315,
};

export type TipoVidro = "simples" | "duplo" | "low-e" | "refletivo";

/** Transmitância luminosa (Tv) por tipo de vidro. */
export const VIDRO_TV: Record<TipoVidro, number> = {
  simples: 0.8,
  duplo: 0.65,
  "low-e": 0.5,
  refletivo: 0.3,
};

export const VIDRO_LABEL: Record<TipoVidro, string> = {
  simples: "Vidro simples (Tv 0,80)",
  duplo: "Vidro duplo (Tv 0,65)",
  "low-e": "Vidro low-e (Tv 0,50)",
  refletivo: "Vidro refletivo (Tv 0,30)",
};

export type Obstrucao = "nenhuma" | "parcial" | "total";

/** Fator multiplicador da luz disponível conforme obstrução externa. */
export const OBSTRUCAO_FATOR: Record<Obstrucao, number> = {
  nenhuma: 1,
  parcial: 0.7,
  total: 0.4,
};

export const OBSTRUCAO_LABEL: Record<Obstrucao, string> = {
  nenhuma: "Sem obstrução relevante",
  parcial: "Obstrução parcial (edifício/vegetação próxima)",
  total: "Obstrução severa (vão sombreado quase o dia todo)",
};

export type Pelicula = "nenhuma" | "leve" | "media" | "forte";

/** Fator aplicado sobre Tv quando há película. */
export const PELICULA_FATOR: Record<Pelicula, number> = {
  nenhuma: 1,
  leve: 0.85,
  media: 0.7,
  forte: 0.5,
};

export const PELICULA_LABEL: Record<Pelicula, string> = {
  nenhuma: "Sem película",
  leve: "Película leve (−15% Tv)",
  media: "Película média (−30% Tv)",
  forte: "Película forte (−50% Tv)",
};

export type Persiana = "nenhuma" | "baixa" | "media" | "alta";

/** Redução da componente direta por sombreamento interno (persiana/cortina). */
export const PERSIANA_REDUCAO: Record<Persiana, number> = {
  nenhuma: 0,
  baixa: 0.2,
  media: 0.4,
  alta: 0.6,
};

export const PERSIANA_LABEL: Record<Persiana, string> = {
  nenhuma: "Sem persiana interna",
  baixa: "Persiana interna eficiência baixa",
  media: "Persiana interna eficiência média",
  alta: "Persiana interna eficiência alta (blackout parcial)",
};

export type Albedo = "escuro" | "medio" | "claro";

/** Fator de acréscimo por refletância das superfícies internas. */
export const ALBEDO_FATOR: Record<Albedo, number> = {
  escuro: 0.85,
  medio: 1,
  claro: 1.15,
};

export const ALBEDO_LABEL: Record<Albedo, string> = {
  escuro: "Acabamento interno escuro",
  medio: "Acabamento interno médio",
  claro: "Acabamento interno claro",
};

export type UsoAmbiente = "escritorio" | "sala" | "circulacao" | "escola" | "personalizado";

/** Iluminância alvo (lux) por uso, valores usuais de referência. */
export const USO_TARGET: Record<Exclude<UsoAmbiente, "personalizado">, number> = {
  escritorio: 400,
  sala: 200,
  circulacao: 150,
  escola: 400,
};

export const USO_LABEL: Record<UsoAmbiente, string> = {
  escritorio: "Escritório (300–500 lux)",
  sala: "Sala / estar (150–300 lux)",
  circulacao: "Circulação (100–200 lux)",
  escola: "Sala de aula (300–500 lux)",
  personalizado: "Personalizado",
};

export type Cidade = {
  id: string;
  nome: string;
  latitude: number;
  /** Irradiância direta normal de pico em céu limpo (W/m²). */
  dniPicoWm2: number;
  /** Irradiância difusa horizontal de pico (W/m²). */
  difusaPicoWm2: number;
  /** Iluminância externa de referência para céu encoberto (lux). */
  ceuEncobertoLux: number;
};

export const CIDADES: Cidade[] = [
  { id: "sao-paulo", nome: "São Paulo (SP)", latitude: -23.55, dniPicoWm2: 820, difusaPicoWm2: 180, ceuEncobertoLux: 5000 },
  { id: "rio-de-janeiro", nome: "Rio de Janeiro (RJ)", latitude: -22.9, dniPicoWm2: 860, difusaPicoWm2: 190, ceuEncobertoLux: 5200 },
  { id: "belo-horizonte", nome: "Belo Horizonte (MG)", latitude: -19.92, dniPicoWm2: 880, difusaPicoWm2: 180, ceuEncobertoLux: 5200 },
  { id: "brasilia", nome: "Brasília (DF)", latitude: -15.78, dniPicoWm2: 920, difusaPicoWm2: 170, ceuEncobertoLux: 5400 },
  { id: "salvador", nome: "Salvador (BA)", latitude: -12.97, dniPicoWm2: 900, difusaPicoWm2: 210, ceuEncobertoLux: 5600 },
  { id: "fortaleza", nome: "Fortaleza (CE)", latitude: -3.72, dniPicoWm2: 940, difusaPicoWm2: 220, ceuEncobertoLux: 5800 },
  { id: "curitiba", nome: "Curitiba (PR)", latitude: -25.43, dniPicoWm2: 780, difusaPicoWm2: 180, ceuEncobertoLux: 4800 },
  { id: "porto-alegre", nome: "Porto Alegre (RS)", latitude: -30.03, dniPicoWm2: 800, difusaPicoWm2: 175, ceuEncobertoLux: 4800 },
];

export const CIDADE_PADRAO = CIDADES[0]!;

export function getCidade(id: string): Cidade {
  return CIDADES.find((c) => c.id === id) ?? CIDADE_PADRAO;
}

/** Fator sazonal simplificado por mês (1 = janeiro), hemisfério sul. */
export const MES_FATOR = [1.05, 1.03, 1.0, 0.95, 0.9, 0.87, 0.88, 0.93, 0.98, 1.02, 1.05, 1.06];

export const MES_LABEL = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

/** Fator de manutenção padrão (sujeira/envelhecimento do vidro). */
export const MAINTENANCE_FACTOR = 0.8;

/** Conversão simplificada de irradiância para iluminância: 1 W/m² ≈ 120 lux. */
export const LUX_POR_WM2 = 120;

/** Limiar de irradiância direta transmitida que indica risco alto de ofuscamento (W/m²). */
export const GLARE_ALTO_WM2 = 200;
export const GLARE_MEDIO_WM2 = 90;

export const HORA_INICIO = 6;
export const HORA_FIM = 18;

export type Faixa = { inicio: number; fim: number };

export type Protecoes = {
  /** Profundidade do beiral (m). */
  beiralM: number;
  /** Profundidade do brise horizontal (m). */
  briseHorizM: number;
  /** Largura das aletas do brise vertical (m). */
  briseVertM: number;
  pelicula: Pelicula;
  persiana: Persiana;
};

export const PROTECOES_PADRAO: Protecoes = {
  beiralM: 0,
  briseHorizM: 0,
  briseVertM: 0,
  pelicula: "nenhuma",
  persiana: "nenhuma",
};

export type AmbienteInput = {
  id: string;
  nome: string;
  orientacao: Orientacao;
  cidadeId: string;
  mes: number; // 1..12
  larguraJanelaM: number;
  alturaJanelaM: number;
  areaAmbienteM2: number;
  profundidadeM: number;
  peDireitoM: number;
  vidro: TipoVidro;
  obstrucao: Obstrucao;
  albedo: Albedo;
  uso: UsoAmbiente;
  targetLux: number;
  protecoes: Protecoes;
  faixas: Faixa[];
};

export type HoraResult = {
  hora: number;
  /** Irradiância incidente no plano do vidro (W/m²). */
  irradianciaWm2: number;
  irradianciaDiretaWm2: number;
  irradianciaDifusaWm2: number;
  /** Redução aplicada pelas proteções sobre a componente direta (0..1). */
  reducaoProtecao: number;
  eInsideLux: number;
  glareWm2: number;
  risco: RiscoNivel;
};

export type RiscoNivel = "baixo" | "medio" | "alto";

export type FaixaResult = {
  faixa: Faixa;
  label: string;
  horas: HoraResult[];
  eMediaLux: number;
  ePicoLux: number;
  percentualDireta: number;
  percentualDifusa: number;
  risco: RiscoNivel;
  status: StatusAlvo;
};

export type StatusAlvo = "ok" | "atencao" | "insuficiente";

export type RecomendacaoProtecao = {
  titulo: string;
  reducaoDiretaPct: number;
  impactoDFPct: number;
  justificativa: string;
};

export type AmbienteResult = {
  input: AmbienteInput;
  cidade: Cidade;
  areaVidroM2: number;
  tvEfetivo: number;
  geometricFactor: number;
  daylightFactorPct: number;
  eInsideDFLux: number;
  eMediaLux: number;
  status: StatusAlvo;
  risco: RiscoNivel;
  faixas: FaixaResult[];
  horas: HoraResult[];
  recomendacoes: RecomendacaoProtecao[];
  alertas: string[];
  passos: string[];
};

export type IluminacaoResult = {
  ambientes: AmbienteResult[];
  alertas: string[];
};

export const LIMITES = {
  areaAmbienteMaxM2: 2000,
  janelaMaxM: 20,
  profundidadeMaxM: 40,
  peDireitoMaxM: 12,
} as const;

const round = (v: number, casas = 2) => {
  const f = 10 ** casas;
  return Math.round((v + Number.EPSILON) * f) / f;
};

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const rad = (deg: number) => (deg * Math.PI) / 180;

/** Altura solar aproximada (graus) para a hora do dia (perfil senoidal 6h–18h). */
export function alturaSolarAprox(hora: number, latitude: number): number {
  const t = (hora - HORA_INICIO) / (HORA_FIM - HORA_INICIO);
  if (t < 0 || t > 1) return 0;
  const pico = clamp(90 - Math.abs(latitude) * 0.55, 40, 88);
  return pico * Math.sin(Math.PI * t);
}

/**
 * Azimute solar aproximado (graus a partir do Norte, sentido horário).
 * Hemisfério sul: nasce a ~ENE (75°), passa pelo Norte ao meio-dia, põe-se a ~WNW (285°).
 */
export function azimuteSolarAprox(hora: number, latitude: number): number {
  const t = clamp((hora - HORA_INICIO) / (HORA_FIM - HORA_INICIO), 0, 1);
  const sul = latitude < 0;
  const amplitude = 105;
  // t=0 → leste, t=0.5 → norte (sul) ou sul (norte), t=1 → oeste
  const centro = sul ? 0 : 180;
  const az = centro + (sul ? -1 : 1) * amplitude * Math.cos(Math.PI * t) * -1;
  return (az + 360) % 360;
}

/** Diferença angular absoluta entre dois azimutes (0..180). */
function deltaAzimute(a: number, b: number): number {
  const d = Math.abs(((a - b + 540) % 360) - 180);
  return 180 - d;
}

/**
 * Irradiância incidente no plano vertical do vidro (W/m²), separada em direta e difusa.
 * Modelo simplificado: DNI × cos(incidência) + difusa de céu (metade do hemisfério) + reflexão do solo.
 */
export function irradianciaFachada(
  hora: number,
  orientacao: Orientacao,
  cidade: Cidade,
  mes: number,
): { direta: number; difusa: number; total: number } {
  const alt = alturaSolarAprox(hora, cidade.latitude);
  if (alt <= 0) return { direta: 0, difusa: 0, total: 0 };

  const fatorMes = MES_FATOR[clamp(Math.round(mes) - 1, 0, 11)] ?? 1;
  const senoAlt = Math.sin(rad(alt));
  const dni = cidade.dniPicoWm2 * fatorMes * senoAlt;
  const difusaHoriz = cidade.difusaPicoWm2 * fatorMes * senoAlt;

  const azSol = azimuteSolarAprox(hora, cidade.latitude);
  const azFach = ORIENTACAO_AZIMUTE[orientacao];
  const delta = deltaAzimute(azSol, azFach);

  const cosInc = Math.cos(rad(alt)) * Math.cos(rad(delta));
  const direta = cosInc > 0 ? dni * cosInc : 0;

  // Difusa em superfície vertical: metade da abóbada + reflexão do solo (albedo 0,2).
  const difusa = difusaHoriz * 0.5 + (dni * senoAlt + difusaHoriz) * 0.5 * 0.2;

  return { direta: round(direta, 1), difusa: round(difusa, 1), total: round(direta + difusa, 1) };
}

/**
 * Redução da componente direta pelas proteções externas na hora informada (0..1).
 * Beiral e brise horizontal são eficazes com sol alto; brise vertical, com sol rasante.
 */
export function reducaoProtecoes(
  protecoes: Protecoes,
  alturaJanelaM: number,
  alturaSolarDeg: number,
  deltaAzimuteDeg: number,
): number {
  const h = Math.max(alturaJanelaM, 0.3);
  const fatorSolAlto = clamp(alturaSolarDeg / 75, 0, 1);
  const fatorSolRasante = 1 - fatorSolAlto;

  const beiral = clamp((protecoes.beiralM / h) * 0.6, 0, 0.85) * fatorSolAlto;
  const briseH = clamp((protecoes.briseHorizM / h) * 0.75, 0, 0.85) * fatorSolAlto;
  const oblicuidade = clamp(deltaAzimuteDeg / 90, 0, 1);
  const briseV = clamp((protecoes.briseVertM / h) * 0.9, 0, 0.8) * (0.4 + 0.6 * fatorSolRasante) * (0.4 + 0.6 * oblicuidade);
  const persiana = PERSIANA_REDUCAO[protecoes.persiana];

  // Combinação multiplicativa das transmissões remanescentes.
  const restante = (1 - beiral) * (1 - briseH) * (1 - briseV) * (1 - persiana);
  return clamp(1 - restante, 0, 0.95);
}

/** Fator geométrico da abertura em relação à profundidade do ambiente. */
export function geometricFactor(
  larguraJanelaM: number,
  alturaJanelaM: number,
  profundidadeM: number,
  areaAmbienteM2: number,
): number {
  const depth = Math.max(profundidadeM, 0.5);
  const area = Math.max(areaAmbienteM2, 1);
  return clamp(0.8 * (alturaJanelaM / depth) * (larguraJanelaM / Math.sqrt(area)), 0.05, 1);
}

/** Daylight Factor simplificado (%): 100 × Tv × (Aw/Aroom) × GF × MF × obstrução × albedo. */
export function calcDaylightFactor(input: AmbienteInput): {
  areaVidroM2: number;
  tvEfetivo: number;
  gf: number;
  dfPct: number;
} {
  const areaVidroM2 = round(input.larguraJanelaM * input.alturaJanelaM, 3);
  const tvEfetivo = round(VIDRO_TV[input.vidro] * PELICULA_FATOR[input.protecoes.pelicula], 3);
  const gf = geometricFactor(
    input.larguraJanelaM,
    input.alturaJanelaM,
    input.profundidadeM,
    input.areaAmbienteM2,
  );
  const dfPct =
    100 *
    tvEfetivo *
    (areaVidroM2 / Math.max(input.areaAmbienteM2, 1)) *
    gf *
    MAINTENANCE_FACTOR *
    OBSTRUCAO_FATOR[input.obstrucao] *
    ALBEDO_FATOR[input.albedo];

  return { areaVidroM2, tvEfetivo, gf: round(gf, 3), dfPct: round(dfPct, 2) };
}

function nivelRisco(glareWm2: number): RiscoNivel {
  if (glareWm2 >= GLARE_ALTO_WM2) return "alto";
  if (glareWm2 >= GLARE_MEDIO_WM2) return "medio";
  return "baixo";
}

function piorRisco(a: RiscoNivel, b: RiscoNivel): RiscoNivel {
  const ordem: RiscoNivel[] = ["baixo", "medio", "alto"];
  return ordem.indexOf(a) >= ordem.indexOf(b) ? a : b;
}

function statusAlvo(eLux: number, target: number): StatusAlvo {
  if (eLux >= target) return "ok";
  if (eLux >= target * 0.6) return "atencao";
  return "insuficiente";
}

export const STATUS_LABEL: Record<StatusAlvo, string> = {
  ok: "Atende o alvo",
  atencao: "Atenção — próximo do limite",
  insuficiente: "Não atende o alvo",
};

export const RISCO_LABEL: Record<RiscoNivel, string> = {
  baixo: "Baixo",
  medio: "Médio",
  alto: "Alto",
};

/** Iluminância interna estimada pela componente de irradiância incidente. */
export function calcInsideIlluminance(
  irradianciaLiquidaWm2: number,
  areaVidroM2: number,
  areaAmbienteM2: number,
  tvEfetivo: number,
  albedo: Albedo,
  obstrucao: Obstrucao,
): number {
  const e =
    (tvEfetivo * areaVidroM2 * irradianciaLiquidaWm2 * LUX_POR_WM2) /
    Math.max(areaAmbienteM2, 1);
  return round(
    e * MAINTENANCE_FACTOR * ALBEDO_FATOR[albedo] * OBSTRUCAO_FATOR[obstrucao],
    0,
  );
}

function labelFaixa(f: Faixa) {
  const fmt = (h: number) => `${String(Math.floor(h)).padStart(2, "0")}:00`;
  return `${fmt(f.inicio)}–${fmt(f.fim)}`;
}

/** Sugestões de proteção ordenadas por eficácia estimada no período crítico. */
export function suggestProtection(
  input: AmbienteInput,
  riscoMax: RiscoNivel,
  dfPct: number,
): RecomendacaoProtecao[] {
  const recs: RecomendacaoProtecao[] = [];
  const h = Math.max(input.alturaJanelaM, 0.3);
  const orientacaoOeste = ["O", "NO", "SO"].includes(input.orientacao);
  const orientacaoLeste = ["L", "NE", "SE"].includes(input.orientacao);

  if (riscoMax === "baixo" && dfPct >= 2) {
    recs.push({
      titulo: "Nenhuma proteção adicional obrigatória",
      reducaoDiretaPct: 0,
      impactoDFPct: 0,
      justificativa:
        "Irradiância direta incidente baixa no período analisado e daylight factor adequado. Reavalie se houver mudança de uso ou de entorno.",
    });
  }

  if (input.protecoes.beiralM <= 0) {
    const d = round(h * 0.5, 2);
    recs.push({
      titulo: `Beiral de ${d.toFixed(2)} m`,
      reducaoDiretaPct: round(clamp((d / h) * 60, 0, 85), 0),
      impactoDFPct: round(-clamp((d / h) * 12, 0, 20), 0),
      justificativa:
        "Bloqueia o sol alto (10h–14h) com perda pequena de luz difusa. Muito eficaz em fachadas voltadas para o Norte no hemisfério sul.",
    });
  }

  if (input.protecoes.briseHorizM <= 0 && !orientacaoOeste) {
    const d = round(h * 0.35, 2);
    recs.push({
      titulo: `Brise horizontal de ${d.toFixed(2)} m`,
      reducaoDiretaPct: round(clamp((d / h) * 75, 0, 85), 0),
      impactoDFPct: round(-clamp((d / h) * 18, 0, 25), 0),
      justificativa:
        "Aletas horizontais cortam raios de alta altitude mantendo a visão para fora. Indicado para fachadas Norte e Sul.",
    });
  }

  if (input.protecoes.briseVertM <= 0 && (orientacaoOeste || orientacaoLeste)) {
    const d = round(h * 0.3, 2);
    recs.push({
      titulo: `Brise vertical de ${d.toFixed(2)} m`,
      reducaoDiretaPct: round(clamp((d / h) * 90, 0, 80), 0),
      impactoDFPct: round(-clamp((d / h) * 20, 0, 28), 0),
      justificativa:
        "Sol rasante de manhã (Leste) e de tarde (Oeste) só é interceptado por elementos verticais; beirais têm pouco efeito nesses horários.",
    });
  }

  if (input.protecoes.pelicula === "nenhuma" && riscoMax !== "baixo") {
    recs.push({
      titulo: "Película de controle solar (média)",
      reducaoDiretaPct: 30,
      impactoDFPct: -30,
      justificativa:
        "Reduz igualmente ganho térmico e luz natural em todos os horários. Use como complemento quando não houver espaço para sombreamento externo.",
    });
  }

  if (input.protecoes.persiana === "nenhuma") {
    recs.push({
      titulo: "Persiana interna regulável",
      reducaoDiretaPct: 40,
      impactoDFPct: -15,
      justificativa:
        "Controle pontual de ofuscamento operado pelo usuário. Menos eficiente contra ganho térmico, pois o calor já entrou pelo vidro.",
    });
  }

  return recs.sort((a, b) => b.reducaoDiretaPct - a.reducaoDiretaPct).slice(0, 5);
}

export function calcAmbiente(input: AmbienteInput): AmbienteResult {
  const cidade = getCidade(input.cidadeId);
  const { areaVidroM2, tvEfetivo, gf, dfPct } = calcDaylightFactor(input);

  const eInsideDFLux = round((dfPct * cidade.ceuEncobertoLux) / 100, 0);

  const horas: HoraResult[] = [];
  for (let hora = HORA_INICIO; hora <= HORA_FIM; hora++) {
    const irr = irradianciaFachada(hora, input.orientacao, cidade, input.mes);
    const alt = alturaSolarAprox(hora, cidade.latitude);
    const delta = deltaAzimute(azimuteSolarAprox(hora, cidade.latitude), ORIENTACAO_AZIMUTE[input.orientacao]);
    const reducao = reducaoProtecoes(input.protecoes, input.alturaJanelaM, alt, delta);
    const diretaLiquida = irr.direta * (1 - reducao);
    const total = diretaLiquida + irr.difusa;
    const eInsideLux = calcInsideIlluminance(
      total,
      areaVidroM2,
      input.areaAmbienteM2,
      tvEfetivo,
      input.albedo,
      input.obstrucao,
    );
    const glareWm2 = round(diretaLiquida * tvEfetivo, 1);
    horas.push({
      hora,
      irradianciaWm2: round(total, 1),
      irradianciaDiretaWm2: round(diretaLiquida, 1),
      irradianciaDifusaWm2: irr.difusa,
      reducaoProtecao: round(reducao, 3),
      eInsideLux,
      glareWm2,
      risco: nivelRisco(glareWm2),
    });
  }

  const faixas: FaixaResult[] = input.faixas.map((faixa) => {
    const dentro = horas.filter((h) => h.hora >= faixa.inicio && h.hora <= faixa.fim);
    const usadas = dentro.length > 0 ? dentro : horas;
    const eMediaLux = round(usadas.reduce((s, h) => s + h.eInsideLux, 0) / usadas.length, 0);
    const ePicoLux = usadas.reduce((s, h) => Math.max(s, h.eInsideLux), 0);
    const somaDireta = usadas.reduce((s, h) => s + h.irradianciaDiretaWm2, 0);
    const somaTotal = usadas.reduce((s, h) => s + h.irradianciaWm2, 0) || 1;
    const risco = usadas.reduce<RiscoNivel>((r, h) => piorRisco(r, h.risco), "baixo");
    return {
      faixa,
      label: labelFaixa(faixa),
      horas: usadas,
      eMediaLux,
      ePicoLux,
      percentualDireta: round((somaDireta / somaTotal) * 100, 1),
      percentualDifusa: round(100 - (somaDireta / somaTotal) * 100, 1),
      risco,
      status: statusAlvo(eMediaLux, input.targetLux),
    };
  });

  const eMediaLux =
    faixas.length > 0
      ? round(faixas.reduce((s, f) => s + f.eMediaLux, 0) / faixas.length, 0)
      : 0;
  const risco = faixas.reduce<RiscoNivel>((r, f) => piorRisco(r, f.risco), "baixo");

  const alertas: string[] = [];
  if (dfPct < 1)
    alertas.push(
      "Daylight factor abaixo de 1%: ambiente dependerá de iluminação artificial na maior parte do dia.",
    );
  else if (dfPct < 2)
    alertas.push(
      "Daylight factor entre 1% e 2%: aceitável para uso residencial, insuficiente para trabalho prolongado.",
    );
  if (dfPct > 6)
    alertas.push(
      "Daylight factor acima de 6%: alta probabilidade de ofuscamento e ganho térmico excessivo — prever sombreamento.",
    );
  if (input.profundidadeM > 2.5 * input.peDireitoM)
    alertas.push(
      "Profundidade maior que 2,5 × pé-direito: o fundo do ambiente dificilmente receberá luz natural útil.",
    );
  if (risco === "alto")
    alertas.push("Risco alto de ofuscamento em pelo menos uma faixa horária analisada.");

  const passos = [
    `Área de vidro = ${input.larguraJanelaM} × ${input.alturaJanelaM} = ${areaVidroM2.toFixed(2)} m²`,
    `Tv efetivo = ${VIDRO_TV[input.vidro]} × ${PELICULA_FATOR[input.protecoes.pelicula]} (película) = ${tvEfetivo}`,
    `GF = min(1; 0,8 × (${input.alturaJanelaM}/${input.profundidadeM}) × (${input.larguraJanelaM}/√${input.areaAmbienteM2})) = ${gf}`,
    `DF = 100 × ${tvEfetivo} × (${areaVidroM2.toFixed(2)}/${input.areaAmbienteM2}) × ${gf} × ${MAINTENANCE_FACTOR} × ${OBSTRUCAO_FATOR[input.obstrucao]} × ${ALBEDO_FATOR[input.albedo]} = ${dfPct}%`,
    `E_interna (DF) = ${dfPct}% × ${cidade.ceuEncobertoLux} lux / 100 = ${eInsideDFLux} lux`,
    `E_interna (irradiância) = Tv × A_vidro × I × ${LUX_POR_WM2} / A_ambiente, hora a hora`,
  ];

  return {
    input,
    cidade,
    areaVidroM2,
    tvEfetivo,
    geometricFactor: gf,
    daylightFactorPct: dfPct,
    eInsideDFLux,
    eMediaLux,
    status: statusAlvo(eMediaLux, input.targetLux),
    risco,
    faixas,
    horas,
    recomendacoes: suggestProtection(input, risco, dfPct),
    alertas,
    passos,
  };
}

export function calcIluminacao(ambientes: AmbienteInput[]): IluminacaoResult {
  const resultados = ambientes.map(calcAmbiente);
  const alertas = Array.from(new Set(resultados.flatMap((r) => r.alertas)));
  return { ambientes: resultados, alertas };
}

export function validarAmbiente(a: AmbienteInput): string | null {
  if (!(a.larguraJanelaM > 0) || a.larguraJanelaM > LIMITES.janelaMaxM)
    return `${a.nome}: largura da janela deve estar entre 0 e ${LIMITES.janelaMaxM} m.`;
  if (!(a.alturaJanelaM > 0) || a.alturaJanelaM > LIMITES.janelaMaxM)
    return `${a.nome}: altura da janela deve estar entre 0 e ${LIMITES.janelaMaxM} m.`;
  if (!(a.areaAmbienteM2 > 0) || a.areaAmbienteM2 > LIMITES.areaAmbienteMaxM2)
    return `${a.nome}: área do ambiente deve estar entre 0 e ${LIMITES.areaAmbienteMaxM2} m².`;
  if (!(a.profundidadeM > 0) || a.profundidadeM > LIMITES.profundidadeMaxM)
    return `${a.nome}: profundidade deve estar entre 0 e ${LIMITES.profundidadeMaxM} m.`;
  if (!(a.peDireitoM > 0) || a.peDireitoM > LIMITES.peDireitoMaxM)
    return `${a.nome}: pé-direito deve estar entre 0 e ${LIMITES.peDireitoMaxM} m.`;
  if (a.larguraJanelaM * a.alturaJanelaM > a.areaAmbienteM2)
    return `${a.nome}: a área de vidro não pode ser maior que a área do ambiente.`;
  if (!(a.targetLux > 0)) return `${a.nome}: informe uma iluminância alvo maior que zero.`;
  if (a.faixas.length === 0) return `${a.nome}: adicione ao menos uma faixa horária.`;
  if (a.faixas.some((f) => f.fim <= f.inicio))
    return `${a.nome}: cada faixa horária deve terminar depois de começar.`;
  return null;
}

export function toCSVIluminacao(result: IluminacaoResult): string {
  const header = [
    "id",
    "ambiente",
    "orientacao",
    "cidade",
    "hora_inicio",
    "hora_fim",
    "df_percent",
    "tv_efetivo",
    "e_inside_lux_medio",
    "e_inside_lux_pico",
    "percentual_direta",
    "risco_ofuscamento",
    "status_alvo",
  ].join(",");

  const linhas = result.ambientes.flatMap((a) =>
    a.faixas.map((f) =>
      [
        a.input.id,
        `"${a.input.nome.replace(/"/g, "'")}"`,
        a.input.orientacao,
        `"${a.cidade.nome}"`,
        f.faixa.inicio,
        f.faixa.fim,
        a.daylightFactorPct,
        a.tvEfetivo,
        f.eMediaLux,
        f.ePicoLux,
        f.percentualDireta,
        f.risco,
        f.status,
      ].join(","),
    ),
  );

  return [header, ...linhas].join("\n");
}
