---
title: "Plano de QA — Perdas Térmicas e HVAC"
description: "Roteiro de validação funcional, numérica e de acessibilidade da calculadora de HVAC."
---

# Plano de teste

## Ambiente local

```bash
bun install
bun run dev
# abrir http://localhost:8080/construcao-civil/hvac-perdas
```

## 1. Modo Rápido — validação numérica

1. Carregar cada caso de `exemplo.json` manualmente no formulário.
2. Conferir os valores de `Q_trans_kW`, `Q_solar_kW`, `Q_people_kW`,
   `Q_equip_kW`, `Q_vent_kW` e `Q_total_kW` contra o campo `outputs` do arquivo
   (tolerância de ±1% para arredondamento).
3. Verificar que a capacidade sugerida corresponde à menor capacidade comercial
   maior ou igual a `Q_with_margin_kW × 3412,14`.

## 2. Modo Avançado

1. Alternar para "Avançado" e informar U-values explícitos (ex.: parede 2,0;
   cobertura 1,5; janela 5,0).
2. Recalcular manualmente `Σ U·A·ΔT` com a geometria exibida no detalhamento e
   comparar com `Q_trans`.
3. Alterar sombreamento de 0% para 50% e confirmar que `Q_solar` cai pela metade.
4. Alterar ACH e confirmar que a vazão adotada é a maior entre por pessoa e por ACH.

## 3. Conversões e seleção de equipamento

- 1 kW deve resultar em 3.412 BTU/h (±1).
- Carga com margem de 2,7 kW deve sugerir 9.000 BTU/h; 3,0 kW deve sugerir 12.000 BTU/h.
- Carga acima de 17,58 kW deve exibir aviso de múltiplas máquinas / VRF.

## 4. Casos de borda

| Caso | Esperado |
| --- | --- |
| Área < 4 m² | Aviso "resultado pouco representativo" |
| Área de vidro > 50% da fachada exposta | Aviso de proteção solar |
| T_ext ≤ T_int (ΔT ≤ 0) | Aviso de ΔT não positivo, sem valores negativos nos cards |
| Ocupantes = 0 | Ventilação regida apenas pelo ACH |
| Equipamentos = 0 | Preset W/m² aplicado e citado no passo a passo |

## 5. Exportações

- CSV: uma linha por ambiente + linha TOTAL; colunas de breakdown completas.
- JSON: contém `inputs` (estado do formulário) e `outputs` (resultado com passos).
- "Gerar relatório" abre o diálogo de impressão do navegador.

## 6. Acessibilidade e responsividade

- Navegação completa por teclado (Tab/Shift+Tab) em todos os campos e botões.
- Todos os inputs possuem `label` associado por `htmlFor`.
- O resumo possui `aria-live="polite"` e anuncia a atualização dos totais.
- Botão "Detalhar" expõe `aria-expanded`.
- Layout verificado em 375 px, 768 px e 1280 px sem overflow horizontal.

## 7. Regressão

- `bunx tsgo --noEmit` sem erros.
- Rota responde 200 em SSR (`curl -I http://localhost:8080/construcao-civil/hvac-perdas`).
- Página listada em `/construcao-civil` e no `sitemap.xml`.
