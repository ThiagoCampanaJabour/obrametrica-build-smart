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
