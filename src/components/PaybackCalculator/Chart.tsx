import type { AnoFluxo } from "@/lib/payback/calc";

/** Mini gráfico SVG do fluxo de caixa acumulado. */
export function Chart({ fluxo }: { fluxo: AnoFluxo[] }) {
  if (!fluxo.length) return null;
  const w = 640;
  const h = 200;
  const pad = 32;
  const vals = fluxo.map((f) => f.fluxoAcumulado);
  const min = Math.min(0, ...vals);
  const max = Math.max(0, ...vals);
  const range = max - min || 1;
  const stepX = (w - pad * 2) / Math.max(1, fluxo.length - 1);
  const y = (v: number) => h - pad - ((v - min) / range) * (h - pad * 2);
  const zeroY = y(0);

  const path = fluxo
    .map((f, i) => `${i === 0 ? "M" : "L"} ${pad + i * stepX} ${y(f.fluxoAcumulado)}`)
    .join(" ");

  return (
    <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground">Fluxo de caixa acumulado</h3>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="mt-4 w-full text-accent"
        role="img"
        aria-label="Gráfico de fluxo de caixa acumulado ao longo dos anos"
      >
        <line x1={pad} y1={zeroY} x2={w - pad} y2={zeroY} stroke="currentColor" strokeOpacity="0.3" />
        <path d={path} fill="none" stroke="currentColor" strokeWidth="2" />
        {fluxo.map((f, i) => (
          <circle key={f.ano} cx={pad + i * stepX} cy={y(f.fluxoAcumulado)} r="3" fill="currentColor" />
        ))}
        <text x={pad} y={h - 8} className="fill-muted-foreground text-xs">Ano 1</text>
        <text x={w - pad - 24} y={h - 8} className="fill-muted-foreground text-xs">Ano {fluxo.length}</text>
      </svg>
    </div>
  );
}
