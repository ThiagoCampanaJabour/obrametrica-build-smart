---
title: "Plano de QA — Estruturas Metálicas Básicas"
description: "Casos de teste, critérios de aceite e verificações manuais do módulo de estruturas metálicas."
---

## Plano de QA — Estruturas Metálicas Básicas

Rota: `/construcao-civil/estruturas-metalicas-basicas`

### 1. Testes unitários (`src/lib/estruturas/calc.test.ts`)

| # | Caso | Esperado |
|---|---|---|
| 1 | Viga biapoiada, q = 5 kN/m, L = 6 m | M = 22,5 kN·m; V = 15 kN |
| 2 | Viga biapoiada, P = 20 kN, L = 4 m | M = 20 kN·m; V = 10 kN |
| 3 | Viga contínua 2 vãos, q = 5, L = 6 | M_apoio = 22,5 kN·m > M_vão |
| 4 | Pórtico, P = 10 kN, L = 5 m, h = 3 m | N_topo = 5 kN; M_pilar = 7,5 kN·m |
| 5 | Flecha | δ cresce com L⁴ e é sempre positiva |
| 6 | Caso 1 completo | W_req ≈ 140,6 cm³; perfil com W ≥ W_req; utilização ≤ 100% |
| 7 | Seleção | o perfil sugerido é o mais leve entre os que atendem |
| 8 | Família preferida | com "HEB" selecionado, o sugerido é HEB |
| 9 | Fator de margem 1,25 | momento 25% maior |
| 10 | Quantidade e extra de corte | comprimento total = (L + extra) × qtd; peso coerente |
| 11 | Agregação | soma de peças e peso de múltiplos elementos |
| 12 | CSV | contém cabeçalho, linha do elemento e linha TOTAL |

Comando: `bunx vitest run src/lib/estruturas/calc.test.ts`

### 2. Validação de entradas

- Vão zero ou negativo → mensagem de erro.
- Vão acima de 30 m → bloqueio com orientação de projeto específico.
- Altura de pilar ausente em pórtico/pilar → erro.
- Nenhuma carga informada → erro.
- Fator de margem fora de 1,0–2,0 → erro.
- Quantidade não inteira ou menor que 1 → erro.
- Extra de corte fora de 0–2 m → erro.

### 3. Testes de interface

- [ ] A página abre sem erros de console e é responsiva em 360, 768 e 1280 px.
- [ ] O disclaimer aparece acima do formulário, antes de qualquer cálculo.
- [ ] O campo "Altura do pilar" só aparece para pórtico e pilar.
- [ ] Os presets rápidos preenchem o primeiro elemento.
- [ ] "Adicionar elemento" e "Remover elemento" funcionam; não é possível remover o último.
- [ ] "Ver cálculo passo a passo" expande e recolhe, com `aria-expanded` correto.
- [ ] A tabela de alternativas destaca o perfil sugerido e marca em vermelho utilização > 100% e
      flecha acima de L/250.
- [ ] Exportar CSV, Exportar JSON, Gerar lista de compra (clipboard) e Imprimir funcionam.
- [ ] O JSON exportado contém o campo `aviso` com o disclaimer.
- [ ] Navegação por teclado alcança todos os campos e botões; foco visível.

### 4. Critérios de aceite

- [ ] Fórmulas batem com os três casos de `exemplo.json`.
- [ ] A seleção retorna sempre perfil comercial com W ≥ W_req, ou aviso explícito de que nenhum
      perfil da tabela atende.
- [ ] Exportações geram payload detalhado por elemento e totais.
- [ ] Metodologia, intro e artigo publicados com frontmatter.
- [ ] Disclaimer visível na página, na metodologia, no artigo e na exportação.
- [ ] Link para contato com engenheiro presente na página.
- [ ] Rota incluída no sitemap e na listagem de Construção Civil.
