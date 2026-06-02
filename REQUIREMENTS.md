# Requisitos do Projeto WorkBoard

Documento de rastreamento dos requisitos funcionais implementados no projeto WorkBoard. Este documento organiza todos os requisitos por categoria e seu estado atual de implementação.

---

## 📋 Tabela de Conteúdos

- [Requisitos do Projeto WorkBoard](#requisitos-do-projeto-workboard)
  - [📋 Tabela de Conteúdos](#-tabela-de-conteúdos)
  - [Autenticação](#autenticação)
  - [Gestão de Boards](#gestão-de-boards)
  - [Gestão de Colunas](#gestão-de-colunas)
  - [Gestão de Tarefas](#gestão-de-tarefas)
  - [Interface do Utilizador](#interface-do-utilizador)
  - [📊 Resumo de Requisitos](#-resumo-de-requisitos)
  - [📝 Notas Técnicas](#-notas-técnicas)
  - [🔄 Próximas Melhorias (Não Implementadas)](#-próximas-melhorias-não-implementadas)

---

## Autenticação

| Id | Nome do Requisito | Descrição | Prioridade | Estado | Restrições | Verificação |
|---|---|---|---|---|---|---|
| RF-AUTH-01 | Autenticação com Basic Auth | O sistema deve autenticar requisições através de Basic Authentication (email/username:password) | Alta | Implementado | Credenciais válidas necessárias para todos os endpoints | Testes ao middleware e endpoints via Swagger |
| RF-AUTH-02 | Middleware de Autenticação | O sistema deve aplicar validação de autenticação em todos os endpoints da API | Alta | Implementado | Middleware configurado no pipeline | Testes de requisições sem autenticação (devem retornar 401) |
| RF-AUTH-03 | Segurança via Headers | O sistema deve aceitar credenciais no header Authorization com formato "Basic [base64]" | Alta | Implementado | Headers HTTP padrão | Testes com ferramentas como Postman/curl |

---

## Gestão de Boards

| Id | Nome do Requisito | Descrição | Prioridade | Estado | Restrições | Verificação |
|---|---|---|---|---|---|---|
| RF-BOARD-01 | Listar Boards | O sistema deve retornar lista de todos os boards via GET `/api/boards` | Alta | Implementado | Autenticação requerida | Teste endpoint GET /api/boards |
| RF-BOARD-02 | Obter Board por ID | O sistema deve retornar um board específico via GET `/api/boards/{id}` | Alta | Implementado | Board deve existir na base de dados | Teste endpoint GET /api/boards/{id} |
| RF-BOARD-03 | Criar Board | O sistema deve permitir criar novo board via POST `/api/boards` com nome | Alta | Implementado | Nome não pode estar vazio; board criado com colunas padrão | Teste endpoint POST /api/boards com payload JSON |
| RF-BOARD-04 | Criar Board com Colunas Padrão | Ao criar um board, o sistema deve gerar automaticamente 3 colunas padrão: "A Fazer", "Em Curso", "Concluído" | Alta | Implementado | Colunas são criadas com IDs únicos e cores predefinidas | Verificar que novo board contém as 3 colunas |
| RF-BOARD-05 | Apagar Board | O sistema deve permitir apagar um board via DELETE `/api/boards/{id}` | Alta | Implementado | Não é possível apagar o último board; todas as tarefas e colunas são eliminadas | Teste que board com tarefas é apagado completamente |
| RF-BOARD-06 | Validação: Último Board | Sistema deve retornar erro ao tentar apagar o único board existente | Média | Implementado | Proteção de dados críticos | Frontend deve exibir mensagem de erro |
| RF-BOARD-07 | Visualizar Boards em Dropdown | O frontend deve listar todos os boards num dropdown para seleção | Alta | Implementado | Boards ordenáveis por drag & drop | Teste manual no frontend |

---

## Gestão de Colunas

| Id | Nome do Requisito | Descrição | Prioridade | Estado | Restrições | Verificação |
|---|---|---|---|---|---|---|
| RF-COL-01 | Criar Coluna | O sistema deve permitir criar nova coluna via POST `/api/boards/{boardId}/columns` com nome e cor | Alta | Implementado | Coluna associada a um board específico; nome obrigatório | Teste endpoint com boardId válido |
| RF-COL-02 | Listar Colunas de um Board | As colunas aparecem automaticamente ao carregar um board | Alta | Implementado | Colunas incluídas na resposta do board | Verificar estrutura retornada por GET /api/boards/{id} |
| RF-COL-03 | Atualizar Coluna | O sistema deve permitir atualizar nome/cor de coluna via PUT `/api/boards/{boardId}/columns/{columnId}` | Alta | Implementado | Apenas nome e cor podem ser alterados | Teste endpoint PUT com dados válidos |
| RF-COL-04 | Apagar Coluna | O sistema deve permitir apagar uma coluna via DELETE `/api/boards/{boardId}/columns/{columnId}` | Alta | Implementado | Tarefas na coluna são eliminadas em cascata | Verificar que tarefas relacionadas são removidas |
| RF-COL-05 | Cores de Coluna | Cada coluna deve ter uma cor para melhor visualização | Média | Implementado | Cores predefinidas: #3B82F6 (azul), #F59E0B (laranja), #10B981 (verde) | Verificar rendering no frontend |
| RF-COL-06 | Reordenar Colunas | O utilizador deve poder reordenar colunas via drag & drop no frontend | Média | Implementado | Reordenação apenas visual; não persiste no backend | Teste manual de drag & drop |

---

## Gestão de Tarefas

| Id | Nome do Requisito | Descrição | Prioridade | Estado | Restrições | Verificação |
|---|---|---|---|---|---|---|
| RF-TASK-01 | Listar Tarefas | O sistema deve retornar lista de todas as tarefas via GET `/api/Tasks` | Alta | Implementado | Autenticação requerida | Teste endpoint GET /api/Tasks |
| RF-TASK-02 | Obter Tarefa por ID | O sistema deve retornar uma tarefa específica via GET `/api/Tasks/{id}` | Alta | Implementado | Tarefa deve existir na base de dados | Teste endpoint GET /api/Tasks/{id} |
| RF-TASK-03 | Criar Tarefa | O sistema deve permitir criar tarefa via POST `/api/Tasks` com título, descrição, responsável, columnId, boardId, tags | Alta | Implementado | Título obrigatório; criação com timestamp | Teste endpoint POST /api/Tasks com payload completo |
| RF-TASK-04 | Atualizar Tarefa | O sistema deve permitir atualizar tarefa via PUT `/api/Tasks/{id}` | Alta | Implementado | Todos os campos atualizáveis exceto ID e createdAt | Teste endpoint PUT com dados válidos |
| RF-TASK-05 | Apagar Tarefa | O sistema deve permitir apagar tarefa via DELETE `/api/Tasks/{id}` | Alta | Implementado | Remoção lógica ou física da base de dados | Teste que tarefa é removida do board |
| RF-TASK-06 | Mover Tarefa entre Colunas | O sistema deve permitir mover tarefa via PATCH `/api/Tasks/{id}/move` com newColumnId | Alta | Implementado | Tarefa atualizada com nova columnId | Teste movimento entre colunas diferentes |
| RF-TASK-07 | Filtrar Tarefas por Board | O sistema deve filtrar tarefas via GET `/api/Tasks/filter?boardId={id}` | Alta | Implementado | Retorna apenas tarefas do board especificado | Teste com boardId válido |
| RF-TASK-08 | Filtrar Tarefas por Coluna | O sistema deve filtrar tarefas via query param `columnId` | Média | Implementado | Filtra por coluna dentro de um board | Teste combinação boardId + columnId |
| RF-TASK-09 | Filtrar Tarefas por Responsável | O sistema deve filtrar tarefas via query param `assignedTo` | Média | Implementado | Filtra por utilizador responsável | Teste com assignedTo válido |
| RF-TASK-10 | Tags nas Tarefas | Cada tarefa deve suportar múltiplas tags (array de strings) | Alta | Implementado | Tags são opcionais; armazenadas como lista | Teste criação e edição com tags |
| RF-TASK-11 | Adicionar Tags a Tarefa | O utilizador deve poder adicionar tags ao criar/editar tarefa | Alta | Implementado | Tags não podem estar vazias; sem duplicatas | Teste manual no frontend |
| RF-TASK-12 | Remover Tags de Tarefa | O utilizador deve poder remover tags individuais de uma tarefa | Alta | Implementado | Remoção funciona em tempo real | Teste clicking no X de uma tag |
| RF-TASK-13 | Sugestões de Tags | Ao criar tarefa, sistema deve sugerir tags já existentes de outras tarefas | Alta | Implementado | Dropdown com tags globais; filtragem por input | Teste typing numa tag existente |

---

## Interface do Utilizador

| Id | Nome do Requisito | Descrição | Prioridade | Estado | Restrições | Verificação |
|---|---|---|---|---|---|---|
| RF-UI-01 | Layout Kanban | Frontend deve apresentar interface Kanban com colunas horizontais | Alta | Implementado | Baseado em React + Next.js + hello-pangea/dnd | Visualizar layout no browser |
| RF-UI-02 | Drag & Drop de Tarefas | O utilizador deve poder arrastar tarefas entre colunas | Alta | Implementado | Sincronizado com backend; feedback visual | Teste movimento de task entre colunas |
| RF-UI-03 | Drag & Drop de Colunas | O utilizador deve poder reordenar colunas por drag & drop | Média | Implementado | Reordenação visual; não persiste | Teste movimento de coluna |
| RF-UI-04 | Drag & Drop de Boards | O utilizador deve poder reordenar boards no dropdown | Média | Implementado | Reordenação visual; não persiste | Teste no dropdown de boards |
| RF-UI-05 | Modal de Criar Tarefa | Deve haver modal para criação de nova tarefa com todos os campos | Alta | Implementado | Modal acessível a partir de cada coluna | Teste clique no botão "+" de coluna |
| RF-UI-06 | Modal de Editar Tarefa | Deve haver modal para edição de tarefa existente | Alta | Implementado | Modal pré-preenchido com dados da tarefa | Teste clique no botão "✏️" da tarefa |
| RF-UI-07 | Modal de Apagar Tarefa | Deve haver botão para apagar tarefa com confirmação | Alta | Implementado | Botão "🗑️" em cada card de tarefa | Teste clique e confirmação |
| RF-UI-08 | Modal de Criar Board | Deve haver modal para criar novo board | Alta | Implementado | Input para nome do board | Teste clique em "+ Board" |
| RF-UI-09 | Modal de Criar Coluna | Deve haver modal para criar nova coluna | Alta | Implementado | Input para nome e seleção de cor | Teste clique em "+ Nova Coluna" |
| RF-UI-10 | Cores de Tarefas com Tags | Cada tag deve ter cor única e consistente | Média | Implementado | Cores geradas por função tagColor() | Verificar cores das tags no UI |
| RF-UI-11 | Validação de Formulários | Campos obrigatórios devem estar marcados e validados | Alta | Implementado | Título obrigatório; botão desabilitado sem título | Teste submissão com campos vazios |
| RF-UI-12 | Responsividade | Interface deve ser funcional em diferentes tamanhos de ecrã | Média | Implementado | CSS Tailwind; layout flex/grid | Teste em diferentes resoluções |
| RF-UI-13 | Data de Criação | Cada tarefa deve exibir data de criação formatada | Média | Implementado | Formato português (DD/MM/YYYY) | Verificar exibição em task card |
| RF-UI-14 | Responsável da Tarefa | Cada tarefa deve exibir nome do responsável | Média | Implementado | Campo "👤 Nome" no footer do card | Verificar exibição quando preenchido |
| RF-UI-15 | Seleção de Coluna | Ao criar/editar tarefa, deve haver dropdown para selecionar coluna | Alta | Implementado | Dropdown com todas as colunas do board | Teste seleção de coluna diferente |

---

## 📊 Resumo de Requisitos

| Categoria | Total | Implementados | % |
|---|---|---|---|
| **Autenticação** | 3 | 3 | 100% |
| **Gestão de Boards** | 7 | 7 | 100% |
| **Gestão de Colunas** | 6 | 6 | 100% |
| **Gestão de Tarefas** | 13 | 13 | 100% |
| **Interface do Utilizador** | 15 | 15 | 100% |
| **TOTAL** | **44** | **44** | **100%** |

---

## 📝 Notas Técnicas

- **Arquitetura Backend**: ASP.NET Core 10 com Controllers, Services, DTOs e Repositories em padrão In-Memory
- **Arquitetura Frontend**: Next.js 14+ com React, TypeScript, Tailwind CSS e hello-pangea/dnd para drag & drop
- **Autenticação**: Basic Auth (credenciais no .env via NEXT_PUBLIC_AUTH_USER e NEXT_PUBLIC_AUTH_PASS)
- **Persistência**: Em memória (não persiste após restart) - pronto para migração para base de dados SQL
- **API Documentation**: Swagger/OpenAPI disponível em `/swagger`
- **CORS**: Configurado para localhost:3000 (frontend)

---

## 🔄 Próximas Melhorias (Não Implementadas)

- [ ] Persistência em base de dados SQL (SQL Server/PostgreSQL)
- [ ] Autenticação por JWT
- [ ] Sistema de utilizadores com roles
- [ ] Comentários em tarefas
- [ ] Anexos em tarefas
- [ ] Notificações em tempo real (SignalR)
- [ ] Histórico de alterações
- [ ] Relatórios e dashboards
- [ ] Sincronização offline
- [ ] Exportação de boards (PDF/Excel)

---

**Última Atualização**: 2 de Junho de 2026  
**Versão do Projeto**: v1.0.0
