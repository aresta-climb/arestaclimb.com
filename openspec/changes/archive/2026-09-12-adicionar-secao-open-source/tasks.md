## 1. Testes Automatizados (TDD - Fase Vermelha)

- [x] 1.1 Atualizar `src/domStructure.test.js` adicionando asserções que validam a existência da seção `#codigo-aberto`, links para `aresta_app`, `aresta_db` e a organização `aresta-climb` no GitHub, bem como a atualização dos links do rodapé em `index.html`, `editor.html` e `app.html`, e verificar que os testes falham inicialmente.

## 2. Implementação da Estrutura HTML e Seção Open Source

- [x] 2.1 Adicionar a seção semântica `#codigo-aberto` em `index.html` logo após a seção do Editor Aresta (`#editor`) e antes do FAQ (`#faq`), contendo cabeçalho institucional, cards dedicados para `aresta_app` e `aresta_db`, e chamada para a organização no GitHub com links seguros (`target="_blank" rel="noopener"`).
- [x] 2.2 Atualizar o rodapé de `index.html` na coluna "Projeto", incluindo os links para a organização oficial no GitHub, `aresta_app` e `aresta_db`.
- [x] 2.3 Atualizar os rodapés de `editor.html` e `app.html` para incluir o link para a organização no GitHub.

## 3. Estilização CSS e Design System

- [x] 3.1 Adicionar classes de estilização em `src/landing.css` para a seção `#codigo-aberto`, incluindo layout responsivo para os cards de repositório, contraste adequado, efeitos de foco/hover e integração plena aos temas claro e escuro.

## 4. Validação e Verificação Final (Fase Verde)

- [x] 4.1 Executar a suíte de testes completa via `npm test` e verificar que todos os 12+ arquivos de teste passam com sucesso.
- [x] 4.2 Executar o comando `npm run build` e verificar que o empacotamento de produção do Vite ocorre sem erros.
