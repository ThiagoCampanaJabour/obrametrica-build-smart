import type { Difficulty, LaborInput, LaborTotals } from "@/lib/mao-obra/calc";
import { computeLabor, formatMoney } from "@/lib/mao-obra/calc";

export function ResultsTable({
  totals,
  items,
  onPatch,
  onRemove,
}: {
  totals: LaborTotals;
  items: LaborInput[];
  onPatch: (id: string, patch: Partial<LaborInput>) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="space-y-6">
      {totals.etapas.map((et) => (
        <div key={et.etapa} className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2">
            <h3 className="text-sm font-semibold text-foreground">{et.etapa}</h3>
            <span className="text-xs text-muted-foreground">
              {et.hours_total.toFixed(1)} h · {formatMoney(et.cost_total)}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/20 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left">Serviço</th>
                  <th className="px-3 py-2 text-right">Qtd</th>
                  <th className="px-3 py-2 text-right">Prod. (h/un)</th>
                  <th className="px-3 py-2 text-right">Trab.</th>
                  <th className="px-3 py-2 text-right">Dificuldade</th>
                  <th className="px-3 py-2 text-right">Horas</th>
                  <th className="px-3 py-2 text-right">Dias</th>
                  <th className="px-3 py-2 text-right">Custo/un</th>
                  <th className="px-3 py-2 text-right">Custo</th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody>
                {et.items.map(({ input }) => {
                  const item = items.find((i) => i.id === input.id) ?? input;
                  const r = computeLabor(item);
                  return (
                    <tr key={input.id} className="border-t border-border">
                      <td className="px-3 py-2">
                        <div className="font-medium text-foreground">{item.service}</div>
                        <div className="text-xs text-muted-foreground">{item.unidade}</div>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.quantity}
                          onChange={(e) =>
                            onPatch(input.id!, { quantity: Number(e.target.value) || 0 })
                          }
                          className="w-20 rounded border border-border bg-background px-2 py-1 text-right text-xs"
                          aria-label={`Quantidade de ${item.service}`}
                        />
                      </td>
                      <td className="px-3 py-2 text-right">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.productivity_h_per_unit}
                          onChange={(e) =>
                            onPatch(input.id!, {
                              productivity_h_per_unit: Number(e.target.value) || 0,
                            })
                          }
                          className="w-20 rounded border border-border bg-background px-2 py-1 text-right text-xs"
                          aria-label={`Produtividade de ${item.service}`}
                        />
                      </td>
                      <td className="px-3 py-2 text-right">
                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={item.num_workers}
                          onChange={(e) =>
                            onPatch(input.id!, { num_workers: Number(e.target.value) || 1 })
                          }
                          className="w-16 rounded border border-border bg-background px-2 py-1 text-right text-xs"
                          aria-label={`Trabalhadores em ${item.service}`}
                        />
                      </td>
                      <td className="px-3 py-2 text-right">
                        <select
                          value={item.difficulty}
                          onChange={(e) =>
                            onPatch(input.id!, { difficulty: e.target.value as Difficulty })
                          }
                          className="rounded border border-border bg-background px-2 py-1 text-xs"
                          aria-label={`Dificuldade de ${item.service}`}
                        >
                          <option value="normal">Normal</option>
                          <option value="dificil">Difícil</option>
                          <option value="muito_dificil">Muito difícil</option>
                        </select>
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums">
                        {r.hours_total.toFixed(1)}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums">
                        {r.days_total.toFixed(2)}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums">
                        {formatMoney(r.cost_per_unit)}
                      </td>
                      <td className="px-3 py-2 text-right font-medium tabular-nums">
                        {formatMoney(r.cost_total)}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button
                          type="button"
                          onClick={() => onRemove(input.id!)}
                          className="text-xs text-muted-foreground hover:text-destructive"
                          aria-label={`Remover ${item.service}`}
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
