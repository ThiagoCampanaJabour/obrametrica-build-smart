import type { SolarLossesResult } from "@/lib/solar/calc";

const fmt = (n: number, d = 0) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });

function Card({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-md border border-border bg-background p-3">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-lg font-semibold text-foreground">{value}</dd>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function ResultsSummary({ result }: { result: SolarLossesResult }) {
  return (
    <div aria-live="polite" className="mt-8 space-y-6">
      <div className="rounded-xl border border-accent/40 bg-accent/10 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
          Resultado do sistema
        </h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card label="Energia teórica DC" value={`${fmt(result.energiaTeorica_kWh)} kWh/ano`} />
          <Card
            label="Energia final AC"
            value={`${fmt(result.energiaFinalAc_kWh)} kWh/ano`}
            hint={`${fmt(result.energiaFinalAc_kWh / 12)} kWh/mês`}
          />
          <Card
            label="Eficiência global"
            value={`${fmt(result.eficienciaSistema_pct, 1)}%`}
            hint="Energia AC ÷ energia teórica DC"
          />
          <Card
            label="Perdas totais"
            value={`${fmt(result.perdaTotal_pct, 1)}%`}
            hint={`${fmt(result.perdaTotal_kWh)} kWh/ano`}
          />
        </dl>
        <p className="mt-3 text-xs text-muted-foreground">
          Temperatura de célula: {fmt(result.tempCelula_C, 1)} °C · ΔT ={" "}
          {fmt(result.deltaT_C, 1)} °C
          {result.dcAcRatio !== null
            ? ` · DC/AC = ${fmt(result.dcAcRatio, 2)} · clipping ${fmt(result.clippingAplicado_pct, 1)}%`
            : ""}
        </p>

        {result.avisos.length > 0 && (
          <ul className="mt-4 space-y-1 rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-foreground">
            {result.avisos.map((a) => (
              <li key={a}>• {a}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[640px] text-left text-sm">
          <caption className="px-4 pt-4 text-left text-sm font-semibold text-foreground">
            Detalhamento das perdas
          </caption>
          <thead className="text-xs uppercase tracking-wide text-muted-foreground">
            <tr className="border-b border-border">
              <th className="px-4 py-3">Item</th>
              <th className="px-4 py-3">Perda (%)</th>
              <th className="px-4 py-3">Perda (kWh/ano)</th>
              <th className="px-4 py-3">Fórmula / premissa</th>
            </tr>
          </thead>
          <tbody>
            {result.breakdown.map((b) => (
              <tr key={b.id} className="border-b border-border/60 text-foreground">
                <td className="px-4 py-3 font-medium">{b.name}</td>
                <td className="px-4 py-3">{fmt(b.pct, 2)}%</td>
                <td className="px-4 py-3">{fmt(b.kWh, 0)}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{b.formula}</td>
              </tr>
            ))}
            <tr className="text-foreground">
              <td className="px-4 py-3 font-semibold">Total de perdas</td>
              <td className="px-4 py-3 font-semibold">{fmt(result.perdaTotal_pct, 2)}%</td>
              <td className="px-4 py-3 font-semibold">{fmt(result.perdaTotal_kWh, 0)}</td>
              <td className="px-4 py-3" />
            </tr>
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[420px] text-left text-sm">
          <caption className="px-4 pt-4 text-left text-sm font-semibold text-foreground">
            Produção com degradação ({fmt(result.input.degradacaoAnual_pct, 2)}% ao ano)
          </caption>
          <thead className="text-xs uppercase tracking-wide text-muted-foreground">
            <tr className="border-b border-border">
              <th className="px-4 py-3">Ano</th>
              <th className="px-4 py-3">Energia estimada (kWh)</th>
              <th className="px-4 py-3">% do ano 1</th>
            </tr>
          </thead>
          <tbody>
            {result.serieDegradacao
              .filter((s, idx) => idx === 0 || s.ano % 5 === 0 || idx === result.serieDegradacao.length - 1)
              .map((s) => (
                <tr key={s.ano} className="border-b border-border/60 text-foreground">
                  <td className="px-4 py-3">{s.ano}</td>
                  <td className="px-4 py-3">{fmt(s.energia_kWh)}</td>
                  <td className="px-4 py-3">
                    {result.energiaFinalAc_kWh > 0
                      ? fmt((s.energia_kWh / result.energiaFinalAc_kWh) * 100, 1)
                      : "0"}
                    %
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
