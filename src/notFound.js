/**
 * Módulo de Controle da Página 404 do Aresta Climb
 * Gerencia a contagem regressiva e o redirecionamento automático para a página inicial.
 */

/**
 * Inicia uma contagem regressiva em segundos, executando um callback a cada segundo
 * e outro ao término do tempo.
 *
 * @param {number} segundos - Quantidade de segundos inicial da contagem.
 * @param {function(number): void} onTick - Callback invocado a cada segundo com os segundos restantes.
 * @param {function(): void} onConcluir - Callback invocado quando a contagem atinge zero.
 * @returns {number|null} Identificador do intervalo criado.
 */
export function iniciarContagemRegressiva(segundos, onTick, onConcluir) {
  if (segundos <= 0) {
    onConcluir();
    return null;
  }

  let tempoRestante = segundos;

  const intervaloId = setInterval(() => {
    tempoRestante -= 1;
    onTick(tempoRestante);

    if (tempoRestante <= 0) {
      clearInterval(intervaloId);
      onConcluir();
    }
  }, 1000);

  return intervaloId;
}

/**
 * Cancela a contagem regressiva em andamento e atualiza a mensagem visual.
 *
 * @param {number|null} intervaloId - Identificador do timer retornado por iniciarContagemRegressiva.
 * @param {HTMLElement|null} elementoAviso - Elemento DOM onde o aviso de cancelamento será exibido.
 * @returns {boolean} True indicando que o cancelamento foi executado.
 */
export function cancelarRedirecionamento(intervaloId, elementoAviso) {
  if (intervaloId) {
    clearInterval(intervaloId);
  }

  if (elementoAviso) {
    elementoAviso.textContent = 'Redirecionamento automático cancelado.';
  }

  return true;
}

/**
 * Redireciona o navegador para a página inicial do site.
 *
 * @param {Window|object} navegador - Objeto global de janela/navegador contendo a propriedade location.
 */
export function redirecionarParaInicio(navegador = window) {
  if (navegador && navegador.location) {
    navegador.location.href = '/';
  }
}

/**
 * Configura os elementos interativos e inicia a contagem da página 404.
 *
 * @param {Document} documento - Objeto Document da página.
 * @param {Window} navegador - Objeto Window para redirecionamento.
 * @param {number} [segundos=5] - Duração do contador até o redirecionamento em segundos.
 */
export function configurarPagina404(documento = document, navegador = window, segundos = 5) {
  const elementoContador = documento.getElementById('countdown');
  const botaoCancelar = documento.getElementById('btn-cancelar');
  const elementoAviso = documento.getElementById('redirect-notice');
  const botaoInicio = documento.getElementById('btn-home');

  let intervaloId = null;

  if (elementoContador) {
    elementoContador.textContent = String(segundos);
  }

  intervaloId = iniciarContagemRegressiva(
    segundos,
    (segundosRestantes) => {
      if (elementoContador) {
        elementoContador.textContent = String(segundosRestantes);
      }
    },
    () => {
      redirecionarParaInicio(navegador);
    }
  );

  if (botaoCancelar) {
    botaoCancelar.addEventListener('click', (evento) => {
      evento.preventDefault();
      cancelarRedirecionamento(intervaloId, elementoAviso);
    });
  }

  if (botaoInicio) {
    botaoInicio.addEventListener('click', () => {
      if (intervaloId) {
        clearInterval(intervaloId);
      }
      redirecionarParaInicio(navegador);
    });
  }
}

/**
 * Inicialização no navegador considerando o ciclo de vida do DOM.
 *
 * @param {Document} documento - Objeto Document para verificar readyState e registrar ouvinte.
 */
export function initNotFound(documento = (typeof document !== 'undefined' ? document : null)) {
  if (!documento) return;

  if (documento.readyState === 'loading') {
    documento.addEventListener('DOMContentLoaded', () => configurarPagina404());
  } else {
    configurarPagina404();
  }
}

// Inicialização automática se executado em ambiente com documento
if (typeof document !== 'undefined') {
  initNotFound(document);
}
