---
title: Metodologia — Calculadora de Mão de Obra
description: Fórmulas, suposições e presets utilizados no cálculo de horas-homem e custo de mão de obra.
---

## Fórmulas

Para cada item de serviço, a calculadora aplica:

- `hours_total = quantity × productivity_h_per_unit × difficulty_factor`
- `hours_per_worker = hours_total / num_workers`
- `days_total = hours_per_worker / shift_hours`
- `cost_total = hours_total × cost_per_hour`
- `cost_per_unit = cost_total / quantity` (quando `quantity > 0`)

O fator de dificuldade ajusta a produtividade de acordo com a complexidade da frente de trabalho:

- **Normal:** 1,00 (referência)
- **Difícil:** 1,10 (+10%)
- **Muito difícil:** 1,25 (+25%)

## Presets de produtividade

Os presets de produtividade (`productivity-presets.json`) trazem valores típicos de mercado brasileiros para equipes qualificadas, medidos em horas-homem por unidade:

| Serviço | Unidade | h/un |
|---|---|---|
| Reboco interno | m² | 0,17 |
| Reboco externo | m² | 0,20 |
| Alvenaria de blocos | m² | 0,67 |
| Assentamento de piso | m² | 0,125 |
| Pintura (2 demãos) | m² | 0,05 |
| Concretagem | m³ | 5,00 |
| Montagem de armaduras | kg | 0,05 |
| Instalação de telhas | m² | 0,30 |
| Ponto elétrico | un | 0,75 |
| Ponto hidráulico | un | 1,00 |

Os valores derivam de referências como TCPO, SINAPI e boas práticas de campo. São **estimativas**: variam com equipe, ferramentas, projeto e condições da obra. Todos os campos são editáveis na interface.

## Custo por hora

O custo padrão por hora (R$/h) considera o salário-hora do profissional acrescido de encargos sociais e benefícios (aproximadamente 80–100% sobre o salário base). Ajuste conforme o piso salarial da categoria (SINDUSCON local) e o regime de contratação (CLT, terceirizado, empreitada).

## Agrupamento e integração

Itens são agrupados por etapa para permitir subtotais de horas e custo. A calculadora aceita `import` de quantitativos no formato `{ service, quantity, unit }` — o mesmo padrão usado pelas demais calculadoras da ObraMétrica —, o que permite alimentar automaticamente o orçamento de mão de obra a partir dos resultados das calculadoras de materiais.

## Como interpretar

Os resultados representam o **esforço direto** de mão de obra: não incluem improdutividades por chuva, faltas, retrabalho ou tempo de montagem de andaimes. Para orçamentos executivos, aplique uma margem adicional de 10–20% sobre `hours_total`.
