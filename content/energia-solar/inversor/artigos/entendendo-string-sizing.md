---
title: Entendendo String Sizing em sistemas fotovoltaicos
description: Voc, Vmp, coeficientes de temperatura e safety factors — o que você precisa saber antes de escolher quantos módulos ligar em cada string.
---

# Entendendo String Sizing

O **string sizing** — decidir quantos módulos ligar em série em cada string e quantas strings colocar em paralelo em cada MPPT do inversor — é uma das etapas mais críticas do projeto fotovoltaico. Um dimensionamento incorreto pode desligar o inversor no frio, reduzir a produção anual em condições parciais de sombra ou, no pior caso, danificar o equipamento por sobretensão.

Neste artigo você vai entender os parâmetros elétricos envolvidos, por que a temperatura é tão importante e como usar a [Calculadora de Inversor / String Sizing](/energia-solar/calculadora-inversor) do ObraMétrica para validar suas configurações.

## Vmp, Voc e o que cada um significa

Cada módulo fotovoltaico tem dois pontos de operação a conhecer:

- **Vmp (voltage at maximum power)** é a tensão no ponto de máxima potência — a tensão de trabalho quando o inversor está extraindo o máximo do arranjo. Em módulos de 550 Wp modernos gira em torno de 40–42 V.
- **Voc (open-circuit voltage)** é a tensão quando o circuito está aberto (sem corrente circulando). É sempre maior que Vmp — normalmente 15–20 % acima.

Em uma **string** (módulos em série), as tensões se somam. Se o módulo tem Voc 49,9 V, 10 módulos em série produzem uma string com Voc 499 V em STC (25 °C).

## Por que o coeficiente de temperatura de Voc importa

Aqui está a parte que muitos projetos ignoram: **Voc aumenta quando o módulo esfria**. Isso acontece porque a tensão de bandgap dos semicondutores é inversamente proporcional à temperatura.

O coeficiente típico de Voc é **−0,27 %/°C**. O sinal é negativo porque a variação percentual em Voc é negativa quando a temperatura sobe — mas quando ela cai (ΔT negativo), o resultado inverte e Voc sobe.

Fórmula usada pela calculadora:

```
Voc_corr = Voc_string × (1 + coef × (T_min − 25))
```

**Exemplo prático**: em uma cidade da região Sul do Brasil onde a temperatura mínima histórica é −5 °C, ΔT = −30 °C. Para um módulo com coef = −0,27 %/°C: fator = 1 + (−0,0027 × −30) = 1,081. Uma string com Voc STC de 800 V teria **Voc corrigido ≈ 865 V**. Se o inversor tem Voc máx de 1000 V, ainda está dentro da faixa. Se tivesse 900 V, estaria comprometido.

## Safety factor e por que aplicá-lo

Além da correção térmica, aplicamos um **safety factor** (fator de segurança) sobre o Voc máximo do inversor. O padrão é **0,95**: só aceitamos configurações cuja Voc_corr fique abaixo de 95 % do limite do inversor. Isso reserva margem para:

- Variações da temperatura mínima acima do histórico (eventos extremos).
- Tolerâncias de fabricação nos módulos (±3 %).
- Envelhecimento do inversor.

Alguns fabricantes especificam margens próprias na datasheet — sempre consulte antes de assumir 0,95.

## Faixa MPPT: o Vmp precisa estar dentro

Além do Voc, verifique se a **Vmp da string** cai dentro da faixa MPPT do inversor. Se o Vmp for muito baixo (poucos módulos), o inversor não consegue rastrear o ponto de máxima potência e a produção despenca nos horários de sol pleno (quando a temperatura sobe e Vmp cai ainda mais). Se for muito alto, mesmo cenário — o rastreador satura.

A calculadora do ObraMétrica sinaliza automaticamente configurações fora da faixa MPPT com status **AVISO** ou **ERRO**.

## Relação DC/AC (inverter sizing ratio)

A relação entre a potência DC instalada e a potência AC nominal do inversor é chamada **DC/AC ratio**. Um sistema de 6,6 kWp num inversor de 5 kW tem DC/AC = 1,32.

- **1,15–1,30**: faixa típica no Brasil. Maximiza produção anual sem clipping excessivo.
- **1,30–1,40**: aceitável em regiões de alta irradiância, com clipping ocasional em picos de meio-dia.
- **>1,40**: clipping frequente, considerar inversor maior.
- **<1,05**: inversor subutilizado, custo desnecessário.

A calculadora exibe a relação DC/AC da melhor configuração e alerta quando sai da faixa recomendada.

## Exemplo prático de dimensionamento

Situação: 12 módulos de 550 Wp (Vmp 41,8; Voc 49,9), inversor 5 kW 1000 V, MPPT 150–850 V, T_min esperada 5 °C.

Testando **6 módulos por string × 2 strings**:

- Vmp_sum = 41,8 × 6 = **250,8 V** ✓ (dentro de 150–850 V)
- Voc_sum = 49,9 × 6 = **299,4 V**
- Voc_corr = 299,4 × (1 + (−0,0026 × −20)) = 299,4 × 1,052 ≈ **315 V** ✓ (< 950 V)
- Potência DC = 550 × 12 = 6600 W → DC/AC = **1,32** ✓
- **Status: OK**

Alternativa **12 módulos × 1 string**:

- Vmp_sum = 501,6 V ✓
- Voc_corr ≈ 630 V ✓
- Mesma potência DC, mas usa apenas 1 MPPT — perde a resiliência a sombreamento parcial.

A calculadora exibirá ambas as opções e destaca a de maior potência aproveitada; a escolha final considera o padrão de sombra do telhado.

## Checklist pré-instalação

Antes de fechar o projeto executivo:

1. Confirmou a temperatura mínima histórica do local? (INMET, últimos 10 anos)
2. Coeficiente de temperatura Voc está na datasheet do módulo?
3. Voc_corr ≤ 95 % do Voc máx do inversor?
4. Vmp_sum dentro da faixa MPPT em condições normais e no verão (Vmp cai ~0,3 %/°C)?
5. Isc do módulo ≤ corrente máxima por MPPT?
6. DC/AC entre 1,15 e 1,35?
7. Cabos DC dimensionados para queda de tensão < 2 %?

## Conclusão

String sizing não é um cálculo opcional — é a base do dimensionamento seguro. Use a [Calculadora de Inversor / String Sizing](/energia-solar/calculadora-inversor) para iterar rapidamente entre configurações e leve o CSV/JSON exportado ao seu integrador ou memorial técnico. Combine com o [Simulador Avançado](/simulador-solar-avancado) para validar a produção anual e a [Calculadora de Payback](/energia-solar/calculadora-payback) para o retorno financeiro.

Sempre valide o projeto executivo com um engenheiro eletricista responsável e siga as normas ABNT NBR 16690 e IEC 62548.
