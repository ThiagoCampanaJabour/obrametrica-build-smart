# Arquivamento de Ferramentas de Orçamento

Data: Mon Aug 10 21:02:02 UTC 2026
Motivo: Remoção permanente das calculadoras de Gastos com Mercado, Gastos com Veículos e Simulador Energético do hub principal.

## Instruções para Restauração
Para restaurar estes arquivos para o branch principal:
1. git checkout archive/gastos-tools-20260810210202
2. git mv src/components/Orcamento/archived/gastos-tools-20260810210202/* [diretório original]
3. Reverter as alterações nos arquivos de rotas, sitemap e tipos.

## Arquivos Movidos
- src/components/Orcamento/MarketExpenses*
- src/components/Orcamento/VehicleExpenses*
- src/routes/orcamento-domestico.gastos-mercado.tsx
- src/routes/orcamento-domestico.gastos-veiculos.tsx
- src/lib/finance/market.ts
- src/lib/finance/vehicle.ts
- content/finance/vehicle-presets.json
- content/finance/market-fields-inventory.json
- docs/market-fields-*
- docs/vehicle-*
