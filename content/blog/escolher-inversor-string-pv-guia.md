---
title: "Como escolher o Inversor Solar e dimensionar Strings: Passo a Passo"
description: "Guia prático para dimensionamento de inversores string e microinversores. Tensão de entrada, MPPT, Oversizing e DC/AC Ratio."
tags: ["energia solar", "inversor", "strings", "elétrica", "projeto"]
author: "Thiago O. M."
date: "2026-08-10"
last_reviewed: "2026-08-10"
reading_time: "11 min"
canonical: "https://obrametrica.com.br/blog/escolher-inversor-string-pv-guia"
og_image: "assets/images/blog/inversor-string-hero.webp"
meta_title: "Dimensionamento de Inversor Solar e Strings | Obra Métrica"
meta_description: "Aprenda a escolher o inversor solar ideal. Guia sobre MPPT, dimensionamento de strings (tensão/corrente) e razão DC/AC. Passo a passo técnico."
---

# Dimensionamento de Strings e Escolha de Inversor

O inversor é o "cérebro" do sistema fotovoltaico. Escolher o modelo errado ou dimensionar as strings (séries de painéis) incorretamente pode queimar o equipamento ou causar perdas severas de geração por *clipping*.

## Resumo/Lead
Dimensionar um inversor envolve equilibrar a potência total dos painéis com a capacidade de entrada do aparelho. Conceitos como **Janela de Tensão MPPT**, **Corrente Máxima de Curto-Circuito** e a **Razão DC/AC (Oversizing)** são vitais. Este artigo fornece um passo a passo prático para você não errar no seu próximo projeto.

---

## 1. Entendendo a Razão DC/AC (Oversizing)

É comum instalar mais potência em painéis (CC) do que a potência nominal do inversor (CA). Isso é chamado de *oversizing*.
- **Por que fazer?** Para aproveitar melhor o inversor em horários de baixa irradiação (manhã/tarde).
- **Razão Típica:** Entre 1.2 e 1.4 (ex: 7 kWp de painéis para um inversor de 5 kW).
- **Limite:** Verifique o datasheet do inversor para a potência CC máxima suportada.

## 2. Dimensionamento de Tensão da String

A tensão da série de painéis deve estar dentro da faixa de operação do inversor.
- **Vmin (Start-up):** A tensão mínima para o inversor ligar.
- **Vmax (Voc):** A tensão máxima de circuito aberto, ajustada pela temperatura fria (quando a tensão aumenta). **Nunca exceda a tensão máxima do inversor!**

---

## 3. Tabela de Verificação Rápida (Exemplo Inversor 5kW)

| Parâmetro | Valor Datasheet | Cálculo da String | Status |
| :--- | :--- | :--- | :--- |
| Potência CC Máx | 7.500 W | 14 painéis 550W = 7.700 W | ⚠️ Excedido (Reduzir 1) |
| Tensão Máxima CC | 600 V | 13 painéis $\times$ 49V ($V_{oc}$) = 637 V | ❌ Perigo de Queima |
| Janela MPPT | 100V - 550V | 13 painéis $\times$ 42V ($V_{mp}$) = 546 V | ✅ OK |
| Corrente Máx Input | 13 A | Painel $I_{sc} = 13.5 A$ | ⚠️ Clipping de Corrente |

---

## 4. Exemplo Numérico Passo a Passo

**Objetivo:** Dimensionar strings para um inversor de 10kW (2 MPPTs) com painéis de 500W.

1. **Definir Quantidade de Painéis:** Razão 1.3 $\rightarrow$ 13kWp $\rightarrow$ 26 painéis.
2. **Dividir em MPPTs:** 13 painéis por MPPT.
3. **Checar Tensão:** Se cada painel tem $V_{oc} = 50V$, a string terá $13 \times 50 = 650V$. Se o inversor suporta 1000V, está seguro.
4. **Checar Corrente:** Se o painel tem $I_{mp} = 12A$ e o inversor suporta 15A por MPPT, está perfeito.

---

## 5. Como usar a ferramenta no Obra Métrica

Nossa [Calculadora de Inversor e String Sizing](/energia-solar/calculadora-inversor) facilita tudo:
1. Insira os dados do painel ($V_{oc}, V_{mp}, I_{sc}$).
2. Informe a temperatura mínima histórica da sua região (essencial para o cálculo de $V_{max}$).
3. O sistema sugere o número mínimo e máximo de painéis por string.
4. Alerta automático se você ultrapassar os limites de segurança do equipamento.

---

## Conclusão
O dimensionamento correto garante que o inversor trabalhe na sua zona de máxima eficiência (pico da curva MPPT) pelo maior tempo possível, maximizando o ROI.

**Próximos passos:**
- Dimensione seu sistema na [Calculadora de Inversor](/energia-solar/calculadora-inversor).
- Planeje o [Layout de Painéis](/energia-solar/calculadora-area-layout-paineis).
- Calcule as [Perdas e Eficiência](/energia-solar/calculadora-perdas-eficiencia).

---
**Sobre o Autor:**
Thiago O. M. é engenheiro eletricista com especialização em eletrônica de potência aplicada a renováveis.

**Referências:**
- [Clean Energy Reviews - Inverter Selection Guide](https://www.cleanenergyreviews.info/) [FONTE_A_VERIFICAR]
- Manual de Engenharia para Sistemas Fotovoltaicos - CRESESB/CEPEL.
- Datasheets técnicos (Fronius, Growatt, WEG, Sungrow).

*Disclaimer: A montagem elétrica deve seguir a NBR 5410 e NBR 16690. Risco de choque elétrico e incêndio.*
