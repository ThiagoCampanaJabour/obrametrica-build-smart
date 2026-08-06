import type { HidraulicaResult } from "@/lib/hidraulica/calc";

const fmt = (n: number, d = 2) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });

const METHOD_LABEL: Record<HidraulicaResult["method"], string> = {
  "darcy-colebrook": "Darcy-Weisbach (Colebrook)",
  "darcy-swamee-jain": "Darcy-Weisbach (Swamee-Jain)",
  "hazen-williams": "Hazen-Williams",
};

function Card({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-md border border-border bg-background p-3">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-lg font-semibold text-foreground">{value}</dd>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function ResultsSummary({
  result,
  onExportCSV,
  onExportJSON,
}: {
  result: HidraulicaResult;
  onExportCSV: () => void;
  onExportJSON: () => void;
}) {
  return (
    <div aria-live="polite" className="rounded-xl border border-accent/40 bg-accent/10 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
          Resultado — {METHOD_LABEL[result.method]}
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onExportCSV}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
          >
            Exportar CSV
          </button>
          <button
            type="button"
            onClick={onExportJSON}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
          >
            Exportar JSON
          </button>
        </div>
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Card label="Perda por atrito" value={`${fmt(result.hf_atrito_m, 3)} m.c.a.`} />
        <Card label="Perdas localizadas" value={`${fmt(result.hf_local_m, 3)} m.c.a.`} />
        <Card
          label="Perda total"
          value={`${fmt(result.hf_total_m, 3)} m.c.a.`}
          hint={`${fmt(result.hf_total_Pa / 1000, 2)} kPa`}
        />
        <Card
          label="Altura manométrica"
          value={`${fmt(result.head_total_m, 3)} m`}
          hint={`inclui Δz = ${fmt(result.desnivel_m, 2)} m`}
        />
        <Card label="Potência hidráulica" value={`${fmt(result.potenciaHidraulica_kW, 3)} kW`} />
        <Card
          label="Potência elétrica estimada"
          value={`${fmt(result.potenciaEletrica_kW, 3)} kW`}
          hint={`${fmt(result.potenciaEletrica_kW * 1.341, 2)} cv`}
        />
      </dl>

      <p className="mt-3 text-xs text-muted-foreground">
        Propriedades da água: ρ = {fmt(result.rho, 2)} kg/m³ · μ ={" "}
        {result.mu.toExponential(3).replace(".", ",")} Pa·s
      </p>

      {result.avisos.length > 0 && (
        <ul className="mt-4 space-y-1 rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-foreground">
          {result.avisos.map((a) => (
            <li key={a}>• {a}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function DetailTable({ result }: { result: HidraulicaResult }) {
  const isHazen = result.method === "hazen-williams";
  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full min-w-[720px] text-left text-sm">
        <caption className="px-4 pt-4 text-left text-sm font-semibold text-foreground">
          Detalhamento por trecho
        </caption>
        <thead className="text-xs uppercase tracking-wide text-muted-foreground">
          <tr className="border-b border-border">
            <th className="px-4 py-3">Trecho</th>
            <th className="px-4 py-3">D (mm)</th>
            <th className="px-4 py-3">L (m)</th>
            <th className="px-4 py-3">Q (L/s)</th>
            <th className="px-4 py-3">V (m/s)</th>
            <th className="px-4 py-3">Re</th>
            {!isHazen && <th className="px-4 py-3">f</th>}
            <th className="px-4 py-3">hf (m)</th>
            <th className="px-4 py-3">hf/100 m</th>
            <th className="px-4 py-3">ΣK</th>
            <th className="px-4 py-3">h local (m)</th>
            <th className="px-4 py-3">Total (m)</th>
          </tr>
        </thead>
        <tbody>
          {result.sections.map((s) => (
            <tr key={s.id} className="border-b border-border/60 text-foreground">
              <td className="px-4 py-3 font-medium">{s.label}</td>
              <td className="px-4 py-3">{fmt(s.D_mm, 1)}</td>
              <td className="px-4 py-3">{fmt(s.L_m, 2)}</td>
              <td className="px-4 py-3">{fmt(s.Q_Ls, 3)}</td>
              <td className="px-4 py-3">{fmt(s.V_m_s, 3)}</td>
              <td className="px-4 py-3">{s.Re.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}</td>
              {!isHazen && <td className="px-4 py-3">{s.f === null ? "—" : fmt(s.f, 5)}</td>}
              <td className="px-4 py-3">{fmt(s.hf_m, 3)}</td>
              <td className="px-4 py-3">{fmt(s.hf_por_100m, 3)}</td>
              <td className="px-4 py-3">{fmt(s.sumK, 2)}</td>
              <td className="px-4 py-3">{fmt(s.hlocal_m, 3)}</td>
              <td className="px-4 py-3 font-semibold">{fmt(s.total_m, 3)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
