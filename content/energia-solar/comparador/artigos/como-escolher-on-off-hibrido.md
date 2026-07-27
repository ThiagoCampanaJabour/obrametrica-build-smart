---
title: Como escolher entre On-Grid, Off-Grid e Híbrido
description: Critérios técnicos, econômicos e de resiliência para decidir a topologia certa em cada cenário — residencial, comercial ou rural.
---

# Como escolher entre On-Grid, Off-Grid e Híbrido

A decisão sobre a topologia do sistema fotovoltaico raramente é apenas técnica: envolve **custo inicial, resiliência a quedas de rede, restrições regulatórias e o perfil de consumo** do cliente. Este artigo detalha os trade-offs de cada opção e explica como usar o [Comparador On-Grid / Off-Grid / Híbrido](/energia-solar/comparador-sistemas) do ObraMétrica para chegar a uma recomendação embasada.

## As três topologias em uma frase

- **On-Grid** (conectado à rede): sem baterias, injeta excedente na rede e compensa via créditos.
- **Off-Grid** (autônomo): banco de baterias dimensionado para toda a autonomia; sem conexão com a concessionária.
- **Híbrido**: on-grid com bateria de backup — economia da rede + resiliência a quedas.

## Critério 1 — Existe rede confiável no local?

- **Sim, com poucas quedas**: on-grid é o padrão. Menor investimento inicial, menor payback, sem manutenção de baterias.
- **Sim, mas com quedas frequentes** (>2 h/mês): considere híbrido. O custo adicional das baterias se paga em conforto e em cargas críticas (freezers, servidores, câmeras).
- **Não há rede** (propriedades rurais isoladas, telecomunicações remotas): off-grid é a única opção.

## Critério 2 — Qual o custo real da queda de energia?

Quantifique perdas por hora sem energia:

- **Residencial**: R$ 0 a R$ 50/hora (perda de alimentos em freezer, desconforto).
- **Comercial**: R$ 200 a R$ 2.000/hora (vendas paradas, sistemas offline).
- **Industrial/agroindustrial**: R$ 500 a R$ 10.000/hora (produção parada, matéria-prima perdida).

Se o custo/hora × horas anuais de queda **supera 5 % do valor do sistema off-grid/híbrido**, invista em resiliência. Caso contrário, on-grid resolve.

## Critério 3 — Regulação e enquadramento

- **Micro/minigeração distribuída (Lei 14.300/2022)**: on-grid e híbrido injetam na rede e recebem créditos. A partir de 2023, novos consumidores pagam parcela do fio B — o comparador aplica o parâmetro `usoLocalPct` para modelar isso.
- **Off-grid**: sem interface com a concessionária, sem regras de compensação — mas exige projeto autônomo completo (dimensionamento de baterias por dias de autonomia).
- **Sistemas híbridos**: verifique aceitação do inversor híbrido pela distribuidora local (nem todos os modelos estão em lista de conformidade).

## Critério 4 — Payback e VPL

Regra geral (para consumidor médio brasileiro):

- **On-grid**: payback 4–6 anos; VPL 25 anos positivo em ~90 % dos casos.
- **Híbrido**: payback 7–10 anos; VPL positivo, mas menor que on-grid.
- **Off-grid**: payback ≥ 10 anos em contextos com rede disponível; VPL geralmente **negativo** comparado a on-grid + baterias adicionadas depois. Só faz sentido econômico quando não há rede ou o custo de trazer rede supera R$ 30 mil.

O comparador do ObraMétrica calcula os três VPLs simultaneamente. Uma diferença de R$ 20.000+ no VPL não é anedota — é decisão.

## Critério 5 — Perfil de consumo horário

- **Consumo predominante diurno** (comércio, escritórios): on-grid ideal — o sistema gera enquanto o consumo acontece, sem passar pela concessionária.
- **Consumo predominante noturno** (residencial padrão): parte da geração vira crédito e volta com desconto (fio B). Ajuste `usoLocalPct` para 30–50 %.
- **Consumo 24 h** (indústrias): considere híbrido se picos coincidem com bandeiras vermelhas — a bateria reduz demanda contratada.

## Interpretando a tabela do comparador

A calculadora entrega, para cada topologia:

- **Custo inicial**: equipamentos + baterias + instalação.
- **Payback simples**: anos para zerar o investimento.
- **VPL 25 anos**: valor presente líquido do fluxo total.
- **Banco de baterias (kWh)**: dimensionamento estimado (só off-grid e híbrido).
- **Autonomia (h)**: quantas horas de consumo o banco cobre.

Quando duas topologias empatam em VPL (diferença < 10 %), a decisão vai para critérios não-financeiros: resiliência, conforto, restrições regulatórias.

## Exemplo prático — residência urbana

- Consumo 500 kWh/mês, tarifa R$ 0,85/kWh, potência instalada 5 kWp.
- **On-Grid**: R$ 22 mil, payback 4,8 anos, VPL R$ 55 mil.
- **Híbrido** (5 kWh de bateria): R$ 42 mil, payback 8,5 anos, VPL R$ 32 mil.
- **Off-Grid** (25 kWh de bateria, 12 h autonomia): R$ 78 mil, payback 15 anos, VPL R$ −10 mil.

Recomendação da calculadora: **on-grid**. Mas se a região tem 8 h/mês de queda e o cliente valoriza conforto, o híbrido pode ser justificável mesmo com VPL menor.

## Exemplo prático — sítio rural sem rede

- Consumo 200 kWh/mês, sem conexão com a concessionária.
- **Off-Grid** com autonomia de 24 h: R$ 45 mil, produção anual 3.000 kWh, VPL comparado a gerador diesel — geralmente positivo em 5–8 anos.
- On-grid e híbrido: não aplicáveis (sem rede).

Aqui a decisão é entre off-grid solar e gerador a combustível. Sempre solar quando o custo por kWh do combustível supera R$ 1,20 (praticamente sempre em regiões remotas).

## Exemplo prático — comércio 24/7

- Consumo 2.500 kWh/mês, cargas críticas de R$ 800/hora de queda.
- **On-Grid**: R$ 90 mil, payback 5 anos, VPL R$ 220 mil.
- **Híbrido** (15 kWh de bateria para cargas críticas): R$ 130 mil, payback 6,5 anos, VPL R$ 190 mil.

Recomendação: **híbrido**. Perde R$ 30 mil em VPL, mas protege R$ 800/h × 24 h de quedas evitadas por ano ≈ R$ 20 mil/ano. Se paga em ~2 anos considerando resiliência.

## Erros comuns

1. **Dimensionar off-grid pelo consumo médio** — use o consumo pico com fator de simultaneidade. Um freezer + ar-condicionado ligados simultaneamente exigem inversor sobredimensionado.
2. **Ignorar profundidade de descarga (DoD)** — baterias de lítio (LiFePO4) aceitam 80–90 % DoD; chumbo-ácido apenas 30–50 %. Isso muda o preço por kWh útil em 2–3×.
3. **Comparar preços sem VPL** — um sistema off-grid mais barato hoje pode ter VPL negativo em 25 anos por causa da troca de baterias.
4. **Assumir vida útil das baterias igual à dos módulos** — módulos duram 25 anos; baterias 8–15 anos. Inclua a troca no fluxo de caixa.

## Fluxo recomendado de decisão

1. Rode o [Comparador](/energia-solar/comparador-sistemas) com dados reais de consumo.
2. Se on-grid domina em VPL, foque em custo do sistema — use a [Calculadora de Inversor](/energia-solar/calculadora-inversor) para escolher equipamento.
3. Se híbrido é próximo (< 15 % de diferença de VPL), avalie o custo real da queda de energia.
4. Off-grid: valide se há restrição de rede antes de considerar.
5. Feche o pacote com a [Calculadora de Payback](/energia-solar/calculadora-payback) rodando cenários de inflação tarifária.

## Conclusão

Não existe "melhor topologia" — existe **melhor topologia para este cenário**. On-grid vence em 80 % dos casos residenciais e comerciais urbanos. Híbrido justifica-se quando o custo da queda de energia é alto. Off-grid é obrigatório sem rede e opcional quando o cliente valoriza autonomia total. O comparador do ObraMétrica coloca os três lado a lado — a decisão final combina VPL, resiliência e regulação local. Sempre valide o projeto executivo com um engenheiro eletricista responsável.
