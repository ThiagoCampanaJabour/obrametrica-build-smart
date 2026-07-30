// Perdas térmicas e dimensionamento HVAC simplificado.
// ESTIMATIVA PRELIMINAR — não substitui projeto HVAC (ABNT NBR 16401 / ASHRAE).

export type Orientacao = "N" | "NE" | "L" | "SE" | "S" | "SO" | "O" | "NO";
export type Isolamento = "boa" | "media" | "ruim";
export type UsoAmbiente = "residencial" | "comercial" | "loja";
export type Modo = "rapido" | "avancado";

/** Fator relativo de insolação por orientação (0–1) — hemisfério sul. */
export const FATOR_ORIENTACAO: Record<Orientacao, number> = {
  N: 0.9,
  NE: 0.7,
  L: 0.75,
  SE: 0.5,
  S: 0.3,
  SO: 0.7,
  O: 1.0,
  NO: 0.9,
};

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

/** U-values médios (W/m²·K) por qualidade de envoltória. */
export const U_PRESETS: Record<Isolamento, { parede: number; cobertura: number; piso: number; janela: number }> = {
  boa: { parede: 1.4, cobertura: 1.0, piso: 1.2, janela: 3.0 },
  media: { parede: 2.4, cobertura: 1.9, piso: 1.8, janela: 5.0 },
  ruim: { parede: 3.2, cobertura: 2.6, piso: 2.2, janela: 5.8 },
};

export const ISOLAMENTO_LABEL: Record<Isolamento, string> = {
  boa: "Boa (isolada / laje com forro)",
  media: "Média (alvenaria comum)",
  ruim: "Ruim (telha sem forro / vidro simples)",
};

/** SHGC típico por tipo de vidro. */
export const SHGC_PRESETS = {
  simples: 0.85,
  laminado: 0.7,
  duplo: 0.55,
  refletivo: 0.35,
} as const;
export type TipoVidro = keyof typeof SHGC_PRESETS;

export const VIDRO_LABEL: Record<TipoVidro, string> = {
  simples: "Vidro simples incolor (SHGC 0,85)",
  laminado: "Laminado / verde (SHGC 0,70)",
  duplo: "Duplo / insulado (SHGC 0,55)",
  refletivo: "Refletivo / low-e (SHGC 0,35)",
};

/** Irradiância de pico de referência usada no ganho solar (kW/m²). */
export const IRRADIANCIA_PICO_KWM2 = 0.63;

/** Cargas internas típicas por uso. */
export const USO_PRESETS: Record<
  UsoAmbiente,
  { qPessoaW: number; equipWm2: number; lsPorPessoa: number; ach: number; horasDia: number }
> = {
  residencial: { qPessoaW: 100, equipWm2: 10, lsPorPessoa: 8, ach: 1.5, horasDia: 8 },
  comercial: { qPessoaW: 110, equipWm2: 20, lsPorPessoa: 10, ach: 5, horasDia: 9 },
  loja: { qPessoaW: 120, equipWm2: 25, lsPorPessoa: 12, ach: 6, horasDia: 10 },
};

export const USO_LABEL: Record<UsoAmbiente, string> = {
  residencial: "Residencial",
  comercial: "Comercial / escritório",
  loja: "Loja / atendimento",
};

/** Dados climáticos simplificados (temperatura externa de projeto, verão). */
export type Clima = { cidade: string; tExtC: number; urPct: number };

export const CLIMAS: Clima[] = [
  { cidade: "São Paulo", tExtC: 32, urPct: 70 },
  { cidade: "Rio de Janeiro", tExtC: 36, urPct: 75 },
  { cidade: "Belo Horizonte", tExtC: 33, urPct: 65 },
  { cidade: "Curitiba", tExtC: 30, urPct: 75 },
  { cidade: "Porto Alegre", tExtC: 34, urPct: 70 },
  { cidade: "Brasília", tExtC: 32, urPct: 55 },
  { cidade: "Salvador", tExtC: 33, urPct: 78 },
  { cidade: "Recife", tExtC: 33, urPct: 78 },
  { cidade: "Fortaleza", tExtC: 34, urPct: 76 },
  { cidade: "Manaus", tExtC: 36, urPct: 80 },
  { cidade: "Goiânia", tExtC: 35, urPct: 55 },
  { cidade: "Cuiabá", tExtC: 38, urPct: 55 },
];

/** Capacidades comerciais de ar-condicionado. */
export const CAPACIDADES_BTU = [7000, 9000, 12000, 18000, 22000, 24000, 30000, 36000, 48000, 60000];

export const BTU_POR_KW = 3412.14;
export const kWparaBTU = (kw: number) => kw * BTU_POR_KW;
export const btuParaKW = (btu: number) => btu / BTU_POR_KW;

// ---------------------------------------------------------------- funções puras

/** Transmissão por elemento: Q (W) = U × A × ΔT. */
export function calcTransmission(U: number, A: number, deltaT: number): number {
  if (!Number.isFinite(U) || !Number.isFinite(A) || !Number.isFinite(deltaT)) return 0;
  return Math.max(0, U) * Math.max(0, A) * deltaT;
}

/** Ganho solar: Q (W) = A_vidro × SHGC × I_rel × I_pico(kW/m²) × 1000. */
export function calcSolarGain(
  Aglass: number,
  SHGC: number,
  Irel: number,
  irradianciaKWm2 = IRRADIANCIA_PICO_KWM2,
): number {
  if (Aglass <= 0) return 0;
  return Aglass * SHGC * Math.max(0, Irel) * irradianciaKWm2 * 1000;
}

/** Ganho por ocupantes (sensível), em W. */
export function calcOccupantGain(nPeople: number, qPerson: number): number {
  return Math.max(0, nPeople) * Math.max(0, qPerson);
}

/** Carga de ventilação/infiltração: Q (W) = 0,33 × V̇(L/s) × ΔT × 1000/1000 → 0,33·V̇·ΔT (W). */
export function calcVentilationLoad(VdotLs: number, deltaT: number): number {
  return 0.33 * Math.max(0, VdotLs) * deltaT;
}

/** Vazão de ventilação (L/s) — maior entre por pessoa e renovações por hora. */
export function calcAirflowLs(
  nPeople: number,
  lsPorPessoa: number,
  volumeM3: number,
  ach: number,
): number {
  const porPessoa = Math.max(0, nPeople) * Math.max(0, lsPorPessoa);
  const porACH = (Math.max(0, volumeM3) * Math.max(0, ach) * 1000) / 3600;
  return Math.max(porPessoa, porACH);
}

/** Menor capacidade comercial (BTU/h) que atende à carga. */
export function selectCommercialBTU(kw: number): { btu: number; kw: number; exceeded: boolean } {
  const alvo = kWparaBTU(kw);
  const found = CAPACIDADES_BTU.find((c) => c >= alvo);
  if (found) return { btu: found, kw: btuParaKW(found), exceeded: false };
  const maior = CAPACIDADES_BTU[CAPACIDADES_BTU.length - 1];
  const n = Math.ceil(alvo / maior);
  return { btu: maior * n, kw: btuParaKW(maior * n), exceeded: true };
}

export type Ambiente = {
  nome: string;
  areaM2: number;
  peDireitoM: number;
  orientacao: Orientacao;
  /** Área de janelas (m²). */
  areaVidroM2: number;
  isolamento: Isolamento;
  ocupantes: number;
  /** Potência de iluminação + equipamentos (W). Se 0, usa preset por m². */
  equipamentosW: number;
  uso: UsoAmbiente;
  /** Avançado — sobrescreve presets quando informado. */
  uParede?: number;
  uCobertura?: number;
  uJanela?: number;
  shgc?: number;
  sombreamentoPct?: number;
  achInfiltracao?: number;
  /** Nº de fachadas externas (1–4) — define área de parede exposta. */
  fachadasExternas?: number;
  /** Cobertura exposta ao sol (último pavimento). */
  coberturaExposta?: boolean;
};

export type AmbienteResult = {
  nome: string;
  areaM2: number;
  peDireitoM: number;
  volumeM3: number;
  deltaT: number;
  qTransKW: number;
  qSolarKW: number;
  qPessoasKW: number;
  qEquipKW: number;
  qVentKW: number;
  qTotalKW: number;
  qLatenteKW: number;
  qComMargemKW: number;
  capacidadeSugeridaKW: number;
  capacidadeSugeridaBTU: number;
  vazaoLs: number;
  ach: number;
  consumoKWhMes: number;
  passos: string[];
  warnings: string[];
};

export type HVACParams = {
  modo: Modo;
  ambientes: Ambiente[];
  tIntC: number;
  tExtC: number;
  margemPct: number;
  /** Coeficiente de performance do equipamento. */
  cop: number;
  horasDia: number;
  diasMes: number;
};

export type HVACResult = {
  ambientes: AmbienteResult[];
  totais: {
    areaM2: number;
    qTotalKW: number;
    qComMargemKW: number;
    capacidadeTotalBTU: number;
    vazaoLs: number;
    consumoKWhMes: number;
  };
  deltaT: number;
  warnings: string[];
};

const r = (n: number, d = 3) => Math.round(n * 10 ** d) / 10 ** d;

export function calcAmbiente(a: Ambiente, p: HVACParams): AmbienteResult {
  const warnings: string[] = [];
  const passos: string[] = [];
  const area = Math.max(0, a.areaM2);
  const pd = a.peDireitoM > 0 ? a.peDireitoM : 2.7;
  const volume = area * pd;
  const deltaT = p.tExtC - p.tIntC;
  const uso = USO_PRESETS[a.uso];
  const presetU = U_PRESETS[a.isolamento];

  if (area < 4) warnings.push("Área menor que 4 m² — resultado pouco representativo.");
  if (deltaT <= 0)
    warnings.push(
      "ΔT ≤ 0: a temperatura externa de projeto não é maior que a interna. Para resfriamento, use T_ext > T_int.",
    );

  const avancado = p.modo === "avancado";
  const uParede = avancado && a.uParede ? a.uParede : presetU.parede;
  const uCobertura = avancado && a.uCobertura ? a.uCobertura : presetU.cobertura;
  const uJanela = avancado && a.uJanela ? a.uJanela : presetU.janela;
  const shgc = avancado && a.shgc ? a.shgc : SHGC_PRESETS.simples;
  const sombra = avancado ? Math.min(100, Math.max(0, a.sombreamentoPct ?? 0)) / 100 : 0;

  // Geometria estimada: ambiente aproximadamente quadrado.
  const lado = Math.sqrt(Math.max(area, 0.01));
  const fachadas = Math.min(4, Math.max(1, a.fachadasExternas ?? 1));
  const areaParedeBruta = lado * pd * fachadas;
  const areaVidro = Math.min(Math.max(0, a.areaVidroM2), areaParedeBruta);
  const areaParede = Math.max(0, areaParedeBruta - areaVidro);
  if (a.areaVidroM2 > 0.5 * areaParedeBruta)
    warnings.push(
      "Envidraçamento acima de 50% da fachada exposta — recomenda-se proteção solar (brise, película ou vidro de baixo SHGC).",
    );

  const coberturaExposta = a.coberturaExposta ?? true;
  const qParede = calcTransmission(uParede, areaParede, deltaT);
  const qJanela = calcTransmission(uJanela, areaVidro, deltaT);
  const qCobertura = coberturaExposta ? calcTransmission(uCobertura, area, deltaT) : 0;
  const qTrans = qParede + qJanela + qCobertura;
  passos.push(
    `Transmissão: parede ${r(uParede, 2)}×${r(areaParede, 2)}×${r(deltaT, 1)} = ${r(qParede, 0)} W; janela ${r(uJanela, 2)}×${r(areaVidro, 2)}×${r(deltaT, 1)} = ${r(qJanela, 0)} W; cobertura ${coberturaExposta ? `${r(uCobertura, 2)}×${r(area, 2)}×${r(deltaT, 1)} = ${r(qCobertura, 0)} W` : "não exposta (0 W)"}.`,
  );

  const iRel = FATOR_ORIENTACAO[a.orientacao] * (1 - sombra);
  const qSolar = calcSolarGain(areaVidro, shgc, iRel);
  passos.push(
    `Ganho solar: ${r(areaVidro, 2)} m² × SHGC ${r(shgc, 2)} × fator ${r(iRel, 2)} × ${IRRADIANCIA_PICO_KWM2} kW/m² = ${r(qSolar, 0)} W.`,
  );

  const qPessoas = calcOccupantGain(a.ocupantes, uso.qPessoaW);
  passos.push(`Ocupantes: ${a.ocupantes} × ${uso.qPessoaW} W = ${r(qPessoas, 0)} W (sensível).`);

  const equipW = a.equipamentosW > 0 ? a.equipamentosW : area * uso.equipWm2;
  passos.push(
    `Equipamentos/iluminação: ${a.equipamentosW > 0 ? `${r(equipW, 0)} W informados` : `${uso.equipWm2} W/m² × ${r(area, 2)} m² = ${r(equipW, 0)} W`}.`,
  );

  const ach = avancado && a.achInfiltracao ? a.achInfiltracao : uso.ach;
  const vazaoLs = calcAirflowLs(a.ocupantes, uso.lsPorPessoa, volume, ach);
  const qVent = calcVentilationLoad(vazaoLs, deltaT);
  passos.push(
    `Ventilação: V̇ = máx(${a.ocupantes}×${uso.lsPorPessoa}; ${r(volume, 2)} m³×${ach}/3,6) = ${r(vazaoLs, 1)} L/s → 0,33 × ${r(vazaoLs, 1)} × ${r(deltaT, 1)} = ${r(qVent, 0)} W.`,
  );

  const qTotalW = Math.max(0, qTrans) + qSolar + qPessoas + equipW + Math.max(0, qVent);
  const qTotalKW = qTotalW / 1000;

  // Carga latente estimada: ocupantes (≈50 W) + ventilação (fator empírico).
  const qLatenteKW = (a.ocupantes * 50 + 0.8 * vazaoLs * 3) / 1000;

  const margem = Math.max(0, p.margemPct) / 100;
  const qComMargem = qTotalKW * (1 + margem);
  const sel = selectCommercialBTU(qComMargem);
  if (sel.exceeded)
    warnings.push(
      "Carga acima da maior capacidade comercial listada — considere mais de uma máquina ou sistema VRF.",
    );

  const cop = p.cop > 0 ? p.cop : 3.2;
  const consumoKWhMes = (qComMargem / cop) * p.horasDia * p.diasMes;

  passos.push(
    `Total sensível = ${r(qTotalKW, 3)} kW; com margem de ${p.margemPct}% = ${r(qComMargem, 3)} kW (${r(kWparaBTU(qComMargem), 0)} BTU/h).`,
  );

  return {
    nome: a.nome,
    areaM2: area,
    peDireitoM: pd,
    volumeM3: r(volume, 2),
    deltaT: r(deltaT, 1),
    qTransKW: r(Math.max(0, qTrans) / 1000),
    qSolarKW: r(qSolar / 1000),
    qPessoasKW: r(qPessoas / 1000),
    qEquipKW: r(equipW / 1000),
    qVentKW: r(Math.max(0, qVent) / 1000),
    qTotalKW: r(qTotalKW),
    qLatenteKW: r(qLatenteKW),
    qComMargemKW: r(qComMargem),
    capacidadeSugeridaKW: r(sel.kw),
    capacidadeSugeridaBTU: sel.btu,
    vazaoLs: r(vazaoLs, 1),
    ach: r(ach, 2),
    consumoKWhMes: r(consumoKWhMes, 1),
    passos,
    warnings,
  };
}

export function calcTotalLoad(params: HVACParams): HVACResult {
  const ambientes = params.ambientes.map((a) => calcAmbiente(a, params));
  const totais = ambientes.reduce(
    (acc, a) => ({
      areaM2: acc.areaM2 + a.areaM2,
      qTotalKW: acc.qTotalKW + a.qTotalKW,
      qComMargemKW: acc.qComMargemKW + a.qComMargemKW,
      capacidadeTotalBTU: acc.capacidadeTotalBTU + a.capacidadeSugeridaBTU,
      vazaoLs: acc.vazaoLs + a.vazaoLs,
      consumoKWhMes: acc.consumoKWhMes + a.consumoKWhMes,
    }),
    { areaM2: 0, qTotalKW: 0, qComMargemKW: 0, capacidadeTotalBTU: 0, vazaoLs: 0, consumoKWhMes: 0 },
  );

  const warnings: string[] = [];
  if (params.tIntC < 20 || params.tIntC > 26)
    warnings.push("Temperatura interna fora da faixa usual de conforto (20 °C a 26 °C).");
  if (ambientes.length > 1)
    warnings.push(
      "Ambientes com orientações e usos diferentes devem ser zoneados em circuitos/máquinas separados.",
    );

  return {
    ambientes,
    totais: {
      areaM2: r(totais.areaM2, 2),
      qTotalKW: r(totais.qTotalKW),
      qComMargemKW: r(totais.qComMargemKW),
      capacidadeTotalBTU: Math.round(totais.capacidadeTotalBTU),
      vazaoLs: r(totais.vazaoLs, 1),
      consumoKWhMes: r(totais.consumoKWhMes, 1),
    },
    deltaT: r(params.tExtC - params.tIntC, 1),
    warnings,
  };
}

export function toCSVHvac(result: HVACResult): string {
  const head = [
    "ambiente",
    "area_m2",
    "pe_direito_m",
    "delta_t_C",
    "Q_trans_kW",
    "Q_solar_kW",
    "Q_pessoas_kW",
    "Q_equip_kW",
    "Q_vent_kW",
    "Q_total_kW",
    "Q_latente_kW",
    "Q_com_margem_kW",
    "capacidade_kW",
    "capacidade_BTU",
    "ventilacao_Ls",
    "ach",
    "consumo_kWh_mes",
  ].join(",");
  const rows = result.ambientes.map((a) =>
    [
      `"${a.nome.replace(/"/g, "'")}"`,
      a.areaM2,
      a.peDireitoM,
      a.deltaT,
      a.qTransKW,
      a.qSolarKW,
      a.qPessoasKW,
      a.qEquipKW,
      a.qVentKW,
      a.qTotalKW,
      a.qLatenteKW,
      a.qComMargemKW,
      a.capacidadeSugeridaKW,
      a.capacidadeSugeridaBTU,
      a.vazaoLs,
      a.ach,
      a.consumoKWhMes,
    ].join(","),
  );
  const total = [
    '"TOTAL"',
    result.totais.areaM2,
    "",
    result.deltaT,
    "",
    "",
    "",
    "",
    "",
    result.totais.qTotalKW,
    "",
    result.totais.qComMargemKW,
    "",
    result.totais.capacidadeTotalBTU,
    result.totais.vazaoLs,
    "",
    result.totais.consumoKWhMes,
  ].join(",");
  return [head, ...rows, total].join("\n");
}
