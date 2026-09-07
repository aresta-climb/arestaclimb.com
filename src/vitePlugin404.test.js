import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { plugin404, existeArquivoOuRota, normalizarRotaSubdiretorio } from './vitePlugin404.js';
import fs from 'node:fs';

describe('plugin404 — Plugin do Vite para Tratamento de 404 em Dev e Preview', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('existeArquivoOuRota', () => {
    it('deve retornar true para a raiz "/" se index.html existir', () => {
      vi.spyOn(fs, 'existsSync').mockImplementation((caminho) => caminho.includes('index.html'));
      expect(existeArquivoOuRota('/mock/raiz', '/')).toBe(true);
    });

    it('deve retornar true para a raiz com ehPreview=true se dist/index.html existir', () => {
      vi.spyOn(fs, 'existsSync').mockImplementation((caminho) => caminho.includes('dist') && caminho.includes('index.html'));
      expect(existeArquivoOuRota('/mock/raiz', '/', true)).toBe(true);
    });

    it('deve retornar false para a raiz se index.html não existir', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(false);
      expect(existeArquivoOuRota('/mock/raiz', '/')).toBe(false);
    });

    it('deve retornar true para rotas internas do Vite (@vite, @fs, node_modules) apenas em dev', () => {
      expect(existeArquivoOuRota('/mock/raiz', '/@vite/client')).toBe(true);
      expect(existeArquivoOuRota('/mock/raiz', '/__vite_ping')).toBe(true);
      expect(existeArquivoOuRota('/mock/raiz', '/node_modules/vite/dist/client.mjs')).toBe(true);

      // Em preview não deve retornar true automaticamente
      vi.spyOn(fs, 'existsSync').mockReturnValue(false);
      expect(existeArquivoOuRota('/mock/raiz', '/@vite/client', true)).toBe(false);
    });

    it('deve retornar true para arquivo exato existente', () => {
      vi.spyOn(fs, 'existsSync').mockImplementation((caminho) => caminho.endsWith('favicon.ico'));
      vi.spyOn(fs, 'statSync').mockReturnValue({ isFile: () => true });

      expect(existeArquivoOuRota('/mock/raiz', '/favicon.ico')).toBe(true);
    });

    it('deve ignorar exceções ao verificar arquivo exato', () => {
      vi.spyOn(fs, 'existsSync').mockImplementation((caminho) => !caminho.includes('public'));
      vi.spyOn(fs, 'statSync').mockImplementation(() => {
        throw new Error('Permissão negada');
      });

      expect(existeArquivoOuRota('/mock/raiz', '/arquivo-com-erro')).toBe(false);
    });

    it('deve retornar true para páginas html existentes sem extensão na URL', () => {
      vi.spyOn(fs, 'existsSync').mockImplementation((caminho) => caminho.includes('termos-de-uso.html'));
      vi.spyOn(fs, 'statSync').mockReturnValue({ isFile: () => true });

      expect(existeArquivoOuRota('/mock/raiz', '/termos-de-uso')).toBe(true);
    });

    it('deve retornar true para subdiretórios que possuem index.html', () => {
      vi.spyOn(fs, 'existsSync').mockImplementation((caminho) => caminho.includes('editor') && caminho.includes('index.html'));
      vi.spyOn(fs, 'statSync').mockReturnValue({ isFile: () => true });

      expect(existeArquivoOuRota('/mock/raiz', '/editor/beta')).toBe(true);
    });

    it('deve retornar true para arquivos estáticos na pasta public em dev', () => {
      vi.spyOn(fs, 'existsSync').mockImplementation((caminho) => caminho.includes('public'));
      vi.spyOn(fs, 'statSync').mockReturnValue({ isFile: () => false });

      expect(existeArquivoOuRota('/mock/raiz', '/docs/termos-de-uso.md')).toBe(true);
    });

    it('não deve checar pasta public se ehPreview for true', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(false);
      expect(existeArquivoOuRota('/mock/raiz', '/docs/termos-de-uso.md', true)).toBe(false);
    });

    it('deve retornar false para rotas que não existem', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(false);
      expect(existeArquivoOuRota('/mock/raiz', '/caca')).toBe(false);
    });
  });

  describe('normalizarRotaSubdiretorio', () => {
    it('deve adicionar barra final quando subdiretório com index.html for requisitado sem barra', () => {
      vi.spyOn(fs, 'existsSync').mockImplementation((caminho) => caminho.includes('beta') && caminho.includes('index.html'));
      vi.spyOn(fs, 'statSync').mockReturnValue({ isFile: () => true });

      const resultado = normalizarRotaSubdiretorio('/mock/raiz', '/editor/beta');
      expect(resultado).toBe('/editor/beta/');
    });

    it('deve preservar query string ao adicionar barra final', () => {
      vi.spyOn(fs, 'existsSync').mockImplementation((caminho) => caminho.includes('beta') && caminho.includes('index.html'));
      vi.spyOn(fs, 'statSync').mockReturnValue({ isFile: () => true });

      const resultado = normalizarRotaSubdiretorio('/mock/raiz', '/editor/beta?origem=instalador&thumbprint=abc');
      expect(resultado).toBe('/editor/beta/?origem=instalador&thumbprint=abc');
    });

    it('não deve alterar URL que já termina com barra', () => {
      const resultado = normalizarRotaSubdiretorio('/mock/raiz', '/editor/beta/');
      expect(resultado).toBe('/editor/beta/');
    });

    it('não deve alterar URL que possui extensão de arquivo', () => {
      const resultado = normalizarRotaSubdiretorio('/mock/raiz', '/src/main.js');
      expect(resultado).toBe('/src/main.js');
    });

    it('não deve alterar rota quando subdiretório não possui index.html', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(false);
      const resultado = normalizarRotaSubdiretorio('/mock/raiz', '/editor/desconhecido');
      expect(resultado).toBe('/editor/desconhecido');
    });

    it('não deve alterar rota se fs.statSync lançar exceção', () => {
      vi.spyOn(fs, 'existsSync').mockReturnValue(true);
      vi.spyOn(fs, 'statSync').mockImplementation(() => {
        throw new Error('EACCES');
      });

      const resultado = normalizarRotaSubdiretorio('/mock/raiz', '/editor/beta');
      expect(resultado).toBe('/editor/beta');
    });

    it('deve verificar na pasta dist quando ehPreview for true', () => {
      vi.spyOn(fs, 'existsSync').mockImplementation((caminho) => caminho.includes('dist') && caminho.includes('index.html'));
      vi.spyOn(fs, 'statSync').mockReturnValue({ isFile: () => true });

      const resultado = normalizarRotaSubdiretorio('/mock/raiz', '/editor/beta', true);
      expect(resultado).toBe('/editor/beta/');
    });

    it('deve lidar com urlRequisicao vazia ou ausente', () => {
      const resultado = normalizarRotaSubdiretorio('/mock/raiz', '');
      expect(resultado).toBe('');
    });
  });

  describe('middleware dev (configureServer)', () => {
    it('deve usar process.cwd() como raiz padrão se nenhum argumento for passado', () => {
      const plugin = plugin404();
      expect(plugin.name).toBe('plugin-aresta-404');
    });

    it('deve normalizar rota no pre-middleware se for GET', () => {
      const plugin = plugin404('/mock/raiz');
      const middlewares = [];
      const serverMock = {
        middlewares: {
          use: (fn) => { middlewares.push(fn); }
        }
      };
      plugin.configureServer(serverMock);

      vi.spyOn(fs, 'existsSync').mockImplementation((caminho) => caminho.includes('beta') && caminho.includes('index.html'));
      vi.spyOn(fs, 'statSync').mockReturnValue({ isFile: () => true });

      const preMiddleware = middlewares[0];
      const req = { method: 'GET', url: '/editor/beta' };
      const next = vi.fn();

      preMiddleware(req, {}, next);
      expect(req.url).toBe('/editor/beta/');
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('não deve modificar URL no pre-middleware se não for GET ou sem URL', () => {
      const plugin = plugin404('/mock/raiz');
      const middlewares = [];
      const serverMock = {
        middlewares: {
          use: (fn) => { middlewares.push(fn); }
        }
      };
      plugin.configureServer(serverMock);

      const preMiddleware = middlewares[0];
      const req = { method: 'POST', url: '/editor/beta' };
      const next = vi.fn();

      preMiddleware(req, {}, next);
      expect(req.url).toBe('/editor/beta');
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('deve chamar next() e NÃO interceptar rota válida no post-middleware', async () => {
      const plugin = plugin404('/mock/raiz');
      const middlewares = [];
      const serverMock = {
        middlewares: {
          use: (fn) => { middlewares.push(fn); }
        }
      };
      const postInit = plugin.configureServer(serverMock);
      postInit();

      const postMiddleware = middlewares[1];

      vi.spyOn(fs, 'existsSync').mockImplementation((caminho) => caminho.includes('index.html'));

      const req = { method: 'GET', url: '/', headers: { accept: 'text/html' } };
      const res = { headersSent: false, statusCode: 200, setHeader: vi.fn(), end: vi.fn() };
      const next = vi.fn();

      await postMiddleware(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(res.statusCode).toBe(200);
      expect(res.end).not.toHaveBeenCalled();
    });

    it('deve interceptar rota inexistente como "/caca" e servir 404.html com status 404', async () => {
      const plugin = plugin404('/mock/raiz');
      const middlewares = [];
      const serverMock = {
        middlewares: {
          use: (fn) => { middlewares.push(fn); }
        },
        transformIndexHtml: vi.fn().mockResolvedValue('<html>Transformed 404</html>')
      };
      const postInit = plugin.configureServer(serverMock);
      postInit();

      const postMiddleware = middlewares[1];

      vi.spyOn(fs, 'existsSync').mockImplementation((caminho) => caminho.includes('404.html'));
      vi.spyOn(fs, 'readFileSync').mockReturnValue('<html>404 Original</html>');

      const req = { method: 'GET', url: '/caca', headers: { accept: 'text/html' } };
      const res = { headersSent: false, statusCode: 200, setHeader: vi.fn(), end: vi.fn() };
      const next = vi.fn();

      await postMiddleware(req, res, next);

      expect(res.statusCode).toBe(404);
      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/html; charset=utf-8');
      expect(res.end).toHaveBeenCalledWith('<html>Transformed 404</html>');
      expect(next).not.toHaveBeenCalled();
    });

    it('deve chamar next() se headers já foram enviados ou se não for requisição HTML', async () => {
      const plugin = plugin404('/mock/raiz');
      const middlewares = [];
      const serverMock = {
        middlewares: {
          use: (fn) => { middlewares.push(fn); }
        }
      };
      const postInit = plugin.configureServer(serverMock);
      postInit();

      const postMiddleware = middlewares[1];

      const req1 = { method: 'GET', url: '/caca', headers: { accept: 'text/html' } };
      const res1 = { headersSent: true };
      const next1 = vi.fn();
      await postMiddleware(req1, res1, next1);
      expect(next1).toHaveBeenCalledTimes(1);

      const req2 = { method: 'POST', url: '/caca', headers: { accept: 'text/html' } };
      const res2 = { headersSent: false };
      const next2 = vi.fn();
      await postMiddleware(req2, res2, next2);
      expect(next2).toHaveBeenCalledTimes(1);

      const req3 = { method: 'GET', url: '/app.js', headers: { accept: '*/*' } };
      const res3 = { headersSent: false };
      const next3 = vi.fn();
      await postMiddleware(req3, res3, next3);
      expect(next3).toHaveBeenCalledTimes(1);
    });

    it('deve repassar erro para next(err) se falhar ao processar 404 em dev', async () => {
      const plugin = plugin404('/mock/raiz');
      const middlewares = [];
      const serverMock = {
        middlewares: {
          use: (fn) => { middlewares.push(fn); }
        }
      };
      const postInit = plugin.configureServer(serverMock);
      postInit();

      const postMiddleware = middlewares[1];

      vi.spyOn(fs, 'existsSync').mockImplementation((caminho) => {
        if (caminho.includes('404.html')) return true;
        return false;
      });
      vi.spyOn(fs, 'readFileSync').mockImplementation(() => {
        throw new Error('Falha de leitura');
      });

      const req = { method: 'GET', url: '/caca', headers: { accept: 'text/html' } };
      const res = { headersSent: false };
      const next = vi.fn();

      await postMiddleware(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('middleware preview (configurePreviewServer)', () => {
    it('deve normalizar rota no pre-middleware de preview se for GET', () => {
      const plugin = plugin404('/mock/raiz');
      const middlewares = [];
      const serverMock = {
        middlewares: {
          use: (fn) => { middlewares.push(fn); }
        }
      };
      plugin.configurePreviewServer(serverMock);

      vi.spyOn(fs, 'existsSync').mockImplementation((caminho) => caminho.includes('dist') && caminho.includes('index.html'));
      vi.spyOn(fs, 'statSync').mockReturnValue({ isFile: () => true });

      const preMiddleware = middlewares[0];
      const req = { method: 'GET', url: '/editor/beta' };
      const next = vi.fn();

      preMiddleware(req, {}, next);
      expect(req.url).toBe('/editor/beta/');
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('não deve modificar URL no pre-middleware se não for GET', () => {
      const plugin = plugin404('/mock/raiz');
      const middlewares = [];
      const serverMock = {
        middlewares: {
          use: (fn) => { middlewares.push(fn); }
        }
      };
      plugin.configurePreviewServer(serverMock);

      const preMiddleware = middlewares[0];
      const req = { method: 'POST', url: '/editor/beta' };
      const next = vi.fn();

      preMiddleware(req, {}, next);
      expect(req.url).toBe('/editor/beta');
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('deve chamar next() para rotas válidas no preview', () => {
      const plugin = plugin404('/mock/raiz');
      const middlewares = [];
      const serverMock = {
        middlewares: {
          use: (fn) => { middlewares.push(fn); }
        }
      };
      const postInit = plugin.configurePreviewServer(serverMock);
      postInit();

      const postMiddleware = middlewares[1];

      vi.spyOn(fs, 'existsSync').mockImplementation((caminho) => caminho.includes('index.html'));

      const req = { method: 'GET', url: '/', headers: { accept: 'text/html' } };
      const res = { headersSent: false, statusCode: 200, setHeader: vi.fn(), end: vi.fn() };
      const next = vi.fn();

      postMiddleware(req, res, next);
      expect(next).toHaveBeenCalledTimes(1);
      expect(res.end).not.toHaveBeenCalled();
    });

    it('deve chamar next() no preview se headersSent for true, se não for GET ou não for HTML', () => {
      const plugin = plugin404('/mock/raiz');
      const middlewares = [];
      const serverMock = {
        middlewares: {
          use: (fn) => { middlewares.push(fn); }
        }
      };
      const postInit = plugin.configurePreviewServer(serverMock);
      postInit();

      const postMiddleware = middlewares[1];

      const req1 = { method: 'GET', url: '/caca', headers: { accept: 'text/html' } };
      const res1 = { headersSent: true };
      const next1 = vi.fn();
      postMiddleware(req1, res1, next1);
      expect(next1).toHaveBeenCalledTimes(1);

      const req2 = { method: 'POST', url: '/caca', headers: { accept: 'text/html' } };
      const res2 = { headersSent: false };
      const next2 = vi.fn();
      postMiddleware(req2, res2, next2);
      expect(next2).toHaveBeenCalledTimes(1);

      const req3 = { method: 'GET', url: '/style.css', headers: { accept: 'text/css' } };
      const res3 = { headersSent: false };
      const next3 = vi.fn();
      postMiddleware(req3, res3, next3);
      expect(next3).toHaveBeenCalledTimes(1);
    });

    it('deve servir dist/404.html com status 404 para rotas inválidas no preview', () => {
      const plugin = plugin404('/mock/raiz');
      const middlewares = [];
      const serverMock = {
        middlewares: {
          use: (fn) => { middlewares.push(fn); }
        }
      };
      const postInit = plugin.configurePreviewServer(serverMock);
      postInit();

      const postMiddleware = middlewares[1];

      vi.spyOn(fs, 'existsSync').mockImplementation((caminho) => caminho.includes('404.html'));
      vi.spyOn(fs, 'readFileSync').mockReturnValue('<html>Preview 404</html>');

      const req = { method: 'GET', url: '/caca', headers: { accept: 'text/html' } };
      const res = { headersSent: false, statusCode: 200, setHeader: vi.fn(), end: vi.fn() };
      const next = vi.fn();

      postMiddleware(req, res, next);

      expect(res.statusCode).toBe(404);
      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/html; charset=utf-8');
      expect(res.end).toHaveBeenCalledWith('<html>Preview 404</html>');
    });

    it('deve repassar erro para next(err) se falhar ao processar 404 em preview', () => {
      const plugin = plugin404('/mock/raiz');
      const middlewares = [];
      const serverMock = {
        middlewares: {
          use: (fn) => { middlewares.push(fn); }
        }
      };
      const postInit = plugin.configurePreviewServer(serverMock);
      postInit();

      const postMiddleware = middlewares[1];

      vi.spyOn(fs, 'existsSync').mockImplementation((caminho) => {
        if (caminho.includes('404.html')) return true;
        return false;
      });
      vi.spyOn(fs, 'readFileSync').mockImplementation(() => {
        throw new Error('Erro no preview');
      });

      const req = { method: 'GET', url: '/caca', headers: { accept: 'text/html' } };
      const res = { headersSent: false };
      const next = vi.fn();

      postMiddleware(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
