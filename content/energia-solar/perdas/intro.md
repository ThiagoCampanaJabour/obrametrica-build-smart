---
title: "Calculadora de Perdas e Eficiência Fotovoltaica"
description: "Estime perdas por temperatura, sombreamento, sujidade, mismatch, cabos, inversor e clipping e obtenha a eficiência global do sistema PV."
---

Entre a geração teórica de um arranjo fotovoltaico e a energia efetivamente injetada na rede
existe uma cadeia de perdas que raramente é explicitada nas propostas comerciais. Esta
calculadora torna essa diferença visível: você informa a energia teórica DC anual — obtida na
simulação por localização ou no somatório de Pmp × horas equivalentes — e a ferramenta aplica,
em cascata, cada perda típica do sistema.

São considerados oito grupos: temperatura de operação (modelo NOCT com coeficiente térmico do
módulo), sombreamento, sujidade, mismatch entre módulos, cabeamento DC (percentual ou cálculo
por I²R), eficiência do inversor, clipping estimado pela relação DC/AC e perdas AC/balance of
system, além de uma margem para perdas não previstas.

O resultado é um relatório técnico com a perda de cada item em percentual e em kWh/ano, a
energia final AC, a eficiência global do sistema e a projeção de produção com degradação anual.
Todos os dados podem ser exportados em CSV ou JSON para anexar à proposta.
