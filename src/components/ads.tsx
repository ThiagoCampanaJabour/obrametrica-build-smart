/**
 * AdSense — estratégia Auto Ads.
 *
 * A entrega dos anúncios é feita pelo Google AdSense em modo automático,
 * carregado através do Google Tag Manager (GTM-W24D3W96). Não precisamos
 * inserir <ins class="adsbygoogle"> manualmente: o AdSense escolhe as
 * melhores posições dentro das páginas.
 *
 * Estes componentes existem apenas como pontos-âncora semânticos, caso no
 * futuro decidamos migrar para slots manuais. Enquanto Auto Ads estiver
 * ativo, todos renderizam `null` para não ocupar espaço visual nem gerar
 * Cumulative Layout Shift (CLS).
 *
 * Como habilitar slots manuais no futuro:
 * 1. No painel do AdSense, crie unidades de anúncio (topo, meio, final).
 * 2. Defina `VITE_ADSENSE_CLIENT` (ca-pub-XXXXXXXXXXXXXXXX) e os slot IDs.
 * 3. Substitua o `return null` abaixo pelo bloco `<ins class="adsbygoogle" ... />`.
 * 4. Garanta que o script do AdSense esteja carregado (via GTM ou <head>).
 */

// Auto Ads: os slots ficam a cargo do próprio Google.
// Mantemos as funções para preservar imports existentes sem gerar layout extra.
export function AdTop() {
  return null;
}

export function AdMiddle() {
  return null;
}

export function AdBottom() {
  return null;
}
