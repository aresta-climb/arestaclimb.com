# Tasks

## 1. Limpeza de Scripts Externos nos HTMLs e Dependências

- [x] 1.1 Reverter a inclusão da tag `<script src="https://js.sentry-cdn.com/...">` e remover os caracteres BOM UTF-8 (`\uFEFF`) nas 15 páginas HTML, adicionando asserção em `src/domStructure.test.js` que garante ausência de scripts de CDN externa do Sentry e verificando com `npx vitest run src/domStructure.test.js`
- [x] 1.2 Remover `@sentry/browser` de `dependencies` no `package.json` (mantendo `@sentry/vite-plugin` em `devDependencies`) e atualizar `vite.config.js` para manter a injeção de Debug IDs ativa, verificando que `npm test` executa sem erros

## 2. Resolução de Source Maps via Debug IDs no Cliente Sentry Envelope (TDD)

- [x] 2.1 Escrever testes orientados a comportamento em `src/telemetria.test.js` (Red) para `extrairImagensDebugMeta` e `enviarExcecaoSentryWeb` validando a inclusão de `debug_meta.images` (`type: "sourcemap"`, `code_file`, `debug_id`) a partir de `_sentryDebugIds` e `_debugIds` (em pilhas V8 e Firefox/Safari), deduplicação de arquivos e remoção da delegação para `window.Sentry`, verificando a falha inicial dos novos testes
- [x] 2.2 Implementar `extrairImagensDebugMeta` e a inclusão de `debug_meta.images` no envelope de `enviarExcecaoSentryWeb` em `src/telemetria.js` (Green), removendo o bloco `window.Sentry.captureException` e mocks ad-hoc (`vi.spyOn`) em favor de funções/Fakes determinísticos, verificando aprovação e 100% de cobertura em `src/telemetria.js` via `npx vitest run src/telemetria.test.js --coverage`

## 3. Cobertura de Monitoramento em Todas as Páginas MPA

- [x] 3.1 Escrever testes comportamentais em `src/telemetria.test.js`, `src/telemetry.test.js` e `src/certificadoInstalado.test.js` (Red) verificando a proteção contra registro duplicado de ouvintes no mesmo alvo global e a ativação do monitoramento de erros na inicialização das páginas
- [x] 3.2 Atualizar `src/telemetria.js`, `src/telemetry.js` e `src/certificadoInstalado.js` (Green) para garantir que todas as páginas da MPA inicializem o monitoramento de exceções na mesma origem sem duplicar ouvintes, verificando com `npx vitest run`

## 4. Verificação de Integração, Cobertura Total e Build com Source Maps

- [x] 4.1 Executar `npm run coverage`, `npm run build` e `npx openspec validate sentry-mesma-origem-sourcemaps --strict`, verificando 100% de cobertura de testes, geração de `_sentryDebugIds` nos bundles em `dist/assets/` e validação estrita da especificação
