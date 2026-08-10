# Metodologia de Cálculo — Orçamento Doméstico

Este documento descreve as fórmulas e premissas utilizadas na ferramenta de Orçamento Doméstico & Simulador Energético do ObraMétrica.

## 1. Consumo de Energia

### Consumo Direto
Se o usuário informa o consumo mensal em kWh, este valor é multiplicado por 12 para obter o consumo anual.

### Consumo por Equipamentos
$Consumo_{equip} (kWh/mês) = \frac{Potência(W)}{1000} \times Horas/dia \times Dias/mês \times Quantidade$

## 2. Geração Fotovoltaica

A produção anual estimada é calculada pela fórmula:
$E_{anual} (kWh) = P_{pk} (kWp) \times Fator_{local} (kWh/kWp/ano) \times (1 - Perdas)$

*   **P_pk**: Potência de pico do sistema instalada.
*   **Fator_local**: Irradiação solar local ajustada pela performance do sistema.
*   **Perdas**: Perdas padrão de sistema (default 14%).

## 3. Economia e Indicadores Financeiros

### Economia Anual
$Economia = (E_{autoconsumo} \times Tarifa) + (E_{exportada} \times Taxa_{credito}) - OPEX_{anual}$

### Payback Simples
$Payback (anos) = \frac{Investimento (CAPEX)}{Economia Anual}$

### LCOE (Custo Nivelado de Energia)
$LCOE = \frac{\frac{CAPEX}{VidaÚtil} + OPEX_{anual}}{E_{anual}}$

---
**Aviso Legal:** Estas são estimativas simplificadas para fins educativos. O retorno real depende de condições climáticas variáveis, mudanças regulatórias na compensação de créditos e custos reais de instalação. Consulte sempre um engenheiro ou projetista qualificado.
