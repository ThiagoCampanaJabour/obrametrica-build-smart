---
title: Plano de teste — Dimensionamento Elétrico
category: construcao-civil
updated: 2026-07-28
---

## Objetivo
Validar cálculos, avisos, overrides e exportações da rota
`/construcao-civil/dimensionamento-eletrico`.

## Passos

1. **Preset residencial**  
   Abrir a página → clicar em *Preset residencial* → *Calcular*.  
   Esperado: 5 circuitos, resumo mostra potência instalada ≈ 12,4 kW e quadro sugerido ≥ 40 A.

2. **Cálculo de corrente**  
   Circuito Chuveiro 4.500 W / 220 V → I ≈ 20,5 A → disjuntor 32 A → bitola 4 mm².

3. **Queda de tensão excessiva**  
   Alterar o comprimento do circuito Chuveiro para 60 m → esperar aviso amarelo indicando
   ΔV > 4% na coluna “Observações”, com valor destacado em vermelho.

4. **Override manual**  
   Preencher *Override bitola (mm²)* = 1,5 num circuito de tomadas → verificar aviso
   “Bitola insuficiente” e “mínimo 2,5 mm² (NBR 5410)”.

5. **Trifásico**  
   Usar o cenário `trifasico_pequeno` de `exemplo.json`. Motor 2.200 W / 380 V / 3φ /
   fp 0,85 → I ≈ 3,9 A → disjuntor 6–10 A.

6. **Export**  
   Clicar *Export CSV* e *Export JSON* → arquivos baixam com o conteúdo dos circuitos e do
   resumo. Abrir no editor e conferir cabeçalhos e valores.

7. **Acessibilidade**  
   Navegar com Tab pelo formulário; conferir que o resumo tem `aria-live="polite"` e que
   labels dos inputs estão associados.

## Itens adiados

- Cálculo de curto-circuito e capacidade de interrupção (kA).
- Coordenação/seletividade entre proteções.
- Fatores de agrupamento e temperatura por método de instalação.
- Dimensionamento de DR, DPS e aterramento.
