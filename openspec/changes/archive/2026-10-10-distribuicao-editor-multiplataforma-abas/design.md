# Design: Interface de Abas e Detecção de Plataforma Multiplataforma (Windows, macOS e Linux)

## Context

O Editor Aresta possui pipelines automatizados de compilação, assinatura e publicação para os três principais sistemas operacionais desktop:
- **Windows:** Microsoft Store (canal oficial) e MSIX / Windows App Installer (canal Beta).
- **macOS:** Imagem de disco `.dmg` assinada com Apple Developer ID, notarizada pela Apple para arquitetura Apple Silicon ARM64 e com atualizações automáticas in-app nativas gerenciadas pelo Sparkle Framework via feed `appcast.xml` no Cloudflare R2 (`https://serving.arestaclimb.com/editor-macos/`).
- **Linux:** Repositório soberano Flatpak OSTree no Cloudflare R2 (`https://serving.arestaclimb.com/flatpak/`) com arquivo `.flatpakref` e comandos de terminal.

A página [`editor.html`](file:///c:/Renato/Devel/aresta-climb/arestaclimb.com/editor.html) necessita de uma reformulação para exibir uma interface unificada, acessível e inteligente com abas que detectam o sistema operacional do usuário.

## Goals / Non-Goals

**Goals:**
- Detectar automaticamente se o visitante está em ambiente Windows, macOS desktop ou Linux desktop via `navigator.userAgent`.
- Apresentar abas visuais acessíveis (`Windows`, `macOS` e `Linux (Flatpak)`) com transição suave e indicação visual de recomendação ("Seu sistema").
- Disponibilizar na aba macOS o botão com link para `EditorAresta-latest.dmg`, instruções do fluxo nativo do macOS (arrastar para Aplicativos) e menção de suporte a Apple Silicon e Sparkle.
- Disponibilizar na aba Linux o botão com link para o `.flatpakref` e o snippet de terminal copiável.
- Atualizar a home (`index.html`) para promover o Editor como solução para Windows, Mac e Linux.
- Garantir 100% de cobertura de testes unitários via Vitest.

**Non-Goals:**
- Construir detecção no lado do servidor (Edge Workers); toda a lógica deve ser puramente client-side para manter o deploy estático simples e compatível com CDN.
- Suporte a arquiteturas macOS legadas baseadas em Intel x86_64 (o app oficial suporta exclusivamente Apple Silicon ARM64).
- Pacotes Linux fora do padrão Flatpak (como `.deb` ou `.rpm`).

## Decisions

### 1. Detecção Tripartite de SO Desktop via User Agent
- **Decisão:** Implementar a função `detectDesktopPlatform(userAgent)` em `src/editor.js`:
  ```javascript
  export function detectDesktopPlatform(userAgent) {
    if (!userAgent || typeof userAgent !== 'string') return 'windows';
    const ua = userAgent.toLowerCase();

    // macOS desktop (exclui dispositivos iOS como iPhone, iPad, iPod)
    if (/macintosh|mac os x/i.test(ua) && !/iphone|ipad|ipod/i.test(ua)) {
      return 'macos';
    }

    // Linux desktop (exclui Android que é mobile)
    if (/linux|x11/i.test(ua) && !/android/i.test(ua)) {
      return 'linux';
    }

    // Windows ou fallback padrão
    return 'windows';
  }
  ```
- **Rationale:** Permite classificar de forma precisa e sem bibliotecas pesadas qualquer navegador desktop moderno, isolando acessos mobile.

### 2. Arquitetura de Abas Acessíveis (WAI-ARIA)
- **Decisão:** Utilizar markup semântico com padrão WAI-ARIA `tablist`, `tab`, `tabpanel`:
  ```html
  <div class="platform-tabs-nav" role="tablist" aria-label="Opções de instalação por sistema operacional">
    <button role="tab" id="tab-btn-windows" aria-controls="panel-windows" aria-selected="true">Windows</button>
    <button role="tab" id="tab-btn-macos" aria-controls="panel-macos" aria-selected="false">macOS</button>
    <button role="tab" id="tab-btn-linux" aria-controls="panel-linux" aria-selected="false">Linux (Flatpak)</button>
  </div>
  <div role="tabpanel" id="panel-windows" aria-labelledby="tab-btn-windows">...</div>
  <div role="tabpanel" id="panel-macos" aria-labelledby="tab-btn-macos" hidden>...</div>
  <div role="tabpanel" id="panel-linux" aria-labelledby="tab-btn-linux" hidden>...</div>
  ```
- **Rationale:** Conformidade total com W3C ARIA, permitindo navegação por teclado (setas direcionais) e leitores de tela.

### 3. Distribuição macOS (Apple Silicon + Sparkle)
- **Decisão:** Criar a badge macOS com ícone da Apple apontando para o link permanente:
  `https://serving.arestaclimb.com/editor-macos/EditorAresta-latest.dmg`
  Destacar na interface:
  - *Apple Silicon Nativo (M1/M2/M3/M4+)*
  - *Notarizado pela Apple*
  - *Atualizações contínuas in-app com Sparkle Framework*

### 4. Snippet de Terminal e Cópia para Clipboard no Linux
- **Decisão:** Manter no painel Linux o bloco com comando:
  ```bash
  flatpak install https://serving.arestaclimb.com/flatpak/com.arestaclimb.Editor.flatpakref
  ```
  Ao clicar em "Copiar", a função envia o comando para o clipboard com feedback visual de 2,5 segundos.

### 5. Telemetria Granular no Umami
- **Decisão:** Eventos customizados com propriedades específicas:
  - Windows: `data-umami-event="download-editor" data-umami-event-plataforma="windows"`
  - macOS: `data-umami-event="download-editor" data-umami-event-plataforma="macos"`
  - Linux: `data-umami-event="download-editor" data-umami-event-plataforma="linux"`
  - Cópia CLI: `data-umami-event="copiar-comando-terminal" data-umami-event-plataforma="linux"`

## Risks / Trade-offs

- **[Risco]** Visitante com Mac Intel antigo tentando instalar binário ARM64.  
  → **Mitigação:** Deixar explícito no painel do macOS que o Editor requer processadores Apple Silicon (M1 ou posterior).
- **[Risco]** Modos de navegação que ofuscam o User Agent.  
  → **Mitigação:** As 3 abas estão sempre visíveis e acessíveis para troca com 1 clique.
