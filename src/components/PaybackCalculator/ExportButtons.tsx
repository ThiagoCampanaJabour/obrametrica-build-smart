import type { PaybackResult } from "@/lib/payback/calc";

function download(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ExportButtons({ result }: { result: PaybackResult | null }) {
  if (!result) return null;

  const exportJSON = () =>
    download("payback.json", JSON.stringify(result, null, 2), "application/json");

  const exportCSV = () => {
    const header =
      "ano,producao_kWh,tarifa_R_kWh,receita_R,om_R,incentivo_R,fluxo_liquido_R,vpl_acumulado_R";
    const rows = result.fluxo.map((f) =>
      [f.ano, f.producaoKWh, f.tarifa, f.receita, f.om, f.incentivo, f.fluxoLiquido, f.vplAcumulado].join(","),
    );
    download("payback.csv", [header, ...rows].join("\n"), "text/csv");
  };

  return (
    <div className="mt-4 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={exportJSON}
        className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent/20"
      >
        Exportar JSON
      </button>
      <button
        type="button"
        onClick={exportCSV}
        className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent/20"
      >
        Exportar CSV
      </button>
    </div>
  );
}
