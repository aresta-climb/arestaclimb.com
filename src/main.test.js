import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { inicializarDocumento, initMain } from './main.js';
import * as markdownRenderer from './markdownRenderer.js';

vi.mock('./markdownRenderer.js', () => ({
  loadAndRenderMarkdown: vi.fn()
}));

describe('main.js — Inicialização e Carregamento de Documentos Markdown', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('deve chamar loadAndRenderMarkdown com o data-doc correto se os elementos existirem', () => {
    document.body.innerHTML = `
      <main class="content-area" data-doc="/docs/termos-de-uso.md">
        <div id="markdown-container">Carregando...</div>
      </main>
    `;

    const container = document.getElementById('markdown-container');
    inicializarDocumento(document);

    expect(markdownRenderer.loadAndRenderMarkdown).toHaveBeenCalledWith(
      '/docs/termos-de-uso.md',
      container
    );
  });

  it('não deve chamar loadAndRenderMarkdown se data-doc estiver ausente', () => {
    document.body.innerHTML = `
      <main class="content-area">
        <div id="markdown-container">Carregando...</div>
      </main>
    `;

    inicializarDocumento(document);
    expect(markdownRenderer.loadAndRenderMarkdown).not.toHaveBeenCalled();
  });

  it('não deve quebrar se o container ou a área principal não existirem', () => {
    document.body.innerHTML = `<div>Outra página</div>`;

    expect(() => {
      inicializarDocumento(document);
    }).not.toThrow();
    expect(markdownRenderer.loadAndRenderMarkdown).not.toHaveBeenCalled();
  });

  it('não deve quebrar se documento for nulo', () => {
    expect(() => {
      inicializarDocumento(null);
    }).not.toThrow();
  });

  it('initMain deve executar imediatamente se document.readyState não for loading', () => {
    document.body.innerHTML = `
      <main class="content-area" data-doc="/docs/termos-de-uso.md">
        <div id="markdown-container">Carregando...</div>
      </main>
    `;

    const docMock = {
      readyState: 'complete',
      getElementById: (id) => document.getElementById(id),
      querySelector: (sel) => document.querySelector(sel),
      addEventListener: vi.fn()
    };

    initMain(docMock);

    expect(docMock.addEventListener).not.toHaveBeenCalled();
    expect(markdownRenderer.loadAndRenderMarkdown).toHaveBeenCalled();
  });

  it('initMain deve registrar ouvinte de DOMContentLoaded se document.readyState for loading', () => {
    document.body.innerHTML = `
      <main class="content-area" data-doc="/docs/termos-de-uso.md">
        <div id="markdown-container">Carregando...</div>
      </main>
    `;

    const listeners = {};
    const docMock = {
      readyState: 'loading',
      getElementById: (id) => document.getElementById(id),
      querySelector: (sel) => document.querySelector(sel),
      addEventListener: vi.fn((ev, cb) => {
        listeners[ev] = cb;
      })
    };

    initMain(docMock);

    expect(docMock.addEventListener).toHaveBeenCalledWith('DOMContentLoaded', expect.any(Function));
    expect(markdownRenderer.loadAndRenderMarkdown).not.toHaveBeenCalled();

    // Dispara o evento
    listeners['DOMContentLoaded']();
    expect(markdownRenderer.loadAndRenderMarkdown).toHaveBeenCalled();
  });
});
