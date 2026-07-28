---
title: "Plano de QA — Calculadora de Lajes e Armaduras"
---

## Objetivo

Validar o comportamento funcional, os valores calculados e a acessibilidade básica da rota
`/construcao-civil/calculadora-lajes`.

## Casos de teste (funcionais)

### 1. Laje residencial pequena (Estimativa)
- **Inputs:** tipo=maciça, L=4, W=3, t=0,12; gk=1,5; qk=2,0.
- **Esperado:** área=12 m²; volume=1,44 m³; aço=144 kg; vergalhões=120 m.

### 2. Laje residencial média (Estimativa)
- **Inputs:** tipo=maciça, L=6, W=4, t=0,15.
- **Esperado:** área=24 m²; volume=3,60 m³; aço=360 kg; vergalhões=240 m.

### 3. Laje nervurada (Estimativa)
- **Inputs:** tipo=nervurada, L=6, W=6, mesa=0,05, hn=0,20, bw=0,10, pitch=0,60.
- **Esperado:** volume ≈ (36·0,05) + (10·0,10·0,20·6) = 1,80 + 1,20 = 3,00 m³ (±5%).
- Aço na faixa 180–250 kg (taxa 70 kg/m³).

### 4. Modo Engenharia
- **Inputs:** caso 1 + apoio=simples, fy=500, cobertura=25 mm.
- **Esperado:** M ≈ (1/8)·(2,88+1,5+2,0)·4² ≈ 12,76 kN·m/m; As calculada em cm²/m > 0 e < 20.
- Trocar apoio para “contínua”: M reduz para (1/10) do mesmo produto.

## Edge cases

| Caso | Comportamento esperado |
|---|---|
| L=0 ou W=0 | Warning "Área do painel inválida"; volume 0 |
| t < 0,08 (maciça) | Warning de espessura mínima |
| Vão > 8 m | Warning de simplificação insuficiente |
| Pitch ≤ bw (nervurada) | Warning "passo deve ser maior que largura da alma" |
| Remover último painel | Botão "Remover" oculto quando há apenas 1 painel |

## Exportação
- CSV baixa `lajes.csv` com cabeçalho `painel_id,tipo,L_m,W_m,area_m2,...` e uma linha por painel.
- JSON baixa `lajes.json` com `{ inputs, outputs, custos }` bem formatado.

## Acessibilidade
- Todos os `input`/`select` possuem `<label>` associado por `htmlFor`.
- Resultado em container com `aria-live="polite"` e `role="region"`.
- Warnings em `role="alert"`.

## Como reproduzir

```bash
bun run dev
# abrir http://localhost:8080/construcao-civil/calculadora-lajes
```

Preencha o caso 1 do `exemplo.json` e verifique os cards do resumo. Alterne para o modo
Engenharia e confira que as colunas Mu e As aparecem na tabela.
