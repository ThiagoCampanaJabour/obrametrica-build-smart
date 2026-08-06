---
title: "Exemplo de uso — Conversor kW ↔ kWh"
updated: "2026-08-06"
---

# Exemplo de uso

## Exemplo A — residencial: de kWp para kWh

Cliente em São Paulo com telhado voltado ao Norte e inclinação de 20°, sistema de 5 kWp.

1. Selecione a direção **kWp → kWh/ano**.
2. Informe `5` no campo de potência instalada.
3. Escolha **São Paulo (SP)** — o preset carrega o fator de 1.500 kWh/kWp/ano.
4. Mantenha as perdas em **14%** (Padrão, PR = 0,86).
5. Leia o resultado.

```text
5 kWp × 1.500 kWh/kWp/ano × 0,86 = 6.450 kWh/ano
Média mensal ≈ 537 kWh/mês
```

Abrindo "Mostrar cálculo detalhado", a energia bruta aparece como 7.500 kWh/ano e as perdas como 1.050 kWh/ano.

Faixa de sensibilidade apresentada: aproximadamente 5.468 kWh/ano no cenário conservador e 7.508 kWh/ano no otimista. Apresente essa faixa ao cliente.

## Exemplo B — comercial: de kWh para kWp

Estabelecimento em Fortaleza com consumo anual de 9.000 kWh.

1. Selecione **kWh/ano → kWp**.
2. Informe `9000` na meta de geração.
3. Escolha **Fortaleza (CE)** — fator de 1.850 kWh/kWp/ano.
4. Perdas em **14%**, módulo de **550 W**, reserva de **3%**.

```text
Denominador = 1.850 × 0,86 = 1.591 kWh/kWp/ano
Potência exata = 9.000 ÷ 1.591 ≈ 5,66 kWp
Potência sugerida = 5,7 kWp
Módulos = teto(5.657 W ÷ 550 W) = 11 → com 3% de reserva = 12 módulos (6,6 kWp)
```

## Exemplo C — fator próprio a partir de HE e PR

Projeto em local sem preset, com 1.700 horas equivalentes anuais medidas e PR conservador de 0,78, para 10 kWp.

1. Selecione **kWp → kWh/ano** e informe `10`.
2. Em origem do fator, escolha **HE × PR**.
3. Informe `1700` em horas equivalentes e `0.78` no Performance Ratio.
4. Ajuste as perdas para **0%** — o PR informado já contém as perdas, e mantê-las aplicaria o desconto duas vezes.

```text
Fator = 1.700 × 0,78 = 1.326 kWh/kWp/ano
Energia = 10 × 1.326 × 1,00 = 13.260 kWh/ano
```

## Exportando o resultado

O botão **Copiar resultado** coloca a linha de cálculo na área de transferência, pronta para colar em uma proposta. O botão **Exportar JSON** baixa um arquivo com todas as entradas, o fator efetivo aplicado, os resultados e a tabela de sensibilidade — útil para anexar a memória de cálculo ao documento comercial.
