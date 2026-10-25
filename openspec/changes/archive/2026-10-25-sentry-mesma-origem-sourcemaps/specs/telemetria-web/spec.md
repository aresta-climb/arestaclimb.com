## ADDED Requirements

### Requirement: Monitoramento de Exceções Client-Side na Mesma Origem
O ecossistema web DEVE (MUST) monitorar e reportar exceções JavaScript não tratadas (`error`) e rejeições de Promises (`unhandledrejection`) em todas as páginas da aplicação utilizando código servido exclusivamente a partir da mesma origem (`arestaclimb.com`), sem carregar scripts bloqueantes ou SDKs de CDNs de terceiros no `<head>` das páginas HTML e descartando ruídos de falha de rede quando o navegador estiver offline.

#### Scenario: Captura e envio de exceção não tratada na mesma origem
- **QUANDO** ocorre um erro de execução JavaScript não tratado ou uma Promise rejeitada em uma página do site com o navegador online
- **ENTÃO** o sistema formata a exceção com sua pilha de chamadas (`stacktrace.frames`) e envia um envelope HTTP (`application/x-sentry-envelope`) diretamente para o endpoint de ingestão configurado
- **E** nenhuma tag `<script>` apontando para CDNs externas de monitoramento (como `js.sentry-cdn.com`) é carregada nas páginas HTML

#### Scenario: Descarte de erros de rede quando o dispositivo está offline
- **QUANDO** ocorre um erro de falha de requisição de rede (`Failed to fetch`, `NetworkError`, `Load failed`) enquanto o navegador está sem conectividade (`navigator.onLine === false`)
- **ENTÃO** a exceção é silenciosamente descartada sem disparar envio de envelope para o servidor de monitoramento

### Requirement: Vinculação Determinística de Source Maps via Debug IDs
O envelope de exceção enviado ao servidor de monitoramento DEVE (MUST) incluir os metadados de depuração (`debug_meta.images`) associando o caminho de cada arquivo JavaScript presente na pilha de chamadas ao seu respectivo identificador único de build (`debug_id`), permitindo a desminificação automática via Source Maps sem depender de SDK externo.

#### Scenario: Resolução de Debug ID para quadros da pilha de chamadas
- **QUANDO** uma exceção é capturada em um bundle que possui identificadores de depuração injetados no escopo global (`_sentryDebugIds` ou `_debugIds`)
- **ENTÃO** o sistema extrai o caminho de arquivo de cada entrada do registro global usando o mesmo analisador de pilha da exceção
- **E** inclui no payload do evento a lista `debug_meta.images` com entradas `{ type: "sourcemap", code_file, debug_id }` correspondentes aos arquivos presentes em `stacktrace.frames`

#### Scenario: Envio normal quando não há Debug IDs no ambiente
- **QUANDO** uma exceção é capturada em ambiente de desenvolvimento ou sem identificadores de depuração globais registrados
- **ENTÃO** o envelope do evento é enviado normalmente com os quadros de pilha disponíveis e sem o campo `debug_meta`

### Requirement: Empacotamento com Injeção de Debug IDs e Validação de Source Maps no CI
O processo de build de produção DEVE (MUST) gerar Source Maps, injetar identificadores de depuração nos bundles JavaScript gerados e exigir a presença do token de autenticação de upload quando executado em ambiente de Integração Contínua (CI).

#### Scenario: Execução de build em ambiente de CI sem token configurado
- **QUANDO** o build de produção é iniciado com a variável `CI` ativa e sem a variável `SENTRY_AUTH_TOKEN` definida (fora do ambiente de testes)
- **ENTÃO** o processo falha imediatamente com erro explícito impedindo a publicação de artefatos minificados sem Source Maps vinculados
