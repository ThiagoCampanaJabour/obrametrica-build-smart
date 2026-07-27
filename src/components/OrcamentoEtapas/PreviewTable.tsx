import { useState } from "react";
import type { BudgetItem } from "@/lib/orcamento-etapas/aggregator";
import type { OrcamentoTotais, ComputedItem } from "@/lib/orcamento-etapas/calc";
import { fmtBRL } from "@/lib/orcamento-etapas/calc";
import { ItemDetail } from "./ItemDetail";

export function PreviewTable({
  totais,
  items,
  onPatch,
}: {
  totais: OrcamentoTotais;
  items: BudgetItem[];
  onPatch: (index: number, patch: Partial<BudgetItem>) => void;
}) {
  const [selected, setSelected] = useState<ComputedItem | null>(null);

  const indexOf = (it: ComputedItem) =>
    items.findIndex((x) => x.sku === it.sku && x.origem === it.origem);

  return (
    <>
      <div className="mt-6 space-y-6">
        {totais.etapas.map((et) => (
          <details
            key={et.etapa}
            open
            className="rounded-xl border border-border bg-card"
          >
            <summary className="flex cursor-pointer items-center justify-between px-4 py-3">
              <span className="text-sm font-semibold text-foreground">{et.etapa}</span>
              <span className="text-sm text-muted-foreground">
                {fmtBRL(et.subtotal)}
              </span>
            </summary>
            <div className="overflow-x-auto border-t border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2">Item</th>
                    <th className="px-3 py-2">Un.</th>
                    <th className="px-3 py-2 text-right">Qtd base</th>
                    <th className="px-3 py-2 text-right">Sobra %</th>
                    <th className="px-3 py-2 text-right">Preço unit.</th>
                    <th className="px-3 py-2 text-right">Desc. %</th>
                    <th className="px-3 py-2 text-right">Subtotal</th>
                    <th className="px-3 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {et.items.map((it) => {
                    const idx = indexOf(it);
                    return (
                      <tr key={it.sku + it.origem} className="border-t border-border">
                        <td className="px-3 py-2 text-foreground">{it.name}</td>
                        <td className="px-3 py-2 text-muted-foreground">{it.unidade}</td>
                        <td className="px-3 py-2 text-right">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={it.quantidade}
                            aria-label={`Quantidade de ${it.name}`}
                            onChange={(e) =>
                              onPatch(idx, { quantidade: Number(e.target.value) || 0 })
                            }
                            className="w-24 rounded border border-border bg-background px-2 py-1 text-right"
                          />
                        </td>
                        <td className="px-3 py-2 text-right">
                          <input
                            type="number"
                            min="0"
                            step="0.1"
                            value={it.sobraPct ?? 0}
                            aria-label={`Sobra de ${it.name}`}
                            onChange={(e) =>
                              onPatch(idx, { sobraPct: Number(e.target.value) || 0 })
                            }
                            className="w-20 rounded border border-border bg-background px-2 py-1 text-right"
                          />
                        </td>
                        <td className="px-3 py-2 text-right">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={it.custo_unitario ?? 0}
                            aria-label={`Preço unitário de ${it.name}`}
                            onChange={(e) =>
                              onPatch(idx, { custo_unitario: Number(e.target.value) || 0 })
                            }
                            className="w-24 rounded border border-border bg-background px-2 py-1 text-right"
                          />
                        </td>
                        <td className="px-3 py-2 text-right">
                          <input
                            type="number"
                            min="0"
                            step="0.1"
                            value={it.descontoPct ?? 0}
                            aria-label={`Desconto de ${it.name}`}
                            onChange={(e) =>
                              onPatch(idx, { descontoPct: Number(e.target.value) || 0 })
                            }
                            className="w-20 rounded border border-border bg-background px-2 py-1 text-right"
                          />
                        </td>
                        <td className="px-3 py-2 text-right font-semibold text-foreground">
                          {fmtBRL(it.subtotal)}
                        </td>
                        <td className="px-3 py-2 text-right">
                          <button
                            type="button"
                            onClick={() => setSelected(it)}
                            className="text-xs font-medium text-foreground underline"
                          >
                            Detalhes
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </details>
        ))}
      </div>

      {selected && <ItemDetail item={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
