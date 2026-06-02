# Test Cases - WorkBoard Application

**Data:** Junho 2026  
**Projeto:** WorkBoard - Kanban Board System  
**Escopo:** BoardService e TaskService  

---

## Índice
1. [BoardService](#boardservice)
   - [BVA - Boundary Value Analysis](#bva-boardservice)
   - [Test Case Outlined](#test-case-outlined-boardservice)
   - [Test Case Specification](#test-case-specification-boardservice)
2. [TaskService](#taskservice)
   - [BVA - Boundary Value Analysis](#bva-taskservice)
   - [Test Case Outlined](#test-case-outlined-taskservice)
   - [Test Case Specification](#test-case-specification-taskservice)

---

# BoardService

## BVA - BoardService

### 1. Create(CreateBoardDto dto)

| Campo | Limite Inferior | Valor Limite | Limite Superior |
| ----- | --------------- | ------------ | --------------- |
| Name  | 0 caracteres    | 1 carácter   | 255 caracteres  |

### 2. Delete(Guid id)

| Campo            | Limite Inferior | Valor Limite | Limite Superior |
| ---------------- | --------------- | ------------ | --------------- |
| id               | Guid.Empty      | Guid válido  | N/A             |
| Número de Boards | 1               | 2            | N/A             |

### 3. AddColumn(Guid boardId, CreateBoardColumnDto dto)

| Campo   | Limite Inferior | Valor Limite | Limite Superior |
| ------- | --------------- | ------------ | --------------- |
| boardId | Guid.Empty      | Guid válido  | N/A             |
| Name    | 0 caracteres    | 1 carácter   | 100 caracteres  |
| Color   | String vazia    | "#000000"    | "#FFFFFF"       |
| Order   | 1               | 2            | N/A             |

### 4. UpdateColumn(Guid boardId, Guid columnId, UpdateColumnDto dto)

| Campo    | Limite Inferior | Valor Limite | Limite Superior |
| -------- | --------------- | ------------ | --------------- |
| boardId  | Guid.Empty      | Guid válido  | N/A             |
| columnId | Guid.Empty      | Guid válido  | N/A             |
| Name     | 0 caracteres    | 1 carácter   | 100 caracteres  |
| Color    | String vazia    | "#000000"    | "#FFFFFF"       |

### 5. DeleteColumn(Guid boardId, Guid columnId)

| Campo             | Limite Inferior | Valor Limite | Limite Superior |
| ----------------- | --------------- | ------------ | --------------- |
| boardId           | Guid.Empty      | Guid válido  | N/A             |
| columnId          | Guid.Empty      | Guid válido  | N/A             |
| Número de Tarefas | 0               | 1            | N/A             |

---

## Test Case Outlined - BoardService

### TC_BOARD_001: Criar Board com Nome Válido

**ID do Teste:** TC_BOARD_001  
**Prioridade:** P1  
**Descrição:** Validar criação de um board com nome válido  
**Pré-Condição:** Sistema funcionando, repositório acessível  
**Passo:** Chamar `Create(new CreateBoardDto { Name = "Novo Board" })`  
**Resultado Esperado:** Board criado com colunas padrão, retorna `BoardDto` não nulo  
**Passo 2:** Validar que GetAll() contém o novo board  

### TC_BOARD_002: Criar Board com Nome Vazio

**ID do Teste:** TC_BOARD_002  
**Prioridade:** P2  
**Descrição:** Validar comportamento ao criar board com nome vazio  
**Pré-Condição:** Sistema funcionando  
**Passo:** Chamar `Create(new CreateBoardDto { Name = "" })`  
**Resultado Esperado:** Board criado (mesmo vazio), mas pode ser tratado no controller  

### TC_BOARD_003: Criar Board com Nome muito Longo

**ID do Teste:** TC_BOARD_003  
**Prioridade:** P2  
**Descrição:** Validar criação de board com nome muito longo  
**Pré-Condição:** Sistema funcionando  
**Passo:** Chamar `Create(new CreateBoardDto { Name = new string('A', 300) })`  
**Resultado Esperado:** Board criado (sem validação de tamanho na service)  

### TC_BOARD_004: Eliminar Board Único

**ID do Teste:** TC_BOARD_004  
**Prioridade:** P1  
**Descrição:** Validar que não é possível eliminar o único board  
**Pré-Condição:** Apenas 1 board existe  
**Passo:** Chamar `Delete(boardId)`  
**Resultado Esperado:** Retorna `false`, board mantém-se  

### TC_BOARD_005: Eliminar Board com Múltiplos Boards

**ID do Teste:** TC_BOARD_005  
**Prioridade:** P1  
**Descrição:** Validar eliminação de board quando existem múltiplos  
**Pré-Condição:** 2 ou mais boards criados  
**Passo:** Chamar `Delete(boardId)` para um board  
**Resultado Esperado:** Retorna `true`, board eliminado com todas as tarefas e colunas  

### TC_BOARD_006: Adicionar Coluna com Dados Válidos

**ID do Teste:** TC_BOARD_006  
**Prioridade:** P1  
**Descrição:** Validar adição de coluna com dados válidos  
**Pré-Condição:** Board existe com ID válido  
**Passo:** Chamar `AddColumn(boardId, new CreateBoardColumnDto { Name = "Em Análise", Color = "#FF5733" })`  
**Resultado Esperado:** Coluna criada, Order incrementada automaticamente  

### TC_BOARD_007: Adicionar Coluna com Cor Inválida

**ID do Teste:** TC_BOARD_007  
**Prioridade:** P2  
**Descrição:** Validar adição de coluna com cor em formato inválido  
**Pré-Condição:** Board existe  
**Passo:** Chamar `AddColumn(boardId, new CreateBoardColumnDto { Name = "Nova", Color = "RED" })`  
**Resultado Esperado:** Coluna criada com cor armazenada (sem validação)  

### TC_BOARD_008: Atualizar Coluna - Dados Válidos

**ID do Teste:** TC_BOARD_008  
**Prioridade:** P1  
**Descrição:** Validar atualização de coluna com dados válidos  
**Pré-Condição:** Board e coluna existem  
**Passo:** Chamar `UpdateColumn(boardId, columnId, new UpdateColumnDto { Name = "Atualizado", Color = "#00FF00" })`  
**Resultado Esperado:** Coluna atualizada com sucesso  

### TC_BOARD_009: Atualizar Coluna - Board Inválido

**ID do Teste:** TC_BOARD_009  
**Prioridade:** P2  
**Descrição:** Validar que atualização falha com board inválido  
**Pré-Condição:** Board ID inválido  
**Passo:** Chamar `UpdateColumn(Guid.NewGuid(), columnId, dto)`  
**Resultado Esperado:** Retorna `null`  

### TC_BOARD_010: Eliminar Coluna com Tarefas

**ID do Teste:** TC_BOARD_010  
**Prioridade:** P1  
**Descrição:** Validar eliminação de coluna e todas as tarefas associadas  
**Pré-Condição:** Coluna contém tarefas  
**Passo:** Chamar `DeleteColumn(boardId, columnId)`  
**Resultado Esperado:** Coluna e todas as tarefas eliminadas  

### TC_BOARD_011: Eliminar Coluna - IDs Inválidos

**ID do Teste:** TC_BOARD_011  
**Prioridade:** P2  
**Descrição:** Validar eliminação com IDs inválidos  
**Pré-Condição:** IDs não existem  
**Passo:** Chamar `DeleteColumn(Guid.NewGuid(), Guid.NewGuid())`  
**Resultado Esperado:** Retorna `false`  

---

## Test Case Specification - BoardService

### TC_BOARD_001_SPEC

| Atributo | Valor |
|----------|-------|
| **ID** | TC_BOARD_001_SPEC |
| **Método** | `BoardService.Create()` |
| **Tipo de Teste** | Teste Funcional Positivo |
| **Objetivo** | Validar criação bem-sucedida de board com nome válido |
| **Entrada** | CreateBoardDto { Name = "Projeto X" } |
| **Passos** |  1. Instanciar BoardService com repositórios mock<br>2. Chamar Create() com DTO válido<br>3. Verificar retorno não-nulo<br>4. Verificar colunas padrão criadas (3 colunas)<br>5. Verificar board em GetAll() |
| **Resultado Esperado** | BoardDto retornado com:<br>- ID não vazio<br>- Name = "Projeto X"<br>- 3 colunas padrão com nomes e cores corretos |
| **Dados Utilizados** | Name: "Projeto X" (válido, 9 caracteres) |
| **Assertivas** | Assert.NotNull(result)<br>Assert.Equal("Projeto X", result.Name)<br>Assert.Equal(3, result.Columns.Count) |

### TC_BOARD_004_SPEC

| Atributo | Valor |
|----------|-------|
| **ID** | TC_BOARD_004_SPEC |
| **Método** | `BoardService.Delete()` |
| **Tipo de Teste** | Teste Funcional Negativo |
| **Objetivo** | Validar proteção contra eliminação do único board |
| **Entrada** | Guid boardId (único board existente) |
| **Passos** |  1. Setup: Garantir que existe apenas 1 board<br>2. Chamar Delete(boardId)<br>3. Verificar retorno<br>4. Verificar que board ainda existe |
| **Resultado Esperado** | Delete() retorna `false`<br>Board mantém-se na repositório |
| **Dados Utilizados** | boardId = Board único criado na setup |
| **Assertivas** | Assert.False(result)<br>Assert.NotNull(repository.GetById(boardId)) |

### TC_BOARD_005_SPEC

| Atributo | Valor |
|----------|-------|
| **ID** | TC_BOARD_005_SPEC |
| **Método** | `BoardService.Delete()` |
| **Tipo de Teste** | Teste Funcional Positivo |
| **Objetivo** | Validar eliminação de board quando há múltiplos |
| **Entrada** | Guid boardId (um de vários boards) |
| **Passos** |  1. Setup: Criar 3 boards com tarefas e colunas<br>2. Chamar Delete() no board do meio<br>3. Verificar retorno = true<br>4. Verificar que tarefas e colunas foram eliminadas<br>5. Verificar que outros boards mantêm-se |
| **Resultado Esperado** | Delete() retorna `true`<br>Board eliminado<br>2 boards restantes com seus dados<br>Todas as tarefas do board eliminado removidas<br>Todas as colunas do board eliminado removidas |
| **Dados Utilizados** | 3 boards com 5 tarefas cada e 3 colunas cada |
| **Assertivas** | Assert.True(result)<br>Assert.Null(boardRepository.GetById(boardId))<br>Assert.Empty(taskRepository.GetAll().Where(t => t.BoardId == boardId)) |

### TC_BOARD_006_SPEC

| Atributo | Valor |
|----------|-------|
| **ID** | TC_BOARD_006_SPEC |
| **Método** | `BoardService.AddColumn()` |
| **Tipo de Teste** | Teste Funcional Positivo |
| **Objetivo** | Validar adição de coluna com sucesso |
| **Entrada** | boardId: Guid válido<br>CreateBoardColumnDto { Name = "Em Revisão", Color = "#9B59B6" } |
| **Passos** |  1. Setup: Board com 3 colunas existentes (Order: 1,2,3)<br>2. Chamar AddColumn()<br>3. Verificar retorno ColumnDto<br>4. Verificar Order da nova coluna |
| **Resultado Esperado** | ColumnDto retornado com:<br>- Name = "Em Revisão"<br>- Color = "#9B59B6"<br>- Order = 4 (incrementado automaticamente)<br>- BoardId correspondente |
| **Dados Utilizados** | 3 colunas existentes com Orders 1, 2, 3 |
| **Assertivas** | Assert.NotNull(result)<br>Assert.Equal(4, result.Order)<br>Assert.Equal("#9B59B6", result.Color) |

### TC_BOARD_010_SPEC

| Atributo | Valor |
|----------|-------|
| **ID** | TC_BOARD_010_SPEC |
| **Método** | `BoardService.DeleteColumn()` |
| **Tipo de Teste** | Teste Funcional Positivo - Cascata |
| **Objetivo** | Validar eliminação de coluna com todas as tarefas associadas |
| **Entrada** | boardId: Guid válido<br>columnId: Guid de coluna com tarefas |
| **Passos** |  1. Setup: Criar board com coluna contendo 5 tarefas<br>2. Chamar DeleteColumn()<br>3. Verificar retorno = true<br>4. Verificar que coluna foi eliminada<br>5. Verificar que todas as 5 tarefas foram eliminadas |
| **Resultado Esperado** | DeleteColumn() retorna `true`<br>Coluna removida do repositório<br>5 tarefas removidas do repositório |
| **Dados Utilizados** | 1 coluna com 5 tarefas associadas |
| **Assertivas** | Assert.True(result)<br>Assert.Null(columnRepository.GetById(columnId))<br>Assert.Empty(taskRepository.GetAll().Where(t => t.ColumnId == columnId)) |

---

# TaskService

## BVA - TaskService

Sim. Em **Boundary Value Analysis (BVA)** cada caso deve focar-se num único limite por variável. O que tens atualmente mistura vários valores possíveis para o mesmo campo. O ideal é ficar algo deste género:

# BVA - TaskService

### 1. Create(CreateTaskDto dto)

| Campo       | Limite Inferior | Valor Limite | Limite Superior |
| ----------- | --------------- | ------------ | --------------- |
| Title       | 0 caracteres    | 1 carácter   | 255 caracteres  |
| Description | 0 caracteres    | 1 carácter   | 5000 caracteres |
| AssignedTo  | 0 caracteres    | 1 carácter   | 100 caracteres  |
| BoardId     | Guid.Empty      | Guid válido  | N/A             |
| ColumnId    | Guid.Empty      | Guid válido  | N/A             |
| Nº de Tags  | 0               | 1            | N/A             |
| Tag         | 0 caracteres    | 1 carácter   | 50 caracteres   |

### 2. Update(Guid id, UpdateTaskDto dto)

| Campo       | Limite Inferior | Valor Limite | Limite Superior |
| ----------- | --------------- | ------------ | --------------- |
| id          | Guid.Empty      | Guid válido  | N/A             |
| Title       | 0 caracteres    | 1 carácter   | 255 caracteres  |
| Description | 0 caracteres    | 1 carácter   | 5000 caracteres |
| AssignedTo  | 0 caracteres    | 1 carácter   | 100 caracteres  |
| ColumnId    | null            | Guid válido  | N/A             |
| Nº de Tags  | 0               | 1            | N/A             |
| Tag         | 0 caracteres    | 1 carácter   | 50 caracteres   |

### 3. Delete(Guid id)

| Campo | Limite Inferior | Valor Limite | Limite Superior |
| ----- | --------------- | ------------ | --------------- |
| id    | Guid.Empty      | Guid válido  | N/A             |

### 4. Move(Guid id, Guid newColumnId)

| Campo       | Limite Inferior | Valor Limite | Limite Superior |
| ----------- | --------------- | ------------ | --------------- |
| id          | Guid.Empty      | Guid válido  | N/A             |
| newColumnId | Guid.Empty      | Guid válido  | N/A             |

### 5. Filter(Guid? boardId, Guid? columnId, string? assignedTo)

| Campo                   | Limite Inferior | Valor Limite | Limite Superior |
| ----------------------- | --------------- | ------------ | --------------- |
| boardId                 | null            | Guid válido  | N/A             |
| columnId                | null            | Guid válido  | N/A             |
| assignedTo              | null            | 1 carácter   | 100 caracteres  |
| Nº de Filtros Aplicados | 0               | 1            | 3               |

---

## Test Case Outlined - TaskService

### TC_TASK_001: Criar Tarefa com Dados Válidos

**ID do Teste:** TC_TASK_001  
**Prioridade:** P1  
**Descrição:** Validar criação de tarefa com todos os dados válidos  
**Pré-Condição:** Board e coluna existem  
**Passo:** Chamar `Create(new CreateTaskDto { Title = "Tarefa 1", Description = "Desc", AssignedTo = "João", ColumnId = colId, BoardId = boardId, Tags = ["bug"] })`  
**Resultado Esperado:** TaskCard retornado com todos os dados corretos  

### TC_TASK_002: Criar Tarefa com Título Vazio

**ID do Teste:** TC_TASK_002  
**Prioridade:** P2  
**Descrição:** Validar criação de tarefa com título vazio  
**Pré-Condição:** Board e coluna existem  
**Passo:** Chamar `Create(new CreateTaskDto { Title = "", ColumnId = colId, BoardId = boardId })`  
**Resultado Esperado:** Tarefa criada (sem validação na service)  

### TC_TASK_003: Criar Tarefa com Múltiplos Tags

**ID do Teste:** TC_TASK_003  
**Prioridade:** P2  
**Descrição:** Validar criação com lista de tags  
**Pré-Condição:** Board e coluna existem  
**Passo:** Chamar `Create(..., Tags = ["bug", "urgent", "feature", "documentation"])`  
**Resultado Esperado:** Tarefa criada com todos os tags armazenados  

### TC_TASK_004: Atualizar Tarefa - Todos os Campos

**ID do Teste:** TC_TASK_004  
**Prioridade:** P1  
**Descrição:** Validar atualização de tarefa com novos valores  
**Pré-Condição:** Tarefa existe  
**Passo:** Chamar `Update(taskId, new UpdateTaskDto { Title = "Novo Título", AssignedTo = "Maria", Tags = ["done"] })`  
**Resultado Esperado:** Tarefa atualizada com novos valores  

### TC_TASK_005: Atualizar Tarefa - Sem Alterar Coluna

**ID do Teste:** TC_TASK_005  
**Prioridade:** P2  
**Descrição:** Validar que ColumnId permanece se não for informado  
**Pré-Condição:** Tarefa em coluna específica  
**Passo:** Chamar `Update(taskId, new UpdateTaskDto { ColumnId = null, Title = "Novo Título" })`  
**Resultado Esperado:** Título atualizado, ColumnId mantém-se  

### TC_TASK_006: Mover Tarefa para Outra Coluna

**ID do Teste:** TC_TASK_006  
**Prioridade:** P1  
**Descrição:** Validar movimento de tarefa entre colunas  
**Pré-Condição:** Tarefa em coluna origem, coluna destino existe  
**Passo:** Chamar `Move(taskId, newColumnId)`  
**Resultado Esperado:** ColumnId da tarefa alterado com sucesso  

### TC_TASK_007: Eliminar Tarefa - ID Válido

**ID do Teste:** TC_TASK_007  
**Prioridade:** P1  
**Descrição:** Validar eliminação de tarefa  
**Pré-Condição:** Tarefa existe  
**Passo:** Chamar `Delete(taskId)`  
**Resultado Esperado:** Tarefa eliminada, GetById retorna null  

### TC_TASK_008: Filtrar por Board

**ID do Teste:** TC_TASK_008  
**Prioridade:** P1  
**Descrição:** Validar filtro por boardId  
**Pré-Condição:** 2 boards com tarefas  
**Passo:** Chamar `Filter(boardId = board1.Id, columnId = null, assignedTo = null)`  
**Resultado Esperado:** Apenas tarefas do board1 retornadas  

### TC_TASK_009: Filtrar por Coluna

**ID do Teste:** TC_TASK_009  
**Prioridade:** P1  
**Descrição:** Validar filtro por columnId  
**Pré-Condição:** Múltiplas colunas com tarefas  
**Passo:** Chamar `Filter(boardId = null, columnId = col.Id, assignedTo = null)`  
**Resultado Esperado:** Apenas tarefas da coluna retornadas  

### TC_TASK_010: Filtrar por Responsável

**ID do Teste:** TC_TASK_010  
**Prioridade:** P1  
**Descrição:** Validar filtro por assignedTo  
**Passo:** Chamar `Filter(boardId = null, columnId = null, assignedTo = "João")`  
**Resultado Esperado:** Apenas tarefas atribuídas a "João"  

### TC_TASK_011: Filtrar com Múltiplos Critérios

**ID do Teste:** TC_TASK_011  
**Prioridade:** P2  
**Descrição:** Validar combinação de filtros  
**Passo:** Chamar `Filter(boardId = board.Id, columnId = col.Id, assignedTo = "Maria")`  
**Resultado Esperado:** Tarefas que correspondem a TODOS os critérios  

### TC_TASK_012: Atualizar Tarefa Inexistente

**ID do Teste:** TC_TASK_012  
**Prioridade:** P2  
**Descrição:** Validar Update com ID inválido  
**Passo:** Chamar `Update(Guid.NewGuid(), dto)`  
**Resultado Esperado:** Nenhuma ação (retorna void)  

---

## Test Case Specification - TaskService

### TC_TASK_001_SPEC

| Atributo | Valor |
|----------|-------|
| **ID** | TC_TASK_001_SPEC |
| **Método** | `TaskService.Create()` |
| **Tipo de Teste** | Teste Funcional Positivo |
| **Objetivo** | Validar criação bem-sucedida de tarefa com dados completos |
| **Entrada** | CreateTaskDto {<br>  Title = "Implementar Login",<br>  Description = "Adicionar autenticação OAuth",<br>  AssignedTo = "João",<br>  ColumnId = col1.Id,<br>  BoardId = board1.Id,<br>  Tags = ["feature", "auth"]<br>} |
| **Passos** |  1. Instanciar TaskService com repositório mock<br>2. Chamar Create() com DTO válido<br>3. Verificar retorno não-nulo<br>4. Verificar que tarefa foi adicionada ao repositório |
| **Resultado Esperado** | TaskCard retornado com:<br>- ID gerado automaticamente<br>- Title = "Implementar Login"<br>- Description = "Adicionar autenticação OAuth"<br>- AssignedTo = "João"<br>- ColumnId = col1.Id<br>- BoardId = board1.Id<br>- Tags contém ["feature", "auth"] |
| **Dados Utilizados** | BoardId e ColumnId válidos (board1, col1 criados em setup) |
| **Assertivas** | Assert.NotNull(result)<br>Assert.NotEqual(Guid.Empty, result.Id)<br>Assert.Equal("Implementar Login", result.Title)<br>Assert.Contains("feature", result.Tags) |

### TC_TASK_004_SPEC

| Atributo | Valor |
|----------|-------|
| **ID** | TC_TASK_004_SPEC |
| **Método** | `TaskService.Update()` |
| **Tipo de Teste** | Teste Funcional Positivo |
| **Objetivo** | Validar atualização de tarefa com todos os campos |
| **Entrada** | taskId: Guid válido<br>UpdateTaskDto {<br>  Title = "Novo Título da Tarefa",<br>  Description = "Nova descrição",<br>  AssignedTo = "Maria",<br>  ColumnId = col2.Id,<br>  Tags = ["fixed", "testing"]<br>} |
| **Passos** |  1. Setup: Criar tarefa com valores iniciais<br>2. Chamar Update(taskId, dto)<br>3. Recuperar tarefa atualizada via GetById<br>4. Verificar todos os campos |
| **Resultado Esperado** | Tarefa atualizada com:<br>- Title = "Novo Título da Tarefa"<br>- Description = "Nova descrição"<br>- AssignedTo = "Maria"<br>- ColumnId = col2.Id<br>- Tags = ["fixed", "testing"]<br>- ID mantém-se igual |
| **Dados Utilizados** | Tarefa criada com Title="Antigo", AssignedTo="João", ColumnId=col1.Id |
| **Assertivas** | Assert.Equal("Novo Título da Tarefa", updated.Title)<br>Assert.Equal("Maria", updated.AssignedTo)<br>Assert.Equal(col2.Id, updated.ColumnId) |

### TC_TASK_006_SPEC

| Atributo | Valor |
|----------|-------|
| **ID** | TC_TASK_006_SPEC |
| **Método** | `TaskService.Move()` |
| **Tipo de Teste** | Teste Funcional Positivo |
| **Objetivo** | Validar movimento de tarefa para outra coluna |
| **Entrada** | taskId: Guid válido (em col1)<br>newColumnId: Guid válido (col2) |
| **Passos** |  1. Setup: Criar tarefa em col1<br>2. Chamar Move(taskId, col2.Id)<br>3. Recuperar tarefa via GetById<br>4. Verificar ColumnId atualizado |
| **Resultado Esperado** | Tarefa movida:<br>- ColumnId alterado de col1.Id para col2.Id<br>- Todos os outros dados mantêm-se<br>- ID permanece igual |
| **Dados Utilizados** | Tarefa em "A Fazer" (col1) movida para "Em Curso" (col2) |
| **Assertivas** | Assert.Equal(col2.Id, moved.ColumnId)<br>Assert.Equal(taskId, moved.Id) |

### TC_TASK_008_SPEC

| Atributo | Valor |
|----------|-------|
| **ID** | TC_TASK_008_SPEC |
| **Método** | `TaskService.Filter()` |
| **Tipo de Teste** | Teste Funcional Positivo - Filtro |
| **Objetivo** | Validar filtro de tarefas por boardId |
| **Entrada** | boardId: board1.Id<br>columnId: null<br>assignedTo: null |
| **Passos** |  1. Setup: Criar 2 boards com 5 tarefas cada<br>2. Chamar Filter(board1.Id, null, null)<br>3. Verificar contagem e conteúdo<br>4. Verificar que tarefas de board2 não estão |
| **Resultado Esperado** | Retorna exatamente 5 tarefas:<br>- Todas com BoardId = board1.Id<br>- Nenhuma tarefa de board2 incluída |
| **Dados Utilizados** | board1: 5 tarefas<br>board2: 5 tarefas |
| **Assertivas** | Assert.Equal(5, result.Count())<br>Assert.All(result, t => Assert.Equal(board1.Id, t.BoardId)) |

### TC_TASK_011_SPEC

| Atributo | Valor |
|----------|-------|
| **ID** | TC_TASK_011_SPEC |
| **Método** | `TaskService.Filter()` |
| **Tipo de Teste** | Teste Funcional Positivo - Filtro Complexo |
| **Objetivo** | Validar filtro com múltiplos critérios combinados (AND) |
| **Entrada** | boardId: board1.Id<br>columnId: col2.Id<br>assignedTo: "João" |
| **Passos** |  1. Setup: Criar dados:<br>     - board1 com col1, col2, col3<br>     - col1: 3 tarefas (João, Maria, Pedro)<br>     - col2: 3 tarefas (João x2, Maria x1)<br>     - col3: 2 tarefas (Pedro)<br>2. Chamar Filter(board1.Id, col2.Id, "João")<br>3. Verificar resultados |
| **Resultado Esperado** | Retorna 2 tarefas:<br>- Ambas em board1<br>- Ambas em col2<br>- Ambas atribuídas a João |
| **Dados Utilizados** | Setup conforme descrito acima |
| **Assertivas** | Assert.Equal(2, result.Count())<br>Assert.All(result, t => {<br>  Assert.Equal(board1.Id, t.BoardId);<br>  Assert.Equal(col2.Id, t.ColumnId);<br>  Assert.Equal("João", t.AssignedTo);<br>}) |

---

## Estrutura de Implementação 

```
backend/Tests/
├── TEST_CASES.md (este ficheiro)
├── BoardServiceTests/
│   ├── CreateTests.cs
│   ├── DeleteTests.cs
│   ├── ColumnTests.cs
└── TaskServiceTests/
    ├── CreateTests.cs
    ├── UpdateTests.cs
    ├── FilterTests.cs
    ├── MoveTests.cs
```

---

**Versão:** 1.3.0
**Última Atualização:** 02 de Junho 2026  
