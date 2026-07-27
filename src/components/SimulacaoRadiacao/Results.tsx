import type { RadiacaoResult } from "@/lib/simulacao-radiacao/calc";

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function fmt(n: number) { return n.toLocaleString("pt-BR"); }

function BarChart({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  const W = 640, H = 200, pad = 28;
  const bw = (W - pad * 2) / values.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 h-56 w-full" role="img" aria-label="Produção mensal em kWh">
      {values.map((v, i) => {
        const h = ((H - pad * 2) * v) / max;
        const x = pad + i * bw;
        const y = H - pad - h;
        return (
          <g key={i}>
            <rect x={x + 2} y={y} width={bw - 4} height={h} className="fill-accent" rx={2} />
            <text x={x + bw / 2} y={H - pad + 14} textAnchor="middle" className="fill-muted-foreground text-[10px]">{MESES[i]}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function Results({ result }: { result: RadiacaoResult | null }) {
  if (!result) return null;
  return (
    <section aria-live="polite" className="mt-8 space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card label="Preset usado" value={result.cidadePresetUsada} sub={`fonte: ${result.fonte}`} />
        <Card label="Irradiância (tilt)" value={`${fmt(result.irradianciaTiltKWhM2)} kWh/m²·ano`}
          sub={`horizontal: ${fmt(result.irradianciaAnualKWhM2)}`} />
        <Card label="Produção anual" value={`${fmt(result.producaoAnualKWh)} kWh`}
          sub={`incerteza ±${result.incertezaPct}%`} />
        <Card label="Fator específico" value={`${fmt(result.fatorEspecificoKWhKWp)} kWh/kWp·ano`} />
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-lg font-semibold text-foreground">Produção mensal (kWh)</h2>
        <BarChart values={result.producaoMensalKWh} />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="py-2 pr-3 font-medium">Mês</th>
                <th className="py-2 pr-3 font-medium">Irradiância (kWh/m²)</th>
                <th className="py-2 pr-3 font-medium">Produção (kWh)</th>
              </tr>
            </thead>
            <tbody>
              {MESES.map((m, i) => (
                <tr key={m} className="border-b border-border/60">
                  <td className="py-1.5 pr-3">{m}</td>
                  <td className="py-1.5 pr-3">{result.irradianciaMensalKWhM2[i]}</td>
                  <td className="py-1.5 pr-3">{result.producaoMensalKWh[i]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {result.projecaoAnos && (
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-lg font-semibold text-foreground">Projeção por ano (degradação aplicada)</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border text-left text-muted-foreground">
                <th className="py-2 pr-3 font-medium">Ano</th>
                <th className="py-2 pr-3 font-medium">Produção (kWh)</th>
              </tr></thead>
              <tbody>
                {result.projecaoAnos.map((r) => (
                  <tr key={r.ano} className="border-b border-border/60">
                    <td className="py-1.5 pr-3">{r.ano}</td>
                    <td className="py-1.5 pr-3">{fmt(r.producaoKWh)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Recomendação: para dados mais precisos, integre com PVGIS/NSRDB ou faça medições locais.
      </p>
    </section>
  );
}

function Card({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg font-semibold text-foreground">{value}</div>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}
