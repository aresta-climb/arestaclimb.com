## Purpose

Coletar métricas agregadas de audiência, canais de aquisição de tráfego, eventos de conversão de downloads e resoluções de deep links de forma estritamente anônima, sem cookies e em total conformidade com a LGPD.

## ADDED Requirements

### Requirement: Coleta Analítica Anônima e Cookieless
O ecossistema web DEVE (MUST) carregar o script de telemetria do Umami de forma assíncrona em todas as páginas públicas sem criar, armazenar ou ler cookies ou identificadores persistentes de terceiros no dispositivo do usuário.

#### Scenario: Carregamento assíncrono do script em páginas do site
- **QUANDO** um visitante acessa qualquer página do site (`/`, `/app`, `/editor`, etc.)
- **ENTÃO** o script de telemetria é carregado de forma assíncrona apontando para o endpoint próprio de coleta
- **E** nenhum cookie de rastreamento é criado no navegador

#### Scenario: Contabilização de visualização de página
- **QUANDO** uma página é completamente carregada no navegador
- **ENTÃO** uma requisição anônima de pageview é enviada ao servidor de analytics contendo a rota atual, o referrer e os parâmetros UTM presentes na URL

### Requirement: Rastreamento de Eventos de Conversão de Download
O sistema DEVE (MUST) registrar eventos analíticos customizados quando o usuário interagir com botões de download de aplicativos ou do editor.

#### Scenario: Clique em botão de download do aplicativo móvel
- **QUANDO** o usuário clica no link ou botão de download para iOS ou Android
- **ENTÃO** um evento analítico de download é disparado informando a plataforma de destino

#### Scenario: Clique em botão de download do Editor Desktop
- **QUANDO** o usuário clica em um link de download do instalador do Editor
- **ENTÃO** um evento analítico de download do editor é disparado identificando o sistema operacional selecionado (Windows, macOS ou Linux)

#### Scenario: Interação ou visualização do QR Code de download
- **QUANDO** o usuário visualiza ou aciona a exibição do QR Code na interface
- **ENTÃO** um evento analítico correspondente à interação com o QR Code é disparado

### Requirement: Telemetria de Resolução de Deep Links
As rotas de deep link destinadas ao aplicativo móvel no subdomínio `app.arestaclimb.com` DEVEM (MUST) emitir evento analítico registrando a rota do recurso acessado antes ou durante o redirecionamento para o app ou para a loja.

#### Scenario: Acesso a deep link de recurso da escalada
- **QUANDO** um usuário acessa uma URL de deep link (ex: `/via/:id`, `/setor/:id`, `/croqui/:id`)
- **ENTÃO** um evento analítico de tentativa de abertura de deep link é emitido contendo o tipo de recurso e identificador
- **E** o redirecionamento é disparado em seguida para o app móvel ou fallback da loja
