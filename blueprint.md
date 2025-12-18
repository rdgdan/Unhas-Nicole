# Blueprint do Projeto: By Borges - Nail Design

## Visão Geral

Este documento serve como a fonte central de verdade para a arquitetura, design e funcionalidades da aplicação "By Borges". É um sistema de gerenciamento de clientes e agendamentos construído em React, projetado para ser intuitivo, responsivo e visualmente atraente.

---

## Histórico de Implementação

(O histórico anterior, incluindo a v1.3, permanece o mesmo)

---

## Plano de Implementação Atual: Fluxo de Categoria Definitivo

**Solicitação Crítica do Usuário (Evolução):**

Após a implementação do seletor de categorias no modal de serviço, o usuário identificou uma falha de fluxo de trabalho: a incapacidade de criar uma nova categoria *dentro* do próprio modal. A sugestão foi aprimorar a interface para permitir tanto a seleção de uma categoria existente quanto a criação de uma nova dinamicamente, evitando a interrupção da tarefa.

**Plano de Ação Aprovado (v2):**

1.  **Refatoração do Modal de Serviço (`ServiceModal.jsx`):**
    *   Introduzir um estado `isCreatingCategory` para gerenciar a interface do usuário.
    *   Implementar uma UI de modo duplo: 
        *   **Modo Padrão:** Exibir o `<select>` para escolher uma categoria existente.
        *   **Modo de Criação:** Exibir um `<input type="text">` para o nome da nova categoria.
    *   Adicionar um botão ou link para alternar entre os dois modos.

2.  **Expansão do Contexto de Dados (`DataContext.js`):**
    *   Criar e exportar uma nova função assíncrona, `addServiceCategory`.
    *   Esta função receberá o nome da nova categoria, a adicionará à coleção `service_categories` no Firestore e retornará o `id` do documento recém-criado.

3.  **Lógica de Submissão Inteligente (`handleSubmit` em `ServiceModal.jsx`):**
    *   Se `isCreatingCategory` for verdadeiro, a função primeiro chamará `addServiceCategory`.
    *   Ela então usará o `id` retornado para o campo `categoryId` ao criar o novo serviço.
    *   Se for falso, o comportamento permanece o mesmo, usando o `id` do `<select>`.

4.  **Estilização (`ServiceModal.css`):**
    *   Garantir que os novos elementos da interface (campo de texto, botão de alternância) estejam perfeitamente alinhados com o design visual do modal.
