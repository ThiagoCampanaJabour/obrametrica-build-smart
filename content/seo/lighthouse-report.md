---
title: "Relatório Lighthouse — Modelo"
description: "Template para colar resultados do Lighthouse (desktop e mobile) das rotas principais."
---

# Relatório Lighthouse — Obra Métrica

_Última execução: preencher com a data do run._

## Como rodar

```bash
npx lighthouse https://obrametrica.com.br --preset=desktop --output=html --output-path=./lighthouse-desktop.html
npx lighthouse https://obrametrica.com.br --preset=mobile  --output=html --output-path=./lighthouse-mobile.html
```

Repita para: `/calculadora-de-telhas`, `/calculadora-de-blocos`, `/calculadora-de-reboco`, `/calculadora-de-aco`, `/calculadora-de-forma`.

## Resultados (preencher após rodar)

| Rota | Dispositivo | Performance | Acessibilidade | Best Practices | SEO | LCP (s) | CLS | INP (ms) |
|---|---|---|---|---|---|---|---|---|
| `/` | Mobile | – | – | – | – | – | – | – |
| `/` | Desktop | – | – | – | – | – | – | – |
| `/calculadora-de-telhas` | Mobile | – | – | – | – | – | – | – |
| `/calculadora-de-blocos` | Mobile | – | – | – | – | – | – | – |
| `/calculadora-de-reboco` | Mobile | – | – | – | – | – | – | – |
| `/calculadora-de-aco` | Mobile | – | – | – | – | – | – | – |
| `/calculadora-de-forma` | Mobile | – | – | – | – | – | – | – |

## 3 ações prioritárias

1. **Comprimir imagem hero** — converter para WebP/AVIF e servir com `srcset`.
2. **Adiar scripts de terceiros não críticos** — GTM/AdSense com `defer` ou carregamento sob interação.
3. **`font-display: swap`** em todas as `@font-face` (já aplicado nas fontes Google carregadas via `<link>` em `__root.tsx`).

## Referências
- [web.dev — Core Web Vitals](https://web.dev/vitals/)
- [PageSpeed Insights](https://pagespeed.web.dev/)
