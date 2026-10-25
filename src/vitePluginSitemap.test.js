import { describe, it, expect } from 'vitest';
import path from 'node:path';
import {
  extrairUrlCanonicaIndexavel,
  gerarSitemapXml,
  pluginSitemap
} from './vitePluginSitemap.js';

describe('vitePluginSitemap — Geração Automatizada de Sitemap XML', () => {
  describe('extrairUrlCanonicaIndexavel', () => {
    it('deve extrair a URL canônica de uma página HTML pública indexável', () => {
      const html = `
        <!doctype html>
        <html lang="pt-BR">
          <head>
            <meta charset="utf-8">
            <link rel="canonical" href="https://arestaclimb.com/editor">
          </head>
        </html>
      `;

      expect(extrairUrlCanonicaIndexavel(html)).toBe('https://arestaclimb.com/editor');
    });

    it('deve retornar null quando a página possuir diretiva meta robots noindex', () => {
      const html = `
        <!doctype html>
        <html lang="pt-BR">
          <head>
            <meta name="robots" content="noindex, nofollow">
            <link rel="canonical" href="https://arestaclimb.com/404">
          </head>
        </html>
      `;

      expect(extrairUrlCanonicaIndexavel(html)).toBeNull();
    });

    it('deve retornar null quando a página não possuir tag link canonical', () => {
      const html = `
        <!doctype html>
        <html lang="pt-BR">
          <head>
            <title>Página sem canonical</title>
          </head>
        </html>
      `;

      expect(extrairUrlCanonicaIndexavel(html)).toBeNull();
    });
  });

  describe('gerarSitemapXml', () => {
    it('deve gerar XML válido no protocolo Sitemap 0.9 com as 11 páginas públicas ordenadas e ignorar as 4 páginas noindex', () => {
      const todosOsArquivosHtml = [
        path.resolve('index.html'),
        path.resolve('termos-de-uso.html'),
        path.resolve('politica-de-privacidade.html'),
        path.resolve('politica-de-privacidade-editor.html'),
        path.resolve('privacidade-contribuidores.html'),
        path.resolve('contato.html'),
        path.resolve('app.html'),
        path.resolve('download.html'),
        path.resolve('editor.html'),
        path.resolve('editor/beta/index.html'),
        path.resolve('editor/beta/certificado-instalado/index.html'),
        path.resolve('termos-de-uso-fixalog.html'),
        path.resolve('politica-de-privacidade-fixalog.html'),
        path.resolve('comunidade.html'),
        path.resolve('404.html')
      ];

      const xml = gerarSitemapXml(todosOsArquivosHtml);

      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

      const urlsEsperadas = [
        'https://arestaclimb.com/',
        'https://arestaclimb.com/app',
        'https://arestaclimb.com/contato',
        'https://arestaclimb.com/editor',
        'https://arestaclimb.com/editor/beta',
        'https://arestaclimb.com/politica-de-privacidade',
        'https://arestaclimb.com/politica-de-privacidade-editor',
        'https://arestaclimb.com/politica-de-privacidade-fixalog',
        'https://arestaclimb.com/privacidade-contribuidores',
        'https://arestaclimb.com/termos-de-uso',
        'https://arestaclimb.com/termos-de-uso-fixalog'
      ];

      for (const url of urlsEsperadas) {
        expect(xml).toContain(`<loc>${url}</loc>`);
      }

      const ocorrenciasLoc = xml.match(/<loc>/g) || [];
      expect(ocorrenciasLoc).toHaveLength(11);
      expect(xml.indexOf('<loc>https://arestaclimb.com/</loc>')).toBeLessThan(
        xml.indexOf('<loc>https://arestaclimb.com/app</loc>')
      );
      expect(xml).not.toContain('/404');
      expect(xml).not.toContain('/download');
      expect(xml).not.toContain('/comunidade');
      expect(xml).not.toContain('/certificado-instalado');
    });
  });

  describe('pluginSitemap — Integração com Vite', () => {
    it('deve emitir o asset sitemap.xml no hook generateBundle a partir das entradas de rollupOptions.input', () => {
      const plugin = pluginSitemap();
      plugin.configResolved({
        build: {
          rollupOptions: {
            input: {
              index: path.resolve('index.html'),
              notFound: path.resolve('404.html')
            }
          }
        }
      });

      const ativosEmitidos = [];
      const contextoRollup = {
        emitFile(ativo) {
          ativosEmitidos.push(ativo);
        }
      };

      plugin.generateBundle.call(contextoRollup);

      expect(ativosEmitidos).toHaveLength(1);
      expect(ativosEmitidos[0].type).toBe('asset');
      expect(ativosEmitidos[0].fileName).toBe('sitemap.xml');
      expect(ativosEmitidos[0].source).toContain('<loc>https://arestaclimb.com/</loc>');
    });

    it('deve responder com XML e status 200 ao requisitar GET /sitemap.xml no servidor dev e preview', () => {
      const plugin = pluginSitemap([path.resolve('index.html')]);
      const middlewaresDev = [];
      const middlewaresPreview = [];

      plugin.configureServer({
        middlewares: {
          use(fn) {
            middlewaresDev.push(fn);
          }
        }
      });

      plugin.configurePreviewServer({
        middlewares: {
          use(fn) {
            middlewaresPreview.push(fn);
          }
        }
      });

      const cabecalhos = {};
      let corpoResposta = '';
      const resposta = {
        statusCode: 0,
        setHeader(chave, valor) {
          cabecalhos[chave] = valor;
        },
        end(conteudo) {
          corpoResposta = conteudo;
        }
      };

      let chamouProximo = false;
      middlewaresDev[0]({ method: 'GET', url: '/sitemap.xml' }, resposta, () => {
        chamouProximo = true;
      });

      expect(chamouProximo).toBe(false);
      expect(resposta.statusCode).toBe(200);
      expect(cabecalhos['Content-Type']).toBe('application/xml; charset=utf-8');
      expect(corpoResposta).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

      let chamouProximoPreview = false;
      middlewaresPreview[0]({ method: 'GET', url: '/outra-rota' }, resposta, () => {
        chamouProximoPreview = true;
      });
      expect(chamouProximoPreview).toBe(true);
    });
  });
});
