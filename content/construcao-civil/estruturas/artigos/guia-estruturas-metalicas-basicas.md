---
title: "Guia prático: estruturas metálicas básicas na fase conceitual"
description: "Como estimar perfis metálicos para vigas e pórticos, com exemplos numéricos passo a passo e os erros mais comuns."
date: "2026-08-06"
category: "construcao-civil"
---

# Guia prático: estruturas metálicas básicas na fase conceitual

> Ferramenta de estimativa — não substitui projeto estrutural ou cálculo executivo. Todas as
> recomendações devem ser verificadas por engenheiro estrutural responsável antes da fabricação e
> montagem.

Na fase conceitual de um projeto em aço, três perguntas aparecem antes de qualquer detalhamento:
que altura de perfil o vão vai pedir, quanto aço isso representa em quilos e se o orçamento fecha.
Responder a essas perguntas com ordem de grandeza correta muda decisões de arquitetura, de layout de
pilares e de proposta comercial. É exatamente esse o papel da calculadora de Estruturas Metálicas
Básicas.

## O caminho do cálculo, em quatro passos

**1. Levantar a carga.** Some peso próprio da laje ou telha, revestimentos, forro, instalações e
sobrecarga de uso, e transforme isso em carga linear sobre a viga multiplicando pela largura de
influência. Uma viga de piso espaçada 2,5 m sob uma laje que recebe 4 kN/m² carrega
`4 × 2,5 = 10 kN/m`.

**2. Calcular os esforços.** Para viga biapoiada com carga uniforme, `M = qL²/8`. Note a dependência
quadrática do vão: dobrar o vão quadruplica o momento. É por isso que reduzir vão costuma ser mais
econômico do que engrossar perfil.

**3. Achar o módulo resistente.** `W_req = M / σ_adm`. Com aço S275 e σ_adm de 160 MPa, cada
kN·m de momento pede cerca de 6,25 cm³ de módulo resistente.

**4. Escolher o perfil.** Percorra a tabela comercial e pegue o perfil mais leve com `W ≥ W_req`.
Depois confira a flecha, que frequentemente governa em vãos longos com carga moderada.

## Exemplo 1 — viga de piso de 6 m

Vão `L = 6 m`, carga `q = 5 kN/m`, aço S275, perfil IPE.

- `M = 5 × 6² / 8 = 22,5 kN·m`
- `V = 5 × 6 / 2 = 15 kN`
- `W_req = 22,5 / 160 ≈ 140,6 cm³`

Na tabela IPE, o IPE 180 tem `W_el = 146 cm³` — atende com folga mínima — e massa de 18,8 kg/m. A
viga pesa `18,8 × 6,1 ≈ 115 kg` com o extra de corte. A flecha com `I = 1.317 cm⁴` fica em torno de
24 mm, acima do limite `L/250 = 24 mm` por uma margem estreita: aqui vale subir para o IPE 200, cuja
inércia de 1.943 cm⁴ derruba a flecha para cerca de 16 mm ao custo de 3,6 kg/m a mais. Esse é o tipo
de decisão que a tabela de alternativas torna imediata.

## Exemplo 2 — viga com carga concentrada

Vão `L = 4 m`, carga pontual `P = 20 kN` no meio (por exemplo, um pilar apoiado sobre a viga de
transição).

- `M = P·L/4 = 20 × 4 / 4 = 20 kN·m`
- `V = P/2 = 10 kN`
- `W_req = 20 / 160 = 125 cm³`

O IPE 180 novamente atende. Mas atenção: cargas concentradas exigem enrijecedores na alma no ponto
de aplicação e verificação de esmagamento local — algo que a estimativa não cobre e que o projetista
precisa detalhar.

## Exemplo 3 — pórtico simples

Vão `L = 5 m`, altura de pilar `h = 3 m`, carga de topo `P = 10 kN`.

- Momento na viga: `0,85 × (10 × 5 / 4) = 10,6 kN·m` → `W_req ≈ 66 cm³`
- Reação por pilar: `N = P/2 = 5 kN`; momento indicativo no pilar: `5 × 3 / 2 = 7,5 kN·m`
- Comprimento de perfil por pórtico: `5 + 2 × 3 = 11 m`

Perfis leves atendem à flexão, mas o pilar de pórtico raramente é definido pela flexão: esbeltez,
flambagem e rigidez lateral do conjunto costumam mandar. Por isso a ferramenta prioriza famílias HEB
e HEA para pilares, que têm inércia mais equilibrada nos dois eixos.

## Erros comuns que a estimativa não perdoa

- **Esquecer o peso próprio.** Um IPE 400 pesa 66 kg/m; em 8 m são mais de 500 kg que precisam
  entrar na carga.
- **Confundir carga de área com carga linear.** kN/m² só vira kN/m depois de multiplicar pela
  largura de influência.
- **Ignorar a flecha.** Em vãos acima de 6 m com carga leve, o critério de deformação define o
  perfil, não a tensão.
- **Tratar engaste como certo.** Ligações parafusadas com chapa de extremidade curta funcionam muito
  mais como rótula do que como engaste.
- **Esquecer contenção lateral.** A mesa comprimida sem travamento sofre flambagem lateral com
  torção, e a capacidade real pode cair pela metade.

## Perguntas frequentes

**Posso fabricar a partir desse resultado?** Não. Use-o para orçar, comparar alternativas e dialogar
com o fabricante. A fabricação exige projeto assinado.

**Por que usar módulo elástico e não plástico?** Porque o plástico só é mobilizável em seções
compactas com contenção lateral adequada, condições que a ferramenta não verifica.

**Serve para galpões?** Serve para uma primeira ordem de grandeza de terças e vigas. Pórticos de
galpão são dominados por vento e estabilidade global, que exigem análise específica.

**E ligações e placas de base?** Não são calculadas. Some tipicamente de 8% a 12% ao peso estimado
para chapas, parafusos e enrijecedores no orçamento preliminar.

Depois de rodar a estimativa, leve os números para um engenheiro estrutural. Consulte também a
[metodologia detalhada](/metodologia) do ObraMétrica e as demais calculadoras de
[construção civil](/construcao-civil).
