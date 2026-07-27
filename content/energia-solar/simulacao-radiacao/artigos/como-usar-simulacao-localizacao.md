---
title: Como usar a Simulação por Localização para estimar a produção solar
description: Tutorial prático da ferramenta de simulação por localização — dos inputs à leitura do gráfico, com dicas para interpretação.
---

Estimar a produção de energia solar antes de comprar um sistema é o primeiro passo para uma decisão bem informada. A **Simulação por Localização** da ObraMétrica permite fazer essa estimativa em segundos, usando presets internos de irradiância para cidades brasileiras.

## 1. Escolha como informar o local

A ferramenta aceita três formas de entrada, em ordem de prioridade:

1. **Coordenadas (lat, lng)**: a mais precisa. Se você já tem o endereço no Google Maps, clique com o botão direito para copiar as coordenadas.
2. **CEP**: útil quando não se sabe as coordenadas. O MVP mapeia o CEP para a cidade mais próxima do preset.
3. **Cidade/UF**: opção rápida, ideal para simulações iniciais.

Se nenhuma opção casar com o preset, o sistema usa um **fallback climático** (Tropical, Semiárido, Temperado) escolhido por você.

## 2. Configure o sistema

Os parâmetros mínimos são:

- **Capacidade DC (kWp)**: soma da potência dos módulos. Ex.: 10 módulos de 550 Wp = 5,5 kWp.
- **Inclinação (°)**: por padrão, igual à latitude local (regra ótima para sistemas fixos).
- **Azimute (°)**: 180° = norte geográfico no hemisfério sul (ótimo). Use 90° para leste, 270° para oeste.
- **PR (Performance Ratio)**: 0,80 é um valor conservador para sistemas modernos on-grid. Sistemas com sombreamento leve ou perdas elevadas ficam em 0,70–0,75.
- **Perdas (%)**: 10% é o padrão do mercado (inversor + cabos + sujeira + mismatch).

## 3. Leia os resultados

A tela de resultados mostra:

- **Irradiância anual no plano do módulo (kWh/m²·ano)**: quanta energia solar atinge cada m² do painel em um ano.
- **Fator específico (kWh/kWp·ano)**: expectativa média de produção por kWp instalado. Compare com valores típicos: Nordeste ~1.500–1.700; Centro-Oeste ~1.400–1.550; Sul ~1.200–1.350.
- **Produção anual (kWh/ano)**: multiplicando o fator específico pela capacidade instalada.
- **Produção mensal (kWh)**: gráfico de barras com sazonalidade. Meses de inverno no Sul podem ter menos da metade da produção do verão — importante para dimensionar armazenamento off-grid.
- **Incerteza (%)**: intervalo esperado. Interprete produção "±15%" como faixa plausível, não como valor exato.

## 4. Ajuste inclinação e azimute

Se o telhado disponível tem inclinação e azimute fixos, ajuste os inputs para refletir a realidade. Impactos típicos:

- **Inclinação 0° (plano) em latitude 20°**: perda ~5% em relação ao ótimo.
- **Azimute 90° (leste) ou 270° (oeste)**: perda 15–20%.
- **Azimute 180° (sul, no hemisfério sul)**: perda 25–35% — considere não instalar nessa face.

## 5. Exporte para propostas

Os botões **Exportar JSON** e **Exportar CSV** geram arquivos com os inputs, irradiância mensal, produção mensal e produção anual. Use o CSV no Excel para gerar gráficos personalizados ou anexar em propostas.

## 6. Combine com as outras calculadoras

O valor de produção anual estimado aqui é entrada natural para:

- [Calculadora de Payback](/energia-solar/calculadora-payback): estime retorno financeiro em 25 anos.
- [Comparador On/Off/Híbrido](/energia-solar/comparador-sistemas): descubra qual topologia faz sentido no seu caso.
- [Calculadora de Inversor](/energia-solar/calculadora-inversor): dimensione o inversor e o string sizing.

## Limitações importantes

- **Presets internos** cobrem 11 cidades. Locais fora dessa lista usam o preset mais próximo, com incerteza maior.
- **Modelo de POA simplificado** — não separa irradiância difusa/direta como PVGIS. Erros podem chegar a ±15%.
- **Sombreamento local** (árvores, prédios, chaminés) não é considerado. Faça análise dedicada em campo.
- **Temperatura do módulo** entra indiretamente no PR. Regiões muito quentes (Norte/Nordeste) podem exigir PR mais baixo (0,75).

## Próximo passo

Se você precisa de precisão para engenharia executiva, o próximo passo é usar o **PVGIS** (europeu, cobre o Brasil) ou o **NSRDB** (americano). Ambos são gratuitos, oferecem irradiância horária e permitem modelagem detalhada de sombras. A ObraMétrica pretende integrar essas APIs em versões futuras da ferramenta.

Enquanto isso, a Simulação por Localização é a maneira mais rápida de sair do "não sei quanto vou gerar" para uma faixa de produção com incerteza declarada — o suficiente para decidir se o investimento faz sentido.
