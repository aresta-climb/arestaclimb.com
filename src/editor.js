import './editor.css';
import './theme.js';

export function setupDownloadButton() {
  const downloadBtn = document.getElementById('download-btn');
  const thankYouMsg = document.getElementById('thank-you-msg');

  if (downloadBtn && thankYouMsg) {
    downloadBtn.addEventListener('click', () => {
      console.log('Download do Editor Aresta iniciado!');
      thankYouMsg.style.display = 'block';
      setTimeout(() => {
        thankYouMsg.style.display = 'none';
      }, 8000);
    });
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    setupDownloadButton();
  });
}
