import { describe, it, expect } from "vitest";
import estimateCost, {
  DEFAULT_COST_INPUT,
  calcPayback,
  capitalRecoveryFactor,
  costToCSV,
  estimateCabling,
  estimateCapex,
  estimateInverters,
  estimateLabor,
  estimateOpex,
  estimateProtections,
  estimateRailsAndClamps,
  purchaseModules,
  qtyModules,
  type CostInput,
} from "./cost-estimator";

const base = (patch: Partial<CostInput> = {}): CostInput => ({
  ...DEFAULT_COST_INPUT,
  ...patch,
});

describe("dimensionamento de itens", () => {
  it("qtyModules arredonda para cima", () => {
    expect(qtyModules(4, 400)).toBe(10);
    expect(qtyModules(4.1, 400)).toBe(11);
    expect(qtyModules(50, 550)).toBe(91);
  });

  it("qtyModules protege entradas inválidas", () => {
    expect(qtyModules(0, 400)).toBe(0);
    expect(qtyModules(4, 0)).toBe(0);
  });

  it("purchaseModules respeita spare e caixa fechada", () => {
    expect(purchaseModules(10, 0, 1)).toEqual({ comprados: 10, caixas: 10 });
    expect(purchaseModules(10, 5, 1)).toEqual({ comprados: 11, caixas: 11 });
    expect(purchaseModules(10, 0, 4)).toEqual({ comprados: 12, caixas: 3 });
  });

  it("estimateInverters calcula quantidade, potência e entradas", () => {
    const inv = estimateInverters(24, {
      tipo: "string",
      potenciaAC_kW: 10,
      custoUnitario_R: 7200,
      stringsPorInversor: 4,
      vidaUtil_anos: 12,
    });
    expect(inv.qty).toBe(3);
    expect(inv.potenciaInstalada_kW).toBe(30);
    expect(inv.entradasStringDisponiveis).toBe(12);
    expect(inv.custoTotal_R).toBe(21600);
  });

  it("estimateRailsAndClamps usa 2 trilhos por fileira e o fator da estrutura", () => {
    const r = estimateRailsAndClamps(
      10,
      { comprimento_m: 1.95, largura_m: 0.99 },
      "paisagem",
      { tipo: "telhado-inclinado", rail_RporM: 38, clampsPorModulo: 4, clampUnitario_R: 9, fator: 1 },
    );
    expect(r.rails_m).toBe(39);
    expect(r.clamps_qty).toBe(40);
    expect(r.custoRails_R).toBe(1482);
    expect(r.custoClamps_R).toBe(360);
  });

  it("estimateCabling usa o comprimento AC quando a eletrocalha é 0", () => {
    const c = estimateCabling({
      dc_m: 60,
      dc_RporM: 10,
      ac_m: 25,
      ac_RporM: 14,
      eletrocalha_m: 0,
      eletrocalha_RporM: 20,
    });
    expect(c.dc_custo_R).toBe(600);
    expect(c.ac_custo_R).toBe(350);
    expect(c.eletrocalha_m).toBe(25);
    expect(c.total_R).toBe(1450);
  });

  it("estimateLabor suporta os dois modos", () => {
    expect(estimateLabor(4, { modo: "kwp", custo_RporkWp: 700, horasPorkWp: 8, taxaHora_R: 85 })).toBe(2800);
    expect(estimateLabor(4, { modo: "horas", custo_RporkWp: 700, horasPorkWp: 8, taxaHora_R: 85 })).toBe(2720);
  });

  it("estimateProtections agrupa strings em string boxes e ignora itens zerados", () => {
    const p = estimateProtections(9, {
      ...DEFAULT_COST_INPUT.protecoes,
      transformador_R: 0,
      medicao_R: 0,
    });
    expect(p.nStringBoxes).toBe(3);
    expect(p.itens.some((i) => i.item.startsWith("Transformador"))).toBe(false);
  });
});

describe("Caso 1 — residencial 4 kWp com módulo de 400 Wp", () => {
  const input = base({ modulo: { ...DEFAULT_COST_INPUT.modulo, porCaixa: 1 } });
  const capex = estimateCapex(input);

  it("dimensiona 10 módulos e 4,00 kWp", () => {
    expect(capex.dimensionamento.nModulos).toBe(10);
    expect(capex.dimensionamento.potenciaDC_kWp).toBe(4);
    expect(capex.dimensionamento.nStrings).toBe(1);
    expect(capex.dimensionamento.modulosUltimaString).toBe(10);
  });

  it("usa um inversor de 5 kW com DC/AC coerente", () => {
    expect(capex.dimensionamento.nInversores).toBe(1);
    expect(capex.dimensionamento.potenciaAC_instalada_kW).toBe(5);
    expect(capex.dimensionamento.dcAcRatioReal).toBe(0.8);
  });

  it("soma o CAPEX com contingência e markup", () => {
    const modulos = capex.itens.find((i) => i.categoria === "Equipamento")!;
    expect(modulos.subtotal_R).toBe(4200); // 10 × 400 W × R$ 1,05/Wp
    expect(capex.contingencia_R).toBe(Math.round(capex.subtotalDireto_R * 0.07 * 100) / 100);
    expect(capex.capexTotal_R).toBeGreaterThan(capex.subtotalDireto_R);
    expect(capex.precoVenda_R).toBeCloseTo(capex.capexTotal_R * 1.15, 1);
    expect(capex.custoPorkWp_R).toBeCloseTo(capex.capexTotal_R / 4, 2);
  });
});

describe("Caso 2 — comercial 50 kWp", () => {
  const input = base({
    potenciaAlvo_kWp: 50,
    modulo: { ...DEFAULT_COST_INPUT.modulo, ...{ label: "550 Wp", pmp_W: 550, custo_RporWp: 0.95, comprimento_m: 2.28, largura_m: 1.13, porCaixa: 31 } },
    modulosPorString: 15,
    inversor: { tipo: "string", potenciaAC_kW: 25, custoUnitario_R: 13500, stringsPorInversor: 6, vidaUtil_anos: 12 },
    producaoAnual_kWh: 75000,
  });
  const res = estimateCost(input);

  it("dimensiona módulos, strings e inversores", () => {
    expect(res.dimensionamento.nModulos).toBe(91);
    expect(res.dimensionamento.nStrings).toBe(7);
    expect(res.dimensionamento.nInversores).toBe(2);
    expect(res.dimensionamento.entradasStringDisponiveis).toBe(12);
  });

  it("compra em caixas fechadas de 31 módulos", () => {
    expect(res.dimensionamento.nModulosComprados).toBe(93);
    expect(res.dimensionamento.nCaixas).toBe(3);
  });

  it("agenda a substituição dos inversores no ano 12 e 24", () => {
    const anos = res.substituicoes.map((s) => s.ano);
    expect(anos).toEqual([12, 24]);
    expect(res.substituicoes[0]!.custo_R).toBe(27000);
  });
});

describe("Caso 3 — sistema com bateria", () => {
  const semBateria = estimateCost(base());
  const comBateria = estimateCost(
    base({ bateria: { capacidade_kWh: 10, custo_RporkWh: 3200, vidaUtil_anos: 10 } }),
  );

  it("aumenta o CAPEX e o OPEX (seguro sobre o CAPEX)", () => {
    expect(comBateria.capex.capexTotal_R).toBeGreaterThan(semBateria.capex.capexTotal_R);
    expect(comBateria.opex.seguro_R).toBeGreaterThan(semBateria.opex.seguro_R);
  });

  it("agenda substituições da bateria nos anos 10 e 20", () => {
    const anosBateria = comBateria.substituicoes.filter((s) => s.item.includes("bateria")).map((s) => s.ano);
    expect(anosBateria).toEqual([10, 20]);
  });
});

describe("OPEX, payback e indicadores", () => {
  it("estimateOpex soma as parcelas por kWp e o seguro sobre o CAPEX", () => {
    const o = estimateOpex(4, 20000, DEFAULT_COST_INPUT.opex);
    expect(o.limpeza_R).toBe(100);
    expect(o.manutencao_R).toBe(80);
    expect(o.monitoramento_R).toBe(32);
    expect(o.seguro_R).toBe(80);
    expect(o.total_R).toBe(292);
  });

  it("calcPayback usa a receita líquida de OPEX", () => {
    const p = calcPayback(20000, 300, 6000, 0.95);
    expect(p.receitaAnual_R).toBe(5700);
    expect(p.liquidoAnual_R).toBe(5400);
    expect(p.paybackSimples_anos).toBeCloseTo(3.7, 1);
  });

  it("retorna payback nulo quando o OPEX supera a receita", () => {
    const p = calcPayback(20000, 9000, 6000, 0.95);
    expect(p.paybackSimples_anos).toBeNull();
  });

  it("capitalRecoveryFactor degrada para 1/n com taxa zero", () => {
    expect(capitalRecoveryFactor(0, 25)).toBeCloseTo(0.04, 6);
    expect(capitalRecoveryFactor(8, 25)).toBeCloseTo(0.0937, 3);
  });

  it("gera cashflow com ano 0 de CAPEX e horizonte completo", () => {
    const res = estimateCost(base());
    expect(res.cashflow).toHaveLength(26);
    expect(res.cashflow[0]!.ano).toBe(0);
    expect(res.cashflow[0]!.fluxoLiquido_R).toBe(-res.capex.capexTotal_R);
    expect(res.cashflow[12]!.substituicao_R).toBe(res.inputs.inversor.custoUnitario_R);
  });

  it("aplica degradação anual na produção", () => {
    const res = estimateCost(base());
    expect(res.cashflow[1]!.producao_kWh).toBe(6000);
    expect(res.cashflow[2]!.producao_kWh).toBeCloseTo(5970, 0);
  });

  it("calcula LCOE positivo e custo por kWp", () => {
    const res = estimateCost(base());
    expect(res.indicadores.lcoe_RporkWh).toBeGreaterThan(0);
    // LCOE com energia descontada a 8% a.a. fica acima da tarifa nominal.
    expect(res.indicadores.lcoe_RporkWh).toBeLessThan(3);
    expect(res.indicadores.custoPorkWp_R).toBeGreaterThan(3000);
  });

  it("avisa quando não há produção informada", () => {
    const res = estimateCost(base({ producaoAnual_kWh: 0 }));
    expect(res.indicadores.paybackSimples_anos).toBeNull();
    expect(res.avisos.join(" ")).toContain("produção anual");
  });

  it("custo total no horizonte inclui OPEX e substituições", () => {
    const res = estimateCost(base());
    const substituicoes = res.substituicoes.reduce((s, r) => s + r.custo_R, 0);
    expect(res.indicadores.custoTotalHorizonte_R).toBeCloseTo(
      res.capex.capexTotal_R + res.opex.total_R * 25 + substituicoes,
      1,
    );
    expect(res.indicadores.custoTotalDescontado_R).toBeLessThan(
      res.indicadores.custoTotalHorizonte_R,
    );
  });
});

describe("exportação", () => {
  it("costToCSV inclui BOM, resumo e fluxo de caixa", () => {
    const csv = costToCSV(estimateCost(base()));
    expect(csv.split("\n")[0]).toContain("categoria;item;quantidade");
    expect(csv).toContain("CAPEX total;");
    expect(csv).toContain("ano;capex_R$;opex_R$");
    expect(csv.split("\n").filter((l) => l.startsWith("Equipamento;")).length).toBeGreaterThan(0);
  });
});

describe("casos de borda", () => {
  it("sistema muito grande escala sem estourar", () => {
    const res = estimateCost(base({ potenciaAlvo_kWp: 5000, producaoAnual_kWh: 7_500_000 }));
    expect(res.dimensionamento.nModulos).toBe(12500);
    expect(Number.isFinite(res.capex.capexTotal_R)).toBe(true);
  });

  it("valores negativos de preço não geram CAPEX negativo em módulos", () => {
    const res = estimateCost(
      base({ modulo: { ...DEFAULT_COST_INPUT.modulo, custo_RporWp: 0 } }),
    );
    expect(res.capex.capexTotal_R).toBeGreaterThan(0);
  });

  it("avisa quando faltam entradas de string no inversor", () => {
    const res = estimateCost(base({ potenciaAlvo_kWp: 20, modulosPorString: 4 }));
    expect(res.avisos.join(" ")).toContain("entradas");
  });
});
