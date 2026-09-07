import './style.css';
import './theme.js';
import { loadAndRenderMarkdown } from './markdownRenderer.js';

/**
 * Inicializa a renderização do documento markdown na página.
 * Busca o elemento com atributo data-doc e o container de destino.
 *
 * @param {Document|null} documento - Instância do DOM.
 */
export function inicializarDocumento(documento = (typeof document !== 'undefined' ? document : null)) {
  if (!documento) return;

  const container = documento.getElementById('markdown-container');
  const mainArea = documento.querySelector('.content-area');

  if (mainArea && container) {
    const docUrl = mainArea.getAttribute('data-doc');
    if (docUrl) {
      loadAndRenderMarkdown(docUrl, container);
    }
  }
}

/**
 * Configura o ciclo de vida da página, garantindo execução imediata se o DOM
 * já estiver carregado ou aguardando o evento DOMContentLoaded.
 *
 * @param {Document|null} documento - Instância do DOM.
 */
export function initMain(documento = (typeof document !== 'undefined' ? document : null)) {
  if (!documento) return;

  if (documento.readyState === 'loading') {
    documento.addEventListener('DOMContentLoaded', () => inicializarDocumento(documento));
  } else {
    inicializarDocumento(documento);
  }
}

// Inicialização automática no navegador
if (typeof document !== 'undefined') {
  initMain(document);
}
