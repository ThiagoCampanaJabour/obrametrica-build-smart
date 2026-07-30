// Dimensionamento preliminar de drenagem pluvial: calhas, ralos e condutos.
// ESTIMATIVA — não substitui projeto hidráulico (NBR 10844 / NBR 12218).

export type SuperficieTipo = "telha" | "laje" | "piso_permeavel" | "asfalto" | "gramado";

export type MaterialConduto = "pvc" | "pp" | "concreto" | "ferro";

export type Bacia = {
  id?: string;
  nome: string;
  areaM2: number;
  superficie: SuperficieTipo;
  /** Coeficiente de escoamento — se ausente, usa o padrão da superfície. */
  C?: number;
  inclinacaoPct?: number;
  /** Ponto de despejo — bacias com o mesmo destino são agrupadas em um trecho. */
  destino?: string;
};

export type BaciaResult = {
  id: string;
  nome: string;
  areaM2: number;
  superficie: SuperficieTipo;
  C: number;
  destino: string;
  vazaoM3s: number;
  vazaoLs: number;
  warnings: string[];
};

export type TrechoResult = {
  destino: string;
  bacias: string[];
  areaM2: number;
  vazaoM3s: number;
  vazaoLs: number;
  tubo: PipeSuggestion;
  calha: GutterSuggestion;
  ralos: RaloSuggestion;
  warnings: string[];
};

export type PipeSuggestion = {
  diametroMm: number | null;
  velocidadeMs: number;
  capacidadeCheiaM3s: number;
  declividadeFracao: number;
  material: MaterialConduto;
  manningN: number;
  warning?: string;
};

export type GutterSuggestion = {
  forma: "retangular" | "semicircular";
  larguraMm: number;
  alturaMm: number;
  areaM2: number;
  velocidadeMs: number;
  warning?: string;
};

export type RaloSuggestion = {
  quantidade: number;
  capacidadeUnitariaLs: number;
  warning?: string;
};

/** Coeficientes de escoamento (runoff) por tipo de superfície. */
export const COEF_ESCOAMENTO: Record<SuperficieTipo, number> = {
  telha: 0.9,
  laje: 0.95,
  piso_permeavel: 0.5,
  asfalto: 0.9,
  gramado: 0.2,
};

export const SUPERFICIE_LABEL: Record<SuperficieTipo, string> = {
  telha: "Telhado de telha (C 0,90)",
  laje: "Laje impermeabilizada (C 0,95)",
  piso_permeavel: "Piso permeável (C 0,50)",
  asfalto: "Asfalto / concreto (C 0,90)",
  gramado: "Gramado / jardim (C 0,20)",
};

/** Coeficiente de Manning por material. */
export const MANNING_N: Record<MaterialConduto, number> = {
  pvc: 0.009,
  pp: 0.01,
  concreto: 0.013,
  ferro: 0.012,
};

export const MATERIAL_LABEL: Record<MaterialConduto, string> = {
  pvc: "PVC (n 0,009)",
  pp: "PP corrugado (n 0,010)",
  concreto: "Concreto liso (n 0,013)",
  ferro: "Ferro fundido (n 0,012)",
};

/** Diâmetros comerciais internos aproximados (mm). */
export const DIAMETROS_COMERCIAIS_MM = [
  50, 75, 100, 125, 150, 200, 250, 300, 400, 500, 600, 800, 1000,
];

/** Larguras comerciais de calha (mm). */
export const LARGURAS_CALHA_MM = [100, 125, 150, 200, 250, 300, 400, 500, 600];

export const V_MIN_MS = 0.6; // abaixo disso há risco de sedimentação
export const V_MAX_MS = 3.0;
export const V_DESIGN_MS = 1.0;

/** Capacidade típica de grelha/ralo (L/s) — valor de referência. */
export const CAPACIDADE_RALO_LS = 1.5;

/** Intensidades de chuva de projeto (mm/h) por cidade e duração (min). */
export const INTENSIDADES: Record<string, Record<number, number>> = {
  "São Paulo": { 5: 180, 10: 150, 15: 130, 30: 95, 60: 65 },
  "Rio de Janeiro": { 5: 195, 10: 160, 15: 138, 30: 100, 60: 70 },
  "Belo Horizonte": { 5: 185, 10: 152, 15: 132, 30: 96, 60: 66 },
  Curitiba: { 5: 160, 10: 132, 15: 114, 30: 82, 60: 56 },
  "Porto Alegre": { 5: 165, 10: 136, 15: 118, 30: 86, 60: 60 },
  Brasília: { 5: 175, 10: 145, 15: 125, 30: 90, 60: 62 },
  Salvador: { 5: 150, 10: 125, 15: 108, 30: 80, 60: 56 },
  Recife: { 5: 155, 10: 130, 15: 112, 30: 84, 60: 60 },
  Fortaleza: { 5: 158, 10: 130, 15: 112, 30: 82, 60: 58 },
  Manaus: { 5: 200, 10: 168, 15: 145, 30: 106, 60: 74 },
};

export const DURACOES_MIN = [5, 10, 15, 30, 60];

export function getIntensidade(cidade: string, duracaoMin: number): number | null {
  return INTENSIDADES[cidade]?.[duracaoMin] ?? null;
}

function round(n: number, d = 4) {
  const f = 10 ** d;
  return Math.round(n * f) / f;
}

/** i (mm/h) → i (m/s) */
export function convertIntensityToMps(iMmPerH: number): number {
  return iMmPerH / 1000 / 3600;
}

/** Q = C × i × A  (m³/s) */
export function calcQbacia(areaM2: number, C: number, iMmH: number): number {
  return C * convertIntensityToMps(iMmH) * areaM2;
}

/** Vazão a seção plena de um conduto circular pela fórmula de Manning. */
export function capacidadeTuboCheio(
  diametroMm: number,
  n: number,
  declividadeFracao: number,
): number {
  const D = diametroMm / 1000;
  const A = (Math.PI * D * D) / 4;
  const R = D / 4;
  return (1 / n) * A * Math.pow(R, 2 / 3) * Math.sqrt(Math.max(declividadeFracao, 0));
}

export function suggestPipeDiameter(
  QM3s: number,
  material: MaterialConduto,
  SFracao: number,
  diametroMinimoMm = 100,
): PipeSuggestion {
  const n = MANNING_N[material];
  const candidatos = DIAMETROS_COMERCIAIS_MM.filter((d) => d >= diametroMinimoMm);
  let escolhido: number | null = null;
  let capacidade = 0;

  for (const d of candidatos) {
    const cap = capacidadeTuboCheio(d, n, SFracao);
    if (cap >= QM3s) {
      escolhido = d;
      capacidade = cap;
      break;
    }
  }

  if (escolhido === null) {
    return {
      diametroMm: null,
      velocidadeMs: 0,
      capacidadeCheiaM3s: capacidadeTuboCheio(
        candidatos[candidatos.length - 1] ?? 1000,
        n,
        SFracao,
      ),
      declividadeFracao: SFracao,
      material,
      manningN: n,
      warning:
        "Nenhum diâmetro comercial da tabela atende à vazão nesta declividade. Aumente a declividade, divida o sistema em mais trechos ou consulte projeto específico.",
    };
  }

  const D = escolhido / 1000;
  const area = (Math.PI * D * D) / 4;
  const velocidade = QM3s > 0 ? QM3s / area : 0;

  let warning: string | undefined;
  const velCheia = capacidade / area;
  if (velocidade > 0 && velocidade < V_MIN_MS) {
    warning = `Velocidade estimada de ${velocidade.toFixed(2)} m/s abaixo de ${V_MIN_MS} m/s — risco de sedimentação. Considere aumentar a declividade ou reduzir o diâmetro.`;
  } else if (velCheia > V_MAX_MS) {
    warning = `Velocidade a seção plena de ${velCheia.toFixed(2)} m/s acima de ${V_MAX_MS} m/s — risco de abrasão. Considere reduzir a declividade.`;
  }

  return {
    diametroMm: escolhido,
    velocidadeMs: round(velocidade, 3),
    capacidadeCheiaM3s: round(capacidade, 6),
    declividadeFracao: SFracao,
    material,
    manningN: n,
    warning,
  };
}

export function suggestGutterSection(
  QM3s: number,
  forma: "retangular" | "semicircular" = "retangular",
  vDesign = V_DESIGN_MS,
): GutterSuggestion {
  const areaNecessaria = vDesign > 0 ? QM3s / vDesign : 0;

  if (forma === "semicircular") {
    // A = π D² / 8 (meia seção) → D = sqrt(8A/π)
    const dNecessarioMm = Math.sqrt((8 * areaNecessaria) / Math.PI) * 1000;
    const largura =
      LARGURAS_CALHA_MM.find((b) => b >= Math.max(dNecessarioMm, 100)) ??
      LARGURAS_CALHA_MM[LARGURAS_CALHA_MM.length - 1];
    const D = largura / 1000;
    const area = (Math.PI * D * D) / 8;
    const velocidade = area > 0 ? QM3s / area : 0;
    return {
      forma,
      larguraMm: largura,
      alturaMm: Math.round(largura / 2),
      areaM2: round(area, 5),
      velocidadeMs: round(velocidade, 3),
      warning: gutterWarning(velocidade, dNecessarioMm > largura),
    };
  }

  // Retangular com relação h ≈ b/2 (seção econômica usual em calhas)
  // A = b × h = b²/2 → b = sqrt(2A)
  const bNecessarioMm = Math.sqrt(2 * areaNecessaria) * 1000;
  const largura =
    LARGURAS_CALHA_MM.find((b) => b >= Math.max(bNecessarioMm, 100)) ??
    LARGURAS_CALHA_MM[LARGURAS_CALHA_MM.length - 1];
  const altura = Math.round(largura / 2);
  const area = (largura / 1000) * (altura / 1000);
  const velocidade = area > 0 ? QM3s / area : 0;
  return {
    forma,
    larguraMm: largura,
    alturaMm: altura,
    areaM2: round(area, 5),
    velocidadeMs: round(velocidade, 3),
    warning: gutterWarning(velocidade, bNecessarioMm > largura),
  };
}

function gutterWarning(velocidade: number, excedeTabela: boolean): string | undefined {
  if (excedeTabela)
    return "Vazão alta para as seções comerciais listadas — considere dividir o telhado em mais condutores ou usar calha sob medida.";
  if (velocidade > 0 && velocidade < 0.5)
    return "Velocidade baixa na calha — garanta declividade mínima de 0,5% e limpeza periódica.";
  if (velocidade > 2)
    return "Velocidade acima de 2,0 m/s — risco de transbordo em curvas; avalie seção maior.";
  return undefined;
}

export function suggestRalos(QM3s: number, capacidadeUnitariaLs = CAPACIDADE_RALO_LS): RaloSuggestion {
  const QLs = QM3s * 1000;
  const quantidade = Math.max(1, Math.ceil(QLs / capacidadeUnitariaLs));
  return {
    quantidade,
    capacidadeUnitariaLs,
    warning:
      quantidade > 12
        ? "Número elevado de ralos — revise o agrupamento de bacias ou adote grelhas lineares de maior capacidade."
        : undefined,
  };
}

export type DrenagemInput = {
  bacias: Bacia[];
  intensidadeMmH: number;
  fatorSeguranca?: number;
  material: MaterialConduto;
  declividadePct: number;
  diametroMinimoMm?: number;
  formaCalha?: "retangular" | "semicircular";
  velocidadeProjetoMs?: number;
  capacidadeRaloLs?: number;
};

export type DrenagemResult = {
  bacias: BaciaResult[];
  trechos: TrechoResult[];
  resumo: {
    areaTotalM2: number;
    vazaoTotalM3s: number;
    vazaoTotalLs: number;
    intensidadeMmH: number;
    declividadePct: number;
    tuboGeral: PipeSuggestion;
    calhaGeral: GutterSuggestion;
    ralosTotais: number;
  };
  warnings: string[];
};

export function calcDrenagem(input: DrenagemInput): DrenagemResult {
  const fs = input.fatorSeguranca && input.fatorSeguranca > 0 ? input.fatorSeguranca : 1;
  const S = input.declividadePct / 100;
  const vDesign = input.velocidadeProjetoMs ?? V_DESIGN_MS;
  const forma = input.formaCalha ?? "retangular";
  const warnings: string[] = [];

  if (input.declividadePct < 0.5) {
    warnings.push(
      "Declividade abaixo de 0,5% — risco elevado de sedimentação e entupimento. Recomenda-se S ≥ 0,5% (1% para trechos longos).",
    );
  }

  const bacias: BaciaResult[] = input.bacias.map((b, i) => {
    const C = b.C ?? COEF_ESCOAMENTO[b.superficie];
    const q = calcQbacia(b.areaM2, C, input.intensidadeMmH) * fs;
    const bw: string[] = [];
    if (C > 1) bw.push("Coeficiente de escoamento maior que 1,0 não tem sentido físico.");
    if (b.areaM2 <= 0) bw.push("Área inválida.");
    if (b.inclinacaoPct !== undefined && b.inclinacaoPct > 0 && b.inclinacaoPct < 0.5)
      bw.push("Inclinação da superfície muito baixa — verifique empoçamento.");
    return {
      id: b.id ?? `B${i + 1}`,
      nome: b.nome || `Bacia ${i + 1}`,
      areaM2: b.areaM2,
      superficie: b.superficie,
      C,
      destino: b.destino?.trim() || "Ponto único",
      vazaoM3s: round(q, 6),
      vazaoLs: round(q * 1000, 3),
      warnings: bw,
    };
  });

  const porDestino = new Map<string, BaciaResult[]>();
  for (const b of bacias) {
    const arr = porDestino.get(b.destino) ?? [];
    arr.push(b);
    porDestino.set(b.destino, arr);
  }

  const trechos: TrechoResult[] = [...porDestino.entries()].map(([destino, lista]) => {
    const Q = lista.reduce((s, b) => s + b.vazaoM3s, 0);
    const area = lista.reduce((s, b) => s + b.areaM2, 0);
    const tubo = suggestPipeDiameter(Q, input.material, S, input.diametroMinimoMm ?? 100);
    const calha = suggestGutterSection(Q, forma, vDesign);
    const ralos = suggestRalos(Q, input.capacidadeRaloLs);
    const tw = [tubo.warning, calha.warning, ralos.warning].filter(Boolean) as string[];
    return {
      destino,
      bacias: lista.map((b) => b.nome),
      areaM2: round(area, 2),
      vazaoM3s: round(Q, 6),
      vazaoLs: round(Q * 1000, 3),
      tubo,
      calha,
      ralos,
      warnings: tw,
    };
  });

  const QTotal = bacias.reduce((s, b) => s + b.vazaoM3s, 0);
  const areaTotal = bacias.reduce((s, b) => s + b.areaM2, 0);

  return {
    bacias,
    trechos,
    resumo: {
      areaTotalM2: round(areaTotal, 2),
      vazaoTotalM3s: round(QTotal, 6),
      vazaoTotalLs: round(QTotal * 1000, 3),
      intensidadeMmH: input.intensidadeMmH,
      declividadePct: input.declividadePct,
      tuboGeral: suggestPipeDiameter(QTotal, input.material, S, input.diametroMinimoMm ?? 100),
      calhaGeral: suggestGutterSection(QTotal, forma, vDesign),
      ralosTotais: trechos.reduce((s, t) => s + t.ralos.quantidade, 0),
    },
    warnings,
  };
}

/** Tabela de capacidade dos diâmetros comerciais na declividade escolhida. */
export function tabelaCapacidades(material: MaterialConduto, declividadePct: number) {
  const n = MANNING_N[material];
  const S = declividadePct / 100;
  return DIAMETROS_COMERCIAIS_MM.map((d) => {
    const cap = capacidadeTuboCheio(d, n, S);
    const area = (Math.PI * (d / 1000) ** 2) / 4;
    return {
      diametroMm: d,
      capacidadeLs: round(cap * 1000, 2),
      velocidadeCheiaMs: round(cap / area, 3),
    };
  });
}

export function toCSVDrenagem(result: DrenagemResult): string {
  const lines: string[] = [];
  lines.push("Tipo;Nome;Area_m2;C;Vazao_L_s;Diametro_mm;Declividade_%;Velocidade_m_s;Observacoes");
  for (const b of result.bacias) {
    lines.push(
      [
        "Bacia",
        b.nome,
        b.areaM2,
        b.C,
        b.vazaoLs,
        "",
        "",
        "",
        b.warnings.join(" | "),
      ].join(";"),
    );
  }
  for (const t of result.trechos) {
    lines.push(
      [
        "Trecho",
        t.destino,
        t.areaM2,
        "",
        t.vazaoLs,
        t.tubo.diametroMm ?? "n/d",
        result.resumo.declividadePct,
        t.tubo.velocidadeMs,
        t.warnings.join(" | "),
      ].join(";"),
    );
  }
  lines.push(
    [
      "Total",
      "Sistema",
      result.resumo.areaTotalM2,
      "",
      result.resumo.vazaoTotalLs,
      result.resumo.tuboGeral.diametroMm ?? "n/d",
      result.resumo.declividadePct,
      result.resumo.tuboGeral.velocidadeMs,
      result.warnings.join(" | "),
    ].join(";"),
  );
  return lines.join("\n");
}
