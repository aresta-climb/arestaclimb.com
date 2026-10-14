import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Verificação de Domínio no Flathub', () => {
  const caminhoArquivoFlathub = path.resolve('public/.well-known/org.flathub.VerifiedApps.txt');
  const caminhoHeaders = path.resolve('public/_headers');

  it('o arquivo org.flathub.VerifiedApps.txt deve existir em public/.well-known/', () => {
    expect(fs.existsSync(caminhoArquivoFlathub)).toBe(true);
  });

  it('o arquivo org.flathub.VerifiedApps.txt deve conter estrutura válida de verificação do Flathub', () => {
    const conteudo = fs.readFileSync(caminhoArquivoFlathub, 'utf8');
    // Deve conter comentário identificando a aplicação com.arestaclimb.Editor
    expect(conteudo).toContain('com.arestaclimb.Editor');
  });

  it('o arquivo public/_headers deve configurar cabeçalhos adequados para org.flathub.VerifiedApps.txt', () => {
    const conteudoHeaders = fs.readFileSync(caminhoHeaders, 'utf8');
    expect(conteudoHeaders).toContain('/.well-known/org.flathub.VerifiedApps.txt');
    expect(conteudoHeaders).toMatch(/\/\.well-known\/org\.flathub\.VerifiedApps\.txt[\s\S]*?Content-Type:\s*text\/plain/);
    expect(conteudoHeaders).toMatch(/\/\.well-known\/org\.flathub\.VerifiedApps\.txt[\s\S]*?Access-Control-Allow-Origin:\s*\*/);
  });
});
