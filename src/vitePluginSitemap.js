import fs from 'node:fs';

/**
 * Extrai a URL canônica de um documento HTML caso a página seja pública e indexável.
 * Páginas com diretiva meta robots contendo "noindex" ou sem tag canonical retornam null.
 *
 * @param {string} conteudoHtml - Conteúdo HTML bruto da página.
 * @returns {string|null} URL canônica normalizada ou null se não indexável.
 */
export function extrairUrlCanonicaIndexavel(conteudoHtml) {
  const possuiNoindex = /<meta\s+[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(conteudoHtml);
  if (possuiNoindex) {
    return null;
  }

  const correspondenciaCanonica = conteudoHtml.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  if (!correspondenciaCanonica) {
    return null;
  }

  return new URL(correspondenciaCanonica[1]).toString();
}

/**
 * Gera o documento XML completo no protocolo Sitemap 0.9 a partir de uma lista de arquivos HTML.
 *
 * @param {string[]} caminhosHtml - Lista de caminhos absolutos dos arquivos HTML de entrada.
 * @returns {string} Conteúdo XML formatado do sitemap.
 */
export function gerarSitemapXml(caminhosHtml) {
  const urlsUnicas = new Set();

  for (const caminho of caminhosHtml) {
    const conteudoHtml = fs.readFileSync(caminho, 'utf-8');
    const urlCanonica = extrairUrlCanonicaIndexavel(conteudoHtml);
    if (urlCanonica) {
      urlsUnicas.add(urlCanonica);
    }
  }

  const urlsOrdenadas = Array.from(urlsUnicas).sort();
  const blocosUrl = urlsOrdenadas
    .map((url) => `  <url>\n    <loc>${url}</loc>\n  </url>`)
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    blocosUrl,
    '</urlset>',
    ''
  ].join('\n');
}

/**
 * Plugin do Vite para emissão automatizada do sitemap.xml no build de produção
 * e atendimento dinâmico da rota /sitemap.xml nos servidores de desenvolvimento e preview.
 *
 * @param {string[]} [caminhosIniciais=[]] - Lista opcional de arquivos HTML de entrada.
 * @returns {object} Objeto de plugin compatível com Vite e Rollup.
 */
export function pluginSitemap(caminhosIniciais = []) {
  let arquivosHtml = [...caminhosIniciais];

  const criarMiddlewareSitemap = () => (req, res, next) => {
    if (req.method === 'GET' && req.url === '/sitemap.xml') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      res.end(gerarSitemapXml(arquivosHtml));
      return;
    }
    next();
  };

  return {
    name: 'plugin-aresta-sitemap',
    configResolved(config) {
      arquivosHtml = Object.values(config.build.rollupOptions.input);
    },
    generateBundle() {
      const xml = gerarSitemapXml(arquivosHtml);
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: xml
      });
    },
    configureServer(servidor) {
      servidor.middlewares.use(criarMiddlewareSitemap());
    },
    configurePreviewServer(servidor) {
      servidor.middlewares.use(criarMiddlewareSitemap());
    }
  };
}
