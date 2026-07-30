---
title: "Metodologia — perdas térmicas e dimensionamento de HVAC"
description: "Fórmulas, presets e suposições usadas no cálculo de carga térmica e na seleção de capacidade de ar-condicionado."
---

# Metodologia

## 1. Escopo e limites

A ferramenta realiza um cálculo de carga térmica de **regime permanente**, em
condição de projeto de verão (resfriamento). Não há simulação horária, não se
considera inércia térmica das massas construtivas, nem transferência entre
ambientes internos com temperaturas distintas. O objetivo é um
pré-dimensionamento rápido e auditável, com incerteza de ±10% a ±20% conforme a
qualidade dos dados informados. Para projeto executivo, aplique a
**ABNT NBR 16401** e métodos detalhados (por exemplo, RTS/CLTD da ASHRAE), com
validação por engenheiro ou instalador habilitado.

## 2. Diferença de temperatura de projeto

```
ΔT = T_ext_projeto − T_int_desejada
```

`T_ext_projeto` vem dos presets climáticos por cidade (temperatura de bulbo seco
típica de verão) e é totalmente editável. `T_int_desejada` costuma ficar entre
23 °C e 25 °C para conforto. Se ΔT ≤ 0, a ferramenta emite alerta: não há carga
de resfriamento a calcular naquela condição.

## 3. Transmissão pela envoltória

Para cada componente opaco ou transparente:

```
Q_trans_i (W) = U_i (W/m²·K) × A_i (m²) × ΔT (K)
```

A geometria é aproximada considerando o ambiente quadrado: o lado é `√área` e a
área de parede exposta é `lado × pé-direito × nº de fachadas externas`. A área de
janelas informada é descontada da área de parede e recebe o U-value de vidro. A
cobertura só entra no cálculo quando marcada como exposta (último pavimento).

Presets de U-value (W/m²·K):

| Envoltória | Parede | Cobertura | Piso | Janela |
| --- | --- | --- | --- | --- |
| Boa (isolada, laje com forro) | 1,4 | 1,0 | 1,2 | 3,0 |
| Média (alvenaria comum) | 2,4 | 1,9 | 1,8 | 5,0 |
| Ruim (telha sem forro, vidro simples) | 3,2 | 2,6 | 2,2 | 5,8 |

## 4. Ganho solar pelas janelas

```
Q_solar (W) = A_vidro × SHGC × I_rel × I_pico × 1000
```

`I_pico` é a irradiância de referência adotada, **0,63 kW/m²**, e `I_rel` é um
fator relativo de insolação por orientação (hemisfério sul), reduzido pelo
percentual de sombreamento:

| Orientação | N | NE | L | SE | S | SO | O | NO |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Fator | 0,90 | 0,70 | 0,75 | 0,50 | 0,30 | 0,70 | 1,00 | 0,90 |

SHGC típicos: vidro simples 0,85; laminado/verde 0,70; duplo 0,55; refletivo/low-e
0,35. Fachadas oeste e norte concentram os maiores ganhos no fim da tarde — é
onde brises, películas e persianas trazem mais retorno.

## 5. Cargas internas

```
Q_pessoas (W) = n_ocupantes × q_pessoa_sensível
Q_equip   (W) = potência total informada  (ou W/m² do preset × área)
```

Presets por uso: residencial 100 W/pessoa e 10 W/m²; comercial 110 W/pessoa e
20 W/m²; loja 120 W/pessoa e 25 W/m². Esses valores são editáveis e devem ser
ajustados quando houver equipamentos específicos (servidores, cozinha, vitrines).

## 6. Ventilação e infiltração

A vazão adotada é a maior entre o critério por pessoa e o critério por
renovações de ar por hora:

```
V̇ (L/s) = máx( n_pessoas × L/s·pessoa ; volume(m³) × ACH × 1000 / 3600 )
Q_vent (W) = 0,33 × V̇ (L/s) × ΔT (°C)
```

O coeficiente 0,33 corresponde a ρ·cp do ar em unidades práticas. Padrões: 8 L/s
por pessoa e 1,5 ACH em residências; 10 L/s e 5 ACH em escritórios; 12 L/s e
6 ACH em lojas.

## 7. Carga latente

A parcela latente é estimada de forma simplificada a partir dos ocupantes
(≈50 W latentes por pessoa) e da vazão de ar externo. Serve como indicativo da
importância da desumidificação; ambientes com alta ocupação ou grande renovação
exigem cálculo psicrométrico dedicado.

## 8. Margem e seleção de equipamento

```
Q_total_sensível (kW) = ΣQ / 1000
Q_com_margem (kW)     = Q_total_sensível × (1 + margem)
BTU/h                 = kW × 3412,14
```

A margem padrão é de 15% (faixa recomendada de 10% a 20%). A capacidade sugerida
é a menor da lista comercial (7.000, 9.000, 12.000, 18.000, 22.000, 24.000,
30.000, 36.000, 48.000, 60.000 BTU/h) que atenda à carga com margem. Acima do
maior valor, a ferramenta sugere múltiplas máquinas ou sistema VRF.

O consumo estimado usa:

```
kWh/mês = (Q_com_margem / COP) × horas/dia × dias/mês
```

## 9. Boas práticas de aplicação

Superdimensionar prejudica: o equipamento liga e desliga com frequência, desumidifica
mal e desperdiça energia. Prefira zonear ambientes com orientação e uso
semelhantes em um mesmo circuito e trate separadamente ambientes com carga
atípica. Sempre confirme os presets climáticos com dados locais e revise as
premissas com o instalador antes da compra.

> **Aviso:** estimativa preliminar. Não substitui projeto HVAC/ar-condicionado.
> Consulte engenheiro/instalador para dimensionamento final, seleção de
> equipamentos, tubulações e critérios de conforto.
