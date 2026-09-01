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
    expect(html).toContain('https://apps.apple.com/app/aresta-climb');
    expect(html).toContain('https://play.google.com/store/apps/details?id=com.arestaclimb.app');
    expect(html).toContain('https://chat.whatsapp.com/JmxWeLSmGTT66AREtrKyjA');
    expect(html).toContain('https://apps.microsoft.com/detail/9N6CQNH78WN8');
  });

  it('editor.html deve conter o botão oficial da Microsoft Store', () => {
    const html = fs.readFileSync('editor.html', 'utf8');

    expect(html).toContain('https://apps.microsoft.com/detail/9N6CQNH78WN8');
    expect(html).toContain('Microsoft Store');
    expect(html).toContain('id="themeToggle"');
  });

  it('app.html deve conter os badges das lojas e a imagem do QR Code', () => {
    const html = fs.readFileSync('app.html', 'utf8');

    expect(html).toContain('/assets/qr_arestaclimb.svg');
    expect(html).toContain('id="btn-ios"');
    expect(html).toContain('id="btn-android"');
    expect(html).toContain('id="themeToggle"');
  });
});
