import type { SystemResult } from "@/lib/comparador-sistemas/calc";

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const num = (n: number | null, suffix = "") => (n === null ? "—" : `${n.toLocaleString("pt-BR")}${suffix}`);

export function ComparativeTable({ sistemas }: { sistemas: SystemResult[] }) {
  const rows: Array<[string, (s: SystemResult) => string]> = [
    ["Investimento inicial", (s) => brl(s.investimentoInicial)],
    ["Banco de baterias", (s) => (s.bancoBateriasKWh ? `${s.bancoBateriasKWh} kWh` : "—")],
    ["Custo das baterias", (s) => (s.custoBaterias ? brl(s.custoBaterias) : "—")],
    ["Reposições de bateria (25a)", (s) => String(s.reposicoesBateria)],
    ["Economia anual", (s) => brl(s.economiaAnual)],
    ["Cobertura do consumo", (s) => `${s.coberturaPct}%`],
    ["Autonomia", (s) => (s.autonomiaHoras ? `${s.autonomiaHoras} h` : "—")],
    ["Perdas totais", (s) => `${s.perdasTotaisPct}%`],
    ["Payback simples", (s) => num(s.paybackSimples, " anos")],
    ["Payback descontado", (s) => num(s.paybackDescontado, " anos")],
    ["VPL", (s) => brl(s.vpl)],
    ["TIR", (s) => num(s.tir, "%")],
    ["Custo total (25a)", (s) => brl(s.custoTotal25)],
    ["Complexidade", (s) => s.complexidade],
  ];

  return (
    <div className="mt-6 overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm" summary="Comparativo entre sistemas on-grid, off-grid e híbrido">
        <thead className="bg-muted/50">
          <tr>
            <th scope="col" className="p-3 text-left font-semibold">Indicador</th>
            {sistemas.map((s) => (
              <th key={s.tipo} scope="col" className="p-3 text-left font-semibold">{s.nome}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, fmt]) => (
            <tr key={label} className="border-t border-border">
              <th scope="row" className="p-3 text-left font-medium text-foreground">{label}</th>
              {sistemas.map((s) => (
                <td key={s.tipo} className="p-3 text-muted-foreground">{fmt(s)}</td>
              ))}
            </tr>
          ))}
          <tr className="border-t border-border bg-muted/20">
            <th scope="row" className="p-3 text-left font-medium text-foreground align-top">Observações</th>
            {sistemas.map((s) => (
              <td key={s.tipo} className="p-3 text-xs text-muted-foreground">{s.observacoes}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
