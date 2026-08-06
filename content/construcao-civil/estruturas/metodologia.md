---
title: "Metodologia — Estruturas Metálicas Básicas"
description: "Fórmulas, tensões admissíveis, seleção de perfis, verificação de flecha, suposições e limitações do módulo de estruturas metálicas."
---

## Metodologia

> **Aviso obrigatório:** ferramenta de estimativa — não substitui projeto estrutural ou cálculo
> executivo. Todas as recomendações devem ser verificadas por engenheiro estrutural responsável
> antes da fabricação e montagem.

### 1. Escopo e finalidade

O módulo calcula ordens de grandeza para cinco tipologias: viga simplesmente apoiada, viga contínua
de dois vãos iguais, pórtico simples (dois pilares e uma viga), vigas secundárias de laje metálica
e pilar isolado. As saídas são momento fletor máximo, esforço cortante máximo, módulo resistente
mínimo exigido, perfil comercial sugerido, alternativas ordenadas por massa, flecha estimada, peso
por conjunto e consumo total de aço.

### 2. Unidades e convenções

As cargas são informadas em kN/m (distribuídas) e kN (concentradas); comprimentos em metros;
momentos em kN·m; tensões em MPa. As propriedades de seção seguem o catálogo usual: área em cm²,
módulos resistentes em cm³ e momento de inércia em cm⁴. As conversões internas usam
1 kN·m = 10³ N·m, 1 MPa = 10⁶ N/m², 1 cm³ = 10⁻⁶ m³ e 1 cm⁴ = 10⁻⁸ m⁴.

### 3. Esforços

**Viga simplesmente apoiada** (também usada para vigas secundárias de laje):

- `M_max = q·L²/8 + P·L/4`
- `V_max = q·L/2 + P/2`

A carga concentrada é suposta no meio do vão, situação que maximiza o momento.

**Viga contínua de dois vãos iguais** (coeficientes clássicos para carga uniforme):

- Momento negativo sobre o apoio central: `M ≈ q·L²/8 + 3·P·L/16`
- Momento positivo no vão: `M ≈ q·L²/14 + P·L/6`
- Cortante de cálculo: `V ≈ 0,625·q·L + 0,6·P`

O dimensionamento usa o maior dos dois momentos, normalmente o do apoio central. O comprimento da
peça considerado no consumo de aço é `2·L`.

**Pórtico simples.** A viga é tratada como biapoiada com redistribuição parcial devido ao
engastamento parcial nos nós: `M_viga ≈ 0,85·(q·L²/8 + P·L/4)`. A reação vertical de topo por pilar
é `N = q·L/2 + P/2` e o momento indicativo no pilar é `M_pilar ≈ N·h/2`, uma aproximação grosseira
que representa excentricidade de aplicação e rigidez do nó. O comprimento por pórtico é `L + 2·h`.

**Pilar isolado.** A carga axial é `N = P + q·L` e o momento indicativo é `M ≈ N·h/2`. Esta
aproximação **não** verifica flambagem por compressão, esbeltez, flexo-compressão combinada nem
ligação de base.

**Condição de apoio.** Quando o usuário escolhe "engastado", o momento é reduzido por um fator
aproximado: 0,67 para elementos fletidos e 0,50 para pilares e pórticos. O engaste real depende da
rigidez das ligações e da fundação e raramente é perfeito.

**Fator de margem.** As cargas informadas são multiplicadas por um fator entre 1,0 e 2,0 escolhido
pelo usuário, antes de qualquer cálculo. Ele representa, de forma simplificada, majoração de ações,
peso próprio não contabilizado ou reserva de projeto. Não é um coeficiente normativo de combinação.

### 4. Materiais e tensão admissível

| Aço | fy (MPa) | σ_adm adotada (MPa) | Densidade |
|---|---|---|---|
| S235 (≈ ASTM A36) | 235 | 140 | 7.850 kg/m³ |
| S275 | 275 | 160 | 7.850 kg/m³ |
| S355 (≈ ASTM A572 Gr.50) | 355 | 210 | 7.850 kg/m³ |

A tensão admissível é uma simplificação de serviço, obtida aplicando um coeficiente global da ordem
de 1,6 a 1,7 sobre fy. Ela não representa o método dos estados limites da ABNT NBR 8800 nem do
Eurocode 3, que trabalham com ações majoradas e resistências minoradas por γ. Adotamos o formato
admissível apenas porque ele produz estimativas conservadoras e legíveis em fase conceitual.

### 5. Seleção de perfil

O módulo resistente mínimo é `W_req = M_max / σ_adm`. Convertendo unidades:
`W_req[cm³] = M[kN·m]·10³ / (σ_adm[MPa]·10⁶) · 10⁶`.

A tabela de perfis é filtrada pela família escolhida (ou por uma ordem de preferência automática:
IPE → HEA → HEB → tubo para vigas; HEB → HEA → IPE → tubo para pilares e pórticos), mantendo apenas
perfis com `W_el ≥ W_req`. Os candidatos são ordenados por massa linear crescente e o mais leve é
apresentado como sugerido; até cinco alternativas são exibidas para permitir escolher um perfil mais
robusto por disponibilidade ou por flecha. Se nenhum perfil da tabela atende, a ferramenta informa
explicitamente e sugere perfis soldados, treliças, redução de vão ou aço de maior resistência.

Usamos o módulo **elástico** (W_el), e não o plástico, por conservadorismo: em seções compactas o
plástico permitiria momentos maiores, mas isso depende de classificação de seção e de contenção
lateral que a ferramenta não verifica.

### 6. Peso e consumo

`comprimento_total = (comprimento_unitário + extra_de_corte) × quantidade` e
`peso = massa_linear[kg/m] × comprimento_total`. O comprimento unitário é o vão (viga simples),
`2·L` (viga contínua), `L + 2·h` (pórtico) ou `h` (pilar). O extra de corte padrão é 0,10 m por peça,
cobrindo encaixes e recortes. O resumo consolida peso total, comprimento total e número de peças.

### 7. Verificação de flecha

Para elementos fletidos calculamos `δ = 5·q·L⁴/(384·E·I) + P·L³/(48·E·I)`, com E = 210 GPa e I do
perfil. O valor é comparado ao limite prático `L/250`. Trata-se de uma verificação de ordem de
grandeza: pisos com revestimento frágil, apoio de alvenaria, vibração ou contraflecha exigem
critérios mais rigorosos (L/350, L/500) e o cálculo com a combinação de serviço correta.

### 8. Limitações

Não são verificados: combinações de ações permanentes, variáveis e de vento; estados limites últimos
segundo NBR 8800 ou Eurocode 3; flambagem lateral com torção; flambagem local de alma e mesa;
flambagem por compressão de pilares (Euler); estabilidade global e efeitos de segunda ordem;
ligações parafusadas ou soldadas; placas de base e chumbadores; fadiga; comportamento em incêndio;
e interação com a estrutura de concreto ou com a fundação. Vãos desiguais, cargas móveis, cargas
assimétricas e aberturas na alma alteram os resultados.

### 9. Referências e responsabilidade

Consulte a ABNT NBR 8800 (estruturas de aço e mistas de aço e concreto), a ABNT NBR 6120 (ações para
o cálculo de estruturas), a ABNT NBR 6123 (forças devidas ao vento) e o Eurocode 3 (EN 1993-1-1). O
projeto executivo, o detalhamento, a fabricação e a montagem devem ser conduzidos por engenheiro
estrutural habilitado, com ART registrada. Veja também a [metodologia geral](/metodologia) do
ObraMétrica.
