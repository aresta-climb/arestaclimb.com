# App Smart Redirect Specification

## Purpose

Detectar o sistema operacional do usuário no navegador e redirecionar automaticamente dispositivos móveis para as lojas de aplicativos ou exibir o hub desktop de download, registrando telemetria analítica e suportando deep links para o app.

## Requirements

### Requirement: Detecção de Sistema Operacional e Redirecionamento Client-Side
As rotas `/app`, `/download` e o domínio `app.arestaclimb.com` DEVEM (MUST) detectar o sistema operacional do usuário no navegador, registrar o evento de redirecionamento na telemetria analítica e redirecionar automaticamente dispositivos móveis para o aplicativo nativo ou para as respectivas lojas de aplicativos.

#### Scenario: Acesso via dispositivo iOS (iPhone / iPad)
- **QUANDO** um usuário em dispositivo iOS acessa a rota `/app`, `/download` ou `app.arestaclimb.com`
- **ENTÃO** a aplicação emite o evento de telemetria correspondente
- **E** redireciona automaticamente para a URL configurada da Apple App Store ou deep link do app

#### Scenario: Acesso via dispositivo Android
- **QUANDO** um usuário em dispositivo Android acessa a rota `/app`, `/download` ou `app.arestaclimb.com`
- **ENTÃO** a aplicação emite o evento de telemetria correspondente
- **E** redireciona automaticamente para a URL configurada da Google Play Store ou deep link do app

### Requirement: Hub de Download para Desktop e Fallback
A página `/app` DEVE (MUST) renderizar uma interface completa de download para navegadores desktop ou quando o redirecionamento automático não for acionado.

#### Scenario: Acesso via navegador Desktop
- **QUANDO** um usuário em computador de mesa ou notebook acessa `/app` ou `/download`
- **ENTÃO** a página exibe um QR Code escaneável em alta resolução e botões para ambas as lojas (App Store e Google Play)

### Requirement: Redirecionamento e Roteamento de Download
O sistema DEVE (MUST) garantir que a URL `/download` direcione para a experiência unificada de `/app`.

#### Scenario: Acesso direto à rota /download
- **QUANDO** o usuário visita `/download`
- **ENTÃO** a aplicação carrega de forma transparente a lógica e interface de `/app`

### Requirement: Resolução e Fallback de Deep Links
A rota e subdomínio `app.arestaclimb.com` DEVE (MUST) interceptar caminhos de rotas do aplicativo (ex: vias, setores ou croquis) e tentar abrir o aplicativo nativo correspondente, disponibilizando fallback para a loja ou hub de download.

#### Scenario: Redirecionamento de deep link em dispositivo móvel
- **QUANDO** o usuário clica em um link de deep link como `app.arestaclimb.com/via/:id`
- **ENTÃO** o sistema tenta acionar o aplicativo móvel nativo via esquema de URL ou universal link e mantém fallback transparente para a loja caso o app não esteja instalado
