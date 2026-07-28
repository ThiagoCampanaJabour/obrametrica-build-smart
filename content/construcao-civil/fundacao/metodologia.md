---
title: "Metodologia — Fundação e Sapatas"
description: "Fórmulas, presets de solo e heurísticas usadas na calculadora de fundação rasa da ObraMétrica."
---

## Metodologia

### Advertência

Esta calculadora fornece **estimativas preliminares**. Não substitui o projeto estrutural de fundações, que deve ser desenvolvido por engenheiro responsável com base em sondagem geotécnica (SPT), avaliação de recalques e cumprimento das normas brasileiras **ABNT NBR 6122** (Projeto e execução de fundações) e **ABNT NBR 6118** (Projeto de estruturas de concreto).

### Fórmulas principais

**Área de base requerida (sapata isolada):**

`A_base = (P × FS) / σ_adm`

- `P` — carga vertical característica no pilar (kN)
- `FS` — fator de segurança (default 2,0)
- `σ_adm` — tensão admissível do solo (kN/m²)

Assumindo sapata quadrada: `L = √A_base`.

**Altura da sapata (heurística):**

`H = max(0,25 × L; 0,30 m)`

**Volume de concreto por sapata:**

`V = L × L × H`

**Sapata corrida:**

`b = (q × FS) / σ_adm` → largura da base em metros
`H = max(0,25 × b; 0,30 m)`
`V_por_metro = b × H × 1,0`

- `q` — carga linear (kN/m)

**Consumo de aço (heurística):**

`m_aço = V × k_aço`, com `k_aço = 100 kg/m³` (faixa típica 80–120 kg/m³).

**Área de formas laterais:**

- Isolada: `A_forma = 4 × L × H` por sapata.
- Corrida: `A_forma = 2 × H × comprimento_total`.

### Presets

| Tipo de solo | σ_adm (kN/m²) | Uso típico |
|---|---|---|
| Macio | 100 | Argilas moles, aterros pouco compactados |
| Médio | 200 | Solos residuais compactos |
| Firme | 300 | Solo saprolítico duro, rocha alterada |

Valores ilustrativos — o valor real depende de sondagem SPT.

Outros defaults: `FS = 2,0`, `k_aço = 100 kg/m³`, `f_ck = 25 MPa`, cobrimento = 30 mm.

### Exemplo passo a passo

Carga por pilar `P = 300 kN`, `σ_adm = 150 kN/m²`, `FS = 2,0`:

1. `A_base = (300 × 2) / 150 = 4,0 m²`
2. `L = √4,0 = 2,00 m`
3. `H = 0,25 × 2,00 = 0,50 m`
4. `V = 2,00 × 2,00 × 0,50 = 2,00 m³`
5. `m_aço = 2,00 × 100 = 200 kg`
6. `A_forma = 4 × 2,00 × 0,50 = 4,00 m²`

### Limitações

- Não calcula esforços de flexão, punção ou cisalhamento.
- Não considera excentricidade de carga, ventos ou sismo.
- Não trata solos com lençol freático elevado, aterros compressíveis ou colapsíveis.
- A heurística de aço serve apenas para estimativa de compras.
- Cargas devem ser as **atuantes de projeto** (combinações permanentes + variáveis).

Para o critério geral da ObraMétrica, consulte a página de [Metodologia](/metodologia).
