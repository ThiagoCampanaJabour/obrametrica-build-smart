---
title: "Snippets de JSON-LD FAQ"
description: "Como incluir o FAQPage JSON-LD nas páginas de calculadora."
---

# Snippets — JSON-LD FAQ

Os arquivos `content/calculadoras/<slug>/faq.jsonld` do Sprint 2 já estão
válidos (JSONLint OK). Este documento mostra como injetá-los no `<head>`
da rota correspondente.

## TanStack Start (padrão do projeto)

Cada rota `src/routes/calculadora-de-<slug>.tsx` chama `pageHead()`, que
aceita `extraSchemas`. A função `allSchemasFor(PATH)` em
`src/data/calculators.ts` já agrega automaticamente o FAQPage, HowTo e
WebApplication — não é necessário injetar manualmente.

Se quiser adicionar um schema fora do preset:

```ts
head: () =>
  pageHead({
    title: "...",
    description: "...",
    path: PATH,
    extraSchemas: [
      // ...allSchemasFor(PATH),
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Como calcular telhas?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Meça a área e aplique o fator de inclinação.",
            },
          },
        ],
      },
    ],
  }),
```

O TanStack renderiza como `<script type="application/ld+json">` no SSR.

## HTML estático (fallback)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Como calcular telhas?",
      "acceptedAnswer": { "@type": "Answer", "text": "..." }
    }
  ]
}
</script>
```

## Validação

1. [JSONLint](https://jsonlint.com/) — sintaxe.
2. [Rich Results Test](https://search.google.com/test/rich-results) — visibilidade no Google.
3. [Schema Markup Validator](https://validator.schema.org/) — conformidade com schema.org.
