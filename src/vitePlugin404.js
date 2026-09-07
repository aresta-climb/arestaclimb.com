import fs from 'node:fs';
import path from 'node:path';

/**
 * Verifica se a URL requisitada corresponde a um arquivo estático real,
 * uma página HTML MPA mapeada, um arquivo na pasta public ou recurso interno do Vite.
 *
 * @param {string} raiz - Diretório base do projeto.
 * @param {string} urlRequisicao - URL solicitada pelo cliente.
 * @param {boolean} [ehPreview=false] - Indica se a validação é no ambiente de preview (dist).
 * @returns {boolean} True se a rota/arquivo existir, false caso seja uma rota 404.
 */
export function existeArquivoOuRota(raiz, urlRequisicao, ehPreview = false) {
  const pastaBase = ehPreview ? path.resolve(raiz, 'dist') : raiz;
  const pathname = decodeURI(new URL(urlRequisicao, 'http://localhost').pathname);

  // Recursos internos do Vite e node_modules
  if (!ehPreview && (pathname.startsWith('/@') || pathname.startsWith('/__') || pathname.startsWith('/node_modules'))) {
    return true;
  }

  // Raiz do site
  if (pathname === '/' || pathname === '') {
    return fs.existsSync(path.resolve(pastaBase, 'index.html'));
  }

  const caminhoRelativo = pathname.replace(/^\/+/, '');

  // Arquivo exato
  const caminhoExato = path.resolve(pastaBase, caminhoRelativo);
  try {
    if (fs.existsSync(caminhoExato) && fs.statSync(caminhoExato).isFile()) {
      return true;
    }
  } catch {
    // Ignora erros de permissão ou paths inválidos
  }

  // Arquivo .html correspondente (para URLs limpas do Vite/MPA)
  const caminhoHtml = path.resolve(pastaBase, caminhoRelativo + '.html');
  try {
    if (fs.existsSync(caminhoHtml) && fs.statSync(caminhoHtml).isFile()) {
      return true;
    }
  } catch {
    // Ignora erros
  }

  // Subdiretório com index.html
  const caminhoSubIndex = path.resolve(pastaBase, caminhoRelativo, 'index.html');
  try {
    if (fs.existsSync(caminhoSubIndex) && fs.statSync(caminhoSubIndex).isFile()) {
      return true;
    }
  } catch {
    // Ignora erros
  }

  // Pasta public (apenas em dev, já que no build tudo é mesclado em dist)
  if (!ehPreview) {
    const caminhoPublic = path.resolve(raiz, 'public', caminhoRelativo);
    if (fs.existsSync(caminhoPublic)) {
      return true;
    }
  }

  return false;
}

/**
 * Normaliza URLs de subdiretórios que possuem index.html mas foram requisitadas sem barra final.
 * Garante que o Vite e os servidores estáticos sirvam o arquivo index.html correspondente.
 *
 * @param {string} raiz - Diretório base do projeto.
 * @param {string} urlRequisicao - URL solicitada pelo cliente.
 * @param {boolean} [ehPreview=false] - Indica se a validação é no ambiente de preview (dist).
 * @returns {string} URL normalizada com barra final se for subdiretório com index.html, ou original.
 */
export function normalizarRotaSubdiretorio(raiz, urlRequisicao, ehPreview = false) {
  const urlObj = new URL(urlRequisicao || '/', 'http://localhost');
  const pathname = decodeURI(urlObj.pathname);

  if (!pathname.endsWith('/') && !path.extname(pathname)) {
    const pastaBase = ehPreview ? path.resolve(raiz, 'dist') : raiz;
    const caminhoRelativo = pathname.replace(/^\/+/, '');
    const caminhoSubIndex = path.resolve(pastaBase, caminhoRelativo, 'index.html');
    try {
      if (fs.existsSync(caminhoSubIndex) && fs.statSync(caminhoSubIndex).isFile()) {
        return pathname + '/' + urlObj.search;
      }
    } catch {
      // Ignora erros de permissão ou paths inválidos
    }
  }

  return urlRequisicao;
}

/**
 * Plugin do Vite para tratamento e interceptação de 404 em ambiente de desenvolvimento e preview.
 * Garante que rotas válidas passem direto e rotas inexistentes sirvam 404.html com código HTTP 404.
 *
 * @param {string} [raiz=process.cwd()] - Diretório raiz do projeto.
 * @returns {object} Definição de plugin do Vite.
 */
export function plugin404(raiz = process.cwd()) {
  return {
    name: 'plugin-aresta-404',
    configureServer(server) {
      // Middleware PRE: normaliza rotas de subdiretórios antes dos middlewares internos do Vite
      server.middlewares.use((req, res, next) => {
        if (req.method === 'GET' && req.url) {
          req.url = normalizarRotaSubdiretorio(raiz, req.url, false);
        }
        next();
      });

      return () => {
        server.middlewares.use(async (req, res, next) => {
          if (req.method === 'GET' && !res.headersSent) {
            const cabecalhoAccept = req.headers['accept'] || '';
            const extensao = path.extname(req.url || '');

            // Se for requisição para página HTML ou rota sem extensão
            if (cabecalhoAccept.includes('text/html') || !extensao) {
              // Se a rota ou arquivo existir, entrega para o Vite processar
              if (existeArquivoOuRota(raiz, req.url || '')) {
                return next();
              }

              // Rota inexistente -> serve 404.html com status 404
              try {
                const caminho404 = path.resolve(raiz, '404.html');
                if (fs.existsSync(caminho404)) {
                  const conteudoHtml = fs.readFileSync(caminho404, 'utf-8');
                  const transformado = server.transformIndexHtml
                    ? await server.transformIndexHtml(req.url, conteudoHtml)
                    : conteudoHtml;

                  res.statusCode = 404;
                  res.setHeader('Content-Type', 'text/html; charset=utf-8');
                  res.end(transformado);
                  return;
                }
              } catch (erro) {
                return next(erro);
              }
            }
          }
          next();
        });
      };
    },
    configurePreviewServer(server) {
      // Middleware PRE: normaliza rotas de subdiretórios no preview
      server.middlewares.use((req, res, next) => {
        if (req.method === 'GET' && req.url) {
          req.url = normalizarRotaSubdiretorio(raiz, req.url, true);
        }
        next();
      });

      return () => {
        server.middlewares.use((req, res, next) => {
          if (req.method === 'GET' && !res.headersSent) {
            const cabecalhoAccept = req.headers['accept'] || '';
            const extensao = path.extname(req.url || '');

            if (cabecalhoAccept.includes('text/html') || !extensao) {
              if (existeArquivoOuRota(raiz, req.url || '', true)) {
                return next();
              }

              try {
                const caminho404Dist = path.resolve(raiz, 'dist', '404.html');
                if (fs.existsSync(caminho404Dist)) {
                  res.statusCode = 404;
                  res.setHeader('Content-Type', 'text/html; charset=utf-8');
                  res.end(fs.readFileSync(caminho404Dist, 'utf-8'));
                  return;
                }
              } catch (erro) {
                return next(erro);
              }
            }
          }
          next();
        });
      };
    }
  };
}
