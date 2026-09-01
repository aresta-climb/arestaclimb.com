import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  STORE_LINKS,
  detectPlatform,
  getStoreUrl,
  performRedirect,
  setupAppPage,
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
});
