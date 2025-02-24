# 📦 Testefora69

Testefora69

## 🚀 Tecnologias Utilizadas
- [Node](https://nodejs.org/pt) Versão 20.17.0
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Firebase](https://firebase.google.com/)
- [Prisma](https://www.prisma.io/) *(se estiver usando)*

## 📂 Estrutura do Projeto

```
/project-root
│── app/
│   ├── admin/          # Arquivos de administrador
        |---/products
              |--- Edit          #Frontend da edição de produtos
              |--- View          #Frontend de Rota Dinâmica para cada produto
              |--- Page.tsx      #Frontend de Adicionar novo produto

|   ├── api/                     #Backend do projeto
        |--- /admin              #Rota de administrador
        |--- /auth               #Rota de autenticação
        |--- /products           #Rotas de produtos
        |--- /register           #Rota de registro de usuario
        
|   ├── cart/                    #Frontend do Carrinho de compras

|   ├── dashboard/               #Frontend do dashboard do administrador

|   ├── login/                   #Frontend do login de usuário

|   ├── register/                #Frontend do Registro de usuário
├── 🏠 Page.tsx                  #Página principal ou seja a home do projeto 
-------------------------------------------------------------------- As páginas entre admin e registro estão dentro da /app
├── components/                  # Componentes utilizados no projeto como Api do carrinho e SessionProvider
│── public/                      # Arquivos estáticos
├── types/                       # Funções auxiliares
├── lib/                         # Integração com Firebase e APIs
│── .env                         # Variáveis de ambiente
│── .env.local                   # Variáveis de ambiente
│── allowedImageDomains.js       # Manipula os dominios pra colocar imagens e etc
│── package.json                 # Dependências do projeto
│── README.md                    # Documentação
```

## ⚡ Instalação e Uso

1. Clone o repositório:
   ```sh
   git clone https://github.com/Viniciusdacostasilva/Loja-de-roupas.git
   cd Loja-de-roupas
   ```

2. Instale as dependências:
   ```sh
   npm install
   ```

3. Configure as variáveis de ambiente:
   Crie um arquivo `.env.local` na raiz do projeto e adicione:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=XXXXXX
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=XXXXXX
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=XXXXXX
   ```

4. Execute o projeto em ambiente de desenvolvimento:
   ```sh
   npm run dev
   ```

5. Acesse em seu navegador: `http://localhost:3000`

## 🛠️ Principais Funcionalidades

- [x] Autenticação com Firebase
- [x] Dashboard com manipulação de edição, adição ou remoção de produtos
- [x] Integração com banco de dados
- [x] Sistema de login e registro de produtos e usuários 

## 📜 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

💡 **Dica:** Sempre mantenha seu README atualizado para facilitar a colaboração e o uso do seu projeto! 🚀

#
