import { describe, it, expect } from 'vitest';
import fs from 'fs';

describe('Estrutura Semântica e Integridade das Páginas HTML', () => {
  it('index.html deve conter todas as seções essenciais e acessibilidade WAI-ARIA', () => {
    const html = fs.readFileSync('index.html', 'utf8');

    expect(html).toContain('id="inicio"');
    expect(html).toContain('id="app"');
    expect(html).toContain('id="offline"');
    expect(html).toContain('id="cobertura"');
    expect(html).toContain('id="autoria"');
    expect(html).toContain('id="editor"');
    expect(html).toContain('id="faq"');
    expect(html).toContain('id="comunidade"');
    expect(html).toContain('id="usar"');
    expect(html).toContain('id="qr-modal"');

    // Botões das lojas e WhatsApp
    expect(html).toContain('https://apps.apple.com/app/id6776467893');
    expect(html).toContain('https://play.google.com/store/apps/details?id=app.escalada.croquis');
    expect(html).toContain('https://chat.whatsapp.com/JmxWeLSmGTT66AREtrKyjA');
    expect(html).toContain('href="/editor"');

    // Conquistadores podem aprovar ou rejeitar mudanças nos próprios croquis
    expect(html).toMatch(/aprovar ou rejeitar/i);

    // Seção de Código Aberto e Ecossistema Comunitário
    expect(html).toContain('id="codigo-aberto"');
    expect(html).toContain('https://github.com/aresta-climb/aresta_app');
    expect(html).toContain('https://github.com/aresta-climb/aresta_db');
    expect(html).toContain('https://github.com/aresta-climb');
    expect(html).toContain('Mozilla Public License 2.0');
    expect(html).toContain('Open Database License 1.0');
    expect(html).toContain('https://sentry.io/?utm_source=arestaclimb.com&utm_medium=referral');
    expect(html).toContain('Sponsored Business Plan');

    // Ordem de apresentação: após #editor e antes de #faq
    const idxEditor = html.indexOf('id="editor"');
    const idxCodigoAberto = html.indexOf('id="codigo-aberto"');
    const idxFaq = html.indexOf('id="faq"');
    expect(idxCodigoAberto).toBeGreaterThan(idxEditor);
    expect(idxFaq).toBeGreaterThan(idxCodigoAberto);
  });

  it('editor.html deve conter o botão oficial da Microsoft Store, instaladores macOS (Apple Silicon e Intel) e Linux, link do canal Beta e link do GitHub no footer', () => {
    const html = fs.readFileSync('editor.html', 'utf8');

    expect(html).toContain('https://apps.microsoft.com/detail/9N6CQNH78WN8');
    expect(html).toContain('Microsoft Store');
    expect(html).toContain('https://serving.arestaclimb.com/editor-macos/EditorAresta-latest.dmg');
    expect(html).toContain('https://serving.arestaclimb.com/editor-macos/EditorAresta-intel-latest.dmg');
    expect(html).toContain('Apple Silicon (M1/M2/M3/M4+)');
    expect(html).toContain('Intel (Core i5/i7/i9/Xeon)');
    expect(html).toContain('https://serving.arestaclimb.com/flatpak/com.arestaclimb.Editor.flatpakref');
    expect(html).toContain('https://flatpak.org/setup/');
    expect(html).toContain('id="themeToggle"');
    expect(html).toContain('href="/editor/beta"');
    expect(html).toContain('https://github.com/aresta-climb');
  });

  it('app.html deve conter os badges das lojas, QR Code e link do GitHub no footer', () => {
    const html = fs.readFileSync('app.html', 'utf8');

    expect(html).toContain('/assets/qr_arestaclimb.svg');
    expect(html).toContain('id="btn-ios"');
    expect(html).toContain('id="btn-android"');
    expect(html).toContain('id="themeToggle"');
    expect(html).toContain('https://github.com/aresta-climb');
  });

  it('todas as páginas HTML devem conter tags Open Graph para preview em redes e WhatsApp', () => {
    const pages = [
      'index.html',
      'app.html',
      'download.html',
      'editor.html',
      'termos-de-uso.html',
      'politica-de-privacidade.html',
      'politica-de-privacidade-editor.html',
      'privacidade-contribuidores.html',
      'contato.html',
      'termos-de-uso-fixalog.html',
      'politica-de-privacidade-fixalog.html',
      'comunidade.html',
      '404.html',
      'editor/beta/index.html'
    ];

    pages.forEach(p => {
      const html = fs.readFileSync(p, 'utf8');
      expect(html).toContain('property="og:image"');
      expect(html).toContain('https://arestaclimb.com/og.png');
      expect(html).toContain('property="og:title"');
      expect(html).toContain('property="og:description"');
    });
  });

  it('termos-de-uso-fixalog.html deve conter estrutura semântica correta e apontar para o markdown do Fixalog', () => {
    const html = fs.readFileSync('termos-de-uso-fixalog.html', 'utf8');

    expect(html).toContain('data-doc="/docs/termos-de-uso-fixalog.md"');
    expect(html).toContain('id="markdown-container"');
    expect(html).toContain('id="themeToggle"');
    expect(html).toContain('Fixalog');
    expect(html).toContain('src="/src/main.js"');
  });

  it('politica-de-privacidade-fixalog.html deve conter estrutura semântica correta e apontar para o markdown do Fixalog', () => {
    const html = fs.readFileSync('politica-de-privacidade-fixalog.html', 'utf8');

    expect(html).toContain('data-doc="/docs/politica-de-privacidade-fixalog.md"');
    expect(html).toContain('id="markdown-container"');
    expect(html).toContain('id="themeToggle"');
    expect(html).toContain('Fixalog');
    expect(html).toContain('src="/src/main.js"');
  });

  it('404.html deve conter indicação de página não encontrada, botão para voltar ao início e script notFound', () => {
    const html = fs.readFileSync('404.html', 'utf8');

    expect(html).toContain('404');
    expect(html).toContain('Página não encontrada');
    expect(html).toContain('href="/"');
    expect(html).toContain('id="themeToggle"');
    expect(html).toContain('id="countdown"');
    expect(html).toContain('id="btn-cancelar"');
    expect(html).toContain('src="/src/notFound.js"');
  });

  it('vite.config.js deve registrar os pontos de entrada MPA do Fixalog, Comunidade e da página 404, além dos plugins 404 e Sitemap', () => {
    const configContent = fs.readFileSync('vite.config.js', 'utf8');

    expect(configContent).toContain('termosDeUsoFixalog:');
    expect(configContent).toContain('politicaDePrivacidadeFixalog:');
    expect(configContent).toContain('comunidade:');
    expect(configContent).toContain('notFound:');
    expect(configContent).toContain("appType: 'mpa'");
    expect(configContent).toContain('plugin404');
    expect(configContent).toContain('pluginSitemap');
  });

  it('todas as páginas HTML devem conter links para a Google Play e Apple App Store', () => {
    const pages = [
      'index.html',
      'app.html',
      'download.html',
      'editor.html',
      'termos-de-uso.html',
      'politica-de-privacidade.html',
      'politica-de-privacidade-editor.html',
      'privacidade-contribuidores.html',
      'contato.html',
      'termos-de-uso-fixalog.html',
      'politica-de-privacidade-fixalog.html',
      'comunidade.html',
      '404.html',
      'editor/beta/index.html',
      'editor/beta/certificado-instalado/index.html'
    ];

    pages.forEach(p => {
      const html = fs.readFileSync(p, 'utf8');
      expect(html).toContain('https://apps.apple.com/app/id6776467893');
      expect(html).toContain('https://play.google.com/store/apps/details?id=app.escalada.croquis');
    });
  });

  it('comunidade.html deve conter meta refresh, botão direto e script de redirecionamento para o grupo oficial', () => {
    const html = fs.readFileSync('comunidade.html', 'utf8');

    expect(html).toContain('https://chat.whatsapp.com/JmxWeLSmGTT66AREtrKyjA');
    expect(html).toContain('http-equiv="refresh"');
    expect(html).toContain('id="btn-comunidade"');
    expect(html).toContain('window.location.replace');
  });

  it('public/_redirects e contato.md devem apontar para o link oficial atualizado do WhatsApp', () => {
    const redirects = fs.readFileSync('public/_redirects', 'utf8');
    expect(redirects).toContain('/comunidade https://chat.whatsapp.com/JmxWeLSmGTT66AREtrKyjA 302');

    const contatoMd = fs.readFileSync('public/docs/contato.md', 'utf8');
    expect(contatoMd).toContain('https://chat.whatsapp.com/JmxWeLSmGTT66AREtrKyjA');
    expect(contatoMd).not.toContain('Ip28rjQj4YbHgPgtN5Arcv');
  });

  it('todas as 11 páginas públicas indexáveis devem declarar <link rel="canonical"> exato sem www e sem noindex', () => {
    const paginasIndexaveis = [
      { arquivo: 'index.html', urlCanonica: 'https://arestaclimb.com/' },
      { arquivo: 'app.html', urlCanonica: 'https://arestaclimb.com/app' },
      { arquivo: 'editor.html', urlCanonica: 'https://arestaclimb.com/editor' },
      { arquivo: 'editor/beta/index.html', urlCanonica: 'https://arestaclimb.com/editor/beta' },
      { arquivo: 'contato.html', urlCanonica: 'https://arestaclimb.com/contato' },
      { arquivo: 'termos-de-uso.html', urlCanonica: 'https://arestaclimb.com/termos-de-uso' },
      { arquivo: 'politica-de-privacidade.html', urlCanonica: 'https://arestaclimb.com/politica-de-privacidade' },
      { arquivo: 'politica-de-privacidade-editor.html', urlCanonica: 'https://arestaclimb.com/politica-de-privacidade-editor' },
      { arquivo: 'privacidade-contribuidores.html', urlCanonica: 'https://arestaclimb.com/privacidade-contribuidores' },
      { arquivo: 'termos-de-uso-fixalog.html', urlCanonica: 'https://arestaclimb.com/termos-de-uso-fixalog' },
      { arquivo: 'politica-de-privacidade-fixalog.html', urlCanonica: 'https://arestaclimb.com/politica-de-privacidade-fixalog' }
    ];

    for (const { arquivo, urlCanonica } of paginasIndexaveis) {
      const html = fs.readFileSync(arquivo, 'utf8');
      expect(html).toContain(`<link rel="canonical" href="${urlCanonica}">`);
      expect(html).not.toContain('noindex');
    }
  });

  it('as 4 páginas utilitárias e de redirecionamento devem declarar <meta name="robots" content="noindex, nofollow">', () => {
    const paginasNaoIndexaveis = [
      '404.html',
      'download.html',
      'comunidade.html',
      'editor/beta/certificado-instalado/index.html'
    ];

    for (const arquivo of paginasNaoIndexaveis) {
      const html = fs.readFileSync(arquivo, 'utf8');
      expect(html).toContain('<meta name="robots" content="noindex, nofollow">');
      expect(html).not.toContain('rel="canonical"');
    }
  });

  it('todos os links de instaladores apontando para serving.arestaclimb.com devem possuir rel="nofollow"', () => {
    const paginasComDownloads = [
      'editor.html',
      'editor/beta/index.html',
      'editor/beta/certificado-instalado/index.html'
    ];

    for (const arquivo of paginasComDownloads) {
      const html = fs.readFileSync(arquivo, 'utf8');
      const tagsLinkServing = html.match(/<a\s+[^>]*href="https:\/\/serving\.arestaclimb\.com\/[^"]+"[^>]*>/g) || [];
      expect(tagsLinkServing.length).toBeGreaterThan(0);
      for (const tag of tagsLinkServing) {
        expect(tag).toContain('rel="nofollow"');
      }
    }
  });

  it('o rodapé institucional de index.html deve conter links diretos para /editor/beta, /privacidade-contribuidores e /contato', () => {
    const html = fs.readFileSync('index.html', 'utf8');

    expect(html).toContain('href="/editor/beta"');
    expect(html).toContain('href="/privacidade-contribuidores"');
    expect(html).toContain('href="/contato"');
  });

  it('public/robots.txt deve permitir rastreamento e referenciar https://arestaclimb.com/sitemap.xml', () => {
    const robots = fs.readFileSync('public/robots.txt', 'utf8');

    expect(robots).toContain('User-agent: *');
    expect(robots).toContain('Allow: /');
    expect(robots).toContain('Sitemap: https://arestaclimb.com/sitemap.xml');
  });

  it('public/serving-robots.txt deve permitir imagens e bloquear arquivos .binarypb, .yaml/.yml e pastas de instaladores', () => {
    const servingRobots = fs.readFileSync('public/serving-robots.txt', 'utf8');

    expect(servingRobots).toContain('User-agent: *');
    expect(servingRobots).toContain('Disallow: /*.binarypb$');
    expect(servingRobots).toContain('Disallow: /*.binarypb?*');
    expect(servingRobots).toContain('Disallow: /*.yaml$');
    expect(servingRobots).toContain('Disallow: /*.yaml?*');
    expect(servingRobots).toContain('Disallow: /*.yml$');
    expect(servingRobots).toContain('Disallow: /*.yml?*');
    expect(servingRobots).toContain('Disallow: /editor-macos/');
    expect(servingRobots).toContain('Disallow: /editor-beta/');
    expect(servingRobots).toContain('Disallow: /flatpak/');
    expect(servingRobots).toContain('Allow: /');
  });

  it('nenhuma página HTML deve conter scripts externos do Sentry nem caractere BOM UTF-8', () => {
    const paginasHtml = [
      'index.html',
      '404.html',
      'app.html',
      'comunidade.html',
      'contato.html',
      'download.html',
      'editor.html',
      'editor/beta/index.html',
      'editor/beta/certificado-instalado/index.html',
      'termos-de-uso.html',
      'politica-de-privacidade.html',
      'politica-de-privacidade-editor.html',
      'privacidade-contribuidores.html',
      'termos-de-uso-fixalog.html',
      'politica-de-privacidade-fixalog.html'
    ];

    for (const arquivo of paginasHtml) {
      const conteudo = fs.readFileSync(arquivo, 'utf8');
      expect(conteudo.startsWith('\uFEFF'), `${arquivo} não deve começar com caractere BOM UTF-8`).toBe(false);
      expect(conteudo, `${arquivo} não deve carregar script da CDN do Sentry`).not.toContain('sentry-cdn.com');
      expect(conteudo, `${arquivo} não deve ter tag de script apontando para o Sentry`).not.toMatch(/<script\s+[^>]*src="[^"]*sentry[^"]*"/i);
    }
  });
});

