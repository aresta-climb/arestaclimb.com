# Política de Privacidade do Editor Aresta Climb

**Última atualização:** 1 de Setembro de 2026

O **Editor Aresta Climb** é um aplicativo de código aberto voltado para a criação, edição e contribuição colaborativa de croquis de escalada e dados geográficos. A sua privacidade e a transparência no tratamento das suas informações são prioridades para nós.

Esta política descreve de forma clara como os seus dados são coletados, utilizados, armazenados e protegidos durante o uso do Editor.

---

## 1. Informações Coletadas e Finalidade

O Editor Aresta Climb coleta apenas os dados estritamente necessários para viabilizar a autenticação do usuário, atribuição de autoria e envio silencioso de relatórios de falhas técnicas (crash reporting).

### a) Dados de Identificação Pessoal (Nome e E-mail)
Ao utilizar os recursos de login e submissão de sugestões de croquis, o aplicativo coleta:
- **Nome completo ou de exibição**;
- **Endereço de e-mail**.

**Finalidade do tratamento:**
1. **Autenticação:** Permitir o acesso seguro aos serviços de submissão e sincronização via Supabase Auth e/ou GitHub OAuth.
2. **Atribuição de Autoria e Histórico:** Atribuir corretamente os créditos das alterações realizadas em croquis e incluí-las nos Pull Requests submetidos ao repositório público do projeto (via assinatura padrão de contribuição de código aberto *Signed-off-by*).
3. **Segurança e Controle de Acesso:** Garantir que apenas o autor de uma sugestão possa atualizar a sua respectiva branch de edição, evitando sobreposição de dados.

### b) Credenciais e Tokens de Acesso
- **Armazenamento Seguro Local:** Tokens de sessão (JWT) e tokens de autorização do GitHub OAuth são armazenados com criptografia no cofre de credenciais do próprio sistema operacional (como o *Windows Credential Manager* / *Keyring*).
- O aplicativo não armazena suas senhas em texto puro.

---

## 2. Compartilhamento e Serviços de Terceiros

O Aresta Climb **não vende, não aluga e não compartilha** seus dados pessoais com terceiros para fins publicitários ou comerciais.

As únicas comunicações realizadas pelo aplicativo ocorrem com serviços de infraestrutura estritamente necessários:

- **Cloudflare:** Utilizado para arquivos estáticos, prévias e interação com o GitHub.
- **Supabase (Backend de Autenticação e Proxy):** Utilizado para validar a identidade do usuário, gerenciar sessões e intermediar a criação segura de Pull Requests.
- **GitHub:** Utilizado para hospedagem do repositório público de dados, sincronização de branches e abertura de Pull Requests com os dados de croquis.
- **Sentry (Monitoramento de Estabilidade e Telemetria de Falhas):** Utilizado para recepção e agregação automática de relatórios de erros não tratados e exceções críticas, viabilizando a correção rápida de problemas no software pelos desenvolvedores. Para mais informações sobre o tratamento de dados pela plataforma, consulte a [Política de Privacidade do Sentry](https://sentry.io/privacy/).
- **Comunicação Local (Rede Wi-Fi):** O aplicativo permite sincronização direta com o app móvel Aresta Climb na sua rede local privada. Nenhum dado desse fluxo transita por servidores externos.

---

## 3. Telemetria Silenciosa, Diagnóstico de Falhas e Sanitização Universal

Para garantir a estabilidade contínua do Editor Aresta Climb em ambiente de produção Windows, o aplicativo conta com telemetria 100% automática e silenciosa integrada ao Sentry:

1. **Relatórios Automáticos de Falha (*Crash Reports*):** Quando ocorre uma exceção inesperada ou encerramento anômalo do aplicativo, um relatório técnico de diagnóstico é compilado e transmitido silenciosamente aos desenvolvedores em segundo plano.
2. **Sanitização Universal de Caminhos Locais:** Todos os relatórios passam por um filtro de higienização estrita antes do envio: qualquer caminho de arquivo absoluto do sistema operacional que contenha pastas pessoais ou nomes de usuário é automaticamente ofuscado e substituído por variáveis genéricas (como `%appdata%`, `%localappdata%`, `%userprofile%` ou `%temp%`).
3. **Diário de Comandos e Anonimização de Mídias:** Para permitir que os desenvolvedores reproduzam com exatidão a sequência de ações que culminou em uma falha técnica, o histórico de comandos de edição é enviado como anexo de diagnóstico. Todas as fotos, mapas e arquivos binários incluídos nesse histórico são previamente convertidos em imagens sólidas dummy (WebP de dimensões idênticas mas sem o conteúdo visual real do usuário), garantindo a proteção total das fotos em rascunho.
4. **Sem Rastreamento Comercial:** O Editor **não** possui rastreadores de publicidade, não traça perfis comportamentais e não monetiza qualquer informação do usuário.

O processamento e a infraestrutura dos relatórios técnicos de falhas obedecem aos termos da [Política de Privacidade do Sentry](https://sentry.io/privacy/).

---

## 4. Comunicação com Dispositivos e Prévia em Tempo Real
O Editor possui a funcionalidade de conectar o aplicativo móvel do Aresta Climb no seu celular para prévia interativa e *Live Reload* dos croquis em edição:
- **Rede Local (Wi-Fi)**: Comunicação direta ponto-a-ponto entre o seu computador e o celular sem passar pela internet.
- **Nuvem (Retransmissor `previa.arestaclimb.com`)**:
  - Disponível para usuários autenticados no Aresta Editor.
  - Os arquivos do croqui trafegam em fluxo (*streaming* efêmero em memória) diretamente entre o computador e o celular conectado, sem persistência de conteúdo nos servidores da nuvem.
  - Registros técnicos da sessão (identificador do usuário, IP público de conexão, IP local informado e horários de início/término) são mantidos no banco de dados exclusivamente para segurança da infraestrutura, diagnóstico e auditoria de tráfego, sendo **excluídos automaticamente após 90 dias**.

---

## 5. Retenção e Exclusão de Dados

- Você pode desconectar sua conta a qualquer momento diretamente pela interface do aplicativo, o que removerá imediatamente todos os tokens de sessão armazenados no seu computador.
- Como as sugestões de croquis aprovadas passam a compor a base de dados pública do projeto, o registro histórico de autoria (nome e e-mail no commit/Pull Request) permanece associado à contribuição nos termos da licença de código aberto do projeto.

---

## 6. Código Aberto e Transparência

Por se tratar de um projeto de código aberto, todo o funcionamento do aplicativo, a lógica de rede e os protocolos de autenticação podem ser auditados publicamente no repositório oficial do projeto no GitHub.

---

## 7. Contato

Se você tiver dúvidas sobre esta Política de Privacidade ou sobre o tratamento de seus dados pessoais, entre em contato conosco em contato@arestaclimb.com. 

