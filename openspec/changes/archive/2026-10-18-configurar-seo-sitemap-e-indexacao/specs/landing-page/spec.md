# Spec Delta

## ADDED Requirements

### Requirement: Descoberta de Páginas Internas no Rodapé Institucional
O rodapé institucional de `index.html` DEVE (MUST) disponibilizar links diretos para todas as páginas públicas indexáveis que não possuem link na barra de navegação superior, incluindo `/editor/beta`, `/privacidade-contribuidores` e `/contato`, garantindo que nenhuma página pública fique órfã de navegação interna.

#### Scenario: Presença de links para Editor Beta, Privacidade de Contribuidores e Contato no rodapé da Home
- **WHEN** um usuário ou crawler inspeciona o rodapé institucional de `index.html`
- **THEN** a coluna "Produto" contém link apontando para `/editor/beta`
- **AND** a coluna "Documentação" contém link apontando para `/privacidade-contribuidores`
- **AND** a coluna "Projeto" contém link apontando para a página `/contato`
