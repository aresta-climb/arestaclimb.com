## Context

O repositório do Aresta Climb (`arestaclimb.com`) é um projeto Multi-Page Application (MPA) leve e de alta performance construído com Vite, JavaScript puro (ES Modules) e CSS moderno. A infraestrutura é servida no Cloudflare Pages.

Atualmente, o site possui documentos legais renderizados via markdown (`/cla`, `/termos-de-uso`, etc.), uma landing page para o editor desktop (`/editor`) e uma landing page principal que precisa ser modernizada a partir dos conceitos explorados em `scratch/v1`, `scratch/v2`, `scratch/v3` e `scratch/v4`.

Com o aplicativo disponível na Google Play e Apple App Store, a landing page principal precisa atuar como um hub moderno de conversão, demonstração visual do produto, educação sobre modo offline, governança/autoria de croquis e engajamento da comunidade via WhatsApp, além de fornecer uma rota inteligente de download (`/app` e `/download`) compatível com leitura de QR Code em pôsteres físicos nos picos de escalada.

## Goals / Non-Goals

**Goals:**
- Criar a versão definitiva e unificada da landing page em `index.html`, `src/landing.css` e `src/landing.js`.
- Implementar suporte a Dark/Light mode com alternância fluida e persistência em `localStorage`.
- Exibir botões oficiais de download (Google Play e Apple App Store) com placeholders prontos para URLs de produção.
- Desenvolver o showcase interativo do aplicativo sincronizado com telas reais do app (croqui interativo, setores, ficha da via e salvo offline).
- Construir a seção imersiva Offline First em modo escuro de alto contraste.
- Exibir métricas reais de cobertura de vias, setores e picos.
- Integrar a seção de Governança & Autoria com a apresentação oficial do Editor Aresta (ferramenta desktop para criação de croquis) com link para `/editor`.
- Incluir FAQ com acordeão expansível acessível e sem dependências pesadas.
- Incluir card de conversão direta para a comunidade no WhatsApp.
- Criar `app.html` com roteamento/redirecionamento inteligente por User Agent para dispositivos móveis e tela de QR Code para desktop.

**Non-Goals:**
- Não reimplementar o site em frameworks pesados (React/Next.js/Vue) — manter arquitetura leve com Vite, Vanilla JS e CSS puro para máximo desempenho e zero custo de runtime.
- Não incluir a seção "Do muro à rocha" (evitar responsabilidade técnica/jurídica).
- Não utilizar formulário antigo com geração de rascunhos de e-mail via mailto.

## Decisions

### 1. Arquitetura e Stack: Vanilla JS + CSS Moderno + Vite MPA
- **Decisão:** Manter JavaScript vanilla modular e CSS moderno com custom properties (variáveis) ao invés de adotar frameworks de componentes pesados.
- **Racional:** O site carrega instantaneamente em qualquer conexão móvel (crítico para usuários no outdoor ou em estradas), possui nota 100 no Lighthouse e integra-se nativamente com o pipeline do Cloudflare Pages e a suíte de testes Vitest.
- **Alternativas consideradas:** Usar Next.js (como na v1) foi descartado para evitar complexidade de infraestrutura, overhead de bundle e perda da simplicidade estática.

### 2. Design System & Paleta de Cores (Baseada na v4)
- **Decisão:** Adotar a identidade da v4: tons terrosos e minerais (Arenito `#f4f1e9`, Terracota queimada `#b53e29`, Verde Sálvia de montanha `#90a989` e Dark Obsidian `#11120f`) com tipografia Inter + Roboto Mono.
- **Racional:** Transmite a estética técnica e autêntica de equipamentos e montanhas, com contraste impecável e elegância visual.
- **Alternativas consideradas:** Manter o estilo predominantemente cinza/institucional da v2 (menos vibrante e menos conectado ao sentimento do esporte).

### 3. Showcase Interativo Híbrido
- **Decisão:** Criar um seletor de 4 pilares à esquerda que atualiza a tela do mockup de smartphone com transição CSS suave, suportando tanto clique/toque manual quanto leitura fluida na rolagem.
- **Racional:** Oferece interatividade sem exigir canvas ou bibliotecas pesadas e funciona perfeitamente em telas touch e desktops.

### 4. Smart App Redirect (`/app` e `/download`)
- **Decisão:** Implementar detecção de User Agent no client-side em `app.html`:
  - Se iOS / iPhone / iPad ➔ Redireciona via `window.location.replace` para o link da Apple App Store.
  - Se Android ➔ Redireciona via `window.location.replace` para o link da Google Play Store.
  - Se Desktop / Outro ➔ Exibe a interface com ambos os botões das lojas e o QR Code em alta definição centralizado para escaneamento.
- **Racional:** Permite usar a URL curta e única em pôsteres e adesivos impressos nos picos de escalada.

### 5. Conversão via Comunidade WhatsApp
- **Decisão:** Substituir o formulário mailto por um CTA destacado para entrar na Comunidade Oficial do Aresta no WhatsApp.
- **Racional:** O WhatsApp é o canal universal da escalada no Brasil, eliminando fricção e aproximando usuários, conquistadores e desenvolvedores.

## Risks / Trade-offs

- **[Risco] Bloqueio ou falha de detecção de User Agent no Smart Redirect** → **Mitigação**: O `app.html` inclui renderização imediata dos botões de fallback caso o redirecionamento automático não ocorra em 1 segundo ou seja cancelado pelo navegador.
- **[Risco] Imagens pesadas de mockups degradarem performance móvel** → **Mitigação**: Uso de imagens otimizadas em WebP/PNG comprimido e carregamento prioritário das imagens do hero e lazy loading nas seções inferiores.
