# Test Plan — Orçamento por Etapa

## Cenário 1 — Agregação automática
1. Abrir `/construcao-civil/orcamento-por-etapa`.
2. Clicar em "Carregar exemplo".
3. Verificar que aparecem etapas: Alvenaria, Estrutura, Cobertura, Piso, Acabamento, Revestimento, Reboco.
4. Conferir que cada item traz `origem` com link para a calculadora correspondente.

## Cenário 2 — Upload de JSON
1. Clicar em "Importar JSON".
2. Colar o conteúdo de `exemplo.json` → campo `input`.
3. Confirmar que a tabela é preenchida corretamente.

## Cenário 3 — Edição de preços
1. Alterar o preço unitário de "Cimento CP-II" para R$ 50,00.
2. Verificar que o subtotal do item e o total geral recalculam em tempo real.

## Cenário 4 — Sobra e desconto
1. Aplicar 10% de sobra em "Telhas".
2. Aplicar 5% de desconto global.
3. Aplicar 3% de impostos.
4. Conferir a fórmula: `total = (Σ subtotais) × 0,95 × 1,03`.

## Cenário 5 — Export
1. Clicar em "Exportar CSV" e "Exportar JSON".
2. Abrir os arquivos e conferir colunas: `etapa, sku, name, unidade, quantidade, preco_unitario, subtotal`.

## Cenário 6 — Acessibilidade
- Navegar com Tab pelos inputs de preço e sobra.
- Confirmar que o total geral usa `aria-live="polite"`.
