import './theme.js';
/**
 * Roteamento e Redirecionamento Inteligente para Download do Aplicativo Aresta Climb
 * Detecta o sistema operacional do dispositivo no navegador (Client-Side)
 * e redireciona para a respectiva loja de aplicativos ou exibe o QR Code no desktop.
 */

export const STORE_LINKS = {
  // Substitua com os links finais das lojas de produção
  ios: 'https://apps.apple.com/app/aresta-climb/id6742398507',
  android: 'https://play.google.com/store/apps/details?id=com.arestaclimb.app',
  whatsapp: 'https://chat.whatsapp.com/JmxWeLSmGTT66AREtrKyjA',
};

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
 * Executa o redirecionamento instantâneo se for dispositivo móvel
 * @param {string} [userAgent]
 * @param {Location} [locationObj]
 * @returns {string | null}
 */
export function performRedirect(userAgent = (typeof navigator !== 'undefined' ? navigator.userAgent : ''), locationObj = (typeof window !== 'undefined' ? window.location : null)) {
  const platform = detectPlatform(userAgent);
  const targetUrl = getStoreUrl(platform);

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

  return null;
}

/**
 * Configura os elementos visuais na página /app
 * @param {{ userAgent?: string, autoRedirect?: boolean }} [options]
 */
export function setupAppPage(options = {}) {
  const userAgent = options.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : '');
  const autoRedirect = options.autoRedirect !== undefined ? options.autoRedirect : true;

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
        redirectStatus.textContent = `Redirecionando para a ${platform === 'ios' ? 'Apple App Store' : 'Google Play Store'}...`;
      }
      performRedirect(userAgent);
    }
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Apenas inicializa se estiver na página de app/download
    if (document.getElementById('download-hub') || window.location?.pathname?.includes('/app') || window.location?.pathname?.includes('/download')) {
      setupAppPage();
    }
  });
}
