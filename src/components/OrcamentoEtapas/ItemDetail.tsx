import { Link } from "@tanstack/react-router";
import type { ComputedItem } from "@/lib/orcamento-etapas/calc";
import { fmtBRL } from "@/lib/orcamento-etapas/calc";

export function ItemDetail({
  item,
  onClose,
}: {
  item: ComputedItem;
  onClose: () => void;
}) {
  return (
    <aside
      role="dialog"
      aria-label={`Detalhes de ${item.name}`}
      className="fixed inset-y-0 right-0 z-50 w-full max-w-sm overflow-y-auto border-l border-border bg-card p-6 shadow-xl"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {item.categoria_etapa}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-foreground">{item.name}</h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-border px-2 py-1 text-xs"
        >
          Fechar
        </button>
      </div>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">SKU</dt>
          <dd className="font-mono text-foreground">{item.sku}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Unidade</dt>
          <dd>{item.unidade}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Quantidade base</dt>
          <dd>{item.quantidade.toFixed(2)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Sobra</dt>
          <dd>{(item.sobraPct ?? 0).toFixed(1)}%</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Quantidade ajustada</dt>
          <dd>{item.quantidadeAjustada.toFixed(2)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Preço unitário</dt>
          <dd>{fmtBRL(item.custo_unitario ?? 0)}</dd>
        </div>
        <div className="flex justify-between border-t border-border pt-2 font-semibold">
          <dt>Subtotal</dt>
          <dd>{fmtBRL(item.subtotal)}</dd>
        </div>
      </dl>

      {item.origemPath && (
        <div className="mt-6">
          <p className="text-xs text-muted-foreground">Origem: {item.origem}</p>
          <Link
            to={item.origemPath}
            className="mt-2 inline-block rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-accent-foreground"
          >
            Abrir calculadora
          </Link>
        </div>
      )}
    </aside>
  );
}
