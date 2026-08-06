import { exportLayoutCSV, type LayoutResult } from "@/lib/solar/layout-calc";
import { LAYOUT_SVG_ID } from "./LayoutPreview2D";

function download(filename: string, content: BlobPart, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function buildLayoutPayload(r: LayoutResult) {
  return {
    ferramenta: "Calculadora de Área e Layout de Painéis — ObraMétrica",
    gerado_em: new Date().toISOString(),
    inputs: r.input,
    resumo: {
      n_colunas: r.nColunas,
      n_fileiras: r.nFileiras,
      n_modulos_grade: r.nModulosGrade,
      n_modulos: r.nModulos,
      potencia_kWp: r.potencia_kWp,
      n_strings: r.nStrings,
      modulos_ultima_string: r.modulosUltimaString,
      modulos_reserva: r.modulosReserva,
      area_disponivel_m2: r.areaDisponivel_m2,
      area_util_m2: r.areaUtil_m2,
      area_ocupada_m2: r.areaOcupada_m2,
      cobertura_efetiva_pct: r.coberturaEfetiva_pct,
      passo_fileira_m: r.passoFileira_m,
      espacamento_fileiras_m: r.espacamentoFileiras_m,
      elevacao_solar_inverno_deg: r.elevacaoSolarInverno_deg,
    },
    sugestao: r.sugestao,
    modulos: r.modulos,
    excluidos: r.excluidos,
    corredores: r.corredores,
    sombras: r.sombras,
    avisos: r.avisos,
  };
}

function getSvgSource(): { source: string; width: number; height: number } | null {
  const el = document.getElementById(LAYOUT_SVG_ID) as SVGSVGElement | null;
  if (!el) return null;
  const clone = el.cloneNode(true) as SVGSVGElement;
  const vb = (el.getAttribute("viewBox") ?? "0 0 800 600").split(/\s+/).map(Number);
  const width = vb[2] || 800;
  const height = vb[3] || 600;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", String(width));
  clone.setAttribute("height", String(height));
  // Converte classes utilitárias em cores concretas para o arquivo exportado.
  clone.querySelectorAll("rect, text").forEach((node) => {
    const original = el.querySelector(`#${CSS.escape(node.id)}`);
    void original;
  });
  const source = new XMLSerializer().serializeToString(clone);
  return { source, width, height };
}

export function ExportLayout({ result }: { result: LayoutResult }) {
  const exportCSV = () =>
    download("obrametrica-layout-paineis.csv", exportLayoutCSV(result), "text/csv;charset=utf-8");

  const exportJSON = () =>
    download(
      "obrametrica-layout-paineis.json",
      JSON.stringify(buildLayoutPayload(result), null, 2),
      "application/json",
    );

  const exportSVG = () => {
    const svg = getSvgSource();
    if (!svg) return;
    download("obrametrica-layout-paineis.svg", svg.source, "image/svg+xml;charset=utf-8");
  };

  const exportPNG = () => {
    const svg = getSvgSource();
    if (!svg) return;
    const img = new Image();
    const url = URL.createObjectURL(new Blob([svg.source], { type: "image/svg+xml;charset=utf-8" }));
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = svg.width;
      canvas.height = svg.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (!blob) return;
          download("obrametrica-layout-paineis.png", blob, "image/png");
        }, "image/png");
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const btn =
    "rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted";

  return (
    <div className="mt-6 flex flex-wrap gap-2">
      <button type="button" onClick={exportCSV} className={btn}>
        Exportar CSV (posições)
      </button>
      <button type="button" onClick={exportJSON} className={btn}>
        Exportar JSON
      </button>
      <button type="button" onClick={exportSVG} className={btn}>
        Exportar SVG
      </button>
      <button type="button" onClick={exportPNG} className={btn}>
        Exportar PNG
      </button>
      <button type="button" onClick={() => window.print()} className={btn}>
        Relatório técnico (PDF)
      </button>
    </div>
  );
}
