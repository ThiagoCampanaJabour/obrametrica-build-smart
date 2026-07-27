import type { BateriaResult } from "@/lib/bateria/calc";

function download(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ExportButtons({ result }: { result: BateriaResult | null }) {
  if (!result) return null;

  const exportJSON = () =>
    download("bateria.json", JSON.stringify(result, null, 2), "application/json");

  const exportCSV = () => {
    const header = "ano,capacidade_remanescente_kWh,substituicao,custo_ano_R,custo_acumulado_R,vpl_acumulado_R";
    const rows = result.fluxo.map((f) =>
      [f.ano, f.capacidadeRemanescenteKWh, f.substituicao ? 1 : 0, f.custoAno, f.custoAcumulado, f.custoAcumuladoVPL].join(","),
    );
    download("bateria.csv", [header, ...rows].join("\n"), "text/csv");
  };

  return (
    <div className="mt-4 flex flex-wrap gap-3">
      <button type="button" onClick={exportJSON} aria-label="Exportar resultado em JSON"
        className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent/20">
        Exportar JSON
      </button>
      <button type="button" onClick={exportCSV} aria-label="Exportar fluxo em CSV"
        className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent/20">
        Exportar CSV
      </button>
    </div>
  );
}
