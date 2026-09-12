## ADDED Requirements

### Requirement: Seção de Código Aberto e Ecossistema Comunitário
A landing page DEVE (MUST) apresentar uma seção dedicada com identificador semântico (`#codigo-aberto`) posicionada após a seção do Editor Aresta (`#editor`) e antes da seção de FAQ (`#faq`), comunicando de forma clara que o projeto é 100% open source, livre de barreiras proprietárias e construído pela comunidade de escalada. A seção DEVE (MUST) disponibilizar links de acesso externo e seguro para o repositório do aplicativo móvel (`aresta_app`), o repositório da base de dados (`aresta_db`) e a organização oficial no GitHub.

#### Scenario: Visualização dos cards de repositórios abertos
- **QUANDO** o usuário navega até a seção de código aberto
- **ENTÃO** são exibidos cards informativos e distintos para o `aresta_app` e para o `aresta_db`, detalhando seus respectivos propósitos
- **E** cada card contém um link seguro (`target="_blank" rel="noopener"`) apontando para `https://github.com/aresta-climb/aresta_app` e `https://github.com/aresta-climb/aresta_db`

#### Scenario: Acesso ao link da organização no GitHub
- **QUANDO** o usuário visualiza a seção de código aberto
- **ENTÃO** é apresentado um elemento de chamada convidando a comunidade a contribuir e conhecer a organização oficial no GitHub em `https://github.com/aresta-climb`

### Requirement: Identificação e Links da Organização no Rodapé
O rodapé institucional de `index.html` e das páginas secundárias DEVE (MUST) conter links explícitos para a organização oficial no GitHub e para os repositórios do ecossistema.

#### Scenario: Visualização dos links do projeto no rodapé da página inicial
- **QUANDO** o usuário visualiza o rodapé de `index.html` na coluna de Projeto
- **ENTÃO** são exibidos os links para a organização no GitHub (`https://github.com/aresta-climb`), para o repositório `aresta_app` e para o repositório `aresta_db`

#### Scenario: Visualização do link do GitHub nas demais páginas
- **QUANDO** o usuário navega em páginas secundárias como `editor.html` e `app.html`
- **ENTÃO** o rodapé exibe o link direto apontando para a organização `https://github.com/aresta-climb`
