// ============================================================
// Google Tag Manager - utilidades
// ------------------------------------------------------------
// Centraliza o ID do container e helpers para enviar eventos
// personalizados através do dataLayer. Segue as recomendações
// oficiais do Google Tag Manager para SPAs (React + Vite).
// ============================================================

export const GTM_ID = "GTM-W24D3W96";

// Snippet oficial do GTM (versão inline). Injetado uma única vez
// no <head> através do head().scripts do TanStack Router.
export const GTM_HEAD_SNIPPET = `
(function(w,d,s,l,i){
  w[l]=w[l]||[];
  w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
  var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),
      dl=l!='dataLayer'?'&l='+l:'';
  j.async=true;
  j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
  f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');
`;

// Tipagem global do dataLayer para uso em toda a aplicação.
declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

/**
 * Garante que o array global `dataLayer` esteja pronto para receber pushes.
 * Chamado antes de qualquer evento para evitar erros em ambientes SSR.
 */
export function ensureDataLayer(): unknown[] | null {
  if (typeof window === "undefined") return null;
  window.dataLayer = window.dataLayer || [];
  return window.dataLayer;
}

/**
 * Envia um evento personalizado ao GTM.
 *
 * @example
 *   trackEvent("calculadora_tijolos", { area: 32 });
 */
export function trackEvent(
  eventName: string,
  parameters: Record<string, unknown> = {},
): void {
  const dl = ensureDataLayer();
  if (!dl) return;
  dl.push({ event: eventName, ...parameters });
}

// Catálogo de eventos preparados para o site Obra Métrica.
// Usar essas constantes evita erros de digitação nos nomes.
export const GTM_EVENTS = {
  // Calculadoras
  calculadoraTijolos: "calculadora_tijolos",
  calculadoraConcreto: "calculadora_concreto",
  calculadoraPiso: "calculadora_piso",
  calculadoraTinta: "calculadora_tinta",
  calculadoraArgamassa: "calculadora_argamassa",
  energiaSolar: "energia_solar",
  economiaSolar: "economia_solar",
  conversorM2Hectare: "conversor_m2_hectare",
  conversorCmPolegada: "conversor_cm_polegada",
  conversorLitrosM3: "conversor_litros_m3",

  // Interações do usuário
  formularioContato: "formulario_contato",
  cliqueEmail: "clique_email",
  cliqueWhatsapp: "clique_whatsapp",

  // Engajamento
  scroll50: "scroll_50",
  scroll90: "scroll_90",
  tempoPermanencia: "tempo_permanencia",
  cliqueLinkExterno: "clique_link_externo",
  compartilhamentoPagina: "compartilhamento_pagina",

  // Navegação SPA
  pageView: "page_view_spa",
} as const;

export type GtmEventName = (typeof GTM_EVENTS)[keyof typeof GTM_EVENTS];
