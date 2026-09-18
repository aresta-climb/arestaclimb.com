# Guia de Implantação: Telemetria Umami + Supabase + Cloudflare

Este guia documenta o passo a passo para colocar em produção a infraestrutura autohospedada de telemetria analítica sem cookies do ecossistema **Aresta Climb**, conectada ao banco PostgreSQL existente no **Supabase**, servida via **Vercel** e roteada com segurança no **Cloudflare**.

---

## 1. Visão Geral da Arquitetura

```
+--------------------------------------------------------------------------+
|                  ARQUITETURA DE TELEMETRIA PRIVADA                       |
+--------------------------------------------------------------------------+

               arestaclimb.com & app.arestaclimb.com
                               |
                               | (Script assíncrono < 2 KB)
                               v
            analytics.arestaclimb.com (Cloudflare Edge)
                               |
                               | (Proxy Seguro com SSL)
                               v
                     Vercel (App Umami Node.js)
                               |
                               | (Conexão Pooler / Postgres)
                               v
                     Supabase (PostgreSQL)
               (Armazenamento de eventos anônimos)
```

- **Custo mensal estimado:** R$ 0,00 (100% suportado nas camadas gratuitas da Vercel, Supabase e Cloudflare).
- **Capacidade:** Suporta mais de 3,5 milhões de eventos no plano gratuito do Supabase (500 MB).
- **Privacidade:** 100% aderente à LGPD/GDPR sem necessidade de banners de consentimento.

---

## 2. Passo 1: Configuração do Banco de Dados no Supabase

O Umami se comunica diretamente com o PostgreSQL e gerencia suas próprias migrações de schema na inicialização.

1. Acesse o painel do seu projeto no [Supabase](https://supabase.com/dashboard).
2. Vá em **Project Settings** $\rightarrow$ **Database**.
3. Na seção **Connection string**, selecione a aba **URI**.
4. Copie a URL de conexão no formato:
   ```text
   postgresql://postgres:[SUA-SENHA]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
   *(Substitua `[SUA-SENHA]` pela senha do banco de dados do Supabase).*

> [!TIP]
> Caso utilize o Transaction Pooler do Supabase (porta 6543), adicione o parâmetro `?pgbouncer=true` no final da URL.

---

## 3. Passo 2: Deploy da Aplicação Umami na Vercel

1. Faça um fork do repositório oficial do Umami no GitHub:
   [https://github.com/umami-software/umami](https://github.com/umami-software/umami)
2. Acesse o seu painel na [Vercel](https://vercel.com) e clique em **Add New...** $\rightarrow$ **Project**.
3. Importe o repositório forked do Umami.
4. Na tela de configuração de variáveis de ambiente (**Environment Variables**), adicione:
   - `DATABASE_URL`: A string de conexão obtida no Supabase (Passo 1).
   - `APP_SECRET`: Uma string aleatória longa (mínimo de 32 caracteres) usada para criptografia de sessões.
     *(Você pode gerar uma no terminal executando: `openssl rand -hex 32`)*
5. Clique em **Deploy**. A Vercel executará a build do Next.js e o Umami criará as tabelas necessárias no Supabase.

---

## 4. Passo 3: Configuração de DNS no Cloudflare

No painel de gerenciamento de DNS da zona `arestaclimb.com` no Cloudflare, crie dois registros:

### Registro 1: Painel e Coletor de Analytics
- **Tipo:** `CNAME`
- **Nome:** `analytics`
- **Destino:** `cname.vercel-dns.com` (ou o domínio do deploy fornecido pela Vercel)
- **Status do Proxy:** Ativado (Nuvem Laranja)
- **SSL/TLS:** Modo *Full (Strict)*

### Registro 2: Subdomínio de Deep Links
- **Tipo:** `CNAME`
- **Nome:** `app`
- **Destino:** `aresta-climb.github.io` ou o endpoint do Cloudflare Pages (`arestaclimb.pages.dev`)
- **Status do Proxy:** Ativado (Nuvem Laranja)

---

## 5. Passo 4: Primeiro Acesso e Configuração do Site no Painel

1. Acesse `https://analytics.arestaclimb.com` no navegador.
2. Faça login com as credenciais padrão de fábrica:
   - **Usuário:** `admin`
   - **Senha:** `umami`
3. **Importante:** Vá imediatamente em **Settings** $\rightarrow$ **Profile** e altere a senha do usuário `admin`.
4. Vá em **Settings** $\rightarrow$ **Websites** e clique em **Add Website**:
   - **Name:** `Aresta Climb`
   - **Domain:** `arestaclimb.com`
5. Copie o **Website ID** (UUID) gerado e configure-o no atributo `data-website-id` das páginas HTML se for diferente do identificador fixado.

---

## 6. Convenção de Parâmetros UTM para Divulgação

Ao criar links externos e QR Codes físicos para colocar em academias, rochas ou redes sociais, utilize os seguintes padrões:

| Finalidade | Exemplo de Link |
| :--- | :--- |
| **Instagram (Bio)** | `https://arestaclimb.com/?utm_source=instagram&utm_medium=bio` |
| **Instagram (Stories)** | `https://arestaclimb.com/app?utm_source=instagram&utm_medium=stories` |
| **QR Code em Ginásio** | `https://arestaclimb.com/app?utm_source=ginasio-fabrica&utm_medium=qrcode` |
| **Comunidade WhatsApp** | `https://arestaclimb.com/comunidade?utm_source=site&utm_medium=banner` |
| **Deep Link de Via** | `https://app.arestaclimb.com/via/diedro-pacoca?utm_source=whatsapp&utm_medium=share` |
