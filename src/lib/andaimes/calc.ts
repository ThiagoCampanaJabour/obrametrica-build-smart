// Motor puro de quantificação de andaimes e escoras.
// Todas as funções são puras, determinísticas e testáveis (sem I/O, sem Date/Math.random).

export type SistemaAndaime = "tubular-fachada" | "multidirecional" | "escora-metalica" | "escora-madeira";

export type CargaTrabalho = "leve" | "media" | "pesada";

export const SISTEMA_LABEL: Record<SistemaAndaime, string> = {
  "tubular-fachada": "Andaime modular tubular (fachada)",
  multidirecional: "Andaime multidirecional",
  "escora-metalica": "Escoramento metálico",
  "escora-madeira": "Escoramento em madeira",
};

export const CARGA_LABEL: Record<CargaTrabalho, string> = {
  leve: "Leve — pintura, limpeza, inspeção",
  media: "Média — revestimento, reboco, instalações",
  pesada: "Pesada — alvenaria, estrutural, içamento",
};

/** Fator multiplicador de peças complementares por carga de trabalho. */
export const CARGA_FATOR: Record<CargaTrabalho, number> = {
  leve: 1,
  media: 1.15,
  pesada: 1.3,
};

export type Preset = {
  id: SistemaAndaime;
  /** Largura comercial do módulo (m). */
  moduleWidthM: number;
  /** Profundidade útil da plataforma (m). */
  platformDepthM: number;
  /** Espaçamento vertical entre plataformas (m). */
  spacingVerticalM: number;
  /** Área da plataforma/painel comercial (m²) para conversão em peças. */
  platformPanelAreaM2: number;
  /** Diagonais por módulo. */
  diagonaisPorModulo: number;
  /** Guarda-corpos por módulo (borda externa + laterais). */
  guardaCorpoPorModulo: number;
  /** Sapatas/rodízios por módulo do nível térreo. */
  sapatasPorModuloBase: number;
  /** Travessas/travamentos horizontais por módulo. */
  travessasPorModulo: number;
  /** Ancoragens à estrutura a cada N m² de fachada. */
  ancoragemCadaM2: number;
  /** Escoras por m² de laje escorada (apenas sistemas de escoramento). */
  escorasPorM2: number;
  /** Altura (m) acima da qual é exigido projeto/engenheiro. */
  alturaProjetoM: number;
  /** Peso médio por módulo montado (kg) — logística. */
  pesoModuloKg: number;
  escoramento: boolean;
};

export const PRESETS: Record<SistemaAndaime, Preset> = {
  "tubular-fachada": {
    id: "tubular-fachada",
    moduleWidthM: 2.0,
    platformDepthM: 0.75,
    spacingVerticalM: 2.0,
    platformPanelAreaM2: 1.5,
    diagonaisPorModulo: 0.6,
    guardaCorpoPorModulo: 1,
    sapatasPorModuloBase: 2,
    travessasPorModulo: 2,
    ancoragemCadaM2: 12,
    escorasPorM2: 0,
    alturaProjetoM: 12,
    pesoModuloKg: 45,
    escoramento: false,
  },
  multidirecional: {
    id: "multidirecional",
    moduleWidthM: 1.5,
    platformDepthM: 0.9,
    spacingVerticalM: 2.0,
    platformPanelAreaM2: 1.35,
    diagonaisPorModulo: 0.8,
    guardaCorpoPorModulo: 1,
    sapatasPorModuloBase: 2,
    travessasPorModulo: 3,
    ancoragemCadaM2: 10,
    escorasPorM2: 0,
    alturaProjetoM: 12,
    pesoModuloKg: 52,
    escoramento: false,
  },
  "escora-metalica": {
    id: "escora-metalica",
    moduleWidthM: 1.0,
    platformDepthM: 1.0,
    spacingVerticalM: 3.0,
    platformPanelAreaM2: 2.0,
    diagonaisPorModulo: 0.3,
    guardaCorpoPorModulo: 0,
    sapatasPorModuloBase: 1,
    travessasPorModulo: 1,
    ancoragemCadaM2: 0,
    escorasPorM2: 0.7,
    alturaProjetoM: 6,
    pesoModuloKg: 14,
    escoramento: true,
  },
  "escora-madeira": {
    id: "escora-madeira",
    moduleWidthM: 1.0,
    platformDepthM: 1.0,
    spacingVerticalM: 3.0,
    platformPanelAreaM2: 2.0,
    diagonaisPorModulo: 0.4,
    guardaCorpoPorModulo: 0,
    sapatasPorModuloBase: 1,
    travessasPorModulo: 1,
    ancoragemCadaM2: 0,
    escorasPorM2: 1.0,
    alturaProjetoM: 4,
    pesoModuloKg: 9,
    escoramento: true,
  },
};

export type TrechoInput = {
  id: string;
  nome: string;
  larguraM: number;
  alturaM: number;
  carga: CargaTrabalho;
  sistema: SistemaAndaime;
  /** Overrides opcionais dos presets. */
  moduleWidthM?: number;
  platformDepthM?: number;
  spacingVerticalM?: number;
  acessos?: number;
  margemPct?: number;
};

export type ItemLista = {
  item: string;
  unidade: string;
  quantidade: number;
  obs: string;
};

export type TrechoResult = {
  input: TrechoInput;
  preset: Preset;
  moduleWidthM: number;
  platformDepthM: number;
  spacingVerticalM: number;
  margemPct: number;
  areaFachadaM2: number;
  niveis: number;
  modulosPorNivel: number;
  modulosTotal: number;
  areaPlataformaM2: number;
  plataformas: number;
  diagonais: number;
  guardaCorpos: number;
  sapatas: number;
  travessas: number;
  ancoragens: number;
  escoras: number;
  escadas: number;
  pesoTotalKg: number;
  itens: ItemLista[];
  alertas: string[];
  passos: string[];
};

export type QuantAndaimesResult = {
  trechos: TrechoResult[];
  totais: {
    areaFachadaM2: number;
    modulosTotal: number;
    areaPlataformaM2: number;
    plataformas: number;
    diagonais: number;
    guardaCorpos: number;
    sapatas: number;
    travessas: number;
    ancoragens: number;
    escoras: number;
    escadas: number;
    pesoTotalKg: number;
  };
  itens: ItemLista[];
  alertas: string[];
};

export const LIMITES = { larguraMaxM: 100, alturaMaxM: 200, margemMaxPct: 100 } as const;

const round = (v: number, casas = 2) => {
  const f = 10 ** casas;
  return Math.round((v + Number.EPSILON) * f) / f;
};

const positivo = (v: number | undefined, fallback: number) =>
  typeof v === "number" && Number.isFinite(v) && v > 0 ? v : fallback;

/** Aplica margem de segurança e arredonda para cima. */
export function comMargem(qtdBase: number, margemPct: number): number {
  if (!(qtdBase > 0)) return 0;
  return Math.ceil(qtdBase * (1 + margemPct / 100));
}

export function validarTrecho(t: TrechoInput): string | null {
  if (!(t.larguraM > 0) || t.larguraM > LIMITES.larguraMaxM)
    return `"${t.nome}": largura deve estar entre 0 e ${LIMITES.larguraMaxM} m.`;
  if (!(t.alturaM > 0) || t.alturaM > LIMITES.alturaMaxM)
    return `"${t.nome}": altura deve estar entre 0 e ${LIMITES.alturaMaxM} m.`;
  return null;
}

export function calcTrecho(input: TrechoInput): TrechoResult {
  const preset = PRESETS[input.sistema];
  const moduleWidthM = positivo(input.moduleWidthM, preset.moduleWidthM);
  const platformDepthM = positivo(input.platformDepthM, preset.platformDepthM);
  const spacingVerticalM = positivo(input.spacingVerticalM, preset.spacingVerticalM);
  const margemPct = Math.min(
    Math.max(typeof input.margemPct === "number" ? input.margemPct : 10, 0),
    LIMITES.margemMaxPct,
  );
  const fatorCarga = CARGA_FATOR[input.carga];

  const areaFachadaM2 = round(input.larguraM * input.alturaM);
  const niveis = Math.ceil(input.alturaM / spacingVerticalM);
  const modulosPorNivel = Math.ceil(input.larguraM / moduleWidthM);
  const modulosBase = niveis * modulosPorNivel;
  const modulosTotal = comMargem(modulosBase, margemPct);

  const areaPlataformaM2 = round(modulosBase * moduleWidthM * platformDepthM);
  const plataformas = comMargem(areaPlataformaM2 / preset.platformPanelAreaM2, margemPct);

  const diagonais = comMargem(modulosBase * preset.diagonaisPorModulo * fatorCarga, margemPct);
  const guardaCorpos = comMargem(modulosBase * preset.guardaCorpoPorModulo, margemPct);
  const sapatasBase =
    modulosPorNivel * preset.sapatasPorModuloBase + (input.larguraM > 4 ? Math.floor(input.larguraM / 4) : 0);
  const sapatas = comMargem(sapatasBase, margemPct);
  const travessas = comMargem(modulosBase * preset.travessasPorModulo * fatorCarga, margemPct);
  const ancoragens =
    preset.ancoragemCadaM2 > 0 ? comMargem(areaFachadaM2 / preset.ancoragemCadaM2, margemPct) : 0;
  const escoras = preset.escoramento
    ? comMargem(areaFachadaM2 * preset.escorasPorM2 * fatorCarga, margemPct)
    : 0;
  const escadas = Math.max(input.acessos ?? 0, preset.escoramento ? 0 : niveis > 1 ? 1 : 0);
  const pesoTotalKg = round(modulosTotal * preset.pesoModuloKg, 1);

  const alertas: string[] = [];
  if (input.alturaM >= preset.alturaProjetoM)
    alertas.push(
      `Altura de ${input.alturaM} m atinge o limite de ${preset.alturaProjetoM} m do sistema: exige projeto de montagem assinado por engenheiro e verificação de ancoragens e vento.`,
    );
  if (input.carga === "pesada")
    alertas.push(
      "Carga de trabalho pesada: verifique a capacidade das plataformas e considere reforço estrutural ou consulta técnica.",
    );
  if (moduleWidthM > 4)
    alertas.push("Vão de módulo acima de 4 m: utilize suportes/apoios intermediários.");
  if (niveis > 6)
    alertas.push(`${niveis} níveis previstos: obrigatória a instalação de acessos internos e linha de vida.`);

  const itens: ItemLista[] = [
    { item: "Módulo de andaime", unidade: "un", quantidade: modulosTotal, obs: `${moduleWidthM} m × ${spacingVerticalM} m` },
    { item: "Plataforma / prancha", unidade: "un", quantidade: plataformas, obs: `painel de ${preset.platformPanelAreaM2} m²` },
    { item: "Área de plataforma", unidade: "m²", quantidade: areaPlataformaM2, obs: `profundidade ${platformDepthM} m` },
    { item: "Diagonal", unidade: "un", quantidade: diagonais, obs: "contraventamento" },
    { item: "Guarda-corpo", unidade: "un", quantidade: guardaCorpos, obs: "borda externa e laterais" },
    { item: "Sapata / rodízio", unidade: "un", quantidade: sapatas, obs: "base nivelada" },
    { item: "Travessa horizontal", unidade: "un", quantidade: travessas, obs: "travamento" },
    { item: "Ancoragem à estrutura", unidade: "un", quantidade: ancoragens, obs: `1 a cada ${preset.ancoragemCadaM2 || "-"} m²` },
    { item: "Escora", unidade: "un", quantidade: escoras, obs: preset.escoramento ? "escoramento de laje/viga" : "não aplicável" },
    { item: "Escada / acesso", unidade: "un", quantidade: escadas, obs: "troca de nível" },
  ].filter((i) => i.quantidade > 0);

  const passos = [
    `Área da fachada = ${input.larguraM} × ${input.alturaM} = ${areaFachadaM2} m²`,
    `Níveis = teto(${input.alturaM} ÷ ${spacingVerticalM}) = ${niveis}`,
    `Módulos por nível = teto(${input.larguraM} ÷ ${moduleWidthM}) = ${modulosPorNivel}`,
    `Módulos base = ${niveis} × ${modulosPorNivel} = ${modulosBase}`,
    `Margem de segurança de ${margemPct}% → ${modulosTotal} módulos`,
    `Área de plataforma = ${modulosBase} × ${moduleWidthM} × ${platformDepthM} = ${areaPlataformaM2} m²`,
    `Fator de carga (${CARGA_LABEL[input.carga].split(" —")[0]}) = ${fatorCarga}× nas peças de travamento`,
  ];

  return {
    input,
    preset,
    moduleWidthM,
    platformDepthM,
    spacingVerticalM,
    margemPct,
    areaFachadaM2,
    niveis,
    modulosPorNivel,
    modulosTotal,
    areaPlataformaM2,
    plataformas,
    diagonais,
    guardaCorpos,
    sapatas,
    travessas,
    ancoragens,
    escoras,
    escadas,
    pesoTotalKg,
    itens,
    alertas,
    passos,
  };
}

export function calcAndaimes(trechos: TrechoInput[]): QuantAndaimesResult {
  const res = trechos.map(calcTrecho);
  const soma = (f: (t: TrechoResult) => number) => res.reduce((a, t) => a + f(t), 0);

  const totais = {
    areaFachadaM2: round(soma((t) => t.areaFachadaM2)),
    modulosTotal: soma((t) => t.modulosTotal),
    areaPlataformaM2: round(soma((t) => t.areaPlataformaM2)),
    plataformas: soma((t) => t.plataformas),
    diagonais: soma((t) => t.diagonais),
    guardaCorpos: soma((t) => t.guardaCorpos),
    sapatas: soma((t) => t.sapatas),
    travessas: soma((t) => t.travessas),
    ancoragens: soma((t) => t.ancoragens),
    escoras: soma((t) => t.escoras),
    escadas: soma((t) => t.escadas),
    pesoTotalKg: round(soma((t) => t.pesoTotalKg), 1),
  };

  const mapa = new Map<string, ItemLista>();
  for (const t of res) {
    for (const i of t.itens) {
      const chave = `${i.item}|${i.unidade}`;
      const atual = mapa.get(chave);
      if (atual) atual.quantidade = round(atual.quantidade + i.quantidade, 2);
      else mapa.set(chave, { ...i });
    }
  }

  const alertas = Array.from(new Set(res.flatMap((t) => t.alertas)));

  return { trechos: res, totais, itens: Array.from(mapa.values()), alertas };
}

export function toCSVAndaimes(r: QuantAndaimesResult): string {
  const rows: string[][] = [["trecho", "item", "unidade", "quantidade", "observacao"]];
  for (const t of r.trechos) {
    for (const i of t.itens) {
      rows.push([t.input.nome, i.item, i.unidade, String(i.quantidade), i.obs]);
    }
  }
  rows.push([]);
  rows.push(["TOTAL", "item", "unidade", "quantidade", "observacao"]);
  for (const i of r.itens) {
    rows.push(["TOTAL", i.item, i.unidade, String(i.quantidade), i.obs]);
  }
  rows.push([]);
  rows.push(["indicador", "valor"]);
  rows.push(["area_fachada_m2", String(r.totais.areaFachadaM2)]);
  rows.push(["modulos_total", String(r.totais.modulosTotal)]);
  rows.push(["area_plataforma_m2", String(r.totais.areaPlataformaM2)]);
  rows.push(["peso_total_kg", String(r.totais.pesoTotalKg)]);
  return rows.map((row) => row.join(";")).join("\n");
}
