import type { LayoutResult } from "@/lib/solar/layout-calc";

const n = (v: number, d = 2) =>
  v.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });

function Card({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="min-w-0 rounded-md border border-border bg-background p-3">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-lg font-semibold text-foreground">{value}</dd>
      {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function ResultsSummary({ result: r }: { result: LayoutResult }) {
  const bloqueadosSombra = r.excluidos.filter((e) => e.motivo === "sombra").length;
  const bloqueadosObstaculo = r.excluidos.filter((e) => e.motivo === "obstaculo").length;

  return (
    <section aria-live="polite" className="mt-8 rounded-lg border border-accent/40 bg-accent/10 p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
        Resultado do layout
      </h2>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card label="Módulos que cabem" value={`${r.nModulos}`} hint={`Grade: ${r.nColunas} × ${r.nFileiras}`} />
        <Card label="Potência instalada" value={`${n(r.potencia_kWp)} kWp`} />
        <Card
          label="Arranjo elétrico"
          value={`${r.nStrings} string(s)`}
          hint={`${r.input.modulosPorString} módulos em série · última string com ${r.modulosUltimaString}`}
        />
        <Card
          label="Cobertura efetiva"
          value={`${n(r.coberturaEfetiva_pct)} %`}
          hint={`${n(r.areaOcupada_m2)} m² de ${n(r.areaDisponivel_m2)} m²`}
        />
      </dl>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-foreground">Geometria aplicada</h3>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[320px] text-sm">
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-1.5 text-muted-foreground">Footprint do módulo</td>
                  <td className="py-1.5 text-right font-medium text-foreground">
                    {n(r.moduloFisico.largura_m)} × {n(r.moduloFisico.altura_m)} m ({r.input.montagem})
                  </td>
                </tr>
                <tr>
                  <td className="py-1.5 text-muted-foreground">Módulo + gaps</td>
                  <td className="py-1.5 text-right font-medium text-foreground">
                    {n(r.moduloEfetivo.largura_m)} × {n(r.moduloEfetivo.altura_m)} m
                  </td>
                </tr>
                <tr>
                  <td className="py-1.5 text-muted-foreground">Passo entre fileiras</td>
                  <td className="py-1.5 text-right font-medium text-foreground">
                    {n(r.passoFileira_m)} m
                  </td>
                </tr>
                <tr>
                  <td className="py-1.5 text-muted-foreground">Espaçamento anti-sombra calculado</td>
                  <td className="py-1.5 text-right font-medium text-foreground">
                    {n(r.espacamentoFileiras_m)} m
                  </td>
                </tr>
                <tr>
                  <td className="py-1.5 text-muted-foreground">Elevação solar (inverno, meio-dia)</td>
                  <td className="py-1.5 text-right font-medium text-foreground">
                    {n(r.elevacaoSolarInverno_deg, 1)}°
                  </td>
                </tr>
                <tr>
                  <td className="py-1.5 text-muted-foreground">Corredores de manutenção</td>
                  <td className="py-1.5 text-right font-medium text-foreground">
                    {r.corredores.length} × {n(r.input.corredorManutencao_m)} m
                  </td>
                </tr>
                <tr>
                  <td className="py-1.5 text-muted-foreground">Módulos reserva sugeridos</td>
                  <td className="py-1.5 text-right font-medium text-foreground">
                    {r.modulosReserva} un ({r.input.reserva_pct}%)
                  </td>
                </tr>
                <tr>
                  <td className="py-1.5 text-muted-foreground">Posições bloqueadas</td>
                  <td className="py-1.5 text-right font-medium text-foreground">
                    {bloqueadosObstaculo} por obstáculo · {bloqueadosSombra} por sombra
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-foreground">Orientação e inclinação</h3>
          <div className="mt-2 rounded-md border border-border bg-background p-3 text-sm">
            <p className="text-foreground">
              Tilt sugerido: <strong>{n(r.sugestao.tilt_deg, 0)}°</strong> · Azimute sugerido:{" "}
              <strong>{r.sugestao.azimute_deg}°</strong>
            </p>
            <p className="mt-2 text-xs text-muted-foreground">{r.sugestao.justificativa}</p>
          </div>

          {r.avisos.length > 0 && (
            <>
              <h3 className="mt-4 text-sm font-semibold text-foreground">Avisos técnicos</h3>
              <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                {r.avisos.map((a) => (
                  <li key={a} className="rounded-md border border-border bg-background p-2">
                    {a}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      <details className="mt-6">
        <summary className="cursor-pointer text-sm font-semibold text-foreground">
          Lista de módulos e posições (alternativa textual ao desenho)
        </summary>
        <div className="mt-3 max-h-72 overflow-auto rounded-md border border-border">
          <table className="w-full min-w-[520px] text-xs">
            <thead className="sticky top-0 bg-muted">
              <tr>
                <th className="p-2 text-left font-medium text-muted-foreground">ID</th>
                <th className="p-2 text-left font-medium text-muted-foreground">Fileira</th>
                <th className="p-2 text-left font-medium text-muted-foreground">Coluna</th>
                <th className="p-2 text-left font-medium text-muted-foreground">X (m)</th>
                <th className="p-2 text-left font-medium text-muted-foreground">Y (m)</th>
                <th className="p-2 text-left font-medium text-muted-foreground">String</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {r.modulos.map((m) => (
                <tr key={m.id}>
                  <td className="p-2 text-foreground">{m.id}</td>
                  <td className="p-2 text-muted-foreground">{m.row}</td>
                  <td className="p-2 text-muted-foreground">{m.col}</td>
                  <td className="p-2 text-muted-foreground">{n(m.x_m)}</td>
                  <td className="p-2 text-muted-foreground">{n(m.y_m)}</td>
                  <td className="p-2 text-muted-foreground">#{m.stringId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}
