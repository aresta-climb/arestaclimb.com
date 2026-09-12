## Why

O Aresta Climb é um ecossistema aberto e orientado à comunidade de escalada, sem silos de dados nem paywalls proprietários. Atualmente, a landing page destaca o aplicativo móvel, o modo offline e o editor desktop, mas não evidencia com o devido destaque que tanto o aplicativo (`aresta_app`) quanto a base estruturada e os pipelines de dados (`aresta_db`) são projetos de código aberto sob licenças livres e abertos a contribuições no GitHub. Além disso, o rodapé necessita de identificação clara e links diretos para a organização oficial e seus principais repositórios.

## What Changes

- **Nova Seção de Código Aberto na Landing Page (`index.html`)**: Inclusão de uma seção após a apresentação do Editor Aresta (`#editor`) e antes do FAQ (`#faq`), com o identificador `#codigo-aberto` (ou `#open-source`), apresentando o propósito coletivo do projeto, o modelo aberto e cards interativos com links diretos para:
  - Repositório do aplicativo móvel: `https://github.com/aresta-climb/aresta_app`
  - Repositório da base de dados e ferramentas: `https://github.com/aresta-climb/aresta_db`
  - Link de destaque para a organização no GitHub: `https://github.com/aresta-climb`
- **Enriquecimento do Rodapé (Footer)**:
  - Atualização da coluna "Projeto" no rodapé de `index.html` para incluir link direto para a organização no GitHub e atalhos para os repositórios `aresta_app` e `aresta_db`.
  - Inclusão do link da organização no GitHub no rodapé das demais páginas do site (`editor.html`, `app.html`, etc.) para manter a consistência de navegação.
- **Navegação (Header)**: Avaliação e adição do link para a seção de código aberto no cabeçalho ou manutenção da barra limpa com âncora direta.
- **Testes Automatizados**: Criação e atualização de testes em `domStructure.test.js` e `landing.test.js` assegurando a presença da seção, dos links do GitHub, atributos de acessibilidade e semântica de marcação.

## Capabilities

### New Capabilities

<!-- Nenhuma nova capability isolada; a landing page existente é estendida -->

### Modified Capabilities

- `landing-page`: Adiciona requisitos para a seção dedicada de Código Aberto/Open Source com links para `aresta_app`, `aresta_db` e a organização no GitHub, bem como links explícitos da organização no rodapé.

## Impact

- **Arquivos afetados**:
  - `index.html`: Nova seção de código aberto e atualização dos links do rodapé.
  - `src/landing.css`: Estilos para o bloco de código aberto, badges e cards de repositório.
  - `editor.html`, `app.html`: Atualização do rodapé para incluir o link do GitHub da organização.
  - `src/domStructure.test.js`: Validações de teste cobrindo a nova seção, os novos links e o rodapé.
- **APIs / Dependências**: Nenhuma nova biblioteca necessária; CSS nativo e HTML semântico com suporte integral aos modos claro e escuro.
