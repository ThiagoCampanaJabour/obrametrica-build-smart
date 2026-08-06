/**
 * Estimador de Custo Total do Sistema (TCO) para projetos fotovoltaicos.
 *
 * Todas as funções são puras e testáveis: recebem entradas explícitas e
 * devolvem novos objetos, sem I/O, sem acesso a `window` e sem estado global.
 * Os valores unitários padrão são referências de mercado brasileiro coletadas
 * em 2026-01 e DEVEM ser ajustados pelo usuário na proposta final.
 */

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export type TipoInversor = "string" | "central" | "hibrido";
export type TipoEstrutura = "telhado-inclinado" | "telhado-plano" | "solo-fixo" | "tracker";
export type Montagem = "paisagem" | "retrato";
export type ModoMaoObra = "kwp" | "horas";
export type ModoLogistica = "km" | "pct";

export interface InversorInput {
  tipo: TipoInversor;
  /** Potência nominal AC de UMA unidade. */
  potenciaAC_kW: number;
  /** Custo de UMA unidade, em R$. */
  custoUnitario_R: number;
  /** Entradas de string por unidade (usado para checagem de arranjo). */
  stringsPorInversor: number;
  /** Vida útil média antes da substituição, em anos. */
  vidaUtil_anos: number;
}

export interface EstruturaInput {
  tipo: TipoEstrutura;
  /** Custo do perfil/rail por metro. */
  rail_RporM: number;
  clampsPorModulo: number;
  clampUnitario_R: number;
  /** Multiplicador de custo por tipo de estrutura (tracker > solo > telhado). */
  fator: number;
}

export interface CabosInput {
  dc_m: number;
  dc_RporM: number;
  ac_m: number;
  ac_RporM: number;
  /** Eletrocalha/eletroduto, em metros; usa o comprimento AC quando 0. */
  eletrocalha_m: number;
  eletrocalha_RporM: number;
}

export interface ProtecoesInput {
  stringsPorStringBox: number;
  stringBox_R: number;
  fusivelPorString_R: number;
  spd_R: number;
  quadroProtecao_R: number;
  aterramento_R: number;
  transformador_R: number;
  medicao_R: number;
}

export interface MaoObraInput {
  modo: ModoMaoObra;
  custo_RporkWp: number;
  horasPorkWp: number;
  taxaHora_R: number;
}

export interface LogisticaInput {
  modo: ModoLogistica;
  distancia_km: number;
  custo_RporKm: number;
  descarregamento_R: number;
  pctCapex: number;
}

export interface OpexInput {
  limpeza_RporkWpAno: number;
  manutencao_RporkWpAno: number;
  monitoramento_RporkWpAno: number;
  seguro_pctCapexAno: number;
  garantiaEstendida_Rano: number;
}

export interface BateriaInput {
  capacidade_kWh: number;
  custo_RporkWh: number;
  vidaUtil_anos: number;
}

export interface ModuloInput {
  label: string;
  pmp_W: number;
  custo_RporWp: number;
  comprimento_m: number;
  largura_m: number;
  /** Módulos por caixa/pallet — a compra é arredondada para cima. */
  porCaixa: number;
}

export interface CostInput {
  nome: string;
  local: string;
  /** Potência DC alvo, em kWp. */
  potenciaAlvo_kWp: number;
  modulo: ModuloInput;
  /** Percentual de módulos reserva (spare). */
  spare_pct: number;
  montagem: Montagem;
  modulosPorString: number;
  dcAcRatio: number;
  inversor: InversorInput;
  estrutura: EstruturaInput;
  cabos: CabosInput;
  protecoes: ProtecoesInput;
  maoObra: MaoObraInput;
  logistica: LogisticaInput;
  projeto_R: number;
  licencas_R: number;
  comissionamento_pct: number;
  contingencia_pct: number;
  markup_pct: number;
  bateria: BateriaInput | null;
  vidaUtil_anos: number;
  taxaDesconto_pct: number;
  opex: OpexInput;
  /** Produção estimada no ano 1, em kWh. Use 0 para desativar indicadores. */
  producaoAnual_kWh: number;
  tarifa_RporkWh: number;
  degradacaoAnual_pct: number;
}

export interface CapexItem {
  categoria: "Equipamento" | "Estrutura" | "Elétrica / BOP" | "Serviços" | "Armazenamento";
  item: string;
  quantidade: number;
  unidade: string;
  custoUnitario_R: number;
  subtotal_R: number;
  nota?: string;
}

export interface Replacement {
  ano: number;
  item: string;
  custo_R: number;
}

export interface CashflowYear {
  ano: number;
  capex_R: number;
  opex_R: number;
  substituicao_R: number;
  receita_R: number;
  producao_kWh: number;
  fluxoLiquido_R: number;
  acumulado_R: number;
}

export interface CostResult {
  inputs: CostInput;
  dimensionamento: {
    nModulos: number;
    nModulosComprados: number;
    nCaixas: number;
    potenciaDC_kWp: number;
    nStrings: number;
    modulosUltimaString: number;
    potenciaAC_alvo_kW: number;
    nInversores: number;
    potenciaAC_instalada_kW: number;
    dcAcRatioReal: number;
    entradasStringDisponiveis: number;
    rails_m: number;
    clamps_qty: number;
    nStringBoxes: number;
  };
  capex: {
    itens: CapexItem[];
    subtotalDireto_R: number;
    contingencia_R: number;
    capexTotal_R: number;
    markup_R: number;
    precoVenda_R: number;
    custoPorkWp_R: number;
  };
  opex: {
    limpeza_R: number;
    manutencao_R: number;
    monitoramento_R: number;
    seguro_R: number;
    garantia_R: number;
    total_R: number;
  };
  substituicoes: Replacement[];
  cashflow: CashflowYear[];
  indicadores: {
    producaoTotal_kWh: number;
    receitaAnual_R: number;
    economiaLiquidaAnual_R: number;
    paybackSimples_anos: number | null;
    paybackDescontado_anos: number | null;
    custoTotalHorizonte_R: number;
    custoTotalDescontado_R: number;
    lcoe_RporkWh: number | null;
    custoPorkWp_R: number;
  };
  avisos: string[];
}

// ---------------------------------------------------------------------------
// Utilidades numéricas
// ---------------------------------------------------------------------------

const r2 = (n: number) => Math.round(n * 100) / 100;
const safe = (n: number, fallback = 0) => (Number.isFinite(n) ? n : fallback);

/** Fator de recuperação de capital (CRF) para anualizar o CAPEX. */
export function capitalRecoveryFactor(taxa_pct: number, anos: number): number {
  const n = Math.max(1, Math.round(anos));
  const r = safe(taxa_pct) / 100;
  if (r <= 0) return 1 / n;
  const f = Math.pow(1 + r, n);
  return (r * f) / (f - 1);
}

// ---------------------------------------------------------------------------
// Dimensionamento de itens
// ---------------------------------------------------------------------------

/** Quantidade de módulos necessária para atingir a potência DC alvo. */
export function qtyModules(target_kWp: number, pmp_W: number): number {
  if (!(pmp_W > 0) || !(target_kWp > 0)) return 0;
  return Math.ceil((target_kWp * 1000) / pmp_W);
}

/** Arredonda a compra para caixas fechadas, incluindo módulos reserva. */
export function purchaseModules(
  nModulos: number,
  spare_pct: number,
  porCaixa: number,
): { comprados: number; caixas: number } {
  if (nModulos <= 0) return { comprados: 0, caixas: 0 };
  const comSpare = Math.ceil(nModulos * (1 + Math.max(0, safe(spare_pct)) / 100));
  const cx = Math.max(1, Math.round(safe(porCaixa, 1) || 1));
  const caixas = Math.ceil(comSpare / cx);
  return { comprados: caixas * cx, caixas };
}

/** Número de inversores para atender a potência AC alvo. */
export function estimateInverters(
  total_AC_kW: number,
  preset: InversorInput,
): {
  qty: number;
  potenciaInstalada_kW: number;
  entradasStringDisponiveis: number;
  custoTotal_R: number;
} {
  const unidade = safe(preset.potenciaAC_kW);
  if (!(unidade > 0) || !(total_AC_kW > 0)) {
    return { qty: 0, potenciaInstalada_kW: 0, entradasStringDisponiveis: 0, custoTotal_R: 0 };
  }
  const qty = Math.ceil(total_AC_kW / unidade);
  return {
    qty,
    potenciaInstalada_kW: r2(qty * unidade),
    entradasStringDisponiveis: qty * Math.max(0, Math.round(safe(preset.stringsPorInversor))),
    custoTotal_R: r2(qty * safe(preset.custoUnitario_R)),
  };
}

/** Perfis (rails) e grampos (clamps) do sistema de fixação. */
export function estimateRailsAndClamps(
  nModules: number,
  modulo: { comprimento_m: number; largura_m: number },
  montagem: Montagem,
  estrutura: EstruturaInput,
): { rails_m: number; clamps_qty: number; custoRails_R: number; custoClamps_R: number } {
  if (nModules <= 0) return { rails_m: 0, clamps_qty: 0, custoRails_R: 0, custoClamps_R: 0 };
  // Largura ocupada por módulo no eixo da fileira (dois trilhos por fileira).
  const passo_m = montagem === "paisagem" ? safe(modulo.comprimento_m) : safe(modulo.largura_m);
  const rails_m = r2(nModules * passo_m * 2 * Math.max(0.1, safe(estrutura.fator, 1)));
  const clamps_qty = nModules * Math.max(0, Math.round(safe(estrutura.clampsPorModulo)));
  return {
    rails_m,
    clamps_qty,
    custoRails_R: r2(rails_m * safe(estrutura.rail_RporM)),
    custoClamps_R: r2(clamps_qty * safe(estrutura.clampUnitario_R)),
  };
}

/** Cabeamento DC, AC e infraestrutura de passagem. */
export function estimateCabling(cabos: CabosInput): {
  dc_custo_R: number;
  ac_custo_R: number;
  eletrocalha_m: number;
  eletrocalha_custo_R: number;
  total_R: number;
} {
  const dc = r2(safe(cabos.dc_m) * safe(cabos.dc_RporM));
  const ac = r2(safe(cabos.ac_m) * safe(cabos.ac_RporM));
  const infra_m = safe(cabos.eletrocalha_m) > 0 ? safe(cabos.eletrocalha_m) : safe(cabos.ac_m);
  const infra = r2(infra_m * safe(cabos.eletrocalha_RporM));
  return {
    dc_custo_R: dc,
    ac_custo_R: ac,
    eletrocalha_m: r2(infra_m),
    eletrocalha_custo_R: infra,
    total_R: r2(dc + ac + infra),
  };
}

/** Mão de obra de instalação, por kWp ou por horas × taxa. */
export function estimateLabor(kWp: number, maoObra: MaoObraInput): number {
  const p = Math.max(0, safe(kWp));
  if (maoObra.modo === "horas") {
    return r2(p * safe(maoObra.horasPorkWp) * safe(maoObra.taxaHora_R));
  }
  return r2(p * safe(maoObra.custo_RporkWp));
}

/** Proteções e balance of plant. */
export function estimateProtections(
  nStrings: number,
  protecoes: ProtecoesInput,
): { nStringBoxes: number; itens: Array<{ item: string; qty: number; unit_R: number }> } {
  const porBox = Math.max(1, Math.round(safe(protecoes.stringsPorStringBox, 1) || 1));
  const nStringBoxes = nStrings > 0 ? Math.ceil(nStrings / porBox) : 0;
  return {
    nStringBoxes,
    itens: [
      { item: "String box / combiner", qty: nStringBoxes, unit_R: safe(protecoes.stringBox_R) },
      { item: "Fusíveis DC (por string)", qty: nStrings, unit_R: safe(protecoes.fusivelPorString_R) },
      { item: "DPS / SPD CA", qty: 1, unit_R: safe(protecoes.spd_R) },
      { item: "Quadro de proteção CA", qty: 1, unit_R: safe(protecoes.quadroProtecao_R) },
      { item: "Aterramento e equipotencialização", qty: 1, unit_R: safe(protecoes.aterramento_R) },
      { item: "Transformador", qty: safe(protecoes.transformador_R) > 0 ? 1 : 0, unit_R: safe(protecoes.transformador_R) },
      { item: "Medição / smart meter", qty: safe(protecoes.medicao_R) > 0 ? 1 : 0, unit_R: safe(protecoes.medicao_R) },
    ].filter((it) => it.qty > 0 && it.unit_R > 0),
  };
}

// ---------------------------------------------------------------------------
// CAPEX
// ---------------------------------------------------------------------------

export function estimateCapex(input: CostInput): CostResult["capex"] & {
  dimensionamento: CostResult["dimensionamento"];
  avisos: string[];
} {
  const avisos: string[] = [];
  const nModulos = qtyModules(input.potenciaAlvo_kWp, input.modulo.pmp_W);
  const compra = purchaseModules(nModulos, input.spare_pct, input.modulo.porCaixa);
  const potenciaDC_kWp = r2((nModulos * safe(input.modulo.pmp_W)) / 1000);

  const porString = Math.max(1, Math.round(safe(input.modulosPorString, 1) || 1));
  const nStrings = nModulos > 0 ? Math.ceil(nModulos / porString) : 0;
  const modulosUltimaString = nStrings > 0 ? nModulos - (nStrings - 1) * porString : 0;

  const ratio = safe(input.dcAcRatio) > 0 ? input.dcAcRatio : 1;
  const potenciaAC_alvo_kW = r2(potenciaDC_kWp / ratio);
  const inv = estimateInverters(potenciaAC_alvo_kW, input.inversor);
  const dcAcRatioReal =
    inv.potenciaInstalada_kW > 0 ? r2(potenciaDC_kWp / inv.potenciaInstalada_kW) : 0;

  if (inv.qty > 0 && inv.entradasStringDisponiveis < nStrings) {
    avisos.push(
      `O arranjo tem ${nStrings} strings, mas os ${inv.qty} inversor(es) oferecem apenas ${inv.entradasStringDisponiveis} entradas. Reveja o número de módulos por string ou adote string boxes com paralelismo.`,
    );
  }
  if (dcAcRatioReal > 1.35) {
    avisos.push(
      `DC/AC real de ${dcAcRatioReal.toFixed(2)} acima de 1,35 — verifique o limite de sobrecarga do inversor e o clipping esperado.`,
    );
  }

  const fix = estimateRailsAndClamps(nModulos, input.modulo, input.montagem, input.estrutura);
  const cab = estimateCabling(input.cabos);
  const prot = estimateProtections(nStrings, input.protecoes);
  const maoObra_R = estimateLabor(potenciaDC_kWp, input.maoObra);

  const itens: CapexItem[] = [];

  const custoModulos = r2(compra.comprados * safe(input.modulo.pmp_W) * safe(input.modulo.custo_RporWp));
  itens.push({
    categoria: "Equipamento",
    item: `Módulos ${input.modulo.label || `${input.modulo.pmp_W} Wp`}`,
    quantidade: compra.comprados,
    unidade: "un",
    custoUnitario_R: r2(safe(input.modulo.pmp_W) * safe(input.modulo.custo_RporWp)),
    subtotal_R: custoModulos,
    nota: `${nModulos} em projeto + reserva; ${compra.caixas} caixa(s) de ${input.modulo.porCaixa}`,
  });

  if (inv.qty > 0) {
    itens.push({
      categoria: "Equipamento",
      item: `Inversor ${input.inversor.tipo} ${input.inversor.potenciaAC_kW} kW`,
      quantidade: inv.qty,
      unidade: "un",
      custoUnitario_R: r2(safe(input.inversor.custoUnitario_R)),
      subtotal_R: inv.custoTotal_R,
      nota: `${inv.potenciaInstalada_kW} kW AC instalados · DC/AC ${dcAcRatioReal.toFixed(2)}`,
    });
  }

  if (input.bateria && input.bateria.capacidade_kWh > 0) {
    itens.push({
      categoria: "Armazenamento",
      item: "Banco de baterias",
      quantidade: r2(input.bateria.capacidade_kWh),
      unidade: "kWh",
      custoUnitario_R: r2(safe(input.bateria.custo_RporkWh)),
      subtotal_R: r2(input.bateria.capacidade_kWh * safe(input.bateria.custo_RporkWh)),
      nota: `Substituição prevista a cada ${input.bateria.vidaUtil_anos} anos`,
    });
  }

  if (fix.rails_m > 0) {
    itens.push({
      categoria: "Estrutura",
      item: `Perfis de fixação (${input.estrutura.tipo})`,
      quantidade: fix.rails_m,
      unidade: "m",
      custoUnitario_R: r2(safe(input.estrutura.rail_RporM)),
      subtotal_R: fix.custoRails_R,
      nota: "2 trilhos por fileira × fator do tipo de estrutura",
    });
    itens.push({
      categoria: "Estrutura",
      item: "Grampos (clamps) e terminais",
      quantidade: fix.clamps_qty,
      unidade: "un",
      custoUnitario_R: r2(safe(input.estrutura.clampUnitario_R)),
      subtotal_R: fix.custoClamps_R,
    });
  }

  if (cab.dc_custo_R > 0) {
    itens.push({
      categoria: "Elétrica / BOP",
      item: "Cabo solar CC",
      quantidade: r2(safe(input.cabos.dc_m)),
      unidade: "m",
      custoUnitario_R: r2(safe(input.cabos.dc_RporM)),
      subtotal_R: cab.dc_custo_R,
    });
  }
  if (cab.ac_custo_R > 0) {
    itens.push({
      categoria: "Elétrica / BOP",
      item: "Cabo CA",
      quantidade: r2(safe(input.cabos.ac_m)),
      unidade: "m",
      custoUnitario_R: r2(safe(input.cabos.ac_RporM)),
      subtotal_R: cab.ac_custo_R,
    });
  }
  if (cab.eletrocalha_custo_R > 0) {
    itens.push({
      categoria: "Elétrica / BOP",
      item: "Eletrocalha / eletroduto",
      quantidade: cab.eletrocalha_m,
      unidade: "m",
      custoUnitario_R: r2(safe(input.cabos.eletrocalha_RporM)),
      subtotal_R: cab.eletrocalha_custo_R,
    });
  }
  for (const it of prot.itens) {
    itens.push({
      categoria: "Elétrica / BOP",
      item: it.item,
      quantidade: it.qty,
      unidade: "un",
      custoUnitario_R: r2(it.unit_R),
      subtotal_R: r2(it.qty * it.unit_R),
    });
  }

  if (maoObra_R > 0) {
    itens.push({
      categoria: "Serviços",
      item: "Instalação e montagem",
      quantidade: input.maoObra.modo === "horas" ? r2(potenciaDC_kWp * safe(input.maoObra.horasPorkWp)) : potenciaDC_kWp,
      unidade: input.maoObra.modo === "horas" ? "h" : "kWp",
      custoUnitario_R:
        input.maoObra.modo === "horas" ? r2(safe(input.maoObra.taxaHora_R)) : r2(safe(input.maoObra.custo_RporkWp)),
      subtotal_R: maoObra_R,
    });
  }

  const equipamentosParaFrete = itens
    .filter((i) => i.categoria !== "Serviços")
    .reduce((s, i) => s + i.subtotal_R, 0);

  const logistica_R =
    input.logistica.modo === "km"
      ? r2(safe(input.logistica.distancia_km) * safe(input.logistica.custo_RporKm) + safe(input.logistica.descarregamento_R))
      : r2((equipamentosParaFrete * safe(input.logistica.pctCapex)) / 100 + safe(input.logistica.descarregamento_R));

  if (logistica_R > 0) {
    itens.push({
      categoria: "Serviços",
      item: "Frete e descarregamento",
      quantidade: 1,
      unidade: "vb",
      custoUnitario_R: logistica_R,
      subtotal_R: logistica_R,
      nota:
        input.logistica.modo === "km"
          ? `${input.logistica.distancia_km} km × R$ ${input.logistica.custo_RporKm}/km`
          : `${input.logistica.pctCapex}% dos equipamentos`,
    });
  }

  if (safe(input.projeto_R) > 0) {
    itens.push({
      categoria: "Serviços",
      item: "Projeto elétrico e ART",
      quantidade: 1,
      unidade: "vb",
      custoUnitario_R: r2(input.projeto_R),
      subtotal_R: r2(input.projeto_R),
    });
  }
  if (safe(input.licencas_R) > 0) {
    itens.push({
      categoria: "Serviços",
      item: "Licenças, homologação e taxas",
      quantidade: 1,
      unidade: "vb",
      custoUnitario_R: r2(input.licencas_R),
      subtotal_R: r2(input.licencas_R),
    });
  }

  const parcialSemComissionamento = itens.reduce((s, i) => s + i.subtotal_R, 0);
  const comissionamento_R = r2((parcialSemComissionamento * safe(input.comissionamento_pct)) / 100);
  if (comissionamento_R > 0) {
    itens.push({
      categoria: "Serviços",
      item: "Testes e comissionamento",
      quantidade: 1,
      unidade: "vb",
      custoUnitario_R: comissionamento_R,
      subtotal_R: comissionamento_R,
      nota: `${input.comissionamento_pct}% dos demais itens`,
    });
  }

  const subtotalDireto_R = r2(itens.reduce((s, i) => s + i.subtotal_R, 0));
  const contingencia_R = r2((subtotalDireto_R * safe(input.contingencia_pct)) / 100);
  const capexTotal_R = r2(subtotalDireto_R + contingencia_R);
  const markup_R = r2((capexTotal_R * safe(input.markup_pct)) / 100);

  return {
    itens,
    subtotalDireto_R,
    contingencia_R,
    capexTotal_R,
    markup_R,
    precoVenda_R: r2(capexTotal_R + markup_R),
    custoPorkWp_R: potenciaDC_kWp > 0 ? r2(capexTotal_R / potenciaDC_kWp) : 0,
    dimensionamento: {
      nModulos,
      nModulosComprados: compra.comprados,
      nCaixas: compra.caixas,
      potenciaDC_kWp,
      nStrings,
      modulosUltimaString,
      potenciaAC_alvo_kW,
      nInversores: inv.qty,
      potenciaAC_instalada_kW: inv.potenciaInstalada_kW,
      dcAcRatioReal,
      entradasStringDisponiveis: inv.entradasStringDisponiveis,
      rails_m: fix.rails_m,
      clamps_qty: fix.clamps_qty,
      nStringBoxes: prot.nStringBoxes,
    },
    avisos,
  };
}

// ---------------------------------------------------------------------------
// OPEX e substituições
// ---------------------------------------------------------------------------

export function estimateOpex(
  kWp: number,
  capex_R: number,
  opex: OpexInput,
): CostResult["opex"] {
  const p = Math.max(0, safe(kWp));
  const limpeza_R = r2(p * safe(opex.limpeza_RporkWpAno));
  const manutencao_R = r2(p * safe(opex.manutencao_RporkWpAno));
  const monitoramento_R = r2(p * safe(opex.monitoramento_RporkWpAno));
  const seguro_R = r2((safe(capex_R) * safe(opex.seguro_pctCapexAno)) / 100);
  const garantia_R = r2(safe(opex.garantiaEstendida_Rano));
  return {
    limpeza_R,
    manutencao_R,
    monitoramento_R,
    seguro_R,
    garantia_R,
    total_R: r2(limpeza_R + manutencao_R + monitoramento_R + seguro_R + garantia_R),
  };
}

/** Cronograma de substituições dentro do horizonte de análise. */
export function estimateReplacements(
  horizonte_anos: number,
  inversor: { qty: number; custoUnitario_R: number; vidaUtil_anos: number },
  bateria?: { capacidade_kWh: number; custo_RporkWh: number; vidaUtil_anos: number } | null,
): Replacement[] {
  const out: Replacement[] = [];
  const n = Math.max(1, Math.round(safe(horizonte_anos)));

  const vidaInv = Math.round(safe(inversor.vidaUtil_anos));
  if (inversor.qty > 0 && vidaInv > 0) {
    for (let ano = vidaInv; ano < n; ano += vidaInv) {
      out.push({
        ano,
        item: `Substituição de ${inversor.qty} inversor(es)`,
        custo_R: r2(inversor.qty * safe(inversor.custoUnitario_R)),
      });
    }
  }

  if (bateria && bateria.capacidade_kWh > 0) {
    const vidaBat = Math.round(safe(bateria.vidaUtil_anos));
    if (vidaBat > 0) {
      for (let ano = vidaBat; ano < n; ano += vidaBat) {
        out.push({
          ano,
          item: "Substituição do banco de baterias",
          custo_R: r2(bateria.capacidade_kWh * safe(bateria.custo_RporkWh)),
        });
      }
    }
  }

  return out.sort((a, b) => a.ano - b.ano);
}

// ---------------------------------------------------------------------------
// Indicadores financeiros
// ---------------------------------------------------------------------------

export function calcPayback(
  capex_R: number,
  opexAnual_R: number,
  producao_kWh: number,
  tarifa_RporkWh: number,
): { receitaAnual_R: number; liquidoAnual_R: number; paybackSimples_anos: number | null } {
  const receitaAnual_R = r2(Math.max(0, safe(producao_kWh)) * Math.max(0, safe(tarifa_RporkWh)));
  const liquidoAnual_R = r2(receitaAnual_R - Math.max(0, safe(opexAnual_R)));
  const paybackSimples_anos = liquidoAnual_R > 0 ? r2(safe(capex_R) / liquidoAnual_R) : null;
  return { receitaAnual_R, liquidoAnual_R, paybackSimples_anos };
}

// ---------------------------------------------------------------------------
// Cálculo completo
// ---------------------------------------------------------------------------

export function estimateCost(input: CostInput): CostResult {
  const capexBlock = estimateCapex(input);
  const { dimensionamento, avisos: avisosCapex, ...capex } = capexBlock;
  const avisos = [...avisosCapex];

  const horizonte = Math.max(1, Math.round(safe(input.vidaUtil_anos, 25)));
  const taxa = Math.max(0, safe(input.taxaDesconto_pct)) / 100;
  const degradacao = Math.max(0, safe(input.degradacaoAnual_pct)) / 100;

  const opex = estimateOpex(dimensionamento.potenciaDC_kWp, capex.capexTotal_R, input.opex);
  const substituicoes = estimateReplacements(
    horizonte,
    {
      qty: dimensionamento.nInversores,
      custoUnitario_R: input.inversor.custoUnitario_R,
      vidaUtil_anos: input.inversor.vidaUtil_anos,
    },
    input.bateria,
  );

  const producao1 = Math.max(0, safe(input.producaoAnual_kWh));
  const tarifa = Math.max(0, safe(input.tarifa_RporkWh));

  const cashflow: CashflowYear[] = [];
  let acumulado = -capex.capexTotal_R;
  cashflow.push({
    ano: 0,
    capex_R: capex.capexTotal_R,
    opex_R: 0,
    substituicao_R: 0,
    receita_R: 0,
    producao_kWh: 0,
    fluxoLiquido_R: r2(-capex.capexTotal_R),
    acumulado_R: r2(acumulado),
  });

  let producaoTotal_kWh = 0;
  let opexDescontado = 0;
  let energiaDescontada = 0;
  let substituicaoDescontada = 0;
  let acumuladoDescontado = -capex.capexTotal_R;
  let paybackSimples_anos: number | null = null;
  let paybackDescontado_anos: number | null = null;

  for (let ano = 1; ano <= horizonte; ano += 1) {
    const producao = r2(producao1 * Math.pow(1 - degradacao, ano - 1));
    const receita = r2(producao * tarifa);
    const substituicao = r2(
      substituicoes.filter((s) => s.ano === ano).reduce((s, r) => s + r.custo_R, 0),
    );
    const fluxo = r2(receita - opex.total_R - substituicao);
    const anterior = acumulado;
    acumulado = r2(acumulado + fluxo);

    const desc = Math.pow(1 + taxa, ano);
    producaoTotal_kWh += producao;
    opexDescontado += opex.total_R / desc;
    substituicaoDescontada += substituicao / desc;
    energiaDescontada += producao / desc;
    const anteriorDesc = acumuladoDescontado;
    acumuladoDescontado = acumuladoDescontado + fluxo / desc;

    if (paybackSimples_anos === null && anterior < 0 && acumulado >= 0 && fluxo > 0) {
      paybackSimples_anos = r2(ano - 1 + -anterior / fluxo);
    }
    if (
      paybackDescontado_anos === null &&
      anteriorDesc < 0 &&
      acumuladoDescontado >= 0 &&
      fluxo > 0
    ) {
      paybackDescontado_anos = r2(ano - 1 + (-anteriorDesc * desc) / fluxo);
    }

    cashflow.push({
      ano,
      capex_R: 0,
      opex_R: opex.total_R,
      substituicao_R: substituicao,
      receita_R: receita,
      producao_kWh: producao,
      fluxoLiquido_R: fluxo,
      acumulado_R: acumulado,
    });
  }

  const custoTotalHorizonte_R = r2(
    capex.capexTotal_R + opex.total_R * horizonte + substituicoes.reduce((s, r) => s + r.custo_R, 0),
  );
  const custoTotalDescontado_R = r2(
    capex.capexTotal_R + opexDescontado + substituicaoDescontada,
  );

  const crf = capitalRecoveryFactor(input.taxaDesconto_pct, horizonte);
  const lcoe_RporkWh =
    energiaDescontada > 0
      ? Math.round(
          ((capex.capexTotal_R * crf +
            (opexDescontado + substituicaoDescontada) / horizonte) /
            (energiaDescontada / horizonte)) *
            10000,
        ) / 10000
      : null;

  const pb = calcPayback(capex.capexTotal_R, opex.total_R, producao1, tarifa);

  if (producao1 <= 0 || tarifa <= 0) {
    avisos.push(
      "Informe a produção anual estimada (kWh) e a tarifa (R$/kWh) para obter payback, receita e LCOE.",
    );
  }
  if (pb.liquidoAnual_R <= 0 && producao1 > 0 && tarifa > 0) {
    avisos.push(
      "A economia anual não cobre o OPEX: o payback é indefinido com as premissas atuais.",
    );
  }

  return {
    inputs: input,
    dimensionamento,
    capex,
    opex,
    substituicoes,
    cashflow,
    indicadores: {
      producaoTotal_kWh: r2(producaoTotal_kWh),
      receitaAnual_R: pb.receitaAnual_R,
      economiaLiquidaAnual_R: pb.liquidoAnual_R,
      paybackSimples_anos: paybackSimples_anos ?? pb.paybackSimples_anos,
      paybackDescontado_anos,
      custoTotalHorizonte_R,
      custoTotalDescontado_R,
      lcoe_RporkWh,
      custoPorkWp_R: capex.custoPorkWp_R,
    },
    avisos,
  };
}

// ---------------------------------------------------------------------------
// Exportação
// ---------------------------------------------------------------------------

const csvCell = (v: string | number) => {
  const s = String(v);
  return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/** BOM + fluxo de caixa em CSV (separador ";" para Excel pt-BR). */
export function costToCSV(result: CostResult): string {
  const lines: string[] = [];
  lines.push("categoria;item;quantidade;unidade;custo_unitario_R$;subtotal_R$;observacao");
  for (const i of result.capex.itens) {
    lines.push(
      [i.categoria, i.item, i.quantidade, i.unidade, i.custoUnitario_R, i.subtotal_R, i.nota ?? ""]
        .map(csvCell)
        .join(";"),
    );
  }
  lines.push("");
  lines.push("resumo;valor_R$");
  lines.push(`Subtotal direto;${result.capex.subtotalDireto_R}`);
  lines.push(`Contingência;${result.capex.contingencia_R}`);
  lines.push(`CAPEX total;${result.capex.capexTotal_R}`);
  lines.push(`Markup;${result.capex.markup_R}`);
  lines.push(`Preço de venda sugerido;${result.capex.precoVenda_R}`);
  lines.push(`OPEX anual;${result.opex.total_R}`);
  lines.push(`Custo por kWp;${result.capex.custoPorkWp_R}`);
  lines.push("");
  lines.push("ano;capex_R$;opex_R$;substituicao_R$;receita_R$;producao_kWh;fluxo_R$;acumulado_R$");
  for (const c of result.cashflow) {
    lines.push(
      [c.ano, c.capex_R, c.opex_R, c.substituicao_R, c.receita_R, c.producao_kWh, c.fluxoLiquido_R, c.acumulado_R]
        .map(csvCell)
        .join(";"),
    );
  }
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Presets e entrada padrão
// ---------------------------------------------------------------------------

export const PRESET_MODULOS: ReadonlyArray<ModuloInput> = [
  { label: "400 Wp mono", pmp_W: 400, custo_RporWp: 1.05, comprimento_m: 1.95, largura_m: 0.99, porCaixa: 31 },
  { label: "550 Wp mono half-cell", pmp_W: 550, custo_RporWp: 0.95, comprimento_m: 2.28, largura_m: 1.13, porCaixa: 31 },
  { label: "610 Wp bifacial", pmp_W: 610, custo_RporWp: 1.0, comprimento_m: 2.38, largura_m: 1.13, porCaixa: 31 },
];

export const PRESET_INVERSORES: ReadonlyArray<{ label: string } & InversorInput> = [
  { label: "String 5 kW (residencial)", tipo: "string", potenciaAC_kW: 5, custoUnitario_R: 4200, stringsPorInversor: 2, vidaUtil_anos: 12 },
  { label: "String 10 kW (residencial+)", tipo: "string", potenciaAC_kW: 10, custoUnitario_R: 7200, stringsPorInversor: 4, vidaUtil_anos: 12 },
  { label: "String 25 kW (comercial)", tipo: "string", potenciaAC_kW: 25, custoUnitario_R: 13500, stringsPorInversor: 6, vidaUtil_anos: 12 },
  { label: "Central 75 kW", tipo: "central", potenciaAC_kW: 75, custoUnitario_R: 33000, stringsPorInversor: 10, vidaUtil_anos: 15 },
  { label: "Híbrido 8 kW", tipo: "hibrido", potenciaAC_kW: 8, custoUnitario_R: 12500, stringsPorInversor: 3, vidaUtil_anos: 10 },
];

export const PRESET_ESTRUTURAS: ReadonlyArray<{ label: string } & EstruturaInput> = [
  { label: "Telhado inclinado (cerâmico/metálico)", tipo: "telhado-inclinado", rail_RporM: 38, clampsPorModulo: 4, clampUnitario_R: 9, fator: 1 },
  { label: "Telhado plano (triangular)", tipo: "telhado-plano", rail_RporM: 38, clampsPorModulo: 4, clampUnitario_R: 9, fator: 1.6 },
  { label: "Solo — fixed tilt", tipo: "solo-fixo", rail_RporM: 45, clampsPorModulo: 4, clampUnitario_R: 9, fator: 2.2 },
  { label: "Solo — tracker 1 eixo", tipo: "tracker", rail_RporM: 60, clampsPorModulo: 4, clampUnitario_R: 11, fator: 3 },
];

export const DEFAULT_COST_INPUT: CostInput = {
  nome: "Sistema residencial",
  local: "São Paulo — SP",
  potenciaAlvo_kWp: 4,
  modulo: { ...PRESET_MODULOS[0]! },
  spare_pct: 0,
  montagem: "paisagem",
  modulosPorString: 10,
  dcAcRatio: 1.2,
  inversor: { ...PRESET_INVERSORES[0]!, label: undefined as never } as InversorInput,
  estrutura: { ...PRESET_ESTRUTURAS[0]!, label: undefined as never } as EstruturaInput,
  cabos: { dc_m: 60, dc_RporM: 9.5, ac_m: 25, ac_RporM: 14, eletrocalha_m: 0, eletrocalha_RporM: 22 },
  protecoes: {
    stringsPorStringBox: 4,
    stringBox_R: 850,
    fusivelPorString_R: 45,
    spd_R: 320,
    quadroProtecao_R: 780,
    aterramento_R: 450,
    transformador_R: 0,
    medicao_R: 0,
  },
  maoObra: { modo: "kwp", custo_RporkWp: 700, horasPorkWp: 8, taxaHora_R: 85 },
  logistica: { modo: "pct", distancia_km: 60, custo_RporKm: 4.5, descarregamento_R: 250, pctCapex: 2 },
  projeto_R: 900,
  licencas_R: 350,
  comissionamento_pct: 1.5,
  contingencia_pct: 7,
  markup_pct: 15,
  bateria: null,
  vidaUtil_anos: 25,
  taxaDesconto_pct: 8,
  opex: {
    limpeza_RporkWpAno: 25,
    manutencao_RporkWpAno: 20,
    monitoramento_RporkWpAno: 8,
    seguro_pctCapexAno: 0.4,
    garantiaEstendida_Rano: 0,
  },
  producaoAnual_kWh: 6000,
  tarifa_RporkWh: 0.95,
  degradacaoAnual_pct: 0.5,
};

export default estimateCost;
