---
title: "Checklist SEO — Reaplicação AdSense"
description: "Passos para validar SEO técnico antes de reenviar o site ao Google AdSense."
---

# Checklist SEO — Antes de reaplicar ao AdSense

## 1. Conteúdo e políticas
- [ ] Página **Sobre** publicada com informação da equipe (`/sobre`).
- [ ] Página **Contato** com formulário funcional (`/contato`).
- [ ] **Política de Privacidade** cobrindo cookies AdSense/GA4 (`/politica-de-privacidade`).
- [ ] **Termos de Uso** com isenção técnica (`/termos-de-uso`).
- [ ] **Metodologia** explicando fórmulas e presets (`/metodologia`).
- [ ] Links das 4 páginas acima presentes no rodapé.

## 2. Meta tags e schema
- [ ] Cada rota tem `title` único (≤ 60 caracteres) e `description` (150–160).
- [ ] `canonical` e `og:url` apontam para a própria página.
- [ ] JSON-LD FAQPage/HowTo/WebApplication validado no [Rich Results Test](https://search.google.com/test/rich-results).
- [ ] Nenhuma página com `<meta name="robots" content="noindex">` acidental.

## 3. Sitemap e robots
- [ ] `https://obrametrica.com.br/sitemap.xml` retorna 200 e lista todas as rotas públicas.
- [ ] `https://obrametrica.com.br/robots.txt` permite `/` e aponta ao sitemap.
- [ ] Sitemap submetido em [Google Search Console](https://search.google.com/search-console) → *Sitemaps* → colar `sitemap.xml`.
- [ ] `Cobertura` do GSC sem erros críticos (páginas relevantes indexadas).

## 4. Performance (Core Web Vitals)
- [ ] Lighthouse mobile ≥ 85 nas rotas principais (ver `lighthouse-report.md`).
- [ ] LCP < 2,5 s — imagem hero comprimida (WebP/AVIF) e com `fetchpriority="high"`.
- [ ] CLS < 0,1 — imagens com `width/height`, anúncios com `min-height`.
- [ ] INP < 200 ms — sem JS bloqueante.

## 5. Acessibilidade e UX
- [ ] Todos os `<button>` de submit têm texto ou `aria-label`.
- [ ] Contraste AA (≥ 4,5:1) nos CTAs.
- [ ] Formulário de contato com `<label>` associado a cada input.
- [ ] `lang="pt-BR"` no `<html>` (já configurado em `__root.tsx`).

## 6. AdSense
- [ ] Script AdSense presente no `<head>` global (verificar `view-source:`).
- [ ] `ads.txt` publicado em `/ads.txt` com o publisher ID correto.
- [ ] Consentimento de cookies exibido para usuários da UE/Brasil.
- [ ] Sem tráfego artificial nos últimos 30 dias.

## 7. Reenvio
1. Acesse [Google AdSense → Sites](https://www.google.com/adsense/new/u/0/pub/sites).
2. Clique em **Solicitar revisão** ao lado de `obrametrica.com.br`.
3. Aguarde 1–14 dias e monitore o e-mail cadastrado.
