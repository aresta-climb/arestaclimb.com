import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { JSDOM } from "jsdom";

describe("editor/beta/certificado-instalado/index.html - Estrutura DOM da Página de Validação", () => {
  const htmlPath = path.resolve(__dirname, "../editor/beta/certificado-instalado/index.html");

  it("o arquivo editor/beta/certificado-instalado/index.html deve existir", () => {
    expect(fs.existsSync(htmlPath)).toBe(true);
  });

  it("deve conter os containers de estado de carregamento, sucesso e erro", () => {
    const html = fs.readFileSync(htmlPath, "utf-8");
    const dom = new JSDOM(html, { url: "http://localhost" });
    const { document } = dom.window;

    expect(document.getElementById("loading-state")).not.toBeNull();
    expect(document.getElementById("success-state")).not.toBeNull();
    expect(document.getElementById("error-state")).not.toBeNull();
  });

  it("não deve conter impressão digital no sucesso e deve posicionar o próximo passo antes do botão de instalação", () => {
    const html = fs.readFileSync(htmlPath, "utf-8");
    const dom = new JSDOM(html, { url: "http://localhost" });
    const { document } = dom.window;

    const successState = document.getElementById("success-state");
    expect(successState).not.toBeNull();

    // Impressão digital removida do estado de sucesso
    expect(document.getElementById("cert-thumbprint-display")).toBeNull();
    expect(successState.querySelector(".thumbprint-box")).toBeNull();

    const btnInstalar = document.getElementById("btn-instalar-appinstaller");
    expect(btnInstalar).not.toBeNull();
    expect(btnInstalar.getAttribute("href")).toBe(
      "https://serving.arestaclimb.com/editor-beta/EditorArestaBeta.appinstaller"
    );
    expect(btnInstalar.hasAttribute("download")).toBe(true);
    expect(html).not.toContain("ms-appinstaller:?source=");

    // Próximo passo antes do botão de instalação
    const indexProximoPasso = successState.innerHTML.indexOf("Próximo Passo");
    const indexBotaoInstalar = successState.innerHTML.indexOf("btn-instalar-appinstaller");
    expect(indexProximoPasso).toBeGreaterThan(-1);
    expect(indexProximoPasso).toBeLessThan(indexBotaoInstalar);
  });

  it("deve conter orientações de contato e botão para voltar a /editor/beta no erro", () => {
    const html = fs.readFileSync(htmlPath, "utf-8");
    const dom = new JSDOM(html, { url: "http://localhost" });
    const { document } = dom.window;

    const errorState = document.getElementById("error-state");
    expect(errorState.textContent).toContain("contato@arestaclimb.com");

    const btnVoltar = document.getElementById("btn-voltar-instrucoes");
    expect(btnVoltar).not.toBeNull();
    expect(btnVoltar.getAttribute("href")).toBe("/editor/beta");
    expect(document.getElementById("error-thumbprint-display")).not.toBeNull();
  });

  it("deve conter o alternador de tema", () => {
    const html = fs.readFileSync(htmlPath, "utf-8");
    const dom = new JSDOM(html);
    const { document } = dom.window;

    expect(document.getElementById("themeToggle")).not.toBeNull();
  });
});
