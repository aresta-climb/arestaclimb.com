# Proposal

## Why

O Google Search Console reportou avisos de indexação no domínio `arestaclimb.com` (tentativas de rastreamento de subdomínios de API e storage como `previa.arestaclimb.com` e `serving.arestaclimb.com`, páginas duplicadas em `www.arestaclimb.com` sem tag canônica nas rotas internas) e não está rastreando a totalidade das páginas públicas do portal. Isso ocorre porque o projeto não possui um `sitemap.xml` automatizado, carece de tags `<link rel="canonical">` nas páginas secundárias, não isola páginas utilitárias/redirecionamentos com `noindex`, expõe links de download de instaladores sem `rel="nofollow"` e possui páginas públicas órfãs ou semi-órfãs de links internos na página inicial (`/privacidade-contribuidores`, `/contato` e `/editor/beta`).

## What Changes

- **Geração Automatizada de `sitemap.xml` no Build e Dev (`src/vitePluginSitemap.js`)**:
  - Criação de um plugin modular do Vite que inspeciona automaticamente as páginas HTML configuradas na arquitetura MPA (`vite.config.js`), extrai suas URLs canônicas, ignora páginas marcadas com `noindex` e emite o `sitemap.xml` automaticamente durante o build (`dist/sitemap.xml`) e no servidor de desenvolvimento/preview (`/sitemap.xml`).
  - Inclusão garantida de todas as 11 rotas públicas indexáveis: `/`, `/app`, `/editor`, `/editor/beta`, `/contato`, `/termos-de-uso`, `/politica-de-privacidade`, `/politica-de-privacidade-editor`, `/privacidade-contribuidores`, `/termos-de-uso-fixlog` e `/politica-de-privacidade-fixlog`.
- **Padronização de Tags Canônicas (`<link rel="canonical">`) e Metadados em Páginas Indexáveis**:
  - Adição de `<link rel="canonical" href="https://arestaclimb.com/...">` explícita em todas as páginas públicas indexáveis (incluindo `/editor/beta`, que também receberá as meta tags Open Graph padronizadas).
- **Desindexação Explícita de Páginas Utilitárias e de Redirecionamento (`noindex, nofollow`)**:
  - Adição de `<meta name="robots" content="noindex, nofollow">` nas páginas que não devem figurar nos resultados de busca nem no sitemap: `404.html`, `download.html` (redireciona para `/app`), `comunidade.html` (redireciona para o WhatsApp) e `editor/beta/certificado-instalado/index.html` (callback técnico do instalador `.bat`).
- **Descoberta Interna no Rodapé da Landing Page (`index.html`)**:
  - Inclusão de links diretos no rodapé de `index.html` para `/editor/beta` (coluna Produto), `/privacidade-contribuidores` (coluna Documentação) e `/contato` (coluna Projeto), eliminando páginas órfãs.
- **Proteção de Links de Instaladores e Regras de Rastreamento para Subdomínios (`robots.txt` e `serving.arestaclimb.com`)**:
  - Atualização de `public/robots.txt` do domínio principal com a diretiva `Sitemap: https://arestaclimb.com/sitemap.xml`.
  - Adição de `rel="nofollow"` nos links de download de binários/instaladores hospedados em `serving.arestaclimb.com` (`editor.html`, `editor/beta/index.html` e `editor/beta/certificado-instalado/index.html`).
  - Fornecimento e validação automatizada do arquivo de configuração de `robots.txt` e cabeçalhos para `serving.arestaclimb.com` (permitindo indexação de imagens, mas bloqueando arquivos `.binarypb`, `.yaml`/`.yml` e diretórios de instaladores `/editor-macos/`, `/editor-beta/` e `/flatpak/`) e diretrizes de bloqueio integral para os subdomínios de API (`previa.arestaclimb.com` e `feedback.arestaclimb.com`).

## Capabilities

### New Capabilities
- `seo-indexacao-sitemap`: Governança de indexação, geração automatizada de `sitemap.xml` via plugin do Vite, tags canônicas (`<link rel="canonical">`), diretivas `noindex` para rotas técnicas, `rel="nofollow"` para artefatos binários e regras de exclusão de robôs (`robots.txt`) para o portal e subdomínios.

### Modified Capabilities
- `landing-page`: Atualização dos requisitos de links institucionais no rodapé de `index.html` para garantir links diretos às páginas `/contato`, `/privacidade-contribuidores` e `/editor/beta`.

## Impact

- **Arquivos criados**:
  - `src/vitePluginSitemap.js` e `src/vitePluginSitemap.test.js` (espelhamento 1:1 com 100% de cobertura comportamental).
  - `public/serving-robots.txt` (ou artefato de referência documentado para deploy na raiz do bucket `serving.arestaclimb.com`).
- **Arquivos modificados**:
  - `vite.config.js`: Registro do `pluginSitemap`.
  - `public/robots.txt`: Inclusão de `Sitemap: https://arestaclimb.com/sitemap.xml`.
  - `index.html`, `app.html`, `editor.html`, `editor/beta/index.html`, `contato.html`, `termos-de-uso.html`, `politica-de-privacidade.html`, `politica-de-privacidade-editor.html`, `privacidade-contribuidores.html`, `termos-de-uso-fixlog.html`, `politica-de-privacidade-fixlog.html`: Tags `<link rel="canonical">`, links internos no rodapé e `rel="nofollow"` nos binários.
  - `404.html`, `download.html`, `comunidade.html`, `editor/beta/certificado-instalado/index.html`: Tag `<meta name="robots" content="noindex, nofollow">`.
  - `src/domStructure.test.js` e `README.md`: Testes de estrutura SEO/canônica e documentação das regras de subdomínios/Cloudflare.
- **Dependências**: Zero novas dependências externas (100% Node/Vite nativo).
