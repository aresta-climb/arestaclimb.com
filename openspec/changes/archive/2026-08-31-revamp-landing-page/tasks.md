## 1. Preparação de Recursos e Mídia (Client-Side Assets)

- [x] 1.1 Consolidar imagens e capturas reais do app das pastas scratch para `public/assets/app/` (croqui-interativo, setores, ficha-via, offline)
- [x] 1.2 Gerar vetor SVG e imagem em alta resolução do Smart QR Code para uso na web e impressão em pôsteres físicos nos picos
- [x] 1.3 Verificar assets institucionais de marca e logos em `public/assets/` e `public/brand/`

## 2. Testes de Integração e Unidade (TDD - Fase Vermelha / Red)

- [x] 2.1 Criar suíte de testes de integração para roteamento e detecção de User Agent no Smart Redirect (`src/appRedirect.test.js`)
- [x] 2.2 Criar suíte de testes unitários para gerenciamento de tema Dark/Light e persistência (`src/landing.test.js`)
- [x] 2.3 Criar suíte de testes unitários para o estado do showcase interativo e transições de tela do app
- [x] 2.4 Criar suíte de testes unitários para acessibilidade e expansão do FAQ e modal de QR Code

## 3. Implementação da Lógica Interativa (TDD - Fase Verde / Green)

- [x] 3.1 Implementar módulo de alternância de tema com suporte a `localStorage` e `prefers-color-scheme` em `src/landing.js`
- [x] 3.2 Implementar lógica do showcase interativo do aplicativo sincronizado com o mockup em `src/landing.js`
- [x] 3.3 Implementar lógica acessível de expansão de perguntas frequentes (FAQ) em `src/landing.js`
- [x] 3.4 Implementar lógica de controle do modal/popover de QR Code no desktop em `src/landing.js`
- [x] 3.5 Implementar script client-side de detecção e redirecionamento de OS em `src/appRedirect.js`

## 4. Design System e Estilização (CSS Moderno e Responsivo)

- [x] 4.1 Estruturar variáveis de tema em `src/landing.css` (Arenito, Terracota, Sálvia e Obsidian Escuro)
- [x] 4.2 Estilizar componentes do Header, Hero com badges das lojas e seção A Dor vs A Solução
- [x] 4.3 Estilizar o Showcase Interativo com animações suaves de transição de tela
- [x] 4.4 Estilizar o bloco imersivo de Modo Offline ("O sinal acaba. O croqui não.")
- [x] 4.5 Estilizar blocos de Métricas, Governança/Autoria, Editor Desktop, FAQ e Card da Comunidade WhatsApp
- [x] 4.6 Garantir responsividade completa para dispositivos móveis, tablets e telas ultrawide

## 5. Estrutura das Páginas HTML (MPA)

- [x] 5.1 Atualizar `index.html` com a estrutura semântica definitiva, metatags OpenGraph e acessibilidade WAI-ARIA
- [x] 5.2 Criar `app.html` como hub inteligente de download e destino de escaneamento de QR Code
- [x] 5.3 Atualizar `vite.config.js` para incluir o ponto de entrada `app.html` e configurar alias de `/download` para `/app`

## 6. Verificação de Qualidade, Cobertura e Refatoração (TDD - Fase Refatorar)

- [x] 6.1 Executar suíte completa de testes com Vitest (`npm run test` e `npm run test:coverage`) garantindo 100% de aprovação
- [x] 6.2 Executar build de produção (`npm run build`) e validar integridade do diretório `dist/`
- [x] 6.3 Validar navegação, links legais, visualização em modo claro/escuro e responsividade no preview local
