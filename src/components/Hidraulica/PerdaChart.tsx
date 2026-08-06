import type { HidraulicaResult } from "@/lib/hidraulica/calc";

const fmt = (n: number, d = 2) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });

type Point = { x: number; y: number };

function Plot({
  title,
  points,
  xLabel,
  yLabel,
  color,
}: {
  title: string;
  points: Point[];
  xLabel: string;
  yLabel: string;
  color: string;
}) {
  const W = 520;
  const H = 220;
  const pad = { top: 16, right: 16, bottom: 34, left: 52 };
  if (points.length < 2) return null;

  const maxX = Math.max(...points.map((p) => p.x)) || 1;
  const maxY = Math.max(...points.map((p) => p.y)) || 1;
  const sx = (x: number) => pad.left + (x / maxX) * (W - pad.left - pad.right);
  const sy = (y: number) => H - pad.bottom - (y / maxY) * (H - pad.top - pad.bottom);
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"}${sx(p.x)},${sy(p.y)}`).join(" ");

  return (
    <figure className="rounded-xl border border-border bg-card p-4">
      <figcaption className="text-sm font-semibold text-foreground">{title}</figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`${title}. ${yLabel} máximo de ${fmt(maxY, 2)} para ${xLabel} até ${fmt(maxX, 2)}.`}
        className="mt-2 h-auto w-full"
      >
        <line
          x1={pad.left}
          y1={H - pad.bottom}
          x2={W - pad.right}
          y2={H - pad.bottom}
          className="stroke-border"
          strokeWidth={1}
        />
        <line
          x1={pad.left}
          y1={pad.top}
          x2={pad.left}
          y2={H - pad.bottom}
          className="stroke-border"
          strokeWidth={1}
        />
        {[0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={pad.left}
            y1={sy(maxY * t)}
            x2={W - pad.right}
            y2={sy(maxY * t)}
            className="stroke-border/50"
            strokeDasharray="3 3"
            strokeWidth={1}
          />
        ))}
        <path d={d} fill="none" stroke={color} strokeWidth={2} />
        {points.map((p, i) => (
          <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r={2.5} fill={color} />
        ))}
        <text x={pad.left - 8} y={sy(maxY)} textAnchor="end" className="fill-muted-foreground text-[10px]">
          {fmt(maxY, 2)}
        </text>
        <text
          x={pad.left - 8}
          y={H - pad.bottom}
          textAnchor="end"
          className="fill-muted-foreground text-[10px]"
        >
          0
        </text>
        <text
          x={W - pad.right}
          y={H - pad.bottom + 16}
          textAnchor="end"
          className="fill-muted-foreground text-[10px]"
        >
          {fmt(maxX, 1)}
        </text>
        <text
          x={(W + pad.left) / 2}
          y={H - 4}
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          {xLabel}
        </text>
        <text
          transform={`translate(12 ${H / 2}) rotate(-90)`}
          textAnchor="middle"
          className="fill-muted-foreground text-[10px]"
        >
          {yLabel}
        </text>
      </svg>
    </figure>
  );
}

export function PerdaChart({
  result,
  curva,
}: {
  result: HidraulicaResult;
  curva: Array<{ Q_Ls: number; head_m: number }>;
}) {
  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-2">
      <Plot
        title="Perda acumulada ao longo da tubulação"
        points={result.perfil.map((p) => ({ x: p.x_m, y: p.h_m }))}
        xLabel="Comprimento (m)"
        yLabel="Perda (m.c.a.)"
        color="hsl(var(--primary))"
      />
      <Plot
        title="Curva do sistema — altura manométrica vs vazão"
        points={curva.map((p) => ({ x: p.Q_Ls, y: p.head_m }))}
        xLabel="Vazão (L/s)"
        yLabel="Altura (m)"
        color="hsl(var(--accent-foreground))"
      />
    </div>
  );
}
