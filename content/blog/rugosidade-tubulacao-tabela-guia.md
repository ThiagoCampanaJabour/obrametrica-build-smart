---
title: "Rugosidade de Tubulações: Tabelas e Presets de Materiais"
description: "Guia completo com tabelas de rugosidade absoluta e coeficientes de Hazen-Williams para diversos materiais de tubulação."
tags: ["hidráulica", "construção civil", "rugosidade", "materiais"]
author: "Equipe Técnica Obra Métrica"
date: "2026-08-10"
last_reviewed: "2026-08-10"
reading_time: "7 min"
canonical: "https://obrametrica.com.br/blog/rugosidade-tubulacao-tabela-guia"
og_image: "assets/images/blog/rugosidade-hero.webp"
meta_title: "Tabela de Rugosidade de Tubulações | Obra Métrica"
meta_description: "Confira a tabela completa de rugosidade absoluta e coeficientes C para PVC, aço, ferro e concreto. Essencial para cálculos de perda de carga."
---

# Rugosidade de Tubulações: Guia de Tabelas e Presets

A precisão de um cálculo de perda de carga hidráulica depende quase inteiramente da escolha do coeficiente de rugosidade correto. Errar a rugosidade de um tubo de concreto envelhecido, por exemplo, pode levar a um erro de mais de 40% na pressão final estimada.

## Resumo/Lead
A rugosidade é a medida das irregularidades na superfície interna de um tubo. Tubos novos e lisos (como PVC) oferecem menos resistência ao fluxo do que tubos rugosos ou oxidados (como ferro fundido antigo). Este guia consolida as tabelas de rugosidade absoluta ($\epsilon$) e coeficientes de Hazen-Williams ($C$) para os materiais mais comuns na construção civil brasileira.

---

## 1. Tabela de Rugosidade Absoluta ($\epsilon$)
Utilizada na equação de Darcy-Weisbach e no Diagrama de Moody.

| Material | Rugosidade $\epsilon$ (mm) | Condição |
| :--- | :--- | :--- |
| **PVC / Polietileno** | 0.0015 | Novo / Liso |
| **Cobre / Latão** | 0.0015 | Novo |
| **Aço Comercial** | 0.045 | Novo |
| **Ferro Galvanizado** | 0.15 | Novo |
| **Ferro Fundido** | 0.25 | Novo |
| **Concreto (Acabamento Liso)** | 0.30 | Novo |
| **Concreto (Bruto)** | 1.0 a 3.0 | Usado |

---

## 2. Coeficientes de Hazen-Williams ($C$)
Utilizados na fórmula prática de Hazen-Williams (específica para água).

| Material | Coeficiente $C$ | Observação |
| :--- | :--- | :--- |
| **Plásticos (PVC, PPR, PEAD)** | 140 - 150 | Altíssima eficiência |
| **Cobre** | 130 - 140 | Muito liso |
| **Aço Rivetado** | 110 | Perda significativa |
| **Ferro Fundido (Antigo)** | 80 - 100 | Devido à incrustação |
| **Cimento Amianto** | 140 | (Uso em declínio) |

---

## 3. Como a Rugosidade Afeta seu Projeto
1. **Velocidade Limite:** Materiais mais rugosos causam mais turbulência, o que pode aumentar a erosão interna se a velocidade for muito alta.
2. **Dimensionamento de Bombas:** Maior rugosidade $\rightarrow$ Maior perda de carga $\rightarrow$ Necessidade de bomba mais potente (e mais cara).
3. **Envelhecimento:** Sempre considere o desgaste. Um tubo de aço que hoje é $C=120$ pode se tornar $C=90$ em dez anos.

---

## 4. Exemplo de Sensibilidade
Se você projetar uma adutora de 1000m com $C=140$ (PVC) e a execução for feita em Aço ($C=110$), sua perda de carga aumentará em aproximadamente **60%**, possivelmente impedindo o funcionamento do sistema.

---

## 5. Como usar a ferramenta no Obra Métrica
Nossa [Calculadora de Perda por Atrito em Tubulações](/construcao-civil/perda-atrito-tubulacoes) já vem carregada com esses presets:
1. Basta selecionar o material no menu suspenso.
2. A ferramenta aplica automaticamente o valor de $\epsilon$ ou $C$ correspondente.
3. Você pode editar manualmente o valor se tiver o datasheet específico do fabricante.

---

## Conclusão
Consultar tabelas de rugosidade é o "básico bem feito" da hidráulica. Na dúvida, use valores conservadores para garantir a margem de segurança do sistema.

**Próximos passos:**
- Calcule a perda de carga na [Ferramenta de Hidráulica](/construcao-civil/perda-atrito-tubulacoes).
- Veja o guia completo de [Perda por Atrito](/blog/perda-atrito-tubulacoes-guia-tecnico).
- Dimensione [Drenagem e Calhas](/construcao-civil/drenagem-calhas).

---
**Referências:**
- Idelchik, I.E. *Handbook of Hydraulic Resistance*.
- Colebrook, C.F. (1939). "Turbulent flow in pipes".
- Manuais Técnicos Tigre e Amanco. [FONTE_A_VERIFICAR]
