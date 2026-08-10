# Inventário de Localização de Campos - Gastos com Mercado

Este documento mapeia os campos essenciais da calculadora de mercado para fins de QA e automação.

## Campos de Entrada (Inputs)

| Categoria | Campo | data-testid | Arquivo | Linha (aprox) |
| :--- | :--- | :--- | :--- | :--- |
| Geral | Orçamento Total | `market-budget-total` | `src/components/Orcamento/MarketExpenses/BudgetInput.tsx` | ~25 |
| Geral | Membros Família | `market-family-members` | `src/components/Orcamento/MarketExpenses/BudgetInput.tsx` | ~40 |
| Categoria | Valor (R$) | `market-cat-<slug>-value` | `src/components/Orcamento/MarketExpenses/CategoryRow.tsx` | ~39 |
| Categoria | Quantidade | `market-cat-<slug>-qty` | `src/components/Orcamento/MarketExpenses/CategoryRow.tsx` | ~68 |

## Mapeamento de Dados e Exportação

| Campo UI | Key no Modelo (TS) | Key no Export (JSON) | Descrição |
| :--- | :--- | :--- | :--- |
| **Valor** | `value_month` | `value_month` | Valor numérico (R$). Sincronizado com `amount`. |
| **Quantidade** | `quantity` | `quantity` | Valor numérico opcional (nullable). |

## Arquivos Relacionados

1.  **Modelo de Dados**: `src/lib/types/budget.ts`
    - Define `MarketCategorySchema` com `value_month` e `quantity`.
2.  **Lógica de Cálculo**: `src/lib/finance/market.ts`
    - Função `normalizeCategories` garante a consistência entre `amount` e `value_month`.
3.  **Componente de Linha**: `src/components/Orcamento/MarketExpenses/CategoryRow.tsx`
    - Implementa os inputs com `data-testid` dinâmicos.
4.  **Exportação**: `src/components/Orcamento/MarketExpenses/ExportButtons.tsx`
    - Mapeia os dados para JSON e CSV, incluindo a nova coluna de quantidade.

## Instruções de Teste

1.  Acesse `/orcamento-domestico/gastos-mercado`.
2.  Localize a categoria "Hortifruti" (ou similar).
3.  Preencha o valor (ex: 250) e a quantidade (ex: 10).
4.  Clique em "Exportar JSON".
5.  Verifique se o JSON contém `value_month: 250` e `quantity: 10` dentro da array de categorias.
