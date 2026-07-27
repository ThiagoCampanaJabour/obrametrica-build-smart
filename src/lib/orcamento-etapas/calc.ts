import type { BudgetItem, EtapaCategoria } from "./aggregator";

export interface ComputedItem extends BudgetItem {
  quantidadeAjustada: number;
  subtotalBruto: number;
  subtotal: number;
}

export interface EtapaTotal {
  etapa: EtapaCategoria;
  items: ComputedItem[];
  subtotal: number;
}

export interface OrcamentoTotais {
  etapas: EtapaTotal[];
  subtotal: number;
  descontoGlobalPct: number;
  descontoValor: number;
  impostosPct: number;
  impostosValor: number;
  total: number;
}

export function calcSubtotal(item: BudgetItem): ComputedItem {
  const sobra = 1 + (item.sobraPct ?? 0) / 100;
  const desc = 1 - (item.descontoPct ?? 0) / 100;
  const preco = item.custo_unitario ?? 0;
  const qAjust = item.quantidade * sobra;
  const bruto = qAjust * preco;
  const subtotal = bruto * desc;
  return { ...item, quantidadeAjustada: qAjust, subtotalBruto: bruto, subtotal };
}

export function applySobra<T extends BudgetItem>(item: T, pct: number): T {
  return { ...item, sobraPct: pct };
}

export function applyDesconto<T extends BudgetItem>(item: T, pct: number): T {
  return { ...item, descontoPct: pct };
}

export function computeOrcamento(
  items: BudgetItem[],
  opts: { descontoGlobalPct?: number; impostosPct?: number } = {},
): OrcamentoTotais {
  const computed = items.map(calcSubtotal);
  const byEtapa = new Map<EtapaCategoria, ComputedItem[]>();
  for (const it of computed) {
    const arr = byEtapa.get(it.categoria_etapa) ?? [];
    arr.push(it);
    byEtapa.set(it.categoria_etapa, arr);
  }
  const etapas: EtapaTotal[] = [...byEtapa.entries()].map(([etapa, items]) => ({
    etapa,
    items,
    subtotal: items.reduce((s, i) => s + i.subtotal, 0),
  }));
  const subtotal = etapas.reduce((s, e) => s + e.subtotal, 0);
  const descontoGlobalPct = opts.descontoGlobalPct ?? 0;
  const descontoValor = subtotal * (descontoGlobalPct / 100);
  const base = subtotal - descontoValor;
  const impostosPct = opts.impostosPct ?? 0;
  const impostosValor = base * (impostosPct / 100);
  const total = base + impostosValor;
  return { etapas, subtotal, descontoGlobalPct, descontoValor, impostosPct, impostosValor, total };
}

export function fmtBRL(v: number): string {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function toCSV(totais: OrcamentoTotais): string {
  const header = ["etapa", "sku", "name", "unidade", "quantidade", "preco_unitario", "subtotal"];
  const rows: string[] = [header.join(",")];
  for (const et of totais.etapas) {
    for (const it of et.items) {
      rows.push(
        [
          et.etapa,
          it.sku,
          `"${it.name.replace(/"/g, '""')}"`,
          it.unidade,
          it.quantidadeAjustada.toFixed(2),
          (it.custo_unitario ?? 0).toFixed(2),
          it.subtotal.toFixed(2),
        ].join(","),
      );
    }
  }
  rows.push(`TOTAL,,,,,,${totais.total.toFixed(2)}`);
  return rows.join("\n");
}
