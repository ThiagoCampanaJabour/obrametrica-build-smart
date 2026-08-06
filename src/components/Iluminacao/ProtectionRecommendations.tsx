import type { RecomendacaoProtecao } from "@/lib/iluminacao/calc";

export function ProtectionRecommendations({ itens }: { itens: RecomendacaoProtecao[] }) {
  if (itens.length === 0) return null;
  return (
    <div className="mt-4 rounded-lg border border-border bg-background p-4">
      <h4 className="text-sm font-semibold text-foreground">Recomendações de proteção solar</h4>
      <ol className="mt-3 space-y-3">
        {itens.map((r) => (
          <li key={r.titulo} className="rounded-md border border-border/70 bg-muted/30 p-3">
            <p className="text-sm font-medium text-foreground">{r.titulo}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Redução estimada do ganho direto: <strong>{r.reducaoDiretaPct}%</strong> · Impacto no
              daylight factor: <strong>{r.impactoDFPct}%</strong>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{r.justificativa}</p>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs text-muted-foreground">
        Todo sombreamento envolve um compromisso: menos ofuscamento e menos ganho térmico, porém
        menos luz natural disponível. Compare as opções antes de fechar o projeto.
      </p>
    </div>
  );
}
