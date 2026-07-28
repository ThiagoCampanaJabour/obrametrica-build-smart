# Test Plan — Calculadora de Mão de Obra

## Cenário 1 — Exemplo
1. Abrir `/construcao-civil/calculadora-mao-obra`.
2. Clicar em "Carregar exemplo".
3. Conferir que aparecem 3 itens (Reboco, Alvenaria, Pintura).
4. Verificar totais: 57,2 h e R$ 1.430,00.

## Cenário 2 — Edição
1. Alterar produtividade do reboco para 0,20 h/m².
2. Verificar que horas e custo recalculam em tempo real.
3. Alterar custo por hora para R$ 30,00 e confirmar novo total.

## Cenário 3 — Dificuldade
1. Marcar dificuldade "Muito difícil" na alvenaria.
2. Confirmar que horas totais aumentam 25%.

## Cenário 4 — Agrupamento
1. Verificar que subtotais por etapa somam corretamente por Alvenaria, Revestimento e Acabamento.

## Cenário 5 — Import JSON
1. Colar `exemplo.json` (campo `input`) no importador.
2. Confirmar que a tabela é preenchida.

## Cenário 6 — Export
1. Clicar em "Exportar CSV" e "Exportar JSON".
2. Abrir os arquivos e conferir colunas e totais.

## Cenário 7 — Acessibilidade
- Navegar por Tab entre inputs.
- Confirmar que os totais usam `aria-live="polite"`.
