# Guia de escalabilidade — Obra Métrica

Este documento explica como adicionar rapidamente novas calculadoras,
conversores e artigos de blog sem introduzir dívida técnica. Toda a
arquitetura foi pensada para que expandir o site seja uma tarefa de
**editar dados**, não de escrever novas telas.

---

## 1. Nova calculadora de construção civil

Fluxo padrão (≈ 15 min por calculadora):

1. **Crie a rota** em `src/routes/calculadora-de-<slug>.tsx` seguindo o
   padrão de `calculadora-de-argamassa.tsx`:
   - `createFileRoute("/calculadora-de-<slug>")`
   - `head()` com `title`, `description`, `og:*`, `canonical` e JSON-LD
     (`WebApplication` + `BreadcrumbList`). Use `buildBreadcrumbLd` de
     `@/lib/seo`.
   - Componente que renderiza `<CalcShell>` (de `@/components/calc-ui`)
     com o formulário específico.
2. **Registre o conteúdo enriquecido** em `src/data/calculators.ts`:
   adicione um objeto `CalculatorContent` com `intro`, `howItWorks`,
   `formula`, `example`, `tips`, `commonMistakes`, `table?`, `faq`,
   `related`. O `<CalcExtras>` renderiza tudo automaticamente e alimenta
   o `FAQPage` schema.
3. **Adicione ao SILO** em `src/data/silo.ts`, dentro da categoria
   `Construção Civil` (`calculators: [...]` e `related`).
4. **Adicione ao sitemap** em `src/routes/sitemap[.]xml.ts`.
5. **Liste na categoria** `src/routes/construcao-civil.tsx`.

Nenhuma alteração é necessária em `routeTree.gen.ts` — o plugin do
TanStack Router regenera o arquivo automaticamente.

## 2. Novo conversor de unidades

1. Crie `src/routes/conversor-<origem>-para-<destino>.tsx` seguindo
   `conversor-cm-para-polegada.tsx`. Use `<UnitConverter>` de
   `@/components/unit-converter` passando `factor`, `unitFrom`,
   `unitTo` e `precision`.
2. Registre no `src/data/calculators.ts` (a interface aceita
   conversores também — categoria `Conversores`).
3. Adicione ao `src/data/silo.ts` (categoria `Conversores`).
4. Adicione ao `sitemap[.]xml.ts` e à página `conversores.tsx`.

## 3. Novo conteúdo de energia solar

Mesmo fluxo da seção 1, mas:
- Rota vai em `src/routes/<slug>.tsx` (ex.: `economia-energia-solar.tsx`).
- Categoria no SILO: `Energia Solar`.
- Listagem: `src/routes/energia-solar.tsx`.

## 4. Novo artigo de blog

1. **Adicione o post** em `src/data/blog-posts.ts`:
   ```ts
   {
     slug: "meu-artigo",
     title: "...",
     description: "...",
     date: "2026-07-02",
     author: "Equipe ObraMétrica",
     readingTime: 8, // minutos
     category: "Construção Civil", // deve existir em BLOG_CATEGORIES
     tags: ["argamassa", "reboco"],
     related: ["outro-slug"],
     content: [
       { type: "h2", text: "Introdução" },
       { type: "p", text: "..." },
       // h2 | h3 | p | ul | ol | quote | code
     ],
   }
   ```
2. O componente `blog.$slug.tsx` gera automaticamente:
   - `<title>`, `description`, `og:*`, `canonical`
   - JSON-LD `Article` + `BreadcrumbList`
   - Sumário (TOC) a partir dos `h2/h3`
   - Bloco do autor
   - CTA para a categoria e posts relacionados
3. Nada precisa ser feito manualmente em `blog.tsx` (index) nem em
   `blog.categoria.$categoria.tsx` — ambos leem de `blog-posts.ts`.
4. O sitemap detecta posts automaticamente via `BLOG_POSTS.map(...)`.

## 5. Nova categoria de blog

Editar `BLOG_CATEGORIES` em `src/data/blog-posts.ts`:
```ts
{ name: "Nova Categoria", slug: "nova-categoria", icon: SomeLucideIcon }
```
A rota `blog.categoria.$categoria.tsx` e o sitemap absorvem
automaticamente.

## 6. Nova página institucional

Rotas simples (Contato, Sobre, FAQ, políticas) seguem o padrão de
`sobre.tsx`. Sempre incluir:
- `head()` com metadados próprios (nunca reutilizar do root)
- `canonical` autorreferente
- Link no `site-footer.tsx` se for relevante para navegação

## 7. Checklist antes de publicar uma nova página

- [ ] `head()` tem `title` único (<60 caracteres) e `description` (<160)
- [ ] `canonical` aponta para a própria URL
- [ ] `og:title`, `og:description`, `og:url` presentes
- [ ] Foi adicionada ao `sitemap[.]xml.ts`
- [ ] Foi adicionada ao SILO (`silo.ts`) se for calculadora/conversor
- [ ] Tem pelo menos um H1 e headings hierárquicos
- [ ] Passa `bun run build` e `tsgo --noEmit`
- [ ] Não introduz `useEffect + fetch` (use loaders TanStack)
- [ ] Não usa cores hardcoded (`text-white`, `bg-[#...]`) — só tokens

## 8. Performance por padrão

- Imagens: sempre WebP + `loading="lazy"` (exceto hero/logo com
  `fetchPriority="high"`).
- Ícones: importar individualmente de `lucide-react`.
- Nunca importar `@/integrations/supabase/client.server` em rotas ou
  `*.functions.ts` no topo — sempre dinâmico dentro do handler.

## 9. Publicidade (AdSense)

Estratégia atual: **Auto Ads** via GTM (`GTM-W24D3W96`). Os
componentes `AdTop/AdMiddle/AdBottom` em `@/components/ads` renderizam
`null` — o próprio Google escolhe posições. Para migrar para slots
manuais no futuro, ver comentário no topo de `src/components/ads.tsx`.

## 10. Convenções de nomeação

- Slugs em kebab-case, sempre em português.
- URLs sem barra final: `/calculadora-de-tinta`, não
  `/calculadora-de-tinta/`.
- Nomes de arquivos em `src/routes` seguem a rota literal
  (`calculadora-de-tinta.tsx`, `blog.categoria.$categoria.tsx`).
