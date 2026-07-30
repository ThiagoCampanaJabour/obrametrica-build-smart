---
title: "Plano de QA — Drenagem e Calhas"
updated: "2026-07-30"
---

# Plano de testes — /construcao-civil/drenagem-calhas

## 1. Cálculo de vazão

- [ ] Caso 1 (`exemplo.json`): telhado 100 m², C=0,95, i=130 mm/h → Q ≈ 3,43 L/s
- [ ] Caso 2: 500 m² asfalto, C=0,85, i=150 mm/h → Q ≈ 17,71 L/s
- [ ] Caso 3: laje + gramado com FS 1,1 → Q total ≈ 7,65 L/s
- [ ] Alterar C manualmente altera a vazão proporcionalmente
- [ ] Alterar a duração aplica o preset de intensidade da cidade selecionada
- [ ] Digitar `i` manualmente sobrescreve o preset

## 2. Agrupamento em trechos

- [ ] Bacias com o mesmo ponto de despejo somam em um único trecho
- [ ] Bacias com destinos distintos geram linhas de trecho separadas
- [ ] Campo de destino vazio cai em "Ponto único"

## 3. Dimensionamento de condutos

- [ ] Para S = 1% e PVC, DN 100 aparece para vazões até ~11 L/s
- [ ] Para S = 0,5%, o mesmo caso exige diâmetro maior
- [ ] Material concreto (n = 0,013) resulta em diâmetro igual ou maior que PVC
- [ ] Diâmetro mínimo disponível filtra opções abaixo do valor informado
- [ ] Vazão extrema (ex.: 100.000 m²) aciona aviso "nenhum diâmetro atende"

## 4. Calhas e ralos

- [ ] Seção retangular retorna h ≈ b/2 com largura comercial
- [ ] Seção semicircular retorna altura ≈ b/2 e área π·D²/8
- [ ] Número de ralos = ceil(Q_L/s ÷ capacidade unitária), mínimo 1

## 5. Warnings

- [ ] S < 0,5% exibe alerta de sedimentação global
- [ ] v < 0,6 m/s no conduto exibe alerta específico do trecho
- [ ] v a seção plena > 3,0 m/s exibe alerta de abrasão
- [ ] Bacia com inclinação < 0,5% exibe aviso de empoçamento

## 6. Exportação

- [ ] CSV contém linhas de bacias, trechos e total, com separador `;`
- [ ] JSON contém `inputs` e `outputs` completos
- [ ] Botão "Gerar relatório" abre o diálogo de impressão

## 7. Acessibilidade e responsividade

- [ ] Todos os campos possuem `label` associada
- [ ] Painel de resultados usa `aria-live="polite"`
- [ ] Tabelas possuem `caption` e `scope="col"`
- [ ] Layout em coluna única a 375 px, sem overflow horizontal fora das tabelas
- [ ] Foco visível em todos os controles interativos

## 8. SEO / rota

- [ ] Rota responde 200 em `/construcao-civil/drenagem-calhas`
- [ ] `title`, `description`, canonical e JSON-LD (WebApplication + FAQPage) presentes
- [ ] URL listada em `sitemap.xml`
- [ ] Card visível na listagem de Construção Civil
