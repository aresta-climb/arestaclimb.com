# Princípios de Engenharia e Regras do Agente

Para garantir que o desenvolvimento do sistema, seja por humanos ou por agentes autônomos de IA (como Google Antigravity e OPSX), mantenha-se coeso, testável, sustentável e simples, adotamos os seguintes princípios basilares e inegociáveis. 

Estes princípios devem guiar toda e qualquer nova implementação ou alteração no repositório, independentemente da tecnologia ou framework subjacente.

## I. Tudo em Português
Todo o repositório deve **OBRIGATORIAMENTE** ser em português brasileiro. Isso inclui, mas não se limita a: documentação, especificações (OpenSpec), comentários de código, nomes de funções, regras de negócio e esquemas de banco de dados.
*Exceções:* Nomes de bibliotecas de terceiros, APIs externas, termos técnicos consolidados do ecossistema de desenvolvimento, e títulos de seção exigidos em inglês pelo OpenSpec.

## II. Eficiência e Delegação de Carga (Client-Side First)
Toda nova funcionalidade deve ser pensada para maximizar a eficiência de infraestrutura e garantir o **menor custo de operação possível**:
- A carga computacional pesada (como geração de relatórios, processamento de imagens ou documentos) deve ser sempre que possível deslocada para o **client-side** (no navegador do usuário).
- O backend deve ser mantido como uma camada fina e leve, atuando estritamente como roteador, validador de regras de segurança e porta de acesso aos dados.
- Evite abstrações prematuras e mantenha o código simples e direto.

## III. Imperativo do Teste em Primeiro Lugar (TDD)
O Desenvolvimento Orientado a Testes (Test-Driven Development) é **obrigatório** e inegociável.
- O ciclo Red-Green-Refactor (Vermelho-Verde-Refatorar) deve ser estritamente seguido.
- Nenhum componente visual, serviço ou rota de API deve ser implementado sem que haja testes de unidade falhando primeiramente.
- Mantenha altos níveis de cobertura de testes (Unit Test Coverage).

## IV. Testes de Integração em Primeiro Lugar
Antes de focar em testes unitários profundos, garanta que os contratos e as fronteiras do sistema comuniquem-se corretamente.
- Teste sempre a integração entre os módulos do sistema e a comunicação entre o frontend e o backend.
- Isso assegura que os requisitos funcionais inter-sistemas sejam atendidos logo no início do desenvolvimento.

## V. Desacoplamento Estrito
Embora componentes possam conviver no mesmo repositório, suas responsabilidades devem ser independentes e testáveis isoladamente.
- O frontend não deve ter conhecimento direto de como os dados são armazenados.
- O backend não deve ter conhecimento de como os dados serão apresentados.
- As regras de negócio centrais devem estar isoladas de detalhes de infraestrutura ou de interface do usuário.

---
> **Nota para Agentes Autônomos**: Vocês estão estritamente obrigados a considerar este documento como diretriz de mais alta prioridade ao planejar a arquitetura, sugerir refatorações, gerenciar arquivos ou implementar novas rotinas (incluindo o uso de ferramentas como o `opsx-apply`).
