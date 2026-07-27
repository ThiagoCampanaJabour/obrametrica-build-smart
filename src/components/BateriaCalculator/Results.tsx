import type { BateriaResult } from "@/lib/bateria/calc";
import { ExportButtons } from "./ExportButtons";

function brl(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export function Results({ result }: { result: BateriaResult | null }) {
  if (!result) return null;

  return (
    <div aria-live="polite" className="mt-8 space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card label="Capacidade nominal" value={`${result.capacidadeNominalKWh} kWh`} />
        <Card label="Nº de unidades" value={String(result.numUnidades)} />
        <Card label="Capacidade instalada" value={`${result.capacidadeInstaladaKWh} kWh`} />
        <Card label="Custo inicial" value={brl(result.custoInicialBRL)} />
        <Card label="Autonomia prática" value={`${result.autonomiaPraticaDias} dias`} />
        <Card label="Vida útil por ciclos" value={`${result.vidaAnosPorCiclos} anos`} />
        <Card label="Custo total (VPL)" value={brl(result.custoTotalVPL)} />
        <Card label="Energia útil / dia" value={`${result.energiaUtilKWh} kWh`} />
      </div>

      {result.alerts.length > 0 && (
        <div className="rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100">
          <strong className="font-semibold">Avisos:</strong>
          <ul className="mt-2 list-disc pl-5">
            {result.alerts.map((a) => <li key={a}>{a}</li>)}
          </ul>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <caption className="sr-only">Fluxo anual da bateria: capacidade, substituições e custos.</caption>
          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th scope="col" className="px-3 py-2 text-left">Ano</th>
              <th scope="col" className="px-3 py-2 text-right">Capacidade (kWh)</th>
              <th scope="col" className="px-3 py-2 text-center">Substituição</th>
              <th scope="col" className="px-3 py-2 text-right">Custo do ano</th>
              <th scope="col" className="px-3 py-2 text-right">Custo acumulado</th>
              <th scope="col" className="px-3 py-2 text-right">VPL acumulado</th>
            </tr>
          </thead>
          <tbody>
            {result.fluxo.map((f) => (
              <tr key={f.ano} className="border-t border-border">
                <td className="px-3 py-2">{f.ano}</td>
                <td className="px-3 py-2 text-right">{f.capacidadeRemanescenteKWh}</td>
                <td className="px-3 py-2 text-center">{f.substituicao ? "Sim" : "—"}</td>
                <td className="px-3 py-2 text-right">{f.custoAno ? brl(f.custoAno) : "—"}</td>
                <td className="px-3 py-2 text-right">{brl(f.custoAcumulado)}</td>
                <td className="px-3 py-2 text-right">{brl(f.custoAcumuladoVPL)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ExportButtons result={result} />
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg font-semibold text-foreground">{value}</div>
    </div>
  );
}
