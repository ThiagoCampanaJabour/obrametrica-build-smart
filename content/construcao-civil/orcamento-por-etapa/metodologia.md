---
title: "Metodologia — Orçamento por Etapa"
description: "Como o orçamento agrega quantitativos, aplica sobra, descontos e impostos."
---

## Origem dos quantitativos

Os quantitativos são gerados pelas calculadoras individuais da ObraMétrica. Cada uma expõe um contrato JSON simples (por exemplo `{ "sacos": 40 }` para cimento). Um adaptador converte cada saída em itens de orçamento padronizados com `sku`, `unidade`, `quantidade` e `categoria_etapa`. Você também pode carregar um JSON manualmente (upload) caso rode os cálculos em outro dispositivo.

## Preços unitários

Os preços padrão vêm do arquivo `prices-default.json` e representam médias nacionais de mercado. Todos podem ser editados diretamente na tabela. Recomendamos cotar sempre com pelo menos três fornecedores locais.

## Sobra, descontos e impostos

- **Sobra por item (%):** aplicada sobre a quantidade — reflete perdas e cortes. Ex.: `sobra 10%` em telhas transforma 350 un em 385 un.
- **Desconto por item (%):** aplicado sobre o subtotal do item.
- **Desconto global (%):** aplicado sobre a soma de todos os subtotais.
- **Impostos/encargos (%):** aplicados após o desconto global.

A fórmula final por item é:

```
subtotal = quantidade × (1 + sobra) × preço_unitário × (1 - desconto_item)
```

O total geral segue:

```
total = (Σ subtotais) × (1 - desconto_global) × (1 + impostos)
```

## Limitações

O orçamento é uma estimativa; não substitui um levantamento técnico detalhado. Preços variam por região, prazo e forma de pagamento; sobras dependem do executor e da geometria da obra.
