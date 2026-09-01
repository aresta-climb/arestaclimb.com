/**
 * Lógica Interativa da Landing Page Oficial do Aresta Climb
 * Suporte a tema Dark/Light, Showcase interativo do app, FAQ expansível e Modal de QR Code.
 */

import { THEME_KEY, getPreferredTheme, setTheme, toggleTheme, initTheme } from './theme.js';
export { THEME_KEY, getPreferredTheme, setTheme, toggleTheme, initTheme };

export const SHOWCASE_ITEMS = [
  {
    id: 'croqui',
    title: 'Croqui Interativo na Foto',
    badge: 'Toque na linha e abra a via',
    description: 'Navegue visualmente pelas paredes e setores. Toque nas linhas das vias para ver o grau, proteções, fotos e histórico de conquista.',
    image: '/assets/app/croqui-interativo.png',
  },
  {
    id: 'setores',
    title: 'Explorar Setores e Picos',
    badge: 'Todos os picos organizados',
    description: 'Encontre picos de escalada esportiva, tradicional e boulders com mapas, orientações de acesso, trilha e regras do local.',
    image: '/assets/app/setor-principal.png',
  },
  {
    id: 'detalhe',
    title: 'Ficha da Via & Beta',
    badge: 'Grau, proteção e história',
    description: 'Informações detalhadas sobre extensão, tipo de rocha, número de costuras, conquistadores e recomendações de segurança.',
    image: '/assets/app/pedra-grande.png',
  },
  {
    id: 'offline',
    title: '100% Salvo Offline',
    badge: 'Disponível mesmo sem sinal',
    description: 'Baixe o pacote completo do pico antes de sair da cidade. Mapas, fotos, croquis e acessos funcionam sem internet.',
    image: '/assets/app/explorar-locais.png',
  },
];

/**
 * Alterna a aba ativa no showcase interativo
 * @param {number} index 
 * @param {NodeListOf<Element>} tabs 
 * @param {HTMLImageElement | null} imgElement 
 * @param {HTMLElement | null} badgeElement 
 */
export function selectShowcaseTab(index, tabs, imgElement, badgeElement) {
  if (!SHOWCASE_ITEMS[index]) return;
  const item = SHOWCASE_ITEMS[index];

  tabs.forEach((tab, i) => {
    if (i === index) {
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
    } else {
      tab.classList.remove('active');
      tab.setAttribute('aria-selected', 'false');
    }
  });

  if (imgElement) {
    imgElement.src = item.image;
    imgElement.alt = item.title;
    imgElement.classList.remove('fade-in');
    void imgElement.offsetWidth; // trigger reflow
    imgElement.classList.add('fade-in');
  }

  if (badgeElement) {
    badgeElement.textContent = item.badge;
  }
}

/**
 * Inicializa os controles do showcase interativo
 */
export function initShowcase() {
  const tabs = document.querySelectorAll('.showcase-tab');
  const imgElement = document.getElementById('showcase-screen');
  const badgeElement = document.getElementById('showcase-badge');

  if (!tabs.length) return;

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      selectShowcaseTab(index, tabs, imgElement, badgeElement);
    });

    tab.addEventListener('keydown', (e) => {
      let nextIndex = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        nextIndex = (index + 1) % tabs.length;
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        nextIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (e.key === 'Home') {
        nextIndex = 0;
      } else if (e.key === 'End') {
        nextIndex = tabs.length - 1;
      }

      if (nextIndex !== null) {
        e.preventDefault();
        tabs[nextIndex].focus();
        selectShowcaseTab(nextIndex, tabs, imgElement, badgeElement);
      }
    });
  });
}

/**
 * Inicializa a funcionalidade acessível de FAQ em acordeão
 */
export function initFaq() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  if (!faqQuestions.length) return;

  faqQuestions.forEach((button) => {
    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      const answerId = button.getAttribute('aria-controls');
      const answerElement = document.getElementById(answerId);

      // Fecha todos os outros itens
      faqQuestions.forEach((otherBtn) => {
        if (otherBtn !== button) {
          otherBtn.setAttribute('aria-expanded', 'false');
          const otherId = otherBtn.getAttribute('aria-controls');
          const otherAns = document.getElementById(otherId);
          if (otherAns) {
            otherAns.hidden = true;
          }
        }
      });

      // Alterna o item atual
      button.setAttribute('aria-expanded', String(!isExpanded));
      if (answerElement) {
        answerElement.hidden = isExpanded;
      }
    });
  });
}

/**
 * Inicializa o modal de QR Code no desktop
 */
export function initQrModal() {
  const openButtons = document.querySelectorAll('#open-qr-modal, .btn-open-qr');
  const closeButtons = document.querySelectorAll('#close-qr-modal, .btn-close-qr');
  const modal = document.getElementById('qr-modal');

  if (!modal) return;

  openButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.hidden = false;
    });
  });

  closeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      modal.hidden = true;
    });
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.hidden = true;
    }
  });

  // Fechar com tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) {
      modal.hidden = true;
    }
  });
}

/**
 * Inicialização completa da Landing Page
 */
export function setupLanding() {
  initTheme();
  initShowcase();
  initFaq();
  initQrModal();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupLanding);
  } else {
    setupLanding();
  }
}
