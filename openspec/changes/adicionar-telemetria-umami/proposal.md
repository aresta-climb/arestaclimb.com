## Why

O ecossistema Aresta Climb precisa de visibilidade real sobre o volume de visitantes, canais de aquisição (origens orgânicas, redes sociais, campanhas e QR Codes em ginásios) e taxas de conversão de download tanto do aplicativo móvel quanto do Editor Desktop. 

Além disso, com a introdução do subdomínio `app.arestaclimb.com` para tratamento de deep links dos aplicativos móveis, é fundamental medir a navegação para rotas de deep links (ex: vias, croquis e setores) e o comportamento de fallback para as lojas de aplicativos.

Essa telemetria deve ser 100% privada, aderente à LGPD por design, sem utilizar cookies ou identificadores persistentes no dispositivo do usuário, eliminando a necessidade de banners de consentimento intrusivos e preservando o carregamento ultrarrápido do site.

## What Changes

- Integração do script cliente de telemetria privada (Umami) com tamanho inferior a 2 KB em todas as páginas do ecossistema (`index.html`, `app.html`, `editor.html`, etc.).
- Instrumentação de eventos de conversão sem cookies via atributos semânticos (`data-umami-event`) para:
  - Cliques de download do app móvel (Apple App Store e Google Play Store).
  - Cliques de download do Editor Desktop (Windows, macOS e Linux).
  - Visualizações e interações com os QR Codes de download.
  - Cliques para a comunidade oficial no WhatsApp e repositórios no GitHub.
- Suporte a deep links e telemetria no subdomínio `app.arestaclimb.com` / rotas de smart redirect:
  - Registro anônimo de navegação para deep links com parâmetros de rota.
  - Telemetria de redirecionamento para o app nativo ou fallback para as lojas de aplicativos / experiência web.
- Documentação de infraestrutura para implantação da instância autohospedada do Umami conectada ao Supabase e roteada sob o domínio `analytics.arestaclimb.com`.

## Capabilities

### New Capabilities
- `telemetria-web`: Coleta de métricas analíticas anônimas, telemetria cookieless sem banner de cookies e instrumentação de eventos de conversão e deep links no ecossistema web.

### Modified Capabilities
- `app-smart-redirect`: Inclusão de telemetria de redirecionamento e suporte a deep links roteáveis para o aplicativo móvel com fallback para as lojas.

## Impact

- **Frontend / Páginas Web:** Inclusão de tag de telemetria assíncrona nas páginas HTML e atributos de evento nos botões de ação.
- **Roteamento & Deep Links:** Tratamento de rotas de deep link em `src/appRedirect.js` e suporte a subdomínio `app.arestaclimb.com`.
- **Infraestrutura:** Instância self-hosted do Umami conectada ao PostgreSQL do Supabase e apontamento de DNS `analytics.arestaclimb.com` no Cloudflare.
- **Privacidade & Compliance:** Garantia de conformidade com a LGPD sem necessidade de pop-up ou banner de consentimento.
