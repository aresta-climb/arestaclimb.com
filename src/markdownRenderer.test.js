import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadAndRenderMarkdown } from './markdownRenderer.js';
import { marked } from 'marked';

// Mock marked
vi.mock('marked', () => ({
  marked: {
    parse: vi.fn((text) => `<p>${text}</p>`)
  }
}));

describe('markdownRenderer', () => {
  let container;

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '<div id="content"></div>';
    container = document.getElementById('content');
    // Clear mocks
    vi.clearAllMocks();
    
    // Mock global fetch
    global.fetch = vi.fn();
  });

  it('should fetch markdown and render it to the container', async () => {
    const mockMarkdown = '# Hello World';
    global.fetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(mockMarkdown)
    });

    await loadAndRenderMarkdown('/docs/test.md', container);

    expect(global.fetch).toHaveBeenCalledWith('/docs/test.md');
    expect(marked.parse).toHaveBeenCalledWith(mockMarkdown);
    expect(container.innerHTML).toBe(`<p>${mockMarkdown}</p>`);
  });

  it('should display an error message if fetch fails (response not ok)', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found'
    });

    await loadAndRenderMarkdown('/docs/missing.md', container);

    expect(container.innerHTML).toContain('Erro ao carregar o documento');
  });

  it('should display an error message if fetch throws an exception', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    await loadAndRenderMarkdown('/docs/error.md', container);

    expect(container.innerHTML).toContain('Erro de conexão');
  });
});
