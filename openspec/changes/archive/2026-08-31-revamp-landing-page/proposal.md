## Why

O Aresta Climb possui 4 versões conceituais de landing page dispersas no diretório de rascunhos, cada uma contendo partes valiosas da proposta de valor do aplicativo: foco no app e cultura da escalada (v1), governança, autoria e transparência (v2), direção de arte e ritmo visual (v3) e um design system refinado com suporte a Dark/Light mode e destaque do Editor Desktop (v4).

Com o aplicativo já publicado nas lojas oficiais (Apple App Store e Google Play), é necessário consolidar a versão definitiva da landing page no repositório oficial, integrando um showcase interativo do app, destaque do modo offline, métricas reais da base de dados, apresentação do Editor Aresta, canal direto da comunidade no WhatsApp e uma rota inteligente de download/QR Code (`/app` e `/download`) para uso na web e em pôsteres físicos nos picos de escalada.

## What Changes

- **Nova Landing Page Unificada (`index.html`, `src/landing.css`, `src/landing.js`)**:
  - **Header Moderno**: Navegação suave, alternância de tema Dark/Light com persistência, e CTA direto "Baixar o App".
  - **Hero de Alto Impacto**: Headline *"Quer um beta? Use o Aresta!"*, badges oficiais da App Store e Google Play, popover interativo com QR Code para escanear no desktop e mockup visual do app com selo *100% Offline*.
  - **A Dor & A Solução**: Seção *"Menos caça à informação. Mais parede."* abordando a fragmentação de PDFs e mensagens e apresentando a tríade de valor (O que escalar?, Como chegar?, O que saber?).
  - **Showcase Interativo do App**: Demonstração tátil sincronizada das telas do aplicativo (Croqui Interativo na Foto, Explorar Setores, Ficha da Via & Beta, Salvo Offline).
  - **Modo Offline Imersivo**: Bloco escuro com alto contraste visual e narrativa passo a passo de campo (*Baixe na cidade ➔ Suba a trilha ➔ Consulte na base da via ➔ Sincronize atualizações*).
  - **Métricas Reais de Cobertura**: Exibição dos números reais da base (25+ croquis, 2.500+ vias, 250+ setores, cobertura em Minas Gerais e expansão).
  - **Governança, Autoria & Território**: Princípios de respeito à comunidade, histórico de conquistas, proteção de dados e canais para autores/conquistadores.
  - **O Editor Aresta (Desktop)**: Seção dedicada à ferramenta de desktop para desenho de croquis vetoriais com link direto para `/editor`.
  - **FAQ Interativo**: Respostas para as principais dúvidas da comunidade (sinal offline, gratuidade, sugestão de novos picos, segurança).
  - **Comunidade no WhatsApp & CTA Final**: Card moderno de conversão direta para o grupo da comunidade de escaladores no WhatsApp.
  - **Remoção de conteúdo sensível**: Remoção da seção "Do muro à rocha" para evitar ruídos de responsabilidade técnica/segurança.
  - **Substituição do antigo formulário mailto**: Substituído pelo canal ágil e moderno de comunidade via WhatsApp.
- **Smart App Redirect & QR Code Hub (`app.html` e `/download`)**:
  - Nova página `/app` com detecção de plataforma (iOS ➔ App Store, Android ➔ Google Play, Desktop ➔ exibição de QR Code e ambos os badges).
  - Redirecionamento configurado de `/download` para `/app`.
  - Placeholder configurável para as URLs finais das lojas.

## Capabilities

### New Capabilities
- `landing-page`: Nova landing page oficial de alta conversão, unindo identidade visual moderna, modo escuro/claro, vitrine interativa do app, apresentação do editor, métricas, governança, FAQ e comunidade no WhatsApp.
- `app-smart-redirect`: Rota e página inteligente `/app` (com alias `/download`) para detecção de sistema operacional móvel e direcionamento automático para as lojas de aplicativos ou exibição de QR Code.

### Modified Capabilities

*(Nenhuma capacidade existente com requisitos formais modificados — primeira especificação formal do projeto).*

## Impact

- `index.html`: Substituição completa pela nova estrutura unificada.
- `src/landing.css`: Novo design system baseado na v4, com suporte a variáveis CSS, modo escuro/claro, glassmorphism e responsividade completa.
- `src/landing.js`: Lógica interativa de alternância de tema, showcase do app, FAQ expansível, modal de QR Code e links da comunidade.
- `app.html` / `dist/`: Nova rota para smart redirect de download e leitura de QR Code.
- `vite.config.js`: Atualização dos inputs MPA do Vite para incluir a nova página `app.html`.
