# Especificação: Planilha de Orçamento Doméstico

## Funcionalidades de Abas

### Nomeação e Renomeação

O usuário pode personalizar os nomes das abas para organizar melhor seus gastos.

#### Comportamento de UX
1.  **Criação**: Ao clicar em "+ Nova Aba", um campo de texto aparece imediatamente na nova aba.
2.  **Renomeação**: Abas ativas exibem um ícone de edição (lápis) que transforma o nome em um campo editável.
3.  **Confirmação**: Pressione `Enter` ou clique fora do campo para salvar.
4.  **Cancelamento**: Pressione `Esc` para cancelar a edição. Se for uma nova aba sem nome, ela será removida.

#### Validações
-   Mínimo 1 caractere (ignorando espaços).
-   Máximo 64 caracteres.
-   Nomes duplicados são proibidos e exibem um alerta.

#### Data-TestIDs para Automação
-   `sheet-add-button`: Botão para criar nova aba.
-   `sheet-new-name-input`: Input de nome para nova aba.
-   `sheet-rename-btn-{index}`: Botão para iniciar renomeação.
-   `sheet-rename-input-{index}`: Input de renomeação.
-   `sheet-name-{index}`: Label estático da aba.
