# seo-indexacao-sitemap Specification

## Purpose

Definir o contrato de indexação, rastreabilidade por motores de busca (SEO), geração automatizada de `sitemap.xml` a partir das páginas MPA indexáveis, padronização de tags canônicas (`<link rel="canonical">`), diretivas `noindex` para rotas técnicas/redirecionamentos e regras de exclusão (`robots.txt` e `rel="nofollow"`) para o domínio principal e subdomínios de infraestrutura (`serving`, `previa` e `feedback`).

## Requirements

### Requirement: Geração Automatizada de Sitemap XML
O sistema DEVE (SHALL) gerar automaticamente o arquivo `sitemap.xml` no protocolo Sitemap 0.9 a partir das entradas HTML configuradas no projeto MPA, incluindo todas as páginas públicas indexáveis e excluindo páginas que contenham diretiva `noindex`.

#### Scenario: Emissão do sitemap.xml com todas as páginas públicas indexáveis
- **WHEN** o processo de empacotamento de produção (`build`) ou requisição a `/sitemap.xml` em desenvolvimento/preview é executado
- **THEN** o sistema gera um documento XML válido contendo exatamente as URLs canônicas de `/`, `/app`, `/editor`, `/editor/beta`, `/contato`, `/termos-de-uso`, `/politica-de-privacidade`, `/politica-de-privacidade-editor`, `/privacidade-contribuidores`, `/termos-de-uso-fixalog` e `/politica-de-privacidade-fixalog`

#### Scenario: Exclusão automática de páginas marcadas com noindex do sitemap
- **WHEN** uma página HTML da configuração MPA possui a meta tag `<meta name="robots" content="noindex...">` (como `404.html`, `download.html`, `comunidade.html` e `editor/beta/certificado-instalado/index.html`)
- **THEN** a respectiva URL NÃO é incluída no `sitemap.xml` gerado

### Requirement: Padronização de Tags Canônicas e Open Graph em Páginas Indexáveis
Todas as páginas públicas indexáveis do portal DEVEM (MUST) declarar explicitamente uma tag `<link rel="canonical">` apontando para a URL absoluta sob `https://arestaclimb.com` (sem `www` e sem extensão `.html`), além de metadados Open Graph completos.

#### Scenario: Presença de tag canônica em todas as páginas indexáveis
- **WHEN** um rastreador de busca ou navegador inspeciona o `<head>` de qualquer uma das 11 páginas públicas indexáveis (incluindo `/editor/beta`, `/contato` e `/privacidade-contribuidores`)
- **THEN** existe um elemento `<link rel="canonical" href="https://arestaclimb.com/...">` correspondente à rota limpa da página
- **AND** a página `/editor/beta` também apresenta as tags Open Graph (`og:title`, `og:description`, `og:url`, `og:image`) padronizadas

### Requirement: Diretiva Noindex em Páginas Utilitárias, de Erro e de Redirecionamento
Páginas cuja finalidade exclusiva seja redirecionamento, tratamento de erro HTTP 404 ou retorno técnico de instalação DEVEM (MUST) declarar `<meta name="robots" content="noindex, nofollow">` no `<head>`.

#### Scenario: Bloqueio de indexação em páginas técnicas e de redirecionamento
- **WHEN** um motor de busca acessa `404.html`, `download.html`, `comunidade.html` ou `editor/beta/certificado-instalado/index.html`
- **THEN** o documento HTML contém `<meta name="robots" content="noindex, nofollow">` impedindo sua indexação nos resultados de pesquisa

### Requirement: Atributo Nofollow em Links de Instaladores Binários Externos
Links de download direto que apontam para artefatos binários ou scripts hospedados em `serving.arestaclimb.com` DEVEM (MUST) conter o atributo `rel="nofollow"` para evitar que crawlers rastreiem instaladores ou a raiz do subdomínio de storage.

#### Scenario: Links de instaladores do Editor Desktop e Beta com nofollow
- **WHEN** um motor de busca analisa os links de download para `serving.arestaclimb.com` (arquivos `.dmg`, `.flatpakref`, `.bat` e `.appinstaller`) em `editor.html`, `editor/beta/index.html` e `editor/beta/certificado-instalado/index.html`
- **THEN** todos esses elementos `<a>` possuem `rel="nofollow"`

### Requirement: Configuração de Robots.txt Principal e Regras para Subdomínios
O arquivo `public/robots.txt` do domínio principal DEVE (SHALL) permitir o rastreamento e referenciar a URL absoluta do `sitemap.xml`, enquanto o artefato `public/serving-robots.txt` DEVE (SHALL) definir as regras do subdomínio `serving.arestaclimb.com` permitindo imagens e bloqueando arquivos `.binarypb`, `.yaml`/`.yml` e pastas de instaladores.

#### Scenario: Referência ao sitemap no robots.txt de arestaclimb.com
- **WHEN** um crawler solicita `/robots.txt` no domínio principal `arestaclimb.com`
- **THEN** o conteúdo inclui `User-agent: *`, `Allow: /` e `Sitemap: https://arestaclimb.com/sitemap.xml`

#### Scenario: Regras seletivas de rastreamento para serving.arestaclimb.com
- **WHEN** o arquivo de regras `public/serving-robots.txt` é validado para uso na raiz de `serving.arestaclimb.com`
- **THEN** ele bloqueia explicitamente extensões de dados brutos (`/*.binarypb$`, `/*.binarypb?*`, `/*.yaml$`, `/*.yaml?*`, `/*.yml$`, `/*.yml?*`) e diretórios de instaladores (`/editor-macos/`, `/editor-beta/`, `/flatpak/`)
- **AND** mantém `Allow: /` para permitir a indexação de arquivos de imagem vinculados
