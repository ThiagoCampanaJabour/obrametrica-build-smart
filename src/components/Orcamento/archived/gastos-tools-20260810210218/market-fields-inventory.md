# Inventário de Campos: Calculadora de Gastos com Mercado (Alimentação)

Este documento cataloga todos os campos de entrada, saída e categorias da calculadora de mercado no sistema ObraMétrica.

## Resumo Executivo
- **Total de Inputs:** 7
- **Total de Outputs:** 4 (principais)
- **Categorias Pré-definidas:** 16
- **Status de QA:** Lógica validada via Vitest (`market.test.ts`).

## Tabela de Inputs (Entradas)

| fieldKey | Label | Tipo | Unidade | Obrigatório | Valor Padrão | Origem (Arquivo) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `budgetTotalMonth` | Orçamento Mensal | Number | R$ | Sim | 1500 | `BudgetInput.tsx` |
| `familyMembers` | Membros da Família | Number | Pessoas | Sim | 2 | `MarketExpensesPage.tsx` |
| `annualInflationPct` | Inflação Anual | Number | % | Não | 5.5 | `MarketExpensesPage.tsx` |
| `projectionYears` | Anos de Projeção | Number | Anos | Não | 10 | `MarketExpensesPage.tsx` |
| `categories.name` | Nome da Categoria | Text | - | Sim | "Nova Categoria" | `CategoryRow.tsx` |
| `categories.amount` | Valor Mensal | Number | R$ | Não | 0 | `CategoryRow.tsx` |
| `categories.quantity` | Qtd/Frequência | Number | un | Não | 0 | `CategoryRow.tsx` |

## Tabela de Outputs (Saídas/Resultados)

| outputKey | Label | Fórmula / Função | Unidade | Gatilhos |
| :--- | :--- | :--- | :--- | :--- |
| `monthlyTotal` | Total Categorias | `sum(amounts)` | R$ | `categories.amount` |
| `perCapitaMonth` | Per Capita | `monthlyTotal / members` | R$ | `monthlyTotal`, `familyMembers` |
| `remainingBudget` | Saldo | `budget - total` | R$ | `budgetTotalMonth`, `monthlyTotal` |
| `projection` | Projeção Anual | `FV = PV * (1 + i)^n` | R$ | `inflation`, `years`, `total` |

## Lista de Categorias Pré-definidas (Presets)
Localização: `content/finance/presets.json`

1. **Hortifruti** (Frutas, Legumes, Verduras)
2. **Proteínas** (Carnes, Frango, Peixe, Frios)
3. **Grãos** (Arroz, Feijão, Farinha, Aveia)
4. **Massas** (Macarrão, Lasanhas)
5. **Laticínios** (Leite, Queijos, Iogurtes)
6. **Padaria** (Pães & Assados)
7. **Bebidas** (Água, Refrigerantes, Sucos)
8. **Doces** (Chocolates, Balas)
9. **Biscoitos & Snacks**
10. **Café & Chás**
11. **Temperos** (Óleos, Condimentos)
12. **Congelados** (Pratos Prontos)
13. **Higiene Pessoal**
14. **Limpeza Doméstica**
15. **Pet Food**
16. **Outros Itens**

## Ações de Reconciliação
Implementadas em `src/lib/finance/market.ts` (função `reconcileMarketBudget`):
- **scale-categories:** Ajusta os valores das categorias proporcionalmente para caber no orçamento total.
- **adjust-budget:** Atualiza o orçamento total para a soma exata das categorias inseridas.

## Mapeamento de Exportação (JSON/CSV)
- **JSON:** Exporta o objeto completo `input` e `result`.
- **CSV:** Mapeia `categoryBreakdown` (Nome, Valor, %) e `projection` (Ano, Valor, Variação).
- **Alerta:** O campo `categories.quantity` está presente no JSON mas **ausente** no export CSV [RECOMENDAÇÃO: Adicionar ao CSV].

## Notas de UI/Acessibilidade & Testes
- **Acessibilidade:** Inputs utilizam classes padrão Tailwind. Necessário adicionar labels explícitos com `htmlFor` e `id` únicos para melhor suporte a leitores de tela.
- **Testes:** Os campos não possuem `data-testid` explícitos.
- **Fontes:** Presets marcados com `[FONTE_A_VERIFICAR]` (baseados em benchmarks POF/IBGE 2024 adaptados).

---
**Próximos Passos:**
1. Implementar `data-testid` em todos os inputs listados.
2. Unificar `remainingBudget` no export CSV.
3. Adicionar validação de teto para `annualInflationPct` (> 100% gera alerta).
