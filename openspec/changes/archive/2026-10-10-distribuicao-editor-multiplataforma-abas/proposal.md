# Proposal: Distribuição do Editor Desktop Multiplataforma (Windows, macOS e Linux) com Abas e Detecção de SO

## Why

Com a publicação do Editor Aresta para as três principais plataformas desktop — Windows (Microsoft Store e canal Beta), Linux (repositório Flatpak OSTree soberano em Cloudflare R2) e macOS (pacote nativo Apple Silicon ARM64 assinado, notarizado pela Apple e com auto-atualizações via Sparkle Framework) —, o site `arestaclimb.com` precisa disponibilizar o aplicativo para toda a comunidade de forma integrada, elegante e intuitiva.

Atualmente, a página `/editor` e as chamadas na página inicial tratam o Editor Aresta quase que exclusivamente como um aplicativo Windows da Microsoft Store. Para proporcionar a melhor experiência de usuário possível e reduzir o atrito de instalação em qualquer sistema operacional, a página deve identificar automaticamente a plataforma do visitante (User Agent) e pré-selecionar a aba adequada (Windows, macOS ou Linux), permitindo ao mesmo tempo que o usuário alterne livremente entre as plataformas e tenha acesso imediato aos instaladores nativos e comandos correspondentes.

## What Changes

- **Detecção Inteligente de Plataforma Desktop:** Implementação de lógica em `src/editor.js` para detectar o sistema operacional desktop do visitante a partir de `navigator.userAgent`, diferenciando Windows, macOS (Apple Silicon), Linux e acessos móveis.
- **Interface de Abas (Tabs) Tripartite no Editor:** Reestruturação da seção Hero em `editor.html` com um componente acessível de abas (`[ Windows ]`, `[ macOS ]` e `[ Linux (Flatpak) ]`), exibindo uma indicação de recomendação ("Seu sistema") na aba identificada.
- **Painel macOS (Apple Silicon):**
  - Botão de ação primária para download direto da imagem de disco `EditorAresta-latest.dmg` apontando para `https://serving.arestaclimb.com/editor-macos/EditorAresta-latest.dmg`.
  - Informações de compatibilidade e segurança: arquitetura Apple Silicon (M1/M2/M3/M4+), assinatura digital com certificado Apple Developer ID, notarização Apple e atualizações automáticas in-app nativas integradas via Sparkle Framework com feed `appcast.xml`.
  - Instruções rápidas de instalação no padrão macOS (arrastar para `/Applications`).
- **Painel Linux (Flatpak):**
  - Botão de ação primária para download direto do arquivo `com.arestaclimb.Editor.flatpakref` apontando para `https://serving.arestaclimb.com/flatpak/com.arestaclimb.Editor.flatpakref` para instalação gráfica em 1 clique (GNOME Software, Discover, Pop!_Shop).
  - Bloco de código com comando de instalação via terminal (`flatpak install https://serving.arestaclimb.com/flatpak/com.arestaclimb.Editor.flatpakref`) e botão de cópia com feedback visual instantâneo.
  - Informações de compatibilidade (distribuições com suporte a Flatpak, Wayland, X11, arquitetura x86_64 e atualizações automáticas via OSTree).
- **Painel Windows:**
  - Manutenção do acesso direto à Microsoft Store (`store-badge-ms`), requisitos de sistema (Windows 10/11 64-bits) e link para o canal Beta.
- **Banner Final e Rodapé do Editor:**
  - Atualização da chamada final em `editor.html` para contemplar Windows, macOS e Linux.
- **Atualização na Página Inicial (`index.html`):**
  - Atualização da chamada na seção `#editor` de "Obter na Microsoft Store" para "Baixar para Windows, Mac e Linux", direcionando para `/editor`.
- **Acessibilidade e Telemetria:**
  - Suporte completo a navegação por teclado (WAI-ARIA `tablist`/`tabpanel`) e telemetria analítica cookieless (Umami) diferenciando eventos para `windows`, `macos` e `linux`.

## Capabilities

### New Capabilities
- `editor-distribuicao-desktop`: Requisitos de experiência de usuário, detecção automática de sistema operacional (Windows, macOS e Linux), navegação por abas acessíveis, download dos instaladores nativos (MS Store, DMG Apple Silicon e Flatpakref) e utilitário de cópia de comandos de terminal na página do Editor.

### Modified Capabilities
- `landing-page`: Atualização do requisito de apresentação e download do Editor Aresta na home para referenciar a disponibilidade multiplataforma unificada (Windows, macOS e Linux).

## Impact

- **Arquivos modificados:** `editor.html`, `index.html`, `src/editor.js`, `src/editor.css`, `src/editor.test.js`.
- **APIs externas:** Nenhuma nova dependência de terceiros (JavaScript e CSS vanilla).
- **Compatibilidade:** Total compatibilidade com navegadores modernos e retrocompatibilidade com links existentes.
