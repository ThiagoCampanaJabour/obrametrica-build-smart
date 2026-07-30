import { SUPERFICIE_LABEL, tabelaCapacidades, type DrenagemResult, type MaterialConduto } from "@/lib/drenagem/calc";

const fmt = (n: number, d = 2) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });

export function DetailTable({
  result,
  material,
}: {
  result: DrenagemResult;
  material: MaterialConduto;
}) {
  const capacidades = tabelaCapacidades(material, result.resumo.declividadePct);

  return (
    <div className="mt-6 space-y-6">
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="min-w-full divide-y divide-border text-sm">
          <caption className="sr-only">Vazão por bacia de contribuição</caption>
          <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th scope="col" className="px-3 py-2">Bacia</th>
              <th scope="col" className="px-3 py-2">Superfície</th>
              <th scope="col" className="px-3 py-2">Área (m²)</th>
              <th scope="col" className="px-3 py-2">C</th>
              <th scope="col" className="px-3 py-2">Q (L/s)</th>
              <th scope="col" className="px-3 py-2">Despejo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {result.bacias.map((b) => (
              <tr key={b.id}>
                <td className="px-3 py-2 font-medium text-foreground">{b.nome}</td>
                <td className="px-3 py-2">{SUPERFICIE_LABEL[b.superficie].split(" (")[0]}</td>
                <td className="px-3 py-2">{fmt(b.areaM2)}</td>
                <td className="px-3 py-2">{fmt(b.C, 2)}</td>
                <td className="px-3 py-2">{fmt(b.vazaoLs, 3)}</td>
                <td className="px-3 py-2">{b.destino}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="min-w-full divide-y divide-border text-sm">
          <caption className="sr-only">Trechos agrupados por ponto de despejo</caption>
          <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th scope="col" className="px-3 py-2">Trecho</th>
              <th scope="col" className="px-3 py-2">Área (m²)</th>
              <th scope="col" className="px-3 py-2">Q (L/s)</th>
              <th scope="col" className="px-3 py-2">DN sugerido</th>
              <th scope="col" className="px-3 py-2">v (m/s)</th>
              <th scope="col" className="px-3 py-2">Calha (mm)</th>
              <th scope="col" className="px-3 py-2">Ralos</th>
              <th scope="col" className="px-3 py-2">Observações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {result.trechos.map((t) => (
              <tr key={t.destino}>
                <td className="px-3 py-2 font-medium text-foreground">{t.destino}</td>
                <td className="px-3 py-2">{fmt(t.areaM2)}</td>
                <td className="px-3 py-2">{fmt(t.vazaoLs, 3)}</td>
                <td className="px-3 py-2">{t.tubo.diametroMm ? `DN ${t.tubo.diametroMm}` : "n/d"}</td>
                <td className="px-3 py-2">{fmt(t.tubo.velocidadeMs)}</td>
                <td className="px-3 py-2">
                  {t.calha.larguraMm} × {t.calha.alturaMm}
                </td>
                <td className="px-3 py-2">{t.ralos.quantidade}</td>
                <td className="px-3 py-2 text-xs text-muted-foreground">
                  {t.warnings.length ? t.warnings.join(" ") : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="min-w-full divide-y divide-border text-sm">
          <caption className="px-3 py-2 text-left text-xs text-muted-foreground">
            Capacidade dos diâmetros comerciais a {fmt(result.resumo.declividadePct, 2)}% de
            declividade (seção plena, Manning)
          </caption>
          <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th scope="col" className="px-3 py-2">DN (mm)</th>
              <th scope="col" className="px-3 py-2">Capacidade (L/s)</th>
              <th scope="col" className="px-3 py-2">v a seção plena (m/s)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {capacidades.map((c) => (
              <tr key={c.diametroMm}>
                <td className="px-3 py-2 font-medium text-foreground">{c.diametroMm}</td>
                <td className="px-3 py-2">{fmt(c.capacidadeLs)}</td>
                <td className="px-3 py-2">{fmt(c.velocidadeCheiaMs)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
