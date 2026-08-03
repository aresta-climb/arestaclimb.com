import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setupDownloadButton } from './editor.js';

describe('editor.js - Landing Page Logic', () => {
  beforeEach(() => {
    // Limpa o documento antes de cada teste
    document.body.innerHTML = `
      <a href="#" id="download-btn">Baixar</a>
      <div id="thank-you-msg" style="display: none;">Obrigado!</div>
    `;
    
    // Simula console.log
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('deve exibir a mensagem de agradecimento ao clicar no botão de download', () => {
    setupDownloadButton();
    
    const downloadBtn = document.getElementById('download-btn');
    const thankYouMsg = document.getElementById('thank-you-msg');
    
    // Dispara o evento de clique
    downloadBtn.click();
    
    // Verifica se a mensagem ficou visível
    expect(thankYouMsg.style.display).toBe('block');
    
    // Verifica se o log foi disparado (simulando rastreamento)
    expect(console.log).toHaveBeenCalledWith('Download do Editor Aresta iniciado!');
  });

  it('deve chamar setupDownloadButton quando o DOMContentLoaded for disparado', () => {
    // Dispara o evento de carregamento da página
    document.dispatchEvent(new Event('DOMContentLoaded'));
    
    // Como a função já registrou o evento no document, o setup ocorre.
    // Podemos testar clicando no botão para ver se o event listener foi anexado pelo listener root.
    const downloadBtn = document.getElementById('download-btn');
    const thankYouMsg = document.getElementById('thank-you-msg');
    
    downloadBtn.click();
    expect(thankYouMsg.style.display).toBe('block');
  });
});
