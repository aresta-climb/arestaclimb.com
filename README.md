# Aresta Climb - Hub Central & Documentação Legal

Bem-vindo ao repositório do site central do ecossistema **Aresta Climb**.
Este repositório é responsável por servir a infraestrutura web de documentação pública e acordos legais, Termos de Uso, Políticas de Privacidade e Smart Hub de Download com QR Code (adotamos DCO para contribuições).

O site foi construído com foco em **performance extrema, tipografia moderna e integração limpa com Markdown**.

## 🚀 Tecnologias Utilizadas

- **[Vite](https://vitejs.dev/):** Utilizado como bundler ultrarrápido e servidor de desenvolvimento.
- **Vanilla JS & CSS:** Zero frameworks pesados. Apenas JavaScript puro e CSS moderno com suporte a variáveis e _glassmorphism_.
- **[Marked.js](https://marked.js.org/):** Para renderizar em tempo real os documentos legais armazenados em formato `.md`.
- **[Vitest](https://vitest.dev/):** Para garantia de qualidade e 100% de cobertura de testes no parser de markdown.

## 🛠️ Arquitetura (MPA)

Este projeto usa a arquitetura de Múltiplas Páginas (MPA) configurada no Vite. As páginas disponíveis (pontos de entrada) são:
- `/` ➔ Landing page oficial do app Aresta Climb (`index.html`)
- `/app` (e alias `/download`) ➔ Smart Redirect para App Store / Google Play e Hub QR Code (`app.html`)
- `/editor` ➔ Landing page e download do Editor Aresta Desktop (`editor.html`)
- `/editor/beta` ➔ Canal Beta do Editor Aresta para Windows (`editor/beta/index.html`)
- `/editor/beta/certificado-instalado` ➔ Callback técnico de validação do certificado Beta (`noindex`)
- `/termos-de-uso` ➔ Renderiza `termos-de-uso.md`
- `/politica-de-privacidade` ➔ Renderiza `politica-de-privacidade.md`
- `/politica-de-privacidade-editor` ➔ Renderiza `politica-de-privacidade-editor.md`
- `/termos-de-uso-fixalog` ➔ Renderiza `termos-de-uso-fixalog.md`
- `/politica-de-privacidade-fixalog` ➔ Renderiza `politica-de-privacidade-fixalog.md`
- `/privacidade-contribuidores` ➔ Renderiza `privacidade-contribuidores.md`
- `/contato` ➔ Renderiza `contato.md`
- `/comunidade` ➔ Redirecionamento para a comunidade oficial no WhatsApp (`noindex`)
- `/404` ➔ Página de erro e redirecionamento de rotas inexistentes (`404.html`, `noindex`)

Os documentos legais de origem ficam na pasta `/public/docs/`. O arquivo JavaScript `src/main.js` intercepta as requisições e busca o markdown de forma assíncrona para montar o documento renderizado na tela. A landing page principal e todas as páginas utilizam o Design System unificado com suporte nativo a Dark/Light mode (`src/landing.css`, `src/landing.js`, `src/style.css` e `src/editor.css`).

## 🔍 SEO, Sitemap Automatizado e Subdomínios

- **Geração Automática de `sitemap.xml` (`src/vitePluginSitemap.js`):** Durante o `npm run build` (e em tempo real em `GET /sitemap.xml` no modo dev/preview), o plugin do Vite inspeciona todas as entradas HTML de `vite.config.js`, ignora páginas com `<meta name="robots" content="noindex, nofollow">` e extrai automaticamente as URLs de `<link rel="canonical">` para emitir `dist/sitemap.xml`.
- **Regras para Subdomínios na Cloudflare / Storage:**
  - **`serving.arestaclimb.com` (Storage / R2):** O arquivo de referência versionado em `public/serving-robots.txt` deve ser publicado como `robots.txt` na raiz do bucket `serving.arestaclimb.com`, permitindo que imagens vinculadas sejam indexadas (`Allow: /`), mas bloqueando arquivos de dados (`*.binarypb`, `*.yaml`, `*.yml`) e pastas de instaladores (`/editor-macos/`, `/editor-beta/`, `/flatpak/`).
  - **`previa.arestaclimb.com` e `feedback.arestaclimb.com` (APIs):** Devem responder com cabeçalho HTTP `X-Robots-Tag: noindex, nofollow` (via Cloudflare Response Header Transform Rule) e/ou `robots.txt` com `Disallow: /`.
  - **`www.arestaclimb.com`:** Deve redirecionar via HTTP `301` para `https://arestaclimb.com` nas Redirect Rules da Cloudflare.

## 💻 Como Rodar Localmente

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   *O site estará disponível no endereço local fornecido pelo terminal (geralmente `http://localhost:5173`).*

3. **Rodar a Suíte de Testes:**
   ```bash
   npm run test
   ```
   *(Seguimos rigorosamente os nossos [Princípios de Engenharia](AGENTS.md) e garantimos 100% de cobertura com `npm run coverage`)*

## 🌐 Build e Deploy (Cloudflare Pages)

A hospedagem está configurada para aproveitar o Edge Global da Cloudflare, garantindo que os termos carreguem instantaneamente em qualquer parte do mundo.

1. **Gere os arquivos de produção:**
   ```bash
   npm run build
   ```
   *Isto processará os assets e gerará a pasta `dist/` com os arquivos finais.*

2. **Deploy Automático:**
   O deploy é automatizado através da integração direta com o **Cloudflare Pages**. Basta realizar o push para a branch `main` e o Cloudflare irá rodar o build e publicar o site na mesma hora.

---
*© 2026 Aresta Climb - Criado com foco na comunidade da escalada.*
