# Proposal

## Why

O carregamento do SDK oficial do Sentry a partir de CDN externa (`js.sentry-cdn.com`) no `<head>` das páginas HTML ou via pacote pesado `@sentry/browser` (~25–80 KB gzipado) introduz bloqueio de renderização cross-origin, sofre bloqueio por adblockers/proteções de rastreamento e viola o Princípio VIII do `AGENTS.md` (Eficiência Client-Side First e Arquitetura Web Leve). Precisamos manter o monitoramento de exceções 100% na mesma origem (`arestaclimb.com`) usando nosso cliente nativo de protocolo Sentry Envelope (`src/telemetria.js`, ~1 KB e zero dependências no runtime), adicionando suporte completo a Source Maps via Debug IDs (`debug_meta.images`) para desminificação confiável de erros no Sentry.

## What Changes

- **Remoção do script externo da CDN e limpeza dos HTMLs:** Reverter a inclusão da tag `<script src="https://js.sentry-cdn.com/...">` e remover os caracteres BOM UTF-8 acidentais (`\uFEFF`) nas 15 páginas HTML da arquitetura MPA.
- **Remoção da dependência `@sentry/browser`:** Remover `@sentry/browser` das dependências de produção no `package.json`, preservando zero dependências externas de runtime para telemetria de erros.
- **Suporte nativo a Source Maps via Debug IDs em `src/telemetria.js`:**
  - Implementar a extração e mapeamento dos identificadores de depuração injetados no build pelo `@sentry/vite-plugin` (`window._sentryDebugIds` e `window._debugIds`) usando o próprio parser de stack trace (`extrairQuadrosPilhaNavegador`), garantindo casamento determinístico entre os quadros da pilha (`frame.filename`) e os arquivos minificados (`code_file`).
  - Anexar automaticamente a estrutura `debug_meta.images` (`type: "sourcemap"`, `code_file`, `debug_id`) no payload de eventos do protocolo Sentry Envelope.
  - Remover o acoplamento/delegação para `window.Sentry.captureException` em `src/telemetria.js`.
- **Cobertura integral na mesma origem em todas as páginas MPA:** Garantir que a inicialização do monitoramento de erros (`inicializarMonitoramentoErrosSentry`) ocorra de forma centralizada na mesma origem para todas as páginas da aplicação (via pontos de entrada JS existentes).
- **Configuração de Build e Source Maps (`vite.config.js`):** Manter o `@sentry/vite-plugin` em `devDependencies` para injeção determinística de Debug IDs nos bundles e upload automático de Source Maps no ambiente de CI quando `SENTRY_AUTH_TOKEN` estiver presente.

## Capabilities

### New Capabilities
<!-- Nenhuma nova capability isolada; estende a capability existente de telemetria web. -->

### Modified Capabilities
- `telemetria-web`: Adição dos requisitos de monitoramento client-side de exceções não tratadas servido na mesma origem via protocolo Sentry Envelope leve (sem SDK externo ou CDN de terceiros) e resolução determinística de Source Maps via Debug IDs (`debug_meta.images`).

## Impact

- **Páginas HTML (15 entradas MPA):** Remoção de scripts bloqueantes de CDN externa e normalização de codificação UTF-8 sem BOM.
- **Código-Fonte e Testes (`src/telemetria.js`, `src/telemetria.test.js`, `src/telemetry.js` / entrypoints):** Evolução da montagem do envelope Sentry com `debug_meta.images`, cobertura de testes comportamentais de 100% com Fakes determinísticos (Princípios III, IV e V do `AGENTS.md`).
- **Build e Dependências (`package.json`, `vite.config.js`):** Remoção de `@sentry/browser` do bundle cliente; configuração enxuta do `@sentry/vite-plugin`.
