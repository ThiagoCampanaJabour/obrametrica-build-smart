---
title: "Guia prático: como dimensionar calhas, ralos e drenagem"
description: "Do método racional às declividades mínimas: passo a passo para dimensionar drenagem pluvial em obras."
category: "Construção Civil"
updated: "2026-07-30"
---

# Como dimensionar calhas, ralos e drenagem na obra

Água mal conduzida é a origem silenciosa de boa parte das patologias em
edificações: infiltração em alvenaria, erosão de aterro, recalque de piso e
sobrecarga em telhados. Dimensionar corretamente calhas, ralos e condutos custa
pouco na fase de projeto e evita retrabalho caro depois. Este guia mostra o
caminho completo, do cálculo da vazão à escolha do diâmetro comercial.

## 1. O conceito central: Q = C · i · A

Todo dimensionamento pluvial começa pelo **método racional**. A vazão de projeto é
o produto de três grandezas:

- **A** — a área de contribuição, medida em projeção horizontal (m²)
- **C** — o coeficiente de escoamento, que representa a fração da chuva que
  efetivamente vira escoamento superficial
- **i** — a intensidade da chuva de projeto (mm/h), obtida da curva IDF local

O detalhe que mais gera erro é a unidade de `i`. Tabelas trazem mm/h, mas a
fórmula exige m/s:

```
i(m/s) = i(mm/h) / 1000 / 3600
```

### Exemplo prático

Telhado residencial de 100 m², telha cerâmica (C = 0,95), São Paulo, duração de
projeto de 15 min → i = 130 mm/h.

```
i = 130 / 1000 / 3600 = 3,611e-5 m/s
Q = 0,95 × 3,611e-5 × 100 = 0,00343 m³/s ≈ 3,43 L/s
```

Três litros e meio por segundo parecem pouco — até você lembrar que isso é
12.350 litros por hora caindo em um único ponto de despejo.

## 2. Escolhendo o coeficiente C

| Superfície | C típico |
| --- | --- |
| Laje impermeabilizada | 0,95 |
| Telhado de telha | 0,90 |
| Asfalto | 0,80–0,95 |
| Piso permeável | 0,40–0,60 |
| Gramado | 0,10–0,30 |

Em terrenos mistos, calcule por bacia separada em vez de usar uma média. Uma
garagem de 200 m² em asfalto e um jardim de 200 m² não drenam igual, e agrupá-los
com C médio subdimensiona o pico.

## 3. Agrupando bacias em trechos

Cada ponto de despejo — um condutor vertical, uma caixa de areia, uma boca de lobo
— recebe a soma das vazões das bacias que chegam até ele. É por isso que a
ferramenta pede um campo "ponto de despejo": bacias com o mesmo destino somam.

```
Telhado norte (3,4 L/s) ─┐
Telhado sul   (3,4 L/s) ─┼──> Caixa 1  =  8,3 L/s ──> conduto DN?
Garagem       (1,5 L/s) ─┘
```

Uma simplificação conservadora do método racional é considerar que todos os picos
coincidem. Para bacias com tempos de concentração muito diferentes, essa hipótese
superdimensiona — o que, em drenagem, é geralmente aceitável.

## 4. Seção de calha

A continuidade resolve: `A_sec = Q / v`. Adote velocidade de projeto entre 0,5 e
2,0 m/s. Para 8,3 L/s a 1,0 m/s:

```
A_sec = 0,0083 / 1,0 = 0,0083 m² = 83 cm²
```

Com relação `h ≈ b/2`, `b = √(2 × 0,0083) = 0,129 m` → calha comercial de 150 mm
de largura por 75 mm de altura. Sempre acrescente borda livre e considere o
acúmulo de folhas: calhas reais operam sujas.

## 5. Diâmetro do conduto pela fórmula de Manning

Para condutos circulares a seção plena:

```
Q = (1/n) · (πD²/4) · (D/4)^(2/3) · S^(1/2)
```

Com PVC (`n = 0,009`) e declividade de 1% (S = 0,01), um DN 100 mm escoa cerca de
11 L/s a seção plena. Nossos 8,3 L/s cabem — com folga pequena, o que sugere
adotar DN 125 se houver risco de obstrução.

A rotina prática é iterar sobre os diâmetros comerciais e escolher o primeiro que
atende. É exatamente o que a calculadora faz.

## 6. Declividades e velocidades

- **S mínima**: 0,5% em trechos curtos, 1% como boa prática
- **v mínima**: 0,6 m/s — abaixo disso, sólidos sedimentam e o tubo entope
- **v máxima**: 3,0 m/s — acima disso, há abrasão em concreto e ruído em PVC

## 7. Ralos e grelhas

Use a capacidade de catálogo sempre que possível. Na ausência dela, adote de 0,5 a
2,0 L/s por ralo comum e divida a vazão do trecho. Para 8,3 L/s a 1,5 L/s por
unidade, seriam 6 ralos — número que já indica que uma grelha linear seria melhor
solução.

## 8. Checklist de execução e manutenção

- [ ] Conferir a projeção horizontal do telhado, não a área inclinada
- [ ] Verificar borda livre da calha e transbordo de emergência
- [ ] Garantir declividade contínua, sem contraflecha entre suportes
- [ ] Instalar caixa de areia antes da rede pública
- [ ] Prever grelhas removíveis para limpeza
- [ ] Limpar calhas e ralos no início e no fim da estação chuvosa
- [ ] Registrar em memorial os valores de C, i e S adotados

## 9. Quando chamar o especialista

Loteamentos, reservatórios de amortecimento, drenagem de subsolo com lençol
freático alto e sistemas com bombeamento exigem estudo hidrológico dedicado.
Esta calculadora resolve o pré-dimensionamento e alimenta a conversa com o
projetista — não a substitui.
