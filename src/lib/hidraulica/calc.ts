/**
 * Perda de carga em tubulações de água — funções puras.
 * Referências: Munson (Fundamentals of Fluid Mechanics), White (Fluid Mechanics),
 * Colebrook (1939), Swamee & Jain (1976), Hazen-Williams (uso em água potável).
 * Unidades internas sempre SI: m, m³/s, Pa, kg/m³, Pa·s.
 */

export const G = 9.80665;

/** Massa específica da água (kg/m³) por interpolação de tabela 0–100 °C. */
export function densityWater(T_C: number): number {
  const T = clamp(T_C, 0, 100);
  const table: Array<[number, number]> = [
    [0, 999.84],
    [5, 999.96],
    [10, 999.7],
    [20, 998.2],
    [30, 995.65],
    [40, 992.22],
    [60, 983.2],
    [80, 971.79],
    [100, 958.35],
  ];
  return interp(table, T);
}

/** Viscosidade dinâmica da água (Pa·s) — correlação de Vogel/tabela interpolada. */
export function viscosityWater(T_C: number): number {
  const T = clamp(T_C, 0, 100);
  const table: Array<[number, number]> = [
    [0, 1.7914e-3],
    [5, 1.5192e-3],
    [10, 1.3059e-3],
    [20, 1.002e-3],
    [30, 7.972e-4],
    [40, 6.527e-4],
    [60, 4.665e-4],
    [80, 3.547e-4],
    [100, 2.818e-4],
  ];
  return interp(table, T);
}

function interp(table: Array<[number, number]>, x: number): number {
  for (let i = 1; i < table.length; i++) {
    const [x0, y0] = table[i - 1]!;
    const [x1, y1] = table[i]!;
    if (x <= x1) return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
  }
  return table[table.length - 1]![1];
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export function areaFromD(D_m: number): number {
  return (Math.PI * D_m * D_m) / 4;
}

/** V = 4Q / (πD²) */
export function velocityFromQ(Q_m3s: number, D_m: number): number {
  if (D_m <= 0) throw new Error("Diâmetro deve ser maior que zero.");
  return Q_m3s / areaFromD(D_m);
}

/** Re = ρ V D / μ */
export function reynoldsNumber(rho: number, V: number, D_m: number, mu: number): number {
  if (mu <= 0) throw new Error("Viscosidade deve ser maior que zero.");
  return (rho * Math.abs(V) * D_m) / mu;
}

/** Swamee-Jain (explícita) — válida para 5e3 < Re < 1e8 e 1e-6 < ε/D < 1e-2. */
export function swameeJain(Re: number, D_m: number, eps_m: number): number {
  const arg = eps_m / (3.7 * D_m) + 5.74 / Math.pow(Re, 0.9);
  const log = Math.log10(arg);
  return 0.25 / (log * log);
}

/**
 * Colebrook-White resolvido por Newton-Raphson em x = 1/√f.
 * Fallback para Swamee-Jain se não convergir. Regime laminar usa f = 64/Re.
 */
export function colebrook(
  Re: number,
  D_m: number,
  eps_m: number,
  opts: { tol?: number; maxIter?: number } = {},
): { f: number; iterations: number; converged: boolean } {
  const tol = opts.tol ?? 1e-10;
  const maxIter = opts.maxIter ?? 60;
  if (Re <= 0) return { f: 0, iterations: 0, converged: false };
  if (Re < 2000) return { f: 64 / Re, iterations: 0, converged: true };

  const k = eps_m / (3.7 * D_m);
  // x = 1/sqrt(f); F(x) = x + 2 log10(k + 2.51 x / Re)
  let x = 1 / Math.sqrt(swameeJain(Math.max(Re, 4000), D_m, eps_m));
  for (let i = 1; i <= maxIter; i++) {
    const inner = k + (2.51 * x) / Re;
    if (inner <= 0) break;
    const F = x + 2 * Math.log10(inner);
    const dF = 1 + (2 / Math.LN10) * (2.51 / Re) / inner;
    const xNew = x - F / dF;
    if (!Number.isFinite(xNew) || xNew <= 0) break;
    if (Math.abs(xNew - x) < tol) {
      return { f: 1 / (xNew * xNew), iterations: i, converged: true };
    }
    x = xNew;
  }
  return {
    f: swameeJain(Math.max(Re, 4000), D_m, eps_m),
    iterations: maxIter,
    converged: false,
  };
}

/** Fator de atrito conforme método, tratando regime laminar e transição. */
export function frictionFactor(
  Re: number,
  D_m: number,
  eps_m: number,
  method: "colebrook" | "swamee-jain",
): { f: number; regime: "laminar" | "transicao" | "turbulento"; converged: boolean } {
  if (Re < 2000) return { f: Re > 0 ? 64 / Re : 0, regime: "laminar", converged: true };
  const regime: "transicao" | "turbulento" = Re < 4000 ? "transicao" : "turbulento";
  if (method === "swamee-jain") {
    return { f: swameeJain(Math.max(Re, 4000), D_m, eps_m), regime, converged: true };
  }
  const r = colebrook(Re, D_m, eps_m);
  return { f: r.f, regime, converged: r.converged };
}

/** hf = f (L/D) V² / 2g  [m.c.a.] */
export function darcyHeadLoss(f: number, L_m: number, D_m: number, V_m_s: number): number {
  return (f * (L_m / D_m) * V_m_s * V_m_s) / (2 * G);
}

/** hf = 10.67 L Q^1.852 / (C^1.852 D^4.871) [m], unidades SI. */
export function hazenWilliamsHeadLoss(
  Q_m3s: number,
  C: number,
  D_m: number,
  L_m: number,
): number {
  if (C <= 0) throw new Error("Coeficiente C deve ser maior que zero.");
  return (10.67 * L_m * Math.pow(Math.abs(Q_m3s), 1.852)) / (Math.pow(C, 1.852) * Math.pow(D_m, 4.871));
}

/** Σ K V²/2g [m] */
export function localLoss(K_list: number[], V_m_s: number): number {
  const sumK = K_list.reduce((a, b) => a + b, 0);
  return (sumK * V_m_s * V_m_s) / (2 * G);
}

export type Piece = { label: string; K: number; qty: number; sectionId?: string };

export type Section = {
  id: string;
  label: string;
  D_m: number;
  L_m: number;
  eps_m: number;
  Q_m3s: number;
  /** Coeficiente Hazen-Williams do trecho (usado apenas nesse método). */
  C?: number;
};

export type CalcOptions = {
  method: "darcy-colebrook" | "darcy-swamee-jain" | "hazen-williams";
  T_C: number;
  /** Diferença de cota (m) entre a saída e a entrada — positivo = recalque. */
  desnivel_m: number;
  /** Eficiência do conjunto motobomba (0–1). */
  eficienciaBomba: number;
};

export type SectionResult = {
  id: string;
  label: string;
  D_mm: number;
  L_m: number;
  Q_Ls: number;
  V_m_s: number;
  Re: number;
  f: number | null;
  regime: "laminar" | "transicao" | "turbulento" | "n/a";
  converged: boolean;
  hf_m: number;
  hf_Pa: number;
  hf_por_100m: number;
  hlocal_m: number;
  sumK: number;
  total_m: number;
};

export type HidraulicaResult = {
  method: CalcOptions["method"];
  rho: number;
  mu: number;
  sections: SectionResult[];
  hf_atrito_m: number;
  hf_local_m: number;
  hf_total_m: number;
  hf_total_Pa: number;
  desnivel_m: number;
  head_total_m: number;
  Q_projeto_m3s: number;
  potenciaHidraulica_kW: number;
  potenciaEletrica_kW: number;
  avisos: string[];
  /** Perda acumulada ao longo do comprimento, para o gráfico. */
  perfil: Array<{ x_m: number; h_m: number; label: string }>;
};

/** Cálculo completo de trechos em série com peças (perdas localizadas). */
export function totalHeadLoss(
  sections: Section[],
  pieces: Piece[],
  options: CalcOptions,
): HidraulicaResult {
  if (sections.length === 0) throw new Error("Informe ao menos um trecho.");
  const rho = densityWater(options.T_C);
  const mu = viscosityWater(options.T_C);
  const avisos: string[] = [];
  const results: SectionResult[] = [];
  const perfil: Array<{ x_m: number; h_m: number; label: string }> = [
    { x_m: 0, h_m: 0, label: "Início" },
  ];

  let xAcc = 0;
  let hAcc = 0;

  for (const s of sections) {
    if (s.D_m <= 0 || s.L_m <= 0) throw new Error(`Trecho "${s.label}": D e L devem ser > 0.`);
    const V = velocityFromQ(s.Q_m3s, s.D_m);
    const Re = reynoldsNumber(rho, V, s.D_m, mu);

    let hf = 0;
    let f: number | null = null;
    let regime: SectionResult["regime"] = "n/a";
    let converged = true;

    if (options.method === "hazen-williams") {
      const C = s.C ?? 140;
      hf = hazenWilliamsHeadLoss(s.Q_m3s, C, s.D_m, s.L_m);
      if (options.T_C < 4 || options.T_C > 30) {
        avisos.push(
          "Hazen-Williams é calibrado para água entre ~4 °C e 30 °C; fora dessa faixa prefira Darcy-Weisbach.",
        );
      }
      if (V < 0.6 || V > 3) {
        avisos.push(
          `Trecho "${s.label}": velocidade ${V.toFixed(2)} m/s fora da faixa usual de validade prática (0,6–3,0 m/s).`,
        );
      }
    } else {
      const method = options.method === "darcy-colebrook" ? "colebrook" : "swamee-jain";
      const ff = frictionFactor(Re, s.D_m, s.eps_m, method);
      f = ff.f;
      regime = ff.regime;
      converged = ff.converged;
      if (!converged) {
        avisos.push(
          `Trecho "${s.label}": Colebrook não convergiu; usado Swamee-Jain como fallback.`,
        );
      }
      if (regime === "laminar") {
        avisos.push(`Trecho "${s.label}": regime laminar (Re < 2000) — aplicado f = 64/Re.`);
      } else if (regime === "transicao") {
        avisos.push(
          `Trecho "${s.label}": regime de transição (2000 < Re < 4000) — resultado com incerteza elevada.`,
        );
      }
      hf = darcyHeadLoss(f, s.L_m, s.D_m, V);
    }

    const sectionPieces = pieces.filter((p) => !p.sectionId || p.sectionId === s.id);
    const kList = sectionPieces.flatMap((p) => Array.from({ length: Math.max(0, p.qty) }, () => p.K));
    const sumK = kList.reduce((a, b) => a + b, 0);
    const hlocal = localLoss(kList, V);

    if (V > 3) {
      avisos.push(
        `Trecho "${s.label}": velocidade ${V.toFixed(2)} m/s acima de 3 m/s — risco de ruído e golpe de aríete.`,
      );
    }

    results.push({
      id: s.id,
      label: s.label,
      D_mm: s.D_m * 1000,
      L_m: s.L_m,
      Q_Ls: s.Q_m3s * 1000,
      V_m_s: V,
      Re,
      f,
      regime,
      converged,
      hf_m: hf,
      hf_Pa: hf * rho * G,
      hf_por_100m: (hf / s.L_m) * 100,
      hlocal_m: hlocal,
      sumK,
      total_m: hf + hlocal,
    });

    xAcc += s.L_m;
    hAcc += hf + hlocal;
    perfil.push({ x_m: xAcc, h_m: hAcc, label: s.label });
  }

  const hf_atrito_m = results.reduce((a, r) => a + r.hf_m, 0);
  const hf_local_m = results.reduce((a, r) => a + r.hlocal_m, 0);
  const hf_total_m = hf_atrito_m + hf_local_m;
  const head_total_m = hf_total_m + options.desnivel_m;
  const Q = sections[sections.length - 1]!.Q_m3s;
  const potenciaHidraulica_kW = (rho * G * Q * Math.max(head_total_m, 0)) / 1000;
  const eff = clamp(options.eficienciaBomba, 0.05, 1);
  const potenciaEletrica_kW = potenciaHidraulica_kW / eff;

  return {
    method: options.method,
    rho,
    mu,
    sections: results,
    hf_atrito_m,
    hf_local_m,
    hf_total_m,
    hf_total_Pa: hf_total_m * rho * G,
    desnivel_m: options.desnivel_m,
    head_total_m,
    Q_projeto_m3s: Q,
    potenciaHidraulica_kW,
    potenciaEletrica_kW,
    avisos: Array.from(new Set(avisos)),
    perfil,
  };
}

/** Curva perda total vs vazão (para seleção de bomba). */
export function headLossCurve(
  sections: Section[],
  pieces: Piece[],
  options: CalcOptions,
  points = 12,
): Array<{ Q_Ls: number; head_m: number }> {
  const base = sections[sections.length - 1]?.Q_m3s ?? 0;
  if (base <= 0) return [];
  const out: Array<{ Q_Ls: number; head_m: number }> = [];
  for (let i = 1; i <= points; i++) {
    const factor = (i / points) * 1.6;
    const scaled = sections.map((s) => ({ ...s, Q_m3s: s.Q_m3s * factor }));
    const r = totalHeadLoss(scaled, pieces, options);
    out.push({ Q_Ls: base * factor * 1000, head_m: r.head_total_m });
  }
  return out;
}

// ---------- Conversões de unidades ----------

export const Q_UNITS = {
  "m3/s": 1,
  "L/s": 1e-3,
  "m3/h": 1 / 3600,
  gpm: 6.30902e-5,
} as const;
export type QUnit = keyof typeof Q_UNITS;

export function toM3s(value: number, unit: QUnit): number {
  return value * Q_UNITS[unit];
}
export function fromM3s(value_m3s: number, unit: QUnit): number {
  return value_m3s / Q_UNITS[unit];
}

export const D_UNITS = { mm: 1e-3, m: 1, in: 0.0254 } as const;
export type DUnit = keyof typeof D_UNITS;

export function toMeters(value: number, unit: DUnit): number {
  return value * D_UNITS[unit];
}

export function mcaToPa(h_m: number, rho: number): number {
  return h_m * rho * G;
}
export function paToPsi(pa: number): number {
  return pa / 6894.757;
}
export function mToFt(m: number): number {
  return m / 0.3048;
}

// ---------- Exportações ----------

export function toCSVHidraulica(result: HidraulicaResult): string {
  const head = [
    "trecho",
    "D_mm",
    "L_m",
    "Q_L/s",
    "V_m/s",
    "Reynolds",
    "f",
    "regime",
    "hf_atrito_m",
    "hf_atrito_Pa",
    "hf_por_100m",
    "somaK",
    "hf_local_m",
    "total_m",
  ].join(";");
  const rows = result.sections.map((s) =>
    [
      s.label,
      s.D_mm.toFixed(1),
      s.L_m.toFixed(2),
      s.Q_Ls.toFixed(3),
      s.V_m_s.toFixed(3),
      s.Re.toFixed(0),
      s.f === null ? "-" : s.f.toFixed(5),
      s.regime,
      s.hf_m.toFixed(4),
      s.hf_Pa.toFixed(1),
      s.hf_por_100m.toFixed(4),
      s.sumK.toFixed(2),
      s.hlocal_m.toFixed(4),
      s.total_m.toFixed(4),
    ].join(";"),
  );
  const totals = [
    "",
    `TOTAL atrito (m);${result.hf_atrito_m.toFixed(4)}`,
    `TOTAL localizadas (m);${result.hf_local_m.toFixed(4)}`,
    `TOTAL perda (m);${result.hf_total_m.toFixed(4)}`,
    `TOTAL perda (Pa);${result.hf_total_Pa.toFixed(1)}`,
    `Desnível (m);${result.desnivel_m.toFixed(2)}`,
    `Altura manométrica (m);${result.head_total_m.toFixed(4)}`,
    `Potência hidráulica (kW);${result.potenciaHidraulica_kW.toFixed(4)}`,
    `Potência elétrica estimada (kW);${result.potenciaEletrica_kW.toFixed(4)}`,
    `Método;${result.method}`,
  ];
  return [head, ...rows, ...totals].join("\n");
}
