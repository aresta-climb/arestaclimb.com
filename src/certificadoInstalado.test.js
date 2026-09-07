import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  THUMBPRINTS_VALIDOS,
  URL_REDIRECIONAMENTO_PADRAO,
  processarParametrosCertificado,
  setupCertificadoInstalado,
  initCertificadoInstalado,
} from "./certificadoInstalado.js";

const HASH_TESTE_VALIDA = "07cb2e37f8492a84ab3c62961635074c11053a6a075aad025da2ab6d76fad068";

describe("certificadoInstalado.js - Validação de Instalação do Certificado Beta", () => {
  let mockLocation;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="loading-state" style="display: block;">Verificando...</div>
      <div id="success-state" style="display: none;">
        <span id="cert-thumbprint-display"></span>
        <a id="btn-instalar-appinstaller" href="#">Instalar</a>
      </div>
      <div id="error-state" style="display: none;">
        <span id="error-thumbprint-display"></span>
        <a id="btn-voltar-instrucoes" href="#">Voltar</a>
      </div>
    `;

    mockLocation = {
      replace: vi.fn(),
      href: "",
      search: "",
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("deve redirecionar para /editor/beta quando chamada sem parâmetros", () => {
    const resultado = processarParametrosCertificado({
      search: "",
      doc: document,
      win: { location: mockLocation },
      thumbprintsValidos: new Set([HASH_TESTE_VALIDA]),
    });

    expect(resultado.estado).toBe("redirecionado");
    expect(mockLocation.replace).toHaveBeenCalledWith(URL_REDIRECIONAMENTO_PADRAO);
    expect(document.getElementById("success-state").style.display).toBe("none");
    expect(document.getElementById("error-state").style.display).toBe("none");
  });

  it("deve redirecionar para /editor/beta se o parâmetro origem for diferente de 'instalador'", () => {
    const resultado = processarParametrosCertificado({
      search: `?origem=manual&thumbprint=${HASH_TESTE_VALIDA}`,
      doc: document,
      win: { location: mockLocation },
      thumbprintsValidos: new Set([HASH_TESTE_VALIDA]),
    });

    expect(resultado.estado).toBe("redirecionado");
    expect(mockLocation.replace).toHaveBeenCalledWith(URL_REDIRECIONAMENTO_PADRAO);
  });

  it("deve exibir o estado de sucesso quando origem=instalador e o thumbprint for válido (minúsculo)", () => {
    const resultado = processarParametrosCertificado({
      search: `?origem=instalador&thumbprint=${HASH_TESTE_VALIDA}`,
      doc: document,
      win: { location: mockLocation },
      thumbprintsValidos: new Set([HASH_TESTE_VALIDA]),
    });

    expect(resultado.estado).toBe("sucesso");
    expect(resultado.thumbprint).toBe(HASH_TESTE_VALIDA);
    expect(mockLocation.replace).not.toHaveBeenCalled();

    const successEl = document.getElementById("success-state");
    const errorEl = document.getElementById("error-state");
    const loadingEl = document.getElementById("loading-state");

    expect(loadingEl.style.display).toBe("none");
    expect(successEl.style.display).toBe("block");
    expect(errorEl.style.display).toBe("none");

    expect(document.getElementById("cert-thumbprint-display").textContent).toContain(HASH_TESTE_VALIDA);
  });

  it("deve exibir o estado de sucesso de forma case-insensitive (maiúsculo)", () => {
    const hashMaiuscula = HASH_TESTE_VALIDA.toUpperCase();
    const resultado = processarParametrosCertificado({
      search: `?origem=instalador&thumbprint=${hashMaiuscula}`,
      doc: document,
      win: { location: mockLocation },
      thumbprintsValidos: new Set([HASH_TESTE_VALIDA]),
    });

    expect(resultado.estado).toBe("sucesso");
    expect(resultado.thumbprint).toBe(HASH_TESTE_VALIDA);
    expect(document.getElementById("success-state").style.display).toBe("block");
  });

  it("deve exibir o estado de erro quando origem=instalador e o thumbprint for inválido ou divergente", () => {
    const hashInvalida = "deadbeef1234567890abcdefdeadbeef1234567890abcdefdeadbeef12345678";
    const resultado = processarParametrosCertificado({
      search: `?origem=instalador&thumbprint=${hashInvalida}`,
      doc: document,
      win: { location: mockLocation },
      thumbprintsValidos: new Set([HASH_TESTE_VALIDA]),
    });

    expect(resultado.estado).toBe("erro");
    expect(resultado.thumbprint).toBe(hashInvalida);
    expect(mockLocation.replace).not.toHaveBeenCalled();

    const successEl = document.getElementById("success-state");
    const errorEl = document.getElementById("error-state");
    const loadingEl = document.getElementById("loading-state");

    expect(loadingEl.style.display).toBe("none");
    expect(successEl.style.display).toBe("none");
    expect(errorEl.style.display).toBe("block");

    expect(document.getElementById("error-thumbprint-display").textContent).toContain(hashInvalida);
  });

  it("deve exibir o estado de erro quando origem=instalador mas o thumbprint estiver ausente", () => {
    const resultado = processarParametrosCertificado({
      search: "?origem=instalador",
      doc: document,
      win: { location: mockLocation },
      thumbprintsValidos: new Set([HASH_TESTE_VALIDA]),
    });

    expect(resultado.estado).toBe("erro");
    expect(resultado.thumbprint).toBe("");
    expect(document.getElementById("error-state").style.display).toBe("block");
    expect(document.getElementById("success-state").style.display).toBe("none");
  });

  it("deve inicializar o setupCertificadoInstalado com o ambiente global padrão", () => {
    delete window.location;
    window.location = {
      search: `?origem=instalador&thumbprint=${HASH_TESTE_VALIDA}`,
      replace: vi.fn(),
      href: "",
    };

    const resultado = setupCertificadoInstalado({
      thumbprintsValidos: new Set([HASH_TESTE_VALIDA]),
    });
    expect(resultado.estado).toBe("sucesso");
  });

  it("deve executar o setup ao disparar DOMContentLoaded", () => {
    delete window.location;
    window.location = {
      search: `?origem=instalador&thumbprint=${HASH_TESTE_VALIDA}`,
      replace: vi.fn(),
      href: "",
    };

    Object.defineProperty(document, "readyState", { value: "loading", configurable: true });
    initCertificadoInstalado();

    document.dispatchEvent(new Event("DOMContentLoaded"));
    expect(document.getElementById("success-state").style.display).toBe("block");

    Object.defineProperty(document, "readyState", { value: "complete", configurable: true });
  });

  it("deve lidar com ausência de elementos opcionais no documento sem lançar erro", () => {
    document.body.innerHTML = `<div>Sem elementos esperados</div>`;
    const resultado = processarParametrosCertificado({
      search: `?origem=instalador&thumbprint=${HASH_TESTE_VALIDA}`,
      doc: document,
      win: { location: mockLocation },
      thumbprintsValidos: new Set([HASH_TESTE_VALIDA]),
    });
    expect(resultado.estado).toBe("sucesso");

    const resultadoErro = processarParametrosCertificado({
      search: `?origem=instalador&thumbprint=invalido`,
      doc: document,
      win: { location: mockLocation },
      thumbprintsValidos: new Set([HASH_TESTE_VALIDA]),
    });
    expect(resultadoErro.estado).toBe("erro");
  });

  it("deve lidar com doc e win nulos de forma graciosa", () => {
    const resultado = processarParametrosCertificado({
      search: "",
      doc: null,
      win: null,
    });
    expect(resultado.estado).toBe("redirecionado");

    const resultadoSucesso = processarParametrosCertificado({
      search: `?origem=instalador&thumbprint=${HASH_TESTE_VALIDA}`,
      doc: null,
      win: null,
      thumbprintsValidos: new Set([HASH_TESTE_VALIDA]),
    });
    expect(resultadoSucesso.estado).toBe("sucesso");
  });

  it("deve executar com parâmetros padrão ao chamar processarParametrosCertificado sem argumentos", () => {
    delete window.location;
    window.location = {
      search: "",
      replace: vi.fn(),
      href: "",
    };

    const resultado = processarParametrosCertificado();
    expect(resultado.estado).toBe("redirecionado");
    expect(window.location.replace).toHaveBeenCalledWith(URL_REDIRECIONAMENTO_PADRAO);
  });

  it("deve executar setup diretamente se document.readyState não for 'loading'", () => {
    delete window.location;
    window.location = {
      search: `?origem=instalador&thumbprint=${HASH_TESTE_VALIDA}`,
      replace: vi.fn(),
      href: "",
    };

    Object.defineProperty(document, "readyState", { value: "complete", configurable: true });
    initCertificadoInstalado();

    expect(document.getElementById("success-state").style.display).toBe("block");
  });
});
