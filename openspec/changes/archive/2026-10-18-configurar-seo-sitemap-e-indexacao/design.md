# Design

## Context

Veja `proposal.md` para a motivação do problema no Google Search Console e `specs/seo-indexacao-sitemap/spec.md` e `specs/landing-page/spec.md` para os requisitos normativos. Atualmente, `arestaclimb.com` opera como uma aplicação MPA no Vite (`vite.config.js`) com 15 pontos de entrada HTML e um plugin customizado (`src/vitePlugin404.js`). Não há emissão de `sitemap.xml`, e apenas `index.html` possui `<link rel="canonical">`.

## Goals / Non-Goals

**Goals:**
- Automatizar 100% a geração do `sitemap.xml` no pipeline do Vite (`src/vitePluginSitemap.js`) sem listas estáticas manuais que possam ficar defasadas quando novas páginas forem adicionadas ao `vite.config.js`.
- Garantir 100% de cobertura de testes comportamentais (`src/vitePluginSitemap.test.js`) sem uso de mocks internos ou código defensivo inalcançável, em conformidade estrita com `AGENTS.md`.
- Padronizar a semântica de indexação (`<link rel="canonical">` vs `<meta name="robots" content="noindex, nofollow">`) em todos os 15 pontos de entrada HTML.
- Versionar no repositório as regras de `robots.txt` para `serving.arestaclimb.com` (`public/serving-robots.txt`) e documentar as regras de borda na Cloudflare para `previa.arestaclimb.com`, `feedback.arestaclimb.com`, `serving.arestaclimb.com` e `www.arestaclimb.com`.

**Non-Goals:**
- Não alterar a lógica de renderização de Markdown no cliente (`src/main.js`) nem introduzir frameworks de SSR.
- Não criar scripts externos de pós-build fora do ecossistema de plugins do Vite.

## Decisions

- **Decisão 1: Descoberta Automática de URLs Indexáveis via Inspeção do `<head>` HTML (`src/vitePluginSitemap.js`)**
  - *Contexto:* Manter um array hardcoded de URLs para gerar o `sitemap.xml` cria risco de esquecimento quando novas páginas legais ou de produto forem adicionadas ao `vite.config.js`.
  - *Escolha:* O módulo `src/vitePluginSitemap.js` lerá a lista de arquivos HTML registrados em `build.rollupOptions.input` (ou nos arquivos HTML do projeto) e inspecionará o conteúdo de cada HTML:
    1. Se o HTML contiver `<meta name="robots" content="noindex...">`, a página é automaticamente ignorada.
    2. Caso contrário, extrai o atributo `href` de `<link rel="canonical" href="...">` e adiciona ao XML do Sitemap 0.9 ordenado.
    3. No hook `generateBundle` do Vite/Rollup, emite o ativo `sitemap.xml` via `this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: xml })`. No hook `configureServer`, responde a `GET /sitemap.xml` com `Content-Type: application/xml; charset=utf-8`.
  - *Alternativas consideradas:*
    - Arquivo `public/sitemap.xml` manual: descartado por exigir manutenção manual a cada nova rota.
    - Pacotes terceiros (`vite-plugin-sitemap`): descartado para manter zero dependências externas e controle total sobre a filtragem por `noindex` e `<link rel="canonical">`.

- **Decisão 2: Critério Explícito entre Páginas Indexáveis (`canonical`) e Não-Indexáveis (`noindex, nofollow`)**
  - *Escolha:*
    - **11 Páginas Indexáveis** (recebem `<link rel="canonical" href="https://arestaclimb.com/...">`):
      - `index.html` ➔ `https://arestaclimb.com/`
      - `app.html` ➔ `https://arestaclimb.com/app`
      - `editor.html` ➔ `https://arestaclimb.com/editor`
      - `editor/beta/index.html` ➔ `https://arestaclimb.com/editor/beta` (também recebe meta tags Open Graph e Twitter Card completas para paridade com as demais páginas)
      - `contato.html` ➔ `https://arestaclimb.com/contato`
      - `termos-de-uso.html` ➔ `https://arestaclimb.com/termos-de-uso`
      - `politica-de-privacidade.html` ➔ `https://arestaclimb.com/politica-de-privacidade`
      - `politica-de-privacidade-editor.html` ➔ `https://arestaclimb.com/politica-de-privacidade-editor`
      - `privacidade-contribuidores.html` ➔ `https://arestaclimb.com/privacidade-contribuidores`
      - `termos-de-uso-fixlog.html` ➔ `https://arestaclimb.com/termos-de-uso-fixlog`
      - `politica-de-privacidade-fixlog.html` ➔ `https://arestaclimb.com/politica-de-privacidade-fixlog`
    - **4 Páginas Não-Indexáveis** (recebem `<meta name="robots" content="noindex, nofollow">` e sem tag canonical):
      - `404.html` (erro 404)
      - `download.html` (alias com redirect 301 para `/app`)
      - `comunidade.html` (redirect 302 / meta refresh para o WhatsApp)
      - `editor/beta/certificado-instalado/index.html` (callback técnico pós-instalação do script `.bat`)

- **Decisão 3: Isolamento de `serving.arestaclimb.com`, `previa.arestaclimb.com` e `feedback.arestaclimb.com`**
  - *Contexto:* No `serving.arestaclimb.com`, imagens podem ser indexadas quando vinculadas, mas arquivos de dados (`.binarypb`, `.yaml`, `.yml`) e instaladores não devem ser rastreados nem indexados. Já `previa` e `feedback` são exclusivamente APIs.
  - *Escolha:*
    1. Nos HTMLs de `arestaclimb.com`, adicionar `rel="nofollow"` em todos os links `<a href="https://serving.arestaclimb.com/...">` de instaladores.
    2. Criar e testar `public/serving-robots.txt` contendo as diretivas `Disallow: /*.binarypb$`, `Disallow: /*.binarypb?*`, `Disallow: /*.yaml$`, `Disallow: /*.yaml?*`, `Disallow: /*.yml$`, `Disallow: /*.yml?*`, `Disallow: /editor-macos/`, `Disallow: /editor-beta/`, `Disallow: /flatpak/` e `Allow: /`, pronto para publicação como `robots.txt` na raiz do bucket `serving.arestaclimb.com`.
    3. Documentar no `README.md` a configuração recomendada de Response Header Transform Rules e Redirect Rules na Cloudflare para `previa`, `feedback`, `serving` (`X-Robots-Tag: noindex`) e `www.arestaclimb.com` (Redirect 301 para `arestaclimb.com`).

## Risks / Trade-offs

- **[Risco] Discrepância entre `canonical` da Home (`https://arestaclimb.com` vs `https://arestaclimb.com/`)**
  → *Mitigação:* Padronizar `index.html` com `<link rel="canonical" href="https://arestaclimb.com/">` (idêntico ao `og:url` já existente na linha 17 de `index.html` e ao padrão de URL raiz do protocolo Sitemap).
- **[Risco] Subdomínios continuarem aparecendo no GSC até novo rastreamento**
  → *Mitigação:* Após o deploy do `robots.txt` no bucket `serving.arestaclimb.com` e das regras de cabeçalho na Cloudflare, acionar o botão "Validar a correção" no Google Search Console e submeter `https://arestaclimb.com/sitemap.xml` na aba Sitemaps.
