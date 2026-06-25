# Aresta Climb - Hub Central & Documentação Legal

Bem-vindo ao repositório do site central do ecossistema **Aresta Climb**.
Este repositório é responsável por servir a infraestrutura web de documentação pública e acordos legais, como o Contrato de Licença de Contribuidor (CLA), Termos de Uso e Políticas de Privacidade.

O site foi construído com foco em **performance extrema, tipografia moderna e integração limpa com Markdown**.

## 🚀 Tecnologias Utilizadas

- **[Vite](https://vitejs.dev/):** Utilizado como bundler ultrarrápido e servidor de desenvolvimento.
- **Vanilla JS & CSS:** Zero frameworks pesados. Apenas JavaScript puro e CSS moderno com suporte a variáveis e _glassmorphism_.
- **[Marked.js](https://marked.js.org/):** Para renderizar em tempo real os documentos legais armazenados em formato `.md`.
- **[Vitest](https://vitest.dev/):** Para garantia de qualidade e 100% de cobertura de testes no parser de markdown.

## 🛠️ Arquitetura (MPA)

Este projeto usa a arquitetura de Múltiplas Páginas (MPA) configurada no Vite. As páginas disponíveis (pontos de entrada) são:
- `/cla` ➔ Renderiza `cla.md`
- `/termos-de-uso` ➔ Renderiza `termos-de-uso.md`
- `/politica-de-privacidade` ➔ Renderiza `politica-de-privacidade.md`
- `/privacidade-contribuidores` ➔ Renderiza `privacidade-contribuidores.md`

Os documentos de origem ficam na pasta `/public/docs/`. O arquivo JavaScript `src/main.js` intercepta as requisições e busca o markdown de forma assíncrona para montar o documento renderizado na tela.

## 💻 Como Rodar Localmente

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   *O site estará disponível no endereço local fornecido pelo terminal (geralmente `http://localhost:5173`).*

3. **Rodar a Suíte de Testes:**
   ```bash
   npm run test
   ```
   *(Também garantimos a cobertura total dos testes com `npm run coverage`)*

## 🌐 Build e Deploy (Cloudflare Pages)

A hospedagem está configurada para aproveitar o Edge Global da Cloudflare, garantindo que os termos carreguem instantaneamente em qualquer parte do mundo.

1. **Gere os arquivos de produção:**
   ```bash
   npm run build
   ```
   *Isto processará os assets e gerará a pasta `dist/` com os arquivos finais.*

2. **Deploy Automático:**
   O deploy é automatizado através da integração direta com o **Cloudflare Pages**. Basta realizar o push para a branch `main` e o Cloudflare irá rodar o build e publicar o site na mesma hora.

---
*© 2026 Aresta Climb - Criado com foco na comunidade da escalada.*
