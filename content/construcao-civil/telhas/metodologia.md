---
title: "Metodologia — Quantificação e Corte de Telhas/Peças"
description: "Fórmulas, heurísticas de perda por tipo de peça e layout, e limites da estimativa de cortes."
---

## Metodologia

### Fórmulas

A área da peça vem das dimensões em milímetros:

```
area_peca_m2 = (largura_mm / 1000) × (altura_mm / 1000)
```

Quando há junta, o **módulo de repetição** soma a espessura da junta às duas dimensões, o que reduz
levemente o número de peças por metro quadrado:

```
area_modulo_m2 = ((largura_mm + junta_mm) / 1000) × ((altura_mm + junta_mm) / 1000)
num_pecas_base = ceil(area_total_m2 / area_modulo_m2)
num_final = ceil(num_pecas_base × (1 + perda_pct/100) × (1 + margem_pct/100))
```

O total a comprar acrescenta as peças de reserva informadas pelo usuário.

### Perdas padrão

| Tipo de peça | Perda default |
|---|---|
| Telha cerâmica | 7% (+3% de quebra no manuseio) |
| Piso cerâmico 20×20 | 8% |
| Porcelanato 60×60 | 12% |
| Revestimento de parede 30×60 | 6% |
| Placa grande | 12% |

Acréscimos por layout, em pontos percentuais: alinhado 0; deslocamento 50% +2; deslocamento 33% +3;
espinha de peixe +20. Peças com área igual ou superior a 0,16 m² (40×40 cm) recebem mais 4 pontos,
porque cada recorte descarta uma fração maior de material.

### Estimativa de cortes

Com as dimensões do ambiente conhecidas, contamos as peças de borda do grid:

```
colunas = ceil(L / largura_modulo)
fileiras = ceil(W / altura_modulo)
n_borda = 2 × (colunas + fileiras) − 4      // + 1 corte por fileira em layouts deslocados
percent_cortes = n_borda / (colunas × fileiras)
```

Sem essas dimensões, aplicamos uma fração fixa por layout: 20% (alinhado), 30% (50%), 32% (33%) e
45% (espinha de peixe).

### Suposições e limites

O cálculo supõe ambiente retangular, peças de lote único e assentamento em uma única direção. Não há
otimização de corte (*nesting*), nem tratamento de pilares, ralos, soleiras, rodapés e recortes de
degrau. Ambientes em L devem ser divididos em retângulos e somados. Para coberturas inclinadas,
projete primeiro a área real com a calculadora de telhas antes de usar esta ferramenta.

Aumente a perda manualmente quando o ambiente tiver muitos recortes, quando as peças forem
retificadas de grande formato ou quando o assentador for pouco experiente. Em caso de dúvida sobre
área útil e rendimento, consulte o fabricante e o instalador.
