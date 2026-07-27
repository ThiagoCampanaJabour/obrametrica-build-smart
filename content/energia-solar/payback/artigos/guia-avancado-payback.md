---
title: Guia avançado da Calculadora de Payback Solar
description: Como interpretar VPL, TIR e análises de sensibilidade da Calculadora de Payback do ObraMétrica para decisões de financiamento.
---

# Guia avançado — Calculadora de Payback Solar

A [Calculadora de Payback](/energia-solar/calculadora-payback) do ObraMétrica vai muito além do "quantos anos até o sistema se pagar". Este guia mostra como usar VPL, TIR, análise de sensibilidade e comparação de cenários para embasar decisões reais — inclusive quando faz sentido financiar o sistema.

## Payback simples vs payback descontado

O **payback simples** soma o fluxo de caixa nominal ano a ano até zerar o investimento. É intuitivo, mas ignora o valor do dinheiro no tempo. O **payback descontado** traz cada fluxo para valor presente aplicando a taxa de desconto informada:

```
VP_ano = Fluxo_ano / (1 + i)^ano
```

Um sistema com payback simples de 5 anos pode ter payback descontado de 6–7 anos se a taxa for elevada (12 % a.a.). Ambos são úteis: o simples para conversas com o cliente final, o descontado para análise financeira comparativa com outras opções de investimento.

## Como interpretar o VPL

O **Valor Presente Líquido (VPL)** é a soma de todos os fluxos descontados menos o investimento inicial. Regras práticas:

- **VPL > 0**: o projeto agrega valor acima da taxa de desconto usada. Vale investir.
- **VPL = 0**: o projeto rende exatamente a taxa de desconto. Indiferente.
- **VPL < 0**: o projeto rende menos que a taxa de desconto — melhor deixar o dinheiro em outra aplicação.

A escolha da **taxa de desconto** é a decisão mais crítica. Use como referência:

- **Selic + 2 %** para clientes conservadores (comparação com renda fixa).
- **12–15 % a.a.** para clientes empresariais com custo de capital próprio.
- **8–10 % a.a.** para clientes residenciais em contexto de juros baixos.

Rodar a calculadora com três taxas diferentes e comparar o VPL é uma análise de sensibilidade essencial.

## TIR: quando faz sentido

A **Taxa Interna de Retorno (TIR)** é a taxa que zera o VPL — em outras palavras, o rendimento efetivo do projeto. A calculadora usa bissecção para encontrá-la. Interpretação:

- **TIR > custo de capital**: projeto atrativo.
- **TIR alta em projetos curtos** (payback ≤ 4 anos) frequentemente supera 25 % a.a., o que é raro em outras aplicações. Isso justifica investimento próprio em vez de financiamento longo.
- **TIR próxima do custo de capital**: reavalie premissas (inflação tarifária, degradação, O&M).

Importante: a TIR **não é comparável entre projetos de portes muito diferentes**. Um sistema de R$ 15k com TIR de 30 % pode gerar menos VPL absoluto que um sistema de R$ 150k com TIR de 20 %.

## Análise de sensibilidade — três variáveis dominam

Rode a calculadora variando isoladamente cada uma:

1. **Inflação tarifária** (padrão 6 % a.a.): cada ponto percentual altera o VPL final em 8–12 %. Use dados históricos da ANEEL da distribuidora local.
2. **Degradação dos módulos** (padrão 0,5 %/ano): valores acima de 0,7 %/ano derrubam a produção acumulada em ~10 % em 25 anos.
3. **O&M anual** (padrão 1 % do investimento): frequentemente subestimado. Inclua limpeza (2–3× por ano), troca de inversor no ano 10–12 e monitoramento.

Cenários padrão da calculadora:

- **Conservador**: inflação 4 %, degradação 0,7 %, O&M 1,5 %.
- **Padrão**: inflação 6 %, degradação 0,5 %, O&M 1 %.
- **Otimista**: inflação 8 %, degradação 0,4 %, O&M 0,5 %.

Apresentar os três ao cliente com o VPL correspondente é mais honesto que apresentar apenas o cenário padrão.

## Financiamento: quando o VPL diz "financie"

Um projeto atrativo à vista pode ser ainda mais atrativo financiado se a **TIR do projeto > taxa do financiamento**. Exemplo:

- Sistema de R$ 25.000, TIR 22 % a.a.
- Financiamento a 14 % a.a. em 60 meses.
- Diferença de 8 pontos percentuais é retorno adicional para o investidor sem capital próprio.

Fluxo para validar: rode a calculadora normalmente para obter TIR, compare com a taxa do banco. Se TIR > taxa + 3 % (margem de segurança), o financiamento gera valor. Caso contrário, à vista.

## O que a calculadora não faz (ainda)

- Não modela **crédito de energia rotativo** de forma completa (Lei 14.300/2022 tem regras específicas de compensação — reduza o fator `usoLocalPct` para simular o impacto).
- Não calcula **impostos** sobre a geração (ICMS/PIS/COFINS na parcela injetada). Para SP e MG, aplique redução de 5–8 % na receita anual estimada.
- Não considera **valor residual** do sistema após 25 anos — na prática, módulos e estruturas retêm valor de mercado.
- Não simula **variação de bandeira tarifária**. Use a inflação tarifária como aproximação.

## Como conectar com as outras ferramentas

O fluxo completo de análise fica:

1. [Simulador Avançado](/simulador-solar-avancado) → produção anual estimada.
2. [Calculadora de Inversor](/energia-solar/calculadora-inversor) → validação elétrica e custo de equipamentos.
3. **Calculadora de Payback** → conversão em VPL/TIR.
4. [Comparador On/Off/Híbrido](/energia-solar/comparador-sistemas) → decisão de topologia se o cliente tem restrição de rede ou necessidade de backup.

Alimente a calculadora de payback com a produção anual do simulador (não use uma estimativa "5 kWh/kWp·dia genérica"). Isso reduz o erro do VPL em 5–15 %.

## Exemplo prático

Sistema residencial 5 kWp em Belo Horizonte:

- Investimento R$ 22.000, produção 7.500 kWh/ano, tarifa R$ 0,85/kWh, uso local 80 %.
- Inflação tarifária 6 %, degradação 0,5 %, O&M 1 %, taxa desconto 10 %.
- **Resultado esperado**: payback simples ~4,5 anos; payback descontado ~5,5 anos; VPL 25 anos ~R$ 55.000; TIR ~24 %.

Rodar com taxa desconto 15 %: VPL cai para ~R$ 30.000, mas TIR permanece 24 % (é característica do projeto, não da taxa).

## Boas práticas ao apresentar ao cliente

1. Mostre **três cenários** (conservador, padrão, otimista) — não apenas um número.
2. Deixe claro o que está incluso no investimento (equipamentos, mão de obra, projeto, homologação).
3. Registre as premissas de inflação e degradação — clientes técnicos vão questionar.
4. Compare a TIR com a Selic vigente e um CDB de referência.
5. Se financiar, apresente a **TIR do projeto** e o **custo efetivo do financiamento** lado a lado.

## Conclusão

A Calculadora de Payback do ObraMétrica é uma ferramenta de decisão, não apenas de vendas. VPL e TIR bem interpretados evitam que o cliente compre um sistema "pelo preço" e descobra depois que a taxa de retorno era inferior a um CDB. Use os três cenários, alimente com dados reais do [Simulador Avançado](/simulador-solar-avancado) e discuta financiamento com base na TIR — não no discurso do banco.
