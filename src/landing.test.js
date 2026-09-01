import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  THEME_KEY,
  getPreferredTheme,
  setTheme,
  toggleTheme,
  initTheme,
  SHOWCASE_ITEMS,
  selectShowcaseTab,
  initShowcase,
  initFaq,
  initQrModal,
  setupLanding,
} from "./landing.js";

describe("landing.js - Lógica e Interatividade da Landing Page", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    document.body.innerHTML = `
      <button id="themeToggle" aria-label="Alternar tema">◐</button>

      <div class="showcase-section">
        <div class="showcase-tabs">
          <button class="showcase-tab active" data-index="0">01 Croqui</button>
          <button class="showcase-tab" data-index="1">02 Setores</button>
          <button class="showcase-tab" data-index="2">03 Ficha</button>
          <button class="showcase-tab" data-index="3">04 Offline</button>
        </div>
        <div class="showcase-phone">
          <img id="showcase-screen" src="/assets/app/croqui-interativo.png" alt="Tela do App">
          <span id="showcase-badge">Croqui Interativo</span>
        </div>
      </div>

      <div class="faq-list">
        <div class="faq-item">
          <button class="faq-question" aria-expanded="false" aria-controls="faq-ans-1">
            <span>O Aresta funciona offline?</span>
          </button>
          <div id="faq-ans-1" class="faq-answer" hidden>
            <p>Sim, 100% offline após baixar.</p>
          </div>
        </div>
        <div class="faq-item">
          <button class="faq-question" aria-expanded="false" aria-controls="faq-ans-2">
            <span>O app é gratuito?</span>
          </button>
          <div id="faq-ans-2" class="faq-answer" hidden>
            <p>Sim, acesso gratuito aos croquis publicados.</p>
          </div>
        </div>
      </div>

      <button id="open-qr-modal">Escanear QR Code</button>
      <div id="qr-modal" class="modal" hidden>
        <div class="modal-content">
          <button id="close-qr-modal">Fechar</button>
          <img src="/assets/qr_arestaclimb.svg" alt="QR Code">
        </div>
      </div>
    `;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Gerenciamento de Tema (Dark / Light)", () => {
    it("deve identificar o tema padrão como light quando não houver preferência", () => {
      expect(getPreferredTheme()).toBe("light");
    });

    it("deve carregar tema salvo do localStorage", () => {
      localStorage.setItem(THEME_KEY, "dark");
      expect(getPreferredTheme()).toBe("dark");
    });

    it("deve aplicar o tema no data-theme do elemento raiz e salvar no localStorage", () => {
      setTheme("dark");
      expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
      expect(localStorage.getItem(THEME_KEY)).toBe("dark");

      setTheme("light");
      expect(document.documentElement.getAttribute("data-theme")).toBe("light");
      expect(localStorage.getItem(THEME_KEY)).toBe("light");
    });

    it("deve alternar entre light e dark via toggleTheme", () => {
      expect(toggleTheme("light")).toBe("dark");
      expect(toggleTheme("dark")).toBe("light");
    });

    it("deve inicializar o tema e responder ao clique no botão de alternância", () => {
      initTheme();
      const themeBtn = document.getElementById("themeToggle");
      
      expect(document.documentElement.getAttribute("data-theme")).toBe("light");

      themeBtn.click();
      expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
      expect(localStorage.getItem(THEME_KEY)).toBe("dark");

      themeBtn.click();
      expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    });
  });

  describe("Showcase Interativo do Aplicativo", () => {
    it("deve conter definições dos itens do showcase", () => {
      expect(SHOWCASE_ITEMS.length).toBeGreaterThanOrEqual(4);
      expect(SHOWCASE_ITEMS[0].title).toBeDefined();
      expect(SHOWCASE_ITEMS[0].image).toBeDefined();
    });

    it("deve alternar a aba ativa e atualizar a imagem do mockup", () => {
      const tabs = document.querySelectorAll(".showcase-tab");
      const img = document.getElementById("showcase-screen");
      const badge = document.getElementById("showcase-badge");

      selectShowcaseTab(1, tabs, img, badge);

      expect(tabs[1].classList.contains("active")).toBe(true);
      expect(tabs[0].classList.contains("active")).toBe(false);
      expect(img.getAttribute("src")).toBe(SHOWCASE_ITEMS[1].image);
    });

    it("deve inicializar o showcase e responder ao clique nas abas", () => {
      initShowcase();
      const tabs = document.querySelectorAll(".showcase-tab");
      const img = document.getElementById("showcase-screen");

      tabs[2].click();
      expect(tabs[2].classList.contains("active")).toBe(true);
      expect(img.getAttribute("src")).toBe(SHOWCASE_ITEMS[2].image);
    });

    it("deve permitir navegação por teclado nas abas (ArrowDown, ArrowUp, Home, End)", () => {
      initShowcase();
      const tabs = document.querySelectorAll(".showcase-tab");
      const img = document.getElementById("showcase-screen");

      // ArrowDown no tab 0 -> tab 1
      tabs[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
      expect(tabs[1].classList.contains("active")).toBe(true);
      expect(img.getAttribute("src")).toBe(SHOWCASE_ITEMS[1].image);

      // ArrowUp no tab 1 -> tab 0
      tabs[1].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
      expect(tabs[0].classList.contains("active")).toBe(true);

      // End -> último tab
      tabs[0].dispatchEvent(new KeyboardEvent("keydown", { key: "End" }));
      expect(tabs[tabs.length - 1].classList.contains("active")).toBe(true);

      // Home -> primeiro tab
      tabs[tabs.length - 1].dispatchEvent(new KeyboardEvent("keydown", { key: "Home" }));
      expect(tabs[0].classList.contains("active")).toBe(true);
    });
  });

  describe("FAQ Interativo em Acordeão", () => {
    it("deve expandir e retrair itens do FAQ com acessibilidade WAI-ARIA", () => {
      initFaq();
      const firstQuestion = document.querySelectorAll(".faq-question")[0];
      const firstAnswer = document.getElementById("faq-ans-1");

      expect(firstQuestion.getAttribute("aria-expanded")).toBe("false");
      expect(firstAnswer.hidden).toBe(true);

      firstQuestion.click();
      expect(firstQuestion.getAttribute("aria-expanded")).toBe("true");
      expect(firstAnswer.hidden).toBe(false);

      firstQuestion.click();
      expect(firstQuestion.getAttribute("aria-expanded")).toBe("false");
      expect(firstAnswer.hidden).toBe(true);
    });

    it("deve fechar outros itens abertos quando um novo item for acionado", () => {
      initFaq();
      const questions = document.querySelectorAll(".faq-question");
      const ans1 = document.getElementById("faq-ans-1");
      const ans2 = document.getElementById("faq-ans-2");

      questions[0].click();
      expect(ans1.hidden).toBe(false);
      expect(ans2.hidden).toBe(true);

      questions[1].click();
      expect(ans1.hidden).toBe(true);
      expect(ans2.hidden).toBe(false);
    });
  });

  describe("Modal / Popover de QR Code no Desktop", () => {
    it("deve abrir e fechar o modal de QR Code", () => {
      initQrModal();
      const openBtn = document.getElementById("open-qr-modal");
      const closeBtn = document.getElementById("close-qr-modal");
      const modal = document.getElementById("qr-modal");

      expect(modal.hidden).toBe(true);

      openBtn.click();
      expect(modal.hidden).toBe(false);

      closeBtn.click();
      expect(modal.hidden).toBe(true);
    });

    it("deve fechar o modal de QR Code ao clicar fora do conteúdo", () => {
      initQrModal();
      const openBtn = document.getElementById("open-qr-modal");
      const modal = document.getElementById("qr-modal");

      openBtn.click();
      expect(modal.hidden).toBe(false);

      modal.click();
      expect(modal.hidden).toBe(true);
    });

    it("deve fechar o modal de QR Code ao pressionar a tecla Escape", () => {
      initQrModal();
      const openBtn = document.getElementById("open-qr-modal");
      const modal = document.getElementById("qr-modal");

      openBtn.click();
      expect(modal.hidden).toBe(false);

      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      expect(modal.hidden).toBe(true);
    });

    it("deve identificar preferência de cor do sistema prefers-color-scheme dark", () => {
      window.matchMedia = vi.fn().mockImplementation(query => ({
        matches: query === "(prefers-color-scheme: dark)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
      }));

      expect(getPreferredTheme()).toBe("dark");
    });
  });

  describe("setupLanding inicialização completa", () => {
    it("deve inicializar todos os módulos sem erros", () => {
      expect(() => setupLanding()).not.toThrow();
    });

    it("deve lidar com ausência de elementos no DOM com segurança", () => {
      document.body.innerHTML = "<div>Página vazia</div>";
      expect(() => setupLanding()).not.toThrow();
    });
  });
});
