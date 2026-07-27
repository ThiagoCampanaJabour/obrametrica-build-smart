---
title: Metodologia — Simulador Avançado Solar
description: Fórmulas, suposições e heurísticas de sombreamento e otimização de strings.
---

# Metodologia

Este documento descreve as fórmulas, suposições e limites usados pelo Simulador Avançado. O objetivo é ser transparente: o usuário deve compreender por que cada número aparece e onde estão as fronteiras de precisão.

## 1. Área utilizável e número de módulos

A área utilizável é `L × W` (ou o valor direto informado em m²). Cada módulo ocupa `largura × altura` (m²). O número de módulos é obtido por:

```
areaModulo = largura × altura
numModulos = floor(areaUtil / areaModulo)
```

Não descontamos, por padrão, corredores técnicos e espaçamentos — em projetos reais, aplique um fator de 0,8 a 0,9 sobre a área bruta.

## 2. Produção anual estimada

A produção é dada por:

```
producAnual = (kWp) × irradiancia × 365 × PR × (1 − perda%)
```

Onde:
- **kWp** = potência total instalada dividida por 1000.
- **irradiancia** = média diária em kWh/m²/dia. Default: 5,0 (média Brasil). Valores típicos: 4,2 (Sul) a 6,0 (Nordeste).
- **PR** (Performance Ratio) = 0,78 por padrão, valor conservador que engloba perdas por temperatura, cabeamento, inversor e sujeira.
- **perda%** = perda por sombreamento estimada.

## 3. Heurística de sombreamento

O simulador combina o desvio de inclinação e azimute em relação ao ótimo local (default: tilt = 20°, azimute = Norte geográfico) em um único indicador de diferença angular:

```
diff = sqrt((tilt − tiltÓtimo)² + (azimute − azimuteÓtimo)²) / 2
```

Aplicamos então faixas empíricas:
- `diff < 15°` → perda ≈ 1,5%
- `15° ≤ diff < 45°` → perda ≈ 5,5%
- `diff ≥ 45°` → perda ≈ 14%

O usuário pode sobrescrever esse valor com um percentual manual (`perdaOverridePct`) e definir o sombreamento aceitável máximo. As faixas foram calibradas para orientações típicas de telhados brasileiros e não substituem uma análise de sombra horária com ferramentas como PVsyst ou Helioscope.

## 4. Otimização de strings

Para cada tamanho possível de string entre `min` (default 2) e `max` (default 20), o simulador:

1. Calcula quantas strings completas cabem no total de módulos.
2. Aplica uma penalidade linear para strings maiores que 8 módulos (`+0,4% por módulo adicional`), simulando o efeito de mismatch por sombreamento parcial.
3. Estima a produção anual daquela configuração.
4. Retorna as 5 melhores configurações ordenadas por produção.

O objetivo é fornecer alternativas comparáveis, não a topologia definitiva do projeto — a decisão final depende das faixas de MPPT do inversor escolhido.

## 5. Suposições e limites

- Irradiância é um valor fixo e não considera variação sazonal, altitude, poluição atmosférica ou nebulosidade local.
- Não há modelagem térmica: o PR de 0,78 inclui perda média por temperatura.
- Sombreamento é agregado — não há posicionamento 3D de obstáculos.
- Módulos são considerados idênticos e coplanares.
- Perdas de cabeamento CC/CA e inversor estão embutidas no PR.

## 6. Quando confiar e quando validar

Confie no simulador para: pré-dimensionamento comercial, ordem de grandeza de investimentos, comparação rápida entre superfícies candidatas.

Valide com ferramentas dedicadas quando: (a) o projeto envolver contrato de performance, (b) houver sombreamento complexo (edifícios vizinhos, chaminés), (c) o cliente exigir garantia de produção anual em kWh.

## 7. Roadmap

Integração futura com API de irradiância (PVGIS/NASA POWER) para refinar a produção por latitude/longitude. Marcada como `TODO` no código-fonte de `src/lib/simulador-avancado/calc.ts`.
