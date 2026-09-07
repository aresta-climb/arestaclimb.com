/**
 * Módulo de Validação e Roteamento para Instalação de Certificado do Canal Beta
 * Client-Side First: Valida parâmetros de origem e impressão digital SHA-256 do certificado.
 */

export const URL_REDIRECIONAMENTO_PADRAO = '/editor/beta';

// Hashes SHA-256 autorizadas do certificado do Editor Aresta Beta
export const THUMBPRINTS_VALIDOS = new Set([
  // Hash padrão/inicial de releases do canal Beta 
  '07cb2e37f8492a84ab3c62961635074c11053a6a075aad025da2ab6d76fad068',
]);

/**
 * Processa a query string e atualiza a interface ou executa o redirecionamento
 * @param {Object} options
 * @param {string} [options.search] Query string da URL
 * @param {Document} [options.doc] Referência do documento DOM
 * @param {Window} [options.win] Referência da janela do navegador
 * @param {Set<string>} [options.thumbprintsValidos] Conjunto de hashes autorizadas
 * @returns {{ estado: 'redirecionado' | 'sucesso' | 'erro', thumbprint?: string }}
 */
export function processarParametrosCertificado({
  search = typeof window !== 'undefined' ? window.location.search : '',
  doc = typeof document !== 'undefined' ? document : null,
  win = typeof window !== 'undefined' ? window : null,
  thumbprintsValidos = THUMBPRINTS_VALIDOS,
} = {}) {
  const params = new URLSearchParams(search);
  const temOrigem = params.has('origem');
  const temThumbprint = params.has('thumbprint');

  // Cenário 1: Aberta diretamente pelo usuário sem parâmetros ou com origem inválida
  if ((!temOrigem && !temThumbprint) || params.get('origem') !== 'instalador') {
    if (win && win.location && typeof win.location.replace === 'function') {
      win.location.replace(URL_REDIRECIONAMENTO_PADRAO);
    }
    return { estado: 'redirecionado' };
  }

  const thumbprintBruto = params.get('thumbprint') || '';
  const thumbprint = thumbprintBruto.trim().toLowerCase();
  const ehValido = thumbprint.length > 0 && thumbprintsValidos.has(thumbprint);

  if (doc) {
    const loadingEl = doc.getElementById('loading-state');
    const successEl = doc.getElementById('success-state');
    const errorEl = doc.getElementById('error-state');
    const thumbSuccessEl = doc.getElementById('cert-thumbprint-display');
    const thumbErrorEl = doc.getElementById('error-thumbprint-display');

    if (loadingEl) {
      loadingEl.style.display = 'none';
    }

    if (ehValido) {
      if (successEl) successEl.style.display = 'block';
      if (errorEl) errorEl.style.display = 'none';
      if (thumbSuccessEl) thumbSuccessEl.textContent = thumbprint;
    } else {
      if (successEl) successEl.style.display = 'none';
      if (errorEl) errorEl.style.display = 'block';
      if (thumbErrorEl) thumbErrorEl.textContent = thumbprint || '(nenhuma impressão digital fornecida)';
    }
  }

  return {
    estado: ehValido ? 'sucesso' : 'erro',
    thumbprint,
  };
}

/**
 * Inicializador da página de validação de certificado
 * @param {Object} [options]
 */
export function setupCertificadoInstalado(options = {}) {
  const doc = typeof document !== 'undefined' ? document : null;
  const win = typeof window !== 'undefined' ? window : null;
  const search = win && win.location ? win.location.search : '';

  return processarParametrosCertificado({
    search,
    doc,
    win,
    ...options,
  });
}

// Inicialização automática no navegador
export function initCertificadoInstalado() {
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => setupCertificadoInstalado());
    } else {
      setupCertificadoInstalado();
    }
  }
}

initCertificadoInstalado();
