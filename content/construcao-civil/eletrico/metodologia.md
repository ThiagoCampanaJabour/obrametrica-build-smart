---
title: Metodologia — Dimensionamento Elétrico
description: Fórmulas, suposições e limitações do cálculo simplificado de cargas, disjuntores e bitolas.
category: construcao-civil
tags: [metodologia, nbr-5410]
updated: 2026-07-28
---

## Premissas

- **Fator de potência (fp)**: padrão 1,0 (cargas resistivas). Ajustável por circuito para cargas
  indutivas (motores, ACs) — típico 0,8–0,92.
- **Fatores de simultaneidade (fs)**: presets por tipo — iluminação 0,66; tomadas gerais 0,4;
  chuveiro 1,0; AC 1,0. Editáveis pelo usuário.
- **Cobre** como condutor, temperatura de operação 70°C, isolação PVC/EPR (aproximação).
- **Método de instalação B1** (eletroduto embutido em alvenaria), 2 condutores carregados.

## Fórmulas principais

Conversão potência → corrente:

- Monofásico: `I = (P · fs) / (V · fp)`
- Trifásico:  `I = (P · fs) / (√3 · V · fp)`

Seleção do **disjuntor**: `I_breaker ≥ 1,25 · I`, arredondado para o padrão comercial
(6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100 A…).

Seleção da **bitola** (mm²): menor seção cuja ampacidade `Iz ≥ max(I, I_breaker)`.

**Queda de tensão** (aproximação apenas resistiva):

- Monofásico: `ΔV = 2 · I · (R/1000) · L`
- Trifásico:  `ΔV = √3 · I · (R/1000) · L`

Com `R` em ohm/km da tabela por bitola e `L` em metros (comprimento do circuito). O resultado é
expresso em % da tensão nominal. **Limite recomendado: 4%** (terminais de utilização).

## Tabelas de referência (simplificadas)

| Bitola (mm²) | Iz (A) aprox. | R (ohm/km) |
|---|---|---|
| 1,5 | 15,5 | 15,0 |
| 2,5 | 21 | 9,0 |
| 4 | 28 | 5,6 |
| 6 | 36 | 3,75 |
| 10 | 50 | 2,25 |
| 16 | 68 | 1,41 |
| 25 | 89 | 0,90 |

Valores aproximados. Confirmar sempre nas tabelas 36 a 39 da **NBR 5410** para o método real de
instalação, agrupamento e temperatura ambiente.

## Circuitos mínimos (NBR 5410)

- **Iluminação**: bitola mínima 1,5 mm².
- **Tomadas de uso geral**: bitola mínima 2,5 mm².
- **Cargas específicas** (chuveiro, forno, AC): circuito exclusivo com proteção dedicada.

## Limitações

Esta ferramenta **não** realiza:

- Cálculo de corrente de curto-circuito e verificação da capacidade de interrupção do disjuntor.
- Coordenação e seletividade entre proteções.
- Análise térmica com fatores de correção (agrupamento, temperatura, tipo de eletroduto).
- Dimensionamento de dispositivos DR, DPS, aterramento ou equipotencialização.

## Aviso

Todos os resultados são estimativas. **O projeto elétrico executivo deve ser elaborado por
engenheiro eletricista habilitado**, conforme a ABNT NBR 5410 e as normas locais da
concessionária.

## Referências

- ABNT NBR 5410 — Instalações elétricas de baixa tensão.
- ABNT NBR IEC 60947-2 — Disjuntores de baixa tensão.
- Prysmian, catálogos técnicos de condutores (ampacidades e resistências).
