import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  extrairConfiguracaoDsnSentry,
  ehErroDeRedeOffline,
  extrairQuadrosPilhaNavegador,
  enviarExcecaoSentryWeb,
  inicializarMonitoramentoErrosSentry,
} from "./telemetria.js";

describe("telemetria.js - Monitoramento de Exceções Client-Side (Sentry Envelope)", () => {
  beforeEach(() => {
    delete window.__ARESTA_SENTRY_DSN__;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("extrairConfiguracaoDsnSentry", () => {
    it("deve retornar null para DSN vazio, nulo ou inválido", () => {
      expect(extrairConfiguracaoDsnSentry("")).toBeNull();
      expect(extrairConfiguracaoDsnSentry(null)).toBeNull();
      expect(extrairConfiguracaoDsnSentry("nao-e-url")).toBeNull();
      expect(extrairConfiguracaoDsnSentry("https://sentry.io/123")).toBeNull();
      expect(extrairConfiguracaoDsnSentry("https://chave@sentry.io/")).toBeNull();
    });

    it("deve extrair urlEnvelope, idProjeto e chavePublica de um DSN válido", () => {
      const config = extrairConfiguracaoDsnSentry(
        "https://chavePub123@o456.ingest.us.sentry.io/7890"
      );
      expect(config).toEqual({
        chavePublica: "chavePub123",
        idProjeto: "7890",
        urlEnvelope:
          "https://o456.ingest.us.sentry.io/api/7890/envelope/?sentry_key=chavePub123&sentry_version=7&sentry_client=aresta-web%2F1.0.0",
      });
    });
  });

  describe("ehErroDeRedeOffline", () => {
    it("deve retornar true quando o navegador estiver offline e o erro for de falha de rede", () => {
      expect(ehErroDeRedeOffline(new TypeError("Failed to fetch"), false)).toBe(true);
      expect(ehErroDeRedeOffline("NetworkError when attempting to fetch resource", false)).toBe(true);
      expect(ehErroDeRedeOffline({ message: "Load failed" }, false)).toBe(true);
    });

    it("deve retornar false quando o navegador estiver online ou quando o erro for de lógica JavaScript", () => {
      expect(ehErroDeRedeOffline(new TypeError("Failed to fetch"), true)).toBe(false);
      expect(ehErroDeRedeOffline(new ReferenceError("variavelNaoDefinida is not defined"), false)).toBe(false);
      expect(ehErroDeRedeOffline(null, false)).toBe(false);
    });
  });

  describe("extrairQuadrosPilhaNavegador", () => {
    it("deve retornar lista vazia para pilha vazia ou sem formato reconhecido", () => {
      expect(extrairQuadrosPilhaNavegador("")).toEqual([]);
      expect(extrairQuadrosPilhaNavegador(null)).toEqual([]);
      expect(extrairQuadrosPilhaNavegador("Linha sem formato de stack")).toEqual([]);
    });

    it("deve extrair quadros nos padrões V8/Chrome e Firefox/Safari", () => {
      const pilha = [
        "TypeError: Falha ao abrir modal",
        "    at abrirModal (https://arestaclimb.com/src/landing.js:42:15)",
        "    at https://arestaclimb.com/src/landing.js:88:5",
        "renderizarCroqui@https://arestaclimb.com/src/editor.js:120:9",
        "@https://arestaclimb.com/src/editor.js:200:3",
      ].join("\n");

      const quadros = extrairQuadrosPilhaNavegador(pilha);
      expect(quadros.length).toBe(4);
      expect(quadros[3]).toEqual({
        function: "abrirModal",
        filename: "https://arestaclimb.com/src/landing.js",
        lineno: 42,
        colno: 15,
        in_app: true,
      });
      expect(quadros[2]).toEqual({
        function: "<anonymous>",
        filename: "https://arestaclimb.com/src/landing.js",
        lineno: 88,
        colno: 5,
        in_app: true,
      });
      expect(quadros[1]).toEqual({
        function: "renderizarCroqui",
        filename: "https://arestaclimb.com/src/editor.js",
        lineno: 120,
        colno: 9,
        in_app: true,
      });
      expect(quadros[0]).toEqual({
        function: "<anonymous>",
        filename: "https://arestaclimb.com/src/editor.js",
        lineno: 200,
        colno: 3,
        in_app: true,
      });
    });
  });

  describe("enviarExcecaoSentryWeb", () => {
    it("deve operar em modo no-op (retornando false) quando nenhum DSN estiver configurado", async () => {
      const fetchSpy = vi.fn();
      const enviado = await enviarExcecaoSentryWeb(new Error("Erro sem DSN"), {
        dsn: "",
        fetchImpl: fetchSpy,
      });
      expect(enviado).toBe(false);
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it("deve ignorar erros de fetch quando o navegador estiver offline (navigator.onLine === false)", async () => {
      const fetchSpy = vi.fn();
      const enviado = await enviarExcecaoSentryWeb(new TypeError("Failed to fetch"), {
        dsn: "https://pub123@o1.ingest.sentry.io/99",
        estaOnline: false,
        fetchImpl: fetchSpy,
      });
      expect(enviado).toBe(false);
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it("deve enviar envelope para o Sentry quando DSN for válido e erro for uma instância de Error ou string", async () => {
      const chamadas = [];
      const fetchFake = vi.fn(async (url, init) => {
        chamadas.push({ url, init });
        return { ok: true, status: 200 };
      });

      const erro = new TypeError("Cannot read properties of null");
      erro.stack = "TypeError: Cannot read properties of null\n    at initShowcase (https://arestaclimb.com/src/landing.js:79:12)";

      const enviado = await enviarExcecaoSentryWeb(erro, {
        dsn: "https://pub123@o1.ingest.sentry.io/99",
        servico: "aresta-web",
        ambiente: "production",
        urlPagina: "https://arestaclimb.com/editor",
        userAgent: "Mozilla/5.0 Test",
        estaOnline: true,
        fetchImpl: fetchFake,
      });

      expect(enviado).toBe(true);
      expect(chamadas.length).toBe(1);
      expect(chamadas[0].url).toContain("https://o1.ingest.sentry.io/api/99/envelope/");
      expect(chamadas[0].init.method).toBe("POST");

      const linhas = chamadas[0].init.body.split("\n");
      const itemEvento = JSON.parse(linhas[2]);
      expect(itemEvento.tags.service).toBe("aresta-web");
      expect(itemEvento.environment).toBe("production");
      expect(itemEvento.request.url).toBe("https://arestaclimb.com/editor");
      expect(itemEvento.exception.values[0].type).toBe("TypeError");
      expect(itemEvento.exception.values[0].value).toBe("Cannot read properties of null");
      expect(itemEvento.exception.values[0].stacktrace.frames.length).toBe(1);
    });

    it("deve enviar envelope para erro em formato de string sem stacktrace e tratar falha de rede no próprio fetch do Sentry", async () => {
      const fetchQueFalha = vi.fn(async () => {
        throw new Error("Sentry indisponível");
      });

      const enviadoFalha = await enviarExcecaoSentryWeb("Rejeição textual", {
        dsn: "https://pub123@o1.ingest.sentry.io/99",
        estaOnline: true,
        fetchImpl: fetchQueFalha,
      });
      expect(enviadoFalha).toBe(false);

      const fetchOk = vi.fn(async () => ({ ok: true, status: 200 }));
      const enviadoString = await enviarExcecaoSentryWeb("Rejeição simples", {
        dsn: "https://pub123@o1.ingest.sentry.io/99",
        estaOnline: true,
        fetchImpl: fetchOk,
      });
      expect(enviadoString).toBe(true);
    });
  });

  describe("inicializarMonitoramentoErrosSentry", () => {
    it("deve registrar listeners de error e unhandledrejection e despachar eventos ao Sentry", async () => {
      const envelopes = [];
      const fetchFake = vi.fn(async (url, init) => {
        envelopes.push({ url, body: init.body });
        return { ok: true, status: 200 };
      });

      window.__ARESTA_SENTRY_DSN__ = "https://pub999@o1.ingest.sentry.io/777";

      const remover = inicializarMonitoramentoErrosSentry({
        servico: "aresta-web",
        fetchImpl: fetchFake,
      });

      // Dispara evento de erro global com objeto error
      const eventoErro = new ErrorEvent("error", {
        error: new Error("Exceção global capturada"),
        message: "Exceção global capturada",
      });
      window.dispatchEvent(eventoErro);

      // Dispara evento de erro global apenas com message (sem objeto error)
      const eventoErroMensagem = new ErrorEvent("error", {
        message: "Erro de script sem objeto",
      });
      window.dispatchEvent(eventoErroMensagem);

      // Dispara unhandledrejection
      const eventoRejeicao = new CustomEvent("unhandledrejection");
      Object.defineProperty(eventoRejeicao, "reason", {
        value: new Error("Promise rejeitada sem catch"),
      });
      window.dispatchEvent(eventoRejeicao);

      await new Promise((r) => setTimeout(r, 10));

      expect(envelopes.length).toBe(3);

      remover();
    });

    it("deve retornar função no-op quando alvoGlobal não suportar addEventListener", () => {
      const remover = inicializarMonitoramentoErrosSentry({ alvoGlobal: null });
      expect(typeof remover).toBe("function");
      expect(() => remover()).not.toThrow();
    });
  });
});
