---
title: "Plano de testes — perda de carga em tubulações"
description: "Casos de verificação, faixas esperadas e critérios de aceite do módulo de hidráulica."
slug: "hidraulica-test-plan"
updated: "2026-08-06"
---

## Testes unitários (`src/lib/hidraulica/calc.test.ts`)

| # | Verificação | Critério |
|---|---|---|
| 1 | ρ e μ da água a 20 °C | 998,2 kg/m³ e 1,002e-3 Pa·s |
| 2 | V e Re para D=50 mm, Q=2 L/s | V ≈ 1,019 m/s; 50 000 < Re < 52 000 |
| 3 | Regime laminar | Re=1000 → f = 0,064 (64/Re), sem Colebrook |
| 4 | Colebrook × Swamee-Jain | desvio relativo < 2% em Re=1e5 |
| 5 | Convergência Colebrook em Re altos | converge para Re = 1e6, 1e7 e 1e8 |
| 6 | Tubo liso Re=1e5 | f ≈ 0,018 (diagrama de Moody) |
| 7 | Darcy-Weisbach | hf = f·(L/D)·V²/2g conferido numericamente |
| 8 | Hazen-Williams (caso 2) | hf ≈ 3,323 m |
| 9 | Perdas localizadas | Σ K V²/2g |
| 10 | Trechos em série + peças (caso 3) | soma coerente; perfil final = hf_total |
| 11 | Potência de bomba | head = hf + Δz; P_elétrica = P_hid/η |
| 12 | Métodos Darcy comparados | desvio < 3% |
| 13 | Avisos | velocidade > 3 m/s dispara aviso |
| 14 | Validação de entradas | D=0, L=0 ou lista vazia lançam erro |
| 15 | Exportação CSV | cabeçalho e linhas de totais presentes |
| 16 | Conversões | L/s, m³/h, gpm, mm, in |

## Testes manuais na página

1. Abrir `/construcao-civil/perda-atrito-tubulacoes` e conferir renderização sem erros de console.
2. Calcular o caso 1 do `exemplo.json` e comparar V, Re, f e hf com os valores esperados.
3. Alternar entre Colebrook, Swamee-Jain e Hazen-Williams e confirmar que f some no último.
4. Adicionar um segundo trecho e duas peças; verificar somatórios e a tabela detalhada.
5. Exportar CSV e JSON e conferir que inputs e outputs constam do arquivo.
6. Responsividade em 375 px, 768 px e 1280 px; formulário empilhado no mobile.
7. Acessibilidade: navegação por teclado nos campos e `aria-live` anunciando o resultado.
8. Disclaimer de estimativa visível acima dos resultados.
