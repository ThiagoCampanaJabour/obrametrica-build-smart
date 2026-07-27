---
title: "Método de Cálculo — Calculadora de Telhas"
description: "Entenda as fórmulas, suposições e exemplos numéricos por trás da Calculadora de Telhas."
---

## Como os cálculos funcionam

### Fórmulas principais

A calculadora parte da **área horizontal** (plantada) e projeta a superfície inclinada do telhado:

```
Área projetada = Área horizontal × (1 / cos(θ))
```

Onde `θ` é a inclinação convertida de graus para radianos (`θ_rad = θ × π / 180`). O cosseno aparece porque a área real da cobertura cresce à medida que o telhado fica mais inclinado.

Com a área projetada, estimamos a quantidade de telhas:

```
Número de telhas = Área projetada / Área útil da telha
```

Por fim, aplicamos o desperdício:

```
Total com desperdício = Número de telhas × (1 + desperdício / 100)
```

### Suposições e presets

A ferramenta usa valores editáveis para facilitar o uso:

- **Área útil padrão de telha cerâmica**: 0,50 m² por unidade (varia com marca e modelo).
- **Área útil padrão de telha de fibrocimento**: 1,10 m² por unidade.
- **Desperdício padrão**: 10%.

Sempre confirme as dimensões exatas da telha escolhida com o fabricante ou fornecedor.

### Exemplo prático

Suponha um telhado com:

- Área horizontal = 50 m²
- Inclinação = 20°
- Área útil da telha = 0,50 m²
- Desperdício = 10%

**Passo a passo:**

1. Converter inclinação: `20° × π / 180 ≈ 0,349 rad`.
2. Calcular área projetada: `50 × (1 / cos(0,349)) ≈ 50 × 1,064 = 53,2 m²`.
3. Número base de telhas: `53,2 / 0,50 ≈ 106,4` → arredondamos para **107 telhas**.
4. Com 10% de desperdício: `107 × 1,10 ≈ 117,7` → **118 telhas** no total.

### Limitações e alertas

O resultado é uma estimativa para planejamento de compra. Cortes, encaixes, beirais, dutos, claraboias e geometria complexa podem aumentar o desperdício. Confirme as medidas no local e consulte um profissional antes da execução.

Quer mais detalhes? Leia a página completa de [Metodologia](/metodologia).
