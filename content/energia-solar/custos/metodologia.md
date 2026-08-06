---
title: "Metodologia — Estimador de Custo Total (TCO) fotovoltaico"
description: "Regras de dimensionamento, preços unitários, OPEX, substituições e indicadores financeiros usados no estimador."
---

## 1. Escopo e premissas gerais

O estimador trabalha com um sistema conectado à rede (com opção de banco de baterias), horizonte
padrão de **25 anos** e taxa de desconto configurável. Todos os cálculos são determinísticos e
implementados como funções puras em `src/lib/solar/cost-estimator.ts`, o que permite reproduzir
qualquer resultado a partir do JSON exportado.

Os preços unitários pré-carregados são referências do mercado brasileiro coletadas em
**janeiro de 2026** (distribuidores nacionais de equipamento fotovoltaico e composições de mão de
obra de integradores). Eles existem para acelerar o pré-orçamento — não são cotação.

## 2. Dimensionamento de quantidades

**Módulos.** `n = ceil(kWp_alvo × 1000 / Pmp_W)`. A potência DC real do projeto é recalculada a
partir de `n`, de modo que 4,0 kWp com módulos de 400 Wp resultam em 10 módulos e 4,00 kWp exatos,
enquanto 50 kWp com módulos de 550 Wp resultam em 91 módulos e 50,05 kWp.

**Compra.** Sobre `n` aplica-se o percentual de módulos reserva (spare, 0–5%) e o total é
arredondado para caixas fechadas: `comprados = ceil(n × (1 + spare) / porCaixa) × porCaixa`. Pallets
comerciais costumam trazer 31 ou 36 módulos.

**Strings e inversores.** `strings = ceil(n / módulos_por_string)`. A potência AC alvo é
`kWp_DC / DC-AC ratio` e a quantidade de inversores é `ceil(AC_alvo / potência_nominal_unidade)`. O
estimador confere se as entradas de string disponíveis (`qtd × entradas_por_inversor`) cobrem o
número de strings e emite um aviso quando não cobrem. Também alerta quando o DC/AC real ultrapassa
1,35, faixa em que o clipping deixa de ser desprezível.

**Estrutura.** Assume-se dois trilhos contínuos por fileira:
`rails_m = n_módulos × passo_do_módulo × 2 × fator_da_estrutura`, com passo igual ao comprimento do
módulo na montagem paisagem e à largura na montagem retrato. O fator representa o acréscimo de
material e complexidade: telhado inclinado 1,0; telhado plano com triângulos 1,6; solo fixed tilt
2,2; tracker de um eixo 3,0. Grampos: 4 por módulo (2 intermediários + 2 de extremidade
compartilhados na média).

**Cabos e infraestrutura.** Comprimentos são entradas do usuário — quando disponíveis, use os
valores da calculadora de área e layout. A eletrocalha assume o comprimento do trecho CA quando não
informada.

**Proteções e BOP.** `string boxes = ceil(strings / strings_por_box)`; um fusível por string; DPS,
quadro de proteção CA e aterramento como verbas unitárias. Transformador e medição entram somente
quando o preço informado é maior que zero.

**Mão de obra.** Dois modos: custo por kWp (`kWp × R$/kWp`) ou horas (`kWp × h/kWp × R$/h`).
Composições típicas ficam entre 6 e 10 h/kWp em telhado residencial.

## 3. Formação do CAPEX

Os itens diretos são somados por categoria (Equipamento, Estrutura, Elétrica/BOP, Serviços,
Armazenamento). Sobre esse subtotal:

1. **Frete** — percentual sobre o valor dos equipamentos ou R$/km × distância, mais descarregamento.
2. **Projeto, ART e licenças** — verbas fixas.
3. **Comissionamento** — percentual sobre os demais itens (1% a 2% é usual).
4. **Contingência** — 5% a 10% sobre o subtotal direto, para imprevistos de obra.
5. **Markup comercial** — aplicado sobre o CAPEX para gerar o preço de venda sugerido; não integra
   o custo do projeto.

O **custo por kWp** é `CAPEX / kWp_DC` e é o indicador mais usado para comparar propostas.

## 4. OPEX anual

`OPEX = kWp × (limpeza + manutenção + monitoramento) + CAPEX × seguro% + garantia_estendida`.
Referências de mercado: limpeza 20–35 R$/kWp·ano (2 lavagens/ano em telhado residencial),
manutenção preventiva 15–30 R$/kWp·ano, monitoramento 5–12 R$/kWp·ano e seguro 0,3% a 0,6% do
CAPEX ao ano.

## 5. Substituições

Inversores string têm vida útil de 10 a 15 anos. O estimador lança
`qtd_inversores × custo_unitário` em cada múltiplo da vida útil dentro do horizonte (anos 12 e 24,
com vida de 12 anos em 25 anos de análise). Baterias seguem a mesma regra com a própria vida útil,
tipicamente 10 anos para LFP em uso diário. O modelo **não** aplica redução de preço futuro dos
equipamentos — é uma premissa conservadora e deve ser declarada na proposta.

## 6. Indicadores financeiros

- **Receita anual** = produção do ano × tarifa, com degradação composta de 0,5% ao ano.
- **Economia líquida** = receita − OPEX.
- **Payback simples**: ano em que o caixa acumulado nominal cruza zero, com interpolação linear
  dentro do ano.
- **Payback descontado**: mesma leitura sobre o acumulado trazido a valor presente pela taxa de
  desconto.
- **Custo total no horizonte** = CAPEX + N × OPEX + substituições (nominal) e a versão descontada
  do mesmo somatório.
- **LCOE** = (CAPEX × CRF + custos operacionais descontados anualizados) / energia descontada
  anualizada, com `CRF = r(1+r)ⁿ / ((1+r)ⁿ − 1)`. Como a energia também é descontada, o LCOE fica
  acima do custo médio nominal por kWh — isso é esperado e é a definição usada por IRENA e NREL.

## 7. Limitações

O modelo é de **pré-orçamento**. Ele não considera: variação cambial ao longo do contrato,
tributação específica (ICMS, PIS/COFINS por regime), reajuste tarifário acima da inflação, custo de
financiamento (parcelas e juros), obras civis atípicas, reforço estrutural do telhado, adequação do
padrão de entrada, remoção de vegetação e o Fio B da Lei 14.300 no cálculo da economia. Para
propostas contratuais, use os preços cotados dos fornecedores e um fluxo de caixa que incorpore o
regime tributário do cliente.

## Fontes e referências

- ABNT NBR 16274 — Sistemas fotovoltaicos conectados à rede: requisitos de documentação e
  comissionamento.
- ABNT NBR 16690 — Instalações elétricas de arranjos fotovoltaicos.
- Lei 14.300/2022 — Marco legal da microgeração e minigeração distribuída.
- IRENA, *Renewable Power Generation Costs* — metodologia de LCOE.
- NREL, *U.S. Solar Photovoltaic System Cost Benchmark* — estrutura de custos por categoria.
- Greener, *Estudo Estratégico do Mercado Fotovoltaico* — faixas de preço por porte no Brasil.
