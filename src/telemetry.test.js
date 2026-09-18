import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  trackEvent,
  trackPageView,
  setupDeclarativeTracking,
  setupAutoLinkTracking,
  classifyLink,
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

  describe("setupAutoLinkTracking", () => {
    it("deve rastrear links externos como 'link-externo' com url, dominio e texto", () => {
      const mockTrack = vi.fn();
      window.umami = { track: mockTrack };

      document.body.innerHTML = `
        <a id="link-ext" href="https://instagram.com/arestaclimb" target="_blank">
          Siga nosso Instagram
        </a>
      `;

      setupAutoLinkTracking(document.body);

      document.getElementById("link-ext").click();

      expect(mockTrack).toHaveBeenCalledWith("link-externo", {
        url: "https://instagram.com/arestaclimb",
        dominio: "instagram.com",
        texto: "Siga nosso Instagram",
      });
    });

    it("deve rastrear links internos como 'link-interno' com destino e texto", () => {
      const mockTrack = vi.fn();
      window.umami = { track: mockTrack };

      document.body.innerHTML = `
        <a id="link-int" href="/download">
          Ir para Download
        </a>
      `;

      setupAutoLinkTracking(document.body);

      document.getElementById("link-int").click();

      expect(mockTrack).toHaveBeenCalledWith("link-interno", {
        destino: "/download",
        texto: "Ir para Download",
      });
    });

    it("deve rastrear links de âncora na mesma página como 'link-ancora'", () => {
      const mockTrack = vi.fn();
      window.umami = { track: mockTrack };

      document.body.innerHTML = `
        <a id="link-anc" href="#como-funciona">
          Como Funciona
        </a>
      `;

      setupAutoLinkTracking(document.body);

      document.getElementById("link-anc").click();

      expect(mockTrack).toHaveBeenCalledWith("link-ancora", {
        ancora: "#como-funciona",
        texto: "Como Funciona",
      });
    });

    it("deve rastrear links de email mailto: como 'contato-email'", () => {
      const mockTrack = vi.fn();
      window.umami = { track: mockTrack };

      document.body.innerHTML = `
        <a id="link-mail" href="mailto:contato@arestaclimb.com">
          Envie um e-mail
        </a>
      `;

      setupAutoLinkTracking(document.body);

      document.getElementById("link-mail").click();

      expect(mockTrack).toHaveBeenCalledWith("contato-email", {
        email: "contato@arestaclimb.com",
        texto: "Envie um e-mail",
      });
    });

    it("deve rastrear links de telefone tel: como 'contato-telefone'", () => {
      const mockTrack = vi.fn();
      window.umami = { track: mockTrack };

      document.body.innerHTML = `
        <a id="link-tel" href="tel:+5511999999999">
          Ligue agora
        </a>
      `;

      setupAutoLinkTracking(document.body);

      document.getElementById("link-tel").click();

      expect(mockTrack).toHaveBeenCalledWith("contato-telefone", {
        telefone: "+5511999999999",
        texto: "Ligue agora",
      });
    });

    it("deve rastrear downloads de arquivos estáticos como 'download-arquivo'", () => {
      const mockTrack = vi.fn();
      window.umami = { track: mockTrack };

      document.body.innerHTML = `
        <a id="link-pdf" href="/arquivos/manual-usuario.pdf">
          Baixar Manual em PDF
        </a>
      `;

      setupAutoLinkTracking(document.body);

      document.getElementById("link-pdf").click();

      expect(mockTrack).toHaveBeenCalledWith("download-arquivo", {
        url: "/arquivos/manual-usuario.pdf",
        texto: "Baixar Manual em PDF",
      });
    });

    it("NÃO deve disparar rastreamento genérico se o link já possui data-umami-event (evitar duplicatas)", () => {
      const mockTrack = vi.fn();
      window.umami = { track: mockTrack };

      const container = document.createElement("div");
      container.innerHTML = `
        <a id="link-custom" href="https://chat.whatsapp.com/123" data-umami-event="join-whatsapp" data-umami-event-origem="footer">
          Entrar no WhatsApp
        </a>
      `;

      setupDeclarativeTracking(container);
      setupAutoLinkTracking(container);

      container.querySelector("#link-custom").click();

      // Deve ter sido chamado apenas pelo declarative tracking com 'join-whatsapp'
      expect(mockTrack).toHaveBeenCalledTimes(1);
      expect(mockTrack).toHaveBeenCalledWith("join-whatsapp", { origem: "footer" });
    });

    it("deve ignorar links vazios, com '#' puro ou 'javascript:'", () => {
      const mockTrack = vi.fn();
      window.umami = { track: mockTrack };

      document.body.innerHTML = `
        <a id="link-vazio" href="">Vazio</a>
        <a id="link-hash" href="#">Apenas Hash</a>
        <a id="link-js" href="javascript:void(0)">JS</a>
      `;

      setupAutoLinkTracking(document.body);

      document.getElementById("link-vazio").click();
      document.getElementById("link-hash").click();
      document.getElementById("link-js").click();

      expect(mockTrack).not.toHaveBeenCalled();
    });

    it("deve funcionar quando o clique ocorre em um elemento interno (ex: span/ícone) do link", () => {
      const mockTrack = vi.fn();
      window.umami = { track: mockTrack };

      document.body.innerHTML = `
        <a id="link-com-filho" href="https://github.com/aresta-climb">
          <span id="icone-filho">GitHub</span>
        </a>
      `;

      setupAutoLinkTracking(document.body);

      document.getElementById("icone-filho").click();

      expect(mockTrack).toHaveBeenCalledWith("link-externo", {
        url: "https://github.com/aresta-climb",
        dominio: "github.com",
        texto: "GitHub",
      });
    });

    it("não deve quebrar se rootElement for nulo ou inválido", () => {
      expect(() => setupAutoLinkTracking(null)).not.toThrow();
      expect(() => setupAutoLinkTracking({})).not.toThrow();
    });

    it("setupAutoLinkTracking deve ignorar cliques quando target não possui closest", () => {
      const mockRoot = {
        addEventListener: vi.fn((event, handler) => {
          handler({ target: {} });
        }),
      };

      expect(() => setupAutoLinkTracking(mockRoot)).not.toThrow();
    });
  });

  describe("classifyLink", () => {
    it("deve retornar null se elemento for inválido ou não tiver atributo href", () => {
      expect(classifyLink(null)).toBeNull();
      expect(classifyLink({})).toBeNull();
      const div = document.createElement("div");
      expect(classifyLink(div)).toBeNull();
    });

    it("deve retornar link-ancora quando URL é o mesmo pathname mas possui hash", () => {
      const a = document.createElement("a");
      a.setAttribute("href", "/index.html#recursos");
      a.textContent = "Recursos";

      const classified = classifyLink(a, "http://localhost:3000", "/index.html");
      expect(classified).toEqual({
        eventName: "link-ancora",
        eventData: {
          ancora: "#recursos",
          texto: "Recursos",
        },
      });
    });

    it("deve retornar null se URL for inválida e lançar exceção", () => {
      const a = document.createElement("a");
      a.setAttribute("href", "http://[invalid-url");
      expect(classifyLink(a)).toBeNull();
    });
  });
});
