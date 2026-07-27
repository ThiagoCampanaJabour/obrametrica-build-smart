import type { SimulateResult } from "@/lib/simulador-avancado/calc";

function download(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ExportButtons({ result }: { result: SimulateResult | null }) {
  if (!result) return null;

  const exportJSON = () => download("simulacao.json", JSON.stringify(result, null, 2), "application/json");

  const exportCSV = () => {
    const header = "string_id,modulos_por_string,potencia_total_W,perda_pct,producao_anual_kWh";
    const rows = result.stringsSuggested.map((s) =>
      [s.string_id, s.modulos, s.potencia_total_W, s.perda_pct, s.producao_anual_kWh].join(","),
    );
    download("simulacao.csv", [header, ...rows].join("\n"), "text/csv");
  };

  return (
    <div className="mt-4 flex flex-wrap gap-3">
      <button type="button" onClick={exportJSON} className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent/20" aria-label="Exportar resultado em JSON">
        Exportar JSON
      </button>
      <button type="button" onClick={exportCSV} className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent/20" aria-label="Exportar strings em CSV">
        Exportar CSV
      </button>
    </div>
  );
}
