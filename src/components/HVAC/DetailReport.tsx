import { useState } from "react";
import type { HVACResult } from "@/lib/hvac/calc";

const fmt = (n: number, d = 2) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });

export function DetailReport({ result }: { result: HVACResult }) {
  const [aberto, setAberto] = useState<string | null>(null);

  return (
    <div className="mt-6 rounded-xl border border-border bg-card p-5">
      <h2 className="text-lg font-semibold text-foreground">Relatório detalhado por ambiente</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-muted-foreground">
            <tr className="border-b border-border">
              <th className="py-2 pr-3">Ambiente</th>
              <th className="py-2 pr-3">Área</th>
              <th className="py-2 pr-3">Q trans.</th>
              <th className="py-2 pr-3">Q solar</th>
              <th className="py-2 pr-3">Q pessoas</th>
              <th className="py-2 pr-3">Q equip.</th>
              <th className="py-2 pr-3">Q vent.</th>
              <th className="py-2 pr-3">Total (kW)</th>
              <th className="py-2 pr-3">Sugerido</th>
              <th className="py-2 pr-3">kWh/mês</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {result.ambientes.map((a) => (
              <tr key={a.nome} className="border-b border-border/60 align-top">
                <td className="py-2 pr-3 font-medium text-foreground">{a.nome}</td>
                <td className="py-2 pr-3">{fmt(a.areaM2)} m²</td>
                <td className="py-2 pr-3">{fmt(a.qTransKW)}</td>
                <td className="py-2 pr-3">{fmt(a.qSolarKW)}</td>
                <td className="py-2 pr-3">{fmt(a.qPessoasKW)}</td>
                <td className="py-2 pr-3">{fmt(a.qEquipKW)}</td>
                <td className="py-2 pr-3">{fmt(a.qVentKW)}</td>
                <td className="py-2 pr-3 font-semibold text-foreground">{fmt(a.qComMargemKW)}</td>
                <td className="py-2 pr-3">{a.capacidadeSugeridaBTU.toLocaleString("pt-BR")} BTU</td>
                <td className="py-2 pr-3">{fmt(a.consumoKWhMes, 0)}</td>
                <td className="py-2">
                  <button
                    type="button"
                    onClick={() => setAberto(aberto === a.nome ? null : a.nome)}
                    aria-expanded={aberto === a.nome}
                    className="text-xs font-medium text-foreground hover:underline"
                  >
                    {aberto === a.nome ? "Ocultar" : "Detalhar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {result.ambientes
        .filter((a) => a.nome === aberto)
        .map((a) => (
          <div
            key={a.nome}
            className="mt-4 rounded-lg border border-border bg-background p-4 text-sm"
          >
            <h3 className="font-semibold text-foreground">Passo a passo — {a.nome}</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Volume {fmt(a.volumeM3)} m³ · ΔT {fmt(a.deltaT, 1)} °C · ACH {fmt(a.ach, 2)}
            </p>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-muted-foreground">
              {a.passos.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ol>
          </div>
        ))}

      <p className="mt-4 text-xs text-muted-foreground">
        Incerteza típica de ±10% a ±20% conforme o nível de detalhe dos dados informados. Cargas
        latentes são estimadas de forma simplificada a partir de ocupantes e ventilação.
      </p>
    </div>
  );
}
