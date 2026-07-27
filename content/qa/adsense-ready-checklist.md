---
title: "AdSense Readiness Checklist — ObraMétrica"
last_reviewed: 2026-07-27
reviewer: "Lovable QA"
---

# AdSense Readiness Checklist — ObraMétrica

Status legend: ✅ OK · ⚠️ Atenção · ❌ Falha · N/A não aplicável

| # | Item | Status | Evidência |
|---|------|--------|-----------|
| a1 | Página **Sobre** publicada e no footer | ✅ | `screenshots/about-desktop.png` · `src/routes/sobre.tsx` |
| a2 | Página **Contato** publicada e no footer | ✅ | `screenshots/contact-desktop.png` · `src/routes/contato.tsx` |
| a3 | **Política de Privacidade** publicada e no footer | ✅ | `screenshots/privacy-desktop.png` · `src/routes/politica-de-privacidade.tsx` |
| a4 | **Termos de Uso** publicados e no footer | ✅ | `src/routes/termos-de-uso.tsx` · link no `site-footer` |
| a5 | **Metodologia** visível no site | ❌ | Conteúdo pronto em `content/metodologia.md`, porém rota TSX `/metodologia` ainda não existe (404). Ver issue `issues/metodologia-route.md` |
| b1 | Telhas — Intro/HowTo/Methodology/Example/FAQ | ✅ | `content/calculadoras/telhas/*.md` · `screenshots/telhas-desktop.png` |
| b2 | Blocos — Intro/HowTo/Methodology/Example/FAQ | ✅ | `content/calculadoras/blocos/*` |
| b3 | Reboco — Intro/HowTo/Methodology/Example/FAQ | ✅ | `content/calculadoras/reboco/*` |
| b4 | Aço — Intro/HowTo/Methodology/Example/FAQ | ✅ | `content/calculadoras/aco/*` |
| b5 | Fôrmas — Intro/HowTo/Methodology/Example/FAQ | ✅ | `content/calculadoras/formas/*` |
| c | JSON-LD FAQ válidos | ✅ | JSONLint (python `json.load`) — 5/5 PASS (aco, blocos, formas, reboco, telhas) |
| d | Sitemap.xml acessível (HTTP 200) | ✅ | `curl -I http://localhost:8080/sitemap.xml` → `200`. Submissão GSC: **pendente ação humana** (guia em `content/seo/gsc-guide.md`) |
| e | robots.txt permite indexação e aponta para sitemap | ✅ | `curl http://localhost:8080/robots.txt` → `Allow: /` + `Sitemap: https://obrametrica.com.br/sitemap.xml` |
| f | Mobile-Friendly Test | ⚠️ | Executar após deploy: `https://search.google.com/test/mobile-friendly?url=https://obrametrica.com.br` (preview local em `screenshots/homepage-mobile.png` sem overflow) |
| g | Formulário de contato entrega para `obrametricasite@gmail.com` | ⚠️ | Integração Formspree implementada (`src/routes/contato.tsx`). Requer `VITE_FORMSPREE_ID` em produção + teste manual pós-deploy (ver seção **Teste de contato** abaixo) |
| h | Meta title/description únicos | ✅ | `pageHead()` em `src/lib/seo.ts` + templates em `content/seo/meta-templates.md` |
| i | Core Web Vitals (LCP/CLS/INP) | ⚠️ | Executar Lighthouse pós-deploy (`content/qa/lighthouse-summary.md`) |
| j | Popups/interstitials removidos ou não bloqueantes | ✅ | Apenas banner de consentimento de cookies (LGPD) — não-bloqueante, dispensável |
| k | Privacidade visível com e-mail de contato | ✅ | `obrametricasite@gmail.com` presente em `src/routes/politica-de-privacidade.tsx` |
| l | Termos de Uso visíveis | ✅ | Rota `/termos-de-uso` acessível |
| m | Links do footer funcionando | ✅ | `src/components/site-footer.tsx` — todos apontam para rotas existentes (exceto `/metodologia` — ver a5) |
| n | Imagens otimizadas e lazy-load ativo | ✅ | `<img loading="lazy">` no blog e ilustrações; logo servido como JPG otimizado |
| o | Acessibilidade básica (labels, aria) | ✅ | Formulários com `<Label htmlFor>`; botões de ícone com `aria-label` (ver `site-header.tsx`, `calc-ui.tsx`) |

## Teste de contato

Formspree ID configurado via `VITE_FORMSPREE_ID`. Fluxo:

1. Definir secret `VITE_FORMSPREE_ID=<id>` no ambiente de produção.
2. Acessar `/contato`, preencher e submeter.
3. Verificar `obrametricasite@gmail.com` (inbox + spam).
4. Anexar cabeçalho recebido (De, Assunto, Timestamp) neste checklist.

Enquanto o secret não estiver configurado, a submissão falha com feedback amigável (`role="alert"`) e não envia — comportamento intencional.

## Observações gerais

- **Bloqueador para reaplicação:** item **a5** (rota `/metodologia`). Recomenda-se criar `src/routes/metodologia.tsx` antes de reenviar o pedido ao AdSense.
- Sitemap contém 31 URLs (home + 3 hubs + 19 calculadoras/conversores + institucionais + blog).
- Tema, layout e identidade visual permanecem inalterados.
