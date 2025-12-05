
# Blueprint do Projeto: Sistema de Agendamento "Aurora"

## Visão Geral

O objetivo deste projeto é criar um sistema de agendamento de clientes (CRM) moderno, intuitivo e visualmente atraente para um salão de beleza. A aplicação será um Single-Page Application (SPA) construído com React, utilizando Vite para o ambiente de desenvolvimento. O design, codinome "Aurora" (escuro) e "Pêssego Chic" (claro), prioriza uma experiência de usuário limpa, com elementos de "glassmorphism", tipografia moderna e interatividade fluida.

---

## Recursos Implementados

### **Fase 1, 2 & 3: Estrutura, Design e Autenticação**

*   **Autenticação Funcional com Firebase:**
    *   Login com e-mail/senha e login via Google.
    *   Contexto de autenticação (`AuthContext`) que gerencia o estado do usuário em tempo real.
    *   Persistência de login ao recarregar a página.
*   **Estrutura de Navegação:**
    *   **Sidebar Recolhível:** Menu lateral funcional para navegação principal.
    *   **Roteamento:** Uso do `react-router-dom` para gerenciar as rotas.
*   **Páginas Principais:**
    *   **Dashboard:** Tela inicial com cartões de KPI e gráficos.
    *   **Agenda:** Calendário interativo com modal de agendamento funcional.
*   **Design System ("Aurora" / "Pêssego Chic"):**
    *   **Tema Duplo:** Implementação de um tema escuro e claro com troca dinâmica.
    *   **Estilos Globais e Componentes:** Todos os componentes estilizados com um design coeso.

---

## Plano de Ação - Fase 4: Melhorias de UX no Calendário

### **Objetivo:**

Aumentar a clareza e a interatividade do calendário, facilitando a identificação de dias específicos e a visualização rápida dos detalhes dos agendamentos.

### **Passos para a Implementação:**

1.  **Destaque de Dias Especiais:**
    *   Implementar uma lógica no componente `CustomCalendar.jsx` para identificar Sábados, Domingos e feriados.
    *   Utilizar a propriedade `dayPropGetter` da biblioteca `react-big-calendar` para aplicar classes CSS distintas a esses dias.
    *   Adicionar estilos no `CustomCalendar.css` para colorir o fundo desses dias, tornando-os visualmente diferentes dos dias de semana.

2.  **Criação de Tooltips ("Balões") para Eventos:**
    *   Criar um componente customizado para renderizar os eventos no calendário.
    *   Este componente incluirá um "balão" (tooltip) que será exibido ao passar o rato (`onHover`) sobre o evento.
    *   O tooltip mostrará informações detalhadas do agendamento (ex: nome do cliente, serviço, horário completo).
    *   Atualizar o componente `<Calendar>` para usar este novo componente de evento customizado através da propriedade `components`.

3.  **Lista de Feriados:**
    *   Criar uma lista estática com os principais feriados nacionais do Brasil para o ano corrente.
    *   A lógica do `dayPropGetter` irá consultar esta lista para aplicar o estilo de feriado.
