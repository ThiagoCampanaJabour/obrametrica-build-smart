---
title: "Plano de testes — Área e Layout de Painéis"
description: "Casos de validação do motor de layout PV, exportações e acessibilidade."
---

## Testes unitários (`src/lib/solar/layout-calc.test.ts`)

| # | Caso | Verificação |
|---|---|---|
| 1 | Footprint paisagem/retrato | Maior dimensão no eixo correto |
| 2 | Dimensões efetivas | Soma dos gaps (1,98 × 1,00 m) |
| 3 | `gridCount` | 11,40 / 1,98 = 5 colunas; 7,40 / 1,00 = 7 fileiras |
| 4 | `applyCoverageLimit` | 35 × 80% = 28 |
| 5 | `winterSolarElevation` | −23,45° → 43,1°; decresce com a latitude |
| 6 | `computeRowSpacing` | tilt 0° ≈ altura; cresce com o tilt |
| 7 | `projectShadowLength` | h = 2 m, elev 45° → 2,00 m |
| 8 | Caso 1 completo | 35 módulos, 14,00 kWp, 4 strings, última com 5 |
| 9 | Corredores | Reduzem fileiras e registram as faixas |
| 10 | Obstáculos e sombras | Exclusões com motivo `obstaculo` e `sombra` |
| 11 | Alvo por potência | 4 kWp → 10 módulos |
| 12 | Alvo por módulos | 12 módulos exatos |
| 13 | Sugestão tilt/azimute | Hemisfério sul → azimute 0°, tilt = latitude |
| 14 | Export CSV | Uma linha por módulo + bloco de resumo |

Execução: `bunx vitest run src/lib/solar/layout-calc.test.ts`

## Testes manuais na interface

1. Abrir `/energia-solar/calculadora-area-layout-paineis` e clicar em **Gerar layout** com os
   valores padrão — deve retornar 30 módulos (corredores ativos com 4 fileiras por bloco).
2. Zerar "Fileiras por bloco" e recalcular — deve retornar 35 módulos e 14,00 kWp.
3. Alternar montagem para **retrato** — o número de colunas e fileiras deve mudar coerentemente.
4. Adicionar um obstáculo de 1,2 × 1,2 m com 2 m de altura em (1, 1) — o desenho deve mostrar o
   retângulo vermelho e a faixa de sombra, com posições bloqueadas destacadas.
5. Ativar o espaçamento entre fileiras — o aviso do passo aplicado deve aparecer e o número de
   fileiras deve cair.
6. Exportar CSV, JSON, SVG e PNG — o CSV deve ter uma linha por módulo com `x_m`, `y_m` e
   `string_id` iguais aos exibidos na tabela textual.

## Responsividade e acessibilidade

- 390 px: sem overflow horizontal; formulário em coluna única; tabelas com rolagem interna.
- 1280 px: grades de 3 colunas no formulário; preview ocupando a largura do container.
- Todos os campos têm `label` associado por `htmlFor`.
- O bloco de resultados usa `aria-live="polite"`.
- O SVG possui `role="img"` e `<title>` descritivo; a lista textual de módulos é a alternativa
  acessível ao desenho.
