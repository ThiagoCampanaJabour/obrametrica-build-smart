---
title: "Metodologia — Andaimes e Escoras"
slug: "andaimes-metodologia"
categoria: "construcao-civil"
atualizado: "2026-08-06"
---

## Escopo

O motor de cálculo (`src/lib/andaimes/calc.ts`) trabalha por trechos retangulares. Cada trecho representa uma fachada, parede ou lance de estrutura com largura e altura próprias. Fachadas em L, recuos e sacadas devem ser decompostos em trechos independentes, somados ao final.

## Fórmulas básicas

O ponto de partida é a modulação comercial do sistema escolhido:

- `n_niveis = teto(altura_m ÷ espacamento_vertical_m)`
- `n_modulos_por_nivel = teto(largura_m ÷ largura_modulo_m)`
- `n_modulos_base = n_niveis × n_modulos_por_nivel`
- `area_plataforma_m2 = n_modulos_base × largura_modulo_m × profundidade_plataforma_m`
- `n_plataformas = teto(area_plataforma_m2 ÷ area_painel_comercial_m2)`

Os arredondamentos são sempre para cima: não existe meio módulo comercial, e o último módulo de cada nível cobre a sobra de largura mesmo quando parcialmente utilizado.

## Peças complementares

Diagonais, travessas, guarda-corpos e sapatas são derivados de fatores por módulo definidos nos presets:

- `diagonais = teto(n_modulos_base × fator_diagonal × fator_carga)`
- `travessas = teto(n_modulos_base × fator_travessa × fator_carga)`
- `guarda_corpos = teto(n_modulos_base × fator_guarda_corpo)`
- `sapatas = teto(n_modulos_por_nivel × sapatas_por_modulo_base + extra_por_largura)`
- `ancoragens = teto(area_fachada_m2 ÷ ancoragem_cada_m2)`

A sapata extra é acrescentada quando a largura do trecho ultrapassa 4 m, situação em que o alinhamento da base exige apoios intermediários. As ancoragens só existem em sistemas de fachada; escoramentos não as utilizam.

## Fator de carga de trabalho

A carga prevista altera a densidade de travamento, não o número de módulos:

| Carga | Uso típico | Fator |
| --- | --- | --- |
| Leve | Pintura, limpeza, inspeção | 1,00 |
| Média | Revestimento, reboco, instalações | 1,15 |
| Pesada | Alvenaria, estrutural, içamento | 1,30 |

O fator multiplica diagonais e travessas, que são os elementos responsáveis pela estabilidade lateral sob carga.

## Escoramento

Nos presets de escoramento (metálico e madeira), a quantidade é proporcional à área escorada:

`escoras = teto(area_m2 × escoras_por_m2 × fator_carga × (1 + margem))`

O valor padrão é 0,7 escora/m² para o sistema metálico e 1,0 escora/m² para madeira, compatível com lajes residenciais correntes e pé-direito até 3 m. Lances maiores exigem torres com travamento horizontal e devem ser verificados em projeto.

## Margem de segurança

Toda quantidade final passa por `quantidade_final = teto(quantidade_base × (1 + margem_pct/100))`. O padrão é 10%, adequado para obras curtas. Recomenda-se 15% em obras longas, com muitas remontagens ou histórico de avarias e extravios de peças.

## Alertas

O cálculo emite avisos quando:

- a altura atinge o limite do sistema (12 m para andaimes de fachada, 6 m para escoramento metálico, 4 m para madeira): exige projeto de montagem assinado;
- a carga informada é pesada: sugere reforço ou consulta técnica;
- a largura de módulo configurada excede 4 m: recomenda apoios intermediários;
- o arranjo passa de 6 níveis: exige acessos internos e linha de vida.

## Limitações conhecidas

Não são considerados: ação do vento, excentricidade de cargas, fundação e capacidade do solo, andaimes suspensos ou em balanço, interferências (marquises, telhados, redes elétricas) e otimização de aproveitamento entre trechos. O resultado é um quantitativo de planejamento; a responsabilidade técnica da montagem permanece com a empresa executora.
