---
title: "Metodologia — Comparador de Sistemas Solares"
description: "Fórmulas, premissas típicas e limitações do comparador on-grid, off-grid e híbrido."
---

## Fluxo de caixa

Para cada sistema simulamos um fluxo anual de 25 anos:

- **Produção líquida** = produção anual × (1 − perdas − (1 − eficiência do inversor))
- **Receita anual** = produção × tarifa × %uso local
- **O&M** = % configurável do investimento inicial
- **Fluxo líquido** = receita − O&M − eventual reposição de banco de baterias
- **VPL** = Σ (fluxo / (1+r)ⁿ) − investimento
- **TIR** = taxa que zera o VPL (cálculo por bissecção)

## Banco de baterias (off-grid e híbrido)

`banco_kWh = consumo_médio_hora × horas_autonomia × 1,2 ÷ DoD`

- Off-grid usa todas as horas de autonomia informadas.
- Híbrido considera 60% dessas horas (a rede supre o restante).
- Reposição do banco a cada `vida_bateria` anos é somada ao O&M.

## Valores típicos de mercado

| Item | Valor default | Faixa comum |
| --- | --- | --- |
| Custo do sistema | R$ 5.000/kWp | R$ 4.000 – 6.500/kWp |
| Bateria Li-ion | R$ 1.800/kWh | R$ 1.200 – 2.500/kWh |
| Profundidade de descarga (DoD) | 80% | 70 – 90% |
| Eficiência do inversor | 95% | 92 – 97% |
| Perdas do sistema | 10% | 8 – 15% |
| Degradação anual | 0,7%/ano | 0,4 – 1,0%/ano |
| Vida útil da bateria | 10 anos | 8 – 15 anos |

## Cobertura e economia

- **Cobertura** = min(100%; produção_líquida / consumo_anual)
- **Economia anual** = produção_líquida × tarifa × %uso local

## Limitações

- Modelo determinístico — não simula estocasticidade de irradiação nem
  variações mensais de tarifa.
- Considera apenas uma bateria com custo por kWh; sistemas com múltiplos
  bancos ou tecnologias distintas exigem análise específica.
- Incentivos fiscais e eventuais tarifas de disponibilidade não são incluídos
  por padrão; ajuste O&M/investimento para refletir sua região.
- Recomendação textual é heurística; use-a como ponto de partida, não como
  parecer técnico.
