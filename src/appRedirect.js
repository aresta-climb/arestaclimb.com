import './theme.js';
import { trackEvent } from './telemetry.js';

/**
 * Roteamento e Redirecionamento Inteligente para Download do Aplicativo Aresta Climb
 * Detecta o sistema operacional do dispositivo no navegador (Client-Side),
 * emite telemetria cookieless, resolve deep links e redireciona para o aplicativo nativo
 * ou para as respectivas lojas de aplicativos.
 */

export const STORE_LINKS = {
  // Links oficiais das lojas de produção
  ios: 'https://apps.apple.com/app/id6776467893',
  android: 'https://play.google.com/store/apps/details?id=app.escalada.croquis',
  whatsapp: 'https://chat.whatsapp.com/JmxWeLSmGTT66AREtrKyjA',
};

/**
 * Normaliza e analisa se um caminho de URL corresponde a um deep link de recurso do aplicativo.
 * Suporta formatos como /via/:id, /vias/:id, /setor/:id, /setores/:id, /croqui/:id, /croquis/:id, /pico/:id, /picos/:id
 * @param {string | null} pathname
 * @returns {{ tipo: string, id: string, uri: string } | null}
 */
export function parseDeepLink(pathname) {
  if (!pathname || typeof pathname !== 'string') {
    return null;
  }

  // Remove prefixos de rotas conhecidas como /app ou /download
  const cleaned = pathname.replace(/^\/(app|download)/, '');
  const match = cleaned.match(/^\/?(via|vias|setor|setores|croqui|croquis|pico|picos)\/([a-zA-Z0-9_-]+)/i);

  if (!match) {
    return null;
  }

  const rawType = match[1].toLowerCase();
  const id = match[2];

  // Normaliza o tipo para o singular
  const tipoMap = {
    via: 'via',
    vias: 'via',
    setor: 'setor',
    setores: 'setor',
    croqui: 'croqui',
    croquis: 'croqui',
    pico: 'pico',
    picos: 'pico',
  };

  const tipo = tipoMap[rawType] || rawType;
  const uri = `aresta://${tipo}/${id}`;

  return { tipo, id, uri };
}

/**
 * Retorna a URI customizada do deep link nativo do aplicativo
 * @param {{ tipo: string, id: string } | null} deepLinkInfo
 * @returns {string | null}
 */
export function getDeepLinkUri(deepLinkInfo) {
  if (!deepLinkInfo || !deepLinkInfo.tipo || !deepLinkInfo.id) {
    return null;
  }
  return `aresta://${deepLinkInfo.tipo}/${deepLinkInfo.id}`;
}

/**
 * Identifica a plataforma do usuário baseada no User Agent
 * @param {string} userAgent 
 * @returns {'ios' | 'android' | 'desktop'}
 */
export function detectPlatform(userAgent) {
  if (!userAgent || typeof userAgent !== 'string') {
    return 'desktop';
  }

  const ua = userAgent.toLowerCase();

  // iOS (iPhone, iPad, iPod)
  if (/iphone|ipad|ipod/.test(ua)) {
    return 'ios';
  }

  // Android
  if (/android/.test(ua)) {
    return 'android';
  }

  return 'desktop';
}

/**
 * Retorna a URL da loja compatível com a plataforma
 * @param {'ios' | 'android' | 'desktop'} platform 
 * @returns {string | null}
 */
export function getStoreUrl(platform) {
  if (platform === 'ios') return STORE_LINKS.ios;
  if (platform === 'android') return STORE_LINKS.android;
  return null;
}

/**
 * Executa o redirecionamento instantâneo se for dispositivo móvel,
 * despachando evento analítico antes da navegação.
 * @param {string} [userAgent]
 * @param {Location} [locationObj]
 * @param {{ pathname?: string }} [options]
 * @returns {string | null}
 */
export function performRedirect(
  userAgent = (typeof navigator !== 'undefined' ? navigator.userAgent : ''),
  locationObj = (typeof window !== 'undefined' ? window.location : null),
  options = {}
) {
  const platform = detectPlatform(userAgent);
  const pathname = options.pathname || (typeof window !== 'undefined' && window.location ? window.location.pathname : '');
  const deepLink = parseDeepLink(pathname);

  if (platform === 'ios' || platform === 'android') {
    let targetUrl;

    if (deepLink) {
      trackEvent('deep-link-redirect', {
        plataforma: platform,
        tipo: deepLink.tipo,
        id: deepLink.id,
      });
      targetUrl = deepLink.uri;
    } else {
      trackEvent('smart-redirect', {
        plataforma: platform,
        isDeepLink: false,
      });
      targetUrl = getStoreUrl(platform);
    }

    if (targetUrl && locationObj && typeof locationObj.replace === 'function') {
      try {
        locationObj.replace(targetUrl);
      } catch {
        if ('href' in locationObj) {
          locationObj.href = targetUrl;
        }
      }
      return targetUrl;
    }
  }

  return null;
}

/**
 * Configura os elementos visuais na página /app e dispara redirecionamento inteligente
 * @param {{ userAgent?: string, autoRedirect?: boolean, pathname?: string }} [options]
 */
export function setupAppPage(options = {}) {
  const userAgent = options.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : '');
  const autoRedirect = options.autoRedirect !== undefined ? options.autoRedirect : true;
  const pathname = options.pathname || (typeof window !== 'undefined' && window.location ? window.location.pathname : '');
  const deepLink = parseDeepLink(pathname);

  const btnIos = document.getElementById('btn-ios');
  const btnAndroid = document.getElementById('btn-android');
  const btnWhatsapp = document.getElementById('btn-whatsapp');
  const redirectStatus = document.getElementById('redirect-status');

  if (btnIos) btnIos.setAttribute('href', STORE_LINKS.ios);
  if (btnAndroid) btnAndroid.setAttribute('href', STORE_LINKS.android);
  if (btnWhatsapp) btnWhatsapp.setAttribute('href', STORE_LINKS.whatsapp);

  if (autoRedirect) {
    const platform = detectPlatform(userAgent);
    if (platform === 'ios' || platform === 'android') {
      if (redirectStatus) {
        if (deepLink) {
          redirectStatus.textContent = `Abrindo ${deepLink.tipo} no aplicativo Aresta Climb...`;
        } else {
          redirectStatus.textContent = `Redirecionando para a ${platform === 'ios' ? 'Apple App Store' : 'Google Play Store'}...`;
        }
      }
      performRedirect(userAgent, (typeof window !== 'undefined' ? window.location : null), { pathname });
    }
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Apenas inicializa se estiver na página de app/download ou subdomínio app
    if (
      document.getElementById('download-hub') ||
      window.location?.pathname?.includes('/app') ||
      window.location?.pathname?.includes('/download') ||
      window.location?.hostname?.startsWith('app.')
    ) {
      setupAppPage();
    }
  });
}
