/**
 * Módulo de Telemetria Client-Side para o ecossistema Aresta Climb.
 * Integração resiliente, sem cookies e orientada à privacidade com Umami Analytics.
 */

/**
 * Dispara um evento customizado de telemetria para o Umami de forma resiliente.
 * @param {string} eventName - Nome semântico do evento
 * @param {Record<string, any>} [eventData] - Propriedades adicionais anônimas do evento
 * @returns {boolean} Retorna true se o evento foi despachado com sucesso, false caso contrário
 */
export function trackEvent(eventName, eventData) {
  if (!eventName || typeof eventName !== 'string' || eventName.trim() === '') {
    return false;
  }

  if (typeof window !== 'undefined' && window.umami && typeof window.umami.track === 'function') {
    try {
      window.umami.track(eventName, eventData);
      return true;
    } catch {
      return false;
    }
  }

  return false;
}

/**
 * Registra a visualização de uma página de forma anônima.
 * @param {string} [url] - Caminho ou URL da página
 * @param {string} [referrer] - Origem/referência do acesso
 * @returns {boolean}
 */
export function trackPageView(url, referrer) {
  if (typeof window !== 'undefined' && window.umami && typeof window.umami.track === 'function') {
    try {
      const currentUrl = url !== undefined ? url : (window.location ? window.location.pathname + window.location.search : '');
      const currentReferrer = referrer !== undefined ? referrer : (typeof document !== 'undefined' ? document.referrer : '');
      const pageData = {
        url: currentUrl,
        referrer: currentReferrer,
      };
      window.umami.track(pageData);
      return true;
    } catch {
      return false;
    }
  }

  return false;
}

/**
 * Extrai todos os atributos `data-umami-event-*` de um elemento HTML como um objeto chave-valor.
 * @param {Element | null} element
 * @returns {Record<string, string>}
 */
export function extractEventData(element) {
  if (!element || !element.attributes) {
    return {};
  }

  const data = {};
  for (const attr of element.attributes) {
    if (attr.name.startsWith('data-umami-event-')) {
      const key = attr.name.replace('data-umami-event-', '');
      data[key] = attr.value;
    }
  }
  return data;
}

/**
 * Configura o listener de clique global para elementos com atributos declarativos `data-umami-event`.
 * @param {Element | Document} [rootElement]
 */
export function setupDeclarativeTracking(rootElement = (typeof document !== 'undefined' ? document : null)) {
  if (!rootElement || typeof rootElement.addEventListener !== 'function') {
    return;
  }

  rootElement.addEventListener('click', (event) => {
    const target = event.target;
    if (!target || typeof target.closest !== 'function') {
      return;
    }

    const eventEl = target.closest('[data-umami-event]');
    if (!eventEl) {
      return;
    }

    const eventName = eventEl.getAttribute('data-umami-event');
    if (eventName) {
      const eventData = extractEventData(eventEl);
      trackEvent(eventName, eventData);
    }
  });
}

/**
 * Inicializa os serviços de telemetria da página.
 * @param {{ autoTrackPageView?: boolean, rootElement?: Element | Document }} [options]
 */
export function initTelemetry(options = {}) {
  const root = options.rootElement || (typeof document !== 'undefined' ? document : null);
  setupDeclarativeTracking(root);

  if (options.autoTrackPageView) {
    trackPageView();
  }
}

if (typeof document !== 'undefined') {
  initTelemetry();
}
