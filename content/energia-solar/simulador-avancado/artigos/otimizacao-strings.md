---
title: Otimização de strings em sistemas fotovoltaicos
description: Por que agrupar módulos em strings adequadas eleva a produção anual e reduz perdas por mismatch.
---

# Otimização de strings

Em um sistema fotovoltaico, os módulos raramente operam isolados: são conectados em série formando **strings**, que por sua vez alimentam entradas MPPT do inversor. A forma como você agrupa esses módulos afeta a produção anual, o custo do inversor e a resiliência ao sombreamento parcial.

## Por que o tamanho da string importa

Uma string opera na tensão da soma dos módulos e na corrente do módulo mais fraco. Isso significa que:

- **Strings muito curtas** exigem mais entradas de inversor (mais equipamento, mais cabo), mas isolam melhor o efeito de sombreamento parcial.
- **Strings muito longas** economizam entradas MPPT, mas amplificam perdas quando um único módulo é sombreado — todos os módulos da string operam abaixo do ponto ideal.

O ponto ideal costuma ficar entre 6 e 12 módulos por string, dependendo do inversor e do padrão de sombra do local.

## Como o Simulador Avançado escolhe

Nossa heurística varre todos os tamanhos de string entre 2 e 20 módulos, aplica uma penalidade linear (0,4% adicional por módulo acima de 8) e ordena os resultados pela produção anual estimada. Você não recebe apenas "a melhor" configuração — recebe **cinco alternativas comparáveis**, com números claros para levar ao seu integrador ou ao fabricante do inversor.

## O que a heurística não faz

- Não conhece as faixas de tensão MPPT do inversor específico. Uma configuração matematicamente ótima pode ficar fora da faixa de operação. Sempre valide com a datasheet.
- Não modela sombreamento módulo-a-módulo. Se um único módulo é sombreado nas primeiras horas do dia, a perda real pode ser maior do que a estimativa.
- Não considera diodos de bypass — módulos modernos mitigam parte da perda por mismatch, mas o efeito não é eliminado.

## Boas práticas na obra

1. Agrupe módulos que compartilham o mesmo padrão de sombreamento em uma mesma string.
2. Evite misturar módulos de potências ou idades diferentes numa mesma string.
3. Prefira inversores com múltiplas entradas MPPT quando o telhado tem orientações distintas.
4. Documente a configuração escolhida no memorial — exporte o CSV do simulador como anexo.

## Quando reprojetar

Se a comparação entre configurações mostra ganho superior a 3% ao ano, vale a pena investir tempo em uma segunda análise com ferramenta dedicada. Se o ganho é menor que 1%, a decisão pode ser feita pelo critério de custo do inversor e complexidade de instalação.

## Exemplo prático

Considere 24 módulos de 550 W em um telhado sem sombra significativa. Strings de 8 módulos formam 3 strings de 4,4 kWp cada. Strings de 12 módulos formam 2 strings de 6,6 kWp — economizando uma entrada MPPT, mas com pequena penalidade por comprimento. O simulador mostra ambos os cenários lado a lado, permitindo decisão informada.
