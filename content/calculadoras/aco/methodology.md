---
title: "Metodologia — Calculadora de Aço"
description: "Fórmulas, pesos lineares e exemplo do cálculo de aço estrutural CA-50/CA-60."
---

## Metodologia

### Fórmulas principais

- **Peso linear (kg/m):**
  `p = ρ × A = 7.850 × (π × d² / 4)`
  onde `ρ = 7.850 kg/m³` (densidade do aço) e `d` é o diâmetro em metros.
- **Massa total:**
  `M = L_total × p × (1 + perda)`
- **Barras comerciais (12 m):**
  `barras = ceil(L_total × (1 + perda) / 12)`

### Suposições e presets (pesos lineares tabelados)

| Bitola (mm) | Peso (kg/m) |
|---|---|
| 5,0  | 0,154 |
| 6,3  | 0,245 |
| 8,0  | 0,395 |
| 10,0 | 0,617 |
| 12,5 | 0,963 |
| 16,0 | 1,578 |
| 20,0 | 2,466 |
| 25,0 | 3,853 |

- Barras comerciais de **12 m** (padrão brasileiro).
- Perda padrão: **10%** por cortes, dobras e sobras.
- Considera CA-50 para bitolas ≥ 6,3 mm e CA-60 para 5,0 mm.

### Exemplo rápido

Viga com 60 m lineares de bitola 10 mm, perda 10%:

- `60 × 0,617 = 37,02 kg`
- `37,02 × 1,10 ≈ 40,7 kg`
- Barras: `60 × 1,10 / 12 = 5,5 → 6 barras`

### Limitações

Não considera traspasses de emenda específicos, ancoragens especiais (grampos, ganchos) nem armaduras de combate à fissuração. Para o quantitativo executivo, siga o detalhamento do projeto estrutural. Consulte a [Metodologia](/metodologia) para o critério geral.
