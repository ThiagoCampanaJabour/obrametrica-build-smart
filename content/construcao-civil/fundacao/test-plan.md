---
title: "Plano de Testes — Fundação e Sapatas"
description: "Passos manuais de QA para a calculadora de fundação rasa."
---

## Cenários

### 1. Sapata isolada (padrão)
- Inputs: P=300 kN, n=8, σ=150 kN/m², FS=2, kg/m³=100.
- Esperado: L=2,00 m, H=0,50 m, V_total=16,0 m³, aço_total=1600 kg, forma_total=32,0 m².

### 2. Sapata corrida (baldrame)
- Inputs: q=40 kN/m, L=30 m, σ=200, FS=2, kg/m³=100.
- Esperado: b=0,40 m, H=0,30 m (mínimo), V_total=3,6 m³, aço_total=360 kg, forma_total=18,0 m².

### 3. Edge cases
- Capacidade do solo = 50 kN/m² → alerta "muito baixa".
- Lado calculado < 0,60 m → alerta "abaixo do mínimo prático".
- Preencher número de pilares = 0 → bloqueado pelo `min=1`.
- Cargas = 0 → alerta "deve ser maior que zero".

### 4. Exportação
- Exportar JSON → arquivo com `inputs` + `outputs`.
- Exportar CSV → linhas por sapata (isolada) ou trecho (corrida).

### 5. UX
- Trocar preset de solo atualiza `σ_adm`.
- Editar σ manualmente muda preset para "Personalizado".
- Alerts aparecem em `role="alert"` acessível.
- Botão "Limpar" restaura defaults e esconde resultados.
