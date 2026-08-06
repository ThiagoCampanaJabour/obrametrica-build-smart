---
title: "Plano de testes — Andaimes e Escoras"
slug: "andaimes-test-plan"
categoria: "construcao-civil"
atualizado: "2026-08-06"
---

## Como executar

```bash
bunx vitest run src/lib/andaimes/calc.test.ts
```

Rota manual: `http://localhost:8080/construcao-civil/andaimes-escoras`

## Testes funcionais (motor puro)

| # | Cenário | Entrada | Esperado |
| --- | --- | --- | --- |
| 1 | Caso 1 do `exemplo.json` | L=10 m, H=6 m, leve, módulo 2,0 m, spacing 2,0 m, margem 10% | níveis=3, módulos/nível=5, base=15, total=17, plataforma=22,5 m², sem alertas |
| 2 | Caso 2 do `exemplo.json` | L=20 m, H=12 m, média | níveis=6, módulos/nível=10, base=60, total=66, alerta de altura |
| 3 | Escoramento | sistema `escora-metalica`, L=8 m, H=3 m, pesada | escoras > 0, guarda-corpos = 0, alerta de carga pesada |
| 4 | Múltiplos trechos | dois trechos idênticos ao caso 1 | totais somados (34 módulos), lista consolidada agregada por item |
| 5 | Alteração de preset | módulo 1,5 m no caso 1 | módulos/nível = 7, recálculo imediato |
| 6 | Margem | base 15, margem 10% | 17 (teto) |
| 7 | Validação | largura 0 ou altura 500 | mensagem de erro específica; `null` para entrada válida |

## Testes de UI

- Adicionar e remover trechos mantém os demais intactos; o botão remover some com um único trecho.
- Resultado aparece somente após "Calcular"; erros de validação substituem o painel de resultado.
- Exportar CSV e JSON baixam arquivos com todos os itens por trecho e o consolidado.
- "Copiar para orçamento" mostra feedback "Copiado!" por 2 s.
- Responsividade: formulário em coluna única no mobile, duas colunas a partir de `sm`.
- Acessibilidade: todos os inputs têm label associado; painel de resultados usa `aria-live="polite"`; alertas usam `role="alert"`; preview 2D tem `role="img"` com descrição.

## Regressão

- `bunx tsgo --noEmit` sem erros.
- Rota presente em `src/routes/sitemap[.]xml.ts` e no card de `/construcao-civil`.
