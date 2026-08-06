---
title: "Plano de testes — Conversor kW ↔ kWh"
updated: "2026-08-06"
---

# Plano de testes

Suíte automatizada: `src/lib/solar/kwkwh.test.ts` (Vitest). Todas as funções do motor são puras.

## Casos numéricos de referência

| # | Cenário | Entrada | Esperado |
| --- | --- | --- | --- |
| 1 | Residencial SP | 5 kWp, fator 1.500, perdas 14% | 6.450 kWh/ano; PR 0,86; bruto 7.500; perdas 1.050 |
| 2 | Comercial Fortaleza | meta 9.000 kWh/ano, fator 1.850, perdas 14% | 5,66 kWp exatos; 5,7 kWp sugeridos; 12 módulos de 550 W |
| 3 | HE × PR | HE 1.700 h/ano, PR 0,78 | fator 1.326 kWh/kWp/ano; 10 kWp → 13.260 kWh/ano |

## Testes de consistência

- **Reversibilidade:** `powerFromEnergy(energyFromPower(kWp, f, p)) === kWp` para o mesmo par (fator, perdas).
- **Média mensal:** sempre igual à anual dividida por 12.
- **Módulos:** a potência instalada sugerida nunca é inferior à requerida.

## Casos de borda

- Potência ou meta iguais a zero, ou negativas: resultado zero e aviso emitido; nenhuma exceção lançada.
- Fator igual a zero no modo inverso: retorna 0 em vez de `Infinity`, com aviso.
- Perdas acima de 95%: limitadas a 95%, mantendo PR mínimo de 0,05.
- Fator fora da faixa de 800 a 2.200 kWh/kWp/ano: aviso de valor implausível.
- Potência de módulo igual a zero: sugestão retorna quantidade zero.

## Ajuste de inclinação e orientação

- Inclinação igual à latitude e azimute Norte: penalidade menor que 1%.
- Azimute Sul penaliza mais que Norte para a mesma inclinação.
- Telhado plano (0°): resultado idêntico para qualquer azimute.
- Fator base zero: retorna zero.

## Sensibilidade

- Modo direto: os três cenários são estritamente crescentes (conservador < central < otimista).
- Modo inverso: o cenário otimista exige menos potência que o conservador.

## Verificação de interface

- Alternância entre os dois modos troca rótulos e campos sem perder o valor digitado.
- Presets de cidade atualizam fator e horas equivalentes simultaneamente.
- Botões de exemplo preenchem o formulário e recalculam.
- Resultado usa `aria-live="polite"`; a tabela de sensibilidade tem cabeçalhos com `scope`.
- Sem overflow horizontal em viewport de 390 px.
