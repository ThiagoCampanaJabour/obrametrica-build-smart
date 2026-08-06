---
title: "Metodologia — Iluminação Natural e Sombras em Fachadas"
descricao: "Fórmulas, presets, suposições e limitações do simulador heurístico de luz natural."
atualizado: "2026-08-06"
---

## Escopo

O simulador é uma ferramenta heurística de apoio à decisão conceitual. Não realiza ray tracing,
não modela inter-reflexões internas e não considera a geometria tridimensional real do entorno.
Todos os valores devem ser lidos como ordens de grandeza.

## 1. Área de vidro e transmitância efetiva

```
A_vidro = largura_janela × altura_janela
Tv_efetivo = Tv_vidro × fator_pelicula
```

Transmitâncias luminosas adotadas: vidro simples 0,80; duplo 0,65; low-e 0,50; refletivo 0,30.
Fatores de película: leve 0,85; média 0,70; forte 0,50.

## 2. Daylight factor (DF)

```
DF (%) = 100 × Tv_efetivo × (A_vidro / A_ambiente) × GF × MF × F_obstrucao × F_albedo
GF = min(1; 0,8 × (altura_janela / profundidade) × (largura_janela / √A_ambiente))
```

- **GF (fator geométrico)** aproxima o efeito conjunto da abertura relativa e da profundidade do
  ambiente. Vãos altos iluminam mais fundo que vãos largos e baixos, daí a razão
  `altura_janela / profundidade`.
- **MF (fator de manutenção)** = 0,80, cobrindo sujeira e envelhecimento do vidro.
- **F_obstrucao**: sem obstrução 1,00; parcial 0,70; severa 0,40.
- **F_albedo**: acabamento interno claro 1,15; médio 1,00; escuro 0,85.

Interpretação usual: DF acima de 2% indica boa iluminação natural para escritórios e salas de
aula; entre 1% e 2% é aceitável para uso residencial; abaixo de 1% o ambiente depende de luz
artificial; acima de 6% há risco de ofuscamento e ganho térmico excessivo.

## 3. Iluminância interna — dois métodos

**Método A — por DF (céu encoberto de referência):**

```
E_interna = DF (%) × E_externa_encoberto / 100
```

`E_externa_encoberto` vem do preset da cidade (4.800 a 5.800 lux).

**Método B — por irradiância incidente (hora a hora):**

```
E_interna = Tv_efetivo × A_vidro × I_liquida × 120 / A_ambiente × MF × F_albedo × F_obstrucao
```

A constante 120 corresponde à conversão simplificada `1 W/m² ≈ 120 lux`, valor usual para luz
solar de banda larga. É uma aproximação: a eficácia luminosa real varia de cerca de 100 lm/W
(direta com sol baixo) a 130 lm/W (difusa). Os dois métodos são exibidos ao usuário para deixar a
incerteza visível.

## 4. Posição solar e irradiância na fachada

A altura solar segue um perfil senoidal entre 6h e 18h, com pico limitado por
`90 − 0,55 × |latitude|`. O azimute varia de leste ao nascer, passa pelo Norte ao meio-dia
(hemisfério sul) e chega a oeste ao pôr do sol. Na superfície vertical:

```
I_direta = DNI × cos(altura) × cos(Δazimute)     (quando positivo)
I_difusa = 0,5 × difusa_horizontal + 0,2 × 0,5 × (global_horizontal)
```

com fator sazonal mensal entre 0,87 (junho) e 1,06 (dezembro). Os valores de DNI e difusa de pico
por cidade estão em `presets.json`.

## 5. Proteções solares

A transmissão remanescente é combinada multiplicativamente:

```
reducao = 1 − (1 − beiral) × (1 − brise_h) × (1 − brise_v) × (1 − persiana)
beiral   = clamp((d / h_janela) × 0,60; 0; 0,85) × f_sol_alto
brise_h  = clamp((d / h_janela) × 0,75; 0; 0,85) × f_sol_alto
brise_v  = clamp((w / h_janela) × 0,90; 0; 0,80) × (0,4 + 0,6 × f_sol_rasante) × f_obliquidade
```

`f_sol_alto = altura_solar / 75` (limitado a 1) traduz o fato de que elementos horizontais só são
eficazes com o sol alto; brises verticais atuam sobre o sol rasante e oblíquo. A película atua
sobre Tv (afetando também o DF), enquanto a persiana interna reduz apenas a componente direta.

## 6. Ofuscamento

O indicador usa a irradiância direta efetivamente transmitida:

```
glare = I_direta_liquida × Tv_efetivo
glare ≥ 200 W/m²  → risco alto
glare ≥  90 W/m²  → risco médio
```

Trata-se de um indicador aproximado. Métricas normativas como DGP e UGR exigem simulação
detalhada com a posição real do observador.

## 7. Limitações declaradas

- Sem inter-reflexão interna, prateleira de luz ou dutos solares.
- Sem geometria 3D de entorno; a obstrução é tratada por fator global.
- Presets de irradiância representam céu limpo médio, não série climática horária (TMY).
- Não substitui verificação de conforto térmico nem cálculo de carga de refrigeração.

Para projeto executivo ou comprovação normativa, utilize Radiance, Daysim ou DIALux e consulte um
profissional habilitado.
