---
title: "Como calcular kWp → kWh: Guia prático com exemplos"
description: "Aprenda a transformar potência instalada (kWp) em produção anual (kWh) com fórmulas, presets por cidade, exemplos e dicas práticas para projetistas."
tags: ["energia solar","kwp","kwh","produção solar","calculadora"]
author: "Thiago O. M."
date: "2026-08-10"
last_reviewed: "2026-08-10"
reading_time: "8 min"
canonical: "https://obrametrica.com.br/blog/como-calcular-kwp-kwh"
og_image: "/assets/images/kwp-kwh-cover.webp"
---

# Como calcular kWp → kWh: Guia prático com exemplos

## Introdução
A relação entre kWp (potência instalada) e kWh (energia produzida em um ano) é essencial para estimar produção, economia e dimensionar sistemas fotovoltaicos. Este guia apresenta a fórmula básica, ajustes por perdas, presets regionais e exemplos passo a passo para uso prático.

## O que é kWp e o que é kWh
- **kWp (quilowatt-pico)** — potência nominal do conjunto em condições padrão (STC).
- **kWh (quilowatt-hora)** — unidade de energia; representa quanto é gerado/consumido ao longo do tempo.

## Fórmula básica
**Energia anual (kWh) = Potência instalada (kWp) × Fator específico (kWh/kWp/ano) × PR**

- **Fator específico (kWh/kWp/ano)**: horas equivalentes de sol × performance ratio (PR) ou valor regional médio.
- **PR (Performance Ratio)**: 1 − perdas_frac (ex.: perdas sistêmicas típicas 14% → PR = 0.86).

## Exemplo 1 — kWp → kWh (cálculo direto)
- **Potência**: 5 kWp
- **Local**: São Paulo — fator típico 1500 kWh/kWp/ano
- **Perdas sistêmicas**: 14% → PR = 0.86
- **Cálculo**: 5 × 1500 × 0.86 = 6.450 kWh/ano

## Exemplo 2 — kWh → kWp (cálculo inverso)
- **Meta**: 9.000 kWh/ano
- **Local**: Fortaleza — fator 1850 kWh/kWp/ano
- **Perdas**: 14% → PR = 0.86
- **Potência requerida**: 9.000 / (1850 × 0.86) ≈ 5,67 kWp → sugerir 6,0 kWp (arredondar para módulos comerciais)

## Ajustes por tilt e orientação
Se o usuário fornece tilt/azimute, aplicar correções heurísticas: Desvio de tilt ±10° pode gerar variação aproximada de −3% a +3% no fator, dependendo da latitude.

## Performance Ratio e perdas comuns
Perdas típicas (exemplos):
- **Temperatura**: −0,2 a −0,5 %/°C
- **Inversor**: 1–3 %
- **Cabos**: 1–2 %
- **Soiling**: 1–3 %
- **Mismatch**: 0.5–2 %

Some as perdas e calcule PR = 1 − Σ(perdas)

## Dicas práticas
1. Use presets validados (PVGIS, bancos de dados locais) para fatores regionais.
2. Adicione 2–5% de módulos de reserva.
3. Para propostas, apresente intervalos de produção (pessimista / provável / otimista).

## Referências e leituras adicionais
- PVGIS — https://ec.europa.eu/jrc/en/pvgis
- ANEEL
- PVSyst

**Ferramentas relacionadas no ObraMétrica:**
- [Conversor kW ↔ kWh](/energia-solar/conversor-kw-kwh)
- [Calculadora de Perdas / Eficiência (PV)](/energia-solar/calculadora-perdas-eficiencia)
- [Estimador de Custo Total (TCO)](/energia-solar/estimador-custo-total)
