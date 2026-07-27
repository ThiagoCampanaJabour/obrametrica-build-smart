# Test Plan — Simulador Avançado

## Objetivo
Validar que `simulate()` produz saídas consistentes e que a UI expõe exportação JSON/CSV.

## Ambiente
- `npm run dev` (ou `bun run dev`)
- Rota: `/simulador-solar-avancado`

## Casos de teste

### 1. Caso base (exemplo.json)
- Input: L=10, W=6, tilt=20, azimute=0, módulo 550 W, sombra 10%
- Esperado: 23 módulos, ~12,65 kWp, perda ≈ 1,5%, produção ≈ 17.700 kWh/ano
- Verificar: mínimo 2 configurações de string sugeridas

### 2. Orientação desfavorável
- Input: L=8, W=5, tilt=45, azimute=90, módulo 450 W, sombra 15%
- Esperado: perda ≈ 5–8%, produção reduzida
- Verificar: comparativo `ganhoPct` > 0

### 3. Área insuficiente
- Input: L=2, W=1, módulo 550 W
- Esperado: `numModulos` = 0 ou 1, `stringsSuggested` vazio
- Verificar: UI não quebra

## Exportação
- Clicar "Exportar JSON" → arquivo `simulacao.json` válido
- Clicar "Exportar CSV" → header `string_id,modulos_por_string,potencia_total_W,perda_pct,producao_anual_kWh`

## Acessibilidade
- Todos os inputs com `<label>`
- Região de resultados com `aria-live="polite"`
- Botões com `aria-label`
