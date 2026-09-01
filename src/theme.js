/**
 * Módulo Universal de Tema (Dark / Light) do Aresta Climb
 * Gerenciamento centralizado, idempotente e com persistência no localStorage.
 */

export const THEME_KEY = 'aresta-theme';

/**
 * Identifica o tema preferido do usuário
 * @returns {'light' | 'dark'}
 */
export function getPreferredTheme() {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
  }

  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
}

/**
 * Aplica o tema na tag <html> e armazena a preferência
 * @param {'light' | 'dark'} theme 
 */
export function setTheme(theme) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
  }
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(THEME_KEY, theme);
  }
}

/**
 * Alterna entre temas
 * @param {'light' | 'dark'} currentTheme 
 * @returns {'light' | 'dark'}
 */
export function toggleTheme(currentTheme) {
  return currentTheme === 'dark' ? 'light' : 'dark';
}

/**
 * Inicializa e vincula o evento de clique ao botão #themeToggle (Idempotente)
 */
export function initTheme() {
  const current = getPreferredTheme();
  setTheme(current);

  const themeButtons = document.querySelectorAll('#themeToggle, .theme-toggle');
  themeButtons.forEach(btn => {
    if (btn.dataset.themeBound) return; // Evita ouvintes duplicados
    btn.dataset.themeBound = 'true';

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const active = document.documentElement.getAttribute('data-theme') || 'light';
      const next = toggleTheme(active);
      setTheme(next);
    });
  });
}

// Aplicação imediata se executado no navegador
if (typeof document !== 'undefined') {
  const initialTheme = getPreferredTheme();
  document.documentElement.setAttribute('data-theme', initialTheme);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }
}
