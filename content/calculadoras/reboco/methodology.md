---
title: "Metodologia — Calculadora de Reboco"
description: "Fórmulas, suposições e exemplo do cálculo de argamassa de reboco por área e espessura."
---

## Metodologia

### Fórmulas principais

- **Volume de argamassa:**
  `V = área × espessura`
  (área em m², espessura em metros → resultado em m³)
- **Sacos necessários (por rendimento em m²/saco):**
  `sacos = área / rend_m² × (1 + perda)`
- **Sacos necessários (por rendimento em kg/m³):**
  `sacos = V × densidade / peso_saco × (1 + perda)`

### Suposições e presets

- **Reboco interno:** espessura padrão 15 mm.
- **Reboco externo:** espessura padrão 20 mm.
- **Argamassa industrializada** (saco de 20 kg): rende ~2,0 m² a 15 mm de espessura.
- **Argamassa industrializada** (saco de 20 kg): rende ~1,5 m² a 20 mm de espessura.
- **Traço rodado em obra 1:2:8** (cimento : cal : areia): consome ~7 sacos de cimento/m³.
- **Perda padrão:** 10% para paredes normais; 15% para paredes desalinhadas.

### Exemplo rápido

Parede de 40 m² com 15 mm de espessura e argamassa que rende 2,0 m²/saco, perda 10%:

- `40 / 2,0 = 20 sacos`
- `20 × 1,10 = 22 sacos`

### Limitações

O cálculo não substitui a análise de prumo/regularização da parede. Superfícies muito desaprumadas exigem taliscas e mestras espessas, aumentando significativamente o consumo. Consulte a página de [Metodologia](/metodologia) para as premissas gerais adotadas pela Obra Métrica.
