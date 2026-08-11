# QA Checklist - Spreadsheet Budget (Save/Export/Import)

## 1. Salvar e Gerenciamento de Cenários
- [ ] Clicar em "Salvar" abre o modal `workbook-save-modal`.
- [ ] O campo de nome `workbook-save-name` tem valor padrão "Orçamento — ".
- [ ] Salvar gera feedback de sucesso via Toast.
- [ ] O botão "Salvar como Cópia" cria um novo ID no `localStorage`.
- [ ] O botão "Histórico" abre a lista `workbook-saves-list`.
- [ ] É possível excluir um cenário via botão `workbook-save-item-{id}-delete`.
- [ ] O Autosave pode ser ativado em Configurações -> `workbook-autosave-toggle`.

## 2. Exportação
- [ ] Exportar JSON gera arquivo `.json` sanitizado.
- [ ] Exportar XLSX gera arquivo `.xlsx` com múltiplas abas.
- [ ] Exportar CSV (Aba Atual) gera arquivo `.csv` com BOM UTF-8.
- [ ] Exportar Tudo (ZIP) gera arquivo `.zip` contendo JSON e CSVs.

## 3. Importação
- [ ] Menu Configurações -> Importar JSON permite selecionar arquivo.
- [ ] Arquivo JSON válido carrega todos os dados e abas corretamente.
- [ ] Tentativa de importar arquivo inválido mostra erro amigável.

## 4. Robustez e Migração
- [ ] Planilhas salvas com versão antiga do schema são migradas automaticamente (schemaVersion: 1).
- [ ] Simular `QuotaExceededError` no localStorage mostra aviso para exportar JSON.

## 5. Acessibilidade
- [ ] Modais fecham com a tecla `Esc`.
- [ ] Navegação via `Tab` alcança todos os controles de exportação.
