import type { SolarLossesResult } from "@/lib/solar/calc";

const COLORS = [
  "fill-primary",
  "fill-accent",
  "fill-chart-3",
  "fill-chart-4",
  "fill-chart-5",
  "fill-muted-foreground",
  "fill-destructive",
  "fill-secondary",
  "fill-ring",
];

/** Barra empilhada horizontal com a quebra percentual das perdas + energia final. */
export function LossBreakdownChart({ result }: { result: SolarLossesResult }) {
  const total = result.energiaTeorica_kWh;
  if (total <= 0) return null;

  const segments = [
    ...result.breakdown
      .filter((b) => b.kWh > 0)
      .map((b, idx) => ({
        name: b.name,
        pct: b.pct,
        className: COLORS[idx % COLORS.length]!,
      })),
  ];
  const finalPct = result.eficienciaSistema_pct;

  let x = 0;
  return (
    <figure className="mt-6 rounded-xl border border-border bg-card p-5">
      <figcaption className="text-sm font-semibold text-foreground">
        Quebra da energia teórica DC
      </figcaption>
      <svg
        viewBox="0 0 100 10"
        preserveAspectRatio="none"
        role="img"
        aria-label="Gráfico de barras empilhadas com a quebra de perdas do sistema"
        className="mt-4 h-10 w-full overflow-hidden rounded-md"
      >
        <rect x="0" y="0" width="100" height="10" className="fill-muted" />
        {segments.map((s) => {
          const w = Math.max(0, s.pct);
          const el = (
            <rect key={s.name} x={x} y={0} width={w} height={10} className={s.className}>
              <title>{`${s.name}: ${s.pct.toFixed(2)}%`}</title>
            </rect>
          );
          x += w;
          return el;
        })}
        <rect x={x} y={0} width={Math.max(0, finalPct)} height={10} className="fill-chart-2">
          <title>{`Energia final AC: ${finalPct.toFixed(2)}%`}</title>
        </rect>
      </svg>

      <ul className="mt-4 grid gap-2 text-xs sm:grid-cols-2 lg:grid-cols-3">
        {segments.map((s) => (
          <li key={s.name} className="flex items-center gap-2 text-muted-foreground">
            <svg viewBox="0 0 10 10" className="h-3 w-3 shrink-0" aria-hidden="true">
              <rect width="10" height="10" rx="2" className={s.className} />
            </svg>
            <span className="text-foreground">{s.name}</span>
            <span>{s.pct.toFixed(2)}%</span>
          </li>
        ))}
        <li className="flex items-center gap-2 text-muted-foreground">
          <svg viewBox="0 0 10 10" className="h-3 w-3 shrink-0" aria-hidden="true">
            <rect width="10" height="10" rx="2" className="fill-chart-2" />
          </svg>
          <span className="text-foreground">Energia final AC</span>
          <span>{finalPct.toFixed(2)}%</span>
        </li>
      </ul>
    </figure>
  );
}
