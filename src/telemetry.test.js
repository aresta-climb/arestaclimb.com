import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  trackEvent,
  trackPageView,
  setupDeclarativeTracking,
  initTelemetry,
  extractEventData,
} from "./telemetry.js";

describe("telemetry.js - Módulo de Telemetria Client-Side (Umami)", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    delete window.umami;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("trackEvent", () => {
    it("deve chamar window.umami.track com nome e dados do evento quando umami estiver disponível", () => {
      const mockTrack = vi.fn();
      window.umami = { track: mockTrack };

      const result = trackEvent("download-click", { plataforma: "ios" });

      expect(mockTrack).toHaveBeenCalledWith("download-click", { plataforma: "ios" });
      expect(result).toBe(true);
    });

    it("deve chamar window.umami.track apenas com o nome do evento quando não houver dados", () => {
      const mockTrack = vi.fn();
      window.umami = { track: mockTrack };

      const result = trackEvent("visualizou-qr");

      expect(mockTrack).toHaveBeenCalledWith("visualizou-qr", undefined);
      expect(result).toBe(true);
    });

    it("não deve lançar erro e deve retornar false se window.umami não estiver definido", () => {
      expect(() => {
        const result = trackEvent("download-click", { plataforma: "android" });
        expect(result).toBe(false);
      }).not.toThrow();
    });

    it("não deve lançar erro se window.umami.track lançar uma exceção", () => {
      window.umami = {
        track: vi.fn(() => {
          throw new Error("Falha no transporte de rede");
        }),
      };

      expect(() => {
        const result = trackEvent("download-click");
        expect(result).toBe(false);
      }).not.toThrow();
    });

    it("não deve disparar evento se o nome do evento for inválido ou vazio", () => {
      const mockTrack = vi.fn();
      window.umami = { track: mockTrack };

      expect(trackEvent("")).toBe(false);
      expect(trackEvent(null)).toBe(false);
      expect(trackEvent(undefined)).toBe(false);
      expect(mockTrack).not.toHaveBeenCalled();
    });
  });

  describe("trackPageView", () => {
    it("deve chamar window.umami.track para registrar pageview quando disponível", () => {
      const mockTrack = vi.fn();
      window.umami = { track: mockTrack };

      const result = trackPageView("/app", "https://google.com");

      expect(mockTrack).toHaveBeenCalledWith({ url: "/app", referrer: "https://google.com" });
      expect(result).toBe(true);
    });

    it("deve usar window.location e document.referrer como padrão se não fornecidos", () => {
      const mockTrack = vi.fn();
      window.umami = { track: mockTrack };

      const result = trackPageView();

      expect(mockTrack).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it("deve retornar false se window.umami não estiver disponível", () => {
      expect(trackPageView()).toBe(false);
    });
  });

  describe("extractEventData", () => {
    it("deve extrair atributos data-umami-event-* do elemento como objeto", () => {
      const element = document.createElement("button");
      element.setAttribute("data-umami-event", "download-click");
      element.setAttribute("data-umami-event-plataforma", "android");
      element.setAttribute("data-umami-event-origem", "hero");

      const data = extractEventData(element);

      expect(data).toEqual({
        plataforma: "android",
        origem: "hero",
      });
    });

    it("deve retornar objeto vazio se o elemento não tiver atributos data-umami-event-*", () => {
      const element = document.createElement("a");
      element.setAttribute("data-umami-event", "contato");

      const data = extractEventData(element);

      expect(data).toEqual({});
    });

    it("deve retornar objeto vazio se elemento for nulo ou inválido", () => {
      expect(extractEventData(null)).toEqual({});
    });
  });

  describe("setupDeclarativeTracking", () => {
    it("deve interceptar clique em elemento com data-umami-event e disparar trackEvent", () => {
      const mockTrack = vi.fn();
      window.umami = { track: mockTrack };

      document.body.innerHTML = `
        <div id="container">
          <button id="btn-teste" data-umami-event="click-cta" data-umami-event-tipo="primario">
            Clique Aqui
          </button>
        </div>
      `;

      setupDeclarativeTracking(document.body);

      const btn = document.getElementById("btn-teste");
      btn.click();

      expect(mockTrack).toHaveBeenCalledWith("click-cta", { tipo: "primario" });
    });

    it("deve interceptar clique em elemento filho de um elemento com data-umami-event", () => {
      const mockTrack = vi.fn();
      window.umami = { track: mockTrack };

      document.body.innerHTML = `
        <a id="link-parent" href="#" data-umami-event="download-app" data-umami-event-loja="appstore">
          <span id="icone-filho">Ícone</span>
        </a>
      `;

      setupDeclarativeTracking(document.body);

      const icone = document.getElementById("icone-filho");
      icone.click();

      expect(mockTrack).toHaveBeenCalledWith("download-app", { loja: "appstore" });
    });

    it("não deve disparar trackEvent se o elemento clicado não tiver data-umami-event", () => {
      const mockTrack = vi.fn();
      window.umami = { track: mockTrack };

      document.body.innerHTML = '<button id="btn-normal">Sem evento</button>';

      setupDeclarativeTracking(document.body);

      document.getElementById("btn-normal").click();

      expect(mockTrack).not.toHaveBeenCalled();
    });
  });

  describe("initTelemetry", () => {
    it("deve configurar rastreamento declarativo e disparar pageview inicial quando habilitado", () => {
      const mockTrack = vi.fn();
      window.umami = { track: mockTrack };

      document.body.innerHTML = '<button id="btn-auto" data-umami-event="auto-evento"></button>';

      initTelemetry({ autoTrackPageView: true });

      expect(mockTrack).toHaveBeenCalled();

      document.getElementById("btn-auto").click();
      expect(mockTrack).toHaveBeenCalledWith("auto-evento", {});
    });

    it("não deve disparar pageview inicial se autoTrackPageView for falso", () => {
      const mockTrack = vi.fn();
      window.umami = { track: mockTrack };

      initTelemetry({ autoTrackPageView: false });

      expect(mockTrack).not.toHaveBeenCalled();
    });

    it("deve tratar exceção lançada em trackPageView e retornar false", () => {
      window.umami = {
        track: vi.fn(() => {
          throw new Error("Erro de pageview");
        }),
      };

      expect(trackPageView()).toBe(false);
    });

    it("setupDeclarativeTracking não deve falhar com rootElement inválido ou nulo", () => {
      expect(() => setupDeclarativeTracking(null)).not.toThrow();
      expect(() => setupDeclarativeTracking({})).not.toThrow();
    });

    it("setupDeclarativeTracking deve ignorar cliques quando target não possui closest", () => {
      const mockRoot = {
        addEventListener: vi.fn((event, handler) => {
          handler({ target: {} });
        }),
      };

      expect(() => setupDeclarativeTracking(mockRoot)).not.toThrow();
    });

    it("não deve disparar trackEvent se data-umami-event for vazio", () => {
      const mockTrack = vi.fn();
      window.umami = { track: mockTrack };

      document.body.innerHTML = '<button id="btn-vazio" data-umami-event="">Vazio</button>';

      setupDeclarativeTracking(document.body);

      document.getElementById("btn-vazio").click();

      expect(mockTrack).not.toHaveBeenCalled();
    });

    it("initTelemetry deve aceitar rootElement customizado nas opções", () => {
      const customRoot = document.createElement("div");
      customRoot.innerHTML = '<button id="btn-custom" data-umami-event="custom-ev"></button>';
      document.body.appendChild(customRoot);

      const mockTrack = vi.fn();
      window.umami = { track: mockTrack };

      initTelemetry({ rootElement: customRoot });

      document.getElementById("btn-custom").click();
      expect(mockTrack).toHaveBeenCalledWith("custom-ev", {});
    });
  });
});
