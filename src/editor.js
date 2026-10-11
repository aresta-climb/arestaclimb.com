import './editor.css';
import './theme.js';
import './telemetry.js';

export function setupDownloadButton() {
  const downloadBtn = document.getElementById('download-btn');
  const thankYouMsg = document.getElementById('thank-you-msg');

  if (downloadBtn && thankYouMsg) {
    downloadBtn.addEventListener('click', () => {
      console.log('Download do Editor Aresta iniciado!');
      thankYouMsg.style.display = 'block';
      setTimeout(() => {
        thankYouMsg.style.display = 'none';
      }, 8000);
    });
  }
}

/**
 * Detecta o sistema operacional do visitante para seleção automática da aba
 * @param {string} [userAgent]
 * @returns {'windows' | 'macos' | 'linux'}
 */
export function detectDesktopPlatform(userAgent = (typeof navigator !== 'undefined' ? navigator.userAgent : '')) {
  if (!userAgent || typeof userAgent !== 'string') {
    return 'windows';
  }

  const ua = userAgent.toLowerCase();

  // macOS (exclui dispositivos móveis iOS: iPhone, iPad, iPod)
  if (/macintosh|mac os x/i.test(ua) && !/iphone|ipad|ipod/i.test(ua)) {
    return 'macos';
  }

  // Linux (exclui Android)
  if (/linux|x11/i.test(ua) && !/android/i.test(ua)) {
    return 'linux';
  }

  return 'windows';
}

/**
 * Inicializa a navegação por abas com suporte WAI-ARIA e teclado
 * @param {string} [initialPlatform]
 */
export function setupPlatformTabs(initialPlatform) {
  const tabs = Array.from(document.querySelectorAll('.platform-tab-btn[role="tab"]'));
  const panels = Array.from(document.querySelectorAll('.platform-tab-panel[role="tabpanel"]'));

  if (!tabs.length || !panels.length) return;

  const targetPlatform = initialPlatform || detectDesktopPlatform();

  function activateTab(tabToActivate, shouldFocus = false) {
    const platform = tabToActivate.getAttribute('data-platform');

    tabs.forEach((tab) => {
      const isSelected = tab === tabToActivate;
      tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      tab.classList.toggle('active', isSelected);
      tab.setAttribute('tabindex', isSelected ? '0' : '-1');
    });

    panels.forEach((panel) => {
      const panelId = panel.getAttribute('id');
      const isMatching = panelId === `panel-${platform}`;
      if (isMatching) {
        panel.removeAttribute('hidden');
        panel.classList.add('active');
      } else {
        panel.setAttribute('hidden', '');
        panel.classList.remove('active');
      }
    });

    if (shouldFocus) {
      tabToActivate.focus();
    }
  }

  // Encontra a aba recomendada
  let activeTab = tabs.find((t) => t.getAttribute('data-platform') === targetPlatform) || tabs[0];

  // Exibe a tag de recomendação na aba detectada
  if (activeTab) {
    const badge = activeTab.querySelector('.tab-badge-recomended');
    if (badge) {
      badge.style.display = 'inline-flex';
    }
  }

  // Ativa a aba inicial
  activateTab(activeTab);

  // Registra eventos de clique e teclado
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      activateTab(tab);
    });

    tab.addEventListener('keydown', (e) => {
      let targetIndex = null;
      if (e.key === 'ArrowRight') {
        targetIndex = (index + 1) % tabs.length;
      } else if (e.key === 'ArrowLeft') {
        targetIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (e.key === 'Home') {
        targetIndex = 0;
      } else if (e.key === 'End') {
        targetIndex = tabs.length - 1;
      }

      if (targetIndex !== null) {
        e.preventDefault();
        activateTab(tabs[targetIndex], true);
      }
    });
  });
}

/**
 * Configura o botão de cópia do comando de terminal para a área de transferência
 */
export function setupClipboardCopy() {
  const copyButtons = document.querySelectorAll('.btn-copy-cmd');

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const targetSelector = btn.getAttribute('data-clipboard-target');
      const targetEl = targetSelector ? document.querySelector(targetSelector) : null;
      const textToCopy = targetEl ? targetEl.textContent.trim() : '';

      if (!textToCopy) return;

      try {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          const tempInput = document.createElement('textarea');
          tempInput.value = textToCopy;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }

        const textSpan = btn.querySelector('.btn-copy-text');
        if (textSpan) {
          const originalText = textSpan.textContent;
          textSpan.textContent = '✓ Copiado!';
          btn.classList.add('copied');

          setTimeout(() => {
            textSpan.textContent = originalText;
            btn.classList.remove('copied');
          }, 2500);
        }
      } catch (err) {
        console.warn('Não foi possível copiar o texto automaticamente:', err);
      }
    });
  });
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    setupDownloadButton();
    setupPlatformTabs();
    setupClipboardCopy();
  });
}
