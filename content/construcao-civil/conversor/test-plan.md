# Plano de QA — Conversor de Unidades Técnicas

Rota: `/construcao-civil/conversor-unidades-tecnicas`
Testes automatizados: `src/lib/conversor/calc.test.ts` (`bunx vitest run`)

## 1. Conversões básicas (exatas ou com tolerância de 1e-8)

| Entrada | Esperado |
| --- | --- |
| 1000 g → kg | 1 |
| 1 m → cm | 100 |
| 1 in → mm | 25,4 |
| 1 psi → Pa | 6 894,757293 |
| 1 BTU/h → W | 0,29307107 |
| 1 kWh → J | 3,6 × 10⁶ |
| 1 kgf → N | 9,80665 |
| 1 MPa → Pa | 1 × 10⁶ |
| 1 kN·m → kgf·m | 101,9716 |
| 1 lb/ft³ → kg/m³ | 16,018463 |

## 2. Temperatura

| Entrada | Esperado |
| --- | --- |
| 0 °C → °F | 32 |
| 100 °C → °F | 212 |
| 0 °C → K | 273,15 |
| −40 °C → °F | −40 |

## 3. Ângulos e inclinação

| Entrada | Esperado |
| --- | --- |
| 45° → % | 100 |
| 100 % → ° | 45 |
| π rad → ° | 180 |

## 4. Conversões compostas

| Operação | Esperado |
| --- | --- |
| 2 m³ × 7 850 kg/m³ | 15 700 kg |
| 1 000 kg ÷ 2 m³ | 500 kg/m³ |

## 5. Parsing

| Entrada | Esperado |
| --- | --- |
| `2.5e3` | 2 500 |
| `3 * (2 + 1)` | 9 |
| `1.2e3/1000` | 1,2 |
| `2,5` | 2,5 |
| `alert(1)` | erro amigável |
| `1/0` | erro "Divisão por zero" |

## 6. Casos limite

- Valores negativos permitidos em temperatura e tensão.
- Valores ≥ 10⁶ ou < 10⁻³ exibidos em notação científica.
- Unidades incompatíveis (m → kg) exibem mensagem amigável, sem quebrar a UI.

## 7. UX e persistência (manual)

- [ ] Histórico grava e restaura após recarregar a página (localStorage `obrametrica:conversor:*`).
- [ ] Botão "Copiar" mostra feedback e funciona em desktop e mobile.
- [ ] Export CSV abre com 7 colunas; JSON válido com `version` e `entries`.
- [ ] Favoritos persistem e aparecem como atalhos no seletor.
- [ ] Modo Preciso/Rápido altera casas decimais imediatamente.
- [ ] Navegação por teclado (Tab/Enter) percorre categoria, unidades e valor.
- [ ] `aria-live` anuncia o resultado ao mudar valor ou unidade.
- [ ] Layout responsivo: colunas empilham abaixo de 768 px.
