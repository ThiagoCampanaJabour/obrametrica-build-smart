// Cálculos de pré-dimensionamento de fundações rasas (sapatas).
// Estimativas para orçamento e estudo preliminar. NÃO substitui projeto estrutural.

export type SoilPreset = "macio" | "medio" | "firme" | "custom";

export const SOIL_CAPACITY_KN_M2: Record<Exclude<SoilPreset, "custom">, number> = {
  macio: 100,
  medio: 200,
  firme: 300,
};

export const DEFAULTS = {
  safetyFactor: 2.0,
  kgAcoPorM3: 100, // heurística: 80–120 kg/m³
  fckMPa: 25,
  coberturaMm: 30,
  hRatio: 0.25, // H ≈ 0.25 × lado_base
  hMin: 0.3, // altura mínima prática (m)
  precoConcretoM3: 450,
  precoAcoKg: 12,
  precoFormaM2: 55,
};

export type SapataIsoladaInput = {
  cargaPorPilarKN: number;
  numPilares: number;
  capacidadeSoloKNm2: number;
  safetyFactor: number;
  kgAcoPorM3: number;
  hRatio?: number;
  hMin?: number;
};

export type SapataCorridaInput = {
  cargaLinearKNm: number;
  comprimentoTotalM: number;
  capacidadeSoloKNm2: number;
  safetyFactor: number;
  kgAcoPorM3: number;
  hRatio?: number;
  hMin?: number;
};

export type SapataIsoladaResult = {
  areaBaseM2: number;
  ladoM: number;
  alturaM: number;
  volumeUnitM3: number;
  volumeTotalM3: number;
  acoUnitKg: number;
  acoTotalKg: number;
  formaUnitM2: number;
  formaTotalM2: number;
  numPilares: number;
  alerts: string[];
};

export type SapataCorridaResult = {
  larguraM: number;
  alturaM: number;
  volumePorMetroM3: number;
  volumeTotalM3: number;
  acoPorMetroKg: number;
  acoTotalKg: number;
  formaPorMetroM2: number;
  formaTotalM2: number;
  comprimentoM: number;
  alerts: string[];
};

export type CustosInput = {
  precoConcretoM3: number;
  precoAcoKg: number;
  precoFormaM2: number;
};

export type CustosResult = {
  custoConcreto: number;
  custoAco: number;
  custoForma: number;
  custoTotal: number;
};

function round(n: number, d = 2) {
  const f = 10 ** d;
  return Math.round(n * f) / f;
}

export function calcSapataIsolada(input: SapataIsoladaInput): SapataIsoladaResult {
  const alerts: string[] = [];
  const {
    cargaPorPilarKN,
    numPilares,
    capacidadeSoloKNm2,
    safetyFactor,
    kgAcoPorM3,
  } = input;
  const hRatio = input.hRatio ?? DEFAULTS.hRatio;
  const hMin = input.hMin ?? DEFAULTS.hMin;

  if (cargaPorPilarKN <= 0) alerts.push("Carga por pilar deve ser maior que zero.");
  if (numPilares <= 0) alerts.push("Número de pilares deve ser maior que zero.");
  if (capacidadeSoloKNm2 <= 0) alerts.push("Capacidade do solo inválida.");
  if (capacidadeSoloKNm2 < 80)
    alerts.push(
      "Capacidade do solo muito baixa (<80 kN/m²) — considere fundação profunda ou sondagem detalhada.",
    );

  const areaBaseM2 = (cargaPorPilarKN * safetyFactor) / capacidadeSoloKNm2;
  const ladoM = Math.sqrt(Math.max(areaBaseM2, 0));
  const alturaM = Math.max(hRatio * ladoM, hMin);
  const volumeUnitM3 = ladoM * ladoM * alturaM;
  const volumeTotalM3 = volumeUnitM3 * numPilares;
  const acoUnitKg = volumeUnitM3 * kgAcoPorM3;
  const acoTotalKg = acoUnitKg * numPilares;
  // formas laterais: perímetro × altura
  const formaUnitM2 = 4 * ladoM * alturaM;
  const formaTotalM2 = formaUnitM2 * numPilares;

  if (ladoM < 0.6)
    alerts.push("Lado da sapata abaixo do mínimo prático (0,60 m) — reveja carga/solo.");

  return {
    areaBaseM2: round(areaBaseM2, 3),
    ladoM: round(ladoM, 2),
    alturaM: round(alturaM, 2),
    volumeUnitM3: round(volumeUnitM3, 3),
    volumeTotalM3: round(volumeTotalM3, 3),
    acoUnitKg: round(acoUnitKg, 1),
    acoTotalKg: round(acoTotalKg, 1),
    formaUnitM2: round(formaUnitM2, 2),
    formaTotalM2: round(formaTotalM2, 2),
    numPilares,
    alerts,
  };
}

export function calcSapataCorrida(input: SapataCorridaInput): SapataCorridaResult {
  const alerts: string[] = [];
  const {
    cargaLinearKNm,
    comprimentoTotalM,
    capacidadeSoloKNm2,
    safetyFactor,
    kgAcoPorM3,
  } = input;
  const hRatio = input.hRatio ?? DEFAULTS.hRatio;
  const hMin = input.hMin ?? DEFAULTS.hMin;

  if (cargaLinearKNm <= 0) alerts.push("Carga linear deve ser maior que zero.");
  if (comprimentoTotalM <= 0) alerts.push("Comprimento total deve ser maior que zero.");
  if (capacidadeSoloKNm2 <= 0) alerts.push("Capacidade do solo inválida.");
  if (capacidadeSoloKNm2 < 80)
    alerts.push(
      "Capacidade do solo muito baixa (<80 kN/m²) — considere fundação profunda ou sondagem detalhada.",
    );

  const larguraM = (cargaLinearKNm * safetyFactor) / capacidadeSoloKNm2;
  const alturaM = Math.max(hRatio * larguraM, hMin);
  const volumePorMetroM3 = larguraM * alturaM;
  const volumeTotalM3 = volumePorMetroM3 * comprimentoTotalM;
  const acoPorMetroKg = volumePorMetroM3 * kgAcoPorM3;
  const acoTotalKg = acoPorMetroKg * comprimentoTotalM;
  // formas laterais: 2 faces × altura por metro linear
  const formaPorMetroM2 = 2 * alturaM;
  const formaTotalM2 = formaPorMetroM2 * comprimentoTotalM;

  if (larguraM < 0.3)
    alerts.push("Largura da sapata corrida abaixo do mínimo prático (0,30 m) — reveja carga/solo.");

  return {
    larguraM: round(larguraM, 2),
    alturaM: round(alturaM, 2),
    volumePorMetroM3: round(volumePorMetroM3, 3),
    volumeTotalM3: round(volumeTotalM3, 3),
    acoPorMetroKg: round(acoPorMetroKg, 1),
    acoTotalKg: round(acoTotalKg, 1),
    formaPorMetroM2: round(formaPorMetroM2, 2),
    formaTotalM2: round(formaTotalM2, 2),
    comprimentoM: comprimentoTotalM,
    alerts,
  };
}

export function calcCustos(
  volumeConcretoM3: number,
  acoKg: number,
  formaM2: number,
  precos: CustosInput,
): CustosResult {
  const custoConcreto = volumeConcretoM3 * precos.precoConcretoM3;
  const custoAco = acoKg * precos.precoAcoKg;
  const custoForma = formaM2 * precos.precoFormaM2;
  return {
    custoConcreto: round(custoConcreto, 2),
    custoAco: round(custoAco, 2),
    custoForma: round(custoForma, 2),
    custoTotal: round(custoConcreto + custoAco + custoForma, 2),
  };
}

export function formatMoney(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function toCSVIsolada(r: SapataIsoladaResult): string {
  const header = "sapata_id,L_m,B_m,H_m,volume_m3,aco_kg,forma_m2";
  const rows: string[] = [];
  for (let i = 1; i <= r.numPilares; i++) {
    rows.push(
      [`S${i}`, r.ladoM, r.ladoM, r.alturaM, r.volumeUnitM3, r.acoUnitKg, r.formaUnitM2].join(","),
    );
  }
  return [header, ...rows].join("\n");
}

export function toCSVCorrida(r: SapataCorridaResult): string {
  const header = "trecho,comprimento_m,largura_m,altura_m,volume_m3,aco_kg,forma_m2";
  return [
    header,
    ["T1", r.comprimentoM, r.larguraM, r.alturaM, r.volumeTotalM3, r.acoTotalKg, r.formaTotalM2].join(
      ",",
    ),
  ].join("\n");
}
