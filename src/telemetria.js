/**
 * Módulo de Monitoramento de Exceções Client-Side (Sentry Envelope)
 * para o Portal Web e Editor Desktop do Aresta Climb.
 *
 * Opera com zero dependências externas, despachando envelopes HTTP leves
 * diretamente para a API de Ingestão do Sentry quando um DSN estiver configurado.
 */

const PADRAO_ERRO_REDE = /failed to fetch|networkerror|load failed|erro de rede/i;

/**
 * Extrai a configuração de ingestão a partir de uma string DSN do Sentry.
 * @param {string | null | undefined} dsn
 * @returns {{ chavePublica: string, idProjeto: string, urlEnvelope: string } | null}
 */
export function extrairConfiguracaoDsnSentry(dsn) {
  if (!dsn || typeof dsn !== "string" || dsn.trim() === "") {
    return null;
  }

  try {
    const url = new URL(dsn.trim());
    const chavePublica = url.username;
    const segmentos = url.pathname.split("/").filter(Boolean);
    const idProjeto = segmentos[segmentos.length - 1];

    if (!chavePublica || !idProjeto) {
      return null;
    }

    const prefixoCaminho =
      segmentos.length > 1 ? "/" + segmentos.slice(0, -1).join("/") : "";
    const urlEnvelope = `${url.protocol}//${url.host}${prefixoCaminho}/api/${idProjeto}/envelope/?sentry_key=${encodeURIComponent(
      chavePublica
    )}&sentry_version=7&sentry_client=aresta-web%2F1.0.0`;

    return {
      chavePublica,
      idProjeto,
      urlEnvelope,
    };
  } catch {
    return null;
  }
}

/**
 * Verifica se o erro reportado é apenas ruído de perda de conectividade quando o navegador está offline.
 * @param {unknown} erroOuMensagem
 * @param {boolean} [estaOnline]
 * @returns {boolean}
 */
export function ehErroDeRedeOffline(
  erroOuMensagem,
  estaOnline = typeof navigator !== "undefined" ? navigator.onLine !== false : true
) {
  if (estaOnline) {
    return false;
  }

  if (!erroOuMensagem) {
    return false;
  }

  const texto =
    typeof erroOuMensagem === "string"
      ? erroOuMensagem
      : String(erroOuMensagem.message || erroOuMensagem);

  return PADRAO_ERRO_REDE.test(texto);
}

/**
 * Extrai quadros de pilha de chamadas (stack trace) de navegadores V8/Blink e SpiderMonkey/WebKit.
 * @param {string | null | undefined} pilha
 * @returns {Array<{ filename: string, function: string, lineno: number, colno: number, in_app: boolean }>}
 */
export function extrairQuadrosPilhaNavegador(pilha) {
  if (!pilha || typeof pilha !== "string") {
    return [];
  }

  const quadros = [];
  const linhas = pilha.split("\n");

  for (const linhaBruta of linhas) {
    const linha = linhaBruta.trim();

    // Formato V8: at nomeFuncao (https://...:linha:coluna) ou at https://...:linha:coluna
    const matchV8 = linha.match(
      /^at\s+(?:(.+?)\s+\((.+):(\d+):(\d+)\)|(.+):(\d+):(\d+))$/
    );
    if (matchV8) {
      const funcao = matchV8[1] ? matchV8[1].trim() : "<anonymous>";
      const arquivo = (matchV8[2] || matchV8[5]).trim();
      const lineno = parseInt(matchV8[3] || matchV8[6], 10);
      const colno = parseInt(matchV8[4] || matchV8[7], 10);
      quadros.push({
        filename: arquivo,
        function: funcao,
        lineno,
        colno,
        in_app: !arquivo.includes("node_modules"),
      });
      continue;
    }

    // Formato Firefox/Safari: nomeFuncao@https://...:linha:coluna
    const matchFx = linha.match(/^(.*?)@(.+):(\d+):(\d+)$/);
    if (matchFx) {
      const funcao = matchFx[1].trim() || "<anonymous>";
      const arquivo = matchFx[2].trim();
      const lineno = parseInt(matchFx[3], 10);
      const colno = parseInt(matchFx[4], 10);
      quadros.push({
        filename: arquivo,
        function: funcao,
        lineno,
        colno,
        in_app: !arquivo.includes("node_modules"),
      });
    }
  }

  return quadros.reverse();
}

/**
 * Gera um identificador hexadecimal de 32 caracteres para o evento do Sentry.
 * @returns {string}
 */
function gerarIdEventoHex() {
  return crypto.randomUUID().replace(/-/g, "");
}

/**
 * Envia uma exceção não tratada do navegador para o Sentry via protocolo Envelope.
 * @param {unknown} erro
 * @param {{
 *   dsn?: string,
 *   servico?: string,
 *   ambiente?: string,
 *   urlPagina?: string,
 *   userAgent?: string,
 *   estaOnline?: boolean,
 *   fetchImpl?: typeof fetch
 * }} [opcoes]
 * @returns {Promise<boolean>}
 */
export async function enviarExcecaoSentryWeb(erro, opcoes = {}) {
  const dsnEfetivo =
    opcoes.dsn !== undefined
      ? opcoes.dsn
      : (typeof window !== "undefined" && window.__ARESTA_SENTRY_DSN__) ||
        (typeof import.meta !== "undefined" &&
          import.meta.env &&
          import.meta.env.VITE_SENTRY_DSN) ||
        "";

  const config = extrairConfiguracaoDsnSentry(dsnEfetivo);
  if (!config) {
    return false;
  }

  const estaOnline =
    opcoes.estaOnline !== undefined
      ? opcoes.estaOnline
      : typeof navigator !== "undefined"
      ? navigator.onLine !== false
      : true;

  if (ehErroDeRedeOffline(erro, estaOnline)) {
    return false;
  }

  const ehInstanciaErro = erro instanceof Error;
  const tipoErro = ehInstanciaErro ? erro.name || "Error" : "UnhandledError";
  const mensagemErro = ehInstanciaErro
    ? erro.message
    : typeof erro === "string"
    ? erro
    : JSON.stringify(erro);
  const quadros = ehInstanciaErro ? extrairQuadrosPilhaNavegador(erro.stack) : [];

  const eventId = gerarIdEventoHex();
  const timestamp = new Date().toISOString();
  const servico = opcoes.servico || "aresta-web";
  const ambiente = opcoes.ambiente || "production";
  const urlPagina =
    opcoes.urlPagina ||
    (typeof window !== "undefined" && window.location ? window.location.href : "");
  const userAgent =
    opcoes.userAgent ||
    (typeof navigator !== "undefined" ? navigator.userAgent : "");

  const payloadEvento = {
    event_id: eventId,
    timestamp,
    platform: "javascript",
    level: "error",
    environment: ambiente,
    tags: {
      service: servico,
    },
    request: {
      url: urlPagina,
      headers: userAgent ? { "User-Agent": userAgent } : {},
    },
    exception: {
      values: [
        {
          type: tipoErro,
          value: mensagemErro,
          ...(quadros.length > 0 ? { stacktrace: { frames: quadros } } : {}),
        },
      ],
    },
  };

  const cabecalhoEnvelope = JSON.stringify({
    event_id: eventId,
    sent_at: timestamp,
    dsn: dsnEfetivo,
  });
  const cabecalhoItem = JSON.stringify({ type: "event" });
  const corpoEnvelope = `${cabecalhoEnvelope}\n${cabecalhoItem}\n${JSON.stringify(
    payloadEvento
  )}\n`;

  const funcaoFetch = opcoes.fetchImpl || globalThis.fetch;

  try {
    await funcaoFetch(config.urlEnvelope, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-sentry-envelope",
      },
      body: corpoEnvelope,
      keepalive: true,
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Registra ouvintes globais (`error` e `unhandledrejection`) na janela do navegador
 * para reportar exceções não tratadas ao Sentry.
 * @param {{
 *   alvoGlobal?: Window | EventTarget | null,
 *   dsn?: string,
 *   servico?: string,
 *   ambiente?: string,
 *   fetchImpl?: typeof fetch
 * }} [opcoes]
 * @returns {() => void} Função para remover os ouvintes registrados
 */
export function inicializarMonitoramentoErrosSentry(opcoes = {}) {
  const alvo =
    opcoes.alvoGlobal !== undefined
      ? opcoes.alvoGlobal
      : typeof window !== "undefined"
      ? window
      : null;

  if (!alvo || typeof alvo.addEventListener !== "function") {
    return () => {};
  }

  const aoOcorrerErro = (evento) => {
    const erroExtraido =
      evento && evento.error
        ? evento.error
        : new Error((evento && evento.message) || "Erro desconhecido de script");
    void enviarExcecaoSentryWeb(erroExtraido, opcoes);
  };

  const aoRejeitarPromise = (evento) => {
    const motivo = evento && "reason" in evento ? evento.reason : "Promise rejeitada";
    void enviarExcecaoSentryWeb(motivo, opcoes);
  };

  alvo.addEventListener("error", aoOcorrerErro);
  alvo.addEventListener("unhandledrejection", aoRejeitarPromise);

  return () => {
    alvo.removeEventListener("error", aoOcorrerErro);
    alvo.removeEventListener("unhandledrejection", aoRejeitarPromise);
  };
}
