/**
 * Componentes reutilizáveis de Google AdSense — Obra Métrica
 * ============================================================
 *
 * O script oficial do AdSense (`adsbygoogle.js`) já é carregado uma
 * única vez no `<head>` global via `src/routes/__root.tsx`
 * (id="google-adsense"), garantindo uma única instância em toda a SPA.
 *
 * Cliente: ca-pub-6384093786398542
 *
 * ESTES COMPONENTES ESTÃO PREPARADOS MAS DESATIVADOS.
 * ---------------------------------------------------
 * Enquanto a conta AdSense não estiver aprovada e os slot IDs não forem
 * definidos, cada componente renderiza `null` para evitar:
 *   - Cumulative Layout Shift (CLS)
 *   - Requisições inválidas (`No slot size for availableWidth=...`)
 *   - Violação das políticas do AdSense (anúncios em site não aprovado)
 *
 * COMO ATIVAR APÓS APROVAÇÃO
 * --------------------------
 * 1. No painel do AdSense, crie as unidades de anúncio desejadas.
 * 2. Defina as variáveis de ambiente (ex.: `VITE_ADSENSE_SLOT_HORIZONTAL`).
 * 3. Descomente o bloco `<ins class="adsbygoogle" ... />` de cada componente
 *    e substitua o `return null`.
 * 4. Mantenha `data-full-width-responsive="true"` para responsividade e
 *    `data-ad-format` conforme o tipo do slot.
 *
 * Referências oficiais:
 *   - https://support.google.com/adsense/answer/9274025 (Auto ads)
 *   - https://support.google.com/adsense/answer/9183460 (Ad units)
 */

import { useEffect, type CSSProperties } from "react";

export const ADSENSE_CLIENT = "ca-pub-6384093786398542";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdProps {
  /** Slot ID gerado pelo AdSense (opcional enquanto desativado). */
  slot?: string;
  /** Estilo inline aplicado ao `<ins>`. */
  style?: CSSProperties;
  /** Classe adicional aplicada ao container. */
  className?: string;
}

/**
 * Hook interno — empurra o slot para a fila do AdSense apenas quando
 * o componente é montado e há um slot real configurado.
 */
function useAdsbygoogle(enabled: boolean) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense pode falhar silenciosamente em ambientes sem script.
    }
  }, [enabled]);
}

/**
 * Banner Horizontal — indicado para topo/rodapé de conteúdo.
 * Formato recomendado: 728x90 (leaderboard) ou responsivo horizontal.
 */
export function AdBannerHorizontal({ slot, style, className }: AdProps) {
  useAdsbygoogle(Boolean(slot));
  if (!slot) return null;
  return (
    <div className={className} aria-label="Anúncio">
      <ins
        className="adsbygoogle"
        style={{ display: "block", ...style }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="horizontal"
        data-full-width-responsive="true"
      />
    </div>
  );
}

/**
 * Banner Vertical — indicado para sidebar em desktop.
 * Formato recomendado: 160x600 (wide skyscraper) ou 300x600.
 */
export function AdBannerVertical({ slot, style, className }: AdProps) {
  useAdsbygoogle(Boolean(slot));
  if (!slot) return null;
  return (
    <div className={className} aria-label="Anúncio">
      <ins
        className="adsbygoogle"
        style={{ display: "block", ...style }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="vertical"
        data-full-width-responsive="true"
      />
    </div>
  );
}

/**
 * Banner Responsivo — ajusta-se automaticamente ao container.
 * Uso geral quando o formato ideal depende do dispositivo.
 */
export function AdBannerResponsive({ slot, style, className }: AdProps) {
  useAdsbygoogle(Boolean(slot));
  if (!slot) return null;
  return (
    <div className={className} aria-label="Anúncio">
      <ins
        className="adsbygoogle"
        style={{ display: "block", ...style }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

/**
 * In-Article — indicado para dentro do corpo de artigos do blog.
 * Formato oficial do AdSense para conteúdo editorial (fluid layout).
 */
export function AdInArticle({ slot, style, className }: AdProps) {
  useAdsbygoogle(Boolean(slot));
  if (!slot) return null;
  return (
    <div className={className} aria-label="Anúncio">
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center", ...style }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
      />
    </div>
  );
}

/**
 * Multiplex — grid de recomendações, ideal para o fim de artigos
 * ou entre listagens (blog, categorias).
 */
export function AdMultiplex({ slot, style, className }: AdProps) {
  useAdsbygoogle(Boolean(slot));
  if (!slot) return null;
  return (
    <div className={className} aria-label="Anúncios recomendados">
      <ins
        className="adsbygoogle"
        style={{ display: "block", ...style }}
        data-ad-format="autorelaxed"
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
      />
    </div>
  );
}

/**
 * Auto Ads Placeholder — âncora semântica para os locais onde o
 * AdSense (modo Auto Ads) pode inserir anúncios automaticamente.
 * Renderiza um container invisível de altura zero para não afetar layout.
 */
export function AdAutoPlaceholder({ className }: { className?: string }) {
  return <div aria-hidden="true" data-ad-auto-anchor className={className} />;
}
