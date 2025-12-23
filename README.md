
# By Borges - Sistema de Agendamento para Salões de Beleza

Prévia da Aplicação

## Visão Geral

**By Borges** é um sistema de gerenciamento de clientes e agendamentos completo, construído com as tecnologias mais modernas de React. Projetado para ser intuitivo, responsivo e visualmente deslumbrante, este projeto é a solução perfeita para pequenos negócios, como salões de beleza, barbearias e estúdios, que precisam de um sistema robusto e fácil de usar.

Este projeto é de **código aberto** e foi desenvolvido para ser facilmente personalizável e "white-label". Com este guia, qualquer desenvolvedor pode configurar, adaptar e vender este sistema como um serviço para seus próprios clientes.

---

## ✨ Funcionalidades Principais

*   **Gestão Completa de Agendamentos:** Crie, edite, visualize e exclua agendamentos em um calendário interativo.
*   **Cadastro de Clientes:** Mantenha um banco de dados de seus clientes com informações de contato.
*   **Catálogo de Serviços:** Organize seus serviços em categorias e defina preços e durações.
*   **Fluxo de Trabalho Inteligente:** Crie novos clientes e novas categorias de serviço diretamente nos modais de agendamento e serviço, sem interromper sua tarefa.
*   **Painel de Administração:** Uma página segura para gerenciar usuários, promover ou rebaixar administradores e deletar contas.
*   **Design Moderno e Responsivo:** Uma interface de usuário premium que funciona perfeitamente em desktops e dispositivos móveis.
*   **Tema Claro e Escuro:** Adapte a aparência para a preferência do usuário ou para as condições de iluminação.
*   **Backend Robusto com Firebase:** Utiliza o Firestore do Firebase, um banco de dados NoSQL em tempo real, para uma performance segura e escalável.
*   **Componentes Reutilizáveis:** Construído com uma arquitetura de componentes limpa e de fácil manutenção.

---

## 🚀 Guia de Início Rápido para Desenvolvedores

Este guia detalha como configurar o projeto, conectá-lo ao seu próprio backend do Firebase e personalizá-lo para seus clientes.

### Pré-requisitos

*   [Node.js](https://nodejs.org/) (versão 18 ou superior)
*   [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
*   [Git](https://git-scm.com/)
*   Uma conta no [Google](https://google.com) para usar o Firebase.

### Passo 1: Clonar e Instalar

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/by-borges-app.git

# Navegue até o diretório do projeto
cd by-borges-app

# Instale as dependências
npm install
```

### Passo 2: Configurar o Firebase para o Cliente (Frontend)

O sistema usa o Firebase para banco de dados e autenticação no lado do cliente. As chaves de acesso são gerenciadas de forma segura através de variáveis de ambiente.

1.  **Crie um Projeto no Firebase:**
    *   Acesse o [console do Firebase](https://console.firebase.google.com/).
    *   Clique em "**Adicionar projeto**".
    *   Dê um nome ao seu projeto (ex: `cliente-salao-app`) e siga as instruções.

2.  **Ative o Firestore e o Authentication:**
    *   No menu lateral, vá em **Construir > Firestore Database** e crie um banco de dados no **modo de produção**.
    *   No menu lateral, vá em **Construir > Authentication** e ative o provedor de **Email/Senha**.

3.  **Obtenha as Chaves de Configuração do Firebase:**
    *   Nas "**Configurações do projeto**" (ícone de engrenagem), vá para a seção "**Seus apps**".
    *   Clique no ícone da web (`</>`) para criar um novo aplicativo da web.
    *   Registre o aplicativo e o Firebase fornecerá um objeto `firebaseConfig`. Você precisará dessas chaves.

4.  **Configure o Arquivo `.env`:**
    *   Na raiz do seu projeto, copie o arquivo `.env.example` e renomeie a cópia para `.env`.
    *   Abra o novo arquivo `.env` e preencha com as chaves do objeto `firebaseConfig`.

    ```env
    # Substitua pelas suas chaves reais do Firebase
    VITE_API_KEY="SUA_API_KEY"
    VITE_AUTH_DOMAIN="SEU_AUTH_DOMAIN"
    VITE_PROJECT_ID="SEU_PROJECT_ID"
    VITE_STORAGE_BUCKET="SEU_STORAGE_BUCKET"
    VITE_MESSAGING_SENDER_ID="SEU_MESSAGING_SENDER_ID"
    VITE_APP_ID="SUA_APP_ID"
    ```

### Passo 3: Configurar o Firebase para o Servidor (Admin)

A funcionalidade de gerenciamento de usuários requer permissões de administrador. Isso é feito de forma segura no lado do servidor, via funções da Vercel.

1.  **Crie uma Chave de Serviço (Service Account):**
    *   No console do Firebase, vá para **Configurações do Projeto > Contas de serviço**.
    *   Clique no botão "**Gerar nova chave privada**".
    *   Isso fará o download de um arquivo `.json`. **Guarde este arquivo em segurança!**

2.  **Configure as Variáveis de Ambiente na Vercel:**
    *   Ao fazer o deploy do seu projeto na Vercel (ou outro provedor), você precisará adicionar as seguintes variáveis de ambiente:
        *   `FIREBASE_PROJECT_ID`: O `project_id` do seu arquivo `.json`.
        *   `FIREBASE_CLIENT_EMAIL`: O `client_email` do seu arquivo `.json`.
        *   `FIREBASE_PRIVATE_KEY`: O `private_key` do seu arquivo `.json`. **Importante:** Copie e cole o valor exatamente como está, incluindo o `-----BEGIN PRIVATE KEY-----` e `-----END PRIVATE KEY-----`.

### Passo 4: Rodar a Aplicação Localmente

```bash
npm run dev
```
Abra seu navegador e acesse `http://localhost:5173`. A aplicação estará rodando, conectada ao seu banco de dados.

### Passo 5: Promover um Usuário a Administrador (Manualmente)

Como a funcionalidade de admin depende de uma configuração segura no servidor (Passo 3), pode ser mais simples e rápido promover o primeiro administrador manualmente pelo console do Firebase.

1.  **Crie uma Conta de Usuário:** Registre uma conta normalmente através da interface da sua aplicação.
2.  **Obtenha o UID do Usuário:**
    *   No [console do Firebase](https://console.firebase.google.com/), vá para a seção **Authentication**.
    *   Encontre o usuário que você acabou de criar e copie o **UID** dele (uma sequência de letras e números).
3.  **Crie um Campo `admin` no Firestore:**
    *   Vá para o **Firestore Database**.
    *   Crie uma coleção chamada `users` (se ainda não existir).
    *   Crie um novo documento. O **ID do documento** deve ser **exatamente o UID** que você copiou.
    *   Dentro desse documento, adicione um campo:
        *   **Nome do campo:** `isAdmin`
        *   **Tipo:** `boolean`
        *   **Valor:** `true`

Pronto! O usuário com aquele UID agora é reconhecido como administrador pela aplicação e verá o link "Gerenciar Usuários" na barra lateral.

---

## 🎨 Customização e White-Labeling

*   **Mudar o Tema e as Cores:** Altere as variáveis de cor em `src/index.css`.
*   **Alterar Nomes e Logos:** Procure por "By Borges" e substitua pela marca do seu cliente.

## ☁️ Implantação (Deploy)

Quando a customização estiver pronta, faça o deploy em um serviço como a **Vercel** ou **Netlify**, lembrando de configurar as variáveis de ambiente do Firebase (Passo 2 e 3).
