import { CENARIOS, simulatePayback, type PaybackInput } from "@/lib/payback/calc";

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export function ScenarioCompare({ base }: { base: Omit<PaybackInput, "cenario"> | null }) {
  if (!base) return null;
  const rows = Object.values(CENARIOS).map((c) => ({
    cenario: c,
    result: simulatePayback({ ...base, cenario: c }),
  }));
  return (
    <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground">Comparação entre cenários</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2">Cenário</th>
              <th>Payback simples</th>
              <th>Payback descontado</th>
              <th>VPL</th>
              <th>TIR</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ cenario, result }) => (
              <tr key={cenario.id} className="border-b border-border/50">
                <td className="py-2 font-medium">{cenario.nome}</td>
                <td>{result.paybackSimples !== null ? `${result.paybackSimples} anos` : "—"}</td>
                <td>{result.paybackDescontado !== null ? `${result.paybackDescontado} anos` : "—"}</td>
                <td>{brl(result.vpl)}</td>
                <td>{result.tir !== null ? `${result.tir}%` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
