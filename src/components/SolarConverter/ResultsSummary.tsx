import { useState } from "react";
import { Copy, Check, Download } from "lucide-react";
import type {
  EnergyFromPowerResult,
  PowerFromEnergyResult,
  SensitivityRow,
} from "@/lib/solar/kwkwh";
import type { ConverterMode } from "./KwKwhForm";

export interface ResultsSummaryProps {
  modo: ConverterMode;
  entrada: number;
  fator: number;
  losses_pct: number;
  direto: EnergyFromPowerResult | null;
  inverso: PowerFromEnergyResult | null;
  sensibilidade: SensitivityRow[];
  /** Payload completo (inputs + outputs + presets) para exportação. */
  exportPayload: Record<string, unknown>;
}

const nf = (n: number, dec = 0) =>
  Number.isFinite(n)
    ? n.toLocaleString("pt-BR", { minimumFractionDigits: dec, maximumFractionDigits: dec })
    : "—";

export function ResultsSummary({
  modo,
  entrada,
  fator,
  losses_pct,
  direto,
  inverso,
  sensibilidade,
  exportPayload,
}: ResultsSummaryProps) {
  const [copied, setCopied] = useState(false);
  const [detalhe, setDetalhe] = useState(false);

  const isDireto = modo === "kwp-to-kwh";
  const pr = 1 - losses_pct / 100;
  const avisos = (isDireto ? direto?.avisos : inverso?.avisos) ?? [];

  const principal = isDireto
    ? `${nf(direto?.energy_kwh ?? 0)} kWh/ano`
    : `${nf(inverso?.kWp_sugerido ?? 0, 1)} kWp`;

  const resumoTexto = isDireto
    ? `${nf(entrada, 2)} kWp × ${nf(fator)} kWh/kWp/ano × ${pr.toFixed(2)} = ${nf(
        direto?.energy_kwh ?? 0,
      )} kWh/ano`
    : `${nf(entrada)} kWh/ano ÷ (${nf(fator)} × ${pr.toFixed(2)}) = ${nf(
        inverso?.kWp_required ?? 0,
        2,
      )} kWp (sugerido ${nf(inverso?.kWp_sugerido ?? 0, 1)} kWp)`;

  async function copiar() {
    try {
      await navigator.clipboard.writeText(resumoTexto);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  function baixarJSON() {
    try {
      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "obrametrica-conversor-kw-kwh.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      /* download indisponível no ambiente — silenciar */
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <span className="text-sm font-medium text-muted-foreground">
        {isDireto ? "Produção anual estimada" : "Potência necessária"}
      </span>
      <output
        aria-live="polite"
        className="mt-1 block text-3xl font-bold tracking-tight text-foreground"
      >
        {principal}
      </output>

      {isDireto ? (
        <p className="mt-1 text-sm text-muted-foreground">
          Média mensal: {nf(direto?.energy_month_kwh ?? 0)} kWh/mês · PR {pr.toFixed(2)}
        </p>
      ) : (
        <p className="mt-1 text-sm text-muted-foreground">
          {nf(inverso?.modules_suggested.qty ?? 0)} módulos de{" "}
          {nf(inverso?.modules_suggested.module_power_W ?? 0)} W (
          {nf(inverso?.modules_suggested.kWp_instalado ?? 0, 2)} kWp instalados, incluindo{" "}
          {nf(inverso?.modules_suggested.spare_qty ?? 0)} de reserva)
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={copiar}
          className="inline-flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-2 text-sm text-foreground transition-colors hover:border-accent"
        >
          {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
          {copied ? "Copiado" : "Copiar resultado"}
        </button>
        <button
          type="button"
          onClick={baixarJSON}
          className="inline-flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-2 text-sm text-foreground transition-colors hover:border-accent"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Exportar JSON
        </button>
        <button
          type="button"
          aria-expanded={detalhe}
          onClick={() => setDetalhe((v) => !v)}
          className="inline-flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-2 text-sm text-foreground transition-colors hover:border-accent"
        >
          {detalhe ? "Ocultar cálculo detalhado" : "Mostrar cálculo detalhado"}
        </button>
      </div>

      {detalhe && (
        <div className="mt-4 rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Passo a passo</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Fator de produção adotado: {nf(fator)} kWh/kWp/ano</li>
            <li>
              Perdas sistêmicas: {nf(losses_pct)}% → PR = 1 − {nf(losses_pct)}/100 ={" "}
              {pr.toFixed(3)}
            </li>
            {isDireto ? (
              <>
                <li>
                  Energia bruta: {nf(entrada, 2)} × {nf(fator)} ={" "}
                  {nf(direto?.breakdown.base_energy_kwh ?? 0)} kWh/ano
                </li>
                <li>Perdas: −{nf(direto?.breakdown.losses_kwh ?? 0)} kWh/ano</li>
                <li>Energia entregue: {nf(direto?.energy_kwh ?? 0)} kWh/ano</li>
              </>
            ) : (
              <>
                <li>
                  Denominador: {nf(fator)} × {pr.toFixed(3)} = {nf(fator * pr)} kWh/kWp/ano
                </li>
                <li>
                  Potência exata: {nf(entrada)} ÷ {nf(fator * pr)} ={" "}
                  {nf(inverso?.kWp_required ?? 0, 2)} kWp
                </li>
                <li>Arredondamento comercial: {nf(inverso?.kWp_sugerido ?? 0, 1)} kWp</li>
              </>
            )}
          </ol>
          <p className="mt-3">{resumoTexto}</p>
        </div>
      )}

      <div className="mt-6">
        <p className="text-sm font-medium text-foreground">
          Sensibilidade (±10% no fator e ±5 p.p. nas perdas)
        </p>
        <div className="mt-2 w-full overflow-x-auto">
          <table className="w-full min-w-[300px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <th scope="col" className="py-2 pr-3">Cenário</th>
                <th scope="col" className="py-2 pr-3">Fator</th>
                <th scope="col" className="py-2 pr-3">Perdas</th>
                <th scope="col" className="py-2">{isDireto ? "kWh/ano" : "kWp"}</th>
              </tr>
            </thead>
            <tbody>
              {sensibilidade.map((row) => (
                <tr key={row.label} className="border-b border-border/60">
                  <td className="py-2 pr-3 text-foreground">{row.label}</td>
                  <td className="py-2 pr-3 text-muted-foreground">
                    {nf(row.factor_kwh_per_kwp)}
                  </td>
                  <td className="py-2 pr-3 text-muted-foreground">{nf(row.losses_pct)}%</td>
                  <td className="py-2 font-medium text-foreground">
                    {nf(row.value, isDireto ? 0 : 2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {avisos.length > 0 && (
        <ul role="alert" className="mt-4 space-y-2">
          {avisos.map((a) => (
            <li
              key={a}
              className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-foreground"
            >
              {a}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        Estimativa preliminar em base anual. Não substitui simulação horária com dados climáticos
        (PVGIS, Meteonorm) nem projeto executivo assinado por profissional habilitado.
      </p>
    </div>
  );
}
