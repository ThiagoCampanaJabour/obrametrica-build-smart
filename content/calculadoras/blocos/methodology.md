---
title: "Metodologia — Calculadora de Blocos"
description: "Fórmulas, suposições e exemplo do cálculo de blocos por m² considerando junta e desperdício."
---

## Metodologia

### Fórmulas principais

- **Área útil do bloco (com junta):**
  `A_util = (L_bloco + junta) × (H_bloco + junta)`
- **Blocos por m²:**
  `blocos/m² = 1 / A_util`
- **Total de blocos:**
  `total = área_parede × blocos/m² × (1 + desperdício)`

Onde `L_bloco` e `H_bloco` são as dimensões nominais do bloco em metros e `junta` é a espessura da junta de assentamento (geralmente 0,010 m ou 0,015 m).

### Suposições e presets

- **Bloco cerâmico 9×19×19 cm** com junta de 10 mm → ~28 blocos/m².
- **Bloco de concreto 14×19×39 cm** com junta de 10 mm → ~12,5 blocos/m².
- **Tijolo baiano 9×14×24 cm** com junta de 15 mm → ~24 blocos/m².
- Desperdício padrão de 5% para paredes simples e até 10% para paredes com muitos recortes.
- Vãos menores que 1 m² não são descontados (compensam os cortes).

### Exemplo rápido

Parede de 20 m² com bloco cerâmico 9×19×19 (28 blocos/m²), desperdício de 5%:

- `20 × 28 = 560 blocos`
- `560 × 1,05 = 588 blocos`

### Limitações

O cálculo é linear e não considera amarrações estruturais, vergas, contravergas ou dimensionamento de alvenaria estrutural. Para essas situações, siga o projeto executivo e consulte o engenheiro. Consulte também a página de [Metodologia](/metodologia) para detalhes gerais.
