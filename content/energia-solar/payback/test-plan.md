---
title: Plano de teste — Calculadora de Payback
description: Passos manuais de QA para validar cálculos, exportação e comparação de cenários.
---

## Pré-condições

- `bun run dev` rodando; abrir `http://localhost:8080/energia-solar/calculadora-payback`.

## Cenário 1 — Cálculo padrão

1. Manter valores padrão do formulário.
2. Clicar em **Calcular**.
3. Verificar:
   - Payback simples ≈ 3 anos.
   - Payback descontado > Payback simples.
   - VPL positivo.
   - TIR > taxa de desconto informada.
   - Tabela mostra 25 linhas.

## Cenário 2 — Comparar cenários

1. Clicar em **Comparar cenários**.
2. Conferir tabela com 3 linhas (Conservador / Padrão / Otimista).
3. Otimista deve ter menor payback e maior VPL.

## Cenário 3 — Exportação

1. Após calcular, clicar em **Exportar CSV**.
2. Abrir o arquivo em planilha; conferir cabeçalho e 25 linhas.
3. Clicar em **Exportar JSON** e validar em https://jsonlint.com.

## Cenário 4 — Entradas inválidas

1. Zerar produção anual e clicar em **Calcular**.
2. Verificar que fluxo é dominado por O&M e que TIR retorna `—`.

## Cenário 5 — Sensibilidade

1. Aumentar taxa de desconto para 20 %.
2. VPL deve cair; payback descontado deve aumentar.

## Aceitação

- Todos os cenários passam sem erros de console.
- Layout responsivo em 375 px de largura.
- Acessibilidade: tabela navegável por teclado, `aria-live` presente.
