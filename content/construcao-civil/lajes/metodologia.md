---
title: "Metodologia — Calculadora de Lajes e Armaduras"
description: "Explica as fórmulas e suposições usadas para estimativas de volume de concreto e armadura."
---

## Objetivo

Esta metodologia descreve as fórmulas, os coeficientes e as **suposições explícitas** utilizadas
pela Calculadora de Lajes e Armaduras da ObraMétrica. O propósito é fornecer estimativas
preliminares (com incerteza típica de ±15–25%) para painéis de laje maciça unidirecional e laje
nervurada simples, apoiando decisões de orçamento e comparação de alternativas.

## Convenções

- Densidade do concreto armado adotada: **24 kN/m³** (peso específico convencional).
- Cargas em kN/m²: `gk` = permanentes adicionais (revestimentos, contrapiso), `qk` = acidentais
  (uso). O peso próprio da laje é somado automaticamente à carga total.
- Aço estimado por taxa empírica (kg/m³ de concreto), não por dimensionamento seção a seção.
- Cobrimento nominal: 25 mm (ambiente CAA I). Ajustável para 30–40 mm em ambientes agressivos.

## Espessura mínima

Para lajes maciças, quando o usuário não informa espessura, adota-se a regra prática:

> `t = max(0,12 m; L / 20)`

Espessuras abaixo de 8 cm geram alerta automático; abaixo de L/25, alerta de deformação.

## Volume de concreto

**Laje maciça:**

> `V = A × t`, onde `A = L × W` (m²) e `t` é a espessura (m).

**Laje nervurada simples:**

> `V = A × tm + n × bw × hn × L`
>
> `n = floor(W / passo)`

onde `tm` é a espessura da mesa, `bw` a largura da alma da nervura, `hn` a altura da nervura, e
`passo` o espaçamento entre eixos das nervuras.

A **espessura equivalente** é `V / A` — usada para o cálculo do peso próprio.

## Aço estimado (heurística)

Aplica-se uma taxa empírica por m³ de concreto:

- Laje maciça: **100 kg/m³** (faixa 80–120 kg/m³).
- Laje nervurada: **70 kg/m³** (faixa 50–90 kg/m³).

> `kg_aço = V × kg/m³`

Essa taxa engloba armadura positiva, negativa, distribuição e perdas de corte. Não substitui
detalhamento.

## Comprimento de vergalhões

Estimativa linear:

> `L_barras = A × m/m²`, com `m/m² = 10` como valor padrão.

O usuário pode ajustar via preset em `presets.json`. Para conversão em número de barras por
bitola, considere o comprimento comercial (12 m).

## Formas

> `A_forma = A + perímetro × t_eq`

Ou seja: fundo da laje + laterais aproximadas em função da espessura equivalente.

## Modo Engenharia — momento e As

Para lajes unidirecionais, adota-se `M = α · q · L²` (kN·m por metro de largura):

- α = **1/8** para apoio simples;
- α = **1/10** para apoio contínuo (aproximação para painéis intermediários).

A área de aço aproximada por metro é calculada por:

> `As ≈ M / (0,9 · d · fyd)`, com `fyd = fy / 1,15`.

Onde `d = t − cobrimento − Ø/2` (aproximado). Esse valor é **orientativo**: não considera
armadura mínima, distribuição, cisalhamento nem punção.

## Limitações

- Não cobre lajes bidirecionais complexas, protendidas, cogumelo ou lisas.
- Não avalia flechas, fissuração, cisalhamento ou punção.
- Presets de aço e coeficientes de momento são simplificações reconhecidas.
- Para projeto executivo, contrate engenheiro estrutural e siga NBR 6118 e NBR 6120.

## Referências

- ABNT NBR 6118:2014 — Projeto de estruturas de concreto.
- ABNT NBR 6120:2019 — Ações para o cálculo de estruturas de edificações.
- TQS Docs, tabelas de coeficientes de momento para lajes retangulares.
