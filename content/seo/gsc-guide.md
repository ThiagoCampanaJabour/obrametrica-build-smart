---
title: "Guia — Submissão ao Google Search Console"
description: "Passo a passo para reenviar o sitemap e validar indexação no GSC."
---

# Google Search Console — Submissão do Sitemap

## 1. Verificar propriedade
1. Acesse [Search Console](https://search.google.com/search-console).
2. Adicione a propriedade `https://obrametrica.com.br` (URL-prefix) ou `obrametrica.com.br` (Domain).
3. Método recomendado: meta-tag no `<head>` (já suportada por `__root.tsx` via prop `scripts`) ou DNS TXT.

## 2. Enviar o sitemap
1. Menu esquerdo → **Sitemaps**.
2. Digite `sitemap.xml` e clique em **Enviar**.
3. Aguarde status **Êxito** (geralmente < 1 hora).

## 3. Verificar cobertura
- Menu **Páginas** → confirmar que todas as URLs desejadas aparecem como *Indexada*.
- URLs bloqueadas: revisar `public/robots.txt` (não deve ter `Disallow: /`).
- URLs com `noindex`: buscar no código por `robots.*noindex` — no projeto atual não existe.

## 4. Inspeção manual (opcional)
Para forçar reindexação de uma página específica:
1. Cole a URL no campo superior do GSC.
2. Clique em **Solicitar indexação**.
3. Aguarde o processamento.

## 5. Monitorar
- **Desempenho** → cliques, impressões, CTR e posição média.
- **Experiência na página** → Core Web Vitals mobile/desktop.
- Alertas por e-mail configurados na conta.
