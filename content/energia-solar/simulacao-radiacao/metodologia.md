---
title: Metodologia — Simulação por Localização / Radiação Solar
description: Fórmulas, presets de irradiância e suposições usados no simulador de radiação solar por localização.
---

## Fontes de dados

O MVP usa uma tabela interna de irradiância global horizontal (GHI) para cidades representativas do Brasil, em `content/energia-solar/simulacao-radiacao/presets/irradiancia-brasil.json`. Cada entrada contém latitude, longitude, GHI anual (kWh/m²·ano) e vetor mensal (12 posições, kWh/m²·mês). Os valores são **típicos de referência**, arredondados a partir de médias públicas (Atlas Brasileiro de Energia Solar, INPE e literatura técnica). Para projetos executivos, substitua por dados de **PVGIS**, **NSRDB** ou medições locais.

## Seleção do preset

A ordem de prioridade dos inputs é: **lat,lng → CEP → cidade**.

1. Se o usuário informar lat,lng, calculamos a distância euclidiana simples entre `(lat, lng)` e cada preset e escolhemos o mais próximo. Não usamos Haversine porque, para o território brasileiro e para uma tabela de 10 cidades, o ganho de precisão é desprezível.
2. Se informar cidade/UF, buscamos pelo nome.
3. Se apenas o clima for informado (Tropical, Semiárido, Temperado), aplicamos presets regionais agregados.

Se nada casar, usa-se um fallback "Clima padrão" com GHI = 1800 kWh/m²·ano e distribuição sazonal média.

## Ajuste por inclinação e azimute

A irradiância no plano do módulo (POA — Plane of Array) é aproximada por:

```
GHI_tilt ≈ GHI_horizontal × f_inclinacao(lat, tilt) × f_azimute(azimute)
```

- **f_inclinacao**: fator empírico. Quando `tilt ≈ |lat|` (inclinação ótima), aplica-se ganho de +5 a +8% sobre a horizontal. Para `tilt = 0`, mantém-se o valor horizontal. Para desvios `Δtilt = |tilt − |lat||`, aplica-se decaimento linear de ~0,15% por grau até um mínimo de 0,80.
- **f_azimute**: no hemisfério sul, azimute ótimo é 0° (norte geográfico). Aplica-se `1 − 0,0015 × min(Δaz, 180 − Δaz)²/90`, saturando em 0,80 para Δaz ≥ 90°.

Trata-se de um modelo simplificado. Modelos mais precisos (Erbs, HDKR, Perez) exigem componentes de irradiância difusa e direta separados, que fogem ao escopo deste MVP.

## Da irradiância à produção

A produção anual é calculada por:

```
Producao_ano (kWh) = kWp × GHI_tilt (kWh/m²·ano) × PR × (1 − perdas)
```

- **kWp**: capacidade DC instalada.
- **GHI_tilt**: irradiância anual no plano do módulo (equivalente a `kWh/kWp·ano` quando dividido por 1).
- **PR (Performance Ratio)**: padrão 0,80. Ajustável entre 0,70 e 0,90.
- **perdas**: agrupam inversor, cabos, sujeira, mismatch e temperatura. Padrão 10%.

O fator específico é `Producao_ano / kWp` (kWh/kWp·ano). A distribuição mensal é obtida aplicando o mesmo cálculo à irradiância mensal do preset.

## Projeção plurianual (opcional)

Se o horizonte for maior que 1 ano, aplica-se degradação anual (`degradacaoPctAno`, padrão 0,5%) sobre a produção do ano anterior:

```
Producao_ano_n = Producao_ano_1 × (1 − degradacao)^(n−1)
```

## Incerteza

Como o MVP não usa dados horários nem componentes difusa/direta, informamos incerteza de **±15%** por padrão. Valores de referência típicos:

- Preset de cidade exata: ±10%.
- Preset mais próximo (raio até ~200 km): ±15%.
- Fallback "Clima padrão": ±25%.

## Interpretação dos resultados

- **kWh/kWp·ano**: expectativa média anual de produção específica. No Brasil, valores plausíveis vão de 1.200 (Sul, com muitos dias nublados) a 1.700 (Nordeste semiárido).
- **Produção mensal**: útil para dimensionar armazenamento e verificar meses críticos.
- Para negociação com a distribuidora e cálculo de payback, use a produção anual como entrada da [Calculadora de Payback](/energia-solar/calculadora-payback).

## Integração futura com APIs reais

Onde substituir por dados reais (marcado com `// TODO: integração PVGIS/NSRDB` no `calc.ts`):

1. Função `getIrradiancePreset(lat, lng)` — trocar leitura do JSON por chamada à API PVGIS `seriescalc` ou `PVcalc` (endpoint `https://re.jrc.ec.europa.eu/api/v5_2/PVcalc`).
2. Ajuste POA — usar diretamente `E_d`, `E_m`, `E_y` retornados pelo PVGIS já com tilt/azimute aplicados, dispensando `f_inclinacao` e `f_azimute`.
3. Cache — armazenar a resposta em Cloudflare KV ou tabela `irradiance_cache` por `(lat, lng, tilt, azimute)`.

## Aviso

Os resultados são estimativas educacionais. Para projeto executivo, valide com PVGIS/NSRDB e faça análise horária de sombreamento local.
