## Context

Veja `proposal.md` para a motivação do negócio e `specs/landing-page/spec.md` para os requisitos normativos. A landing page do Aresta Climb é implementada em HTML5 estático sem frameworks pesados, estilizada via `src/landing.css` com variáveis de design system para suporte fluido a Dark e Light Mode. A estrutura da página é validada por testes automatizados em `src/domStructure.test.js`.

## Goals / Non-Goals

**Goals:**
- Implementar a seção `#codigo-aberto` logo após a seção do Editor Aresta (`#editor`) e antes do FAQ (`#faq`), com marcação semântica e acessível.
- Disponibilizar dois cards de repositório dedicados (`aresta_app` e `aresta_db`) com links diretos, resumo técnico e botões de chamada para ação direcionados ao GitHub.
- Adicionar um link institucional convidativo para a organização `aresta-climb` no GitHub.
- Atualizar e enriquecer os links da coluna "Projeto" no rodapé de `index.html` e unificar o link para a organização nos rodapés de `editor.html` e `app.html`.
- Criar suíte de testes de regressão em `src/domStructure.test.js` assegurando a presença de todos os IDs, atributos de segurança (`rel="noopener"`) e URLs corretas.

**Non-Goals:**
- Não introduzir bibliotecas ou frameworks externos (manter zero-dependency no bundle do usuário).
- Não alterar as regras de redirecionamento ou fluxo do aplicativo mobile.

## Decisions

- **Decisão 1: Posicionamento após o Editor e antes do FAQ**:
  - *Contexto:* O usuário conhece o aplicativo, entende o funcionamento offline e vê como o editor desktop é usado para traçar vias.
  - *Escolha:* Apresentar a seção de Código Aberto imediatamente após o Editor consolida a narrativa de que todas essas ferramentas são abertas para a comunidade.
  - *Alternativas consideradas:* Posicionar antes da comunidade (WhatsApp). Descartado pois o FAQ funciona melhor como transição para o CTA final.

- **Decisão 2: Uso estrito de tokens de design existentes em `src/landing.css`**:
  - *Escolha:* Reutilizar as variáveis CSS existentes (`--surface`, `--surface-2`, `--line`, `--text`, `--muted`, `--accent`) e o grid responsivo do projeto.
  - *Alternativas consideradas:* Criar novos blocos ou estilos isolados; descartado para manter coesão e leveza.

- **Decisão 3: Estruturação dos links e segurança**:
  - *Escolha:* Todos os links externos abrem em nova aba com `target="_blank" rel="noopener"` e textos acessíveis para leitores de tela.

- **Decisão 4: Atualização dos rodapés de páginas secundárias**:
  - *Escolha:* Garantir que `editor.html` e `app.html` também contenham o link para o GitHub da organização no rodapé, uniformizando a presença de marca.

## Risks / Trade-offs

- **[Risco] Sobrecarga visual em resoluções mobile estreitas (< 380px)**  
  → *Mitigação:* Estruturar os cards de repositório em grid com `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))` para que no mobile fiquem empilhados verticalmente com espaçamento confortável.

- **[Risco] Falha nos testes de DOM existentes**  
  → *Mitigação:* Executar a suíte de testes completa via `vitest` antes e depois das alterações, expandindo os testes para validar os novos elementos sem quebrar os anteriores.
