// Motor puro de quantificação e corte de telhas/peças de assentamento.
// Todas as funções são puras e tolerantes a floats; quantidades finais em inteiros (ceil).

export type Layout = "alinhado" | "desloc50" | "desloc33" | "herringbone" | "livre";

export type TipoPeca =
  | "telha"
  | "piso-ceramico"
  | "porcelanato"
  | "revestimento-parede"
  | "placa-grande"
  | "livre";

export const LAYOUT_LABEL: Record<Layout, string> = {
  alinhado: "Alinhado (grid)",
  desloc50: "Deslocamento 50% (half-bond)",
  desloc33: "Deslocamento 33% (third-bond)",
  herringbone: "Espinha de peixe (herringbone)",
  livre: "Layout livre (perda manual)",
};

export const LAYOUT_DICA: Record<Layout, string> = {
  alinhado: "Menor desperdício. Juntas alinhadas nos dois eixos.",
  desloc50: "Cada fileira desloca meia peça. Perda ~2% maior que o alinhado.",
  desloc33: "Deslocamento de 1/3 da peça. Indicado para peças alongadas e placas grandes.",
  herringbone: "Padrão decorativo em 45°. Aumenta muito os cortes e a perda (15–25%).",
  livre: "Você informa manualmente o percentual de perda esperado.",
};

export const TIPO_LABEL: Record<TipoPeca, string> = {
  telha: "Telha cerâmica",
  "piso-ceramico": "Piso cerâmico",
  porcelanato: "Porcelanato",
  "revestimento-parede": "Revestimento de parede",
  "placa-grande": "Placa grande",
  livre: "Outro / livre",
};

/** Perda base (%) por tipo de peça — ver metodologia.md. */
export const PERDA_BASE_TIPO: Record<TipoPeca, number> = {
  telha: 7,
  "piso-ceramico": 8,
  porcelanato: 12,
  "revestimento-parede": 6,
  "placa-grande": 12,
  livre: 8,
};

/** Acréscimo de perda (pontos percentuais) por layout. */
export const PERDA_EXTRA_LAYOUT: Record<Layout, number> = {
  alinhado: 0,
  desloc50: 2,
  desloc33: 3,
  herringbone: 20,
  livre: 0,
};

/** Fração estimada de peças cortadas por layout (heurística de fallback). */
export const FRACAO_CORTES_LAYOUT: Record<Layout, number> = {
  alinhado: 0.2,
  desloc50: 0.3,
  desloc33: 0.32,
  herringbone: 0.45,
  livre: 0.25,
};

/** Quebra adicional no manuseio de telhas (pontos percentuais). */
export const QUEBRA_TELHA_PCT = 3;

/** Acréscimo para peças grandes (≥ 40×40 cm), em pontos percentuais. */
export const ACRESCIMO_PECA_GRANDE_PCT = 4;

export type Preset = {
  id: string;
  nome: string;
  tipo: TipoPeca;
  larguraMm: number;
  alturaMm: number;
};

export const PRESETS: Preset[] = [
  { id: "piso-20x20", nome: "Piso cerâmico 20×20 cm", tipo: "piso-ceramico", larguraMm: 200, alturaMm: 200 },
  { id: "piso-30x30", nome: "Piso cerâmico 30×30 cm", tipo: "piso-ceramico", larguraMm: 300, alturaMm: 300 },
  { id: "piso-40x40", nome: "Piso cerâmico 40×40 cm", tipo: "piso-ceramico", larguraMm: 400, alturaMm: 400 },
  { id: "porc-60x60", nome: "Porcelanato 60×60 cm", tipo: "porcelanato", larguraMm: 600, alturaMm: 600 },
  { id: "porc-80x80", nome: "Porcelanato 80×80 cm", tipo: "porcelanato", larguraMm: 800, alturaMm: 800 },
  { id: "porc-120x60", nome: "Porcelanato 120×60 cm", tipo: "placa-grande", larguraMm: 1200, alturaMm: 600 },
  { id: "rev-30x60", nome: "Revestimento parede 30×60 cm", tipo: "revestimento-parede", larguraMm: 300, alturaMm: 600 },
  { id: "rev-33x45", nome: "Revestimento parede 33×45 cm", tipo: "revestimento-parede", larguraMm: 330, alturaMm: 450 },
  { id: "telha-colonial", nome: "Telha colonial 450×200 mm", tipo: "telha", larguraMm: 450, alturaMm: 200 },
  { id: "telha-portuguesa", nome: "Telha portuguesa 420×330 mm", tipo: "telha", larguraMm: 420, alturaMm: 330 },
  { id: "telha-romana", nome: "Telha romana 420×250 mm", tipo: "telha", larguraMm: 420, alturaMm: 250 },
  { id: "telha-concreto", nome: "Telha de concreto 420×330 mm", tipo: "telha", larguraMm: 420, alturaMm: 330 },
];

export type QuantParams = {
  tipo: TipoPeca;
  larguraMm: number;
  alturaMm: number;
  areaM2: number;
  /** Dimensões do ambiente, opcionais — habilitam a estimativa de cortes por bordas. */
  comprimentoM?: number;
  larguraAmbienteM?: number;
  layout: Layout;
  /** Perda (%) — se omitida, usa o default calculado. */
  perdaPct?: number;
  margemPct: number;
  juntaMm: number;
  pecasReserva: number;
};

export type QuantResult = {
  inputs: QuantParams;
  areaPecaM2: number;
  areaPecaComJuntaM2: number;
  pecasBase: number;
  perdaPctUsada: number;
  perdaPctDefault: number;
  margemPct: number;
  pecasFinal: number;
  pecasReserva: number;
  pecasComprar: number;
  pecasInteiras: number;
  pecasCortadas: number;
  percentCortes: number;
  areaInteirasM2: number;
  areaCortesM2: number;
  pecasDescartadas: number;
  perdaTotalPct: number;
  fileiras?: number;
  colunas?: number;
  observacoes: string[];
  passos: string[];
};

const round = (n: number, d = 2) => Math.round(n * 10 ** d) / 10 ** d;

/** Área da peça em m² a partir das dimensões em mm. */
export function areaPiece_mm(pieceWmm: number, pieceHmm: number): number {
  if (pieceWmm <= 0 || pieceHmm <= 0) return 0;
  return (pieceWmm / 1000) * (pieceHmm / 1000);
}

/** Número de peças básicas para cobrir a área (sem perdas). */
export function piecesBase(areaM2: number, pieceAreaM2: number): number {
  if (areaM2 <= 0 || pieceAreaM2 <= 0) return 0;
  return Math.ceil(areaM2 / pieceAreaM2);
}

/** Aplica perda por corte e margem de segurança sobre a quantidade base. */
export function applyLoss(numBase: number, lossPct: number, marginPct: number): number {
  if (numBase <= 0) return 0;
  return Math.ceil(numBase * (1 + lossPct / 100) * (1 + marginPct / 100));
}

/** Perda default sugerida em função do tipo de peça, layout e tamanho. */
export function defaultLossPct(tipo: TipoPeca, layout: Layout, pieceAreaM2: number): number {
  let perda = PERDA_BASE_TIPO[tipo] + PERDA_EXTRA_LAYOUT[layout];
  if (pieceAreaM2 >= 0.16) perda += ACRESCIMO_PECA_GRANDE_PCT; // ≥ 40×40 cm
  if (tipo === "telha") perda += QUEBRA_TELHA_PCT;
  return round(perda, 1);
}

/**
 * Estimativa de cortes. Quando as dimensões do ambiente são conhecidas, conta as peças
 * de borda: n ≈ 2·(ceil(L/l) + ceil(W/w)). Caso contrário usa a heurística por layout.
 */
export function estimateCutsByLayout(
  areaM2: number,
  Lm: number | undefined,
  Wm: number | undefined,
  pieceWm: number,
  pieceHm: number,
  layout: Layout,
): {
  est_cuts: number;
  est_whole_pieces: number;
  percent_cuts: number;
  fileiras?: number;
  colunas?: number;
} {
  const pieceArea = pieceWm * pieceHm;
  const total = piecesBase(areaM2, pieceArea);
  if (total <= 0) return { est_cuts: 0, est_whole_pieces: 0, percent_cuts: 0 };

  let percent: number;
  let fileiras: number | undefined;
  let colunas: number | undefined;

  if (Lm && Wm && Lm > 0 && Wm > 0 && layout !== "herringbone") {
    colunas = Math.ceil(Lm / pieceWm);
    fileiras = Math.ceil(Wm / pieceHm);
    const gridTotal = colunas * fileiras;
    let borda = 2 * (colunas + fileiras) - 4;
    if (layout === "desloc50" || layout === "desloc33") borda += fileiras; // 1 corte extra por fileira
    percent = Math.min(0.95, Math.max(0, borda) / Math.max(1, gridTotal));
  } else {
    percent = FRACAO_CORTES_LAYOUT[layout];
  }

  const est_cuts = Math.min(total, Math.ceil(total * percent));
  return {
    est_cuts,
    est_whole_pieces: total - est_cuts,
    percent_cuts: round(percent * 100, 1),
    fileiras,
    colunas,
  };
}

/** Integra todas as etapas e devolve o payload completo. */
export function calcQuantification(params: QuantParams): QuantResult {
  const {
    tipo,
    larguraMm,
    alturaMm,
    areaM2,
    comprimentoM,
    larguraAmbienteM,
    layout,
    margemPct,
    juntaMm,
    pecasReserva,
  } = params;

  const areaPecaM2 = areaPiece_mm(larguraMm, alturaMm);
  const areaPecaComJuntaM2 = areaPiece_mm(larguraMm + juntaMm, alturaMm + juntaMm);
  const areaModulo = areaPecaComJuntaM2 > 0 ? areaPecaComJuntaM2 : areaPecaM2;

  const pecasBaseQtd = piecesBase(areaM2, areaModulo);
  const perdaPctDefault = defaultLossPct(tipo, layout, areaPecaM2);
  const perdaPctUsada =
    params.perdaPct !== undefined && Number.isFinite(params.perdaPct)
      ? params.perdaPct
      : perdaPctDefault;

  const pecasFinal = applyLoss(pecasBaseQtd, perdaPctUsada, margemPct);
  const pecasComprar = pecasFinal + Math.max(0, Math.round(pecasReserva));

  const cortes = estimateCutsByLayout(
    areaM2,
    comprimentoM,
    larguraAmbienteM,
    (larguraMm + juntaMm) / 1000,
    (alturaMm + juntaMm) / 1000,
    layout,
  );

  const areaInteirasM2 = round(cortes.est_whole_pieces * areaPecaM2, 2);
  const areaCortesM2 = round(Math.max(0, areaM2 - areaInteirasM2), 2);
  const pecasDescartadas = Math.max(0, pecasComprar - pecasBaseQtd);
  const perdaTotalPct = pecasBaseQtd > 0 ? round((pecasDescartadas / pecasBaseQtd) * 100, 1) : 0;

  const observacoes: string[] = [];
  if (areaPecaM2 >= 0.16)
    observacoes.push(
      "Peça grande (≥ 40×40 cm): cortes geram sobras maiores e exigem base bem nivelada — considere junta mínima de 2 mm e nivelador de piso.",
    );
  if (layout === "herringbone")
    observacoes.push(
      "O padrão espinha de peixe gera cortes em 45° nas bordas e eleva a perda para 15–25%. Compre com folga e teste o assentamento a seco.",
    );
  if (tipo === "telha")
    observacoes.push(
      "Telhas incluem 3% de quebra por manuseio. Confirme a área útil real com o fabricante — o recobrimento altera o consumo por m².",
    );
  if (layout === "desloc50" || layout === "desloc33")
    observacoes.push(
      "Layouts com deslocamento produzem um corte extra por fileira; aproveite a sobra do fim de uma fileira no início da seguinte.",
    );
  observacoes.push(
    "Resultado estimado: recomendamos comprar ao menos 5 peças de reserva do mesmo lote para reposições futuras.",
  );

  const passos = [
    `Área da peça = ${larguraMm} mm × ${alturaMm} mm = ${round(areaPecaM2, 4)} m²`,
    juntaMm > 0
      ? `Área do módulo com junta de ${juntaMm} mm = ${round(areaModulo, 4)} m²`
      : "Sem junta considerada no módulo.",
    `Peças base = teto(${round(areaM2, 2)} / ${round(areaModulo, 4)}) = ${pecasBaseQtd}`,
    `Perda aplicada = ${perdaPctUsada}% (default sugerido ${perdaPctDefault}%)`,
    `Margem de segurança = ${margemPct}%`,
    `Total = teto(${pecasBaseQtd} × ${round(1 + perdaPctUsada / 100, 3)} × ${round(1 + margemPct / 100, 3)}) = ${pecasFinal}`,
    pecasReserva > 0 ? `+ ${pecasReserva} peças de reserva = ${pecasComprar}` : `Total a comprar = ${pecasComprar}`,
  ];

  return {
    inputs: params,
    areaPecaM2: round(areaPecaM2, 4),
    areaPecaComJuntaM2: round(areaPecaComJuntaM2, 4),
    pecasBase: pecasBaseQtd,
    perdaPctUsada,
    perdaPctDefault,
    margemPct,
    pecasFinal,
    pecasReserva: Math.max(0, Math.round(pecasReserva)),
    pecasComprar,
    pecasInteiras: cortes.est_whole_pieces,
    pecasCortadas: cortes.est_cuts,
    percentCortes: cortes.percent_cuts,
    areaInteirasM2,
    areaCortesM2,
    pecasDescartadas,
    perdaTotalPct,
    fileiras: cortes.fileiras,
    colunas: cortes.colunas,
    observacoes,
    passos,
  };
}

/** CSV da lista de compra + detalhamento. */
export function toCSVTelhas(r: QuantResult): string {
  const rows: string[][] = [
    [
      "peca_id",
      "tipo",
      "comprimento_mm",
      "largura_mm",
      "area_m2",
      "num_pecas_base",
      "perda_pct",
      "margem_pct",
      "reserva",
      "num_final",
    ],
    [
      `${r.inputs.larguraMm}x${r.inputs.alturaMm}`,
      TIPO_LABEL[r.inputs.tipo],
      String(r.inputs.larguraMm),
      String(r.inputs.alturaMm),
      String(r.areaPecaM2),
      String(r.pecasBase),
      String(r.perdaPctUsada),
      String(r.margemPct),
      String(r.pecasReserva),
      String(r.pecasComprar),
    ],
    [],
    ["indicador", "valor"],
    ["layout", LAYOUT_LABEL[r.inputs.layout]],
    ["area_total_m2", String(r.inputs.areaM2)],
    ["pecas_inteiras", String(r.pecasInteiras)],
    ["pecas_cortadas", String(r.pecasCortadas)],
    ["percent_cortes", String(r.percentCortes)],
    ["area_inteiras_m2", String(r.areaInteirasM2)],
    ["area_cortes_m2", String(r.areaCortesM2)],
    ["pecas_descartadas", String(r.pecasDescartadas)],
    ["perda_total_pct", String(r.perdaTotalPct)],
  ];
  return rows.map((r2) => r2.join(";")).join("\n");
}
