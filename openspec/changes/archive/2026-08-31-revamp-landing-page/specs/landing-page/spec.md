## ADDED Requirements

### Requirement: Alternância de Tema Claro e Escuro
O sistema DEVE permitir a alternância de tema visual entre modo claro (light) e modo escuro (dark), respeitando a preferência do sistema operacional e persistindo a escolha do usuário no `localStorage`.

#### Scenario: Usuário clica no botão de tema
- **QUANDO** o usuário clica no botão de alternância de tema no cabeçalho
- **ENTÃO** o atributo `data-theme` da raiz HTML é atualizado entre 'light' e 'dark' e o valor é salvo no `localStorage`

#### Scenario: Carregamento inicial de página
- **QUANDO** a página é carregada pela primeira vez
- **ENTÃO** o tema é inicializado de acordo com o `localStorage` ou com a preferência de cor do sistema (`prefers-color-scheme`)

### Requirement: Seção Hero com Badges das Lojas e Popover de QR Code
A landing page DEVE apresentar uma seção Hero de alto impacto visual com links diretos para a Google Play e Apple App Store, além de um gatilho para visualização de QR Code no desktop.

#### Scenario: Clique nos badges das lojas
- **QUANDO** o usuário clica no botão da Google Play ou Apple App Store
- **ENTÃO** a respectiva URL da loja é aberta em uma nova aba

#### Scenario: Visualização do QR Code no desktop
- **QUANDO** o usuário no desktop clica no botão "Escanear QR Code"
- **ENTÃO** um popover ou modal acessível exibe o QR Code em alta definição apontando para o link universal do aplicativo

### Requirement: Showcase Interativo do Aplicativo
A landing page DEVE conter uma vitrine interativa demonstrando as principais funcionalidades e telas reais do aplicativo (Croqui Interativo na Foto, Explorar Setores, Ficha da Via & Beta, Salvo Offline).

#### Scenario: Seleção de funcionalidade no showcase
- **QUANDO** o usuário clica em um dos pilares do showcase
- **ENTÃO** o indicador visual ativo é atualizado e o mockup do smartphone transiciona suavemente para a tela correspondente do aplicativo

### Requirement: Seção Imersiva de Modo Offline
A landing page DEVE conter um bloco de alto contraste escuro apresentando o fluxo de 4 passos para uso offline em campo (*Baixe na cidade ➔ Vá para a rocha ➔ Consulte no setor ➔ Atualize na volta*).

#### Scenario: Visualização do fluxo offline
- **QUANDO** o usuário visualiza a seção de modo offline
- **ENTÃO** os 4 passos do fluxo de campo são apresentados com tipografia técnica e indicadores visuais claros

### Requirement: Métricas Reais de Cobertura da Base
A landing page DEVE exibir os números consolidados da base de dados (quantidade de croquis publicados, vias, setores e estado de cobertura).

#### Scenario: Visualização dos dados de prova real
- **QUANDO** o usuário rola até a seção de métricas
- **ENTÃO** os contadores de croquis, vias, setores e regiões são exibidos de forma destacada

### Requirement: Governança, Autoria e Preservação
A landing page DEVE apresentar princípios claros de respeito à autoria, preservação de fontes, histórico de conquistas e proteção de dados.

#### Scenario: Consulta aos princípios de governança
- **QUANDO** o usuário visualiza a seção de autoria e governança
- **ENTÃO** as diretrizes sobre consentimento, créditos aos conquistadores e canais de contato são exibidas

### Requirement: Apresentação e Download do Editor Aresta
A landing page DEVE apresentar a ferramenta desktop oficial Editor Aresta para criação e edição de croquis vetoriais, com link direto para a página `/editor`.

#### Scenario: Navegação para a página do Editor
- **QUANDO** o usuário clica no botão ou link "Conhecer o Editor"
- **ENTÃO** o navegador é direcionado para a rota `/editor`

### Requirement: FAQ Interativo e Acessível
A landing page DEVE disponibilizar uma seção de perguntas frequentes em formato de acordeão, com suporte a teclado e atributos de acessibilidade (WAI-ARIA).

#### Scenario: Expansão de pergunta frequente
- **QUANDO** o usuário clica ou ativa via teclado uma pergunta do FAQ
- **ENTÃO** a resposta correspondente é expandida e o atributo `aria-expanded` é atualizado

### Requirement: Canal Direto com a Comunidade no WhatsApp
A landing page DEVE conter um card de chamada para ação direcionando os escaladores para a comunidade oficial do Aresta no WhatsApp.

#### Scenario: Clique no link da comunidade
- **QUANDO** o usuário clica no botão "Entrar na Comunidade do WhatsApp"
- **ENTÃO** o link de convite oficial do WhatsApp é aberto em nova aba
