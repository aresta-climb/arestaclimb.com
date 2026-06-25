import './style.css';
import { loadAndRenderMarkdown } from './markdownRenderer.js';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('markdown-container');
  const mainArea = document.querySelector('.content-area');
  
  if (mainArea && container) {
    const docUrl = mainArea.getAttribute('data-doc');
    if (docUrl) {
      loadAndRenderMarkdown(docUrl, container);
    }
  }
});
