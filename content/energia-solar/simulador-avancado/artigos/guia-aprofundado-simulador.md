---
title: Guia aprofundado do Simulador Avançado de Energia Solar
description: Como interpretar cada resultado do simulador, quando pedir análise 3D e como conectar o output com o dimensionamento de inversor.
---

# Guia aprofundado — Simulador Avançado

O [Simulador Avançado](/simulador-solar-avancado) do ObraMétrica foi pensado para ser a primeira ferramenta que um projetista ou proprietário abre quando avalia uma nova superfície candidata a receber módulos fotovoltaicos. Este guia aprofunda o uso da ferramenta e explica quando ir além dela para um projeto executivo.

## O que o simulador faz de fato

Em uma única execução, o simulador:

1. Calcula quantos módulos cabem na área bruta informada;
2. Estima a perda por orientação combinando desvio de tilt e azimute em relação ao ideal;
3. Aplica um Performance Ratio (PR) padrão de 0,78 sobre a produção teórica;
4. Executa uma varredura de configurações de string (2 a 20 módulos) e classifica as cinco melhores por produção anual estimada.

O resultado é um trade-off imediato entre densidade de instalação, orientação e agrupamento elétrico — três variáveis que, na prática, precisam ser decididas em conjunto.

## Interpretando o campo "diff"

O simulador consolida tilt e azimute em um único indicador de desvio. Quanto menor esse desvio em relação à orientação ótima (tilt ≈ latitude, azimute 0° = Norte no Hemisfério Sul), menor a perda modelada:

- Diff < 15° → perda 1–2 %.
- Diff 15–45° → perda 3–8 %.
- Diff > 45° → perda 8–20 %.

Essas faixas são conservadoras. Para orientações extremas (azimute > 90°, tilt > 45°), a perda real pode variar significativamente com o padrão de irradiância local. Use o campo de sombreamento aceitável para calibrar a estimativa contra medições em campo (Solar Pathfinder, drones, etc.).

## Quando pedir análise 3D dedicada

O simulador é uma heurística útil para pré-projeto. Para os cenários abaixo, use ferramentas 3D como Helioscope, PVsyst ou PVCase:

- Telhados com **múltiplas orientações** (águas com direções e inclinações diferentes).
- Presença de **obstruções significativas** (chaminés, prédios vizinhos, árvores) com variação horária relevante.
- Projetos com **tracker de 1 eixo** ou estruturas de solo em terrenos com desnível.
- Sistemas acima de 75 kWp onde o ganho de 1 % de precisão paga a análise detalhada.

## Como usar o output no dimensionamento de inversor

O simulador entrega a **potência total em kWp** e a **configuração de strings recomendada** — dois insumos que alimentam diretamente a [Calculadora de Inversor / String Sizing](/energia-solar/calculadora-inversor):

1. Copie a potência instalada e o número de módulos por string sugerido.
2. Cole na calculadora de inversor e valide a compatibilidade elétrica (Voc frio, faixa MPPT).
3. Se a configuração elétrica falhar, retorne ao simulador com um limite máximo de módulos por string reduzido.

Essa iteração entre as duas ferramentas evita o erro clássico de projetar apenas pelo lado da produção e descobrir na obra que o inversor escolhido não aceita a string longa.

## Exemplo prático: telhado industrial 12×20 m

Situação típica:

- Comprimento 20 m, largura 12 m, sem obstruções significativas.
- Tilt 10° (telhado com pouca inclinação), azimute 0° (Norte).
- Módulos 550 Wp; sombreamento aceitável 5 %.

Resultado esperado:

- Área utilizável ≈ 240 m² → ~92 módulos → **50,6 kWp**.
- Perda por orientação ≈ 3 % (tilt abaixo do ideal, mas azimute ok).
- Produção anual estimada ≈ 70.500 kWh/ano.
- Melhor configuração de strings: 10 módulos × 9 strings + 2 avulsos → ajustar inversor para múltiplas entradas MPPT.

Levar esse output para a [Calculadora de Payback](/energia-solar/calculadora-payback) permite converter os kWh anuais em receita evitada e VPL do projeto.

## Sensibilidade: o que muda a produção anual

Três parâmetros dominam a variação de produção estimada:

- **Irradiância local**: cada 0,1 kWh/m²/dia de HSP altera a produção anual em ~2 %.
- **Sombreamento real**: cada 5 pontos percentuais de perda alteram a produção em 5 %.
- **PR assumido**: variar o PR de 0,78 para 0,82 aumenta a produção em ~5 %.

Antes de assinar um contrato de EPC, valide esses três valores com dados locais (PVGIS, Atlas Solarimétrico do INPE, medições da concessionária).

## Limitações a documentar no memorial

- O simulador **não modela sombreamento horário módulo a módulo**.
- Não considera perdas por soiling regional (poeira, salinidade).
- Não distingue módulos bifaciais — usa a potência STC como referência.
- Não valida enquadramento normativo (ABNT NBR 16690, prodist).

Registre essas limitações no memorial de cálculo e, para projetos executivos, complemente com análise 3D.

## Fluxo recomendado

1. **Simulador Avançado**: descarte rápido de superfícies inviáveis; ranking de opções.
2. **Calculadora de Inversor**: valida compatibilidade elétrica antes de comprar equipamento.
3. **Calculadora de Payback**: converte kWh em fluxo de caixa e ROI.
4. **PVsyst/Helioscope**: só quando o projeto passa nas três etapas acima e o cliente aprova o orçamento.

Esse fluxo economiza horas de trabalho e evita retrabalho quando o cliente pede alternativas de layout no meio do processo.

## Conclusão

O Simulador Avançado é intencionalmente rápido e conservador. Use-o para triagem, comparação de superfícies e memorial preliminar. Para projetos executivos ou obras acima de 75 kWp, combine com análise 3D. E lembre-se: sem a validação elétrica com a [Calculadora de Inversor / String Sizing](/energia-solar/calculadora-inversor), a estimativa de produção é apenas metade da história.
