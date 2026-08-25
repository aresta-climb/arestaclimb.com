# Política de Privacidade do Editor Aresta Climb

**Última atualização:** 25 de Agosto de 2026

O **Editor Aresta Climb** é um aplicativo de código aberto voltado para a criação, edição e contribuição colaborativa de croquis de escalada e dados geográficos. A sua privacidade e a transparência no tratamento das suas informações são prioridades para nós.

Esta política descreve de forma clara como os seus dados são coletados, utilizados, armazenados e protegidos durante o uso do Editor.

---

## 1. Informações Coletadas e Finalidade

O Editor Aresta Climb coleta apenas os dados estritamente necessários para viabilizar a autenticação do usuário e a atribuição de autoria nas contribuições de croquis.

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

- **Supabase (Backend de Autenticação e Proxy):** Utilizado para validar a identidade do usuário, gerenciar sessões e intermediar a criação segura de Pull Requests.
- **GitHub:** Utilizado para hospedagem do repositório público de dados, sincronização de branches e abertura de Pull Requests com os dados de croquis.
- **Comunicação Local (Rede Wi-Fi):** O aplicativo permite sincronização direta com o app móvel Aresta Climb na sua rede local privada. Nenhum dado desse fluxo transita por servidores externos.

---

## 3. Telemetria e Rastreamento

O Editor Aresta Climb **não realiza telemetria**, não possui rastreadores de comportamento (*trackers*), pixels ou cookies de análise de uso. Não monitoramos quais croquis você visualiza localmente ou sua frequência de uso.

---

## 4. Retenção e Exclusão de Dados

- Você pode desconectar sua conta a qualquer momento diretamente pela interface do aplicativo, o que removerá imediatamente todos os tokens de sessão armazenados no seu computador.
- Como as sugestões de croquis aprovadas passam a compor a base de dados pública do projeto, o registro histórico de autoria (nome e e-mail no commit/Pull Request) permanece associado à contribuição nos termos da licença de código aberto do projeto.

---

## 5. Código Aberto e Transparência

Por se tratar de um projeto de código aberto, todo o funcionamento do aplicativo, a lógica de rede e os protocolos de autenticação podem ser auditados publicamente no repositório oficial do projeto no GitHub.

---

## 6. Contato

Se você tiver dúvidas sobre esta Política de Privacidade ou sobre o tratamento de seus dados pessoais, entre em contato conosco através do repositório oficial no GitHub:
- [https://github.com/aresta-climb](https://github.com/aresta-climb)

