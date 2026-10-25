import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  extrairConfiguracaoDsnSentry,
  ehErroDeRedeOffline,
  extrairQuadrosPilhaNavegador,
  extrairImagensDebugMeta,
  enviarExcecaoSentryWeb,
  inicializarMonitoramentoErrosSentry,
} from "./telemetria.js";

describe("telemetria.js - Monitoramento de Exceções Client-Side (Sentry Envelope)", () => {
  beforeEach(() => {
    delete window.__ARESTA_SENTRY_DSN__;
    delete window._sentryDebugIds;
    delete window._debugIds;
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

  describe("extrairImagensDebugMeta", () => {
    it("deve retornar lista vazia quando o objeto global não contiver _sentryDebugIds nem _debugIds", () => {
      const quadros = [{ filename: "https://arestaclimb.com/assets/landing.js" }];
      expect(extrairImagensDebugMeta(quadros, {})).toEqual([]);
      expect(extrairImagensDebugMeta(quadros, null)).toEqual([]);
    });

    it("deve retornar lista vazia quando quadros da exceção forem vazios ou nulos", () => {
      const globalObj = {
        _sentryDebugIds: {
          "Error\n    at https://arestaclimb.com/assets/landing.js:1:1": "uuid-123",
        },
      };
      expect(extrairImagensDebugMeta([], globalObj)).toEqual([]);
      expect(extrairImagensDebugMeta(null, globalObj)).toEqual([]);
    });

    it("deve mapear pilhas V8 e Firefox/Safari associando debug_id ao code_file correto", () => {
      const globalObj = {
        _sentryDebugIds: {
          "Error\n    at https://arestaclimb.com/assets/landing.js:1:1": "uuid-landing-v8",
          "landingInit@https://arestaclimb.com/assets/editor.js:2:5": "uuid-editor-fx",
        },
      };

      const quadros = [
        { filename: "https://arestaclimb.com/assets/landing.js" },
        { filename: "https://arestaclimb.com/assets/editor.js" },
      ];

      const imagens = extrairImagensDebugMeta(quadros, globalObj);
      expect(imagens).toEqual([
        {
          type: "sourcemap",
          code_file: "https://arestaclimb.com/assets/landing.js",
          debug_id: "uuid-landing-v8",
        },
        {
          type: "sourcemap",
          code_file: "https://arestaclimb.com/assets/editor.js",
          debug_id: "uuid-editor-fx",
        },
      ]);
    });

    it("deve deduplicar entradas quando múltiplos quadros pertencerem ao mesmo arquivo", () => {
      const globalObj = {
        _sentryDebugIds: {
          "Error\n    at https://arestaclimb.com/assets/landing.js:1:1": "uuid-landing",
        },
      };

      const quadros = [
        { filename: "https://arestaclimb.com/assets/landing.js" },
        { filename: "https://arestaclimb.com/assets/landing.js" },
      ];

      const imagens = extrairImagensDebugMeta(quadros, globalObj);
      expect(imagens).toHaveLength(1);
      expect(imagens[0].debug_id).toBe("uuid-landing");
    });

    it("deve ignorar entradas inválidas em _sentryDebugIds e quadros sem filename", () => {
      const globalObj = {
        _sentryDebugIds: {
          "LinhaInvalidaSemStack": "uuid-invalido",
          "Error\n    at https://arestaclimb.com/assets/valido.js:1:1": 12345, // debugId não é string
          "Error\n    at https://arestaclimb.com/assets/vazio.js:1:1": "", // debugId vazio
          "Error\n    at https://arestaclimb.com/assets/ok.js:1:1": "uuid-ok",
        },
      };

      const quadros = [
        null,
        { filename: "" },
        { filename: "https://arestaclimb.com/assets/ok.js" },
        { filename: "https://arestaclimb.com/assets/sem-debug-id.js" },
      ];

      const imagens = extrairImagensDebugMeta(quadros, globalObj);
      expect(imagens).toEqual([
        {
          type: "sourcemap",
          code_file: "https://arestaclimb.com/assets/ok.js",
          debug_id: "uuid-ok",
        },
      ]);
    });

    it("deve suportar _debugIds como fonte alternativa e ignorar arquivos não presentes nos quadros da exceção", () => {
      const globalObj = {
        _debugIds: {
          "Error\n    at https://arestaclimb.com/assets/landing.js:1:1": "uuid-from-debugids",
          "Error\n    at https://arestaclimb.com/assets/outro.js:1:1": "uuid-outro",
        },
      };

      const quadros = [{ filename: "https://arestaclimb.com/assets/landing.js" }];
      const imagens = extrairImagensDebugMeta(quadros, globalObj);
      expect(imagens).toEqual([
        {
          type: "sourcemap",
          code_file: "https://arestaclimb.com/assets/landing.js",
          debug_id: "uuid-from-debugids",
        },
      ]);
    });
  });

  describe("enviarExcecaoSentryWeb", () => {
    it("deve operar em modo no-op (retornando false) quando nenhum DSN estiver configurado", async () => {
      let chamou = false;
      const fetchFake = async () => {
        chamou = true;
        return { ok: true, status: 200 };
      };
      const enviado = await enviarExcecaoSentryWeb(new Error("Erro sem DSN"), {
        dsn: "",
        fetchImpl: fetchFake,
      });
      expect(enviado).toBe(false);
      expect(chamou).toBe(false);
    });

    it("deve ignorar erros de fetch quando o navegador estiver offline (navigator.onLine === false)", async () => {
      let chamou = false;
      const fetchFake = async () => {
        chamou = true;
        return { ok: true, status: 200 };
      };
      const enviado = await enviarExcecaoSentryWeb(new TypeError("Failed to fetch"), {
        dsn: "https://pub123@o1.ingest.sentry.io/99",
        estaOnline: false,
        fetchImpl: fetchFake,
      });
      expect(enviado).toBe(false);
      expect(chamou).toBe(false);
    });

    it("deve enviar envelope para o Sentry quando DSN for válido e erro for uma instância de Error ou string", async () => {
      const chamadas = [];
      const fetchFake = async (url, init) => {
        chamadas.push({ url, init });
        return { ok: true, status: 200 };
      };

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

    it("deve incluir debug_meta.images no envelope quando houver Debug IDs correspondentes no ambiente global", async () => {
      const chamadas = [];
      const fetchFake = async (url, init) => {
        chamadas.push({ url, init });
        return { ok: true, status: 200 };
      };

      window._sentryDebugIds = {
        "Error\n    at https://arestaclimb.com/assets/landing.js:1:1": "debug-uuid-456",
      };

      const erro = new Error("Erro com Source Map");
      erro.stack = "Error: Erro com Source Map\n    at https://arestaclimb.com/assets/landing.js:42:10";

      const enviado = await enviarExcecaoSentryWeb(erro, {
        dsn: "https://pub123@o1.ingest.sentry.io/99",
        fetchImpl: fetchFake,
      });

      expect(enviado).toBe(true);
      expect(chamadas.length).toBe(1);

      const linhas = chamadas[0].init.body.split("\n");
      const payloadEvento = JSON.parse(linhas[2]);
      expect(payloadEvento.debug_meta).toEqual({
        images: [
          {
            type: "sourcemap",
            code_file: "https://arestaclimb.com/assets/landing.js",
            debug_id: "debug-uuid-456",
          },
        ],
      });
    });

    it("não deve incluir o campo debug_meta quando não houver Debug IDs correspondentes", async () => {
      const chamadas = [];
      const fetchFake = async (url, init) => {
        chamadas.push({ url, init });
        return { ok: true, status: 200 };
      };

      const erro = new Error("Erro sem Source Map");
      erro.stack = "Error: Erro sem Source Map\n    at https://arestaclimb.com/assets/landing.js:42:10";

      const enviado = await enviarExcecaoSentryWeb(erro, {
        dsn: "https://pub123@o1.ingest.sentry.io/99",
        fetchImpl: fetchFake,
      });

      expect(enviado).toBe(true);
      const linhas = chamadas[0].init.body.split("\n");
      const payloadEvento = JSON.parse(linhas[2]);
      expect(payloadEvento.debug_meta).toBeUndefined();
    });

    it("deve enviar envelope para erro em formato de string sem stacktrace e tratar falha de rede no próprio fetch do Sentry", async () => {
      const fetchQueFalha = async () => {
        throw new Error("Sentry indisponível");
      };

      const enviadoFalha = await enviarExcecaoSentryWeb("Rejeição textual", {
        dsn: "https://pub123@o1.ingest.sentry.io/99",
        estaOnline: true,
        fetchImpl: fetchQueFalha,
      });
      expect(enviadoFalha).toBe(false);

      const fetchOk = async () => ({ ok: true, status: 200 });
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
      const fetchFake = async (url, init) => {
        envelopes.push({ url, body: init.body });
        return { ok: true, status: 200 };
      };

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

    it("não deve registrar ouvintes duplicados se chamado múltiplas vezes para o mesmo alvoGlobal", () => {
      const eventosRegistrados = [];
      const mockAlvo = {
        addEventListener: (tipo, listener) => {
          eventosRegistrados.push({ tipo, listener });
        },
        removeEventListener: (tipo, listener) => {
          const idx = eventosRegistrados.findIndex(
            (e) => e.tipo === tipo && e.listener === listener
          );
          if (idx >= 0) eventosRegistrados.splice(idx, 1);
        },
      };

      const removerPrimeiro = inicializarMonitoramentoErrosSentry({ alvoGlobal: mockAlvo });
      expect(eventosRegistrados.length).toBe(2);

      const removerSegundo = inicializarMonitoramentoErrosSentry({ alvoGlobal: mockAlvo });
      expect(eventosRegistrados.length).toBe(2);

      removerPrimeiro();
      expect(eventosRegistrados.length).toBe(0);

      removerSegundo();
      expect(eventosRegistrados.length).toBe(0);

      const removerTerceiro = inicializarMonitoramentoErrosSentry({ alvoGlobal: mockAlvo });
      expect(eventosRegistrados.length).toBe(2);
      removerTerceiro();
    });
  });
});
