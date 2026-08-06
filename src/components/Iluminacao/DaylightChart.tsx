import type { AmbienteResult } from "@/lib/iluminacao/calc";

/** Gráfico horário de iluminância interna estimada (SVG puro, sem dependências). */
export function DaylightChart({ ambiente }: { ambiente: AmbienteResult }) {
  const horas = ambiente.horas;
  const target = ambiente.input.targetLux;
  const max = Math.max(target * 1.2, ...horas.map((h) => h.eInsideLux), 1);

  const w = 640;
  const h = 220;
  const padL = 48;
  const padB = 28;
  const padT = 12;
  const innerW = w - padL - 12;
  const innerH = h - padB - padT;
  const barW = innerW / horas.length;

  const yTarget = padT + innerH * (1 - target / max);

  const cor = (lux: number) => {
    if (lux >= target) return "hsl(var(--chart-ok, 142 60% 40%))";
    if (lux >= target * 0.6) return "hsl(var(--chart-warn, 38 92% 50%))";
    return "hsl(var(--chart-bad, 0 72% 51%))";
  };

  return (
    <div className="mt-4 rounded-lg border border-border bg-background p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Iluminância interna estimada por hora — alvo {target} lux
      </p>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        role="img"
        aria-label={`Gráfico de iluminância interna por hora para ${ambiente.input.nome}. Média ${ambiente.eMediaLux} lux, alvo ${target} lux.`}
        className="mt-3 w-full"
      >
        <line x1={padL} y1={padT} x2={padL} y2={padT + innerH} stroke="currentColor" strokeOpacity="0.25" />
        <line
          x1={padL}
          y1={padT + innerH}
          x2={padL + innerW}
          y2={padT + innerH}
          stroke="currentColor"
          strokeOpacity="0.25"
        />
        <line
          x1={padL}
          y1={yTarget}
          x2={padL + innerW}
          y2={yTarget}
          stroke="currentColor"
          strokeOpacity="0.5"
          strokeDasharray="4 4"
        />
        <text x={4} y={yTarget + 4} fontSize="10" fill="currentColor" opacity="0.7">
          {target}
        </text>
        <text x={4} y={padT + 8} fontSize="10" fill="currentColor" opacity="0.7">
          {Math.round(max)}
        </text>
        {horas.map((hr, i) => {
          const bh = innerH * Math.min(hr.eInsideLux / max, 1);
          return (
            <g key={hr.hora}>
              <rect
                x={padL + i * barW + barW * 0.15}
                y={padT + innerH - bh}
                width={barW * 0.7}
                height={Math.max(bh, 1)}
                fill={cor(hr.eInsideLux)}
                opacity="0.85"
              >
                <title>{`${hr.hora}h — ${hr.eInsideLux} lux (direta ${hr.irradianciaDiretaWm2} W/m²)`}</title>
              </rect>
              <text
                x={padL + i * barW + barW / 2}
                y={h - 10}
                fontSize="9"
                textAnchor="middle"
                fill="currentColor"
                opacity="0.7"
              >
                {hr.hora}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="mt-2 text-xs text-muted-foreground">
        Verde: acima do alvo. Âmbar: entre 60% e 100% do alvo. Vermelho: abaixo de 60% do alvo.
      </p>
    </div>
  );
}
