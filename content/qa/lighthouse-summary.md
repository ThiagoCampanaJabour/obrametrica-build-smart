# Lighthouse Summary — ObraMétrica

> Este resumo deve ser preenchido com um run real após deploy em produção
> (`https://obrametrica.com.br`). Preview local não representa CWV finais.

## Como executar

```bash
npx lighthouse https://obrametrica.com.br \
  --preset=desktop --output=json --output=html \
  --output-path=content/qa/lighthouse-report

npx lighthouse https://obrametrica.com.br \
  --emulated-form-factor=mobile --output=json --output=html \
  --output-path=content/qa/lighthouse-mobile
```

## Resultado (a preencher após deploy)

| Categoria | Mobile | Desktop |
|-----------|--------|---------|
| Performance | — | — |
| Accessibility | — | — |
| Best Practices | — | — |
| SEO | — | — |

### Core Web Vitals

| Métrica | Mobile | Desktop | Alvo |
|---------|--------|---------|------|
| LCP | — | — | < 2.5s (bom) · < 4s (ok) |
| CLS | — | — | < 0.1 |
| INP | — | — | < 200ms |

## Ações recomendadas (top 3, priorizadas)

1. **Preload da logo/hero image** — adicionar `<link rel="preload" as="image">` na rota raiz para reduzir LCP.
2. **Code-split de calculadoras** — cada rota `/calculadora-*` já é lazy via TanStack Router; validar que Recharts/Zod não vazam para bundle inicial.
3. **Inline critical CSS** — Tailwind v4 já gera CSS enxuto; considerar `@vite-plugin-inline-critical` se LCP > 2.5s.

## Notas

- Preview local mede tempos falsos por rodar sem HTTP/2 e sem Cloudflare cache.
- Rodar Lighthouse 3× e usar mediana para reduzir ruído.
