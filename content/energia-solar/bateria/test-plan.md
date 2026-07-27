# Test Plan — Calculadora de Bateria / Armazenamento

## Smoke tests
1. Acessar `/energia-solar/calculadora-bateria` — página carrega com HTTP 200 e H1 correto.
2. Trocar preset de bateria — capacidade, DoD e custo exibidos atualizam.
3. Clicar em **Calcular banco de baterias** com valores padrão — cards de resultado, tabela anual e comparativo aparecem.
4. Exportar CSV e JSON — arquivos baixam com dados coerentes.

## Casos de coerência
- Reduzir DoD para 40% deve aumentar `numUnidades`.
- Aumentar `autonomiaDias` deve aumentar `capacidadeNominalKWh` proporcionalmente.
- Preset chumbo-ácido deve exigir mais unidades que LFP para o mesmo consumo.
- Substituição aparece na tabela quando `vidaAnosPorCiclos < horizonteAnos`.
- Aumentar `taxaDescontoPctAno` reduz o `custoTotalVPL` das substituições futuras.

## Acessibilidade
- Formulário navegável por teclado, todos os inputs com `<label>`.
- Painel de resultados com `aria-live="polite"`.
- Tabelas com `<caption>` (sr-only) e `scope` nos cabeçalhos.

## SEO
- `<title>` e `<meta description>` específicos.
- Breadcrumbs + JSON-LD `WebApplication` + `FAQPage`.
- Rota incluída no `sitemap.xml`.
