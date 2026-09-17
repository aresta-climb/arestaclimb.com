## 1. Módulo de Telemetria Client-Side (TDD)

- [ ] 1.1 Criar suíte de testes em `test/telemetry.test.js` cobrindo carregamento assíncrono, disparo de pageviews, eventos customizados e tolerância a falhas (Red)
- [ ] 1.2 Implementar `src/telemetry.js` com suporte a funções utilitárias (`trackEvent`, `trackPageView`) e validação via testes do Vitest (Green)
- [ ] 1.3 Implementar inicialização e captura automática de cliques em elementos com atributos declarativos `data-umami-event` e verificar cobertura de testes

## 2. Telemetria e Suporte a Deep Links em appRedirect

- [ ] 2.1 Criar casos de teste em `test/appRedirect.test.js` cobrindo a detecção de rotas de deep links e despacho de evento de telemetria antes de redirecionar (Red)
- [ ] 2.2 Atualizar `src/appRedirect.js` para processar caminhos de deep links (`/via/:id`, `/setor/:id`, `/croqui/:id`), emitir telemetria e acionar esquema de abertura do app nativo com fallback para loja (Green)
- [ ] 2.3 Executar bateria de testes com cobertura completa através do comando `npm run test:coverage`

## 3. Instrumentação das Páginas HTML

- [ ] 3.1 Inserir tag assíncrona de telemetria apontando para `analytics.arestaclimb.com` nas páginas HTML principais (`index.html`, `app.html`, `editor.html`, `comunidade.html`, `contato.html` e documentos legais)
- [ ] 3.2 Adicionar atributos `data-umami-event` nos botões de download do aplicativo móvel, download do Editor Desktop, acionamento do QR Code e convite do WhatsApp
- [ ] 3.3 Executar `npm run build` e inspecionar a geração dos arquivos em `dist/` para assegurar integridade do bundle

## 4. Documentação de Infraestrutura e Validação da Especificação

- [ ] 4.1 Elaborar o roteiro de implantação em `internal_docs/guia-implantacao-umami-supabase.md` documentando as variáveis de ambiente (`DATABASE_URL`, `APP_SECRET`), configuração no Supabase/Vercel e registros de DNS (`analytics` e `app`) no Cloudflare
- [ ] 4.2 Executar a validação da especificação através do comando `openspec validate adicionar-telemetria-umami --strict`
