import { marked } from 'marked';

export async function loadAndRenderMarkdown(url, containerElement) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      containerElement.innerHTML = `<div class="error-box">Erro ao carregar o documento: ${response.statusText}</div>`;
      return;
    }
    const text = await response.text();
    const html = marked.parse(text);
    containerElement.innerHTML = html;
  } catch (error) {
    containerElement.innerHTML = `<div class="error-box">Erro de conexão ao tentar carregar o documento.</div>`;
  }
}
