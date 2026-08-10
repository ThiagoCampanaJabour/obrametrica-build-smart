# Campos da Calculadora de Veículos (TCO)

Este documento descreve todos os campos utilizados no simulador de Custo Total de Propriedade (TCO) de veículos do ObraMétrica.

## 1. Identificação e Base
| Rótulo | Chave Export | Tipo | Unidade | Descrição |
|--------|--------------|------|---------|-----------|
| Nome do Veículo | `name` | String | - | Apelido identificador do veículo |
| Tipo | `type` | Enum | - | Gasolina, Etanol, Diesel, Híbrido, Elétrico ou Outro |
| Valor do Veículo | `vehicleValue` | Number | R$ | Valor de mercado atual ou de compra |
| KM por mês | `kmPerMonth` | Number | km | Distância média percorrida mensalmente |

## 2. Consumo e Energia
| Rótulo | Chave Export | Tipo | Unidade | Descrição |
|--------|--------------|------|---------|-----------|
| Consumo (km/L) | `consumptionKmPerL` | Number | km/L | Eficiência para veículos a combustão |
| Consumo (kWh/100km) | `consumptionKwhPer100Km` | Number | kWh/100km | Eficiência para veículos elétricos/híbridos |
| Preço Comb. (R$/L) | `fuelPricePerL` | Number | R$/L | Preço do litro do combustível |
| Preço Energia (R$/kWh) | `electricityPricePerKwh` | Number | R$/kWh | Tarifa de energia com impostos |
| Eficiência Recarga | `chargingEfficiencyPct` | Number | % | Perdas no carregador (padrão 95%) |

## 3. Manutenção e Itens Finitos
| Rótulo | Chave Export | Tipo | Unidade | Descrição |
|--------|--------------|------|---------|-----------|
| Manutenção Mensal | `maintenanceMonthly` | Number | R$ | Gastos recorrentes estimados |
| Manutenção Anual | `maintenanceAnnual` | Number | R$ | Revisões anuais diluídas |
| Custo Jogo Pneus | `finiteItems.tires.costPerSet` | Number | R$ | Valor do conjunto completo |
| Vida Útil Pneu | `finiteItems.tires.replacementIntervalKm` | Number | km | KM média para troca |
| Custo Troca Óleo | `finiteItems.oilChange.costPerChange` | Number | R$ | Valor da troca de óleo + filtros |
| Intervalo Óleo | `finiteItems.oilChange.intervalKm` | Number | km | Intervalo em KM para troca |

## 4. Tributos e Seguros
| Rótulo | Chave Export | Tipo | Unidade | Descrição |
|--------|--------------|------|---------|-----------|
| Seguro Anual | `insuranceAnnual` | Number | R$ | Valor total do prêmio anual |
| IPVA Anual | `ipvaAnnual` | Number | R$ | Imposto anual |
| Licenciamento Anual | `licensingAnnual` | Number | R$ | Taxas de licenciamento |

## 5. Financiamento
| Rótulo | Chave Export | Tipo | Unidade | Descrição |
|--------|--------------|------|---------|-----------|
| Valor Financiado | `financing.financedAmount` | Number | R$ | Saldo devedor inicial |
| Taxa Anual | `financing.annualRatePct` | Number | % | Taxa de juros nominal anual |
| Prazo | `financing.termYears` | Number | Anos | Duração do contrato |
| Tipo | `financing.amortizationType` | Enum | - | PRICE ou SAC |

## 6. Depreciação
| Rótulo | Chave Export | Tipo | Unidade | Descrição |
|--------|--------------|------|---------|-----------|
| Taxa Deprec. Anual | `depreciationRateAnnualPct` | Number | % | Perda de valor anual estimada |
| Vida Útil | `usefulLifeYears` | Number | Anos | Tempo de uso planejado (alternativo) |
| Valor Residual | `residualValue` | Number | R$ | Valor estimado de venda ao fim (alternativo) |

## 7. Extras Operacionais
| Rótulo | Chave Export | Tipo | Unidade | Descrição |
|--------|--------------|------|---------|-----------|
| Estacionamento | `parkingMonthly` | Number | R$ | Gasto mensal fixo |
| Pedágios | `tollsMonthly` | Number | R$ | Gasto mensal estimado |
| Lavagem | `carWashMonthly` | Number | R$ | Gasto mensal estimado |
| Outros | `otherMonthly` | Number | R$ | Gastos diversos |

---
*Nota: Todos os valores anuais são normalizados para custo mensal no motor de cálculo.*