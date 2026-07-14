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
