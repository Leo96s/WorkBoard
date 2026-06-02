# Use Cases - WorkBoard

Diagramas de use cases em notação UML com atores, relações `<<include>>` e `<<extend>>`.

---

## 🔐 Autenticação (UC-AUTH)

```mermaid
graph LR
    actor_u(["👤 Utilizador\nNão Autenticado"])

    subgraph boundary["Sistema WorkBoard — Autenticação"]
        UC1(["AUTH-RF-001\nEnviar Credenciais"])
        UC2(["AUTH-RF-002\nValidar Basic Auth"])
        UC3(["AUTH-RF-003\nAutorizar Acesso"])
    end

    actor_u --- UC1
    UC1 -.->|«include»| UC2
    UC2 -.->|«include»| UC3
```

**Associações:**
- `Utilizador` inicia **Enviar Credenciais**
- Enviar Credenciais `«include»` Validar Basic Auth — a validação é sempre executada
- Validar Basic Auth `«include»` Autorizar Acesso — acesso é concedido após validação

---

## 📊 Gestão de Boards (UC-BOARD)

```mermaid
graph LR
    actor_u(["👤 Utilizador\nAutenticado"])

    subgraph boundary["Gestão de Boards"]
        UC1(["BOARD-RF-001\nListar Boards"])
        UC2(["BOARD-RF-002\nVer Board Details"])
        UC3(["BOARD-RF-003\nCriar Board"])
        UC4(["BOARD-RF-004\nSeed Colunas Padrão"])
        UC5(["BOARD-RF-005\nApagar Board"])
        UC7(["BOARD-RF-007\nSelecionar Board Ativo"])
    end

    actor_u --- UC1
    actor_u --- UC3
    actor_u --- UC5
    actor_u --- UC7

    UC1 -.->|«include»| UC2
    UC3 -.->|«include»| UC4
```

**Notas:**
- Listar Boards `«include»` Ver Board Details — ao listar, é sempre carregado o detalhe do board selecionado
- Criar Board `«include»` Seed Colunas Padrão — criação de um board inclui sempre a criação das 3 colunas padrão
- **Restrição:** não é possível apagar o único board existente; o sistema mantém sempre ≥ 1 board

---

## 🎨 Gestão de Colunas (UC-COLUMN)

```mermaid
graph LR
    actor_u(["👤 Utilizador\nAutenticado"])

    subgraph boundary["Gestão de Colunas"]
        UC1(["COL-RF-001\nCriar Coluna"])
        UC2(["COL-RF-002\nVer Colunas do Board"])
        UC3(["COL-RF-003\nAtualizar Coluna"])
        UC4(["COL-RF-004\nApagar Coluna"])
        UC5(["COL-RF-005\nDefinir Cor"])
        UC6(["COL-RF-006\nReordenar Drag&Drop"])
        UC7(["Remover Tarefas\nem Cascata"])
    end

    actor_u --- UC1
    actor_u --- UC2
    actor_u --- UC3
    actor_u --- UC4
    actor_u --- UC6

    UC1 -.->|«include»| UC5
    UC4 -.->|«extend»| UC7
```

**Notas:**
- Criar Coluna `«include»` Definir Cor — toda a criação de coluna inclui a escolha de cor
- Apagar Coluna `«extend»` Remover Tarefas em Cascata — ao apagar uma coluna, todas as suas tarefas são removidas

---

## ✅ Gestão de Tarefas (UC-TASK)

```mermaid
graph LR
    actor_u(["👤 Utilizador\nAutenticado"])

    subgraph boundary_tasks["Gestão de Tarefas"]
        UC1(["TASK-RF-001\nListar Tarefas"])
        UC2(["TASK-RF-003\nCriar Tarefa"])
        UC3(["TASK-RF-004\nAtualizar Tarefa"])
        UC4(["TASK-RF-005\nApagar Tarefa"])
        UC5(["TASK-RF-006\nMover entre Colunas"])
    end

    subgraph boundary_filters["Filtros"]
        UF1(["TASK-RF-007\nFiltrar por Board"])
        UF2(["TASK-RF-008\nFiltrar por Coluna"])
        UF3(["TASK-RF-009\nFiltrar por Responsável"])
        UF4(["TASK-RF-010/013\nGerir Tags"])
    end

    actor_u --- UC1
    actor_u --- UC2
    actor_u --- UC3
    actor_u --- UC4
    actor_u --- UC5

    UC1 -.->|«include»| UF1
    UC1 -.->|«include»| UF2
    UC1 -.->|«include»| UF3
    UC2 -.->|«extend»| UF4
    UC3 -.->|«extend»| UF4
```

**Notas:**
- Listar Tarefas `«include»` Filtrar por Board / Coluna / Responsável — os filtros são parte integrante da listagem
- Criar/Atualizar Tarefa `«extend»` Gerir Tags — a gestão de tags é opcional ao criar ou editar uma tarefa

---

## 🖥️ Interface do Utilizador (UC-UI)

```mermaid
graph LR
    actor_u(["👤 Utilizador\nAutenticado"])

    subgraph boundary_kanban["Kanban Board"]
        UI1(["UI-RF-01\nVer Layout Kanban"])
        UI2(["UI-RF-02/03/04\nDrag & Drop"])
        UI3(["UI-RF-10/13/14\nApresentação de Dados"])
    end

    subgraph boundary_modais["Modais"]
        UM1(["UI-RF-05\nModal Criar Tarefa"])
        UM2(["UI-RF-06\nModal Editar Tarefa"])
        UM3(["UI-RF-08/09\nModal Board / Coluna"])
        UM4(["UI-RF-15\nSeleção de Coluna"])
    end

    subgraph boundary_val["Validação"]
        UV1(["UI-RF-11\nValidar Formulários"])
        UV2(["UI-RF-12\nResponsividade"])
    end

    actor_u --- UI1
    actor_u --- UM1
    actor_u --- UM2
    actor_u --- UM3

    UI1 -.->|«include»| UI2
    UI1 -.->|«include»| UI3
    UM1 -.->|«include»| UV1
    UM2 -.->|«include»| UV1
    UM3 -.->|«include»| UV1
    UM1 -.->|«extend»| UM4
    UM2 -.->|«extend»| UM4
```

**Notas:**
- Ver Layout Kanban `«include»` Drag & Drop e Apresentação de Dados — são sempre parte da visualização
- Todos os Modais `«include»` Validar Formulários — validação é sempre executada nos formulários
- Modal Criar/Editar Tarefa `«extend»` Seleção de Coluna — seleção de coluna é opcional/contextual

---

## 📋 Mapa de Requisitos para Use Cases

| Requisito | Use Case | Categoria |
|---|---|---|
| AUTH-RF-001 a 003 | UC-AUTH | Autenticação |
| BOARD-RF-001 a 007 | UC-BOARD | Gestão de Boards |
| COL-RF-001 a 006 | UC-COLUMN | Gestão de Colunas |
| TASK-RF-001 a 013 | UC-TASK | Gestão de Tarefas |
| UI-RF-01 a 15 | UC-UI | Interface do Utilizador |

---

**Última Atualização:** 30 de Maio de 2026  
**Versão:** v0.4.0

## 🔄 Fluxo Completo de Utilização (UC-FLOW)

```mermaid
sequenceDiagram
    actor User as 👤 Utilizador
    participant Auth as 🔐 Autenticação
    participant Board as 📊 Boards
    participant Col as 🎨 Colunas
    participant Task as ✅ Tarefas
    participant UI as 🖥️ Interface
    
    User->>Auth: 1. Autenticar (Basic Auth)
    Auth-->>User: ✓ Autorizado
    
    User->>Board: 2. Selecionar/Criar Board
    Board-->>UI: Carregar board
    
    UI-->>User: 3. Ver Colunas
    User->>Col: Visualizar colunas
    
    User->>Task: 4. Criar Tarefa
    Task-->>User: Formulário Modal
    
    User->>Task: 5. Adicionar Tags
    Task-->>UI: Tags sugeridas
    
    User->>Task: 6. Organizar Tarefas
    Task->>UI: Mover entre colunas
    UI-->>User: ✓ Posição atualizada
    
    User->>Task: 7. Editar Tarefas
    Task-->>User: Modal pré-preenchido
    
    User->>Task: 8. Apagar Tarefas (se necessário)
    Task-->>UI: Remover do board
    
    User->>UI: 9. Filtrar/Pesquisar
    UI-->>User: Resultados filtrados
    
    User->>UI: 10. Arrastar e Reordenar
    UI-->>User: ✓ Kanban Atualizado
```

**Segurança**: Basic Auth Middleware valida todas as requisições  
**Filtros**: Board | Coluna | Responsável | Tags (sugestões)  
**Sincronização**: Todas as operações sincronizadas com o backend em tempo real

---

## 📋 Mapa de Requisitos para Use Cases

| Requisito | Use Case | Categoria |
|---|---|---|
| RF-AUTH-01,02,03 | UC-AUTH | Autenticação |
| RF-BOARD-01 a 07 | UC-BOARD | Gestão de Boards |
| RF-COL-01 a 06 | UC-COLUMN | Gestão de Colunas |
| RF-TASK-01 a 13 | UC-TASK | Gestão de Tarefas |
| RF-UI-01 a 15 | UC-UI | Interface do Utilizador |

---

**Última Atualização**: 2 de Junho de 2026  
**Versão**: v1.0.0
