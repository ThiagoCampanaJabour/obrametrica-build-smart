import type { SimulateResult } from "@/lib/simulador-avancado/calc";

export function Results({ result }: { result: SimulateResult | null }) {
  if (!result) return null;
  const max = Math.max(...result.stringsSuggested.map((s) => s.producao_anual_kWh), 1);

  return (
    <div aria-live="polite" className="mt-8 space-y-6">
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-foreground">Resultados</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <Item label="Área utilizável" value={`${result.areaUsavel} m²`} />
          <Item label="Módulos" value={`${result.numModulos}`} highlight />
          <Item label="Potência total" value={`${result.potenciaTotalKWp} kWp`} />
          <Item label="Perda por sombreamento" value={`${result.perdaSombreamentoPct}%`} />
          <Item label="Produção anual estimada" value={`${result.producEstimadaKWh.toLocaleString("pt-BR")} kWh/ano`} highlight />
          <Item label="Ganho com otimização" value={`${result.comparativo.ganhoPct}%`} />
        </dl>
      </div>

      {result.stringsSuggested.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-foreground">Configurações de strings sugeridas</h3>
          <p className="mt-1 text-sm text-muted-foreground">Ordenadas por produção anual estimada.</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-2">#</th>
                  <th>Módulos/string</th>
                  <th>Potência (W)</th>
                  <th>Perda</th>
                  <th>Produção (kWh/ano)</th>
                  <th>Gráfico</th>
                </tr>
              </thead>
              <tbody>
                {result.stringsSuggested.map((s) => (
                  <tr key={s.string_id} className="border-b border-border/50">
                    <td className="py-2">{s.string_id}</td>
                    <td>{s.modulos}</td>
                    <td>{s.potencia_total_W.toLocaleString("pt-BR")}</td>
                    <td>{s.perda_pct}%</td>
                    <td>{s.producao_anual_kWh.toLocaleString("pt-BR")}</td>
                    <td>
                      <svg width="120" height="10" role="img" aria-label={`Barra ${s.producao_anual_kWh} kWh/ano`}>
                        <rect x="0" y="0" width={(s.producao_anual_kWh / max) * 120} height="10" fill="currentColor" className="text-accent" />
                      </svg>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function Item({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className={highlight ? "text-2xl font-bold text-foreground" : "text-base text-foreground"}>{value}</dd>
    </div>
  );
}
