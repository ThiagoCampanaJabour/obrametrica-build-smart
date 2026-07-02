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

// ---------- Conversores ----------

export const cmParaPolegada = (cm: number) => cm / 2.54;
export const litrosParaM3 = (l: number) => l / 1000;
export const m2ParaHectare = (m2: number) => m2 / 10000;
