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
 * Analisa e classifica um elemento de link para telemetria automática.
 * @param {HTMLAnchorElement | Element} linkEl
 * @param {string} [currentOrigin]
 * @param {string} [currentPathname]
 * @returns {{ eventName: string, eventData: Record<string, any> } | null}
 */
export function classifyLink(
  linkEl,
  currentOrigin = (typeof window !== 'undefined' && window.location ? window.location.origin : ''),
  currentPathname = (typeof window !== 'undefined' && window.location ? window.location.pathname : '')
) {
  if (!linkEl || typeof linkEl.getAttribute !== 'function') {
    return null;
  }

  const href = linkEl.getAttribute('href');
  if (!href || typeof href !== 'string') {
    return null;
  }

  const trimmedHref = href.trim();
  if (!trimmedHref || trimmedHref === '#' || trimmedHref.toLowerCase().startsWith('javascript:')) {
    return null;
  }

  const texto = (linkEl.textContent || '')
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, 80) || (linkEl.getAttribute('aria-label') || linkEl.getAttribute('title') || '');

  // 1. Protocolos especiais (mailto, tel)
  if (trimmedHref.toLowerCase().startsWith('mailto:')) {
    return {
      eventName: 'contato-email',
      eventData: {
        email: trimmedHref.replace(/^mailto:/i, ''),
        ...(texto ? { texto } : {}),
      },
    };
  }

  if (trimmedHref.toLowerCase().startsWith('tel:')) {
    return {
      eventName: 'contato-telefone',
      eventData: {
        telefone: trimmedHref.replace(/^tel:/i, ''),
        ...(texto ? { texto } : {}),
      },
    };
  }

  // 2. Links de âncora (#secao)
  if (trimmedHref.startsWith('#')) {
    return {
      eventName: 'link-ancora',
      eventData: {
        ancora: trimmedHref,
        ...(texto ? { texto } : {}),
      },
    };
  }

  // 3. Download de arquivos estáticos
  const isDownload = /\.(pdf|apk|zip|ipa|dmg|exe|csv|xlsx|json)$/i.test(trimmedHref.split('?')[0]);
  if (isDownload) {
    return {
      eventName: 'download-arquivo',
      eventData: {
        url: trimmedHref,
        ...(texto ? { texto } : {}),
      },
    };
  }

  // 4. Links externos vs internos
  try {
    const base = currentOrigin || 'http://localhost';
    const parsedUrl = new URL(trimmedHref, base);

    if (currentOrigin && parsedUrl.origin !== currentOrigin) {
      return {
        eventName: 'link-externo',
        eventData: {
          url: trimmedHref,
          dominio: parsedUrl.hostname,
          ...(texto ? { texto } : {}),
        },
      };
    }

    if (parsedUrl.pathname === currentPathname && parsedUrl.hash) {
      return {
        eventName: 'link-ancora',
        eventData: {
          ancora: parsedUrl.hash,
          ...(texto ? { texto } : {}),
        },
      };
    }

    return {
      eventName: 'link-interno',
      eventData: {
        destino: trimmedHref,
        ...(texto ? { texto } : {}),
      },
    };
  } catch {
    return null;
  }
}

const declarativeRoots = new WeakSet();
const autoLinkRoots = new WeakSet();

/**
 * Configura o listener de clique global para elementos com atributos declarativos `data-umami-event`.
 * @param {Element | Document} [rootElement]
 */
export function setupDeclarativeTracking(rootElement = (typeof document !== 'undefined' ? document : null)) {
  if (!rootElement || typeof rootElement.addEventListener !== 'function') {
    return;
  }

  if (declarativeRoots.has(rootElement)) {
    return;
  }
  declarativeRoots.add(rootElement);

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
 * Configura o listener global para capturar automaticamente cliques em quaisquer links <a>.
 * @param {Element | Document} [rootElement]
 */
export function setupAutoLinkTracking(rootElement = (typeof document !== 'undefined' ? document : null)) {
  if (!rootElement || typeof rootElement.addEventListener !== 'function') {
    return;
  }

  if (autoLinkRoots.has(rootElement)) {
    return;
  }
  autoLinkRoots.add(rootElement);

  rootElement.addEventListener('click', (event) => {
    const target = event.target;
    if (!target || typeof target.closest !== 'function') {
      return;
    }

    const link = target.closest('a[href]');
    if (!link) {
      return;
    }

    // Se o elemento ou seu link já possui rastreamento declarativo customizado, ignora para evitar duplicatas
    if (link.closest('[data-umami-event]')) {
      return;
    }

    const classified = classifyLink(link);
    if (classified) {
      trackEvent(classified.eventName, classified.eventData);
    }
  });
}

/**
 * Inicializa os serviços de telemetria da página.
 * @param {{ autoTrackPageView?: boolean, autoTrackLinks?: boolean, rootElement?: Element | Document }} [options]
 */
export function initTelemetry(options = {}) {
  const root = options.rootElement || (typeof document !== 'undefined' ? document : null);
  setupDeclarativeTracking(root);

  if (options.autoTrackLinks !== false) {
    setupAutoLinkTracking(root);
  }

  if (options.autoTrackPageView) {
    trackPageView();
  }
}

if (typeof document !== 'undefined') {
  initTelemetry();
}

