# Princípios de Engenharia Aresta (`arestaclimb.com`)

Para garantir que o nosso código, seja ele escrito por humanos ou por agentes autônomos de IA (como Google Antigravity e OPSX), se mantenha coeso, testável, sustentável e simples, adotamos oito princípios basilares e inegociáveis.

Estes princípios devem guiar toda e qualquer nova implementação, revisão ou refatoração no repositório web e de documentação legal.

## I. Tudo em Português
Todo o repositório deve **OBRIGATORIAMENTE** ser em português brasileiro. Isso inclui, mas não se limita a: documentação, documentos legais públicos, especificações (OpenSpec), comentários de código, docstrings (JSDoc), mensagens de erro, nomes de funções, métodos e variáveis.
*Exceções:* Nomes de bibliotecas de terceiros, APIs nativas do DOM/Web Standards, termos técnicos consolidados do ecossistema e títulos de seção exigidos em inglês pelo schema do OpenSpec.

## II. Modularidade e Desacoplamento (Library-First)
Toda funcionalidade DEVE começar e ser estruturada como um módulo independente.
- Os módulos em `src/` devem ser autossuficientes, testáveis de forma isolada e claramente documentados.
- Evite criar arquivos que sirvam apenas para fins puramente organizacionais; cada módulo separado deve ter um propósito funcional claro e uma interface pública coesa.
- As regras de redirecionamento, telemetria, tema e renderização de Markdown devem estar desacopladas de detalhes rígidos de marcação HTML.

## III. Testes Orientados a Comportamento e Espelhamento 1:1
Os testes devem validar **o que** o código faz (comportamento e efeitos no DOM/navegação), e nunca **como** ele foi implementado internamente.
- **Espelhamento 1:1 Obrigatório**: QUALQUER arquivo `.js` em `src/` DEVE possuir um arquivo `.test.js` correspondente no mesmo diretório. Se decidimos separar código em um arquivo próprio, ele possui por definição uma interface pública que deve ser testada.
- **Um Teste por Comportamento (Behavior-Driven Testing)**: Cada bloco `it()` ou `test()` no Vitest deve verificar um único comportamento observável através da API pública do módulo ou do estado resultante no DOM (seguindo a estrutura *Dado/Quando/Então* ou *Preparar/Agir/Verificar*).
- **Proibição de Change-Detector Tests**: É estritamente proibido escrever testes acoplados à implementação interna (inspecionar variáveis internas, testar detalhes de estrutura privada ou replicar a lógica de produção dentro do asserto). Uma refatoração interna que preserve o comportamento observável nunca deve quebrar os testes.

## IV. 100% de Cobertura Comportamental e TDD (Red-Green-Refactor)
O Desenvolvimento Orientado a Testes (Test-Driven Development) e a cobertura integral são **obrigatórios** e inegociáveis.
- **Ciclo Red-Green-Refactor**: Os testes DEVEM ser escritos e vistos falhar (*Red*) antes do início de qualquer implementação de código de produção (*Green*), seguidos de refatoração (*Refactor*).
- **100% de Test Coverage via Comportamento**: Qualquer alteração submetida deve manter 100% de cobertura de testes (`npm run coverage`) atingida exclusivamente exercitando comportamentos reais pela interface pública.
- **Resolução de Cobertura pelo Design**: Se uma linha ou ramificação (`if/else`, `try/catch`) não puder ser alcançada por um teste de comportamento público, **o defeito está no código de produção** (código morto, validação defensiva redundante ou acoplamento direto de I/O). A solução obrigatória é simplificar o código de produção ou remover a ramificação inalcançável — sendo proibido usar mocks internos ou expor funções privadas para forçar cobertura artificial.

## V. Fidelidade de Produção, Anti-Mocking e Testes de Integração em Primeiro Lugar
A suíte de testes deve ser representativa do comportamento real do site em produção.
- **Testes de Integração em Primeiro Lugar**: Priorize testar os contratos de renderização, leitura de documentos e integração com o DOM real (JSDOM) antes de descer para detalhes isolados.
- **Proibição de Mocks para Código Interno**: É proibido usar `vi.mock` ou `vi.spyOn` para isolar funções ou módulos internos do próprio projeto. Use sempre os módulos reais e árvores DOM reais nos testes.
- **Bibliotecas `test-only` de Fakes Determinísticos**: Para fronteiras externas do navegador (como `fetch` de rede, `localStorage` ou APIs de navegação/telemetria externas), devem ser utilizadas **bibliotecas `test-only` de Fakes determinísticos** em memória (configuráveis inclusive para simular falhas determinísticas de rede/HTTP), evitando reimplementar mocks ad-hoc em cada arquivo `.test.js`.
- **Fakes Também São Bibliotecas Testadas**: Toda biblioteca de Fake (`*Fake.js`) é uma biblioteca de primeira classe e DEVE obrigatoriamente possuir seu próprio arquivo de teste espelhado (`*Fake.test.js`) garantindo que o Fake cumpre fielmente o contrato real.

## VI. Simplicidade, Anti-Abstração e Documentação Contínua
O código DEVE ser simples, declarativo, bem documentado e fácil de compreender.
- Evite abstrações prematuras e códigos "espertos" (complexidade desnecessária). Siga a regra de ouro: *"Melhor um pouco de duplicação do que a abstração errada."*
- Pratique o DRY (Don't Repeat Yourself) de forma prudente: extraia apenas o que for óbvio e simples para reutilização clara.
- Mantenha comentários explicando *o porquê* (intenção) e atualize o `README.md` sempre que adicionar novas páginas MPA, rotas ou documentos legais.

## VII. Inegociabilidade Perante Código Legado (Regra do Escoteiro)
A existência de código ou testes legados no repositório que ainda não sigam integralmente estes padrões **NÃO é desculpa nem precedente** para violá-los.
- Agentes autônomos e desenvolvedores estão proibidos de imitar antipadrões presentes em arquivos vizinhos (como uso excessivo de `vi.spyOn`/`vi.fn` ad-hoc, *change-detector tests* ou identificadores em inglês).
- Sempre que tocar em um arquivo ou módulo existente que viole este `AGENTS.md`, você DEVE refatorar o trecho e os testes afetados para que passem a seguir integralmente estes princípios.

## VIII. Eficiência Client-Side First e Arquitetura Web Leve
Toda funcionalidade web deve ser projetada para **performance extrema, carregamento instantâneo na borda (Cloudflare Pages) e custo operacional mínimo**:
- **Zero Frameworks Pesados**: Mantenha a arquitetura de Múltiplas Páginas (MPA) com Vite, Vanilla JS e CSS moderno.
- **Delegação Client-Side First**: O processamento e a renderização (como conversão de documentos legais Markdown em tempo real via Marked.js, detecção inteligente de plataforma e geração de QR Codes/redirecionamentos) devem ocorrer inteiramente no navegador do usuário.

---
> **Nota para Agentes Autônomos**: Vocês estão estritamente obrigados a considerar este documento como diretriz de mais alta prioridade ao planejar arquitetura, sugerir refatorações, ou implementar novas rotinas (incluindo o uso do OpenSpec).
