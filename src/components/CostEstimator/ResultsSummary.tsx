import type { CostResult } from "@/lib/solar/cost-estimator";

export const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 2 });

const num = (n: number, d = 2) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });

function Card({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="min-w-0 rounded-md border border-border bg-background p-3">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-lg font-semibold text-foreground">{value}</dd>
      {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function ResultsSummary({ result }: { result: CostResult }) {
  const { capex, opex, dimensionamento: d, indicadores: k } = result;

  return (
    <section
      aria-live="polite"
      className="mt-8 rounded-xl border border-accent/40 bg-accent/10 p-5"
    >
      <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
        Resumo do custo total (TCO)
      </h2>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card label="CAPEX total" value={brl(capex.capexTotal_R)} hint={`inclui ${num(result.inputs.contingencia_pct, 1)}% de contingência`} />
        <Card label="OPEX anual" value={brl(opex.total_R)} hint="limpeza, manutenção, seguro e monitoramento" />
        <Card label="Custo por kWp" value={brl(k.custoPorkWp_R)} hint={`${num(d.potenciaDC_kWp)} kWp DC instalados`} />
        <Card
          label="Payback simples"
          value={k.paybackSimples_anos !== null ? `${num(k.paybackSimples_anos, 1)} anos` : "—"}
          hint={
            k.paybackDescontado_anos !== null
              ? `descontado: ${num(k.paybackDescontado_anos, 1)} anos`
              : "informe produção e tarifa"
          }
        />
        <Card label="Preço de venda sugerido" value={brl(capex.precoVenda_R)} hint={`markup de ${num(result.inputs.markup_pct, 0)}%`} />
        <Card
          label="Custo no horizonte"
          value={brl(k.custoTotalHorizonte_R)}
          hint={`${result.inputs.vidaUtil_anos} anos · VP ${brl(k.custoTotalDescontado_R)}`}
        />
        <Card
          label="LCOE estimado"
          value={k.lcoe_RporkWh !== null ? `R$ ${num(k.lcoe_RporkWh, 3)}/kWh` : "—"}
          hint="energia e custos descontados"
        />
        <Card label="Economia líquida anual" value={brl(k.economiaLiquidaAnual_R)} hint={`receita ${brl(k.receitaAnual_R)} − OPEX`} />
      </dl>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-foreground">Dimensionamento aplicado</h3>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li>
              Módulos: <strong className="text-foreground">{d.nModulos}</strong> em projeto ·{" "}
              {d.nModulosComprados} comprados ({d.nCaixas} caixa(s))
            </li>
            <li>
              Arranjo: <strong className="text-foreground">{d.nStrings}</strong> string(s) ·{" "}
              {result.inputs.modulosPorString} módulos em série · última com {d.modulosUltimaString}
            </li>
            <li>
              Inversores: <strong className="text-foreground">{d.nInversores}</strong> ×{" "}
              {num(result.inputs.inversor.potenciaAC_kW, 1)} kW = {num(d.potenciaAC_instalada_kW, 1)} kW AC ·
              DC/AC {num(d.dcAcRatioReal)}
            </li>
            <li>
              Estrutura: {num(d.rails_m)} m de perfil · {d.clamps_qty} grampos ·{" "}
              {d.nStringBoxes} string box(es)
            </li>
          </ul>
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-foreground">OPEX anual detalhado</h3>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li>Limpeza: {brl(opex.limpeza_R)}</li>
            <li>Manutenção preventiva: {brl(opex.manutencao_R)}</li>
            <li>Monitoramento: {brl(opex.monitoramento_R)}</li>
            <li>Seguro: {brl(opex.seguro_R)}</li>
            {opex.garantia_R > 0 && <li>Garantia estendida: {brl(opex.garantia_R)}</li>}
          </ul>
          {result.substituicoes.length > 0 && (
            <>
              <h3 className="mt-4 text-sm font-semibold text-foreground">Substituições previstas</h3>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {result.substituicoes.map((s) => (
                  <li key={`${s.ano}-${s.item}`}>
                    Ano {s.ano}: {s.item} — {brl(s.custo_R)}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {result.avisos.length > 0 && (
        <ul className="mt-5 space-y-2">
          {result.avisos.map((a) => (
            <li
              key={a}
              className="rounded-md border border-border bg-background p-3 text-xs text-muted-foreground"
            >
              {a}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
