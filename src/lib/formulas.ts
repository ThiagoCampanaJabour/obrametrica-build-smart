/**
 * Fórmulas puras usadas pelas calculadoras e conversores.
 * Mantidas fora dos componentes para facilitar testes automatizados.
 */

// ---------- Construção civil ----------

export type ArgamassaTipo = "interno" | "externo" | "porcelanato";
export const ARGAMASSA_CONSUMO_KG_M2: Record<ArgamassaTipo, number> = {
  interno: 5,
  externo: 6,
  porcelanato: 7,
};
export const ARGAMASSA_SACO_KG = 20;

export function calcArgamassa(area: number, tipo: ArgamassaTipo) {
  const total = area * ARGAMASSA_CONSUMO_KG_M2[tipo];
  return { total, sacos: Math.ceil(total / ARGAMASSA_SACO_KG) };
}

export function calcConcreto(comprimento: number, largura: number, espessura: number) {
  return { volume: comprimento * largura * espessura };
}

export function calcPiso(comprimento: number, largura: number, m2Caixa: number) {
  const area = comprimento * largura;
  const areaSobra = area * 1.1;
  return { area, areaSobra, caixas: Math.ceil(areaSobra / m2Caixa) };
}

export type TijoloTipo = "9x19x19" | "11x14x24" | "14x19x29";
export const TIJOLO_CONSUMO_M2: Record<TijoloTipo, number> = {
  "9x19x19": 25,
  "11x14x24": 22,
  "14x19x29": 16,
};

export function calcTijolos(comprimento: number, altura: number, tipo: TijoloTipo) {
  const area = comprimento * altura;
  const qtd = area * TIJOLO_CONSUMO_M2[tipo];
  return { area, qtd: Math.ceil(qtd), qtdPerda: Math.ceil(qtd * 1.1) };
}

export const TINTA_RENDIMENTO_M2_POR_LITRO = 5;

export function calcTinta(comprimento: number, altura: number, demaos: number) {
  const area = comprimento * altura;
  const litros = (area * demaos) / TINTA_RENDIMENTO_M2_POR_LITRO;
  return { area, litros, litrosRec: Math.ceil(litros * 1.1) };
}

/**
 * Calcula a quantidade de areia necessária para obras
 * Densidade padrão: 1.600 kg/m³
 * Saco padrão: 0.02 m³ (20 kg)
 */
export function calcAreia(
  area: number,
  espessura: number,
  proporcaoAreia: number,
  desperdicio: number,
): { volume: number; massa: number; sacos: number } {
  const volumeBase = area * (espessura / 1000); // converte mm para m
  const volumeAreia = volumeBase * proporcaoAreia;
  const volumeFinal = volumeAreia * (1 + desperdicio / 100);
  const massa = volumeFinal * 1600; // densidade 1600 kg/m³
  const sacos = Math.ceil(volumeFinal / 0.02); // 0.02 m³ por saco padrão

  return { volume: volumeFinal, massa, sacos };
}

// ---------- Conversores ----------

export const cmParaPolegada = (cm: number) => cm / 2.54;
export const litrosParaM3 = (l: number) => l / 1000;
export const m2ParaHectare = (m2: number) => m2 / 10000;

export type ResistenciaTipo = "fck20" | "fck25" | "fck30" | "fck35";

interface CimentoDosagem {
  fck20: number;
  fck25: number;
  fck30: number;
  fck35: number;
}

// Dosagem de cimento em kg/m³ baseada em NBR 12655
// Valores técnicos para concreto com abatimento 100-120 mm
const CIMENTO_POR_M3: CimentoDosagem = {
  fck20: 340,
  fck25: 360,
  fck30: 380,
  fck35: 400,
};

/**
 * Calcula a quantidade de brita necessária para concreto ou pavimentação
 * Densidade padrão: 1.500 kg/m³
 * Saco padrão: 0,02 m³ (30 kg)
 *
 * Baseado em consumo médio de mercado para concreto estrutural
 */
export function calcBrita(
  area: number,
  espessura: number,
  proporcaoBrita: number = 0.5, // Proporção de brita no concreto (0-1)
  desperdicio: number = 10, // Percentual de desperdício (0-50)
  densidade: number = 1500, // kg/m³
): { volume: number; volumeFinal: number; sacos: number; massa: number } {
  // Volume base em m³ (espessura em mm, converter para m)
  const volumeBase = area * (espessura / 1000);

  // Volume de brita conforme proporção
  const volumeBrita = volumeBase * proporcaoBrita;

  // Aplicar desperdício
  const volumeFinal = volumeBrita * (1 + desperdicio / 100);

  // Quantidade de sacos (30 kg cada, 0,02 m³)
  const sacos = Math.ceil(volumeFinal / 0.02);

  // Massa em kg
  const massa = volumeFinal * densidade;

  return { volume: volumeFinal, volumeFinal, sacos, massa };
}

/**
 * Calcula a quantidade de telhas necessárias para cobrir um telhado
 * Considera inclinação, beiral, tipo de telha e margem de perda
 *
 * Fórmula:
 * 1. Área de planta = (comprimento + 2×beiral) × (largura + 2×beiral)
 * 2. Fator inclinação = √(1 + (inclinacao% ÷ 100)²)
 * 3. Área inclinada = Área de planta × Fator inclinação
 * 4. Quantidade teórica = Área inclinada × Rendimento (telhas/m²)
 * 5. Quantidade final = Quantidade teórica × (1 + desperdicio/100)
 * 6. Caixas = Quantidade final ÷ Telhas por caixa
 *
 * Baseado em consumo médio de mercado para obras residenciais
 */
export function calcTelhas(
  comprimento: number, // metros
  largura: number, // metros
  inclinacao: number = 30, // percentual
  beiral: number = 0.5, // metros
  rendimento: number = 15, // telhas por m²
  telhasPorCaixa: number = 40, // quantidade por caixa
  desperdicio: number = 10, // percentual
): {
  areaPlanta: number;
  fatorInclinacao: number;
  areaInclinada: number;
  numeroTeorico: number;
  numeroFinal: number;
  numeroCaixas: number;
} {
  // 1. Área de planta (adiciona beiral dos dois lados)
  const areaPlanta = (comprimento + 2 * beiral) * (largura + 2 * beiral);

  // 2. Fator de inclinação (ajusta área plana para área inclinada)
  const inclinacaoDecimal = inclinacao / 100;
  const fatorInclinacao = Math.sqrt(1 + inclinacaoDecimal * inclinacaoDecimal);

  // 3. Área inclinada (área real a cobrir)
  const areaInclinada = areaPlanta * fatorInclinacao;

  // 4. Quantidade teórica (sem desperdício)
  const numeroTeorico = areaInclinada * rendimento;

  // 5. Quantidade final (com desperdício)
  const numeroFinal = numeroTeorico * (1 + desperdicio / 100);

  // 6. Quantidade de caixas
  const numeroCaixas = Math.ceil(numeroFinal / telhasPorCaixa);

  return {
    areaPlanta,
    fatorInclinacao,
    areaInclinada,
    numeroTeorico,
    numeroFinal,
    numeroCaixas,
  };
}

// ========== Reboco ==========

// Densidades e Consumos Padrão
const DENSIDADE_CIMENTO_KG_M3 = 1440; // kg/m³ (cimento ensacado)
const DENSIDADE_AREIA_KG_M3 = 1600; // kg/m³
const DENSIDADE_CAL_KG_M3 = 500; // kg/m³ (cal hidratada ensacada)
const SACO_CIMENTO_KG = 50;
const SACO_CAL_KG = 20; // ou 25 kg, dependendo do fabricante

// Fator de empacotamento/perda para argamassa (considera vazios, perdas, etc.)
const FATOR_EMPACOTAMENTO_ARGAMASSA = 1.3; // 1.2 a 1.4 é comum

// Consumo de massa pronta por m² por mm de espessura
const MASSA_PRONTA_KG_M2_MM = 1.5; // kg/m² por mm de espessura

export type TipoServicoReboco = 'chapisco' | 'reboco-grosso' | 'reboco-fino' | 'reboco-total' | 'massa-corrida';
export type TracoReboco = '1:2' | '1:3' | '1:4' | '1:5' | 'custom';

interface TracoProporcoes {
  cimento: number; // partes
  areia: number; // partes
  cal?: number; // partes (opcional)
}

const TRACOS_REBOCO: Record<TracoReboco, TracoProporcoes> = {
  '1:2': { cimento: 1, areia: 2 }, // Chapisco
  '1:3': { cimento: 1, areia: 3 }, // Reboco externo
  '1:4': { cimento: 1, areia: 4 }, // Reboco interno
  '1:5': { cimento: 1, areia: 5, cal: 0.5 }, // Reboco interno com cal
  'custom': { cimento: 1, areia: 0, cal: 0 }, // Placeholder para custom
};

/**
 * Calcula o volume teórico de argamassa necessário.
 * @param areaM2 Área a rebocar em m².
 * @param espessuraMM Espessura do reboco em mm.
 * @returns Volume teórico em m³.
 */
export function calcularVolumeArgamassa(areaM2: number, espessuraMM: number): number {
  if (areaM2 <= 0 || espessuraMM <= 0) {
    throw new Error("Área e espessura devem ser maiores que zero.");
  }
  return areaM2 * (espessuraMM / 1000); // Converte mm para m
}

/**
 * Converte um traço string (ex: "1:4:0.5") em proporções numéricas.
 * @param tracoStr String do traço (ex: "1:4" ou "1:4:0.5").
 * @returns Objeto com proporções de cimento, areia e cal.
 */
export function converterTracoEmProporcoes(tracoStr: string): TracoProporcoes {
  const partes = tracoStr.split(':').map(Number);
  if (partes.length < 2 || partes.some(isNaN) || partes[0] <= 0) {
    throw new Error("Formato de traço inválido. Use 'cimento:areia' ou 'cimento:areia:cal'.");
  }
  return {
    cimento: partes[0],
    areia: partes[1],
    cal: partes[2] || 0,
  };
}

/**
 * Calcula os materiais (cimento, areia, cal) para um dado volume de argamassa e traço.
 * @param volumeArgamassaM3 Volume de argamassa em m³.
 * @param tracoProporcoes Proporções do traço (cimento:areia:cal).
 * @param desperdicioPct Percentual de desperdício (0-100).
 * @returns Objeto com massa de cimento (kg), areia (m³), cal (kg) e sacos.
 */
export function calcularMateriaisArgamassa(
  volumeArgamassaM3: number,
  tracoProporcoes: TracoProporcoes,
  desperdicioPct: number,
  fatorEmpacotamento: number = FATOR_EMPACOTAMENTO_ARGAMASSA
): {
  cimentoKg: number;
  cimentoSacos: number;
  areiaM3: number;
  areiaKg: number;
  calKg: number;
  calSacos: number;
} {
  if (volumeArgamassaM3 <= 0) {
    throw new Error("Volume de argamassa deve ser maior que zero.");
  }
  if (desperdicioPct < 0 || desperdicioPct > 100) {
    throw new Error("Desperdício deve ser entre 0 e 100.");
  }

  const { cimento, areia, cal = 0 } = tracoProporcoes;
  const somaPartes = cimento + areia + cal;

  if (somaPartes <= 0) {
    throw new Error("A soma das partes do traço deve ser maior que zero.");
  }

  // Volume de argamassa ajustado pelo fator de empacotamento e desperdício
  const volumeAjustado = volumeArgamassaM3 * fatorEmpacotamento * (1 + desperdicioPct / 100);

  // Proporções em volume
  const proporcaoCimentoVol = cimento / somaPartes;
  const proporcaoAreiaVol = areia / somaPartes;
  const proporcaoCalVol = cal / somaPartes;

  // Cimento
  const cimentoKg = volumeAjustado * proporcaoCimentoVol * DENSIDADE_CIMENTO_KG_M3;
  const cimentoSacos = Math.ceil(cimentoKg / SACO_CIMENTO_KG);

  // Areia
  const areiaM3 = volumeAjustado * proporcaoAreiaVol;
  const areiaKg = areiaM3 * DENSIDADE_AREIA_KG_M3;

  // Cal
  const calKg = volumeAjustado * proporcaoCalVol * DENSIDADE_CAL_KG_M3;
  const calSacos = Math.ceil(calKg / SACO_CAL_KG);

  return { cimentoKg, cimentoSacos, areiaM3, areiaKg, calKg, calSacos };
}

/**
 * Calcula a massa de massa pronta necessária.
 * @param areaM2 Área a rebocar em m².
 * @param espessuraMM Espessura em mm.
 * @param desperdicioPct Percentual de desperdício (0-100).
 * @returns Massa de massa pronta em kg.
 */
export function calcularMassaPronta(areaM2: number, espessuraMM: number, desperdicioPct: number): number {
  if (areaM2 <= 0 || espessuraMM <= 0) {
    throw new Error("Área e espessura devem ser maiores que zero.");
  }
  if (desperdicioPct < 0 || desperdicioPct > 100) {
    throw new Error("Desperdício deve ser entre 0 e 100.");
  }
  const massaTeorica = areaM2 * espessuraMM * MASSA_PRONTA_KG_M2_MM;
  return massaTeorica * (1 + desperdicioPct / 100);
}

/**
 * Função principal para calcular materiais de reboco.
 */
export function calcReboco(params: {
  tipoServico: TipoServicoReboco;
  areaM2: number;
  espessuraMM: number;
  traco: TracoReboco;
  tracoCustom?: string; // "1:4:0.5"
  desperdicioPct: number;
  fatorEmpacotamento?: number;
}): {
  volumeArgamassaM3: number;
  cimentoKg: number;
  cimentoSacos: number;
  areiaM3: number;
  areiaKg: number;
  calKg: number;
  calSacos: number;
  massaProntaKg: number;
} {
  let volumeArgamassaM3 = 0;
  let cimentoKg = 0;
  let cimentoSacos = 0;
  let areiaM3 = 0;
  let areiaKg = 0;
  let calKg = 0;
  let calSacos = 0;
  let massaProntaKg = 0;

  const { tipoServico, areaM2, espessuraMM, traco, tracoCustom, desperdicioPct, fatorEmpacotamento } = params;

  if (tipoServico === 'massa-corrida') {
    massaProntaKg = calcularMassaPronta(areaM2, espessuraMM, desperdicioPct);
  } else if (tipoServico === 'reboco-total') {
    // Chapisco (ex: 5mm, 1:2)
    const chapiscoVol = calcularVolumeArgamassa(areaM2, 5);
    const chapiscoTraco = TRACOS_REBOCO['1:2'];
    const chapiscoMateriais = calcularMateriaisArgamassa(chapiscoVol, chapiscoTraco, desperdicioPct, fatorEmpacotamento);
    cimentoKg += chapiscoMateriais.cimentoKg;
    cimentoSacos += chapiscoMateriais.cimentoSacos;
    areiaM3 += chapiscoMateriais.areiaM3;
    areiaKg += chapiscoMateriais.areiaKg;
    calKg += chapiscoMateriais.calKg;
    calSacos += chapiscoMateriais.calSacos;
    volumeArgamassaM3 += chapiscoVol;

    // Reboco Grosso (ex: 15mm, 1:4)
    const rebocoGrossoVol = calcularVolumeArgamassa(areaM2, 15);
    const rebocoGrossoTraco = TRACOS_REBOCO['1:4'];
    const rebocoGrossoMateriais = calcularMateriaisArgamassa(rebocoGrossoVol, rebocoGrossoTraco, desperdicioPct, fatorEmpacotamento);
    cimentoKg += rebocoGrossoMateriais.cimentoKg;
    cimentoSacos += rebocoGrossoMateriais.cimentoSacos;
    areiaM3 += rebocoGrossoMateriais.areiaM3;
    areiaKg += rebocoGrossoMateriais.areiaKg;
    calKg += rebocoGrossoMateriais.calKg;
    calSacos += rebocoGrossoMateriais.calSacos;
    volumeArgamassaM3 += rebocoGrossoVol;

    // Reboco Fino (ex: 5mm, 1:5:0.5)
    const rebocoFinoVol = calcularVolumeArgamassa(areaM2, 5);
    const rebocoFinoTraco = TRACOS_REBOCO['1:5'];
    const rebocoFinoMateriais = calcularMateriaisArgamassa(rebocoFinoVol, rebocoFinoTraco, desperdicioPct, fatorEmpacotamento);
    cimentoKg += rebocoFinoMateriais.cimentoKg;
    cimentoSacos += rebocoFinoMateriais.cimentoSacos;
    areiaM3 += rebocoFinoMateriais.areiaM3;
    areiaKg += rebocoFinoMateriais.areiaKg;
    calKg += rebocoFinoMateriais.calKg;
    calSacos += rebocoFinoMateriais.calSacos;
    volumeArgamassaM3 += rebocoFinoVol;

  } else {
    volumeArgamassaM3 = calcularVolumeArgamassa(areaM2, espessuraMM);
    let proporcoes: TracoProporcoes;
    if (traco === 'custom' && tracoCustom) {
      proporcoes = converterTracoEmProporcoes(tracoCustom);
    } else {
      proporcoes = TRACOS_REBOCO[traco];
    }

    const materiais = calcularMateriaisArgamassa(volumeArgamassaM3, proporcoes, desperdicioPct, fatorEmpacotamento);
    cimentoKg = materiais.cimentoKg;
    cimentoSacos = materiais.cimentoSacos;
    areiaM3 = materiais.areiaM3;
    areiaKg = materiais.areiaKg;
    calKg = materiais.calKg;
    calSacos = materiais.calSacos;
  }

  return {
    volumeArgamassaM3,
    cimentoKg,
    cimentoSacos,
    areiaM3,
    areiaKg,
    calKg,
    calSacos,
    massaProntaKg,
  };
}

/**
 * Calcula a quantidade de blocos e argamassa para alvenaria.
 *
 * Considera:
 * - Dimensões da parede (largura x altura ou área total)
 * - Dimensões do bloco (comprimento x altura)
 * - Espessura da junta (horizontal e vertical)
 * - Área de vãos (portas/janelas) para subtração
 * - Desperdício
 *
 * Fórmulas:
 * 1. Área útil do bloco com junta:
 *    - Altura útil = altura_bloco + espessura_junta_vertical
 *    - Comprimento útil = comprimento_bloco + espessura_junta_horizontal
 *    - Área útil por bloco = (altura_útil / 1000) * (comprimento_útil / 1000)
 * 2. Quantidade de blocos por m²:
 *    - Blocos/m² = 1 / Área útil por bloco
 * 3. Área líquida da parede:
 *    - Área líquida = (largura_parede * altura_parede) - área_vãos
 * 4. Número teórico de blocos:
 *    - Número teórico = Área líquida * Blocos/m²
 * 5. Número final de blocos (com desperdício):
 *    - Número final = ceil(Número teórico * (1 + desperdício/100))
 * 6. Volume de argamassa:
 *    - Volume por bloco = (comprimento_bloco * largura_bloco * espessura_junta_horizontal) + (comprimento_bloco * largura_bloco * espessura_junta_vertical)
 *    - Volume total de argamassa = (Número teórico * Volume por bloco) / 1_000_000_000 (para m³)
 *    - Ou, se preferir, um fator de consumo por m² de parede.
 *
 * Convenções:
 * - Todas as dimensões de bloco e junta são em milímetros (mm).
 * - Largura e altura da parede em metros (m).
 * - Área de vãos em metros quadrados (m²).
 * - Desperdício em percentual (%).
 */
export function calcBlocos(
  larguraParede: number, // m
  alturaParede: number, // m
  comprimentoBloco: number, // mm
  alturaBloco: number, // mm
  larguraBloco: number, // mm (necessário para argamassa)
  espessuraJuntaHorizontal: number, // mm
  espessuraJuntaVertical: number, // mm
  areaVao: number = 0, // m²
  desperdicio: number = 7, // %
): {
  areaLiquidaParede: number;
  areaUtilBlocoM2: number;
  blocosPorM2: number;
  numeroTeoricoBlocos: number;
  numeroFinalBlocos: number;
  volumeArgamassaM3: number;
} {
  // 1. Área líquida da parede (m²)
  const areaTotalParede = larguraParede * alturaParede;
  const areaLiquidaParede = Math.max(0, areaTotalParede - areaVao);

  // 2. Dimensões úteis do bloco com junta (mm)
  const alturaUtilBloco = alturaBloco + espessuraJuntaVertical;
  const comprimentoUtilBloco = comprimentoBloco + espessuraJuntaHorizontal;

  // 3. Área útil do bloco com junta (m²)
  const areaUtilBlocoM2 = (alturaUtilBloco / 1000) * (comprimentoUtilBloco / 1000);

  // 4. Quantidade de blocos por m²
  const blocosPorM2 = areaUtilBlocoM2 > 0 ? 1 / areaUtilBlocoM2 : 0;

  // 5. Número teórico de blocos
  const numeroTeoricoBlocos = areaLiquidaParede * blocosPorM2;

  // 6. Número final de blocos (com desperdício)
  const numeroFinalBlocos = Math.ceil(numeroTeoricoBlocos * (1 + desperdicio / 100));

  // 7. Volume de argamassa (simplificado: por m² de parede, ou por volume de junta)
  // Vamos calcular o volume de argamassa preenchendo as juntas de cada bloco.
  // Volume de argamassa por bloco:
  // - Junta horizontal: comprimento_bloco * largura_bloco * espessura_junta_horizontal
  // - Junta vertical: altura_bloco * largura_bloco * espessura_junta_vertical
  // Simplificando para o volume das juntas por bloco (considerando que a argamassa preenche a largura do bloco)
  // Volume de argamassa por bloco em mm³
  const volumeArgamassaPorBlocoMm3 =
    (comprimentoBloco * larguraBloco * espessuraJuntaHorizontal) + // argamassa na base do bloco
    (alturaBloco * larguraBloco * espessuraJuntaVertical); // argamassa na lateral do bloco

  // Volume total de argamassa em mm³
  const volumeTotalArgamassaMm3 = numeroTeoricoBlocos * volumeArgamassaPorBlocoMm3;

  // Converter para m³
  const volumeArgamassaM3 = volumeTotalArgamassaMm3 / 1_000_000_000; // 1 m³ = 10^9 mm³

  return {
    areaLiquidaParede,
    areaUtilBlocoM2,
    blocosPorM2,
    numeroTeoricoBlocos,
    numeroFinalBlocos,
    volumeArgamassaM3,
  };
}

/**
 * Constante da densidade do aço em kg/m³.
 * Aproximadamente 7850 kg/m³ ou 7.85 g/cm³.
 */
const DENSIDADE_ACO_KG_M3 = 7850;

/**
 * Calcula a área transversal de uma barra de aço.
 * @param diametro_mm Diâmetro da barra em milímetros.
 * @returns Área transversal em mm².
 */
export function areaTransversalAco(diametro_mm: number): number {
  if (diametro_mm <= 0) {
    throw new Error("O diâmetro da barra deve ser maior que zero.");
  }
  const raio_mm = diametro_mm / 2;
  return Math.PI * raio_mm * raio_mm;
}

/**
 * Calcula a massa específica por metro de uma barra de aço.
 * @param diametro_mm Diâmetro da barra em milímetros.
 * @returns Massa por metro em kg/m.
 */
export function massaPorMetroAco(diametro_mm: number): number {
  const area_mm2 = areaTransversalAco(diametro_mm);
  // Converter área de mm² para m² (dividir por 1_000_000)
  // Multiplicar pela densidade do aço em kg/m³
  return (area_mm2 / 1_000_000) * DENSIDADE_ACO_KG_M3;
}

/**
 * Calcula a massa total de um conjunto de barras de aço.
 * @param items Array de objetos com diâmetro (mm), quantidade e comprimento (m) de cada barra.
 * @returns Massa total em kg.
 */
export function massaTotalAco(
  items: { diametro_mm: number; quantidade: number; comprimento_m: number }[]
): number {
  let massaTotal = 0;
  for (const item of items) {
    if (item.diametro_mm <= 0 || item.quantidade <= 0 || item.comprimento_m <= 0) {
      throw new Error("Diâmetro, quantidade e comprimento devem ser maiores que zero.");
    }
    const massaPorM = massaPorMetroAco(item.diametro_mm);
    massaTotal += item.quantidade * item.comprimento_m * massaPorM;
  }
  return massaTotal;
}

/**
 * Aplica um percentual de desperdício à massa total.
 * @param massa_kg Massa em kg.
 * @param desperdicio_pct Percentual de desperdício (ex: 5 para 5%).
 * @returns Massa final com desperdício em kg.
 */
export function aplicarDesperdicioAco(massa_kg: number, desperdicio_pct: number): number {
  if (massa_kg < 0) {
    throw new Error("A massa não pode ser negativa.");
  }
  if (desperdicio_pct < 0 || desperdicio_pct > 100) {
    throw new Error("O percentual de desperdício deve ser entre 0 e 100.");
  }
  return massa_kg * (1 + desperdicio_pct / 100);
}

/**
 * Calcula o número de vergalhões comerciais necessários para um comprimento total.
 * @param comprimentoTotal_m Comprimento total necessário em metros.
 * @param comprimentoVergalhaoPadrao_m Comprimento de um vergalhão comercial padrão em metros (ex: 12m).
 * @returns Número de vergalhões (arredondado para cima).
 */
export function numeroVergalhoesAco(
  comprimentoTotal_m: number,
  comprimentoVergalhaoPadrao_m: number = 12
): number {
  if (comprimentoTotal_m < 0 || comprimentoVergalhaoPadrao_m <= 0) {
    throw new Error("Comprimentos devem ser maiores que zero.");
  }
  return Math.ceil(comprimentoTotal_m / comprimentoVergalhaoPadrao_m);
}

/**
 * Agrupa e soma os comprimentos totais por diâmetro para uma lista de itens de aço.
 * @param items Array de objetos com diâmetro (mm), quantidade e comprimento (m) de cada barra.
 * @returns Objeto onde a chave é o diâmetro (string) e o valor é o comprimento total (m).
 */
export function agruparComprimentosAco(
  items: { diametro_mm: number; quantidade: number; comprimento_m: number }[]
): Record<string, number> {
  const agrupado: Record<string, number> = {};
  for (const item of items) {
    const diametroStr = String(item.diametro_mm);
    if (!agrupado[diametroStr]) {
      agrupado[diametroStr] = 0;
    }
    agrupado[diametroStr] += item.quantidade * item.comprimento_m;
  }
  return agrupado;
}

/**
 * Calcula a quantidade de barras de um determinado diâmetro para atingir uma área de aço (As) necessária.
 * @param areaAcoNecessaria_cm2 Área de aço necessária em cm².
 * @param diametro_mm Diâmetro da barra em milímetros.
 * @returns Número de barras (arredondado para cima).
 */
export function quantidadeBarrasPorAreaAco(
  areaAcoNecessaria_cm2: number,
  diametro_mm: number
): number {
  if (areaAcoNecessaria_cm2 <= 0 || diametro_mm <= 0) {
    throw new Error("Área de aço e diâmetro devem ser maiores que zero.");
  }
  const areaAcoNecessaria_mm2 = areaAcoNecessaria_cm2 * 100; // 1 cm² = 100 mm²
  const areaBarra_mm2 = areaTransversalAco(diametro_mm);
  return Math.ceil(areaAcoNecessaria_mm2 / areaBarra_mm2);
} // <-- CORRIGIDO AQUI: Removido o ';' e a chave '}' extra.

// ========== Fôrma ==========

// Dimensões padrão de um painel de compensado (m)
const COMPENSADO_LARGURA_PADRAO_M = 1.22;
const COMPENSADO_COMPRIMENTO_PADRAO_M = 2.44;
const COMPENSADO_AREA_PADRAO_M2 = COMPENSADO_LARGURA_PADRAO_M * COMPENSADO_COMPRIMENTO_PADRAO_M;

// Coeficientes de consumo (aproximados)
const PREGOS_POR_M2_FORMA = 0.2; // kg de pregos por m² de forma
const OLEO_DESMOLDANTE_POR_M2_FORMA = 0.05; // litros de óleo por m² de forma

/**
 * Calcula a área de fôrma necessária para diferentes elementos estruturais.
 * @param tipoElemento Tipo de elemento estrutural ('viga', 'pilar', 'laje-borda', 'parede', 'personalizada').
 * @param dimensoes Objeto com as dimensões relevantes para o tipo de elemento.
 * @returns Área total de fôrma em m².
 */
export function calcularAreaForma(
  tipoElemento: 'viga' | 'pilar' | 'laje-borda' | 'parede' | 'personalizada',
  dimensoes: {
    comprimento?: number; // m
    largura?: number; // m (para viga/pilar/parede)
    altura?: number; // m (para viga/pilar/parede)
    espessura?: number; // m (para laje/parede)
    areaTotalM2?: number; // m² (para personalizada)
  }
): number {
  let area = 0;

  switch (tipoElemento) {
    case 'viga':
      if (!dimensoes.comprimento || !dimensoes.largura || !dimensoes.altura) {
        throw new Error("Para viga, informe comprimento, largura e altura.");
      }
      // 2 faces laterais + 1 face inferior (base)
      area = (2 * dimensoes.comprimento * dimensoes.altura) + (dimensoes.comprimento * dimensoes.largura);
      break;
    case 'pilar':
      if (!dimensoes.comprimento || !dimensoes.largura || !dimensoes.altura) {
        throw new Error("Para pilar, informe comprimento, largura e altura.");
      }
      // 4 faces laterais
      area = 2 * (dimensoes.comprimento + dimensoes.largura) * dimensoes.altura;
      break;
    case 'laje-borda':
      if (!dimensoes.comprimento || !dimensoes.espessura) {
        throw new Error("Para laje de borda, informe comprimento e espessura.");
      }
      // Apenas a face lateral da borda
      area = dimensoes.comprimento * dimensoes.espessura;
      break;
    case 'parede':
      if (!dimensoes.comprimento || !dimensoes.altura || !dimensoes.espessura) {
        throw new Error("Para parede, informe comprimento, altura e espessura.");
      }
      // 2 faces laterais da parede
      area = 2 * dimensoes.comprimento * dimensoes.altura;
      break;
    case 'personalizada':
      if (!dimensoes.areaTotalM2) {
        throw new Error("Para fôrma personalizada, informe a área total em m².");
      }
      area = dimensoes.areaTotalM2;
      break;
    default:
      throw new Error("Tipo de elemento estrutural inválido.");
  }

  if (area <= 0) {
    throw new Error("A área calculada da fôrma deve ser maior que zero.");
  }
  return area;
}

/**
 * Calcula o número de painéis de compensado necessários.
 * @param areaTotalFormaM2 Área total da fôrma em m².
 * @param areaPainelM2 Área de um painel de compensado em m².
 * @returns Número de painéis (arredondado para cima).
 */
export function calcularPaineisCompensado(
  areaTotalFormaM2: number,
  areaPainelM2: number = COMPENSADO_AREA_PADRAO_M2
): number {
  if (areaTotalFormaM2 <= 0 || areaPainelM2 <= 0) {
    throw new Error("Área total da fôrma e área do painel devem ser maiores que zero.");
  }
  return Math.ceil(areaTotalFormaM2 / areaPainelM2);
}

/**
 * Calcula o comprimento total de tábuas para caixilho/estrutura da fôrma.
 * @param perimetroUtilM Perímetro útil do elemento a ser formado (m).
 * @param numeroFiadas Quantidade de fiadas de tábuas (ex: 2 para base e topo).
 * @param comprimentoTabuaPadraoM Comprimento padrão das tábuas comerciais (m).
 * @returns Comprimento total de tábuas em metros.
 */
export function calcularComprimentoTabuas(
  perimetroUtilM: number,
  numeroFiadas: number,
  comprimentoTabuaPadraoM: number = 3
): number {
  if (perimetroUtilM <= 0 || numeroFiadas <= 0 || comprimentoTabuaPadraoM <= 0) {
    throw new Error("Perímetro, número de fiadas e comprimento da tábua devem ser maiores que zero.");
  }
  const comprimentoTotalNecessario = perimetroUtilM * numeroFiadas;
  // Arredonda para cima para garantir que haja tábuas suficientes, considerando cortes
  return Math.ceil(comprimentoTotalNecessario / comprimentoTabuaPadraoM) * comprimentoTabuaPadraoM;
}

/**
 * Estima o número de escoras necessárias.
 * @param comprimentoElementoM Comprimento do elemento a ser escorado (m).
 * @param larguraElementoM Largura do elemento a ser escorado (m).
 * @param espacamentoEscorasM Espaçamento entre as escoras (m).
 * @returns Número de escoras (arredondado para cima).
 */
export function calcularNumeroEscoras(
  comprimentoElementoM: number,
  larguraElementoM: number,
  espacamentoEscorasM: number
): number {
  if (comprimentoElementoM <= 0 || larguraElementoM <= 0 || espacamentoEscorasM <= 0) {
    throw new Error("Comprimento, largura do elemento e espaçamento das escoras devem ser maiores que zero.");
  }
  // Linhas de escoramento: 1 para cada 0.5m de largura, mínimo 2
  const linhasEscoramento = Math.max(2, Math.ceil(larguraElementoM / 0.5));
  const escorasPorLinha = Math.ceil(comprimentoElementoM / espacamentoEscorasM);
  return escorasPorLinha * linhasEscoramento;
}

/**
 * Estima o consumo de pregos/parafusos.
 * @param areaTotalFormaM2 Área total da fôrma em m².
 * @param coeficientePregosKgM2 Coeficiente de pregos em kg por m² de fôrma.
 * @returns Massa de pregos em kg.
 */
export function estimarConsumoPregos(
  areaTotalFormaM2: number,
  coeficientePregosKgM2: number = PREGOS_POR_M2_FORMA
): number {
  if (areaTotalFormaM2 < 0 || coeficientePregosKgM2 < 0) {
    throw new Error("Área da fôrma e coeficiente de pregos não podem ser negativos.");
  }
  return areaTotalFormaM2 * coeficientePregosKgM2;
}

/**
 * Estima o consumo de óleo desmoldante.
 * @param areaTotalFormaM2 Área total da fôrma em m².
 * @param coeficienteOleoLM2 Coeficiente de óleo em litros por m² de fôrma.
 * @returns Volume de óleo em litros.
 */
export function estimarConsumoOleoDesmoldante(
  areaTotalFormaM2: number,
  coeficienteOleoLM2: number = OLEO_DESMOLDANTE_POR_M2_FORMA
): number {
  if (areaTotalFormaM2 < 0 || coeficienteOleoLM2 < 0) {
    throw new Error("Área da fôrma e coeficiente de óleo não podem ser negativos.");
  }
  return areaTotalFormaM2 * coeficienteOleoLM2;
}

/**
 * Aplica um percentual de desperdício a um valor.
 * @param valor Valor a ser ajustado.
 * @param desperdicio_pct Percentual de desperdício (ex: 10 para 10%).
 * @returns Valor ajustado com desperdício.
 */
export function aplicarDesperdicioForma(valor: number, desperdicio_pct: number): number {
  if (valor < 0) {
    throw new Error("O valor não pode ser negativo.");
  }
  if (desperdicio_pct < 0 || desperdicio_pct > 100) {
    throw new Error("O percentual de desperdício deve ser entre 0 e 100.");
  }
  return valor * (1 + desperdicio_pct / 100);
}

/**
 * Função principal para calcular materiais de fôrma.
 */
export function calcForma(params: {
  tipoElemento: 'viga' | 'pilar' | 'laje-borda' | 'parede' | 'personalizada';
  dimensoes: {
    comprimento?: number; // m
    largura?: number; // m
    altura?: number; // m
    espessura?: number; // m
    areaTotalM2?: number; // m²
  };
  espessuraCompensadoMM: number; // mm
  larguraTabuaMM: number; // mm
  espessuraTabuaMM: number; // mm
  espacamentoEscorasM: number; // m
  desperdicioPct: number; // %
  reaproveitavel: boolean; // Se a fôrma será reaproveitada
}): {
  areaTotalFormaM2: number;
  paineisCompensado: number;
  comprimentoTabuasM: number;
  numeroEscoras: number;
  massaPregosKg: number;
  oleoDesmoldanteL: number;
} {
  // 1. Calcular área total da fôrma
  const areaTotalFormaM2 = aplicarDesperdicioForma(
    calcularAreaForma(params.tipoElemento, params.dimensoes),
    params.desperdicioPct
  );

  // 2. Calcular painéis de compensado
  // Assumindo painel padrão de 1.22 x 2.44 m
  const paineisCompensado = calcularPaineisCompensado(areaTotalFormaM2);

  // 3. Calcular comprimento de tábuas
  let perimetroUtilM = 0;
  let numeroFiadasTabuas = 0;

  if (params.tipoElemento === 'viga') {
    perimetroUtilM = 2 * (params.dimensoes.largura! + params.dimensoes.altura!); // Perímetro da seção transversal
    numeroFiadasTabuas = 2; // Ex: uma fiada em cima e uma embaixo para o caixilho
  } else if (params.tipoElemento === 'pilar') {
    perimetroUtilM = 2 * (params.dimensoes.largura! + params.dimensoes.comprimento!); // Perímetro da seção transversal
    numeroFiadasTabuas = 2;
  } else if (params.tipoElemento === 'parede') {
    perimetroUtilM = 2 * (params.dimensoes.comprimento! + params.dimensoes.altura!); // Perímetro da parede
    numeroFiadasTabuas = 2;
  } else if (params.tipoElemento === 'laje-borda') {
    perimetroUtilM = params.dimensoes.comprimento!; // Apenas o comprimento da borda
    numeroFiadasTabuas = 1; // Apenas uma fiada para a borda
  } else if (params.tipoElemento === 'personalizada') {
    // Para personalizada, é difícil estimar tábuas sem mais detalhes.
    // Vamos usar uma estimativa baseada na área, assumindo um perímetro médio.
    // Ou, para simplificar, podemos pedir um perímetro ou um fator de tábuas por m² de forma.
    // Por enquanto, vamos usar um coeficiente simples: 10m de tábua por m² de forma personalizada.
    perimetroUtilM = areaTotalFormaM2 * 10; // Estimativa
    numeroFiadasTabuas = 1;
  }

  const comprimentoTabuasM = aplicarDesperdicioForma(
    calcularComprimentoTabuas(perimetroUtilM, numeroFiadasTabuas),
    params.desperdicioPct
  );

  // 4. Calcular número de escoras
  let numeroEscoras = 0;
  if (params.tipoElemento === 'viga' || params.tipoElemento === 'laje-borda') {
    numeroEscoras = aplicarDesperdicioForma(
      calcularNumeroEscoras(
        params.dimensoes.comprimento!,
        params.dimensoes.largura || params.dimensoes.espessura!, // Para laje-borda, usa espessura como largura
        params.espacamentoEscorasM
      ),
      params.desperdicioPct
    );
  } else if (params.tipoElemento === 'pilar' || params.tipoElemento === 'parede') {
    // Pilares e paredes geralmente não usam escoras no mesmo sentido de vigas/lajes,
    // mas sim travamentos laterais. Para simplificar, vamos estimar escoras para o topo
    // ou para travamento a cada X metros de altura/comprimento.
    // Por enquanto, vamos deixar 0 para pilares/paredes ou usar uma estimativa simplificada.
    // Para este MVP, vamos considerar escoras apenas para elementos horizontais (viga, laje).
    numeroEscoras = 0; // Ajustar conforme necessidade de detalhamento
  } else if (params.tipoElemento === 'personalizada') {
    // Para personalizada, sem detalhes, não é possível estimar escoras.
    numeroEscoras = 0;
  }


  // 5. Estimar consumo de pregos
  const massaPregosKg = aplicarDesperdicioForma(
    estimarConsumoPregos(areaTotalFormaM2),
    params.desperdicioPct
  );

  // 6. Estimar consumo de óleo desmoldante
  const oleoDesmoldanteL = aplicarDesperdicioForma(
    estimarConsumoOleoDesmoldante(areaTotalFormaM2),
    params.desperdicioPct
  );

  return {
    areaTotalFormaM2,
    paineisCompensado: Math.ceil(paineisCompensado), // Sempre painéis inteiros
    comprimentoTabuasM: comprimentoTabuasM,
    numeroEscoras: Math.ceil(numeroEscoras), // Sempre escoras inteiras
    massaPregosKg: massaPregosKg,
    oleoDesmoldanteL: oleoDesmoldanteL,
  };
}

// ========== Ar-Condicionado ==========

/**
 * Calcula o volume do ambiente
 * volume = área × pé-direito
 */
export function calcularVolumeAC(area: number, peDireito: number): number {
  return area * peDireito;
}

/**
 * Calcula ganho de calor por pessoas
 * Cada pessoa gera aproximadamente 100 W de calor
 */
export function calcularGanhosPorPessoasAC(numeroPessoas: number): number {
  return numeroPessoas * 100; // W
}

/**
 * Calcula ganho de calor por equipamentos eletrônicos
 * Cada equipamento (TV, computador, etc) gera aproximadamente 300 W
 */
export function calcularGanhosPorEquipamentosAC(numeroEquipamentos: number): number {
  return numeroEquipamentos * 300; // W
}

/**
 * Calcula ganho de calor por janelas (exposição solar)
 * Baseado em: área de janela × fator de exposição
 */
export function calcularGanhosPorJanelasAC(
  numeroJanelas: number,
  tamanhoJanelas: "pequenas" | "medianas" | "grandes",
  exposicaoSolar: "baixa" | "media" | "alta",
): number {
  // Área aproximada por tipo de janela (m²)
  const areaJanelaPorTipo: Record<string, number> = {
    pequenas: 0.5, // 50×100 cm
    medianas: 1.0, // 100×100 cm
    grandes: 1.5, // 100×150 cm
  };

  // Fator de ganho por exposição (W/m² de janela)
  const fatorExposicao: Record<string, number> = {
    baixa: 200, // W/m² (sombra)
    media: 400, // W/m²
    alta: 600, // W/m² (sol direto)
  };

  const areaTotal = numeroJanelas * areaJanelaPorTipo[tamanhoJanelas];
  const fator = fatorExposicao[exposicaoSolar];

  return areaTotal * fator;
}

/**
 * Obtém fator multiplicador para isolamento térmico
 */
export function obterFatorIsolamentoAC(isolamento: "bom" | "regular" | "ruim"): number {
  const fatores: Record<string, number> = {
    bom: 1.0, // Sem ajuste
    regular: 1.15, // +15%
    ruim: 1.3, // +30%
  };
  return fatores[isolamento];
}

/**
 * Obtém fator multiplicador para exposição solar
 */
export function obterFatorExposicaoAC(exposicao: "baixa" | "media" | "alta"): number {
  const fatores: Record<string, number> = {
    baixa: 1.0,
    media: 1.1, // +10%
    alta: 1.2, // +20%
  };
  return fatores[exposicao];
}

/**
 * Converte Watts para BTU/h
 * 1 W = 3.41214 BTU/h
 */
export function converterWparaBTUAC(watts: number): number {
  return watts * 3.41214;
}

/**
 * Converte BTU/h para Watts
 */
export function converterBTUparaWAC(btu: number): number {
  return btu / 3.41214;
}

/**
 * Converte Watts para kW
 */
export function converterWparaKWAC(watts: number): number {
  return watts / 1000;
}

/**
 * Converte BTU/h para kW
 */
export function converterBTUparaKWAC(btu: number): number {
  return converterWparaKWAC(converterBTUparaWAC(btu));
}

/**
 * Calcula carga térmica usando método simplificado
 * Baseado em: carga por m² × área × fatores de ajuste
 */
export function calcularCargaSimplificadaAC(
  area: number,
  exposicaoSolar: "baixa" | "media" | "alta",
  isolamentoTermico: "bom" | "regular" | "ruim",
): number {
  // Carga base: 600 BTU/h por m² (residencial padrão)
  const cargaBaseW = converterBTUparaWAC(600);

  // Aplicar fatores
  const fatorIsolamento = obterFatorIsolamentoAC(isolamentoTermico);
  const fatorExposicao = obterFatorExposicaoAC(exposicaoSolar);

  // Carga total em W
  return area * cargaBaseW * fatorIsolamento * fatorExposicao;
}

/**
 * Calcula carga térmica usando método volumétrico
 * Baseado em: volume × coef_volume + ganhos por pessoas + equipamentos + janelas
 */
export function calcularCargaVolumetricaAC(
  volume: number,
  numeroPessoas: number,
  numeroEquipamentos: number,
  numeroJanelas: number,
  tamanhoJanelas: "pequenas" | "medianas" | "grandes",
  exposicaoSolar: "baixa" | "media" | "alta",
  isolamentoTermico: "bom" | "regular" | "ruim",
): number {
  // Carga base por volume: 40 W/m³
  const cargaBase = volume * 40;

  // Ganhos internos
  const cargaPessoas = calcularGanhosPorPessoasAC(numeroPessoas);
  const cargaEquipamentos = calcularGanhosPorEquipamentosAC(numeroEquipamentos);
  const cargaJanelas = calcularGanhosPorJanelasAC(numeroJanelas, tamanhoJanelas, exposicaoSolar);

  // Soma de ganhos
  const ganhosTotais = cargaPessoas + cargaEquipamentos + cargaJanelas;

  // Aplicar fatores de ajuste
  const fatorIsolamento = obterFatorIsolamentoAC(isolamentoTermico);
  const fatorExposicao = obterFatorExposicaoAC(exposicaoSolar);

  // Carga total em W
  return (cargaBase + ganhosTotais) * fatorIsolamento * fatorExposicao;
}

/**
 * Sugere capacidades comerciais baseado na carga calculada
 */
export function sugerirCapacidadesAC(cargaBTU: number): {
  recomendada: number;
  alternativas: number[];
} {
  const capacidadesComerciais = [7000, 9000, 12000, 18000, 24000, 30000, 36000, 42000, 48000, 60000];

  // Encontrar a capacidade recomendada (menor que seja >= carga)
  const recomendada = capacidadesComerciais.find((cap) => cap >= cargaBTU) || 60000;

  // Alternativas: recomendada e próximas
  const indice = capacidadesComerciais.indexOf(recomendada);
  const alternativas = capacidadesComerciais.slice(Math.max(0, indice - 1), indice + 2);

  return { recomendada, alternativas };
}

/**
 * Função principal: calcula tudo para ar-condicionado
 */
export function calcularCargaTermicaAC(params: {
  area: number;
  peDireito: number;
  exposicaoSolar: "baixa" | "media" | "alta";
  isolamentoTermico: "bom" | "regular" | "ruim";
  numeroPessoas: number;
  numeroEquipamentos: number;
  numeroJanelas: number;
  tamanhoJanelas: "pequenas" | "medianas" | "grandes";
  margem: number; // %
  metodo: "simplificado" | "volumetrico";
  volumeConhecido?: number; // m³ (opcional)
}): {
  volume: number;
  cargaTotalW: number;
  cargaTotalBTU: number;
  cargaTotalKW: number;
  capacidadeRecomendadaBTU: number;
  capacidadeRecomendadaKW: number;
  numeroAparelhos: number;
} {
  // Volume
  const volume = params.volumeConhecido ?? calcularVolumeAC(params.area, params.peDireito);

  // Carga total (antes de margem)
  let cargaTotalW: number;

  if (params.metodo === "simplificado") {
    cargaTotalW = calcularCargaSimplificadaAC(
      params.area,
      params.exposicaoSolar,
      params.isolamentoTermico,
    );
  } else {
    cargaTotalW = calcularCargaVolumetricaAC(
      volume,
      params.numeroPessoas,
      params.numeroEquipamentos,
      params.numeroJanelas,
      params.tamanhoJanelas,
      params.exposicaoSolar,
      params.isolamentoTermico,
    );
  }

  // Aplicar margem de conforto
  const cargaComMargem = cargaTotalW * (1 + params.margem / 100);

  // Converter para BTU/h e kW
  const cargaBTU = converterWparaBTUAC(cargaComMargem);
  const cargaKW = converterWparaKWAC(cargaComMargem);

  // Sugerir capacidades
  const { recomendada: capacidadeRecomendadaBTU } = sugerirCapacidadesAC(cargaBTU);
  const capacidadeRecomendadaKW = converterBTUparaKWAC(capacidadeRecomendadaBTU);

  // Número de aparelhos (assumindo aparelho padrão de 12.000 BTU/h)
  const aparelhoPadrao = 12000;
  const numeroAparelhos = Math.ceil(capacidadeRecomendadaBTU / aparelhoPadrao);

  return {
    volume,
    cargaTotalW: cargaComMargem,
    cargaTotalBTU: cargaBTU,
    cargaTotalKW: cargaKW,
    capacidadeRecomendadaBTU,
    capacidadeRecomendadaKW,
    numeroAparelhos,
  };
}

// ========== Rejunte ==========

/**
 * Calcula a quantidade de rejunte necessária para revestimentos cerâmicos/porcelanato
 * 
 * Fórmula:
 * Volume (m³) = (Perímetro da peça × Largura da junta × Espessura × Número de peças por m²) × Área total
 * Massa (kg) = Volume × Densidade do rejunte
 * 
 * Densidades padrão:
 * - Cimentício: 1.800 kg/m³
 * - Acrílico: 1.600 kg/m³
 * - Epóxi: 1.900 kg/m³
 */

export function calcularVolumePorPecaRejunte(
  larguraPeca: number,  // mm
  alturaPeca: number,   // mm
  larguraJunta: number, // mm
  espessuraRejunte: number, // mm
): number {
  // Perímetro = 2 × (largura + altura)
  const perimetro = 2 * (larguraPeca + alturaPeca);
  // Volume por peça em mm³ = perímetro × largura_junta × espessura
  return perimetro * larguraJunta * espessuraRejunte;
}

export function calcularNumeroPecasPorM2Rejunte(
  larguraPeca: number, // mm
  alturaPeca: number,  // mm
): number {
  // Área da peça em mm²
  const areaPeca = larguraPeca * alturaPeca;
  // 1 m² = 1.000.000 mm²
  return 1000000 / areaPeca;
}

export function calcularVolumeTotalM3Rejunte(
  larguraPeca: number,
  alturaPeca: number,
  larguraJunta: number,
  espessuraRejunte: number,
  areaTotalM2: number,
): number {
  const volumePorPeca = calcularVolumePorPecaRejunte(
    larguraPeca,
    alturaPeca,
    larguraJunta,
    espessuraRejunte,
  );
  const numeroPecas = calcularNumeroPecasPorM2Rejunte(larguraPeca, alturaPeca);
  // Volume total em mm³
  const volumeTotalMm3 = volumePorPeca * numeroPecas * areaTotalM2;
  // Converter mm³ para m³ (dividir por 1e9)
  return volumeTotalMm3 / 1e9;
}

export function converterM3ParaLitrosRejunte(m3: number): number {
  return m3 * 1000; // 1 m³ = 1.000 litros
}

export function calcularMassaPorVolumeRejunte(
  volumeM3: number,
  tipoRejunte: "cimenticio" | "acrilico" | "epoxi",
): number {
  const densidades: Record<string, number> = {
    cimenticio: 1800,  // kg/m³
    acrilico: 1600,    // kg/m³
    epoxi: 1900,       // kg/m³
  };
  return volumeM3 * (densidades[tipoRejunte] || 1800);
}

export function aplicarDesperdicioRejunte(
  massa: number,
  percentualDesperdicio: number,
): number {
  return massa * (1 + percentualDesperdicio / 100);
}

export function calcularRejunte(params: {
  larguraPeca: number;
  alturaPeca: number;
  larguraJunta: number;
  espessuraRejunte: number;
  areaTotalM2: number;
  tipoRejunte: "cimenticio" | "acrilico" | "epoxi";
  desperdicio: number;
}): {
  volumePorM2: number;
  volumeTotal: number;
  massaTotalKg: number;
  desperdicio: number;
  massaTotalComDesperdicio: number;
} {
  // Calcular volume total em m³
  const volumeM3 = calcularVolumeTotalM3Rejunte(
    params.larguraPeca,
    params.alturaPeca,
    params.larguraJunta,
    params.espessuraRejunte,
    params.areaTotalM2,
  );

  // Converter para litros
  const volumeLitros = converterM3ParaLitrosRejunte(volumeM3);

  // Calcular volume por m²
  const volumePorM2 = volumeLitros / params.areaTotalM2;

  // Calcular massa sem desperdício
  const massaSemDesperdicio = calcularMassaPorVolumeRejunte(
    volumeM3,
    params.tipoRejunte,
  );

  // Aplicar desperdício
  const massoComDesperdicio = aplicarDesperdicioRejunte(
    massaSemDesperdicio,
    params.desperdicio,
  );

  const massaDesperdicio = massoComDesperdicio - massaSemDesperdicio;

  return {
    volumePorM2,
    volumeTotal: volumeLitros,
    massaTotalKg: massaSemDesperdicio,
    desperdicio: massaDesperdicio,
    massaTotalComDesperdicio: massoComDesperdicio,
  };
}

export function calcCimento(
  volumeM3: number,
  resistencia: ResistenciaTipo,
): { cimento: number; sacos: number } {
  const cimentoKgPorM3 = CIMENTO_POR_M3[resistencia];
  const cimentoTotal = volumeM3 * cimentoKgPorM3;
  const sacos = Math.ceil(cimentoTotal / 50); // sacos de 50 kg

  return {
    cimento: cimentoTotal,
    sacos,
  };
}
