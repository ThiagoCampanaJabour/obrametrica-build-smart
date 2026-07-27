import { BATERIAS_PRESET, calcBateria, type BateriaInput } from "@/lib/bateria/calc";

function brl(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

interface Props {
  base: BateriaInput;
}

/** Compara todos os presets de bateria mantendo o mesmo perfil de consumo/horizonte. */
export function CompareTable({ base }: Props) {
  const rows = BATERIAS_PRESET.map((b) => calcBateria({ ...base, bateria: b }));

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold text-foreground">Comparativo de presets</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Mesmo perfil de consumo e horizonte, aplicados a cada tecnologia de bateria.
      </p>
      <div className="mt-4 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <caption className="sr-only">Comparativo entre bancos de baterias.</caption>
          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th scope="col" className="px-3 py-2 text-left">Bateria</th>
              <th scope="col" className="px-3 py-2 text-right">Nº unidades</th>
              <th scope="col" className="px-3 py-2 text-right">Instalado (kWh)</th>
              <th scope="col" className="px-3 py-2 text-right">Custo inicial</th>
              <th scope="col" className="px-3 py-2 text-right">Custo VPL</th>
              <th scope="col" className="px-3 py-2 text-right">Autonomia (dias)</th>
              <th scope="col" className="px-3 py-2 text-right">Vida (anos)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.input.bateria.nome} className="border-t border-border">
                <td className="px-3 py-2">{r.input.bateria.nome}</td>
                <td className="px-3 py-2 text-right">{r.numUnidades}</td>
                <td className="px-3 py-2 text-right">{r.capacidadeInstaladaKWh}</td>
                <td className="px-3 py-2 text-right">{brl(r.custoInicialBRL)}</td>
                <td className="px-3 py-2 text-right">{brl(r.custoTotalVPL)}</td>
                <td className="px-3 py-2 text-right">{r.autonomiaPraticaDias}</td>
                <td className="px-3 py-2 text-right">{r.vidaAnosPorCiclos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
