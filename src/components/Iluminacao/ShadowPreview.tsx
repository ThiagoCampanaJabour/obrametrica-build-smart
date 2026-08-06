import type { AmbienteResult } from "@/lib/iluminacao/calc";

/**
 * Corte esquemático 2D da fachada: janela, proteção horizontal e alcance
 * aproximado da luz direta no piso do ambiente.
 */
export function ShadowPreview({ ambiente }: { ambiente: AmbienteResult }) {
  const { input } = ambiente;
  const proj = Math.max(input.protecoes.beiralM, input.protecoes.briseHorizM);
  const escala = 40; // px por metro
  const depthPx = Math.min(input.profundidadeM, 8) * escala;
  const heightPx = Math.min(input.peDireitoM, 5) * escala;
  const winH = Math.min(input.alturaJanelaM, input.peDireitoM) * escala;
  const projPx = Math.min(proj, 3) * escala;

  // Alcance da luz direta no piso para um sol a ~45° descontando a projeção.
  const alcanceM = Math.max(0, input.alturaJanelaM - proj) * 1.2;
  const alcancePx = Math.min(alcanceM * escala, depthPx);

  const w = depthPx + 120;
  const h = heightPx + 60;
  const x0 = 60;
  const y0 = 24;

  return (
    <div className="mt-4 rounded-lg border border-border bg-background p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Corte esquemático — penetração da luz direta
      </p>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        role="img"
        aria-label={`Corte esquemático do ambiente ${input.nome} com profundidade ${input.profundidadeM} m, janela de ${input.alturaJanelaM} m e proteção horizontal de ${proj} m. Penetração estimada da luz direta: ${alcanceM.toFixed(1)} m.`}
        className="mt-3 w-full max-w-xl"
      >
        {/* piso e teto */}
        <rect
          x={x0}
          y={y0}
          width={depthPx}
          height={heightPx}
          fill="currentColor"
          opacity="0.04"
          stroke="currentColor"
          strokeOpacity="0.35"
        />
        {/* faixa iluminada no piso */}
        <rect
          x={x0}
          y={y0 + heightPx - 8}
          width={alcancePx}
          height={8}
          className="fill-accent"
          opacity="0.65"
        />
        {/* janela na parede esquerda */}
        <rect
          x={x0 - 4}
          y={y0 + heightPx - winH - 12}
          width={8}
          height={winH}
          className="fill-primary"
          opacity="0.8"
        />
        {/* proteção horizontal */}
        {projPx > 0 && (
          <rect
            x={x0 - projPx}
            y={y0 + heightPx - winH - 18}
            width={projPx}
            height={6}
            fill="currentColor"
            opacity="0.6"
          />
        )}
        {/* raio solar */}
        <line
          x1={x0 - projPx}
          y1={y0 + heightPx - winH - 18}
          x2={x0 + alcancePx}
          y2={y0 + heightPx - 8}
          stroke="currentColor"
          strokeOpacity="0.5"
          strokeDasharray="5 4"
        />
        <text x={x0 + 6} y={y0 + heightPx + 20} fontSize="10" fill="currentColor" opacity="0.7">
          penetração ≈ {alcanceM.toFixed(1)} m de {input.profundidadeM} m
        </text>
        <text x={2} y={y0 + heightPx - winH - 24} fontSize="10" fill="currentColor" opacity="0.7">
          {proj > 0 ? `${proj.toFixed(2)} m` : "sem beiral"}
        </text>
      </svg>
      <p className="mt-2 text-xs text-muted-foreground">
        Representação esquemática para leitura rápida — não substitui estudo de máscaras solares
        nem modelagem 3D.
      </p>
    </div>
  );
}
