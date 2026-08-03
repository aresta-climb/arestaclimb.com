// Lógica interativa da Landing Page do Editor

export function setupDownloadButton() {
  const downloadBtn = document.getElementById('download-btn');
  const thankYouMsg = document.getElementById('thank-you-msg');

  if (downloadBtn && thankYouMsg) {
    downloadBtn.addEventListener('click', (e) => {
      // Exibe a mensagem de agradecimento animada
      thankYouMsg.style.display = 'block';
      
      // Prepara o rastreamento (ex: Google Analytics) se estiver disponível no futuro
      console.log('Download do Aresta Editor iniciado!');
    });
  }
}

// Inicia a função assim que o DOM for carregado
document.addEventListener('DOMContentLoaded', () => {
  setupDownloadButton();
});
