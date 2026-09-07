import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { JSDOM } from "jsdom";

describe("editor/beta/index.html - Estrutura DOM da Landing Page do Canal Beta", () => {
  const htmlPath = path.resolve(__dirname, "../editor/beta/index.html");

  it("o arquivo editor/beta/index.html deve existir", () => {
    expect(fs.existsSync(htmlPath)).toBe(true);
  });

  it("deve conter metadados e títulos corretos do Canal Beta", () => {
    const html = fs.readFileSync(htmlPath, "utf-8");
    const dom = new JSDOM(html, { url: "http://localhost" });
    const { document } = dom.window;

    expect(document.title).toContain("Editor Aresta (Beta)");
    expect(document.documentElement.lang).toBe("pt-BR");
  });

  it("deve conter o link para download do script batch .bat no Passo 1", () => {
    const html = fs.readFileSync(htmlPath, "utf-8");
    const dom = new JSDOM(html, { url: "http://localhost" });
    const { document } = dom.window;

    const btnBat = document.querySelector('a[href*="InstalarCertificadoEditorArestaBeta.bat"]');
    expect(btnBat).not.toBeNull();
    expect(btnBat.getAttribute("href")).toBe(
      "https://serving.arestaclimb.com/editor-beta/InstalarCertificadoEditorArestaBeta.bat"
    );
  });

  it("deve conter o link para o Windows App Installer no Passo 2", () => {
    const html = fs.readFileSync(htmlPath, "utf-8");
    const dom = new JSDOM(html, { url: "http://localhost" });
    const { document } = dom.window;

    const btnAppInstaller = document.querySelector('a[href*="ms-appinstaller:?source="]');
    expect(btnAppInstaller).not.toBeNull();
    expect(btnAppInstaller.getAttribute("href")).toContain(
      "https://serving.arestaclimb.com/editor-beta/EditorAresta.appinstaller"
    );
  });

  it("deve conter o alternador de tema claro/escuro", () => {
    const html = fs.readFileSync(htmlPath, "utf-8");
    const dom = new JSDOM(html, { url: "http://localhost" });
    const { document } = dom.window;

    expect(document.getElementById("themeToggle")).not.toBeNull();
  });

  it("não deve conter o link para download direto do pacote MSIX", () => {
    const html = fs.readFileSync(htmlPath, "utf-8");
    const dom = new JSDOM(html, { url: "http://localhost" });
    const { document } = dom.window;

    const btnMsix = document.querySelector('a[href*=".msix"]');
    expect(btnMsix).toBeNull();
    expect(html).not.toContain("Download direto do pacote MSIX");
  });

  it("deve conter legenda de apoio abaixo dos botões nos Passos 1 e 2 para alinhamento visual", () => {
    const html = fs.readFileSync(htmlPath, "utf-8");
    const dom = new JSDOM(html, { url: "http://localhost" });
    const { document } = dom.window;

    const cards = document.querySelectorAll(".beta-step-card");
    expect(cards.length).toBe(2);

    const legendas = Array.from(cards).map((card) => card.querySelector("small"));
    expect(legendas[0]).not.toBeNull();
    expect(legendas[0].textContent).toContain("UAC");
    expect(legendas[1]).not.toBeNull();
    expect(legendas[1].textContent.trim().length).toBeGreaterThan(0);
  });
});
