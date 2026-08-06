---
title: "Plano de testes — Simulador de Iluminação Natural e Sombras"
atualizado: "2026-08-06"
---

## Testes automatizados

Arquivo: `src/lib/iluminacao/calc.test.ts` (Vitest, 12 casos).

| # | Cenário | Verificação |
|---|---------|-------------|
| 1 | Caso base (`exemplo.json` caso A) | Área de vidro 3,00 m², Tv 0,80, DF entre 0,5% e 10% |
| 2 | Troca de vidro simples → refletivo | DF cai na proporção 0,30/0,80 |
| 3 | Película forte | DF menor que sem película |
| 4 | Horário fora de 6h–18h | Irradiância total igual a zero |
| 5 | Orientação × hora | Leste > Oeste às 8h; Oeste > Leste às 16h |
| 6 | Beiral | Redução maior com sol alto do que com sol rasante |
| 7 | Sem proteção | Redução igual a zero |
| 8 | Caso A | Iluminância média entre 100 e 60.000 lux; recomendações não vazias |
| 9 | Caso B (Oeste, RJ, beiral 1,0 m, 12h–16h) | Iluminância média menor com beiral |
| 10 | Validação | Área de vidro maior que o ambiente é rejeitada |
| 11 | Validação | Caso base é aceito |
| 12 | Exportação | CSV com cabeçalho correto e uma linha por faixa |

Comando: `bunx vitest run src/lib/iluminacao/calc.test.ts`

## Testes manuais

1. Abrir `/construcao-civil/simulador-iluminacao-fachadas` e verificar renderização sem erros de console.
2. Preencher o caso A e conferir DF, gráfico horário e corte esquemático.
3. Adicionar segundo ambiente e confirmar cálculo independente de cada card.
4. Alterar orientação de Leste para Oeste e observar o deslocamento do pico no gráfico.
5. Aplicar película forte e conferir queda simultânea de DF e iluminância.
6. Exportar CSV e JSON e validar as colunas `e_inside_lux_medio`, `df_percent` e `risco_ofuscamento`.
7. Testar responsividade em 375 px, 768 px e 1440 px.
8. Acessibilidade: navegação por teclado nos campos, `aria-live` na região de resultados, textos
   alternativos no gráfico e no corte esquemático.
9. Confirmar que o disclaimer aparece acima do formulário.
