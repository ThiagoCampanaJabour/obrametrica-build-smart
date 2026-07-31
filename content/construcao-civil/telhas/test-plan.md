---
title: "Plano de QA — Quantificação e Corte de Telhas/Peças"
description: "Passos de teste manual e automatizado para validar a calculadora de quantificação e corte."
---

## Plano de QA

### 1. Casos do exemplo.json

Abra `/construcao-civil/quantificacao-telhas-pecas` e reproduza cada caso de
`content/construcao-civil/telhas/exemplo.json`. Confirme que `pecasBase`, `perdaPctUsada` e
`pecasComprar` batem exatamente com os valores esperados.

### 2. Perda manual

Marque "Editar manualmente" e altere a perda para 0% e depois para 30%. O total deve recalcular
imediatamente após clicar em Calcular e crescer monotonicamente com a perda.

### 3. Layouts

Com a mesma peça e área, alterne entre alinhado, deslocamento 50%, deslocamento 33% e espinha de
peixe. A perda sugerida e o percentual de cortes devem aumentar nessa ordem.

### 4. Dimensões do ambiente

Ative "Informar comprimento e largura". O grid estimado (colunas × fileiras) deve aparecer na tabela
e o percentual de cortes deve ser calculado pelas bordas, não pela heurística fixa.

### 5. Export

Exporte CSV e JSON. Abra o CSV em editor de planilha (separador `;`) e confira as colunas
`peca_id`, `num_pecas_base`, `perda_pct` e `num_final`. O JSON deve conter `inputs` e `outputs`.

### 6. Validação de entradas

Zere a área ou as dimensões da peça e clique em Calcular: deve aparecer a mensagem de erro em
`role="alert"` e nenhum resultado numérico.

### 7. Acessibilidade

- Navegue todo o formulário apenas com Tab; todos os campos têm rótulo associado.
- O bloco de resultados usa `aria-live="polite"` e é anunciado após o cálculo.
- A dica de layout está associada ao select por `aria-describedby`.

### 8. Responsividade

Em 375 px de largura, os campos devem empilhar e a tabela de resultados deve rolar
horizontalmente sem quebrar o layout.

### 9. Testes unitários

```
bunx vitest run src/lib/telhas/calc.test.ts
```

Cobrem `areaPiece_mm`, `piecesBase`, `applyLoss`, `defaultLossPct` e `calcQuantification`.
