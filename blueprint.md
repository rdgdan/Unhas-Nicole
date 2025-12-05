
# Blueprint do Projeto: Sistema de Agendamento "Aurora"

## Visão Geral

O objetivo deste projeto é criar um sistema de agendamento de clientes (CRM) moderno, intuitivo e visualmente atraente para um salão de beleza. A aplicação será um Single-Page Application (SPA) construído com React, utilizando Vite para o ambiente de desenvolvimento. O design, codinome "Aurora", prioriza uma experiência de usuário limpa, com elementos de "glassmorphism", tipografia moderna e interatividade fluida.

---

## Recursos Implementados

### **Fase 1-3: Estrutura, Design e Autenticação**

*   **Autenticação Funcional com Firebase:** Login com e-mail/senha e Google, com persistência de sessão.
*   **Estrutura de Navegação:** Sidebar recolhível e roteamento com `react-router-dom`.
*   **Páginas Principais:** Dashboard com KPIs e uma página de Agenda funcional.
*   **Design System "Aurora":** Tema escuro coeso e moderno implementado em todos os componentes.

### **Fase 4: Calendário Avançado**

*   **Design e UX Aprimorados:** O calendário foi redesenhado para ter um visual mais moderno, com dias em formato de quadrados arredondados e um layout mais limpo.
*   **Destaques Visuais:** Fins de semana e feriados são agora destacados a vermelho para fácil identificação.
*   **Integração de Feriados Nacionais:** O calendário consome uma API para buscar e exibir feriados nacionais do Brasil, adicionando inteligência à visualização.

---

## Plano de Ação - Fase 5: Módulo de Gestão de Clientes

### **Objetivo:**

Desenvolver uma página completa para a gestão de clientes, permitindo a visualização, cadastro, edição e exclusão de informações. Esta página será o centro operacional para o gerenciamento da base de clientes e servirá como a fonte de dados para futuros agendamentos no calendário.

### **Passos para a Implementação:**

1.  **Estrutura da Página e Roteamento:**
    *   Adicionar uma nova rota, `/clientes`, no `App.jsx`.
    *   Criar o componente da página principal `src/pages/ClientListPage.jsx`.
    *   Adicionar um novo link de navegação para "Clientes" na `Sidebar`.

2.  **Componente da Lista de Clientes (`ClientList.jsx`):**
    *   Desenvolver uma tabela ou uma lista de cartões para exibir os clientes.
    *   Cada cliente na lista terá botões para "Editar" e "Excluir".
    *   A lista exibirá colunas para Nome, Data do Serviço, Modelo de Unha e Valor.

3.  **Funcionalidades de Filtro e Ordenação (`ClientFilters.jsx`):**
    *   Implementar um componente com os controlos de filtro:
        *   Um seletor de data (ou um campo de texto).
        *   Um campo para filtrar por modelo de unha.
        *   Um seletor ou slider para filtrar por valor.
    *   Adicionar botões ou um seletor para ordenar a lista em ordem alfabética (A-Z) e por valor (maior para menor e vice-versa).

4.  **Cadastro e Edição de Clientes (`ClientForm.jsx`):**
    *   Criar um formulário, provavelmente num modal, que será usado tanto para **cadastrar um novo cliente** como para **editar um cliente existente**.
    *   O botão principal da página, "Cadastrar Novo Cliente", abrirá este formulário.

5.  **Gestão de Dados:**
    *   Começar com uma lista de dados estáticos (`mock data`) para acelerar o desenvolvimento da interface e da lógica de filtros/ordenação.
    *   Num passo seguinte, substituir os dados estáticos pela integração com o **Firebase Firestore** para persistir os dados dos clientes.

6.  **Integração Futura com o Calendário:**
    *   A data associada a cada cliente será, futuramente, usada para criar eventos e agendamentos diretamente no calendário da página "Agenda".
