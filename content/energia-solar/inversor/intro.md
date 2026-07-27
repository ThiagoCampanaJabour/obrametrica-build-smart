---
title: Calculadora de Inversor e String Sizing
description: Dimensione strings fotovoltaicas para inversores com correção de Voc pela temperatura mínima e validação da faixa MPPT.
---

# Calculadora de Inversor · String Sizing

Esta ferramenta ajuda projetistas e integradores a decidir **quantos módulos por string** conectar em cada MPPT do inversor. A partir dos dados do módulo (Vmp, Voc, coeficiente de temperatura) e do inversor (Voc máx, faixa MPPT, número de MPPT), calculamos:

- Vmp total da string e Voc total em condições padrão (STC);
- Voc corrigido pela temperatura mínima esperada no local (Voc frio);
- Enquadramento na faixa MPPT do inversor;
- Relação DC/AC e alertas de compatibilidade.

Use os presets de módulos e inversores como ponto de partida — todos os valores são editáveis. Para memoriais técnicos, exporte a configuração escolhida em JSON ou CSV. Consulte a [metodologia](/energia-solar/inversor) para as fórmulas usadas e o [artigo completo](/energia-solar/inversor) para exemplos práticos de dimensionamento.
