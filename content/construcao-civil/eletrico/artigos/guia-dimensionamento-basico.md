---
title: Guia de dimensionamento elétrico básico para obras
description: Como calcular cargas, escolher disjuntores e bitolas para uma instalação residencial simples.
category: construcao-civil
tags: [guia, tutorial, eletrica, nbr-5410]
updated: 2026-07-28
---

# Guia de dimensionamento elétrico básico

Este guia mostra, passo a passo, como usar a Calculadora de Dimensionamento Elétrico da
ObraMétrica para uma casa residencial simples. Ao final, você terá uma estimativa das bitolas e
disjuntores necessários para orçar cabos, quadros e proteções — e saberá exatamente **quando
chamar o eletricista**.

## 1. Separe as cargas por ambiente e por tipo

Antes de calcular, liste **todas as cargas** por ambiente:

- **Iluminação**: some as potências das lâmpadas por circuito (um circuito por pavimento é
  comum). Em LED, uma casa média fica entre 200 e 800 W.
- **Tomadas de uso geral (TUG)**: 100 W por ponto em ambientes secos; 600 W nas três primeiras
  tomadas de cozinha, área de serviço e copa, e 100 W nas demais.
- **Tomadas de uso específico (TUE)**: chuveiro (4.500 a 7.500 W), forno elétrico
  (2.500 a 4.000 W), ar-condicionado (900 W para 9k BTU; 1.400 W para 12k BTU), microondas
  (1.500 W), lava-roupas, bombas.

Cada TUE ganha um **circuito dedicado**.

## 2. Escolha a tensão

- **127 V**: iluminação, tomadas de uso geral em regiões que usam essa tensão.
- **220 V**: chuveiro, ar-condicionado, forno — reduz a corrente pela metade e permite bitola
  menor.
- **380 V trifásico**: casas grandes, comércios e sítios com bomba/motor. A ferramenta suporta
  os três casos.

## 3. Preencha na calculadora

Adicione uma linha por circuito. Para cada uma, informe **nome, tipo, potência (W), tensão,
fases e comprimento estimado do cabo**. O comprimento é medido do quadro até a carga (ida) —
importante para a queda de tensão.

Use o botão **Preset residencial** para carregar um exemplo de casa média e depois ajustar aos
seus dados. O menu de presets também traz cargas isoladas prontas: chuveiro 5.500 W, AC 12k,
tomadas de cozinha, forno, microondas, bomba d’água etc.

## 4. Interprete os resultados

Para cada circuito, a tabela mostra:

- **P. efetiva (W)**: potência × fator de simultaneidade.
- **I (A)**: corrente calculada.
- **Disjuntor (A)**: sugestão com margem de 25% arredondada para o padrão comercial.
- **Bitola (mm²)**: menor seção cuja ampacidade suporta a corrente e o disjuntor.
- **ΔV (%)**: queda de tensão estimada. Alerta em vermelho quando ultrapassa 4%.

Exemplo prático:

- Chuveiro 5.500 W a 220 V, 15 m → I ≈ 25 A → disjuntor **32 A** → bitola **6 mm²** → ΔV ≈ 1,3%.
- AC 12k (1.400 W) a 220 V, 12 m → I ≈ 6,4 A → disjuntor **10 A** → bitola **2,5 mm²** → ΔV ≈ 0,6%.
- Tomadas cozinha (3.600 W) a 127 V, 12 m → I ≈ 28 A → disjuntor **32 A** → bitola **6 mm²**.

## 5. Some tudo para dimensionar o quadro

O resumo consolida a **potência instalada**, a **demanda estimada** (com simultaneidade) e a
**corrente principal**. O “quadro sugerido” indica um padrão comercial próximo (63 A, 100 A…)
para o disjuntor geral e o padrão de entrada com a concessionária. Verifique o padrão local:
CPFL, Enel, Neoenergia e Cemig publicam manuais de padrão de entrada com valores mínimos.

## 6. Ajuste manualmente quando necessário

Cada circuito aceita **override de disjuntor e bitola**. Use para:

- Compatibilizar com o material já comprado.
- Padronizar a instalação (por exemplo, sempre 2,5 mm² para tomadas).
- Refazer o cálculo depois de rodar a **queda de tensão** e verificar se o novo valor está OK.

## 7. Exporte e compartilhe

Botões **CSV**, **JSON** e **Imprimir** entregam:

- Planilha para orçamento de cabos e proteções.
- JSON para reimportar depois ou integrar com a **Calculadora de Orçamento por Etapa** e a
  **Calculadora de Mão de Obra**.
- Versão para impressão anexar ao caderno de compras.

## 8. Quando chamar o eletricista

Sempre. A calculadora acelera o **orçamento** e a **conferência**, mas não substitui:

- **Projeto elétrico executivo** com ART/RRT.
- **Cálculo de curto-circuito** e seleção correta da capacidade de interrupção (kA).
- **Coordenação e seletividade** entre disjuntor geral e circuitos.
- **DR, DPS, aterramento e equipotencialização**, obrigatórios pela NBR 5410.

Use este guia como ponto de partida e leve a lista de circuitos ao profissional. Ele conseguirá
finalizar o projeto muito mais rápido com os dados já organizados.
