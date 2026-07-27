---
title: Guia prático para dimensionar baterias solares
description: Passo a passo para calcular capacidade, escolher tecnologia e planejar substituições no seu banco de baterias fotovoltaico.
---

# Guia prático para dimensionar baterias solares

Dimensionar um banco de baterias corretamente é o que separa um sistema fotovoltaico
autossuficiente de um projeto que decepciona logo no primeiro apagão. Este guia mostra o
raciocínio completo — do consumo diário ao custo total descontado — usando a
[Calculadora de Bateria](/energia-solar/calculadora-bateria) da ObraMétrica.

## 1. Levante o consumo diário real

Antes de qualquer conta, entenda o **perfil de consumo**. O ideal é observar a fatura de
energia dos últimos 12 meses e dividir o consumo mensal por 30 para obter o consumo médio
diário em kWh/dia. Se o objetivo for cobrir apenas cargas essenciais (geladeira, iluminação,
Wi-Fi), some manualmente a potência (W) × horas de uso por dia dessas cargas e converta
para kWh.

Exemplos rápidos:

- **Residência pequena essencial**: 5–10 kWh/dia.
- **Casa média com ar-condicionado**: 15–25 kWh/dia.
- **Pequeno comércio ou sítio produtivo**: 30–60 kWh/dia.

## 2. Defina a autonomia desejada

A autonomia é quantos dias o banco deve alimentar as cargas **sem sol suficiente**. Off-grid
puros geralmente pedem 2 a 3 dias. Híbridos residenciais costumam trabalhar com autonomia
parcial (0,5 a 1 dia) porque a rede continua disponível.

Multiplique consumo diário × autonomia × **fator de segurança** (1,2 é o padrão do
motor — cobre imprecisões, envelhecimento inicial e picos não previstos).

## 3. Aplique DoD, eficiência e degradação

Bateria de 10 kWh nominais **não entrega 10 kWh utilizáveis**. Duas perdas reduzem esse
número:

- **DoD (profundidade de descarga)**: LFP suporta 80% sem prejudicar a vida útil; chumbo-ácido
  raramente ultrapassa 50%.
- **Eficiência round-trip**: 90–92% em Li-ion, ~80% em chumbo-ácido.

Fórmula usada pela calculadora:

```
capacidadeNominal = (consumoDiario × autonomia × fatorSeguranca) / eficiencia / DoD
```

Ainda há a **degradação anual** (0,5–1% em LFP, 3% em chumbo-ácido). O motor projeta a
capacidade ano a ano e sinaliza a substituição quando a capacidade cai abaixo de 70% ou
quando os ciclos nominais são atingidos.

## 4. Escolha a tecnologia certa

| Aspecto            | LFP (Li-ion)         | NMC (Li-ion)      | Chumbo-ácido       |
|--------------------|----------------------|-------------------|--------------------|
| DoD prático        | 80%                  | 80–85%            | 50%                |
| Ciclos             | 4.000–6.000          | 2.500–4.000       | 800–1.500          |
| Segurança térmica  | Alta                 | Média             | Alta (com vent.)   |
| Custo inicial/kWh  | R$ 2.000–2.500       | R$ 2.000–2.400    | R$ 800–1.100       |
| Custo total 10a    | Menor                | Médio             | Alto (substituições) |

LFP é hoje o padrão residencial: melhor custo por ciclo, estabilidade térmica e ausência de
manutenção. Chumbo-ácido só faz sentido em sistemas muito pequenos ou orçamentos apertados.

## 5. Estime custo total, não só o inicial

Um banco de chumbo-ácido custa metade de um LFP na compra — mas exige 2 a 3 substituições em
10 anos. A calculadora aplica **VPL** (valor presente líquido) descontando cada troca futura
pela taxa de desconto anual. Assim você compara o **custo real** de cada tecnologia, não
apenas o desembolso inicial.

Dica: use a taxa de desconto próxima do custo de oportunidade do capital (CDI, Selic ou juros
de financiamento). Em 2026, valores entre 8% e 12% a.a. são realistas no Brasil.

## 6. Cheque autonomia prática e alertas

Após calcular, revise:

- **Autonomia prática (dias)** — deve ser igual ou maior à desejada; caso contrário, aumente
  o número de módulos.
- **Nº de unidades** — mais de 8 costuma indicar preset inadequado; troque por baterias de
  maior capacidade.
- **Custo por kWh instalado** — acima de R$ 3.500/kWh, negocie ou consulte outros fornecedores.

## 7. Planeje manutenção e substituição

Boas práticas para prolongar a vida do banco:

- **Temperatura**: mantenha o ambiente entre 15–30 °C.
- **Ciclos parciais**: prefira ciclos rasos frequentes a ciclos profundos ocasionais em LFP.
- **Firmware do BMS**: mantenha atualizado; ele previne sobrecarga e sobredescarga.
- **Inspeção anual**: torque de conexões, verificação de isolamento e teste de capacidade.

Registre datas de instalação e alertas do BMS. Quando a capacidade útil cair abaixo de 80%,
comece a planejar a substituição — leva de 2 a 6 meses para orçar, comprar e instalar
baterias novas com boa procedência.

## Próximos passos

Combine este dimensionamento com:

1. [Simulador Solar Avançado](/simulador-solar-avancado) — geração e strings.
2. [Calculadora de Inversor](/energia-solar/calculadora-inversor) — validação de tensão DC.
3. [Comparador On/Off/Híbrido](/energia-solar/comparador-sistemas) — decisão de topologia.
4. [Calculadora de Payback](/energia-solar/calculadora-payback) — análise financeira completa.

Assim você fecha o quadro técnico e econômico do projeto antes de contratar o integrador.
