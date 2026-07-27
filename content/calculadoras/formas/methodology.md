---
title: "Metodologia — Calculadora de Fôrmas"
description: "Fórmulas, suposições e exemplo do cálculo de fôrmas para elementos de concreto armado."
---

## Metodologia

### Fórmulas principais

- **Área de fôrma (laje):**
  `A_forma = área_laje` (apenas face inferior; laterais dependem da geometria).
- **Área de fôrma (viga):**
  `A_forma = perímetro_molhado × comprimento`
  onde `perímetro_molhado = 2 × altura + largura` (fundo + duas laterais).
- **Área de fôrma (pilar):**
  `A_forma = perímetro × altura`
- **Chapas necessárias:**
  `chapas = ceil( A_forma × (1 + perda) / (área_chapa × reaproveitamentos) )`

### Suposições e presets

- **Chapa comercial:** 2,20 × 1,10 m → **2,42 m²** por chapa.
- **Perda padrão:** 15% para lajes e vigas; 20% para pilares (cortes complexos).
- **Reaproveitamentos:**
  - Compensado plastificado (18 mm): 8–12 usos
  - Compensado resinado (17 mm): 3–5 usos
- **Escoramento e travamento:** estima-se **0,5 m³ de madeira serrada** por 10 m² de laje (sarrafos, pontaletes, gravatas).

### Exemplo rápido

Laje de 20 m² com compensado plastificado (10 usos), perda 15%:

- Área efetiva: `20 × 1,15 = 23 m²`
- Chapas por uso: `23 / 2,42 ≈ 9,5 → 10 chapas`
- Chapas amortizadas: `10 / 10 = 1 chapa/uso`

### Limitações

O cálculo não substitui o projeto de fôrmas, que deve considerar carregamentos, contra-flechas, cimbramento e a NBR 15696. Consulte a [Metodologia](/metodologia) para as premissas gerais.
