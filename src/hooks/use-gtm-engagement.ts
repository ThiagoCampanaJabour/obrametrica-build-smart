import { useEffect, useRef } from "react";
import { GTM_EVENTS, trackEvent } from "@/lib/gtm";

// ============================================================
// Hook de engajamento para GTM
// ------------------------------------------------------------
// Registra automaticamente eventos de:
//   - Scroll a 50% e 90% da página
//   - Tempo de permanência (ao sair da página)
//   - Clique em links externos
//   - Uso da Web Share API (compartilhamento de página)
// Todos os eventos são enviados via dataLayer.
// ============================================================

export function useGtmEngagement(pageKey: string) {
  const scrollFlags = useRef({ p50: false, p90: false });
  const startTime = useRef<number>(Date.now());

  // Reinicia os flags e o cronômetro a cada navegação SPA.
  useEffect(() => {
    scrollFlags.current = { p50: false, p90: false };
    startTime.current = Date.now();
  }, [pageKey]);

  // Scroll tracking (50% e 90%).
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const viewport = window.innerHeight;
      const total = doc.scrollHeight - viewport;
      if (total <= 0) return;
      const percent = (scrollTop / total) * 100;

      if (!scrollFlags.current.p50 && percent >= 50) {
        scrollFlags.current.p50 = true;
        trackEvent(GTM_EVENTS.scroll50, { page: pageKey });
      }
      if (!scrollFlags.current.p90 && percent >= 90) {
        scrollFlags.current.p90 = true;
        trackEvent(GTM_EVENTS.scroll90, { page: pageKey });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pageKey]);

  // Cliques em links externos.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href) return;
      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) {
          trackEvent(GTM_EVENTS.cliqueLinkExterno, {
            url: url.href,
            page: pageKey,
          });
        }
      } catch {
        /* href relativo/inválido - ignora */
      }
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [pageKey]);

  // Tempo de permanência: registrado ao sair da página ou desmontar o hook.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const flush = () => {
      const seconds = Math.round((Date.now() - startTime.current) / 1000);
      if (seconds <= 0) return;
      trackEvent(GTM_EVENTS.tempoPermanencia, {
        page: pageKey,
        seconds,
      });
    };

    window.addEventListener("beforeunload", flush);
    return () => {
      window.removeEventListener("beforeunload", flush);
      flush();
    };
  }, [pageKey]);
}

/**
 * Utilitário para disparar o evento de compartilhamento a partir
 * de componentes que usam a Web Share API ou botões de share.
 */
export function trackShare(page: string, method = "web_share") {
  trackEvent(GTM_EVENTS.compartilhamentoPagina, { page, method });
}
