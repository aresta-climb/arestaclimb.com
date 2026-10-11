# Tasks: Distribuição do Editor Desktop Multiplataforma (Windows, macOS e Linux) com Abas e Detecção de SO

## 1. Lógica de Detecção de Plataforma e Navegação por Abas (TDD)

- [x] 1.1 Criar testes unitários em `src/editor.test.js` para `detectDesktopPlatform(userAgent)` e `setupPlatformTabs()`, cobrindo detecção de macOS, Linux, Windows, fallbacks mobile e alternância de abas ARIA tripartite (Red).
- [x] 1.2 Implementar `detectDesktopPlatform(userAgent)` e o gerenciador de abas `setupPlatformTabs()` em `src/editor.js` garantindo transição acessível dos três painéis e marcação de recomendação inicial (Green).
- [x] 1.3 Implementar a função utilitária de cópia do comando de terminal para a área de transferência com feedback visual temporário e testes correspondentes em `src/editor.test.js`.

## 2. Interface Semântica e Estilização (HTML & CSS)

- [x] 2.1 Atualizar `editor.html` estruturando o componente de abas WAI-ARIA com os 3 painéis: Windows (Microsoft Store), macOS (download DMG Apple Silicon + Sparkle) e Linux (Flatpakref + comando CLI), incluindo requisitos e instruções específicas.
- [x] 2.2 Estilizar em `src/editor.css` os seletores de abas, indicador de recomendação ("Seu sistema"), badge estilizada da Apple / macOS, badge do Flatpak e bloco de código de terminal.
- [x] 2.3 Atualizar o banner final e os metadados (título, OpenGraph e Twitter Cards) de `editor.html` contemplando suporte nativo a Windows, Mac e Linux.

## 3. Integração na Página Inicial e Validação de Build

- [x] 3.1 Atualizar a chamada do Editor Aresta na seção `#editor` de `index.html` para comunicar a disponibilidade multiplataforma ("Baixar para Windows, Mac e Linux") direcionando para a rota `/editor`.
- [x] 3.2 Executar a suíte completa de testes (`npm test`) e o build de produção (`npm run build`) garantindo 100% de aprovação e integridade visual.
