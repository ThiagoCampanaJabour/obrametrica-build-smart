---
title: Como funciona o Simulador Avançado de Energia Solar
description: Entenda passo a passo como o simulador estima produção e sugere configurações de strings.
---

# Como funciona o Simulador Avançado

O Simulador Avançado combina três blocos de cálculo em uma única interface: (1) dimensionamento pela área, (2) estimativa de perdas por orientação e sombreamento, e (3) otimização de strings. Este artigo explica, sem entrar no código, o que acontece a cada clique em **Simular**.

## 1. Dimensionamento pela área

Você informa comprimento e largura da superfície (telhado, laje, pergolado). O simulador calcula a área bruta e divide pela área de cada módulo, retornando o número máximo de painéis que fisicamente cabem. Presets já trazem largura, altura e potência típicas de módulos monocristalinos (450 W a 550 W) e policristalinos (330 W).

Dica: se você precisar reservar corredores técnicos ou distância de bordas, subtraia esses metros da área antes de informar — o simulador não faz esse desconto automaticamente.

## 2. Orientação e sombreamento

Dois campos alimentam o modelo de perdas:

- **Inclinação** (tilt): ângulo entre o módulo e o plano horizontal. O ideal, no Brasil, gira em torno da latitude local.
- **Azimute**: direção para onde o módulo aponta. No Hemisfério Sul, azimute 0° = Norte geográfico é o alvo ideal.

O simulador calcula um único indicador de "desvio" (`diff`) e aplica faixas de perda: quanto maior o desvio, maior a perda estimada. Não é uma análise 3D — é uma heurística útil para pré-projeto. Se você tem uma medição de sombra em campo (ex.: com Solar Pathfinder), pode ajustar o slider de sombreamento máximo para casar com o valor observado.

## 3. Produção anual

Multiplicamos a potência total (em kWp) por 365 dias, pela irradiância média diária (padrão 5,0 kWh/m²/dia — coerente com boa parte do Brasil) e pelo Performance Ratio de 0,78, que engloba perdas por temperatura, inversor, cabeamento e sujeira. O resultado final é reduzido pelo percentual de sombreamento.

## 4. Otimização de strings

Aqui está o diferencial. O simulador não escolhe uma única forma de agrupar os módulos: ele varre todas as configurações possíveis (de 2 a 20 módulos por string), calcula quantas strings inteiras cabem, aplica uma penalidade progressiva a strings muito longas — que sofrem mais com mismatch — e ordena as cinco melhores por produção anual estimada.

Você recebe uma tabela com módulos por string, potência total daquela configuração, perda estimada e produção anual, além de um mini gráfico de barras para comparação visual. Exporte tudo em JSON ou CSV para incorporar ao seu memorial de cálculo.

## 5. Limites e boas práticas

O simulador é intencionalmente conservador. Para projetos executivos, valide com PVsyst, Helioscope ou dados PVGIS. Para orçamentos comerciais e estudos de viabilidade, ele oferece agilidade suficiente para comparar rapidamente três ou quatro superfícies candidatas.
