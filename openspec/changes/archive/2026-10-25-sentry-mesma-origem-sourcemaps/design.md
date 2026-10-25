# Design

## Context

O portal `arestaclimb.com` é uma aplicação de múltiplas páginas (MPA) construída com Vite e Vanilla JS, onde o JavaScript total de cada página pesa cerca de 3 KB gzipado. Já possuímos o módulo [`src/telemetria.js`](file:///c:/Renato/Devel/aresta-climb/arestaclimb.com/src/telemetria.js) (~1 KB), que implementa o envio direto de exceções via protocolo HTTP Sentry Envelope (`application/x-sentry-envelope`).

Para habilitar a desminificação por Source Maps no Sentry, havia sido rascunhada a adição do pacote `@sentry/browser` e de tags `<script src="https://js.sentry-cdn.com/...">` no `<head>` das 15 páginas HTML (veja `proposal.md - Why`). A inspeção do funcionamento interno do `@sentry/vite-plugin` e do `@sentry/core` revelou que toda a vinculação entre arquivos minificados e Source Maps ocorre por meio de um mapa global injetado no build (`_sentryDebugIds` / `_debugIds`) e do campo `debug_meta.images` enviado no JSON do evento.

## Goals / Non-Goals

**Goals:**
- Garantir que 100% do código de monitoramento de erros seja servido na mesma origem (`arestaclimb.com/assets/...`) empacotado pelo Vite, sem conexões cross-origin no carregamento da página e com sobrecarga mínima (~1 KB).
- Suportar resolução determinística de Source Maps no Sentry via Debug IDs (`debug_meta.images`) diretamente em `src/telemetria.js`, sem depender de `@sentry/browser`.
- Assegurar cobertura de monitoramento em todas as páginas da MPA e 100% de cobertura de testes orientados a comportamento conforme o `AGENTS.md`.

**Non-Goals:**
- Implementar recursos pesados do SDK completo do Sentry, como gravação de sessão (Session Replay), rastreamento distribuído de performance (Tracing/Spans) ou interceptação (monkey-patching) de `fetch`/`console`/`history`.

## Decisions

### 1. Cliente Sentry Envelope Nativo na Mesma Origem (Zero-SDK)
- **Decisão:** Manter exclusivamente a implementação própria do protocolo Sentry Envelope em `src/telemetria.js`, removendo a tag `<script src="https://js.sentry-cdn.com/...">` das 15 páginas HTML, a delegação para `window.Sentry.captureException` e a dependência `@sentry/browser` do `package.json`.
- **Racional:** O bundle JS completo do site tem ~3 KB gzipado. Empacotar `@sentry/browser` na mesma origem adicionaria ~22–25 KB gzipado (~8x o tamanho do site), enquanto carregar da CDN externa bloqueia o parser HTML no `<head>` e é bloqueado por listas anti-rastreamento (EasyPrivacy/uBlock/Brave). O cliente nativo em `src/telemetria.js` roda na mesma conexão HTTP/3 do Cloudflare Pages e pesa ~1 KB.
- **Alternativas consideradas:**
  - *Loader script da CDN (`js.sentry-cdn.com`)*: Rejeitado por causar bloqueio de renderização cross-origin e sofrer bloqueio por adblockers.
  - *Bundle local de `@sentry/browser` via Vite*: Rejeitado por inflar desnecessariamente o bundle de uma MPA leve quando precisamos apenas do envio de exceções com `debug_meta`.

### 2. Algoritmo Determinístico de Resolução de Debug IDs (`extrairImagensDebugMeta`)
- **Decisão:** Implementar em `src/telemetria.js` a função `extrairImagensDebugMeta(quadrosExcecao, objetoGlobal)` que lê `objetoGlobal._sentryDebugIds` e `objetoGlobal._debugIds`, converte cada chave (que é uma string `new Error().stack` gerada no momento em que o chunk JS foi carregado) usando a própria função `extrairQuadrosPilhaNavegador(chaveStack)` e associa o `filename` extraído ao seu `debug_id`.
- **Racional:** Durante o `vite build`, o `@sentry/vite-plugin` injeta no topo de cada chunk minificado:
  ```js
  var n = (new e.Error).stack;
  n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "<uuid>");
  ```
  Como tanto a chave `n` quanto a pilha da exceção real (`erro.stack`) são produzidas pelo mesmo motor JS do navegador e analisadas pela **mesma função** `extrairQuadrosPilhaNavegador`, o campo `filename` resultante da chave será sempre idêntico, caractere por caractere, ao `frame.filename` da exceção (seja em V8/Blink, SpiderMonkey ou WebKit).
  Para cada `filename` único presente nos quadros da exceção que possua correspondência no mapa de Debug IDs, anexamos ao evento:
  ```json
  "debug_meta": {
    "images": [
      {
        "type": "sourcemap",
        "code_file": "<frame.filename>",
        "debug_id": "<uuid>"
      }
    ]
  }
  ```
  Quando o servidor do Sentry recebe `stacktrace.frames` e `debug_meta.images` com `code_file === frame.filename`, o Symbolicator localiza imediatamente o `.js.map` correspondente pelo `debug_id`.

### 3. Inicialização Centralizada em Todas as Páginas MPA
- **Decisão:** Acionar `inicializarMonitoramentoErrosSentry` na inicialização padrão de telemetria (`src/telemetry.js`, que já é importado por `landing.js`, `editor.js`, `main.js`, `notFound.js`, `appRedirect.js` e `comunidade.html`) com proteção contra registro duplicado de ouvintes na mesma janela (`WeakSet`), além de incluir na página `certificadoInstalado.js`.
- **Racional:** Evita esquecer páginas da MPA e garante que todas as 15 páginas tenham monitoramento ativo na mesma origem sem duplicar chamadas de rede caso mais de um módulo inicialize o monitoramento na mesma janela.

### 4. Configuração do `@sentry/vite-plugin` em `vite.config.js`
- **Decisão:** Manter `build.sourcemap: true` e o `sentryVitePlugin` em `vite.config.js` sem usar `disable: !process.env.SENTRY_AUTH_TOKEN`, permitindo que o plugin sempre injete os `_sentryDebugIds` nos chunks e carimbe os `.js.map` em qualquer build (o próprio plugin já ignora silenciosamente apenas a etapa de upload de rede quando `authToken` não está definido fora do CI).
- **Racional:** Permite validar em builds locais e em testes automatizados que a injeção de `_sentryDebugIds` e o carimbo de `debugId` nos Source Maps estão funcionando de forma idêntica ao ambiente de CI.

## Risks / Trade-offs

- **[Risco] Registro duplicado de listeners `error` / `unhandledrejection` se `inicializarMonitoramentoErrosSentry` for chamado mais de uma vez na mesma página** → **Mitigação:** Utilizar um `WeakSet` para controlar os alvos globais (`window`) já monitorados ou substituir o listener anterior, mantendo a função de remoção (`cleanup`) funcional para testes.
- **[Risco] Codificação com BOM UTF-8 nos arquivos HTML** → **Mitigação:** Restaurar os 15 arquivos HTML para UTF-8 sem BOM e validar a estrutura DOM com a suíte existente (`src/domStructure.test.js`).
