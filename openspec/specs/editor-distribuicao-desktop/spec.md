# editor-distribuicao-desktop Specification

## Purpose
Define a experiência de download e distribuição multiplataforma do Editor Aresta para desktop, incluindo a detecção automática de sistema operacional (Windows, macOS e Linux), suporte unificado via abas acessíveis e integração com instaladores nativos no Cloudflare R2 e Microsoft Store.

## Requirements

### Requirement: Detecção Automática de Plataforma Desktop
O sistema DEVE (SHALL) detectar na inicialização da página `/editor` o sistema operacional do visitante (Windows, macOS desktop ou Linux desktop), pré-selecionando a aba correspondente sem bloquear a alternância manual.

#### Scenario: Detecção de sistema operacional macOS Desktop
- **WHEN** o visitante carrega a página do editor sob um User Agent que identifica Macintosh ou Mac OS X sem conter indicativos mobile (iPhone, iPad, iPod)
- **THEN** a função de detecção classifica a plataforma como `macos`
- **AND** a aba macOS é ativada por padrão com o indicador visual de recomendação

#### Scenario: Detecção de sistema operacional Linux Desktop
- **WHEN** o visitante carrega a página do editor sob um User Agent que identifica Linux desktop (ex: Ubuntu, Fedora, X11) sem conter indicativos mobile (Android)
- **THEN** a função de detecção classifica a plataforma como `linux`
- **AND** a aba Linux (Flatpak) é ativada por padrão com o indicador visual de recomendação

#### Scenario: Detecção de sistema operacional Windows ou indefinido
- **WHEN** o visitante carrega a página do editor sob um User Agent com identificador Windows ou não identificado
- **THEN** a função de detecção classifica a plataforma como `windows`
- **AND** a aba Windows é mantida ativa por padrão com o indicador visual de recomendação

### Requirement: Navegação Acessível por Abas de Plataforma
A página `/editor` DEVE (SHALL) fornecer um controle de abas acessível (WAI-ARIA) permitindo alternar de forma instantânea entre as opções de instalação do Windows, macOS e Linux.

#### Scenario: Alternância entre abas via clique
- **WHEN** o usuário clica em qualquer uma das três abas (Windows, macOS ou Linux)
- **THEN** o painel de conteúdo associado torna-se visível e os outros dois painéis são ocultados
- **AND** os atributos `aria-selected` das abas e `hidden` dos painéis são sincronizados em conformidade

#### Scenario: Navegação por teclado nas abas
- **WHEN** o usuário navega com o teclado utilizando as setas direcionais sobre a lista de abas
- **THEN** o foco transiciona de forma cíclica e acessível entre as abas e a seleção é acionada

### Requirement: Distribuição e Auto-Atualização no macOS via Imagem DMG e Sparkle
O painel do macOS DEVE (SHALL) disponibilizar botão de download direto para a imagem de disco `.dmg` oficial notarizada e informações sobre a atualização contínua in-app via Sparkle Framework.

#### Scenario: Download da imagem de disco do macOS
- **WHEN** o usuário clica no botão "Baixar para Mac (.dmg)"
- **THEN** o navegador inicia o download apontando para `https://serving.arestaclimb.com/editor-macos/EditorAresta-latest.dmg`
- **AND** o painel informa que o aplicativo é compilado nativamente para Apple Silicon (M1/M2/M3/M4+), assinado, notarizado pela Apple e com auto-atualizações automáticas via Sparkle

### Requirement: Distribuição e Instalação Gráfica via Flatpakref
O painel do Linux DEVE (SHALL) fornecer botão de ação primária para instalação gráfica com 1 clique através do arquivo descritor `com.arestaclimb.Editor.flatpakref`.

#### Scenario: Download do arquivo flatpakref
- **WHEN** o usuário clica no botão "Instalar via Flatpak"
- **THEN** o navegador inicia o download ou aciona o tratador nativo do arquivo apontando para `https://serving.arestaclimb.com/flatpak/com.arestaclimb.Editor.flatpakref`

### Requirement: Comando Copiável de Instalação via Terminal
O painel do Linux DEVE (SHALL) disponibilizar um bloco de código com o comando de linha de comando para instalação direta via Flatpak, contendo botão para copiar o texto com feedback visual imediato.

#### Scenario: Cópia do comando de instalação para a área de transferência
- **WHEN** o usuário clica no botão "Copiar" do bloco de comando do Flatpak
- **THEN** o texto `flatpak install https://serving.arestaclimb.com/flatpak/com.arestaclimb.Editor.flatpakref` é enviado para a área de transferência do sistema
- **AND** o botão de cópia exibe confirmação visual temporária ("Copiado!") por pelo menos 2 segundos

### Requirement: Telemetria de Download por Plataforma
A página do Editor DEVE (SHALL) registrar eventos de telemetria cookieless via Umami diferenciando os downloads realizados para Windows, macOS e Linux.

#### Scenario: Registro de evento de download conforme plataforma
- **WHEN** o usuário aciona o download nas abas de Windows, macOS ou Linux
- **THEN** o evento é despachado com a propriedade `plataforma` preenchida respectivamente com `windows`, `macos` ou `linux`
