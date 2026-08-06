---
title: "Exemplo de uso — Layout de painéis em telhado plano 12 × 8 m"
description: "Passo a passo com números reais: telhado plano de 12 × 8 m, módulo de 400 Wp, gaps padrão e cobertura de 80%."
---

## Cenário

Galpão comercial em São Paulo (latitude −23,55°) com laje plana disponível de **12 m (X) × 8 m (Y)**,
livre de obstáculos na primeira etapa. Módulo escolhido: **400 Wp, 1,95 × 0,99 m**, montagem em
paisagem, estrutura inclinada a 15° voltada ao norte.

## Passo 1 — Definir a área e o local

No bloco "Área disponível", selecione **Telhado plano**, informe largura 12 m, comprimento 8 m,
inclinação 15°, azimute 0° e latitude −23,55. A margem de borda padrão é 0,30 m em todos os lados,
o que deixa uma área útil de **11,40 × 7,40 m**.

## Passo 2 — Escolher o módulo

Selecione o preset "400 Wp — 1,95 × 0,99 m" e mantenha a montagem em paisagem. O footprint no plano
fica 1,95 m no eixo X por 0,99 m no eixo Y.

## Passo 3 — Ajustar folgas e restrições

Gap transversal 0,03 m, gap longitudinal 0,01 m. As dimensões efetivas passam a ser:

```text
largura_efetiva = 1,95 + 0,03 = 1,98 m
altura_efetiva  = 0,99 + 0,01 = 1,00 m
```

Deixe o espaçamento anti-sombra desligado nesta primeira simulação (arranjo coplanar em bancadas
únicas) e os corredores desativados para ver o potencial bruto da área.

## Passo 4 — Gerar o layout

```text
n_colunas = piso(11,40 / 1,98) = 5
n_fileiras = piso(7,40 / 1,00) = 7
n_módulos_grade = 5 × 7 = 35
```

O limite de cobertura de 80% permitiria `piso(96 m² × 0,80 / 1,9305 m²) = 39` módulos, portanto a
geometria é o gargalo e os **35 módulos** são aceitos.

Resultados apresentados:

- Potência instalada: 35 × 400 W = **14,00 kWp**
- Área ocupada: 35 × 1,9305 = **67,57 m²** → cobertura efetiva de **70,4%**
- Arranjo elétrico com 10 módulos por string: **4 strings**, a última com 5 módulos
- Módulos reserva sugeridos (2%): **1 unidade**

## Passo 5 — Interpretar os avisos

A ferramenta alerta que a última string ficou desigual (5 contra 10 módulos). Duas saídas: reduzir
para 7 módulos por string (5 strings iguais) ou distribuir as strings em MPPTs distintos. Com
Vmpp de 31 V, dez módulos em série resultam em cerca de 310 V — dentro da faixa MPPT usual de 200 a
850 V.

## Passo 6 — Refinar com manutenção e sombreamento

Ative os corredores com 4 fileiras por bloco e 0,60 m de largura: o comprimento consumido por
corredor derruba o arranjo para 6 fileiras, resultando em 30 módulos e 12,00 kWp — perda de 2 kWp em
troca de acesso seguro para limpeza e inspeção.

Se houver uma caixa d'água de 1,20 × 1,20 m e 2,0 m de altura em (x = 1,0 m; y = 1,0 m), cadastre-a
como obstáculo. Com a elevação solar de inverno de 43,1°, a sombra tem
`2,0 / tan(43,1°) = 2,14 m` de comprimento e bloqueia as posições ao sul do obstáculo, que aparecem
destacadas em vermelho no desenho.

## Passo 7 — Exportar

Use "Exportar CSV" para levar a lista de módulos com fileira, coluna, coordenadas e string para a
planilha de montagem; "Exportar SVG/PNG" para anexar o desenho à proposta; e "Exportar JSON" para
reimportar o cenário depois. O botão de relatório técnico gera um PDF pela impressão do navegador.

## Próximo passo

Leve os 14,00 kWp para a simulação por localização e depois para a calculadora de perdas e
eficiência: com irradiação de 4,9 kWh/m²·dia e eficiência global típica de 78%, a geração estimada
fica na casa de 19,5 MWh/ano.
