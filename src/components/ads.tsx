/**
 * AdSense placeholders.
 *
 * Estes componentes reservam o espaço (com altura mínima) para os blocos
 * do Google AdSense, evitando Cumulative Layout Shift (CLS) quando o
 * script for ativado no futuro.
 *
 * Como ativar:
 * 1. Adicione o script do AdSense no <head> (src/routes/__root.tsx).
 * 2. Substitua o bloco "INSERIR CÓDIGO ADSENSE AQUI" pelo <ins class="adsbygoogle" .../>
 *    correspondente ao slot configurado no painel do AdSense.
 * 3. Mantenha as classes do contêiner para preservar o espaço reservado.
 */

import type { ReactNode } from "react";

function AdSlot({
  id,
  label,
  minHeight,
  children,
}: {
  id: string;
  label: string;
  minHeight: number;
  children?: ReactNode;
}) {
  return (
    <aside
      aria-label={label}
      data-ad-slot={id}
      className="mx-auto my-8 w-full max-w-3xl"
    >
      <div
        className="flex items-center justify-center rounded-md border border-dashed border-border bg-muted/30 px-4 text-xs uppercase tracking-wider text-muted-foreground"
        style={{ minHeight }}
      >
        {/* INSERIR CÓDIGO ADSENSE AQUI — slot: {id} */}
        {children ?? "Espaço reservado para publicidade"}
      </div>
    </aside>
  );
}

export function AdTop() {
  // INSERIR CÓDIGO ADSENSE AQUI (posição: TOPO)
  return <AdSlot id="ad-top" label="Publicidade — topo" minHeight={90} />;
}

export function AdMiddle() {
  // INSERIR CÓDIGO ADSENSE AQUI (posição: MEIO)
  return <AdSlot id="ad-middle" label="Publicidade — meio" minHeight={250} />;
}

export function AdBottom() {
  // INSERIR CÓDIGO ADSENSE AQUI (posição: FINAL)
  return <AdSlot id="ad-bottom" label="Publicidade — final" minHeight={250} />;
}
