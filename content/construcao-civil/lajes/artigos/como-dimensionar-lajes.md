---
title: "Como dimensionar lajes: estimativa vs engenharia"
description: "Guia prático para escolher entre uma estimativa inicial e um dimensionamento detalhado de lajes maciças e nervuradas."
date: "2026-07-28"
author: "Equipe ObraMétrica"
category: "Construção Civil"
---

## Quando usar cada modo

A Calculadora de Lajes da ObraMétrica oferece dois modos complementares. Entender a diferença
evita interpretar mal um resultado — e evita orçar obra com número inadequado.

**Modo Estimativa rápida** é o padrão para quem está no início do projeto: só pede geometria e
cargas mínimas, aplica heurísticas de mercado (100 kg/m³ de aço para laje maciça, 70 kg/m³ para
nervurada) e devolve volume, aço, vergalhões e formas. É perfeito para levantamento de custo,
comparação de soluções e apresentação inicial ao cliente.

**Modo Engenharia detalhada** adiciona fck, fy e cobrimento e calcula um momento fletor
aproximado (M = α·q·L²) e a área de aço necessária por metro (As em cm²/m). O valor de α é 1/8
para apoio simples e 1/10 para apoio contínuo. Isso ajuda a **conferir a ordem de grandeza** da
armadura antes de fechar contrato ou revisar um projeto recebido.

## Interpretando os resultados

O **volume de concreto** é direto: área × espessura para maciça; mesa + nervuras para nervurada.
Se você não informou a espessura, o sistema adota t = max(0,12; L/20). Vãos acima de 5 m em
laje maciça já pedem revisão manual — apareça o alerta ou não.

O **aço** é uma taxa empírica: multiplica-se o volume pela densidade média de armadura. Isso
significa que **duas lajes com mesmo volume mostram o mesmo aço**, mesmo que uma tenha vão
maior. É a limitação natural da heurística. Para armadura detalhada, use o modo Engenharia e
compare com tabelas de As mínimo da NBR 6118.

O **comprimento de vergalhões** também é linear (10 m por m² por padrão). Divida pelo
comprimento comercial da barra (12 m) para estimar quantidade a comprar; adicione ~10% de perda
por corte.

A **área de formas** soma fundo e laterais. Se você usa formas metálicas ou plásticas
reutilizáveis, essa é a área a locar por ciclo — não a área total consumida ao longo da obra.

## Checklist antes da execução

1. **Sondagem e projeto estrutural em mãos.** Esta calculadora não avalia esforços em vigas e
   pilares que recebem a laje.
2. **Verificar flechas.** Para vãos maiores que 4 m, sempre calcule deformações. A regra L/20
   é para pré-dimensionamento — a flecha real pode exceder o limite normativo de L/250.
3. **Cobrir armadura mínima.** As mínima de flexão é 0,15% da seção de concreto para lajes;
   confira antes de aceitar o valor calculado.
4. **Armadura de distribuição.** Sempre presente, tipicamente 20% da armadura principal.
5. **Punção em pilares apoiando lajes.** Não é avaliada aqui; requer verificação específica.
6. **Concretagem e cura.** Traço, controle tecnológico (fck aos 28 dias) e cura úmida por pelo
   menos 7 dias são requisitos independentes da calculadora.

## Erros comuns

- **Confundir carga permanente com peso próprio.** O peso próprio é calculado automaticamente
  (24 kN/m³ × espessura). O campo `gk` recebe apenas revestimentos, contrapiso, forro e paredes
  fixas sobre a laje.
- **Usar α = 1/8 em painel contínuo.** O momento sobre apoios contínuos é maior; a taxa
  aproximada 1/10 subestima o momento negativo. Para lajes em painel único, considere ambos os
  cenários.
- **Esquecer o cobrimento em ambientes agressivos.** Áreas urbanas com poluição, orla marítima
  ou ambientes industriais pedem 30–40 mm.
- **Comprar aço só pela taxa empírica.** Ela é ótima para orçamento, terrível para compra final.
  Sempre reconcilie com a planilha do projetista.

## Casos típicos

| Cenário | L (m) | W (m) | t (m) | Volume | Aço estimado |
|---|---|---|---|---|---|
| Residencial pequena | 3,0 | 4,0 | 0,12 | 1,44 m³ | ~144 kg |
| Residencial média | 6,0 | 4,0 | 0,15 | 3,60 m³ | ~360 kg |
| Nervurada (mesa 5 cm, hn 20 cm, passo 60 cm) | 6,0 | 6,0 | — | ~4,0 m³ | ~280 kg |

Os valores confirmam a ordem de grandeza esperada — mas nunca substituem o projeto detalhado.

## Próximos passos

- Estime a fundação usando a [Calculadora de Fundação e Sapatas](/construcao-civil/fundacao-sapata).
- Consolide todos os quantitativos no [Orçamento por Etapa](/construcao-civil/orcamento-por-etapa).
- Converse com um engenheiro estrutural antes de comprar material. A ObraMétrica ajuda a
  planejar; a responsabilidade técnica é sempre do profissional habilitado.
