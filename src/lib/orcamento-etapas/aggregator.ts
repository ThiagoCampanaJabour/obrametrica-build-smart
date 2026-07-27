// Aggregator: converte saídas das calculadoras em BudgetItem[].

export type EtapaCategoria =
  | "Alvenaria"
  | "Estrutura"
  | "Cobertura"
  | "Reboco"
  | "Piso"
  | "Revestimento"
  | "Acabamento"
  | "Instalações"
  | "Outros";

export interface BudgetItem {
  sku: string;
  name: string;
  unidade: string;
  quantidade: number;
  categoria_etapa: EtapaCategoria;
  custo_unitario?: number;
  origem?: string; // slug da calculadora
  origemPath?: string; // rota da calculadora
  sobraPct?: number;
  descontoPct?: number;
  observacoes?: string;
}

/**
 * Contrato esperado por calculadora (chave = slug da calculadora):
 * {
 *   "tijolos": { quantidade: 1200, tipo: "9x19x19" },
 *   "concreto": { volume: 3.5 },
 *   "cimento": { sacos: 40 },
 *   "areia":    { m3: 2 },
 *   "brita":    { m3: 1.5 },
 *   "aco":      { kg: 180 },
 *   "forma":    { m2: 25 },
 *   "blocos":   { quantidade: 800 },
 *   "telhas":   { quantidade: 350 },
 *   "piso":     { m2: 42, caixas: 8 },
 *   "tinta":    { litros: 18 },
 *   "argamassa":{ sacos: 12 },
 *   "reboco":   { m2: 60, cimentoSacos: 6, areiaM3: 1.2 },
 *   "rejunte":  { kg: 4 },
 *   "tubos":    { metros: 30 },
 *   "esquadrias": { unidades: 6 }
 * }
 */
export type CalculatorsOutputs = Record<string, Record<string, number | string>>;

type Adapter = (data: Record<string, number | string>) => BudgetItem[];

const path = (slug: string) => `/calculadora-de-${slug}`;

const adapters: Record<string, Adapter> = {
  tijolos: (d) => [
    {
      sku: `tijolo-${d.tipo ?? "9x19x19"}`,
      name: `Tijolo ${d.tipo ?? "9x19x19"}`,
      unidade: "un",
      quantidade: Number(d.quantidade ?? d.qtdPerda ?? d.qtd ?? 0),
      categoria_etapa: "Alvenaria",
      origem: "tijolos",
      origemPath: path("tijolos"),
    },
  ],
  blocos: (d) => [
    {
      sku: "bloco",
      name: "Bloco de concreto/cerâmico",
      unidade: "un",
      quantidade: Number(d.quantidade ?? d.qtd ?? 0),
      categoria_etapa: "Alvenaria",
      origem: "blocos",
      origemPath: path("blocos"),
    },
  ],
  concreto: (d) => [
    {
      sku: "concreto",
      name: "Concreto usinado",
      unidade: "m³",
      quantidade: Number(d.volume ?? d.m3 ?? 0),
      categoria_etapa: "Estrutura",
      origem: "concreto",
      origemPath: path("concreto"),
    },
  ],
  cimento: (d) => [
    {
      sku: "cimento-saco-50kg",
      name: "Cimento CP-II (saco 50 kg)",
      unidade: "saco",
      quantidade: Number(d.sacos ?? d.quantidade ?? 0),
      categoria_etapa: "Estrutura",
      origem: "cimento",
      origemPath: path("cimento"),
    },
  ],
  areia: (d) => [
    {
      sku: "areia-media",
      name: "Areia média lavada",
      unidade: "m³",
      quantidade: Number(d.m3 ?? d.volume ?? 0),
      categoria_etapa: "Estrutura",
      origem: "areia",
      origemPath: path("areia"),
    },
  ],
  brita: (d) => [
    {
      sku: "brita-1",
      name: "Brita nº 1",
      unidade: "m³",
      quantidade: Number(d.m3 ?? d.volume ?? 0),
      categoria_etapa: "Estrutura",
      origem: "brita",
      origemPath: path("brita"),
    },
  ],
  aco: (d) => [
    {
      sku: "aco-ca50",
      name: "Vergalhão CA-50",
      unidade: "kg",
      quantidade: Number(d.kg ?? d.massa ?? 0),
      categoria_etapa: "Estrutura",
      origem: "aco",
      origemPath: path("aco"),
    },
  ],
  forma: (d) => [
    {
      sku: "forma-madeira",
      name: "Fôrma de madeira",
      unidade: "m²",
      quantidade: Number(d.m2 ?? d.area ?? 0),
      categoria_etapa: "Estrutura",
      origem: "forma",
      origemPath: path("forma"),
    },
  ],
  telhas: (d) => [
    {
      sku: "telha-ceramica",
      name: "Telha cerâmica",
      unidade: "un",
      quantidade: Number(d.quantidade ?? d.qtd ?? 0),
      categoria_etapa: "Cobertura",
      origem: "telhas",
      origemPath: path("telhas"),
    },
  ],
  piso: (d) => {
    const items: BudgetItem[] = [];
    if (d.caixas != null) {
      items.push({
        sku: "piso-caixa",
        name: "Piso cerâmico (caixa)",
        unidade: "cx",
        quantidade: Number(d.caixas),
        categoria_etapa: "Piso",
        origem: "piso",
        origemPath: path("piso"),
      });
    } else {
      items.push({
        sku: "piso-m2",
        name: "Piso cerâmico",
        unidade: "m²",
        quantidade: Number(d.m2 ?? d.area ?? 0),
        categoria_etapa: "Piso",
        origem: "piso",
        origemPath: path("piso"),
      });
    }
    return items;
  },
  tinta: (d) => [
    {
      sku: "tinta-latex",
      name: "Tinta látex PVA",
      unidade: "L",
      quantidade: Number(d.litros ?? d.litrosRec ?? 0),
      categoria_etapa: "Acabamento",
      origem: "tinta",
      origemPath: path("tinta"),
    },
  ],
  argamassa: (d) => [
    {
      sku: "argamassa-ac",
      name: "Argamassa colante AC-II (20 kg)",
      unidade: "saco",
      quantidade: Number(d.sacos ?? d.quantidade ?? 0),
      categoria_etapa: "Revestimento",
      origem: "argamassa",
      origemPath: path("argamassa"),
    },
  ],
  reboco: (d) => {
    const items: BudgetItem[] = [];
    if (d.cimentoSacos != null)
      items.push({
        sku: "cimento-reboco",
        name: "Cimento p/ reboco",
        unidade: "saco",
        quantidade: Number(d.cimentoSacos),
        categoria_etapa: "Reboco",
        origem: "reboco",
        origemPath: path("reboco"),
      });
    if (d.areiaM3 != null)
      items.push({
        sku: "areia-reboco",
        name: "Areia p/ reboco",
        unidade: "m³",
        quantidade: Number(d.areiaM3),
        categoria_etapa: "Reboco",
        origem: "reboco",
        origemPath: path("reboco"),
      });
    if (items.length === 0 && d.m2 != null)
      items.push({
        sku: "reboco-m2",
        name: "Reboco (área)",
        unidade: "m²",
        quantidade: Number(d.m2),
        categoria_etapa: "Reboco",
        origem: "reboco",
        origemPath: path("reboco"),
      });
    return items;
  },
  rejunte: (d) => [
    {
      sku: "rejunte",
      name: "Rejunte",
      unidade: "kg",
      quantidade: Number(d.kg ?? d.quantidade ?? 0),
      categoria_etapa: "Revestimento",
      origem: "rejunte",
      origemPath: "/calculadora-rejunte",
    },
  ],
  tubos: (d) => [
    {
      sku: "tubo-pvc",
      name: "Tubo PVC",
      unidade: "m",
      quantidade: Number(d.metros ?? d.comprimento ?? 0),
      categoria_etapa: "Instalações",
      origem: "tubos",
      origemPath: path("tubos"),
    },
  ],
  esquadrias: (d) => [
    {
      sku: "esquadria",
      name: "Esquadria (porta/janela)",
      unidade: "un",
      quantidade: Number(d.unidades ?? d.quantidade ?? 0),
      categoria_etapa: "Acabamento",
      origem: "esquadrias",
      origemPath: path("esquadrias"),
    },
  ],
};

export function aggregateResults(outputs: CalculatorsOutputs): BudgetItem[] {
  const items: BudgetItem[] = [];
  for (const [slug, data] of Object.entries(outputs || {})) {
    const adapter = adapters[slug];
    if (!adapter || !data) continue;
    for (const item of adapter(data)) {
      if (item.quantidade > 0) items.push(item);
    }
  }
  return items;
}

export function availableCalculators(): string[] {
  return Object.keys(adapters);
}
