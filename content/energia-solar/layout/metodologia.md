---
title: "Metodologia — Área e Layout de Painéis Fotovoltaicos"
description: "Fórmulas, heurísticas e limitações do cálculo 2D de área, arranjo, espaçamento entre fileiras e sombreamento de sistemas fotovoltaicos."
---

## Escopo do modelo

O cálculo trata a área disponível como um retângulo de dimensões L_x (largura, eixo X) por L_y
(comprimento, eixo Y), com origem no canto inferior-esquerdo. Todas as posições retornadas são
coordenadas do canto inferior-esquerdo de cada módulo, em metros, relativas a essa origem. A
abordagem é bidimensional: não há modelagem de terreno, de águas múltiplas nem de sombreamento
horário.

## 1. Footprint e dimensões efetivas

O módulo tem duas dimensões, a maior (comprimento) e a menor (largura). A montagem define a
projeção no plano:

- paisagem: largura_X = maior dimensão, altura_Y = menor dimensão;
- retrato: largura_X = menor dimensão, altura_Y = maior dimensão.

As dimensões efetivas incorporam os gaps de montagem:

```text
largura_efetiva = largura_X + gap_transversal
altura_efetiva  = altura_Y  + gap_longitudinal
```

Presets usuais: gap transversal de 0,03 m (dilatação térmica e clamps intermediários) e gap
longitudinal de 0,01 m. Gaps maiores facilitam a drenagem e a limpeza, mas reduzem a densidade.

## 2. Área útil e contagem da grade

A área útil desconta a margem de borda em todos os lados:

```text
largura_util     = L_x - 2 × margem_borda
comprimento_util = L_y - 2 × margem_borda
n_colunas        = piso(largura_util / largura_efetiva)
```

As fileiras não são obtidas por uma divisão simples porque os corredores de manutenção consomem
espaço. O algoritmo percorre o eixo Y acumulando o passo entre fileiras e, a cada bloco de N
fileiras, insere um corredor de largura definida — mas apenas se ainda couber outra fileira depois
dele, evitando desperdício de área na última faixa.

## 3. Passo entre fileiras e sombreamento mútuo

Em telhado plano ou em usinas de solo, as estruturas inclinadas projetam sombra sobre a fileira
seguinte. O passo mínimo adotado é:

```text
S = h × cos(tilt) + h × sen(tilt) / tan(elevação_solar_inverno)
```

onde h é a altura do módulo no plano inclinado. A elevação solar é estimada para o meio-dia do
solstício de inverno a partir da latitude:

```text
elevação = 90° − |latitude − declinação|,  declinação = +23,45° (hemisfério sul)
```

Em São Paulo (latitude −23,55°) isso resulta em aproximadamente 43°. É uma simplificação
conservadora: adota-se o pior instante do ano ao meio-dia solar, ignorando o sombreamento oblíquo
das primeiras e últimas horas do dia. Em telhado inclinado com módulos coplanares, o espaçamento
não se aplica e o passo é apenas a altura efetiva.

## 4. Obstáculos e sombras projetadas

Cada obstáculo é um retângulo (x, y, largura, profundidade) com uma altura acima do plano dos
módulos. O comprimento da sombra é:

```text
comprimento_sombra = altura_obstáculo / tan(elevação_solar_inverno)
```

A sombra é lançada no sentido oposto ao sol — para o sul no hemisfério sul, isto é, no sentido
crescente de Y quando a área está orientada norte-sul. Toda posição da grade que intercepte o
retângulo do obstáculo ou o da sombra é removida do arranjo e marcada com o motivo correspondente,
permitindo auditar o layout.

## 5. Limites de ocupação

Dois tetos são aplicados sobre a grade geométrica:

- cobertura máxima: `n_max = piso(área_total × cobertura_pct / área_do_módulo)`, com default de
  80% para preservar circulação, sistemas de combate a incêndio e futuras ampliações;
- alvo do usuário: número de módulos ou potência desejada, convertida por
  `ceil(kWp × 1000 / Pmp)`.

O menor dos valores prevalece; as posições descartadas são listadas com os motivos "cobertura" ou
"alvo".

## 6. Arranjo elétrico

Os módulos aceitos são numerados em varredura por fileira e agrupados sequencialmente:

```text
n_strings = teto(n_módulos / módulos_por_string)
```

Se a última string ficar incompleta, a ferramenta emite aviso — strings desiguais no mesmo MPPT
provocam perdas por mismatch e devem ser distribuídas entre entradas diferentes. Quando a tensão
estimada (Vmpp × módulos em série) ultrapassa 800 V, há alerta para conferir a tensão máxima DC do
inversor. A verificação completa de string sizing, com Voc corrigido pela temperatura mínima, está
na calculadora de inversor.

## 7. Orientação e inclinação sugeridas

Para máxima geração anual no hemisfério sul, o plano ideal é voltado ao norte geográfico
(azimute 0°) com inclinação próxima à latitude, respeitando um mínimo de 10° para autolimpeza pela
chuva. Em telhado inclinado, a estrutura acompanha a água existente: desvios de azimute de até ±30°
custam tipicamente menos de 5% da geração anual, o que raramente justifica estruturas de correção.

## 8. Limitações

O modelo não considera: formas de telhado não retangulares, carga de vento e peso próprio sobre a
estrutura, distâncias mínimas exigidas pelo corpo de bombeiros local, sombreamento por edificações
vizinhas fora da área e variação horária da geometria solar. Para telhados complexos, plantas
irregulares ou contratos com garantia de performance, valide o layout em ferramenta 3D e com
projeto estrutural assinado.

## Referências

- ABNT NBR 16274 — Sistemas fotovoltaicos conectados à rede: requisitos mínimos de documentação.
- ABNT NBR 16690 — Instalações elétricas de arranjos fotovoltaicos.
- IEC 61724-1 — Photovoltaic system performance monitoring.
- NREL — Best Practices for Photovoltaic System Design and Row Spacing.
- Atlas Brasileiro de Energia Solar (INPE/CEPEL), 2ª edição.
