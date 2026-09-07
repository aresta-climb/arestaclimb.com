import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  iniciarContagemRegressiva,
  cancelarRedirecionamento,
  redirecionarParaInicio,
  configurarPagina404,
  initNotFound
} from './notFound.js';

describe('notFound.js — Gerenciamento da Página 404 e Redirecionamento', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllTimers();
  });

  describe('iniciarContagemRegressiva', () => {
    it('deve chamar onTick a cada segundo e onConcluir ao atingir zero', () => {
      const onTick = vi.fn();
      const onConcluir = vi.fn();

      const intervalo = iniciarContagemRegressiva(3, onTick, onConcluir);

      expect(onTick).not.toHaveBeenCalled();
      expect(onConcluir).not.toHaveBeenCalled();

      // Avança 1 segundo
      vi.advanceTimersByTime(1000);
      expect(onTick).toHaveBeenCalledWith(2);
      expect(onConcluir).not.toHaveBeenCalled();

      // Avança mais 1 segundo
      vi.advanceTimersByTime(1000);
      expect(onTick).toHaveBeenCalledWith(1);
      expect(onConcluir).not.toHaveBeenCalled();

      // Avança o último segundo
      vi.advanceTimersByTime(1000);
      expect(onTick).toHaveBeenCalledWith(0);
      expect(onConcluir).toHaveBeenCalledTimes(1);

      // Avança além do tempo para confirmar que o intervalo foi cancelado
      vi.advanceTimersByTime(2000);
      expect(onConcluir).toHaveBeenCalledTimes(1);
    });

    it('deve chamar onConcluir imediatamente se o tempo inicial for menor ou igual a zero', () => {
      const onTick = vi.fn();
      const onConcluir = vi.fn();

      iniciarContagemRegressiva(0, onTick, onConcluir);

      expect(onConcluir).toHaveBeenCalledTimes(1);
      expect(onTick).not.toHaveBeenCalled();
    });
  });

  describe('cancelarRedirecionamento', () => {
    it('deve cancelar o intervalo e atualizar a mensagem no elemento de aviso', () => {
      const onTick = vi.fn();
      const onConcluir = vi.fn();
      const intervalo = iniciarContagemRegressiva(5, onTick, onConcluir);

      const avisoElemento = document.createElement('div');
      avisoElemento.textContent = 'Redirecionando em 5s...';

      const cancelado = cancelarRedirecionamento(intervalo, avisoElemento);

      expect(cancelado).toBe(true);
      expect(avisoElemento.textContent).toBe('Redirecionamento automático cancelado.');

      // Avança o tempo para comprovar que não conclui
      vi.advanceTimersByTime(10000);
      expect(onConcluir).not.toHaveBeenCalled();
    });

    it('deve funcionar corretamente mesmo se o elemento de aviso for nulo', () => {
      const intervalo = setInterval(() => {}, 1000);
      const cancelado = cancelarRedirecionamento(intervalo, null);
      expect(cancelado).toBe(true);
    });
  });

  describe('redirecionarParaInicio', () => {
    it('deve redirecionar a navegação para a raiz "/"', () => {
      const mockNavegador = {
        location: {
          href: '/caca'
        }
      };

      redirecionarParaInicio(mockNavegador);
      expect(mockNavegador.location.href).toBe('/');
    });
  });

  describe('configurarPagina404', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div id="redirect-notice">
          Redirecionando para a página inicial em <span id="countdown">5</span> segundos...
          <button id="btn-cancelar">Cancelar</button>
        </div>
        <a id="btn-home" href="/">Voltar ao Início</a>
      `;
    });

    it('deve inicializar a contagem regressiva e atualizar o elemento #countdown', () => {
      const mockNavegador = { location: { href: '/rota-invalida' } };
      configurarPagina404(document, mockNavegador, 3);

      const countdownEl = document.getElementById('countdown');
      expect(countdownEl.textContent).toBe('3');

      vi.advanceTimersByTime(1000);
      expect(countdownEl.textContent).toBe('2');

      vi.advanceTimersByTime(1000);
      expect(countdownEl.textContent).toBe('1');

      vi.advanceTimersByTime(1000);
      expect(countdownEl.textContent).toBe('0');
      expect(mockNavegador.location.href).toBe('/');
    });

    it('deve permitir cancelar a contagem ao clicar em #btn-cancelar', () => {
      const mockNavegador = { location: { href: '/rota-invalida' } };
      configurarPagina404(document, mockNavegador, 5);

      const btnCancelar = document.getElementById('btn-cancelar');
      const noticeEl = document.getElementById('redirect-notice');

      btnCancelar.click();

      expect(noticeEl.textContent).toContain('cancelado');

      // Avança 10s e garante que não redirecionou
      vi.advanceTimersByTime(10000);
      expect(mockNavegador.location.href).toBe('/rota-invalida');
    });

    it('deve cancelar o contador caso o usuário clique em #btn-home', () => {
      const mockNavegador = { location: { href: '/rota-invalida' } };
      configurarPagina404(document, mockNavegador, 5);

      const btnHome = document.getElementById('btn-home');
      btnHome.click();

      // Avança 10s e garante que o contador foi desarmado
      vi.advanceTimersByTime(10000);
      expect(mockNavegador.location.href).toBe('/');
    });

    it('deve ser resiliente quando os elementos do DOM não existirem', () => {
      document.body.innerHTML = '';
      const mockNavegador = { location: { href: '/rota-invalida' } };

      expect(() => {
        configurarPagina404(document, mockNavegador, 5);
      }).not.toThrow();
    });

    it('deve responder ao evento DOMContentLoaded caso o documento ainda esteja carregando', () => {
      document.body.innerHTML = `
        <div id="redirect-notice">
          Redirecionando para a página inicial em <span id="countdown">5</span> segundos...
          <button id="btn-cancelar">Cancelar</button>
        </div>
      `;

      const docMock = {
        readyState: 'loading',
        listeners: {},
        addEventListener(event, cb) {
          this.listeners[event] = cb;
        },
        getElementById(id) {
          return document.getElementById(id);
        }
      };

      initNotFound(docMock);
      expect(typeof docMock.listeners['DOMContentLoaded']).toBe('function');
      docMock.listeners['DOMContentLoaded']();

      const countdownEl = document.getElementById('countdown');
      expect(countdownEl.textContent).toBe('5');
    });

    it('deve lidar com ausência de documento sem erros', () => {
      expect(() => initNotFound(null)).not.toThrow();
    });
  });
});
