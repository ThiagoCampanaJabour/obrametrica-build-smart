---
title: Metodologia — Calculadora de Bateria Solar
description: Fórmulas, suposições e presets utilizados no dimensionamento do banco de baterias.
---

# Metodologia

Esta calculadora aplica um conjunto de fórmulas determinísticas para estimar o dimensionamento
e o fluxo de custos de um banco de baterias fotovoltaico. O objetivo é oferecer um ponto de
partida técnico para pré-projetos; a validação final deve ser feita por engenheiro habilitado.

## Fórmulas principais

1. **Energia útil por ciclo**
   `energiaUtil = consumoDiario × autonomia × fatorSeguranca`

2. **Capacidade útil (kWh)** — descontando a eficiência round-trip
   `capacidadeUtil = energiaUtil / eficiencia`

3. **Capacidade nominal (kWh)** — descontando o DoD utilizável
   `capacidadeNominal = capacidadeUtil / DoD`

4. **Número de unidades**
   `numUnidades = ceil(capacidadeNominal / capacidadeUnitaria)`

5. **Custo inicial**
   `custoInicial = numUnidades × custoUnitario`

6. **Degradação anual**
   `capacidade(n) = capacidadeInstalada × (1 − degradacao)^n`

7. **Vida útil por ciclos**
   `vidaAnos = vidaCiclos / ciclosPorAno`

8. **VPL de substituições** — cada troca é descontada por `(1 + r)^n`

## Regras de substituição

O modelo troca todo o banco quando ocorre uma das duas condições:

- **Ciclos consumidos**: `anosDesdeInstalacao >= vidaAnos`.
- **Capacidade < 70%** da instalada — limite conservador comum em fichas técnicas.

Após a substituição, a capacidade volta ao valor original e a contagem de anos reinicia.

## Presets e valores típicos

| Tecnologia         | DoD   | Efic. | Degradação/a | Ciclos | Custo unit. |
|--------------------|-------|-------|--------------|--------|-------------|
| LFP 5/10 kWh       | 80%   | 92%   | 0,7%         | 6.000  | R$ 2.200–2.400/kWh |
| Li-ion NMC 5 kWh   | 85%   | 90%   | 1,0%         | 4.000  | R$ 2.200/kWh |
| Chumbo-ácido VRLA  | 50%   | 80%   | 3,0%         | 1.200  | R$ 900/kWh |

Faixas informadas conforme literatura técnica (IEA, IEC 62620, catálogos de fornecedores no
Brasil, 2024–2026). Ajuste conforme a oferta local e o câmbio.

## Suposições e limitações

- Consumo diário é considerado **constante ao longo do horizonte** — não modela sazonalidade
  nem variação diária. Para consumo horário, exporte o CSV e trate externamente.
- Fator de segurança padrão de **1,2** cobre imprecisões de medição e picos.
- **Sem modelagem de temperatura ambiente**: temperaturas fora da faixa (15–30 °C) aceleram a
  degradação real.
- **Sem inversor híbrido/BMS**: perdas do inversor e do gerenciador de bateria devem ser
  incluídas na eficiência informada.
- **Preços em BRL sem imposto/frete** — trate os valores como orçamento base.

## Alertas gerados

O motor emite avisos quando:

- DoD < 60% (perda de utilização);
- Nº de unidades > 8 (considere baterias de maior capacidade);
- Custo por kWh > R$ 3.500 (acima da média de mercado);
- Vida por ciclos < 5 anos.

## Boas práticas complementares

- Consulte a metodologia do [Simulador Avançado](/simulador-solar-avancado) para dimensionar
  a geração fotovoltaica que alimentará o banco.
- Combine com a [Calculadora de Payback](/energia-solar/calculadora-payback) para avaliar
  o VPL do investimento completo.
- Sempre exija do integrador: laudo NBR 16690, datasheet do BMS, garantia de ciclos e plano
  de manutenção preventiva.
