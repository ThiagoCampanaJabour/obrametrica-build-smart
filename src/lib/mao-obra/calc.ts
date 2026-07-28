export type LaborUnit = "m2" | "m3" | "kg" | "un" | "m";
export type Difficulty = "normal" | "dificil" | "muito_dificil";
export type LaborEtapa =
  | "Alvenaria"
  | "Estrutura"
  | "Acabamento"
  | "Revestimento"
  | "Cobertura"
  | "Instalações"
  | "Outros";

export interface LaborInput {
  id?: string;
  service: string;
  etapa: LaborEtapa;
  quantity: number;
  unidade: LaborUnit;
  productivity_h_per_unit: number;
  num_workers: number;
  cost_per_hour: number;
  difficulty: Difficulty;
  shift_hours: number;
}

export interface LaborResult {
  hours_total: number;
  hours_per_worker: number;
  days_total: number;
  cost_total: number;
  cost_per_unit: number;
}

export const DIFFICULTY_FACTOR: Record<Difficulty, number> = {
  normal: 1,
  dificil: 1.1,
  muito_dificil: 1.25,
};

export function applyDifficultyFactor(base: number, d: Difficulty): number {
  return base * DIFFICULTY_FACTOR[d];
}

export function safeDivide(a: number, b: number): number {
  return b === 0 || !Number.isFinite(b) ? 0 : a / b;
}

export function formatMoney(v: number): string {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function computeLabor(item: LaborInput): LaborResult {
  const workers = Math.max(1, item.num_workers || 1);
  const shift = Math.max(1, item.shift_hours || 8);
  const hours_total =
    item.quantity *
    item.productivity_h_per_unit *
    DIFFICULTY_FACTOR[item.difficulty];
  const hours_per_worker = safeDivide(hours_total, workers);
  const days_total = safeDivide(hours_per_worker, shift);
  const cost_total = hours_total * item.cost_per_hour;
  const cost_per_unit = safeDivide(cost_total, item.quantity);
  return { hours_total, hours_per_worker, days_total, cost_total, cost_per_unit };
}

export interface EtapaLaborTotal {
  etapa: LaborEtapa;
  items: Array<{ input: LaborInput; result: LaborResult }>;
  hours_total: number;
  cost_total: number;
}

export interface LaborTotals {
  etapas: EtapaLaborTotal[];
  hours_total: number;
  cost_total: number;
}

export function computeAll(items: LaborInput[]): LaborTotals {
  const computed = items.map((input) => ({ input, result: computeLabor(input) }));
  const map = new Map<LaborEtapa, EtapaLaborTotal>();
  for (const c of computed) {
    const cur =
      map.get(c.input.etapa) ??
      { etapa: c.input.etapa, items: [], hours_total: 0, cost_total: 0 };
    cur.items.push(c);
    cur.hours_total += c.result.hours_total;
    cur.cost_total += c.result.cost_total;
    map.set(c.input.etapa, cur);
  }
  const etapas = [...map.values()];
  return {
    etapas,
    hours_total: etapas.reduce((s, e) => s + e.hours_total, 0),
    cost_total: etapas.reduce((s, e) => s + e.cost_total, 0),
  };
}

export function toCSV(totals: LaborTotals): string {
  const header = [
    "etapa",
    "servico",
    "unidade",
    "quantidade",
    "produtividade_h_un",
    "trabalhadores",
    "horas_totais",
    "dias_totais",
    "custo_unitario",
    "custo_total",
  ];
  const rows: string[] = [header.join(",")];
  for (const et of totals.etapas) {
    for (const { input, result } of et.items) {
      rows.push(
        [
          et.etapa,
          `"${input.service.replace(/"/g, '""')}"`,
          input.unidade,
          input.quantity,
          input.productivity_h_per_unit,
          input.num_workers,
          result.hours_total.toFixed(2),
          result.days_total.toFixed(2),
          result.cost_per_unit.toFixed(2),
          result.cost_total.toFixed(2),
        ].join(","),
      );
    }
  }
  rows.push(`TOTAL,,,,,,${totals.hours_total.toFixed(2)},,,${totals.cost_total.toFixed(2)}`);
  return rows.join("\n");
}

export interface ProductivityPreset {
  id: string;
  service: string;
  etapa: LaborEtapa;
  unidade: LaborUnit;
  productivity_h_per_unit: number;
}

export function importFromCalculator(payload: {
  service: string;
  quantity: number;
  unit: LaborUnit;
}): Partial<LaborInput> {
  return { service: payload.service, quantity: payload.quantity, unidade: payload.unit };
}
