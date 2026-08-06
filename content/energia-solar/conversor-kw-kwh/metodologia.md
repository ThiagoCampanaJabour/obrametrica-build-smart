---
title: "Metodologia — Conversor kW ↔ kWh"
updated: "2026-08-06"
---

# Metodologia

## Grandezas envolvidas

**kWp (quilowatt-pico)** é a potência nominal do conjunto de módulos medida em condições padrão de teste (STC: 1000 W/m², 25 °C de célula, AM 1,5). É uma capacidade instantânea de laboratório, não uma promessa de produção.

**kWh (quilowatt-hora)** é energia: a integral da potência entregue ao longo do tempo. Um sistema de 5 kWp nunca gera 5 kW continuamente — gera menos, durante um número limitado de horas úteis por dia.

**Fator de produção** ou *specific yield*, em kWh/kWp/ano, é o número que liga as duas grandezas. Ele já incorpora a irradiação local, a inclinação, a orientação e o comportamento térmico médio do arranjo.

## Fórmula principal

```text
Energia_ano [kWh] = Potência [kWp] × Fator [kWh/kWp/ano] × (1 − perdas)
```

E o caminho inverso:

```text
Potência [kWp] = Energia_ano [kWh] ÷ (Fator × (1 − perdas))
```

O termo `(1 − perdas)` é o Performance Ratio (PR). Perdas de 14% equivalem a PR = 0,86.

## Relação com horas equivalentes de sol

Quando não há um fator medido disponível, ele pode ser derivado das horas equivalentes de sol a pleno sol (HE), que representam quantas horas por ano o local receberia 1000 W/m²:

```text
Fator ≈ HE [h/ano] × PR
```

Exemplo: HE = 1.700 h/ano e PR = 0,78 resultam em aproximadamente 1.326 kWh/kWp/ano.

Atenção à dupla contagem: se o fator escolhido já foi medido em uma usina em operação, ele já contém as perdas reais. Nesse caso, aplicar novamente um desconto de 14% subestima a geração. Use perdas separadas apenas quando o fator representar o potencial bruto do local.

## Performance Ratio e composição das perdas

O PR agrega perdas de naturezas distintas:

| Origem | Faixa típica |
| --- | --- |
| Temperatura de operação | 5% a 10% |
| Inversor (conversão DC/AC) | 2% a 4% |
| Sujidade (soiling) | 2% a 6% |
| Mismatch entre módulos | 1% a 3% |
| Cabeamento DC e AC | 1% a 3% |
| Sombreamento e indisponibilidade | 0% a 5% |

Três cenários de referência são oferecidos na ferramenta:

- **Conservador** — PR 0,75 (perdas de 25%): sombreamento parcial, poeira intensa, manutenção irregular.
- **Padrão** — PR 0,86 (perdas de 14%): instalação bem executada, limpeza periódica, sem obstruções relevantes.
- **Otimista** — PR 0,90 (perdas de 10%): usina nova, bem ventilada, monitorada, com limpeza frequente.

## Ajuste por inclinação e orientação

A correção aplicada é heurística e de primeira ordem, adequada apenas para pré-dimensionamento:

1. A inclinação ótima é aproximada pela latitude do local, limitada entre 10° e 35°.
2. O desvio em relação a essa inclinação gera uma penalidade quadrática suave, limitada a 25%.
3. O desvio de azimute em relação ao Norte geográfico (ótimo no Hemisfério Sul) gera uma penalidade proporcional, limitada a 35%.
4. O peso do azimute cresce com a inclinação: em telhado plano, a orientação é praticamente irrelevante.

Para precisão real, é necessária simulação horária com séries climáticas (PVGIS, Meteonorm, INPE/LABREN).

## Caminho alternativo por irradiância e área

Quando a irradiância no plano dos módulos é conhecida:

```text
Energia ≈ Irradiância [kWh/m²/ano] × Área do módulo [m²] × Eficiência × Nº de módulos × PR
```

## Dimensionamento por módulos

No modo inverso, a quantidade de módulos é obtida arredondando para cima a razão entre a potência requerida em watts e a potência unitária do módulo, aplicando em seguida a margem de reserva (padrão de 3%) e arredondando novamente para cima. A potência realmente instalada é sempre maior ou igual à requerida.

## Sensibilidade

O resultado central é acompanhado de dois cenários: ±10% no fator de produção combinados com ±5 pontos percentuais nas perdas. Essa faixa cobre boa parte da incerteza inerente a estimativas anuais e deve ser apresentada ao cliente junto com o número central.

## Limitações declaradas

- Base anual, sem distribuição mensal nem sazonalidade.
- Não modela sombreamento geométrico, degradação ao longo dos anos nem clipping do inversor.
- Presets de fator são valores médios de mercado e devem ser confrontados com dados locais antes de compor uma proposta formal.
- Não substitui projeto executivo assinado por profissional habilitado.
