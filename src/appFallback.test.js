import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  formatarSlug,
  detectarDeepLink,
  extrairInfoDeepLink,
  renderizarCardSetor,
  inicializarFallback,
  ROTAS_RESERVADAS
} from './appFallback.js';
import { STORE_LINKS } from './appRedirect.js';

describe('appFallback.js - Fallback Web para app.arestaclimb.com', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="app-container">
        <div id="not-found-default" class="not-found-card">
          <span class="error-badge">404</span>
          <h1>Página não encontrada</h1>
          <p id="countdown">5</p>
        </div>
        <div id="fallback-container" style="display: none;"></div>
      </div>
    `;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('formatarSlug', () => {
    it('deve retornar string vazia para entradas nulas, indefinidas ou não-string', () => {
      expect(formatarSlug(null)).toBe('');
      expect(formatarSlug(undefined)).toBe('');
      expect(formatarSlug('')).toBe('');
      expect(formatarSlug(123)).toBe('');
    });

    it('deve formatar slugs simples com capitalização e troca de underline por espaço', () => {
      expect(formatarSlug('grupo_estacionamento')).toBe('Grupo Estacionamento');
      expect(formatarSlug('savassinha')).toBe('Savassinha');
      expect(formatarSlug('teto_da_aresta')).toBe('Teto Da Aresta');
    });

    it('deve formatar slugs com prefixo geográfico no padrão br_uf_municipio_nome', () => {
      expect(formatarSlug('br_mg_igarape_pedra_grande')).toBe('Igarape Pedra Grande (MG)');
      expect(formatarSlug('br_rj_rio_de_janeiro_paodeacucar')).toBe('Rio De Janeiro Paodeacucar (RJ)');
    });
  });

  describe('detectarDeepLink', () => {
    it('deve retornar false para caminhos nulos, indefinidos ou não-string', () => {
      expect(detectarDeepLink(null)).toBe(false);
      expect(detectarDeepLink(undefined)).toBe(false);
      expect(detectarDeepLink(42)).toBe(false);
    });

    it('deve identificar rota de deep link sob o hostname app.arestaclimb.com ou subdomínio app.*', () => {
      expect(detectarDeepLink('/br_mg_igarape_pedra_grande/grupo_estacionamento', 'app.arestaclimb.com')).toBe(true);
      expect(detectarDeepLink('/pedra_grande/setor_teste', 'app.dev.arestaclimb.com')).toBe(true);
      expect(detectarDeepLink('/qualquer-rota-no-app', 'app.arestaclimb.com')).toBe(true);
    });

    it('deve identificar rota de deep link mesmo em outro domínio se contiver padrão de pico br_*', () => {
      expect(detectarDeepLink('/br_mg_igarape_pedra_grande/grupo_estacionamento', 'arestaclimb.com')).toBe(true);
      expect(detectarDeepLink('/br_sp_pedra_do_bau', 'localhost')).toBe(true);
    });

    it('deve retornar false em outro domínio para rotas arbitrárias que não comecem com br_', () => {
      expect(detectarDeepLink('/rota-qualquer', 'arestaclimb.com')).toBe(false);
      expect(detectarDeepLink('/outra/coisa', '')).toBe(false);
    });

    it('não deve identificar rotas reservadas como deep links', () => {
      for (const rota of ROTAS_RESERVADAS) {
        expect(detectarDeepLink(rota, 'app.arestaclimb.com')).toBe(false);
        expect(detectarDeepLink(rota, 'arestaclimb.com')).toBe(false);
      }
    });

    it('não deve identificar caminhos vazios ou raiz sem segmentos', () => {
      expect(detectarDeepLink('/', 'app.arestaclimb.com')).toBe(false);
      expect(detectarDeepLink('', 'arestaclimb.com')).toBe(false);
    });
  });

  describe('extrairInfoDeepLink', () => {
    it('deve extrair informações para rota de 1 nível (apenas pico)', () => {
      const info = extrairInfoDeepLink('/br_mg_igarape_pedra_grande');
      expect(info.ehDeepLink).toBe(true);
      expect(info.tipo).toBe('pico');
      expect(info.picoSlug).toBe('br_mg_igarape_pedra_grande');
      expect(info.titulo).toBe('Igarape Pedra Grande (MG)');
      expect(info.trilha).toEqual(['Igarape Pedra Grande (MG)']);
    });

    it('deve extrair informações para rota de 2 níveis (pico e setor/grupo)', () => {
      const info = extrairInfoDeepLink('/br_mg_igarape_pedra_grande/grupo_estacionamento');
      expect(info.ehDeepLink).toBe(true);
      expect(info.tipo).toBe('setor');
      expect(info.picoSlug).toBe('br_mg_igarape_pedra_grande');
      expect(info.setorSlug).toBe('grupo_estacionamento');
      expect(info.titulo).toBe('Grupo Estacionamento');
      expect(info.trilha).toEqual(['Igarape Pedra Grande (MG)', 'Grupo Estacionamento']);
    });

    it('deve extrair informações para rota de 3 níveis (pico, grupo e setor)', () => {
      const info = extrairInfoDeepLink('/br_mg_igarape_pedra_grande/grupo_estacionamento/savassinha');
      expect(info.ehDeepLink).toBe(true);
      expect(info.tipo).toBe('setor');
      expect(info.picoSlug).toBe('br_mg_igarape_pedra_grande');
      expect(info.grupoSlug).toBe('grupo_estacionamento');
      expect(info.setorSlug).toBe('savassinha');
      expect(info.titulo).toBe('Savassinha');
      expect(info.trilha).toEqual(['Igarape Pedra Grande (MG)', 'Grupo Estacionamento', 'Savassinha']);
    });

    it('deve extrair informações para rota de 4 níveis (pico, grupo, setor e via)', () => {
      const info = extrairInfoDeepLink('/br_mg_igarape_pedra_grande/grupo_estacionamento/savassinha/teto_da_aresta');
      expect(info.ehDeepLink).toBe(true);
      expect(info.tipo).toBe('via');
      expect(info.picoSlug).toBe('br_mg_igarape_pedra_grande');
      expect(info.grupoSlug).toBe('grupo_estacionamento');
      expect(info.setorSlug).toBe('savassinha');
      expect(info.viaSlug).toBe('teto_da_aresta');
      expect(info.titulo).toBe('Teto Da Aresta');
      expect(info.trilha).toEqual(['Igarape Pedra Grande (MG)', 'Grupo Estacionamento', 'Savassinha', 'Teto Da Aresta']);
    });

    it('deve tratar caminhos inválidos ou sem segmentos retornando estrutura nula', () => {
      const info = extrairInfoDeepLink('/');
      expect(info.ehDeepLink).toBe(false);
      expect(info.tipo).toBeNull();
      expect(info.titulo).toBe('');
      expect(info.trilha).toEqual([]);

      const infoVazia = extrairInfoDeepLink(null);
      expect(infoVazia.ehDeepLink).toBe(false);
    });
  });

  describe('renderizarCardSetor', () => {
    it('deve injetar a marcação HTML correta com botões para App Store e Google Play e link para o app', () => {
      const elemento = document.getElementById('fallback-container');
      const info = extrairInfoDeepLink('/br_mg_igarape_pedra_grande/grupo_estacionamento/savassinha');
      
      renderizarCardSetor(elemento, info, 'https://app.arestaclimb.com/br_mg_igarape_pedra_grande/grupo_estacionamento/savassinha');

      expect(elemento.innerHTML).toContain('Savassinha');
      expect(elemento.innerHTML).toContain('Igarape Pedra Grande (MG)');
      expect(elemento.innerHTML).toContain(STORE_LINKS.ios);
      expect(elemento.innerHTML).toContain(STORE_LINKS.android);
      expect(elemento.textContent).toContain('Baixar na');
      expect(elemento.textContent).toContain('App Store');
      expect(elemento.textContent).toContain('Disponível no');
      expect(elemento.textContent).toContain('Google Play');
      expect(elemento.innerHTML).toContain('https://app.arestaclimb.com/br_mg_igarape_pedra_grande/grupo_estacionamento/savassinha');
      expect(elemento.style.display).toBe('block');
    });

    it('deve renderizar tipos diferentes: via e pico', () => {
      const elemento = document.getElementById('fallback-container');
      
      const infoVia = extrairInfoDeepLink('/br_mg_igarape_pedra_grande/grupo_estacionamento/savassinha/teto_da_aresta');
      renderizarCardSetor(elemento, infoVia);
      expect(elemento.textContent).toContain('VIA DE ESCALADA');

      const infoPico = extrairInfoDeepLink('/br_mg_igarape_pedra_grande');
      renderizarCardSetor(elemento, infoPico);
      expect(elemento.textContent).toContain('PICO DE ESCALADA');
    });

    it('deve renderizar sem urlOriginal sem incluir o link secundário', () => {
      const elemento = document.getElementById('fallback-container');
      const info = extrairInfoDeepLink('/br_mg_igarape_pedra_grande/savassinha');
      renderizarCardSetor(elemento, info, '');
      expect(elemento.innerHTML).not.toContain('Já possui o app instalado?');
    });

    it('não deve lançar erro se o elemento for nulo', () => {
      expect(() => renderizarCardSetor(null, {})).not.toThrow();
    });
  });

  describe('inicializarFallback', () => {
    it('deve ocultar a mensagem 404 padrão e exibir o card de setor quando a rota for deep link', () => {
      const mockNav = {
        location: {
          pathname: '/br_mg_igarape_pedra_grande/grupo_estacionamento',
          hostname: 'app.arestaclimb.com',
          href: 'https://app.arestaclimb.com/br_mg_igarape_pedra_grande/grupo_estacionamento'
        }
      };

      const resultado = inicializarFallback(document, mockNav);
      expect(resultado).toBe(true);

      const notFoundCard = document.getElementById('not-found-default');
      const fallbackContainer = document.getElementById('fallback-container');

      expect(notFoundCard.style.display).toBe('none');
      expect(fallbackContainer.style.display).toBe('block');
      expect(fallbackContainer.textContent).toContain('Grupo Estacionamento');
    });

    it('deve manter a página 404 intocada se não for rota de deep link', () => {
      const mockNav = {
        location: {
          pathname: '/pagina-inexistente',
          hostname: 'arestaclimb.com',
          href: 'https://arestaclimb.com/pagina-inexistente'
        }
      };

      const resultado = inicializarFallback(document, mockNav);
      expect(resultado).toBe(false);

      const notFoundCard = document.getElementById('not-found-default');
      expect(notFoundCard.style.display).not.toBe('none');
    });

    it('deve criar fallback-container dinamicamente se ele não existir previamente no documento', () => {
      document.body.innerHTML = '<div id="not-found-default"></div><div class="app-container"></div>';
      const mockNav = {
        location: {
          pathname: '/br_mg_igarape_pedra_grande',
          hostname: 'app.arestaclimb.com',
          href: 'https://app.arestaclimb.com/br_mg_igarape_pedra_grande'
        }
      };

      const resultado = inicializarFallback(document, mockNav);
      expect(resultado).toBe(true);
      expect(document.getElementById('fallback-container')).not.toBeNull();
    });

    it('deve usar document.body se nenhum container de app existir', () => {
      document.body.innerHTML = '';
      const mockNav = {
        location: {
          pathname: '/br_mg_igarape_pedra_grande',
          hostname: 'app.arestaclimb.com',
          href: 'https://app.arestaclimb.com/br_mg_igarape_pedra_grande'
        }
      };

      const resultado = inicializarFallback(document, mockNav);
      expect(resultado).toBe(true);
      expect(document.getElementById('fallback-container')).not.toBeNull();
    });

    it('deve lidar com trilha nula em renderizarCardSetor', () => {
      const elemento = document.getElementById('fallback-container');
      renderizarCardSetor(elemento, { titulo: 'Sem Trilha', trilha: null });
      expect(elemento.textContent).toContain('Sem Trilha');
    });

    it('deve executar com os valores padrão globais de documento e navegador', () => {
      const originalLocation = window.location;
      delete window.location;
      window.location = {
        pathname: '/br_mg_igarape_pedra_grande/grupo_estacionamento',
        hostname: 'app.arestaclimb.com',
        href: 'https://app.arestaclimb.com/br_mg_igarape_pedra_grande/grupo_estacionamento'
      };

      const resultado = inicializarFallback();
      expect(resultado).toBe(true);

      window.location = originalLocation;
    });

    it('deve retornar false graciosamente se documento ou navegador não estiverem disponíveis', () => {
      expect(inicializarFallback(null, null)).toBe(false);
      expect(inicializarFallback(document, {})).toBe(false);
    });
  });
});
