---
title: "Metodologia — drenagem pluvial, calhas e condutos"
description: "Fórmulas, conversões, presets e limitações do cálculo de drenagem da ObraMétrica."
updated: "2026-07-30"
---

# Metodologia

## 1. Aviso preliminar

Esta ferramenta produz **estimativas iniciais**. Não substitui projeto
hidráulico/executivo. O dimensionamento definitivo de drenagem pluvial é
responsabilidade de engenheiro ou hidrólogo habilitado e deve observar a
**ABNT NBR 10844** (instalações prediais de águas pluviais), a **NBR 12218**
(redes de distribuição/drenagem urbana, quando aplicável) e as normas e curvas
IDF do município.

## 2. Método racional

A vazão de projeto de cada bacia de contribuição é calculada pelo método racional:

```
Q = C · i · A
```

onde:

- `Q` — vazão de projeto (m³/s)
- `C` — coeficiente de escoamento superficial (adimensional, 0–1)
- `i` — intensidade da chuva de projeto (m/s)
- `A` — área de contribuição em projeção horizontal (m²)

### Conversão de unidades

As intensidades tabeladas estão em mm/h. A conversão adotada é:

```
i(m/s) = i(mm/h) / 1000 / 3600
```

Exemplo: 130 mm/h → 130 / 1000 / 3600 = 3,611 × 10⁻⁵ m/s.

Para um telhado de 100 m² com C = 0,95 e i = 130 mm/h:

```
Q = 0,95 × 3,611e-5 × 100 = 3,43e-3 m³/s = 3,43 L/s
```

## 3. Coeficientes de escoamento adotados

| Superfície | C |
| --- | --- |
| Telhado de telha | 0,90 |
| Laje impermeabilizada | 0,95 |
| Asfalto / concreto | 0,90 |
| Piso permeável | 0,50 |
| Gramado / jardim | 0,20 |

Os valores são editáveis por bacia. Gramados variam de 0,10 a 0,30 conforme
declividade e tipo de solo; asfalto varia de 0,80 a 0,95 conforme conservação.

## 4. Intensidade de chuva e tempo de concentração

Os presets trazem intensidades ilustrativas para dez capitais brasileiras em
durações de 5, 10, 15, 30 e 60 minutos. A duração deve aproximar-se do **tempo de
concentração** da bacia — o tempo que a gota mais distante leva para atingir o
ponto de despejo. Em coberturas prediais, esse tempo é curto (5 a 10 min); em
pátios e loteamentos, cresce com o percurso e diminui com a declividade.

Para projetos reais, substitua os presets pela curva IDF oficial do município,
adotando período de retorno compatível com o risco (1 ano para calhas simples,
5 a 25 anos para drenagem urbana).

## 5. Dimensionamento de calhas

A seção necessária vem da continuidade:

```
A_sec = Q / v
```

com velocidade de projeto `v` entre 0,5 e 2,0 m/s (padrão 1,0 m/s). Para seção
retangular adota-se relação econômica `h ≈ b/2`, logo `A = b²/2` e
`b = √(2·A_sec)`. Para seção semicircular, `A = π·D²/8` e `D = √(8·A_sec/π)`.
O resultado é arredondado para a largura comercial imediatamente superior
(100 a 600 mm).

## 6. Dimensionamento de condutos

A capacidade do conduto circular a seção plena é obtida pela fórmula de Manning:

```
Q = (1/n) · A · R^(2/3) · S^(1/2)
A = π·D²/4      P = π·D      R = A/P = D/4
```

Coeficientes de rugosidade adotados: PVC `n = 0,009`; PP corrugado `n = 0,010`;
ferro fundido `n = 0,012`; concreto liso `n = 0,013`.

O algoritmo percorre a lista de diâmetros comerciais (50, 75, 100, 125, 150, 200,
250, 300, 400, 500, 600, 800, 1000 mm) e retorna o **menor diâmetro** cuja
capacidade atende à vazão do trecho na declividade `S` informada. Se nenhum
diâmetro atender, a ferramenta emite alerta e sugere aumentar a declividade ou
subdividir o sistema.

### Verificações de velocidade

- `v < 0,6 m/s` → alerta de sedimentação
- `v > 3,0 m/s` → alerta de abrasão
- `S < 0,5%` → alerta de declividade insuficiente

## 7. Ralos e grelhas

Adota-se capacidade unitária de referência de **1,5 L/s por ralo** (editável;
faixa típica 0,5 a 2,0 L/s conforme tipo e submergência). O número mínimo é
`ceil(Q_L/s / capacidade_unitária)`, com mínimo de uma unidade. Trata-se de
heurística de orçamento — grelhas lineares e bocas de lobo têm capacidades
específicas de catálogo que devem prevalecer.

## 8. Limitações conhecidas

- Condutos são avaliados **a seção plena**; escoamento parcial, remanso,
  pressurização e transientes não são simulados.
- Não há cálculo de perdas localizadas, curvas, caixas de passagem ou
  amortecimento em reservatórios de retenção.
- Os presets de chuva são ilustrativos e devem ser revisados com dados
  pluviométricos oficiais.
- Não há integração com APIs pluviométricas nesta fase.
