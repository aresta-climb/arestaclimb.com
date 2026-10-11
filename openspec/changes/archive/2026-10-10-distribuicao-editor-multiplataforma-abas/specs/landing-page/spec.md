# Spec Delta: landing-page

## MODIFIED Requirements

### Requirement: Apresentação e Download do Editor Aresta
A landing page DEVE (SHALL) apresentar a ferramenta desktop oficial Editor Aresta para criação e edição de croquis vetoriais com suporte multiplataforma (Windows, Mac e Linux), disponibilizando chamada para ação ("Baixar para Windows, Mac e Linux") com link direto para a rota `/editor`.

#### Scenario: Navegação para a página do Editor
- **WHEN** o usuário clica no botão de download do editor ou no link "Conhecer o Editor" na página inicial
- **THEN** o navegador é direcionado para a rota `/editor`
