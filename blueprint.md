
# Blueprint do Projeto: Sistema de Agendamento "Aurora"

## Visão Geral

O objetivo deste projeto é criar um sistema de agendamento de clientes (CRM) moderno, intuitivo e visualmente atraente para um salão de beleza. A aplicação será um Single-Page Application (SPA) construído com React, utilizando Vite para o ambiente de desenvolvimento. O design, codinome "Aurora" (escuro) e "Pêssego Chic" (claro), prioriza uma experiência de usuário limpa, com elementos de "glassmorphism", tipografia moderna e interatividade fluida.

---

## Recursos Implementados

### **Estrutura e Navegação**

*   **Autenticação Completa:**
    *   Tela de Login com e-mail/senha e botão para login via Google.
    *   Contexto de autenticação (`AuthProvider`) para gerenciar o estado do usuário de forma global e persistente.
*   **Navegação Fluida:**
    *   **Sidebar Recolhível:** Menu lateral para navegação principal, com estado gerenciado pelo `SidebarProvider`.
    *   **Roteamento Centralizado:** `react-router-dom` configura todas as rotas da aplicação (`/`, `/agenda`, `/login`) no componente `App.jsx`.

### **Design System ("Aurora" / "Pêssego Chic")**

*   **Tema Duplo Dinâmico:**
    *   Implementação de um tema escuro ("Aurora") e um tema claro ("Pêssego Chic").
    *   `ThemeProvider` gerencia a troca de tema em toda a aplicação.
*   **Estilos Globais e Visuais:**
    *   `index.css` define as paletas de cores, fontes e um fundo animado com "blobs" de gradiente.
    *   Componentes utilizam o efeito de "glassmorphism", bordas com "glow" e animações sutis para uma interface moderna.

### **Funcionalidades Principais**

*   **Dashboard Interativo:**
    *   Tela inicial com cartões de KPI (Key Performance Indicators).
    *   Gráficos para visualização da evolução de receita e novos clientes.
*   **Agenda Inteligente:**
    *   Calendário interativo para visualização de agendamentos.
    *   **Destaque de Feriados e Fins de Semana:**
        *   Integração com a `brasilapi.com.br` via `axios` para buscar dinamicamente os feriados nacionais do ano corrente.
        *   O calendário aplica estilos visuais distintos para Sábados, Domingos e feriados, melhorando a visualização e o planejamento.
        *   Cores personalizadas no `CustomCalendar.css` diferenciam os dias, mantendo a identidade visual "Aurora".
    *   **Modal de Agendamento:** Permite a criação de novos eventos na data selecionada.

### **Correções e Refatorações Recentes**

*   **Centralização de Provedores:** Todos os contextos da aplicação (Auth, Theme, Sidebar) foram centralizados no `App.jsx` para garantir a ordem correta de inicialização e evitar erros de escopo.
*   **Correção de Bugs de UI/UX:** Resolvidos problemas de layout na `Sidebar`, funcionalidade dos botões (recolher/sair) e sobreposição do modal na `Agenda`.

---

## Próximos Passos

*   Implementar a funcionalidade de salvar, editar e excluir agendamentos no calendário.
*   Conectar o back-end para persistir os dados de agendamentos e usuários.
*   Desenvolver a seção de gestão de clientes.
