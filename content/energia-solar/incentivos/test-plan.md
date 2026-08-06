# Plano de testes — Incentivos e Subsídios Regionais

Dataset: `incentives_v1` · Suíte: `src/lib/solar/incentives.test.ts`

## 1. Resolução de localidade

| # | Caso | Esperado |
| --- | --- | --- |
| 1.1 | `normalizeCEP("01310-100")` | `"01310100"` |
| 1.2 | `normalizeCEP("123")` | `null` |
| 1.3 | `ufFromCEP("01310100")` | `SP` |
| 1.4 | `ufFromCEP("90010-000")` | `RS` |
| 1.5 | `ufFromCEP("70000-000")` | `DF` |
| 1.6 | `ufFromCEP("40010-000")` | `BA` |

## 2. Lookup

| # | Caso | Esperado |
| --- | --- | --- |
| 2.1 | UF = SP | inclui `sp-icms-energia-injetada` e federais |
| 2.2 | UF = SP | não inclui `mg-icms-energia-injetada` |
| 2.3 | UF = SP | não inclui `fed-fne-sol` (restrito às UFs do FNE) |
| 2.4 | UF = BA | inclui `fed-fne-sol` |
| 2.5 | Base | todo registro tem `source.url` http(s) e `last_checked_date` ISO |

## 3. Modelos de impacto

| # | Entrada | Esperado |
| --- | --- | --- |
| 3.1 | CAPEX 100.000, desconto 20%, teto 10.000 | Δcapex = −10.000, fórmula cita teto |
| 3.2 | CAPEX 22.000, desconto 20%, teto 10.000 | Δcapex = −4.400 |
| 3.3 | Rebate 5.000 com CAPEX 1.000 | Δcapex = −1.000 |
| 3.4 | 10.000 kWh × R$1, ICMS 18%, isenção 100% | Δreceita = +1.800/ano |
| 3.5 | CAPEX 100.000, Δtaxa −2 p.p. | Δopex = −1.000/ano |
| 3.6 | CAPEX 60.000, crédito 6% em 3 anos | Δopex = −1.200/ano |

## 4. Elegibilidade

| # | Caso | Esperado |
| --- | --- | --- |
| 4.1 | Classe industrial em programa residencial | `eligible = false`, motivo cita classe |
| 4.2 | 500 kWp com teto de 100 kWp | `eligible = false` |
| 4.3 | Instalação em 2031 com vigência até 2030 | `eligible = false` |
| 4.4 | Registro `confidence: baixa` | aviso de placeholder |

## 5. Aplicação combinada

| # | Cenário (exemplo.json) | Esperado |
| --- | --- | --- |
| 5.1 | c1 — subvenção 20% + ICMS | CAPEX 25.000 → 20.000; receita 7.300 → 8.614; payback cai |
| 5.2 | c2 — financiamento −1 p.p. sobre 180.000 | OPEX cai 900/ano; líquido anual sobe |
| 5.3 | c3 — dois ICMS exclusivos | 1 incentivo aplicado + conflito reportado |
| 5.4 | c4 — inelegível por potência | 0 aplicados, CAPEX inalterado |
| 5.5 | Nenhum incentivo | `antes` idêntico a `depois` |

## 6. Exportação

| # | Caso | Esperado |
| --- | --- | --- |
| 6.1 | CSV com 1 incentivo | contém documentos exigidos e linha "Payback (anos)" |
| 6.2 | JSON | contém `dataset_version`, `disclaimer`, `fonte.url` e `verificado_em` |

## 7. QA de interface (manual / Playwright)

- Busca por CEP preenche a UF e a lista é recarregada.
- Filtros CAPEX / OPEX / Financiamento / Receita reduzem a lista corretamente.
- "Aplicar incentivo" alterna o estado e atualiza a tabela antes/depois.
- Detalhe exibe `source.url` clicável e `last_checked_date`.
- Sem overflow horizontal em 390 px de largura.
- Disclaimer legal visível no fim da página.

## Como validar localmente

```bash
git fetch origin && git checkout feat/solar-incentives
npm ci
npx vitest run src/lib/solar/incentives.test.ts
npm run dev   # abrir /energia-solar/incentivos-subsidios-regionais
```
