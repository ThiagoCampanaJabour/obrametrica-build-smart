import type { CircuitResult } from "@/lib/eletrico/calc";

const fmt = (n: number, d = 2) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });

export function CircuitTable({ circuitos }: { circuitos: CircuitResult[] }) {
  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full min-w-[720px] text-sm">
        <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
          <tr>
            <th className="px-3 py-2 text-left">Circuito</th>
            <th className="px-3 py-2 text-right">P. efetiva (W)</th>
            <th className="px-3 py-2 text-right">I (A)</th>
            <th className="px-3 py-2 text-right">Disjuntor (A)</th>
            <th className="px-3 py-2 text-right">Bitola (mm²)</th>
            <th className="px-3 py-2 text-right">ΔV (%)</th>
            <th className="px-3 py-2 text-left">Observações</th>
          </tr>
        </thead>
        <tbody>
          {circuitos.map((c) => {
            const warn = c.warnings.length > 0;
            return (
              <tr key={c.id} className={warn ? "bg-amber-500/5" : ""}>
                <td className="px-3 py-2 font-medium text-foreground">{c.nome}</td>
                <td className="px-3 py-2 text-right tabular-nums">{fmt(c.potenciaEfetivaW, 0)}</td>
                <td className="px-3 py-2 text-right tabular-nums">{fmt(c.correnteA, 2)}</td>
                <td className="px-3 py-2 text-right tabular-nums">{c.disjuntorSugeridoA}</td>
                <td className="px-3 py-2 text-right tabular-nums">{c.bitolaMinimaMm2}</td>
                <td
                  className={`px-3 py-2 text-right tabular-nums ${
                    c.quedaTensaoPct > 4 ? "font-semibold text-destructive" : ""
                  }`}
                >
                  {fmt(c.quedaTensaoPct, 2)}
                </td>
                <td className="px-3 py-2 text-xs text-muted-foreground">
                  {c.warnings.length ? c.warnings.join(" ") : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
