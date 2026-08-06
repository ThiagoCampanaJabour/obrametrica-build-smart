---
title: "Metodologia — perda de carga em tubulações"
description: "Equações, hipóteses, faixas de validade e referências usadas no cálculo de perdas por atrito."
slug: "hidraulica-metodologia"
updated: "2026-08-06"
---

## Escopo

O módulo calcula perda de carga contínua (atrito) e localizada em condutos forçados circulares
conduzindo água líquida, em regime permanente e seção plena. Todas as contas internas são feitas em
unidades SI (m, m³/s, Pa, kg/m³, Pa·s); a interface aceita entradas em L/s, m³/h, gpm, mm e
polegadas e converte antes do cálculo.

## Propriedades do fluido

A massa específica ρ(T) e a viscosidade dinâmica μ(T) da água são obtidas por interpolação linear de
tabela entre 0 °C e 100 °C. Valores de referência a 20 °C: ρ = 998,2 kg/m³ e μ = 1,002 × 10⁻³ Pa·s.

## Cinemática e regime de escoamento

A velocidade média vem da continuidade:

```text
V = Q / A ,  A = π D² / 4  →  V = 4Q / (π D²)
```

O número de Reynolds classifica o regime:

```text
Re = ρ V D / μ
```

- Re < 2000: laminar. O fator de atrito é resolvido analiticamente por `f = 64/Re`; Colebrook não é
  aplicado.
- 2000 < Re < 4000: transição. O cálculo prossegue, mas a ferramenta emite aviso de incerteza
  elevada, porque nenhuma correlação é confiável nessa faixa.
- Re > 4000: turbulento. Faixa de validade das correlações abaixo.

## Darcy-Weisbach

A equação geral, válida para qualquer fluido newtoniano e qualquer regime, é:

```text
hf = f · (L/D) · V² / (2g) ,  g = 9,80665 m/s²
```

O fator de atrito `f` depende de Re e da rugosidade relativa ε/D. Duas opções estão disponíveis:

**Colebrook-White** (implícita, referência do diagrama de Moody):

```text
1/√f = −2 log10( ε/(3,7 D) + 2,51 / (Re √f) )
```

A implementação resolve a equação por Newton-Raphson na variável `x = 1/√f`, cuja função objetivo
`F(x) = x + 2 log10(k + 2,51x/Re)` é suave e monotônica, garantindo convergência rápida. O chute
inicial vem de Swamee-Jain, a tolerância é 10⁻¹⁰ e o limite é 60 iterações. Se a iteração divergir
ou não convergir, o resultado retorna ao valor de Swamee-Jain e o usuário é avisado.

**Swamee-Jain** (explícita, erro típico < 1,5% frente a Colebrook):

```text
f = 0,25 / [ log10( ε/(3,7 D) + 5,74 / Re^0,9 ) ]²
```

Válida para 5 × 10³ < Re < 10⁸ e 10⁻⁶ < ε/D < 10⁻².

## Hazen-Williams

Correlação empírica consagrada para água em temperatura ambiente e escoamento turbulento:

```text
hf = 10,67 · L · Q^1,852 / ( C^1,852 · D^4,871 )   [m, com L e D em m e Q em m³/s]
```

O coeficiente C depende apenas do material (PVC ≈ 150, ferro fundido ≈ 120, aço ≈ 100–120) e não
considera viscosidade — por isso a fórmula só é confiável para água entre ~4 °C e 30 °C, velocidades
entre 0,6 e 3,0 m/s e diâmetros acima de ~50 mm. Fora dessas faixas, a ferramenta recomenda
Darcy-Weisbach. Quando Hazen-Williams é selecionado, o fator de atrito não é exibido, pois a
formulação não o utiliza.

## Perdas localizadas

Cada peça (curva, tê, válvula, entrada, saída) é somada pelo método dos coeficientes K:

```text
h_local = Σ (K_i · n_i) · V² / (2g)
```

Os coeficientes dos presets são valores médios de literatura para peças comerciais com escoamento
plenamente turbulento e podem ser editados. Em ramais prediais curtos, as perdas localizadas
costumam representar de 20% a 50% da perda total, e nunca devem ser desprezadas.

## Trechos em série e altura manométrica

Trechos são calculados isoladamente, cada um com seu diâmetro, comprimento, material e vazão, e
somados:

```text
H_total = Σ hf_i + Σ h_local_i + Δz
```

`Δz` é a diferença de cota entre a descarga e a sucção (positiva em recalque). A potência requerida
é estimada por:

```text
P_hidráulica = ρ · g · Q · H_total   [W]
P_elétrica   = P_hidráulica / η      (η padrão = 0,60 para o conjunto motobomba)
```

## Limitações

Não são modelados: escoamento transiente e golpe de aríete, redes malhadas, condutos não circulares,
escoamento com ar incorporado, cavitação/NPSH, fluidos não newtonianos e envelhecimento da
tubulação (incrustação aumenta ε e reduz C ao longo da vida útil). Os resultados são estimativas de
anteprojeto.

## Referências

Munson, Young & Okiishi — *Fundamentals of Fluid Mechanics*; White, F. M. — *Fluid Mechanics*;
Colebrook, C. F. (1939); Swamee, P. K. & Jain, A. K. (1976); ABNT NBR 5626 (instalações prediais de
água fria); ABNT NBR 12218 (redes de distribuição).
