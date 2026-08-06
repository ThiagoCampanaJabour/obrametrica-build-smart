---
title: "Metodologia — Perdas e eficiência de sistemas fotovoltaicos"
description: "Fórmulas, ordem de aplicação, valores default e referências usados na Calculadora de Perdas / Eficiência da ObraMétrica."
---

## Escopo e premissas

A calculadora estima, em base anual e determinística, a razão entre a energia entregue no ponto
de conexão AC e a energia teórica disponível no lado DC. Não se trata de simulação horária: não
há modelagem 3D de sombra, séries temporais de irradiância nem curva de eficiência do inversor
em função da carga. O objetivo é fornecer um *performance ratio* auditável, com premissas
explícitas, adequado a pré-dimensionamento e propostas comerciais.

A energia teórica DC (`E₀`, kWh/ano) é uma **entrada**. Pode vir do simulador de radiação do
site, de PVGIS/NSRDB ou do produto `P_DC (kWp) × HSP (h/dia) × 365`.

## Ordem de aplicação

As perdas são multiplicativas e aplicadas na ordem física do fluxo de energia:

```
E_final = E₀ × (1−f_temp) × (1−f_sombra) × (1−f_soil) × (1−f_mismatch)
             × (1−f_cabo) × η_inv × (1−f_clip) × (1−f_AC) × (1−f_margem)
```

A ordem importa: aplicar as perdas em cascata (em vez de somar percentuais) evita superestimar
o total. Cada item do relatório é convertido para percentual **da energia teórica** (`perda_i /
E₀`), de modo que a soma dos itens seja exatamente igual à perda total do sistema.

## Temperatura

Temperatura de célula pelo modelo NOCT:

```
T_cel = T_amb + (NOCT − 20) × G / 800
```

com `G` = irradiância média de operação (default 800 W/m²) e NOCT default de 45 °C. A perda é:

```
f_temp = |coef_térmico (%/°C)| × max(0, T_cel − 25)
```

Coeficiente térmico de potência típico: −0,30 a −0,40 %/°C para silício cristalino
(faixa completa −0,20 a −0,50 %/°C). Quando `T_cel < 25 °C` a perda é considerada nula — o ganho
de baixa temperatura é deliberadamente ignorado por conservadorismo.

## Sombreamento

`f_sombra` é uma entrada percentual. Sombreamento parcial em uma string pode causar perdas
desproporcionais ao percentual de área sombreada, por efeito dos diodos de bypass e do ponto de
operação da string. Para sombreamentos acima de 10% a ferramenta emite aviso e recomenda análise
horária dedicada ou uso de otimizadores/microinversores.

## Sujidade (soiling)

`f_soil` é a perda média anual por acúmulo de poeira e resíduos. Defaults: 2% em ambiente urbano
com chuvas regulares, 4% em ambiente rural ou industrial, 8–10% em regiões áridas ou com poeira
intensa e sem limpeza periódica.

## Mismatch

`f_mismatch` cobre a dispersão de parâmetros entre módulos da mesma string (tolerância de
fabricação, envelhecimento diferencial, sujeira desigual). Valores típicos: 1–2% para strings de
10 a 20 módulos com módulos do mesmo lote; até 3% em arranjos heterogêneos.

## Cabeamento DC

Dois modos:

1. **Percentual** — entrada direta (default 1,5%; faixa usual 0,5–3%).
2. **Resistivo** — `P = I²R` (W) e `E_perdida = P × h_eq / 1000` (kWh), onde `R` é a resistência
   total do circuito DC e `h_eq` as horas equivalentes anuais a plena carga. Esse modo é mais
   preciso quando o comprimento de cabo e a seção são conhecidos.

## Inversor e clipping

A eficiência europeia/CEC do inversor (`η_inv`, default 97%; faixa 96–98%) é aplicada
diretamente. Em seguida, o clipping é estimado a partir da relação DC/AC:

| DC/AC | Clipping estimado |
|---|---|
| ≤ 1,10 | 0% |
| 1,10–1,20 | 0,5% |
| 1,20–1,30 | 1,5% |
| 1,30–1,40 | 3% |
| 1,40–1,60 | 5% |
| > 1,60 | 8% |

Essa tabela é uma heurística: o clipping real depende da distribuição horária de irradiância e
da temperatura. Em climas com irradiância de pico elevada, os valores podem ser maiores.
O clipping também pode ser informado manualmente.

## Perdas AC / BOS e margem

`f_AC` (default 1%; faixa 1–2%) cobre fiação AC, quadros, proteções e eventual transformador.
`f_margem` (default 2%) reserva espaço para indisponibilidade, erros de medição e perdas não
mapeadas.

## Degradação

Projeção linear composta a partir do ano 1:

```
E_ano_n = E_final × (1 − d)^(n−1)
```

com `d` default de 0,5% ao ano (faixa 0,3–0,8%). Módulos com garantia de performance costumam
declarar 0,45–0,55% ao ano após o primeiro ano, cujo *light-induced degradation* é maior.

## Eficiência global

```
η_sistema = E_final / E₀
```

Valores plausíveis para instalações bem executadas ficam entre 75% e 85%. Resultados abaixo de
65% indicam premissas pessimistas ou problemas reais de projeto — a ferramenta emite aviso.

## Incertezas e limites

A incerteza combinada típica desta estimativa é de ±5 a ±10 pontos percentuais sobre a energia
final, dominada pela incerteza da energia teórica de entrada e pelo sombreamento. Para contratos
de performance, financiamento de projeto ou usinas acima de algumas centenas de kWp, use
modelagem horária (PVsyst, SAM) com dados meteorológicos locais e levantamento 3D de sombras.

## Referências

- IEC 61724-1 — *Photovoltaic system performance monitoring*.
- NREL — *System Advisor Model (SAM)*, documentação de perdas do modelo PVWatts.
- Atlas Brasileiro de Energia Solar (INPE/CEPEL), 2ª edição.
- ABNT NBR 16274 — Sistemas fotovoltaicos conectados à rede: requisitos mínimos de documentação
  e verificação de desempenho.
- Datasheets de fabricantes para coeficiente térmico, NOCT e eficiência de inversores.
