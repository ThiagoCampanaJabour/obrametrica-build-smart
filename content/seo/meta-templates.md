---
title: "Templates de Meta Tags — Obra Métrica"
description: "Sugestões de title (≤60 caracteres) e meta description (150–160 caracteres) por página."
---

# Templates de Meta Tags

Todas as rotas já implementam `title`, `description`, `og:*` e `canonical` via
`pageHead()` em `src/lib/seo.ts`. Esta tabela documenta os textos aprovados
para cada página institucional e para as 5 calculadoras prioritárias do
piloto AdSense.

| Página | URL | Title (≤60) | Meta description (150–160) |
|---|---|---|---|
| Início | `/` | Obra Métrica — Calculadoras de Construção Civil e Solar | Calculadoras gratuitas de materiais para obra: telhas, blocos, cimento, aço, reboco e energia solar. Estimativas técnicas em segundos. |
| Sobre | `/sobre` | Sobre a Obra Métrica — Missão e Metodologia | Conheça a Obra Métrica: calculadoras técnicas de construção civil feitas por engenheiros para orientar orçamentos e compras de material. |
| Contato | `/contato` | Contato — Fale com a Obra Métrica | Envie dúvidas, sugestões ou parcerias para a equipe da Obra Métrica. Resposta em até 2 dias úteis pelo formulário oficial. |
| Metodologia | `/metodologia` | Metodologia — Fórmulas e Tabelas Obra Métrica | Entenda as fórmulas, presets e limitações usadas nas calculadoras da Obra Métrica. Tabelas de densidades, rendimentos e perdas. |
| Privacidade | `/politica-de-privacidade` | Política de Privacidade — Obra Métrica | Como a Obra Métrica coleta, usa e protege seus dados, incluindo cookies do Google Analytics e AdSense. Conforme LGPD. |
| Termos | `/termos-de-uso` | Termos de Uso — Obra Métrica | Termos de uso do site Obra Métrica: isenções técnicas, propriedade intelectual e responsabilidades sobre estimativas de materiais. |
| Telhas | `/calculadora-de-telhas` | Calculadora de Telhas — Quantidade e Caixas | Calcule telhas e caixas para seu telhado considerando inclinação, beiral, tipo (cerâmica, fibrocimento, metálica) e desperdício. |
| Blocos | `/calculadora-de-blocos` | Calculadora de Blocos — Quantitativo por m² | Estime a quantidade de blocos cerâmicos ou de concreto por m² de parede, com junta e desperdício ajustáveis. Grátis e técnica. |
| Reboco | `/calculadora-de-reboco` | Calculadora de Reboco — Sacos de Argamassa | Calcule sacos de argamassa e volume de reboco por m² de parede, com espessura e desperdício ajustáveis. Interno e externo. |
| Aço | `/calculadora-de-aco` | Calculadora de Aço — Peso e Barras CA-50 / CA-60 | Calcule peso em kg e número de barras comerciais (12 m) de aço estrutural CA-50 e CA-60 por bitola, com margem de perda. |
| Fôrmas | `/calculadora-de-forma` | Calculadora de Fôrmas — Chapas e Madeira | Estime chapas de compensado e madeira serrada para fôrmas de laje, viga e pilar, considerando reaproveitamentos e perdas. |

## Regras aplicadas

- **Title** ≤ 60 caracteres, com o nome da marca no final.
- **Description** entre 150 e 160 caracteres, factual e sem promessas.
- **Uma H1 única** por página (já garantido pelos componentes `CalculatorShell` e páginas institucionais).
- `og:title`, `og:description` e `og:url` acompanham `title/description/canonical` — implementado em `src/lib/seo.ts`.

Para alterar qualquer texto, edite o `head()` da rota correspondente em `src/routes/*.tsx`.
