## ADDED Requirements

### Requirement: Detecção de Sistema Operacional e Redirecionamento Client-Side
As rotas `/app` e `/download` DEVEM detectar o sistema operacional do usuário no navegador e redirecionar automaticamente dispositivos móveis para as respectivas lojas de aplicativos.

#### Scenario: Acesso via dispositivo iOS (iPhone / iPad)
- **QUANDO** um usuário em dispositivo iOS acessa a rota `/app` ou `/download`
- **ENTÃO** a aplicação redireciona automaticamente para a URL configurada da Apple App Store

#### Scenario: Acesso via dispositivo Android
- **QUANDO** um usuário em dispositivo Android acessa a rota `/app` ou `/download`
- **ENTÃO** a aplicação redireciona automaticamente para a URL configurada da Google Play Store

### Requirement: Hub de Download para Desktop e Fallback
A página `/app` DEVE renderizar uma interface completa de download para navegadores desktop ou quando o redirecionamento automático não for acionado.

#### Scenario: Acesso via navegador Desktop
- **QUANDO** um usuário em computador de mesa ou notebook acessa `/app` ou `/download`
- **ENTÃO** a página exibe um QR Code escaneável em alta resolução e botões para ambas as lojas (App Store e Google Play)

### Requirement: Redirecionamento e Roteamento de Download
O sistema DEVE garantir que a URL `/download` direcione para a experiência unificada de `/app`.

#### Scenario: Acesso direto à rota /download
- **QUANDO** o usuário visita `/download`
- **ENTÃO** a aplicação carrega de forma transparente a lógica e interface de `/app`
