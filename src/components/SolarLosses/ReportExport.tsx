import type { SolarLossesResult } from "@/lib/solar/calc";

function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function buildExportPayload(result: SolarLossesResult) {
  return {
    ferramenta: "Calculadora de Perdas / Eficiência — ObraMétrica",
    gerado_em: new Date().toISOString(),
    inputs: result.input,
    loss_items: result.breakdown.map((b) => ({
      id: b.id,
      name: b.name,
      pct: Number(b.pct.toFixed(4)),
      kWh: Number(b.kWh.toFixed(2)),
      formula: b.formula,
    })),
    temp_celula_C: Number(result.tempCelula_C.toFixed(2)),
    dc_ac_ratio: result.dcAcRatio,
    clipping_pct: result.clippingAplicado_pct,
    energia_teorica_dc_kWh: Number(result.energiaTeorica_kWh.toFixed(2)),
    final_energy_kWh: Number(result.energiaFinalAc_kWh.toFixed(2)),
    efficiency_pct: Number(result.eficienciaSistema_pct.toFixed(3)),
    perda_total_kWh: Number(result.perdaTotal_kWh.toFixed(2)),
    serie_degradacao: result.serieDegradacao.map((s) => ({
      ano: s.ano,
      energia_kWh: Number(s.energia_kWh.toFixed(2)),
    })),
    avisos: result.avisos,
    presets_used: "defaults ObraMétrica — ver /content/energia-solar/perdas/presets.json",
  };
}

export function ReportExport({ result }: { result: SolarLossesResult }) {
  const exportJSON = () =>
    download(
      "obrametrica-perdas-eficiencia.json",
      JSON.stringify(buildExportPayload(result), null, 2),
      "application/json",
    );

  const exportCSV = () => {
    const rows: string[][] = [
      ["item", "perda_pct", "perda_kWh", "formula"],
      ...result.breakdown.map((b) => [
        b.name,
        b.pct.toFixed(4),
        b.kWh.toFixed(2),
        `"${b.formula.replace(/"/g, "'")}"`,
      ]),
      [],
      ["energia_teorica_dc_kWh", result.energiaTeorica_kWh.toFixed(2)],
      ["energia_final_ac_kWh", result.energiaFinalAc_kWh.toFixed(2)],
      ["eficiencia_pct", result.eficienciaSistema_pct.toFixed(3)],
      ["perda_total_pct", result.perdaTotal_pct.toFixed(3)],
    ];
    download(
      "obrametrica-perdas-eficiencia.csv",
      rows.map((r) => r.join(";")).join("\n"),
      "text/csv;charset=utf-8",
    );
  };

  return (
    <div className="mt-6 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={exportCSV}
        className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
      >
        Exportar CSV
      </button>
      <button
        type="button"
        onClick={exportJSON}
        className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
      >
        Exportar JSON
      </button>
      <button
        type="button"
        onClick={() => window.print()}
        className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
      >
        Imprimir / salvar PDF
      </button>
    </div>
  );
}
