# Test Plan — Comparador de Sistemas Solares

## Smoke tests
1. Acessar `/energia-solar/comparador-sistemas` — página carrega com HTTP 200 e H1 correto.
2. Clicar em cada preset (Residencial, Comercial, Rural) — valores dos campos atualizam.
3. Clicar em **Comparar sistemas** com valores padrão — três cartões (On-Grid / Off-Grid / Híbrido), tabela, gráfico e recomendação aparecem.
4. Exportar CSV e JSON — arquivos baixam com dados coerentes.

## Casos de coerência
- Off-grid deve exigir maior banco de baterias que o híbrido para a mesma autonomia.
- On-grid deve apresentar menor investimento inicial e menor payback quando `usoLocalPct = 100`.
- Payback deve ser `null` (—) quando o fluxo total é negativo.
- Aumentar `taxaDesconto` reduz o VPL de todos os sistemas.

## Acessibilidade
- Formulário navegável por teclado.
- `aria-live="polite"` no painel de resultados.
- Tabela comparativa com `summary` e `scope` corretos.

## SEO
- `<title>` e `<meta description>` presentes.
- Breadcrumbs, JSON-LD `WebApplication` e `FAQPage` renderizados no `<head>`.
- Rota incluída no `sitemap.xml`.
