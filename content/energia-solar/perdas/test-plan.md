# Test Plan — Calculadora de Perdas / Eficiência (PV)

## Casos de validação do motor (`src/lib/solar/calc.ts`)

1. **Caso 1 — Input rápido**: `energiaTeoricaDc_kWh = 10.000` com defaults.
   - A soma de `breakdown[].kWh` deve ser igual a `perdaTotal_kWh` (tolerância 1e-6).
   - `energiaFinalAc_kWh + perdaTotal_kWh === 10.000`.
   - Eficiência global entre 70% e 95%.
2. **Caso 2 — Alta temperatura**: `tempAmbiente_C = 35` deve produzir energia final menor que
   `tempAmbiente_C = 15`; a perda por temperatura cresce linearmente com ΔT.
3. **Caso 3 — DC/AC alto**: 15 kWp / 10 kW → ratio 1,5 → clipping 5% e aviso emitido.
4. **Clipping manual**: `clippingModo = "manual"` respeita o valor informado.
5. **Cabos resistivos**: I = 20 A, R = 0,2 Ω, 1.400 h → 112 kWh de perda.
6. **Degradação**: série com `horizonteAnos` itens; ano 1 = energia final; ano n = E × (1−d)^(n−1).

## Edge cases

- `energiaTeoricaDc_kWh = 0` → energia final 0, eficiência 0, aviso de validação (sem NaN).
- Entradas negativas (energia, percentuais) → saneadas para 0; nenhum item com kWh negativo.
- ΔT ≤ 0 °C → perda térmica nula + aviso (sem bônus de baixa temperatura).
- Sistemas muito grandes (1 GWh/ano) → sem overflow, formatação em pt-BR correta.

## Precisão e arredondamento

- Percentuais exibidos com 2 casas; kWh sem casas decimais.
- Export JSON: `pct` com 4 casas, `kWh` com 2 casas.

## Export

O JSON deve conter: `inputs`, `loss_items[{id,name,pct,kWh,formula}]`, `final_energy_kWh`,
`efficiency_pct`, `serie_degradacao`, `presets_used`, `avisos`.
O CSV deve conter as mesmas linhas de perda mais o rodapé de totais.

## UI / Acessibilidade

- Todos os inputs com `<label>` associado por `id`.
- Painel de resultados com `aria-live="polite"`.
- Gráfico SVG com `role="img"` e `aria-label`; cada segmento com `<title>`.
- Sem overflow horizontal em 390 px; tabelas com rolagem interna.

## SEO

- `<title>` e `<meta description>` únicos.
- Breadcrumbs + JSON-LD `WebApplication` + `FAQPage`.
- Rota presente no `sitemap.xml`.
