---
title: "Metodologia — Obra Métrica"
description: "Como a Obra Métrica calcula quantitativos de materiais: fórmulas, presets, fontes e limitações."
lastUpdated: "2026-07-27"
author: "Equipe Obra Métrica"
---

# Metodologia

_Última atualização: 27/07/2026 — Equipe Obra Métrica._

## Introdução

A **Obra Métrica** disponibiliza calculadoras de quantitativos para materiais de construção civil. Nosso objetivo é oferecer estimativas rápidas, transparentes e replicáveis, usando fórmulas amplamente adotadas no mercado brasileiro e presets baseados em valores típicos publicados por associações técnicas, fabricantes e literatura de engenharia. Cada calculadora traz a explicação passo a passo da fórmula aplicada; esta página consolida os **princípios gerais** e as **tabelas de referência** utilizadas.

## Princípios de cálculo

1. **Entrada mínima e clara.** Pedimos apenas as medidas essenciais (área, volume, dimensões) para reduzir erros de preenchimento.
2. **Fórmulas determinísticas.** Todas as calculadoras aplicam expressões fechadas (sem estimativas estatísticas), replicáveis a lápis e papel.
3. **Presets editáveis.** Densidades, rendimentos e perdas vêm com valor típico preenchido, mas podem ser ajustados conforme fabricante/região.
4. **Arredondamento para cima.** Quantidades comerciais (sacos, blocos, chapas, barras) são sempre arredondadas para o inteiro superior, evitando falta de material.
5. **Perdas explícitas.** O desperdício é aplicado sobre o resultado bruto e destacado no relatório, permitindo comparação com o consumo real da obra.

## Como usamos os presets

Cada calculadora carrega presets de duas categorias:

- **Físicos** (densidades, pesos lineares, áreas úteis) — provêm de tabelas técnicas consolidadas. Ver [Densidades](/metodologia/tabelas/densidades) e [Consumos de blocos](/metodologia/tabelas/consumos-blocos).
- **Operacionais** (perda, reaproveitamento, traço) — refletem a prática média de obras residenciais. Ver [Coeficientes de perda](/metodologia/tabelas/coeficientes-perda).

O mapeamento entre calculadora e tabela de referência está em [`presets-mapping.json`](/metodologia/presets-mapping.json).

## Limitações

- Os resultados são **estimativas de compra**; o consumo executivo depende de projeto, mão de obra e condições da obra.
- Não substituem o dimensionamento estrutural nem análise do responsável técnico.
- Valores marcados como “valor típico de mercado” devem ser revisados conforme fabricante e região.
- Não consideramos custos, impostos ou fretes.

## Referências

- Associação Brasileira de Normas Técnicas (ABNT) — normas NBR 6118, NBR 12655, NBR 15270, NBR 15696, NBR 7480.
- Manuais técnicos de fabricantes (Votorantim, Gerdau, ArcelorMittal, Eternit, Tégula) — consulte cada fabricante para dimensões e rendimentos exatos.
- Bibliografia recomendada: "TCPO — Tabelas de Composições de Preços para Orçamentos" (Editora Pini) e "Manual de Boas Práticas em Alvenaria" (SindusCon).

Para dúvidas, escreva para [obrametricasite@gmail.com](mailto:obrametricasite@gmail.com).
