import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  STORE_LINKS,
  detectPlatform,
  getStoreUrl,
  performRedirect,
  setupAppPage,
  parseDeepLink,
  getDeepLinkUri,
} from "./appRedirect.js";

describe("appRedirect.js - Detecção de Sistema Operacional e Redirecionamento", () => {
  beforeEach(() => {
    document.body.innerHTML = [
      '<div id="download-hub">',
      '  <a id="btn-ios" href="#">App Store</a>',
      '  <a id="btn-android" href="#">Google Play</a>',
      '  <div id="qr-container"></div>',
      '  <p id="redirect-status"></p>',
      '</div>'
    ].join("");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("detectPlatform", () => {
    it("deve detectar iPhone e iPad como ios", () => {
      expect(detectPlatform("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)")).toBe("ios");
      expect(detectPlatform("Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)")).toBe("ios");
      expect(detectPlatform("Mozilla/5.0 (iPod touch; CPU iPhone OS 17_0 like Mac OS X)")).toBe("ios");
    });

    it("deve detectar dispositivos Android", () => {
      expect(detectPlatform("Mozilla/5.0 (Linux; Android 14; SM-S918B)")).toBe("android");
      expect(detectPlatform("Mozilla/5.0 (Android; Mobile; rv:40.0) Gecko/40.0 Firefox/40.0")).toBe("android");
    });

    it("deve detectar Windows, Mac, Linux e outros como desktop", () => {
      expect(detectPlatform("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")).toBe("desktop");
      expect(detectPlatform("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)")).toBe("desktop");
      expect(detectPlatform("Mozilla/5.0 (X11; Linux x86_64)")).toBe("desktop");
      expect(detectPlatform("")).toBe("desktop");
      expect(detectPlatform(null)).toBe("desktop");
    });
  });

  describe("getStoreUrl", () => {
    it("deve retornar a URL correta da loja para cada plataforma", () => {
      expect(getStoreUrl("ios")).toBe(STORE_LINKS.ios);
      expect(getStoreUrl("android")).toBe(STORE_LINKS.android);
      expect(getStoreUrl("desktop")).toBeNull();
    });
  });

  describe("performRedirect", () => {
    it("deve redirecionar imediatamente em iOS", () => {
      const mockLocation = { replace: vi.fn(), href: "" };
      const result = performRedirect("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)", mockLocation);
      
      expect(result).toBe(STORE_LINKS.ios);
      expect(mockLocation.replace).toHaveBeenCalledWith(STORE_LINKS.ios);
    });

    it("deve redirecionar imediatamente em Android", () => {
      const mockLocation = { replace: vi.fn(), href: "" };
      const result = performRedirect("Mozilla/5.0 (Linux; Android 14)", mockLocation);
      
      expect(result).toBe(STORE_LINKS.android);
      expect(mockLocation.replace).toHaveBeenCalledWith(STORE_LINKS.android);
    });

    it("não deve redirecionar em Desktop", () => {
      const mockLocation = { replace: vi.fn(), href: "" };
      const result = performRedirect("Mozilla/5.0 (Windows NT 10.0)", mockLocation);
      
      expect(result).toBeNull();
      expect(mockLocation.replace).not.toHaveBeenCalled();
    });
  });

  describe("setupAppPage", () => {
    it("deve configurar links das lojas no DOM para fallback e desktop", () => {
      setupAppPage({ userAgent: "Mozilla/5.0 (Windows NT 10.0)", autoRedirect: false });
      
      const btnIos = document.getElementById("btn-ios");
      const btnAndroid = document.getElementById("btn-android");
      
      expect(btnIos.getAttribute("href")).toBe(STORE_LINKS.ios);
      expect(btnAndroid.getAttribute("href")).toBe(STORE_LINKS.android);
    });

    it("deve acionar redirecionamento quando autoRedirect for true em dispositivo móvel", () => {
      const mockLocation = { replace: vi.fn(), href: "" };
      delete window.location;
      window.location = mockLocation;
      
      setupAppPage({ userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)", autoRedirect: true });
      
      const status = document.getElementById("redirect-status");
      expect(status.textContent).toContain("Apple App Store");
      expect(mockLocation.replace).toHaveBeenCalled();
    });

    it("deve exibir status customizado de deep link quando pathname contiver recurso", () => {
      const mockLocation = { replace: vi.fn(), href: "" };
      delete window.location;
      window.location = mockLocation;

      setupAppPage({
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)",
        autoRedirect: true,
        pathname: "/via/diedro-pacoca",
      });

      const status = document.getElementById("redirect-status");
      expect(status.textContent).toBe("Abrindo via no aplicativo Aresta Climb...");
      expect(mockLocation.replace).toHaveBeenCalledWith("aresta://via/diedro-pacoca");
    });

    it("deve inicializar via evento DOMContentLoaded quando houver download-hub", () => {
      expect(() => document.dispatchEvent(new Event("DOMContentLoaded"))).not.toThrow();
    });

    it("o QR Code gerado deve ser decodificável e apontar para https://arestaclimb.com/app", async () => {
      const sharp = (await import("sharp")).default;
      const jsQR = (await import("jsqr")).default;
      
      const { data, info } = await sharp("public/assets/qr_arestaclimb_poster.png")
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

      const code = jsQR(new Uint8ClampedArray(data), info.width, info.height);
      expect(code).not.toBeNull();
      expect(code?.data).toBe("https://arestaclimb.com/app");
    });
  });

  describe("parseDeepLink e getDeepLinkUri", () => {
    it("deve identificar corretamente rotas de via com singular e plural", () => {
      expect(parseDeepLink("/via/pedra-do-bau")).toEqual({
        tipo: "via",
        id: "pedra-do-bau",
        uri: "aresta://via/pedra-do-bau",
      });
      expect(parseDeepLink("/vias/pedra-do-bau")).toEqual({
        tipo: "via",
        id: "pedra-do-bau",
        uri: "aresta://via/pedra-do-bau",
      });
    });

    it("deve identificar rotas com prefixo /app ou /download", () => {
      expect(parseDeepLink("/app/setor/falesia-dos-olhos")).toEqual({
        tipo: "setor",
        id: "falesia-dos-olhos",
        uri: "aresta://setor/falesia-dos-olhos",
      });
      expect(parseDeepLink("/download/croqui/croqui-123")).toEqual({
        tipo: "croqui",
        id: "croqui-123",
        uri: "aresta://croqui/croqui-123",
      });
    });

    it("deve retornar null para rotas comuns sem identificador de deep link", () => {
      expect(parseDeepLink("/")).toBeNull();
      expect(parseDeepLink("/app")).toBeNull();
      expect(parseDeepLink("/download")).toBeNull();
      expect(parseDeepLink("/termos-de-uso")).toBeNull();
      expect(parseDeepLink("")).toBeNull();
      expect(parseDeepLink(null)).toBeNull();
    });

    it("getDeepLinkUri deve formatar a URI corretamente", () => {
      expect(getDeepLinkUri({ tipo: "via", id: "123" })).toBe("aresta://via/123");
      expect(getDeepLinkUri(null)).toBeNull();
    });
  });

  describe("performRedirect com Telemetria e Deep Link", () => {
    it("deve emitir telemetria de smart-redirect em dispositivo móvel", () => {
      window.umami = { track: vi.fn() };
      const mockLocation = { replace: vi.fn(), href: "" };

      performRedirect("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)", mockLocation);

      expect(window.umami.track).toHaveBeenCalledWith("smart-redirect", {
        plataforma: "ios",
        isDeepLink: false,
      });
    });

    it("deve emitir telemetria de deep-link quando pathname for rota de recurso", () => {
      window.umami = { track: vi.fn() };
      const mockLocation = { replace: vi.fn(), href: "" };

      performRedirect("Mozilla/5.0 (Linux; Android 14)", mockLocation, {
        pathname: "/via/via-do-diedro",
      });

      expect(window.umami.track).toHaveBeenCalledWith("deep-link-redirect", {
        plataforma: "android",
        tipo: "via",
        id: "via-do-diedro",
      });
      expect(mockLocation.replace).toHaveBeenCalledWith("aresta://via/via-do-diedro");
    });
  });
});
