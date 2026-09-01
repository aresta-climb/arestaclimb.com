import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  THEME_KEY,
  getPreferredTheme,
  setTheme,
  toggleTheme,
  initTheme,
} from "./theme.js";

describe("theme.js - Módulo Centralizado de Tema", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    document.body.innerHTML = `
      <button id="themeToggle" class="theme-toggle">◐</button>
    `;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("deve carregar light por padrão", () => {
    expect(getPreferredTheme()).toBe("light");
  });

  it("deve salvar e aplicar o tema", () => {
    setTheme("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(localStorage.getItem(THEME_KEY)).toBe("dark");
  });

  it("deve alternar entre temas corretamente", () => {
    expect(toggleTheme("light")).toBe("dark");
    expect(toggleTheme("dark")).toBe("light");
  });

  it("deve ser idempotente (não registrar múltiplos ouvintes se chamado mais de uma vez)", () => {
    initTheme();
    initTheme(); // Segunda chamada intencional

    const btn = document.getElementById("themeToggle");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");

    // Clique único deve alternar para dark e permanecer em dark (sem duplo clique acidental)
    btn.click();
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");

    btn.click();
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });
});
