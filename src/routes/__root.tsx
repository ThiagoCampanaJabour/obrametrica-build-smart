import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useRef, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import {
  GTM_EVENTS,
  GTM_HEAD_SNIPPET,
  GTM_ID,
  ensureDataLayer,
  trackEvent,
} from "../lib/gtm";

const GA_MEASUREMENT_ID = "G-4G3TWXJHBC";
const GA_ENABLED = import.meta.env.PROD;

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

/**
 * Registra o Google Analytics 4 (gtag.js). O envio automático de
 * page_view fica desabilitado (send_page_view: false) para não
 * duplicar com o evento SPA disparado via dataLayer/GTM.
 */
function useGoogleAnalytics() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const search = useRouterState({ select: (s) => s.location.searchStr });

  useEffect(() => {
    if (!GA_ENABLED || typeof window === "undefined") return;
    if (document.getElementById("ga4-script")) return;

    const script = document.createElement("script");
    script.id = "ga4-script";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments as unknown as unknown[]);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });
  }, []);

  useEffect(() => {
    if (!GA_ENABLED || typeof window === "undefined" || !window.gtag) return;
    const page_path = `${pathname}${search ? `?${search}` : ""}`;
    window.gtag("event", "page_view", {
      page_path,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, search]);
}

/**
 * Envia page_view ao dataLayer em toda navegação SPA.
 * Uma ref evita disparos duplicados para a mesma URL.
 */
function useGtmPageView() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const search = useRouterState({ select: (s) => s.location.searchStr });
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    ensureDataLayer();
    const fullPath = `${pathname}${search ? `?${search}` : ""}`;
    if (lastPath.current === fullPath) return;
    lastPath.current = fullPath;

    trackEvent(GTM_EVENTS.pageView, {
      page_path: fullPath,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, search]);
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A página que você procura não existe ou foi movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Não foi possível carregar esta página
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ocorreu um erro inesperado. Tente novamente ou volte para a página inicial.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Ir para o início
          </a>
        </div>
      </div>
    </div>
  );
}


const FAVICON = "/obrametrica-logo-sm.webp";
const OG_LOGO = "/obrametrica-logo.jpg";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#16345F" },
      { name: "author", content: "ObraMétrica" },
      { httpEquiv: "Content-Language", content: "pt-BR" },
      { property: "og:site_name", content: "ObraMétrica" },
      { property: "og:locale", content: "pt_BR" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      // Favicon leve em WebP (~3.7KB) em vez do logo JPG (~60KB).
      { rel: "icon", type: "image/webp", href: FAVICON },
      { rel: "apple-touch-icon", href: OG_LOGO },
      // Performance: pré-carrega o logo do cabeçalho (acima da dobra em todas as páginas).
      {
        rel: "preload",
        as: "image",
        href: "/obrametrica-logo-sm.webp",
        type: "image/webp",
        fetchPriority: "high",
      },
      // Performance: pré-conecta com Google Tag Manager, Analytics e AdSense para
      // reduzir latência sem impactar LCP.
      { rel: "preconnect", href: "https://www.googletagmanager.com", crossOrigin: "" },
      { rel: "preconnect", href: "https://www.google-analytics.com", crossOrigin: "" },
      { rel: "preconnect", href: "https://pagead2.googlesyndication.com", crossOrigin: "" },
      { rel: "dns-prefetch", href: "https://www.googletagmanager.com" },
      { rel: "dns-prefetch", href: "https://www.google-analytics.com" },
      { rel: "dns-prefetch", href: "https://pagead2.googlesyndication.com" },
    ],


    scripts: [
      // Google Tag Manager - snippet oficial injetado no <head>.
      // Carregado uma única vez (id evita duplicação em re-renders/SSR).
      {
        id: "gtm-head",
        children: GTM_HEAD_SNIPPET,
      },
      // Nota: o script do Google AdSense é injetado no cliente após a
      // hidratação (ver useAdSense em RootComponent). Injetar via <head>
      // SSR provoca mismatch de hidratação porque o AdSense insere <ins>
      // no <body> antes do React montar a árvore.
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "ObraMétrica",
          url: "https://obrametrica.com.br",
          logo: `https://obrametrica.com.br${OG_LOGO}`,
          slogan: "Cálculos inteligentes para construir melhor.",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        {/* Google Tag Manager (noscript) - fallback para navegadores sem JS. */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useGoogleAnalytics();
  // Registra page_view no dataLayer em toda navegação SPA (sem duplicação).
  useGtmPageView();
  // Injeta o script do AdSense apenas após a hidratação para evitar
  // mismatch (o AdSense insere <ins> no body antes do React montar).
  useAdSense();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}

