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
    expect(html).toContain('https://apps.microsoft.com/detail/9N6CQNH78WN8');

    // Conquistadores podem aprovar ou rejeitar mudanças nos próprios croquis
    expect(html).toMatch(/aprovar ou rejeitar/i);
  });

  it('editor.html deve conter o botão oficial da Microsoft Store e o link para o canal Beta no final da página', () => {
    const html = fs.readFileSync('editor.html', 'utf8');

    expect(html).toContain('https://apps.microsoft.com/detail/9N6CQNH78WN8');
    expect(html).toContain('Microsoft Store');
    expect(html).toContain('id="themeToggle"');
    expect(html).toContain('href="/editor/beta"');
  });

  it('app.html deve conter os badges das lojas e a imagem do QR Code', () => {
    const html = fs.readFileSync('app.html', 'utf8');

    expect(html).toContain('/assets/qr_arestaclimb.svg');
    expect(html).toContain('id="btn-ios"');
    expect(html).toContain('id="btn-android"');
    expect(html).toContain('id="themeToggle"');
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
      'termos-de-uso-fixlog.html',
      'politica-de-privacidade-fixlog.html',
      '404.html'
    ];

    pages.forEach(p => {
      const html = fs.readFileSync(p, 'utf8');
      expect(html).toContain('property="og:image"');
      expect(html).toContain('https://arestaclimb.com/og.png');
      expect(html).toContain('property="og:title"');
      expect(html).toContain('property="og:description"');
    });
  });

  it('termos-de-uso-fixlog.html deve conter estrutura semântica correta e apontar para o markdown do FixLog', () => {
    const html = fs.readFileSync('termos-de-uso-fixlog.html', 'utf8');

    expect(html).toContain('data-doc="/docs/termos-de-uso-fixlog.md"');
    expect(html).toContain('id="markdown-container"');
    expect(html).toContain('id="themeToggle"');
    expect(html).toContain('FixLog');
    expect(html).toContain('src="/src/main.js"');
  });

  it('politica-de-privacidade-fixlog.html deve conter estrutura semântica correta e apontar para o markdown do FixLog', () => {
    const html = fs.readFileSync('politica-de-privacidade-fixlog.html', 'utf8');

    expect(html).toContain('data-doc="/docs/politica-de-privacidade-fixlog.md"');
    expect(html).toContain('id="markdown-container"');
    expect(html).toContain('id="themeToggle"');
    expect(html).toContain('FixLog');
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

  it('vite.config.js deve registrar os pontos de entrada MPA do FixLog e da página 404', () => {
    const configContent = fs.readFileSync('vite.config.js', 'utf8');

    expect(configContent).toContain('termosDeUsoFixlog:');
    expect(configContent).toContain('politicaDePrivacidadeFixlog:');
    expect(configContent).toContain('notFound:');
    expect(configContent).toContain("appType: 'mpa'");
    expect(configContent).toContain('plugin404');
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
      'termos-de-uso-fixlog.html',
      'politica-de-privacidade-fixlog.html',
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
});
