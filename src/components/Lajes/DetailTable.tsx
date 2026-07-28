import type { LajePainelResult } from "@/lib/lajes/calc";

const fmt = (n: number, d = 2) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });

export function DetailTable({
  paineis,
  showEngenharia,
}: {
  paineis: LajePainelResult[];
  showEngenharia: boolean;
}) {
  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card">
      <table className="min-w-full divide-y divide-border text-sm">
        <caption className="sr-only">Detalhamento por painel de laje</caption>
        <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
          <tr>
            <th scope="col" className="px-3 py-2">Painel</th>
            <th scope="col" className="px-3 py-2">Tipo</th>
            <th scope="col" className="px-3 py-2">L × W (m)</th>
            <th scope="col" className="px-3 py-2">Área (m²)</th>
            <th scope="col" className="px-3 py-2">t eq. (m)</th>
            <th scope="col" className="px-3 py-2">Volume (m³)</th>
            <th scope="col" className="px-3 py-2">Aço (kg)</th>
            <th scope="col" className="px-3 py-2">Vergalhões (m)</th>
            <th scope="col" className="px-3 py-2">Formas (m²)</th>
            {showEngenharia && (
              <>
                <th scope="col" className="px-3 py-2">Mu (kN·m/m)</th>
                <th scope="col" className="px-3 py-2">As (cm²/m)</th>
              </>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {paineis.map((r) => (
            <tr key={r.id}>
              <td className="px-3 py-2 font-medium text-foreground">{r.id}</td>
              <td className="px-3 py-2">{r.tipo === "macica" ? "Maciça" : "Nervurada"}</td>
              <td className="px-3 py-2">
                {fmt(r.L, 2)} × {fmt(r.W, 2)}
              </td>
              <td className="px-3 py-2">{fmt(r.areaM2)}</td>
              <td className="px-3 py-2">{fmt(r.espessuraEquivalenteM, 3)}</td>
              <td className="px-3 py-2">{fmt(r.volumeConcretoM3, 3)}</td>
              <td className="px-3 py-2">{fmt(r.acoKg, 1)}</td>
              <td className="px-3 py-2">{fmt(r.vergalhoesM, 1)}</td>
              <td className="px-3 py-2">{fmt(r.formaM2)}</td>
              {showEngenharia && (
                <>
                  <td className="px-3 py-2">{fmt(r.momentoKNm ?? 0, 2)}</td>
                  <td className="px-3 py-2">{fmt(r.asCm2PorM ?? 0, 2)}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {paineis.some((p) => p.warnings.length > 0) && (
        <ul
          role="alert"
          aria-live="polite"
          className="m-4 space-y-1 rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-foreground"
        >
          {paineis.flatMap((p) =>
            p.warnings.map((w, i) => (
              <li key={`${p.id}-${i}`}>
                <strong>{p.id}:</strong> {w}
              </li>
            )),
          )}
        </ul>
      )}
    </div>
  );
}
