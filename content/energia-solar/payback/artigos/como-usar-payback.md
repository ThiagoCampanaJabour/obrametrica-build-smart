---
title: Como usar a Calculadora de Payback Solar
description: Passo a passo para simular payback, VPL e TIR de um sistema fotovoltaico e interpretar os resultados.
---

A Calculadora de Payback e Fluxo de Caixa da ObraMétrica é uma ferramenta
educativa para quem quer entender o retorno financeiro de um sistema
fotovoltaico. Este tutorial mostra como preencher cada campo, escolher um
cenário adequado, interpretar os indicadores e evitar erros comuns na
análise.

## 1. Reúna os dados de entrada

Antes de abrir a calculadora, tenha em mãos:

- **Orçamento do sistema** (equipamentos + instalação + eventuais taxas).
- **Produção anual estimada** em kWh/ano — fornecida pelo integrador ou
  calculada a partir da potência instalada (kWp) e da irradiância local.
- **Tarifa atual** em R$/kWh (bandeira + ICMS incluídos).
- **Custo de O&M** anual — manutenções, limpezas e eventuais seguros.
- **Taxa de desconto** que reflete seu custo de oportunidade (poupança,
  CDI, custo do capital do negócio).

## 2. Escolha o cenário

Os presets **Conservador**, **Padrão** e **Otimista** ajustam produção,
inflação de tarifa, O&M e degradação. Para projetos residenciais em
localidades sem histórico de irradiância, o cenário Conservador tende a
ser mais realista. Para clientes comerciais que consomem 100 % da energia
gerada, o Padrão costuma ser suficiente.

## 3. Rode a simulação

Ao clicar em **Calcular**, a calculadora projeta o fluxo de caixa
ano a ano, aplicando degradação de módulos, inflação de tarifa e
descontando pelo custo de capital escolhido. O painel de resumo mostra:

- **Payback simples**: quantos anos para recuperar o investimento sem
  considerar o valor do dinheiro no tempo.
- **Payback descontado**: mesma métrica, porém considerando a taxa de
  desconto — sempre maior que o simples.
- **VPL**: soma de todos os fluxos descontados menos o investimento.
  Valores positivos indicam projeto viável.
- **TIR**: taxa que zera o VPL. Compare com sua taxa mínima de
  atratividade (TMA). Se TIR > TMA, o projeto compensa.

## 4. Compare cenários

O botão **Comparar cenários** roda simultaneamente os três presets e
apresenta uma tabela com paybacks, VPL e TIR. É útil para stress test —
por exemplo, checar se o projeto ainda é viável no Conservador.

## 5. Interprete e exporte

- **VPL positivo + TIR > TMA**: projeto financeiramente viável.
- **Payback descontado próximo da vida útil**: investimento arriscado;
  reavalie custo ou tarifa.
- **TIR indefinida**: fluxos líquidos negativos dominam; revise
  produção ou O&M.

Use **Exportar CSV** para abrir o fluxo em Excel/Google Sheets e
**Exportar JSON** para integrar com scripts de análise.

## FAQ

**Preciso conhecer minha tarifa exata?**
Sim — pequenas variações na tarifa afetam significativamente o VPL ao
longo de 25 anos. Use o valor médio da conta dos últimos 12 meses.

**O que fazer se não sei a taxa de desconto?**
Para pessoa física, usar o CDI (~10 %) é uma referência conservadora.
Para empresas, use o WACC ou a TMA definida pela diretoria financeira.

**Quando devo contratar um analista?**
Para investimentos acima de R$ 100 mil, cenários com incentivos fiscais
específicos (Lei 14.300, MCTI) ou análises de sensibilidade multivariáveis,
recomenda-se validação com engenheiro financeiro e consultor tributário.
