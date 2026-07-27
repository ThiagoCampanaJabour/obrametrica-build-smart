# Issue: criar rota `/metodologia`

**Prioridade:** Alta (bloqueador para reaplicação AdSense)
**Branch sugerido:** `fix/metodologia-route`

## Problema

O conteúdo institucional de Metodologia foi criado em `content/metodologia.md` (+ tabelas em `content/metodologia/tabelas/`), o sitemap referencia `/metodologia` e o footer aponta para o link, mas **não existe** `src/routes/metodologia.tsx`. Acessar a URL retorna 404 (evidência: `content/qa/screenshots/metodologia-desktop.png`).

## Passos de correção

1. Criar `src/routes/metodologia.tsx` com `createFileRoute("/metodologia")`.
2. Renderizar o markdown de `content/metodologia.md` (usar `react-markdown` ou parse manual — já disponível no projeto para o blog).
3. Incluir seções para cada tabela em `content/metodologia/tabelas/*.md`.
4. Adicionar `head()` com título único, description e canonical (padrão `pageHead()`).
5. Injetar JSON-LD `TechArticle` ou `WebPage`.
6. Recapturar `metodologia-desktop.png` e atualizar checklist item **a5** para ✅.

## Aceite

- HTTP 200 em `/metodologia`.
- Todas as 7 tabelas visíveis e formatadas.
- Link do rodapé leva à página sem 404.
