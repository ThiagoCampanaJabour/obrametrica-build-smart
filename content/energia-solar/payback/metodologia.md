---
title: Metodologia — Calculadora de Payback Solar
description: Fórmulas, suposições e limitações usadas na Calculadora de Payback e Fluxo de Caixa.
---

## Variáveis de entrada

- **Custo do sistema (R$)**: investimento total instalado.
- **Produção anual (kWh/ano)**: energia gerada no primeiro ano; pode ser
  obtida por `kWp × fator_irradiação × 8760` ou informada diretamente.
- **Tarifa (R$/kWh)**: valor cobrado atualmente pela distribuidora.
- **% uso local**: fração da energia gerada consumida no local.
- **O&M anual (R$)**: manutenção, seguros e limpeza.
- **Taxa de desconto (%)**: custo de oportunidade / WACC.
- **Vida útil (anos)**: período de projeção (default 25).
- **Incentivos**: valor inicial (subsídio) e/ou anual.
- **Cenário**: presets `Conservador`, `Padrão` e `Otimista`.

## Fórmulas

Para cada ano `n ∈ [1, N]`:

```
produção_n     = produção_base × (1 − degradação)^(n−1)
tarifa_n       = tarifa_0 × (1 + inflação_tarifa)^(n−1)
receita_n      = produção_n × tarifa_n × uso_local
om_n           = O&M_0 × (1 + inflação_tarifa)^(n−1)
fluxo_líquido_n = receita_n − om_n + incentivo_anual
```

O **VPL** é a soma dos fluxos descontados pela taxa `r`:

```
VPL = −investimento + Σ (fluxo_líquido_n / (1 + r)^n)
```

A **TIR** é a taxa `r*` que zera o VPL. A implementação utiliza método da
bissecção entre −99 % e 1000 % com 100 iterações e tolerância `1e−6`,
retornando `null` quando não há convergência (fluxo total ≤ 0).

O **payback simples** é o menor `n` tal que a soma dos fluxos líquidos
supera o investimento; o **payback descontado** aplica a mesma lógica ao
VPL acumulado. Ambos usam interpolação linear no ano em que o saldo cruza
zero.

## Presets de cenário

| Cenário       | Produção | Inflação tarifa | O&M    | Degradação |
| ------------- | -------- | --------------- | ------ | ---------- |
| Conservador   | ×0.92    | 1 % a.a.        | +10 %  | 1.0 % a.a. |
| Padrão        | ×1.00    | 2 % a.a.        | 100 %  | 0.7 % a.a. |
| Otimista      | ×1.05    | 3 % a.a.        | −10 %  | 0.5 % a.a. |

## Limitações

- Não considera reajustes tarifários regulatórios específicos (bandeiras,
  ICMS, TUSD Fio B) — recomenda-se ajustar a tarifa média para refletir
  esses componentes.
- Ignora custos de troca de inversor no meio da vida útil; adicione como
  incentivo anual negativo se relevante.
- A TIR pode não existir para fluxos não convencionais; nesses casos o
  campo é exibido como `—`.
- Todos os resultados são estimativas educacionais; para decisões de
  investimento, valide com um analista financeiro e engenheiro.
