import { costToCSV, type CostResult } from "@/lib/solar/cost-estimator";

function download(name: string, mime: string, content: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

const slug = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\W+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase() || "sistema";

export function ExportReport({ result }: { result: CostResult }) {
  const base = `tco-${slug(result.inputs.nome)}`;

  const exportCSV = () => download(`${base}-bom.csv`, "text/csv;charset=utf-8", costToCSV(result));

  const exportJSON = () =>
    download(
      `${base}.json`,
      "application/json",
      JSON.stringify(
        {
          gerado_em: new Date().toISOString(),
          ferramenta: "ObraMétrica — Estimador de Custo Total do Sistema (TCO)",
          inputs: result.inputs,
          dimensionamento: result.dimensionamento,
          capex: result.capex,
          opex: result.opex,
          substituicoes: result.substituicoes,
          cashflow: result.cashflow,
          indicadores: result.indicadores,
          avisos: result.avisos,
        },
        null,
        2,
      ),
    );

  const gerarProposta = () => window.print();

  return (
    <section className="mt-6 rounded-xl border border-border bg-card p-5 print:hidden">
      <h2 className="text-base font-semibold text-foreground">Exportar</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        O CSV traz a lista de materiais (BOM) e o fluxo de caixa; o JSON contém o payload completo e
        pode ser reimportado ou enviado a um orçamentador via <code>POST /api/quote</code>.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={exportCSV}
          className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Baixar BOM (CSV)
        </button>
        <button
          type="button"
          onClick={exportJSON}
          className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Baixar JSON
        </button>
        <button
          type="button"
          onClick={gerarProposta}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Gerar proposta (PDF)
        </button>
      </div>
    </section>
  );
}
