import type { SizingResult } from "@/lib/inversor-sizing/calc";

function download(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const badge = (s: "OK" | "AVISO" | "ERRO") => {
  const map = {
    OK: "bg-green-100 text-green-800",
    AVISO: "bg-yellow-100 text-yellow-800",
    ERRO: "bg-red-100 text-red-800",
  } as const;
  return `inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${map[s]}`;
};

export function Results({ result }: { result: SizingResult | null }) {
  if (!result) return null;

  const exportJSON = () =>
    download("dimensionamento-inversor.json", JSON.stringify(result, null, 2), "application/json");

  const exportCSV = () => {
    const header = "modulos_por_string,num_strings,vmp_sum_V,voc_sum_V,voc_corr_V,potencia_dc_W,status,warnings";
    const rows = result.configuracoes.map((c) =>
      [
        c.modulosPorString,
        c.numStrings,
        c.vmpSum,
        c.vocSum,
        c.vocCorr,
        c.potenciaDcW,
        c.status,
        `"${c.warnings.join(" | ")}"`,
      ].join(","),
    );
    download("dimensionamento-inversor.csv", [header, ...rows].join("\n"), "text/csv");
  };

  const copyConfig = () => {
    if (!result.melhor) return;
    navigator.clipboard.writeText(JSON.stringify(result.melhor, null, 2));
  };

  return (
    <div aria-live="polite" className="mt-8 space-y-6">
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-foreground">Melhor configuração</h2>
        {result.melhor ? (
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Item label="Módulos por string" value={String(result.melhor.modulosPorString)} highlight />
            <Item label="Nº de strings" value={String(result.melhor.numStrings)} />
            <Item label="Potência DC" value={`${result.melhor.potenciaDcW} W`} />
            <Item label="Vmp da string" value={`${result.melhor.vmpSum} V`} />
            <Item label="Voc @ STC" value={`${result.melhor.vocSum} V`} />
            <Item label="Voc corrigido (frio)" value={`${result.melhor.vocCorr} V`} highlight />
            <Item label="Total de módulos usados" value={String(result.totalModulosUsados)} />
            <Item label="Relação DC/AC" value={String(result.dcAcRatio)} />
            <Item label="Status" value={result.melhor.status} />
          </dl>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            Nenhuma configuração válida encontrada. Ajuste os parâmetros e recalcule.
          </p>
        )}
        {result.warnings.length > 0 && (
          <ul className="mt-4 space-y-1 rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-900">
            {result.warnings.map((w, i) => <li key={i}>⚠ {w}</li>)}
          </ul>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground">Passo a passo</h3>
        <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
          <li>Vmp do módulo: <strong>{result.passos.vmpUnit} V</strong> · Voc do módulo: <strong>{result.passos.vocUnit} V</strong></li>
          <li>Coef. temperatura Voc: <strong>{result.passos.coefDecimalPerC.toFixed(5)} /°C</strong></li>
          <li>ΔT frio (T_min − 25): <strong>{result.passos.deltaTFrio} °C</strong></li>
          <li>Fator de correção Voc: <strong>{result.passos.fatorCorrecao}</strong></li>
        </ul>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground">Todas as configurações candidatas</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="py-2">Mód/string</th>
                <th>Nº strings</th>
                <th>Vmp (V)</th>
                <th>Voc STC (V)</th>
                <th>Voc frio (V)</th>
                <th>P DC (W)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {result.configuracoes.map((c) => (
                <tr key={c.modulosPorString} className="border-b border-border/50">
                  <td className="py-2">{c.modulosPorString}</td>
                  <td>{c.numStrings}</td>
                  <td>{c.vmpSum}</td>
                  <td>{c.vocSum}</td>
                  <td>{c.vocCorr}</td>
                  <td>{c.potenciaDcW}</td>
                  <td><span className={badge(c.status)}>{c.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={exportJSON}
          className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent/20">
          Exportar JSON
        </button>
        <button type="button" onClick={exportCSV}
          className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent/20">
          Exportar CSV
        </button>
        <button type="button" onClick={copyConfig} disabled={!result.melhor}
          className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent/20 disabled:opacity-50">
          Copiar melhor configuração
        </button>
      </div>
    </div>
  );
}

function Item({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className={highlight ? "text-2xl font-bold text-foreground" : "text-base text-foreground"}>{value}</dd>
    </div>
  );
}
