import { useMemo, useState } from "react";
import type { CapexItem, CostResult } from "@/lib/solar/cost-estimator";
import { brl } from "./ResultsSummary";

const CATEGORIAS: Array<CapexItem["categoria"] | "Todas"> = [
  "Todas",
  "Equipamento",
  "Estrutura",
  "Elétrica / BOP",
  "Serviços",
  "Armazenamento",
];

const num = (n: number, d = 2) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: d });

export function CostBreakdownTable({ result }: { result: CostResult }) {
  const [filtro, setFiltro] = useState<CapexItem["categoria"] | "Todas">("Todas");

  const itens = useMemo(
    () =>
      filtro === "Todas"
        ? result.capex.itens
        : result.capex.itens.filter((i) => i.categoria === filtro),
    [result, filtro],
  );

  const subtotalFiltro = itens.reduce((s, i) => s + i.subtotal_R, 0);

  return (
    <section className="mt-8 rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-foreground">CAPEX detalhado (BOM)</h2>
        <div className="flex items-center gap-2">
          <label htmlFor="cb-filtro" className="text-xs text-muted-foreground">
            Categoria
          </label>
          <select
            id="cb-filtro"
            value={filtro}
            onChange={(e) => setFiltro(e.currentTarget.value as CapexItem["categoria"] | "Todas")}
            className="rounded-md border border-input bg-background px-2 py-1.5 text-xs text-foreground"
          >
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 min-w-0 overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-sm">
          <caption className="sr-only">
            Lista de materiais e serviços com quantidades, custos unitários e subtotais
          </caption>
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th scope="col" className="py-2 pr-3">Categoria</th>
              <th scope="col" className="py-2 pr-3">Item</th>
              <th scope="col" className="py-2 pr-3 text-right">Qtd.</th>
              <th scope="col" className="py-2 pr-3">Un.</th>
              <th scope="col" className="py-2 pr-3 text-right">Custo unit.</th>
              <th scope="col" className="py-2 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {itens.map((i) => (
              <tr key={`${i.categoria}-${i.item}`} className="border-b border-border/60 align-top">
                <td className="py-2 pr-3 text-muted-foreground">{i.categoria}</td>
                <td className="py-2 pr-3 text-foreground">
                  {i.item}
                  {i.nota && <span className="block text-[11px] text-muted-foreground">{i.nota}</span>}
                </td>
                <td className="py-2 pr-3 text-right tabular-nums text-foreground">{num(i.quantidade)}</td>
                <td className="py-2 pr-3 text-muted-foreground">{i.unidade}</td>
                <td className="py-2 pr-3 text-right tabular-nums text-foreground">{brl(i.custoUnitario_R)}</td>
                <td className="py-2 text-right tabular-nums font-medium text-foreground">{brl(i.subtotal_R)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={5} className="py-2 pr-3 text-right text-xs text-muted-foreground">
                Subtotal exibido
              </td>
              <td className="py-2 text-right tabular-nums font-semibold text-foreground">
                {brl(Math.round(subtotalFiltro * 100) / 100)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Subtotal direto", result.capex.subtotalDireto_R],
          ["Contingência", result.capex.contingencia_R],
          ["CAPEX total", result.capex.capexTotal_R],
          ["Preço de venda", result.capex.precoVenda_R],
        ].map(([label, value]) => (
          <div key={label as string} className="min-w-0 rounded-md border border-border bg-background p-3">
            <dt className="text-xs text-muted-foreground">{label as string}</dt>
            <dd className="mt-1 text-sm font-semibold text-foreground">{brl(value as number)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
