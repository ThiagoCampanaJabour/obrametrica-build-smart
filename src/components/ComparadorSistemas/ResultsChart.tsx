import type { SystemResult } from "@/lib/comparador-sistemas/calc";

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--ring))"];

export function ResultsChart({ sistemas }: { sistemas: SystemResult[] }) {
  const width = 640;
  const height = 240;
  const pad = 32;
  const anos = sistemas[0].fluxo.length;
  const all = sistemas.flatMap((s) => s.fluxo.map((f) => f.acumulado));
  const min = Math.min(0, ...all);
  const max = Math.max(0, ...all);
  const xs = (i: number) => pad + (i / (anos - 1)) * (width - pad * 2);
  const ys = (v: number) => height - pad - ((v - min) / (max - min || 1)) * (height - pad * 2);
  const zero = ys(0);

  return (
    <figure className="mt-6" aria-label="Fluxo de caixa acumulado por tipo de sistema">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        <line x1={pad} x2={width - pad} y1={zero} y2={zero} stroke="hsl(var(--border))" strokeDasharray="4 4" />
        {sistemas.map((s, si) => {
          const d = s.fluxo
            .map((f, i) => `${i === 0 ? "M" : "L"} ${xs(i)} ${ys(f.acumulado)}`)
            .join(" ");
          return <path key={s.tipo} d={d} fill="none" stroke={COLORS[si]} strokeWidth={2} />;
        })}
      </svg>
      <figcaption className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
        {sistemas.map((s, i) => (
          <span key={s.tipo} className="inline-flex items-center gap-1">
            <span className="inline-block h-2 w-4" style={{ backgroundColor: COLORS[i] }} />
            {s.nome}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
