import type { RadiacaoInput, RadiacaoResult } from "@/lib/simulacao-radiacao/calc";

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function download(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export function ExportButtons({ input, result }: { input: RadiacaoInput | null; result: RadiacaoResult | null }) {
  if (!result || !input) return null;

  const exportJSON = () =>
    download("simulacao-radiacao.json", JSON.stringify({ input, output: result }, null, 2), "application/json");

  const exportCSV = () => {
    const header = "mes,irradiancia_kWh_m2,producao_kWh";
    const rows = MESES.map((m, i) =>
      [m, result.irradianciaMensalKWhM2[i], result.producaoMensalKWh[i]].join(","));
    download("simulacao-radiacao.csv", [header, ...rows].join("\n"), "text/csv");
  };

  return (
    <div className="mt-4 flex flex-wrap gap-3">
      <button type="button" onClick={exportJSON} aria-label="Exportar resultado em JSON"
        className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent/20">
        Exportar JSON
      </button>
      <button type="button" onClick={exportCSV} aria-label="Exportar produção mensal em CSV"
        className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent/20">
        Exportar CSV
      </button>
    </div>
  );
}
