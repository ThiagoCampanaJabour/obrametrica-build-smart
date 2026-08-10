# Inventário de Campos - Calculadora de Veículos

## A. Identificação
| Campo | Chave (Key) | Tipo | Unidade | Test ID |
|-------|-------------|------|---------|---------|
| Nome do veículo | `name` | string | - | `vehicle-{i}-label` |
| Tipo de Veículo | `type` | enum | - | `vehicle-{i}-type` |

## B. Uso & Consumo
| Campo | Chave (Key) | Tipo | Unidade | Test ID |
|-------|-------------|------|---------|---------|
| KM por mês | `kmPerMonth` | number | km | `vehicle-{i}-km-per-month` |
| Consumo (km/L) | `consumptionKmPerL` | number | km/L | `vehicle-{i}-consumption-km-per-l` |
| Consumo (kWh/100km) | `consumptionKwhPer100Km` | number | kWh/100km | `vehicle-{i}-consumption-kwh-per-100km` |

## C. Preços & Eficiência
| Campo | Chave (Key) | Tipo | Unidade | Test ID |
|-------|-------------|------|---------|---------|
| Preço Combustível | `fuelPricePerL` | number | R$/L | `vehicle-{i}-fuel-price-per-l` |
| Preço Energia | `electricityPricePerKwh` | number | R$/kWh | `vehicle-{i}-electricity-price-per-kwh` |
| Eficiência Recarga | `chargingEfficiencyPct` | number | % | `vehicle-{i}-charging-efficiency-pct` |

## D. Financiamento
| Campo | Chave (Key) | Tipo | Unidade | Test ID |
|-------|-------------|------|---------|---------|
| Valor Financiado | `financing.financedAmount` | number | R$ | `vehicle-{i}-financed-amount` |
| Taxa Anual | `financing.annualRatePct` | number | % | `vehicle-{i}-annual-rate-pct` |
| Prazo | `financing.termYears` | number | anos | `vehicle-{i}-term-years` |
| Amortização | `financing.amortizationType` | enum | - | `vehicle-{i}-amortization-type` |

## E. Manutenção & Outros
| Campo | Chave (Key) | Tipo | Unidade | Test ID |
|-------|-------------|------|---------|---------|
| Seguro Anual | `insuranceAnnual` | number | R$ | `vehicle-{i}-insurance-annual` |
| IPVA Anual | `ipvaAnnual` | number | R$ | `vehicle-{i}-ipva-annual` |
| Valor Veículo | `vehicleValue` | number | R$ | `vehicle-{i}-vehicle-value` |
| Depreciação Anual | `depreciationRateAnnualPct` | number | % | `vehicle-{i}-depreciation-rate-annual-pct` |
