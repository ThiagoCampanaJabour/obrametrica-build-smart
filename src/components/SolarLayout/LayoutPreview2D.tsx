import { useId, useMemo, useState } from "react";
import type { LayoutResult } from "@/lib/solar/layout-calc";

export const LAYOUT_SVG_ID = "solar-layout-preview-svg";

/**
 * Top-view 2D do arranjo. Coordenadas em metros convertidas para px por um
 * fator de escala; eixo Y do SVG é invertido para que Y=0 fique embaixo.
 */
export function LayoutPreview2D({ result: r }: { result: LayoutResult }) {
  const [zoom, setZoom] = useState(1);
  const titleId = useId();

  const { W, L, escala } = useMemo(() => {
    const w = Math.max(r.input.areaLargura_m, 0.1);
    const l = Math.max(r.input.areaComprimento_m, 0.1);
    return { W: w, L: l, escala: 900 / w };
  }, [r]);

  const px = (m: number) => m * escala;
  const vbW = px(W);
  const vbH = px(L);
  const flipY = (y_m: number, h_m: number) => px(L - y_m - h_m);

  return (
    <div className="mt-6 rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-foreground">Preview 2D (vista superior)</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Área de {r.input.areaLargura_m} × {r.input.areaComprimento_m} m · escala esquemática ·
            topo do desenho = maior Y.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.5, Number((z - 0.25).toFixed(2))))}
            className="rounded-md border border-input bg-background px-2.5 py-1 text-xs text-foreground hover:bg-muted"
            aria-label="Reduzir zoom"
          >
            −
          </button>
          <span className="text-xs text-muted-foreground">{Math.round(zoom * 100)}%</span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(3, Number((z + 0.25).toFixed(2))))}
            className="rounded-md border border-input bg-background px-2.5 py-1 text-xs text-foreground hover:bg-muted"
            aria-label="Aumentar zoom"
          >
            +
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-auto rounded-md border border-border bg-muted/20 p-2">
        <svg
          id={LAYOUT_SVG_ID}
          role="img"
          aria-labelledby={titleId}
          viewBox={`0 0 ${vbW} ${vbH}`}
          style={{ width: `${100 * zoom}%`, minWidth: 320 }}
          className="h-auto"
        >
          <title id={titleId}>
            {`Layout com ${r.nModulos} módulos em ${r.nFileiras} fileiras e ${r.nColunas} colunas`}
          </title>
          <rect
            x={0}
            y={0}
            width={vbW}
            height={vbH}
            className="fill-background stroke-border"
            strokeWidth={2}
          />

          {/* corredores de manutenção */}
          {r.corredores.map((c) => (
            <rect
              key={`cor-${c.y_m}`}
              x={px(r.input.margemBorda_m)}
              y={flipY(c.y_m, c.altura_m)}
              width={px(Math.max(0, W - 2 * r.input.margemBorda_m))}
              height={px(c.altura_m)}
              className="fill-muted"
              opacity={0.7}
            />
          ))}

          {/* sombras projetadas */}
          {r.sombras.map((s) => (
            <rect
              key={`sh-${s.id}`}
              x={px(s.x_m)}
              y={flipY(s.y_m, s.profundidade_m)}
              width={px(s.largura_m)}
              height={px(s.profundidade_m)}
              className="fill-foreground"
              opacity={0.12}
            />
          ))}

          {/* posições bloqueadas */}
          {r.excluidos
            .filter((e) => e.motivo === "obstaculo" || e.motivo === "sombra")
            .map((e) => (
              <rect
                key={`ex-${e.row}-${e.col}`}
                x={px(e.x_m)}
                y={flipY(e.y_m, e.altura_m)}
                width={px(e.largura_m)}
                height={px(e.altura_m)}
                className="fill-destructive stroke-destructive"
                opacity={0.25}
                strokeWidth={1}
              />
            ))}

          {/* módulos */}
          {r.modulos.map((m) => (
            <g key={m.id}>
              <rect
                x={px(m.x_m)}
                y={flipY(m.y_m, m.altura_m)}
                width={px(m.largura_m)}
                height={px(m.altura_m)}
                className="fill-accent stroke-foreground"
                opacity={0.85}
                strokeWidth={1}
              >
                <title>{`${m.id} · fileira ${m.row}, coluna ${m.col} · (${m.x_m} m, ${m.y_m} m) · string #${m.stringId}`}</title>
              </rect>
              <text
                x={px(m.x_m + m.largura_m / 2)}
                y={flipY(m.y_m, m.altura_m) + px(m.altura_m) / 2 + 5}
                textAnchor="middle"
                className="fill-foreground"
                fontSize={Math.max(9, px(0.18))}
              >
                {m.stringId}
              </text>
            </g>
          ))}

          {/* obstáculos por cima */}
          {r.input.obstaculos.map((o) => (
            <rect
              key={`ob-${o.id}`}
              x={px(o.x_m)}
              y={flipY(o.y_m, o.profundidade_m)}
              width={px(o.largura_m)}
              height={px(o.profundidade_m)}
              className="fill-destructive stroke-destructive"
              opacity={0.65}
              strokeWidth={2}
            >
              <title>{`${o.label} — ${o.largura_m} × ${o.profundidade_m} m, altura ${o.altura_m} m`}</title>
            </rect>
          ))}
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-sm bg-accent" /> módulo instalado (nº = string)
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-sm bg-destructive/60" /> obstáculo / posição bloqueada
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-sm bg-foreground/15" /> sombra projetada (inverno)
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-sm bg-muted" /> corredor de manutenção
        </span>
      </div>
    </div>
  );
}
