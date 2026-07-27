import type { PaybackResult } from "@/lib/payback/calc";

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export function ResultsTable({ result }: { result: PaybackResult | null }) {
  if (!result) return null;
  return (
    <div aria-live="polite" className="mt-8 space-y-6">
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-foreground">Resumo financeiro</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Item label="Investimento" value={brl(result.investimento)} />
          <Item label="Payback simples" value={result.paybackSimples !== null ? `${result.paybackSimples} anos` : "—"} highlight />
          <Item label="Payback descontado" value={result.paybackDescontado !== null ? `${result.paybackDescontado} anos` : "—"} highlight />
          <Item label="VPL" value={brl(result.vpl)} />
          <Item label="TIR" value={result.tir !== null ? `${result.tir}%` : "—"} highlight />
          <Item label="Economia total" value={brl(result.economiaTotal)} />
        </dl>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground">Fluxo de caixa ano a ano</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="py-2">Ano</th>
                <th>Produção (kWh)</th>
                <th>Tarifa</th>
                <th>Receita</th>
                <th>O&amp;M</th>
                <th>Fluxo líquido</th>
                <th>VPL acumulado</th>
              </tr>
            </thead>
            <tbody>
              {result.fluxo.map((f) => (
                <tr key={f.ano} className="border-b border-border/50">
                  <td className="py-2">{f.ano}</td>
                  <td>{f.producaoKWh.toLocaleString("pt-BR")}</td>
                  <td>R$ {f.tarifa.toFixed(3)}</td>
                  <td>{brl(f.receita)}</td>
                  <td>{brl(f.om)}</td>
                  <td className={f.fluxoLiquido >= 0 ? "text-foreground" : "text-destructive"}>{brl(f.fluxoLiquido)}</td>
                  <td className={f.vplAcumulado >= 0 ? "text-foreground" : "text-destructive"}>{brl(f.vplAcumulado)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Item({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className={highlight ? "text-xl font-bold text-foreground" : "text-base text-foreground"}>{value}</dd>
    </div>
  );
}
