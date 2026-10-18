# Tasks

## 1. Plugin de Geração Automatizada de Sitemap no Vite (TDD)

- [x] 1.1 Criar `src/vitePluginSitemap.test.js` com testes orientados a comportamento validando a extração de URLs canônicas de arquivos HTML, exclusão automática de páginas com `<meta name="robots" content="noindex...">`, geração do XML no padrão Sitemap 0.9, emissão do asset `sitemap.xml` no hook `generateBundle` do Vite e resposta a `GET /sitemap.xml` no servidor dev/preview, verificando que os testes falham inicialmente (*Red*) via `npx vitest run src/vitePluginSitemap.test.js`.
- [x] 1.2 Implementar `src/vitePluginSitemap.js` exportando as funções públicas e o plugin `pluginSitemap` e registrá-lo em `vite.config.js`, verificando que todos os testes em `src/vitePluginSitemap.test.js` passam com 100% de cobertura (*Green*).

## 2. Tags Canônicas, Diretivas Noindex, Links Internos e Nofollow nas Páginas HTML (TDD)

- [x] 2.1 Atualizar `src/domStructure.test.js` adicionando testes comportamentais para: (a) presença de `<link rel="canonical" href="https://arestaclimb.com/...">` nas 11 páginas públicas indexáveis e tags Open Graph em `editor/beta/index.html`; (b) presença de `<meta name="robots" content="noindex, nofollow">` em `404.html`, `download.html`, `comunidade.html` e `editor/beta/certificado-instalado/index.html`; (c) atributo `rel="nofollow"` nos links de instaladores em `serving.arestaclimb.com`; e (d) links para `/editor/beta`, `/privacidade-contribuidores` e `/contato` no rodapé de `index.html`, confirmando a falha inicial (*Red*) via `npx vitest run src/domStructure.test.js`.
- [x] 2.2 Atualizar as 11 páginas HTML indexáveis (`index.html`, `app.html`, `editor.html`, `editor/beta/index.html`, `contato.html`, `termos-de-uso.html`, `politica-de-privacidade.html`, `politica-de-privacidade-editor.html`, `privacidade-contribuidores.html`, `termos-de-uso-fixlog.html`, `politica-de-privacidade-fixlog.html`) com suas respectivas tags `<link rel="canonical">`, metadados Open Graph em `editor/beta/index.html`, `rel="nofollow"` nos links de binários de `serving.arestaclimb.com` e links internos no rodapé de `index.html`.
- [x] 2.3 Adicionar `<meta name="robots" content="noindex, nofollow">` em `404.html`, `download.html`, `comunidade.html` e `editor/beta/certificado-instalado/index.html` (além de `rel="nofollow"` no link de `.appinstaller`), verificando que `npx vitest run src/domStructure.test.js` passa integralmente (*Green*).

## 3. Configuração de Robots.txt, Subdomínios e Documentação (TDD)

- [x] 3.1 Adicionar testes em `src/domStructure.test.js` validando que `public/robots.txt` declara `Sitemap: https://arestaclimb.com/sitemap.xml` e que `public/serving-robots.txt` permite imagens (`Allow: /`) enquanto bloqueia `/*.binarypb$`, `/*.binarypb?*`, `/*.yaml$`, `/*.yaml?*`, `/*.yml$`, `/*.yml?*` e os diretórios `/editor-macos/`, `/editor-beta/` e `/flatpak/`, verificando a falha inicial (*Red*).
- [x] 3.2 Atualizar `public/robots.txt`, criar `public/serving-robots.txt` e documentar em `README.md` a arquitetura de SEO, geração automática do sitemap e instruções de configuração para os subdomínios (`serving.arestaclimb.com`, `previa.arestaclimb.com`, `feedback.arestaclimb.com` e `www.arestaclimb.com`), verificando que os testes passam (*Green*).

## 4. Verificação de Integração, Build e Cobertura Total

- [x] 4.1 Executar `npm run coverage` e `npm run build`, verificando que 100% de cobertura comportamental (linhas, funções, branches e statements) é mantida e que o arquivo `dist/sitemap.xml` é gerado no build contendo exatamente as 11 URLs públicas indexáveis.
