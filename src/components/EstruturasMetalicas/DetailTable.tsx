import type { ElementoResult } from "@/lib/estruturas/calc";

const fmt = (n: number, d = 2) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });

export function DetailTable({ elemento }: { elemento: ElementoResult }) {
  const { alternativas, wReqCm3, sugerido } = elemento;

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <caption className="sr-only">
          Alternativas de perfis para {elemento.input.nome}, ordenadas por massa
        </caption>
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
            <th scope="col" className="py-2 pr-3">Perfil</th>
            <th scope="col" className="py-2 pr-3">W<sub>el</sub> (cm³)</th>
            <th scope="col" className="py-2 pr-3">I<sub>x</sub> (cm⁴)</th>
            <th scope="col" className="py-2 pr-3">Massa (kg/m)</th>
            <th scope="col" className="py-2 pr-3">σ (MPa)</th>
            <th scope="col" className="py-2 pr-3">Utilização</th>
            <th scope="col" className="py-2 pr-3">Flecha (mm)</th>
            <th scope="col" className="py-2">Peso total (kg)</th>
          </tr>
        </thead>
        <tbody>
          {alternativas.map((c) => {
            const atende = c.welCm3 >= wReqCm3;
            const isSugerido = sugerido?.perfil.id === c.perfil.id;
            return (
              <tr
                key={c.perfil.id}
                className={`border-b border-border/60 ${isSugerido ? "bg-accent/10 font-medium" : ""}`}
              >
                <th scope="row" className="py-2 pr-3 font-medium text-foreground">
                  {c.perfil.nome}
                  {isSugerido && (
                    <span className="ml-2 rounded-full bg-accent/30 px-2 py-0.5 text-[10px] uppercase tracking-wide">
                      Sugerido
                    </span>
                  )}
                </th>
                <td className="py-2 pr-3">{fmt(c.perfil.welCm3, 0)}</td>
                <td className="py-2 pr-3">{fmt(c.perfil.ixCm4, 0)}</td>
                <td className="py-2 pr-3">{fmt(c.perfil.massaKgM, 1)}</td>
                <td className="py-2 pr-3">{fmt(c.sigmaMPa, 1)}</td>
                <td className="py-2 pr-3">
                  <span className={atende ? "text-foreground" : "text-destructive"}>
                    {Math.round(c.utilizacao * 100)}%
                  </span>
                </td>
                <td className="py-2 pr-3">
                  {c.flechaMm === null ? (
                    "—"
                  ) : (
                    <span className={c.flechaOk === false ? "text-destructive" : "text-foreground"}>
                      {fmt(c.flechaMm, 1)}
                      {c.flechaLimiteMm !== null && (
                        <span className="text-muted-foreground"> / {fmt(c.flechaLimiteMm, 0)}</span>
                      )}
                    </span>
                  )}
                </td>
                <td className="py-2">{fmt(c.pesoTotalKg, 1)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="mt-2 text-xs text-muted-foreground">
        Módulo resistente mínimo exigido: <strong>{fmt(wReqCm3, 1)} cm³</strong>. Coluna de flecha
        mostra o valor estimado e o limite prático L/250.
      </p>
    </div>
  );
}
