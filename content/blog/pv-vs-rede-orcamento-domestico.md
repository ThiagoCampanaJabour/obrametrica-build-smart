---
title: "PV vs Rede: Como calcular economia, payback e LCOE para sua casa"
description: "Aprenda a comparar custos entre energia da rede e geração fotovoltaica: produção estimada, economia anual, payback e LCOE simplificado — com exemplos práticos."
tags: ["energia solar","economia","pv","lcoe","payback"]
author: "Thiago O. M."
date: "2026-08-10"
last_reviewed: "2026-08-10"
reading_time: "7 min"
canonical: "https://obrametrica.com.br/blog/pv-vs-rede-orcamento-domestico"
og_image: "/assets/images/pv-vs-rede-hero.webp"
---

# PV vs Rede: Como calcular economia, payback e LCOE para sua casa

## Resumo
Neste artigo explicamos de forma prática como comparar o custo da energia elétrica da rede com a geração fotovoltaica (PV). Vamos definir fórmulas básicas, apresentar um exemplo numérico e mostrar limitações das estimativas.

## Conceitos chave
- **kWp**: potência instalada (quilowatt-pico).
- **kWh**: energia (quilowatt-hora).
- **Specific yield / factor_kwh_per_kwp_year**: kWh gerados por kWp por ano.
- **Overlap factor**: fração da geração usada no local (onsite) vs exportada.
- **Payback simples**: CAPEX / economia anual.
- **LCOE simplificado**: (annualized CAPEX + OPEX) / produção anual.

## Fórmulas básicas
- **Produção anual (kWh)** = kWp × factor_kwh_per_kwp_year × (1 − perdas_frac)
- **Energia usada on-site** = produção × overlap_factor
- **Energia exportada** = produção − usada_on_site
- **Economia anual** = (usada_on_site × tarifa) + (exportada × credit_rate) − OPEX_annual
- **Payback (anos)** = CAPEX / economia_annual (se CAPEX informado)
- **LCOE (R$/kWh)** ≈ (CAPEX / vida_útil + OPEX_annual) / produção_anual

## Exemplo prático
- **Potência**: 5 kWp
- **Local**: São Paulo — factor 1500 kWh/kWp/ano
- **Perdas**: 14% → PR = 0.86
- **Produção anual**: 5 × 1500 × 0.86 = 6.450 kWh/ano
- **Overlap (residencial)**: 0.45 → usada_on_site = 2.902,5 kWh
- **Exportada** = 3.547,5 kWh
- **Tarifa média**: R$0,80/kWh → economia on-site = 2.902,5 × 0,8 = R$2.322
- **Se compensação 1:1** → crédito = 3.547,5 × 0,8 = R$2.838
- **Economia anual** ≈ R$5.160 (antes de OPEX)
- **Se CAPEX = R$25.000** → payback ≈ 25.000 / 5.160 ≈ 4,84 anos

## Limitações e recomendações
- Estimativas simplificadas; para projeto executivo usar simulação horária (PVGIS/PVSyst).
- Ajuste fatores regionais e perdas para maior precisão.
- Verificar regras locais de compensação e incentivos fiscais.

## Próximos passos
Use a ferramenta “Orçamento Doméstico & Simulador Energético” no ObraMétrica para testar cenários com seu consumo real e CAPEX. Consulte um projetista para análise executiva.

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "PV vs Rede: Como calcular economia, payback e LCOE para sua casa",
  "description": "Guia técnico sobre comparação de custos entre energia da rede e solar fotovoltaica.",
  "image": "https://obrametrica.com.br/assets/images/pv-vs-rede-hero.webp",
  "author": {
    "@type": "Person",
    "name": "Thiago O. M."
  },
  "publisher": {
    "@type": "Organization",
    "name": "ObraMétrica",
    "logo": {
      "@type": "ImageObject",
      "url": "https://obrametrica.com.br/obrametrica-logo.jpg"
    }
  },
  "datePublished": "2026-08-10"
}
</script>
