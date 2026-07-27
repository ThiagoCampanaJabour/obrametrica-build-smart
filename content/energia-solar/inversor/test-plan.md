# Test Plan — Calculadora de Inversor / String Sizing

## Smoke tests
1. Abrir `/energia-solar/calculadora-inversor` — página carrega com HTTP 200 e H1 correto.
2. Trocar preset de módulo e inversor — Vmp/Voc exibidos atualizam.
3. Clicar em **Calcular dimensionamento** — cards de melhor configuração, passo a passo e tabela aparecem.
4. Exportar CSV e JSON — arquivos baixam.
5. Copiar melhor configuração para a área de transferência.

## Casos técnicos
- **Voc frio limite**: T_min = −10 °C com módulo 550 Wp × 20 módulos + inversor 1000 V → deve exibir ERRO (Voc_corr > 950 V).
- **MPPT baixo**: 3 módulos × Vmp 34 V = 102 V < 150 V (inversor 5 kW) → AVISO.
- **DC/AC alto**: aumentar módulos até DC/AC > 1,4 → warning global.
- **Sem configuração válida**: numModulos = 2 com min = 3 → nenhuma linha na tabela + warning.

## Acessibilidade
- Todos os inputs com `<label>`.
- Painel de resultados com `aria-live="polite"`.
- Tabela navegável por teclado.

## SEO
- `<title>` e `<meta description>` presentes.
- Breadcrumbs + JSON-LD `WebApplication` + `FAQPage`.
- Rota no `sitemap.xml`.
