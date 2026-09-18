import { STORE_LINKS } from './appRedirect.js';

/**
 * Lista de rotas reservadas do site que não devem ser tratadas como deep links de croquis.
 */
export const ROTAS_RESERVADAS = [
  '',
  '/',
  '/404',
  '/404.html',
  '/app',
  '/download',
  '/editor',
  '/contato',
  '/comunidade',
  '/termos-de-uso',
  '/politica-de-privacidade',
  '/politica-de-privacidade-editor',
  '/privacidade-contribuidores',
  '/termos-de-uso-fixlog',
  '/politica-de-privacidade-fixlog'
];

/**
 * Converte um slug técnico em nome legível para exibição pública.
 * Suporta detecção de padrão geográfico de picos brasileiros (ex: br_mg_igarape_pedra_grande).
 *
 * @param {string} slug - O slug a ser formatado.
 * @returns {string} Nome formatado com capitalização correta.
 */
export function formatarSlug(slug) {
  if (!slug || typeof slug !== 'string') {
    return '';
  }

  // Tratamento de prefixos geográficos de pico: br_uf_municipio_nome
  const matchGeo = slug.match(/^([a-z]{2})_([a-z]{2})_(.+)$/i);
  if (matchGeo) {
    const uf = matchGeo[2].toUpperCase();
    const partes = matchGeo[3]
      .split('_')
      .filter(Boolean)
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase());
    return `${partes.join(' ')} (${uf})`;
  }

  return slug
    .split('_')
    .filter(Boolean)
    .map((palavra) => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Verifica se uma rota requisitada no navegador corresponde a um deep link de croqui.
 *
 * @param {string} pathname - Caminho da URL atual.
 * @param {string} [hostname=''] - Domínio da requisição.
 * @returns {boolean} True se a rota for um deep link.
 */
export function detectarDeepLink(pathname, hostname = '') {
  if (!pathname || typeof pathname !== 'string') {
    return false;
  }

  const cleanPath = pathname.replace(/\/+$/, '') || '/';
  if (ROTAS_RESERVADAS.includes(cleanPath)) {
    return false;
  }

  const segmentos = pathname.split('/').filter(Boolean);
  const ehHostApp = Boolean(hostname && (hostname === 'app.arestaclimb.com' || hostname.startsWith('app.')));
  const ehPadraoPico = segmentos.length > 0 && segmentos[0].startsWith('br_');

  return ehHostApp || ehPadraoPico;
}

/**
 * Decompõe o caminho da URL em metadados estruturados do croqui.
 *
 * @param {string} pathname - Caminho da URL a ser analisado.
 * @returns {object} Metadados com tipos, títulos e trilha de ancestrais.
 */
export function extrairInfoDeepLink(pathname) {
  const segmentos = (pathname || '').split('/').filter(Boolean);

  if (segmentos.length === 0) {
    return {
      ehDeepLink: false,
      tipo: null,
      picoSlug: null,
      grupoSlug: null,
      setorSlug: null,
      viaSlug: null,
      titulo: '',
      trilha: []
    };
  }

  const picoSlug = segmentos[0];
  let grupoSlug = null;
  let setorSlug = null;
  let viaSlug = null;
  let tipo = 'pico';

  if (segmentos.length === 1) {
    tipo = 'pico';
  } else if (segmentos.length === 2) {
    tipo = 'setor';
    setorSlug = segmentos[1];
  } else if (segmentos.length === 3) {
    tipo = 'setor';
    grupoSlug = segmentos[1];
    setorSlug = segmentos[2];
  } else {
    tipo = 'via';
    grupoSlug = segmentos[1];
    setorSlug = segmentos[2];
    viaSlug = segmentos[3];
  }

  const trilha = [
    formatarSlug(picoSlug),
    grupoSlug ? formatarSlug(grupoSlug) : '',
    setorSlug ? formatarSlug(setorSlug) : '',
    viaSlug ? formatarSlug(viaSlug) : ''
  ].filter(Boolean);

  const titulo = viaSlug
    ? formatarSlug(viaSlug)
    : setorSlug
      ? formatarSlug(setorSlug)
      : formatarSlug(picoSlug);

  return {
    ehDeepLink: true,
    tipo,
    picoSlug,
    grupoSlug,
    setorSlug,
    viaSlug,
    titulo,
    trilha
  };
}

/**
 * Renderiza o cartão visual com as informações do setor/via e links das lojas oficiais.
 *
/**
 * Formata a URL para abertura direta no aplicativo nativo via custom scheme (aresta://).
 *
 * @param {string} url - URL HTTPS original.
 * @returns {string} URI com esquema aresta://.
 */
export function formatarUrlAberturaApp(url) {
  if (!url || typeof url !== 'string') return '';
  return url.replace(/^https?:\/\//i, 'aresta://');
}

/**
 * Renderiza o cartão visual de fallback de setor/via com links para download ou abertura no aplicativo.
 *
 * @param {HTMLElement|null} elementoAlvo - Elemento HTML container.
 * @param {object} info - Objeto retornado por extrairInfoDeepLink.
 * @param {string} [urlOriginal=''] - URL completa requisitada.
 */
export function renderizarCardSetor(elementoAlvo, info, urlOriginal = '') {
  if (!elementoAlvo) return;

  const trilhaHtml = (info.trilha || [])
    .map((item, index) => {
      const ehUltimo = index === (info.trilha || []).length - 1;
      return ehUltimo
        ? `<span class="breadcrumb-current">${item}</span>`
        : `<span class="breadcrumb-item">${item}</span>`;
    })
    .join(' &rsaquo; ');

  const tipoLabel =
    info.tipo === 'via'
      ? 'Via de Escalada'
      : info.tipo === 'setor'
        ? 'Setor de Croqui'
        : 'Pico de Escalada';

  const urlApp = formatarUrlAberturaApp(urlOriginal);

  elementoAlvo.innerHTML = `
    <div class="sector-fallback-card glass-panel">
      <div class="eyebrow mono" style="color: var(--accent); margin-bottom: 8px;">ARESTA CLIMB · ${tipoLabel.toUpperCase()}</div>
      <div class="breadcrumb-trail" style="margin-bottom: 12px; font-size: 0.85rem; color: var(--muted);">${trilhaHtml}</div>
      <h1 class="sector-title" style="font-size: clamp(28px, 4vw, 40px); margin: 0 0 16px; line-height: 1.1;">${info.titulo}</h1>
      <p class="sector-desc" style="color: var(--muted); max-width: 540px; margin: 0 auto 28px; line-height: 1.5;">
        Você acessou este croqui diretamente. Para visualizar as fotos de parede, linhas de vias, graduações e utilizar a navegação 100% offline na rocha, baixe o aplicativo Aresta Climb no seu aparelho.
      </p>

      <div class="download-buttons" style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; margin-bottom: 24px;">
        <a id="btn-ios-fallback" href="${STORE_LINKS.ios}" target="_blank" rel="noopener" class="store-badge" aria-label="Baixar na Apple App Store">
          <svg viewBox="0 0 384 512" style="width: 24px; height: 24px; fill: currentColor;"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
          <span class="store-badge-text">
            <small>Baixar na</small>
            <strong>App Store</strong>
          </span>
        </a>

        <a id="btn-android-fallback" href="${STORE_LINKS.android}" target="_blank" rel="noopener" class="store-badge" aria-label="Baixar no Google Play">
          <svg viewBox="0 0 512 512" style="width: 24px; height: 24px; fill: currentColor;"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/></svg>
          <span class="store-badge-text">
            <small>Disponível no</small>
            <strong>Google Play</strong>
          </span>
        </a>
      </div>

      ${urlApp ? `
        <div style="font-size: 0.85rem; color: var(--muted);">
          Já possui o app instalado? <a id="link-abrir-app" href="${urlApp}" style="color: var(--accent); font-weight: 600;">Toque aqui para abrir no aplicativo</a>
        </div>
      ` : ''}
    </div>
  `;

  elementoAlvo.style.display = 'block';
}

/**
 * Inicializa a interceptação de fallback no documento.
 * Se a URL for um deep link, oculta a tela 404 e exibe o cartão informativo com links das lojas.
 *
 * @param {Document} [documento=document] - Objeto Document da página.
 * @param {Window} [navegador=window] - Objeto Window com location.
 * @returns {boolean} True se a interceptação de deep link foi ativada.
 */
export function inicializarFallback(documento = (typeof document !== 'undefined' ? document : null), navegador = (typeof window !== 'undefined' ? window : null)) {
  if (!documento || !navegador || !navegador.location) {
    return false;
  }

  const ehDeepLink = detectarDeepLink(navegador.location.pathname, navegador.location.hostname);
  if (!ehDeepLink) {
    return false;
  }

  const info = extrairInfoDeepLink(navegador.location.pathname);

  // Oculta o conteúdo 404 padrão se existir
  const notFoundPadrao = documento.getElementById('not-found-default');
  if (notFoundPadrao) {
    notFoundPadrao.style.display = 'none';
  }

  // Localiza ou cria dinamicamente o container de fallback
  let fallbackContainer = documento.getElementById('fallback-container');
  if (!fallbackContainer) {
    fallbackContainer = documento.createElement('div');
    fallbackContainer.id = 'fallback-container';
    const containerPrincipal = documento.getElementById('app-container') || documento.querySelector('.app-container') || documento.body;
    containerPrincipal.appendChild(fallbackContainer);
  }

  renderizarCardSetor(fallbackContainer, info, navegador.location.href);
  return true;
}
