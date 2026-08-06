---
title: "Exemplo de uso — Estimador de Custo Total (TCO)"
description: "Passo a passo com números: sistema residencial de 4 kWp em São Paulo, do CAPEX ao payback."
---

## Cenário

Residência em São Paulo, telhado cerâmico inclinado, consumo médio de 500 kWh/mês. A simulação por
localização indicou **6.000 kWh/ano** de geração para 4 kWp e a tarifa cheia da distribuidora é de
**R$ 0,95/kWh**.

## Passo 1 — Projeto

| Campo | Valor |
|---|---|
| Potência DC alvo | 4 kWp |
| Produção estimada ano 1 | 6.000 kWh |
| Tarifa | R$ 0,95/kWh |
| Degradação anual | 0,5% |

## Passo 2 — Equipamento

Módulo de **400 Wp** a **R$ 1,05/Wp**, caixa com 1 unidade (compra avulsa), 0% de reserva.

`n = ceil(4 × 1000 / 400) = 10 módulos` → **4,00 kWp DC**
Custo dos módulos: `10 × 400 W × 1,05 = R$ 4.200,00`

Com 10 módulos por string, o arranjo tem **1 string**. Com DC/AC alvo de 1,2, a potência AC alvo é
`4,00 / 1,2 = 3,33 kW`, atendida por **1 inversor string de 5 kW** (R$ 4.200,00), resultando em
DC/AC real de 0,80 — folgado, mas é a menor unidade comercial disponível.

## Passo 3 — Estrutura e cabos

Montagem paisagem, telhado inclinado (fator 1,0):

`rails = 10 × 1,95 m × 2 × 1,0 = 39,0 m` → `39 × R$ 38 = R$ 1.482,00`
`clamps = 10 × 4 = 40` → `40 × R$ 9 = R$ 360,00`

Cabos: 60 m de cabo solar CC a R$ 9,50/m (R$ 570,00), 25 m de cabo CA a R$ 14/m (R$ 350,00) e 25 m
de eletroduto a R$ 22/m (R$ 550,00).

## Passo 4 — Proteções e serviços

String box (R$ 850), 1 fusível por string (R$ 45), DPS CA (R$ 320), quadro de proteção (R$ 780) e
aterramento (R$ 450) — **R$ 2.445,00** em BOP.

Instalação por kWp: `4,00 × R$ 700 = R$ 2.800,00`. Frete a 2% dos equipamentos mais R$ 250 de
descarregamento. Projeto e ART R$ 900, licenças e homologação R$ 350, comissionamento de 1,5%
sobre os itens anteriores.

## Passo 5 — Contingência, OPEX e margens

Contingência de 7% sobre o subtotal direto e markup comercial de 15% para o preço de venda.

OPEX anual:

```text
limpeza        4,00 kWp × R$ 25 = R$ 100,00
manutenção     4,00 kWp × R$ 20 = R$  80,00
monitoramento  4,00 kWp × R$  8 = R$  32,00
seguro         0,4% × CAPEX      ≈ R$  80,00
--------------------------------------------
OPEX total                       ≈ R$ 292,00/ano
```

## Resultados

Com esses valores, o estimador devolve um **CAPEX próximo de R$ 20 mil**, ou seja, cerca de
**R$ 5.000 por kWp** — coerente com a faixa residencial de mercado, que sobe quando o sistema é
pequeno porque projeto, homologação e proteções são custos praticamente fixos.

| Indicador | Valor aproximado |
|---|---|
| CAPEX total | R$ 20.000 |
| Custo por kWp | R$ 5.000 |
| OPEX anual | R$ 292 |
| Receita anual (ano 1) | R$ 5.700 |
| Economia líquida anual | R$ 5.408 |
| Payback simples | ~3,8 anos |
| Substituição do inversor | anos 12 e 24 (R$ 4.200 cada) |

## Passo 6 — Leitura do fluxo de caixa

No gráfico, o ano 0 aparece como a única barra grande de custo (CAPEX). Do ano 1 em diante, as
barras verdes de receita superam as barras cinzas de OPEX e a linha do acumulado sobe até cruzar o
zero por volta do quarto ano. Os anos 12 e 24 mostram barras vermelhas: são as substituições do
inversor, que achatam temporariamente a inclinação da linha acumulada sem revertê-la.

## Passo 7 — Exportar

Use **Baixar BOM (CSV)** para levar a lista de materiais ao fornecedor, **Baixar JSON** para
arquivar o cenário completo (inputs, presets e resultados) e **Gerar proposta (PDF)** para imprimir
a página de resultados já sem os formulários. Ajuste cada preço unitário com as cotações reais
antes de enviar a proposta ao cliente.
