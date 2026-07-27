---
title: Metodologia — String Sizing
description: Fórmulas, suposições e limitações da Calculadora de Inversor / String Sizing.
---

# Metodologia — String Sizing

Esta calculadora aplica um conjunto de verificações elétricas para determinar quantos módulos podem ser conectados em série (string) e em paralelo em cada MPPT do inversor. As fórmulas são as clássicas do projeto fotovoltaico.

## 1. Tensões da string

Para `n` módulos em série:

- **Vmp_sum = Vmp_módulo × n** — tensão no ponto de máxima potência.
- **Voc_sum = Voc_módulo × n** — tensão em circuito aberto (STC, 25 °C).

## 2. Correção de Voc pela temperatura mínima

A tensão sobe quando o módulo esfria. Usamos:

```
Voc_corr = Voc_sum × (1 + coef × (T_min − 25))
```

Onde `coef` é o coeficiente de temperatura de Voc do módulo, informado pelo fabricante (tipicamente entre −0,25 %/°C e −0,30 %/°C). Convertemos para decimal: `−0,27 %/°C → −0,0027 /°C`. Como o coeficiente é negativo e `ΔT < 0` em regiões frias, o produto é positivo — Voc aumenta.

Exemplo: módulo Voc 40,5 V; string de 20 módulos → Voc_sum = 810 V. Com coef = −0,27 %/°C e T_min = −5 °C, ΔT = −30 °C, fator = 1 + (−0,0027 × −30) = 1,081 → Voc_corr ≈ 875 V.

## 3. Validação contra o inversor

- **Voc_corr < Voc_max_inversor × safety_factor** — safety_factor padrão 0,95. Se ultrapassar, a configuração é marcada como ERRO.
- **MPPT_min ≤ Vmp_sum ≤ MPPT_max** — se Vmp sair da faixa, o inversor não opera no MPP.
- **Isc_módulo ≤ corrente_máx_MPPT** — para módulos de alta corrente (bifaciais, half-cell), verifique a corrente por entrada.

## 4. Relação DC/AC

```
DC/AC = P_dc_total / P_ac_inversor
```

Valores típicos ficam entre 1,10 e 1,35. Acima de 1,40 há risco significativo de clipping. Abaixo de 1,05 o inversor está subutilizado.

## 5. Suposições e limitações

- Temperatura mínima informada pelo usuário. Consulte histórico climatológico do INMET para o local.
- Coeficiente de temperatura padrão de −0,27 %/°C quando não informado.
- A calculadora não modela quedas de tensão em cabos DC longos — considere um adicional de 1–3 % nas perdas.
- Módulos bifaciais podem ter ganho traseiro de 5–15 %; use potência STC para dimensionamento conservador.
- Sempre valide o projeto executivo com engenheiro eletricista.

## 6. Presets utilizados

Os presets de módulos e inversores refletem valores típicos de mercado (2024–2025). Consulte a [tabela de presets](/metodologia) para referências completas.
