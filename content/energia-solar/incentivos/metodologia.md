---
title: Metodologia — Incentivos e Subsídios Regionais (Energia Solar)
dataset: incentives_v1
updated: 2026-08-01
curator: ObraMétrica — curadoria editorial
---

# Metodologia — Incentivos e Subsídios Regionais

## 1. Escopo

A ferramenta cruza a localidade informada (UF, município e, opcionalmente, CEP) com uma base
versionada de incentivos aplicáveis à geração distribuída fotovoltaica no Brasil, e estima o
impacto financeiro de cada programa sobre CAPEX, OPEX, receita anual e payback simples.

A base cobre quatro escopos: **federal**, **estadual**, **municipal** e **concessionária**.

## 2. Resolução de localidade

- CEP é normalizado para 8 dígitos e mapeado para UF por faixas oficiais de prefixo (01000–19999 SP,
  20000–28999 RJ, …, 90000–99999 RS).
- O município é texto livre e serve para casar registros municipais específicos.
- O usuário pode forçar outra localidade para comparar cenários — útil em vendas B2B.

Regras de filtragem:

| Escopo | Critério |
| --- | --- |
| federal | vale em todo o país, salvo lista `eligibility.ufs` (ex.: FNE Sol) |
| estadual | `incentive.uf` deve coincidir com a UF |
| municipal | município coincidente, ou registro genérico sem município |
| concessionária | UF coincidente quando informada |

## 3. Modelos de impacto

| Modelo | Fórmula | Efeito |
| --- | --- | --- |
| `direct_capex_discount` | `min(CAPEX × p%, teto)` | reduz CAPEX |
| `rebate_fixed` | `min(valor, CAPEX)` | reduz CAPEX |
| `icms_exemption` | `Receita × alíquota% × isenção%` | aumenta receita anual |
| `net_metering_bonus` | `Receita × bônus%` | aumenta receita anual |
| `tariff_discount` | `Receita × desconto%` | aumenta receita anual |
| `financing_rate` | `CAPEX × Δtaxa × 0,5` | reduz OPEX anual |
| `tax_credit` | `CAPEX × p% ÷ anos` | reduz OPEX anual |
| `opex_reduction_fixed` | valor fixo/ano | reduz OPEX anual |

O fator 0,5 no financiamento representa o saldo devedor médio de uma amortização linear: em SAC, o
saldo cai linearmente de 100% a 0%, de modo que os juros pagos ao longo do prazo equivalem, em média
anual, a metade do principal multiplicada pela taxa.

## 4. Ordem de aplicação e conflitos

Os incentivos são aplicados nesta ordem, sempre recalculando sobre o valor já ajustado:

```text
1. direct_capex_discount
2. rebate_fixed
3. icms_exemption
4. tax_credit
5. net_metering_bonus
6. tariff_discount
7. opex_reduction_fixed
8. financing_rate
```

Registros que compartilham `exclusive_group` (ex.: `icms-energia-injetada`, `financiamento`,
`subvencao-capex`) atacam a mesma base tributária ou o mesmo contrato e **não somam**. A ferramenta
mantém o de maior benefício e registra o conflito no relatório.

## 5. Elegibilidade

Antes de aplicar, cada incentivo é validado contra:

- classe do consumidor (residencial, comercial, industrial, rural, condomínio);
- faixa de potência (`kwp_min` / `kwp_max`);
- UFs atendidas, quando o programa é regional;
- vigência versus data prevista de instalação;
- avisos de confiança e observações do programa.

Incentivos não elegíveis não entram no cálculo e aparecem na lista de conflitos com o motivo.

## 6. Payback

```text
Receita anual = produção anual × tarifa
Líquido anual = receita − OPEX
Payback = CAPEX / líquido anual   (null quando o líquido é ≤ 0)
```

O comparativo antes/depois usa exatamente a mesma fórmula, mudando apenas os insumos ajustados
pelos incentivos.

## 7. Governança da base

- Arquivo: `content/energia-solar/incentivos/presets.json`, campo `version` (`incentives_v1`).
- Cada registro exige `source.organization`, `source.url`, `source.doc_reference` e
  `source.last_checked_date`.
- `confidence` assume `alta` (norma federal/estadual verificada em site oficial), `media`
  (programa real com condições variáveis) ou `baixa` (placeholder de curadoria).
- Ciclo de revisão sugerido: trimestral. Registros com verificação acima de 180 dias devem ser
  reavaliados antes de uso comercial.
- Sugestões de atualização chegam pela página de contato e passam por curadoria antes de virar
  commit na base.

### Painel administrativo (fora do MVP)

Especificação registrada para evolução: CRUD de incentivos com histórico de alterações, upload do
PDF da portaria, aprovação por administrador, validação por JSON Schema do `presets.json` e
endpoint `POST /api/incentives/update` para publicar nova versão da base.

## 8. Limitações

- Alíquotas de ICMS são referências por estado; a alíquota efetiva varia por classe, faixa de
  consumo e bandeira.
- O modelo de financiamento é uma aproximação linear; não substitui uma tabela de amortização.
- Não há cálculo de imposto de renda sobre pessoa jurídica nem de depreciação acelerada.
- Programas municipais são majoritariamente genéricos nesta versão e exigem curadoria local.

## 9. Fontes

- Lei nº 14.300/2022 — marco legal da geração distribuída.
- Convênio ICMS 16/2015 (CONFAZ) e regulamentos estaduais de ICMS.
- Lei nº 9.991/2000 e PROPEE/ANEEL — Programa de Eficiência Energética.
- Banco do Nordeste — FNE Sol; BNDES — Finame Baixo Carbono.
- Legislação municipal de IPTU Verde (variável por município).

> A informação é de orientação inicial. Confirme a norma vigente e consulte assessoria contábil
> antes de qualquer compromisso contratual.
