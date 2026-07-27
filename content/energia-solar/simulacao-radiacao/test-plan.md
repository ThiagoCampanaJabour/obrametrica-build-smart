---
title: Plano de teste — Simulação por Localização
description: Casos de teste manuais e critérios de aceite para a ferramenta de simulação por localização.
---

## Casos manuais

### Caso 1 — São Paulo, 5,5 kWp
- **Input**: lat=-23.55, lng=-46.63, kWp=5.5, tilt=23, azimute=0, PR=0.80, perdas=10%.
- **Esperado**: produção anual entre **6.400 e 7.300 kWh**, fator específico ~1.200–1.320 kWh/kWp·ano, incerteza ±10%.

### Caso 2 — Fortaleza, 4 kWp
- **Input**: lat=-3.72, lng=-38.54, kWp=4, tilt=5, azimute=0, PR=0.80, perdas=10%.
- **Esperado**: produção anual entre **6.000 e 6.700 kWh**, fator específico ~1.500–1.680 kWh/kWp·ano.

### Caso 3 — Petrolina/semiárido, 4 kWp
- **Input**: cidade="Petrolina", kWp=4, tilt=9, azimute=0, PR=0.80, perdas=10%.
- **Esperado**: produção anual entre **6.400 e 7.100 kWh**, fator específico ~1.600–1.780 kWh/kWp·ano.

## Verificações funcionais

- [ ] Página `/energia-solar/simulacao-radiacao` abre com HTTP 200.
- [ ] Formulário aceita lat/lng, CEP e cidade; validação impede kWp ≤ 0.
- [ ] Fallback climático funciona quando nada casa.
- [ ] Gráfico de barras exibe 12 meses.
- [ ] Export JSON contém `input`, `irradianciaMensalKWhM2`, `producaoMensalKWh`, `producaoAnualKWh`, `incertezaPct`.
- [ ] Export CSV tem 12 linhas + cabeçalho.
- [ ] Meta title, description, og:* e canonical corretos.
- [ ] FAQ JSON-LD válido (Rich Results Test).
- [ ] Página é responsiva ≤ 375 px.
- [ ] aria-live="polite" no bloco de resultados.
