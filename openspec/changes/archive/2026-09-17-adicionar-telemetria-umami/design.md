## Context

O repositório `arestaclimb.com` é um site estático multipáginas (MPA) construído com Vite, JavaScript puro (Vanilla JS) e CSS moderno, hospedado no Cloudflare Pages. O ecossistema já dispõe de um projeto Supabase ativo (utilizado para autenticação e dados do ecossistema) e gerencia domínios sob a Cloudflare.

Atualmente, não existe nenhum script de telemetria analítica nas páginas, mantendo a experiência livre de banners de cookies, porém sem visibilidade sobre volume de acessos, fontes de aquisição (UTMs, referrers) e conversões de download do app móvel e do editor. Além disso, há o objetivo de suportar deep links através do subdomínio `app.arestaclimb.com` direcionando usuários para conteúdos específicos do aplicativo móvel.

## Goals / Non-Goals

**Goals:**
- Prover telemetria anônima, sem cookies e em conformidade nativa com a LGPD, preservando o site 100% livre de banners de consentimento.
- Rastrear visualizações de página, origens de tráfego (UTMs e referrers) e geolocalização agregada.
- Instrumentar eventos de conversão (downloads para iOS, Android, Windows, macOS, Linux, cliques no WhatsApp e escaneamento de QR Code).
- Suportar resolução e telemetria de deep links para o aplicativo através de `app.arestaclimb.com` / rotas de smart redirect.
- Utilizar infraestrutura self-hosted conectada ao Supabase sem custos adicionais de licenciamento e sem limite restritivo de eventos mensais.

**Non-Goals:**
- Rastreamento longitudinal persistente entre sessões através de cookies ou armazenamento de dados pessoais (PII).
- Campanhas de retargeting ou remarketing comportamental via Google Ads ou Meta Pixel.
- Desenvolver servidores ou backends customizados dentro deste repositório (o site permanece estático e client-side first no Cloudflare Pages).

## Decisions

### 1. Adoção do Umami Analytics Self-Hosted no Supabase
- **Decisão:** Conectar uma instância do Umami ao banco PostgreSQL já existente no Supabase, hospedando a aplicação web na Vercel (plano gratuito) ou container serverless.
- **Racional:** O plano gratuito do Supabase (500 MB) comporta com facilidade mais de 3 milhões de registros de eventos do Umami, eliminando o limite de 10.000 eventos/mês do plano SaaS gerenciado e garantindo soberania total sobre os dados analíticos a custo zero.
- **Alternativas consideradas:**
  - *Google Analytics 4 (GA4):* Descartado por exigir banner de consentimento e adicionar scripts pesados (~50 KB a 100 KB).
  - *Cloudflare Web Analytics Nativo:* Descartado como solução única por não oferecer rastreamento flexível de eventos customizados de clique e conversão.

### 2. Subdomínio Próprio de Coleta (`analytics.arestaclimb.com`)
- **Decisão:** Configurar o subdomínio `analytics.arestaclimb.com` no DNS do Cloudflare com proxy ativo apontando para o serviço do Umami.
- **Racional:** Oferece proteção SSL automática, aceleração de borda e atua como first-party endpoint, reduzindo bloqueios equivocados por navegadores focados em privacidade.

### 3. Módulo Centralizado de Telemetria (`src/telemetry.js`) e Rastreamento Declarativo
- **Decisão:** Criar um módulo leve de telemetria no frontend para encapsular chamadas ao Umami, com suporte a atributos declarativos no HTML (`data-umami-event="download-app"`).
- **Racional:** Garante que o código das páginas e componentes continue desacoplado. Se o script analítico não carregar ou for bloqueado pelo usuário, o módulo faz degradação graciosa (no-op) sem lançar erros em runtime.

### 4. Integração de Deep Links e Redirecionamento Inteligente (`src/appRedirect.js`)
- **Decisão:** Estender a rotina de redirecionamento inteligente para capturar rotas de deep link (ex: `/via/:id`, `/setor/:id`) em `app.arestaclimb.com`, emitir a telemetria do acesso e tentar abrir o aplicativo nativo via URI scheme (`aresta://...`) com fallback automático para a loja oficial (App Store / Google Play).
- **Racional:** Permite que links compartilhados em redes sociais e WhatsApp abram diretamente no app do usuário quando instalado, enquanto contabiliza analiticamente cada tentativa de abertura e conversão.

## Risks / Trade-offs

- **[Risco] Atraso no redirecionamento por espera de evento analítico:**
  - *Mitigação:* A emissão de eventos analíticos antes de redirecionamentos móveis utilizará `navigator.sendBeacon` ou timeout curto de salvaguarda (máx. 150ms), garantindo que a experiência do usuário nunca fique travada.
- **[Risco] Bloqueio por listas estritas de adblock:**
  - *Mitigação:* Usar subdomínio próprio (`analytics.arestaclimb.com`) minimiza falsos positivos, e a aplicação permanece 100% funcional caso o script não seja carregado.
