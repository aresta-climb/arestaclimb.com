import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  setupDownloadButton,
  detectDesktopPlatform,
  setupPlatformTabs,
  setupClipboardCopy,
} from './editor.js';

describe('editor.js - Landing Page Logic', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <a href="#" id="download-btn">Baixar</a>
      <div id="thank-you-msg" style="display: none;">Obrigado!</div>
    `;
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('deve exibir a mensagem de agradecimento ao clicar no botão de download e ocultar após timeout', () => {
    setupDownloadButton();

    const downloadBtn = document.getElementById('download-btn');
    const thankYouMsg = document.getElementById('thank-you-msg');

    downloadBtn.click();
    expect(thankYouMsg.style.display).toBe('block');
    expect(console.log).toHaveBeenCalledWith('Download do Editor Aresta iniciado!');

    vi.advanceTimersByTime(8000);
    expect(thankYouMsg.style.display).toBe('none');
  });

  it('não deve quebrar se os elementos de download não existirem no DOM', () => {
    document.body.innerHTML = '';
    expect(() => setupDownloadButton()).not.toThrow();
  });
});

describe('editor.js - detectDesktopPlatform', () => {
  it('deve identificar macOS quando o User Agent for desktop Apple', () => {
    const uaMacChrome = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36';
    const uaMacSafari = 'Mozilla/5.0 (Macintosh; Apple Mac OS X 14_0) AppleWebKit/605.1.15';

    expect(detectDesktopPlatform(uaMacChrome)).toBe('macos');
    expect(detectDesktopPlatform(uaMacSafari)).toBe('macos');
  });

  it('não deve identificar macOS para dispositivos móveis iOS (iPhone, iPad, iPod)', () => {
    const uaiPhone = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15';
    const uaiPad = 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15';
    const uaiPod = 'Mozilla/5.0 (iPod; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15';

    expect(detectDesktopPlatform(uaiPhone)).toBe('windows');
    expect(detectDesktopPlatform(uaiPad)).toBe('windows');
    expect(detectDesktopPlatform(uaiPod)).toBe('windows');
  });

  it('deve identificar Linux quando o User Agent for distribuição Linux desktop', () => {
    const uaUbuntu = 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0';
    const uaFedora = 'Mozilla/5.0 (X11; Fedora; Linux x86_64) AppleWebKit/537.36';
    const uaX11 = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36';

    expect(detectDesktopPlatform(uaUbuntu)).toBe('linux');
    expect(detectDesktopPlatform(uaFedora)).toBe('linux');
    expect(detectDesktopPlatform(uaX11)).toBe('linux');
  });

  it('não deve identificar Linux para dispositivos Android', () => {
    const uaAndroid = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36';
    expect(detectDesktopPlatform(uaAndroid)).toBe('windows');
  });

  it('deve retornar windows para navegadores Windows e casos não identificados ou nulos', () => {
    const uaWindows = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

    expect(detectDesktopPlatform(uaWindows)).toBe('windows');
    expect(detectDesktopPlatform('')).toBe('windows');
    expect(detectDesktopPlatform(null)).toBe('windows');
    expect(detectDesktopPlatform(undefined)).toBe('windows');
    expect(detectDesktopPlatform(123)).toBe('windows');
  });
});

describe('editor.js - setupPlatformTabs', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="platform-tabs-nav" role="tablist">
        <button role="tab" id="tab-btn-windows" aria-controls="panel-windows" aria-selected="true" class="platform-tab-btn active" data-platform="windows">
          Windows <span class="tab-badge-recomended" style="display:none">Seu sistema</span>
        </button>
        <button role="tab" id="tab-btn-macos" aria-controls="panel-macos" aria-selected="false" class="platform-tab-btn" data-platform="macos">
          macOS <span class="tab-badge-recomended" style="display:none">Seu sistema</span>
        </button>
        <button role="tab" id="tab-btn-linux" aria-controls="panel-linux" aria-selected="false" class="platform-tab-btn" data-platform="linux">
          Linux (Flatpak) <span class="tab-badge-recomended" style="display:none">Seu sistema</span>
        </button>
      </div>

      <div role="tabpanel" id="panel-windows" aria-labelledby="tab-btn-windows" class="platform-tab-panel active">
        Conteudo Windows
      </div>
      <div role="tabpanel" id="panel-macos" aria-labelledby="tab-btn-macos" class="platform-tab-panel" hidden>
        Conteudo macOS
      </div>
      <div role="tabpanel" id="panel-linux" aria-labelledby="tab-btn-linux" class="platform-tab-panel" hidden>
        Conteudo Linux
      </div>
    `;
  });

  it('não deve executar se não existirem abas no documento', () => {
    document.body.innerHTML = '';
    expect(() => setupPlatformTabs()).not.toThrow();
  });

  it('deve ativar a aba e painel Linux automaticamente quando a plataforma inicial for linux', () => {
    setupPlatformTabs('linux');

    const tabWindows = document.getElementById('tab-btn-windows');
    const tabLinux = document.getElementById('tab-btn-linux');
    const panelWindows = document.getElementById('panel-windows');
    const panelLinux = document.getElementById('panel-linux');

    expect(tabLinux.getAttribute('aria-selected')).toBe('true');
    expect(tabLinux.classList.contains('active')).toBe(true);
    expect(panelLinux.hasAttribute('hidden')).toBe(false);

    expect(tabWindows.getAttribute('aria-selected')).toBe('false');
    expect(tabWindows.classList.contains('active')).toBe(false);
    expect(panelWindows.hasAttribute('hidden')).toBe(true);

    const badgeLinux = tabLinux.querySelector('.tab-badge-recomended');
    expect(badgeLinux.style.display).not.toBe('none');
  });

  it('deve alternar para a aba macOS quando o usuário clicar nela', () => {
    setupPlatformTabs('windows');

    const tabMac = document.getElementById('tab-btn-macos');
    const panelMac = document.getElementById('panel-macos');
    const panelWindows = document.getElementById('panel-windows');

    tabMac.click();

    expect(tabMac.getAttribute('aria-selected')).toBe('true');
    expect(tabMac.classList.contains('active')).toBe(true);
    expect(panelMac.hasAttribute('hidden')).toBe(false);
    expect(panelWindows.hasAttribute('hidden')).toBe(true);
  });

  it('deve suportar navegação por teclado com ArrowRight, ArrowLeft, Home e End', () => {
    setupPlatformTabs('windows');

    const tabWindows = document.getElementById('tab-btn-windows');
    const tabMac = document.getElementById('tab-btn-macos');
    const tabLinux = document.getElementById('tab-btn-linux');

    // ArrowRight: Windows -> macOS
    tabWindows.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(tabMac.getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement).toBe(tabMac);

    // End: vai para a última aba (Linux)
    tabMac.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    expect(tabLinux.getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement).toBe(tabLinux);

    // ArrowLeft: Linux -> macOS
    tabLinux.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    expect(tabMac.getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement).toBe(tabMac);

    // Home: vai para a primeira aba (Windows)
    tabMac.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    expect(tabWindows.getAttribute('aria-selected')).toBe('true');
    expect(document.activeElement).toBe(tabWindows);
  });
});

describe('editor.js - setupClipboardCopy', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="terminal-command-box">
        <code id="flatpak-install-cmd">flatpak install https://serving.arestaclimb.com/flatpak/com.arestaclimb.Editor.flatpakref</code>
        <button id="btn-copy-flatpak" class="btn-copy-cmd" data-clipboard-target="#flatpak-install-cmd">
          <span class="btn-copy-text">Copiar</span>
        </button>
      </div>
    `;

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('deve copiar o comando para o clipboard e alterar temporariamente o texto do botão', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    setupClipboardCopy();

    const btn = document.getElementById('btn-copy-flatpak');
    const copyText = btn.querySelector('.btn-copy-text');

    btn.click();
    await Promise.resolve();

    expect(writeTextMock).toHaveBeenCalledWith(
      'flatpak install https://serving.arestaclimb.com/flatpak/com.arestaclimb.Editor.flatpakref'
    );
    expect(copyText.textContent).toBe('✓ Copiado!');
    expect(btn.classList.contains('copied')).toBe(true);

    vi.advanceTimersByTime(2500);
    expect(copyText.textContent).toBe('Copiar');
    expect(btn.classList.contains('copied')).toBe(false);
  });

  it('deve usar o fallback de document.execCommand quando navigator.clipboard não existir', async () => {
    Object.assign(navigator, { clipboard: undefined });
    document.execCommand = vi.fn().mockReturnValue(true);

    setupClipboardCopy();

    const btn = document.getElementById('btn-copy-flatpak');
    const copyText = btn.querySelector('.btn-copy-text');

    btn.click();
    await Promise.resolve();

    expect(document.execCommand).toHaveBeenCalledWith('copy');
    expect(copyText.textContent).toBe('✓ Copiado!');
  });

  it('deve tratar exceções graciosamente quando a cópia falhar', async () => {
    const writeTextMock = vi.fn().mockRejectedValue(new Error('Permissão negada'));
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    setupClipboardCopy();

    const btn = document.getElementById('btn-copy-flatpak');
    btn.click();
    await Promise.resolve();

    expect(warnSpy).toHaveBeenCalled();
  });

  it('não deve fazer nada se o elemento alvo não for encontrado ou estiver vazio', () => {
    document.body.innerHTML = `
      <button id="btn-empty" class="btn-copy-cmd" data-clipboard-target="#nao-existe">Copiar</button>
    `;

    setupClipboardCopy();
    const btn = document.getElementById('btn-empty');
    expect(() => btn.click()).not.toThrow();
  });
});

describe('editor.js - DOMContentLoaded listener', () => {
  it('deve inicializar todos os componentes no DOMContentLoaded', () => {
    document.body.innerHTML = `
      <a href="#" id="download-btn">Baixar</a>
      <div id="thank-you-msg" style="display: none;">Obrigado!</div>
    `;
    expect(() => document.dispatchEvent(new Event('DOMContentLoaded'))).not.toThrow();
  });
});
