---
title: "Plano de testes — Estimador de Custo Total (TCO)"
description: "Casos de validação do motor de custos, exportações, gráfico de fluxo de caixa e acessibilidade."
---

## Testes unitários (`src/lib/solar/cost-estimator.test.ts`)

Execução: `bunx vitest run src/lib/solar/cost-estimator.test.ts`

| # | Caso | Verificação |
|---|---|---|
| 1 | `qtyModules` | 4 kWp / 400 Wp = 10; 4,1 kWp = 11; 50 kWp / 550 Wp = 91 |
| 2 | `qtyModules` inválido | Potência ou Pmp zerados retornam 0 |
| 3 | `purchaseModules` | Spare de 5% e caixa de 4 → 12 módulos em 3 caixas |
| 4 | `estimateInverters` | 24 kW / 10 kW = 3 unidades, 30 kW AC, 12 entradas, R$ 21.600 |
| 5 | `estimateRailsAndClamps` | 10 módulos paisagem = 39,0 m de perfil e 40 grampos |
| 6 | `estimateCabling` | Eletrocalha zerada assume o comprimento do trecho CA |
| 7 | `estimateLabor` | Modo kWp = R$ 2.800; modo horas = R$ 2.720 |
| 8 | `estimateProtections` | 9 strings → 3 string boxes; itens com preço 0 são omitidos |
| 9 | **Caso 1** (4 kWp) | 10 módulos, 4,00 kWp, 1 string, 1 inversor, DC/AC 0,80 |
| 10 | **Caso 1** — CAPEX | Módulos R$ 4.200; contingência = 7% do subtotal; preço = CAPEX × 1,15 |
| 11 | **Caso 2** (50 kWp) | 91 módulos, 7 strings, 2 inversores, 12 entradas |
| 12 | **Caso 2** — compra | 93 módulos em 3 caixas de 31 |
| 13 | **Caso 2** — substituições | Anos 12 e 24, R$ 27.000 por evento |
| 14 | **Caso 3** (bateria) | CAPEX e seguro maiores; substituições nos anos 10 e 20 |
| 15 | `estimateOpex` | 4 kWp e CAPEX R$ 20.000 → R$ 292/ano |
| 16 | `calcPayback` | Receita R$ 5.700, líquido R$ 5.400, payback ≈ 3,7 anos |
| 17 | `calcPayback` sem folga | OPEX acima da receita → payback nulo |
| 18 | `capitalRecoveryFactor` | Taxa 0 → 1/n; taxa 8% em 25 anos → 0,0937 |
| 19 | Cashflow | 26 linhas (ano 0 a 25); ano 0 negativo igual ao CAPEX; ano 12 com substituição |
| 20 | Degradação | Ano 1 = 6.000 kWh; ano 2 ≈ 5.970 kWh |
| 21 | LCOE | Positivo e finito, com energia descontada |
| 22 | Produção zerada | Payback nulo + aviso pedindo produção e tarifa |
| 23 | Custo no horizonte | CAPEX + 25 × OPEX + substituições; versão descontada menor |
| 24 | `costToCSV` | Cabeçalho do BOM, bloco de resumo e bloco de fluxo de caixa |
| 25 | Escala | 5.000 kWp → 12.500 módulos sem overflow |
| 26 | Preço zerado | CAPEX permanece positivo |
| 27 | Entradas insuficientes | Aviso quando as strings excedem as entradas dos inversores |

## Testes manuais na interface

1. Abrir `/energia-solar/estimador-custo-total` e clicar em **Calcular custo total** com os
   padrões: o resumo deve mostrar 4,00 kWp, 10 módulos, 1 inversor e payback em torno de 3,8 anos.
2. Trocar o preset de módulo para 550 Wp e recalcular: a quantidade cai para 8 módulos e o custo
   por kWp muda.
3. Alternar a mão de obra para **Horas × taxa**: os campos de horas e taxa substituem o R$/kWp e o
   item "Instalação e montagem" passa a ser cotado em horas.
4. Marcar **Incluir banco de baterias**: surgem as linhas de armazenamento no BOM e substituições
   nos anos 10 e 20.
5. Filtrar a tabela por categoria: o subtotal exibido acompanha o filtro.
6. Conferir no gráfico que o ano 0 concentra o CAPEX e que os anos de substituição aparecem em
   vermelho.
7. Exportar CSV e JSON e conferir que os totais batem com a tela; usar **Gerar proposta (PDF)**
   e verificar que formulário e botões somem na visualização de impressão.
8. Clicar em **Salvar cenário**, recarregar a página e confirmar que os valores retornam.

## Casos de borda

- Produção anual 0 → sem payback, aviso visível.
- Tarifa 0 → mesmo comportamento.
- OPEX maior que a receita → aviso de payback indefinido.
- Vida útil do inversor maior que o horizonte → nenhuma substituição agendada.
- Potência alvo 0 → nenhum módulo dimensionado e CAPEX apenas com verbas fixas.

## Responsividade e acessibilidade

- 390 px: sem overflow horizontal; formulário em coluna única; tabelas e gráfico com rolagem
  interna própria.
- 1280 px: grade de três colunas nos formulários e quatro cards no resumo.
- Todos os campos têm `label` com `htmlFor`; o resumo usa `aria-live="polite"`.
- O SVG do fluxo de caixa tem `role="img"`, `aria-label` e `<title>`, com a tabela em `<details>`
  como alternativa textual.
