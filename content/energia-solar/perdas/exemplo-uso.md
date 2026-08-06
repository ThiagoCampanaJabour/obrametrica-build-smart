---
title: "Exemplo de uso — Perdas e eficiência de um sistema de 10 kWp"
description: "Passo a passo numérico da Calculadora de Perdas / Eficiência: de 14.000 kWh/ano teóricos à energia final AC."
---

## Cenário

Sistema residencial em Campinas (SP):

- Potência DC instalada: **10 kWp** (18 módulos de 555 Wp)
- Inversor string: **8 kW AC**, eficiência 97%
- Energia teórica DC anual (obtida na simulação por localização): **14.000 kWh/ano**
- Coeficiente térmico do módulo: **−0,35 %/°C**, NOCT 45 °C
- Temperatura ambiente média de operação: **28 °C**
- Telhado com uma chaminé próxima: sombreamento estimado em **2%**
- Área urbana com chuvas regulares: sujidade **2%**
- Módulos do mesmo lote: mismatch **1,5%**
- Cabeamento DC curto: **1,5%**
- Perdas AC/BOS: **1%**; margem de segurança: **2%**

## Passo 1 — Temperatura de célula

```
T_cel = 28 + (45 − 20) × 800 / 800 = 53 °C
ΔT    = 53 − 25 = 28 °C
f_temp = 0,35 %/°C × 28 °C = 9,8%
```

Perda: 14.000 × 9,8% = **1.372 kWh**. Energia restante: 12.628 kWh.

Essa é, de longe, a maior perda do sistema — e a menos discutida em propostas. Ventilação sob os
módulos (telhado com espaçamento adequado) reduz `T_cel` em 3 a 5 °C, o que aqui valeria cerca
de 150 a 250 kWh/ano.

## Passo 2 — Sombreamento

12.628 × 2% = **253 kWh**. Restante: 12.375 kWh.

## Passo 3 — Sujidade

12.375 × 2% = **248 kWh**. Restante: 12.127 kWh.

## Passo 4 — Mismatch

12.127 × 1,5% = **182 kWh**. Restante: 11.945 kWh.

## Passo 5 — Cabeamento DC

11.945 × 1,5% = **179 kWh**. Restante: 11.766 kWh.

Se a distância entre o arranjo e o inversor fosse grande, valeria usar o modo resistivo:
com I = 20 A, R = 0,2 Ω e 1.400 h equivalentes, a perda seria 20² × 0,2 × 1.400 / 1.000 =
112 kWh — abaixo do percentual default, mostrando que a estimativa genérica era conservadora.

## Passo 6 — Inversor

11.766 × (1 − 0,97) = **353 kWh**. Restante: 11.413 kWh.

## Passo 7 — Clipping

DC/AC = 10 / 8 = **1,25** → clipping estimado de 1,5%.
11.413 × 1,5% = **171 kWh**. Restante: 11.242 kWh.

Reduzir a relação DC/AC exigiria um inversor de 10 kW, mais caro; a perda de 171 kWh/ano
raramente justifica o upgrade nesse porte.

## Passo 8 — Perdas AC e margem

11.242 × 1% = **112 kWh** → 11.130 kWh.
11.130 × 2% = **223 kWh** → **10.907 kWh**.

## Resultado

| Indicador | Valor |
|---|---|
| Energia teórica DC | 14.000 kWh/ano |
| Energia final AC | ≈ 10.907 kWh/ano |
| Perdas totais | ≈ 3.093 kWh/ano (22,1%) |
| Eficiência global | ≈ 77,9% |
| Produção específica | ≈ 1.091 kWh/kWp·ano |

A produção específica resultante é coerente com o observado no interior paulista
(1.050–1.250 kWh/kWp·ano), o que valida a ordem de grandeza das premissas.

## Passo 9 — Degradação

Com 0,5% ao ano, no ano 25 a produção seria 10.907 × 0,995²⁴ ≈ **9.669 kWh**, ou 88,6% do ano 1.
É esse número — e não o do ano 1 — que deve alimentar a análise de payback de longo prazo.
