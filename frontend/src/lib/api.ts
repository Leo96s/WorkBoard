import axios from "axios";
import { CreateTaskDto, UpdateTaskDto, CreateBoardDto, CreateColumnDto, UpdateColumnDto } from "@/types";
 
const api = axios.create({
  baseURL: "/api/proxy",
});

/**
 * API para operações de tarefas
 */
export const taskApi = {
  /**
   * Obtém todas as tarefas
   * @returns {Promise} Todas as tarefas
   */
  getAll: () =>
    api.get("/Tasks"),
 
  /**
   * Filtra tarefas por board, coluna e/ou responsável
   * @param {Object} filters - Filtros a aplicar
   * @param {string} [filters.boardId] - ID do board
   * @param {string} [filters.columnId] - ID da coluna
   * @param {string} [filters.assignedTo] - Nome do responsável
   * @returns {Promise} Tarefas filtradas
   */
  filter: (filters: {
  boardId?: string;
  columnId?: string;
  search?: string;
}) =>
  api.get("/Tasks/filter", { params: filters }),
 
  /**
   * Filtra tarefas por board (e opcionalmente por responsável)
   * @param {string} boardId - ID do board
   * @param {string} [assignedTo] - Nome do responsável (opcional)
   * @returns {Promise} Tarefas filtradas
   */
  filterByBoard: (boardId: string, search?: string) =>
  api.get("/Tasks/filter", {
    params: { boardId, search },
  }),
 
  /**
   * Obtém uma tarefa pelo ID
   * @param {string} id - ID da tarefa
   * @returns {Promise} Tarefa encontrada
   */
  getById: (id: string) =>
    api.get(`/Tasks/${id}`),
 
  /**
   * Cria uma nova tarefa
   * @param {CreateTaskDto} data - Dados da nova tarefa
   * @returns {Promise} Tarefa criada
   */
  create: (data: CreateTaskDto) =>
    api.post("/Tasks", data),
 
  /**
   * Atualiza uma tarefa existente
   * @param {string} id - ID da tarefa
   * @param {UpdateTaskDto} data - Novos dados da tarefa
   * @returns {Promise} Tarefa atualizada
   */
  update: (id: string, data: UpdateTaskDto) =>
    api.put(`/Tasks/${id}`, data),
 
  /**
   * Move uma tarefa para outra coluna
   * @param {string} id - ID da tarefa
   * @param {string} newColumnId - ID da nova coluna
   * @returns {Promise} Tarefa movida
   */
  move: (id: string, newColumnId: string) =>
    api.patch(`/Tasks/${id}/move`, { newColumnId }),
 
  /**
   * Deleta uma tarefa
   * @param {string} id - ID da tarefa
   * @returns {Promise} Resultado da deleção
   */
  delete: (id: string) =>
    api.delete(`/Tasks/${id}`),
};

/**
 * API para operações de boards
 */
export const boardApi = {
  /**
   * Obtém todos os boards
   * @returns {Promise} Todos os boards
   */
  getAll: () =>
    api.get("/boards"),
 
  /**
   * Obtém um board pelo ID
   * @param {string} id - ID do board
   * @returns {Promise} Board encontrado
   */
  getById: (id: string) =>
    api.get(`/boards/${id}`),
 
  /**
   * Cria um novo board
   * @param {CreateBoardDto} data - Dados do novo board
   * @returns {Promise} Board criado
   */
  create: (data: CreateBoardDto) =>
    api.post("/boards", data),
 
  /**
   * Deleta um board
   * @param {string} id - ID do board
   * @returns {Promise} Resultado da deleção
   */
  delete: (id: string) =>
    api.delete(`/boards/${id}`),

  /**
   * Reordena os boards existentes
   * @param {string[]} orderedIds - IDs de todos os boards na nova ordem desejada
   * @returns {Promise} Resultado da reordenação
   */
  reorder: (orderedIds: string[]) =>
    api.patch("/boards/reorder", { orderedIds }),
};

/**
 * API para operações de colunas (nested em boards)
 */
export const columnApi = {
  /**
   * Cria uma nova coluna em um board
   * @param {string} boardId - ID do board
   * @param {CreateColumnDto} data - Dados da nova coluna
   * @returns {Promise} Coluna criada
   */
  create: (boardId: string, data: CreateColumnDto) =>
    api.post(`/boards/${boardId}/columns`, data),
 
  /**
   * Atualiza uma coluna existente
   * @param {string} boardId - ID do board
   * @param {string} columnId - ID da coluna
   * @param {UpdateColumnDto} data - Novos dados da coluna
   * @returns {Promise} Coluna atualizada
   */
  update: (boardId: string, columnId: string, data: UpdateColumnDto) =>
    api.put(`/boards/${boardId}/columns/${columnId}`, data),
 
  /**
   * Deleta uma coluna
   * @param {string} boardId - ID do board
   * @param {string} columnId - ID da coluna
   * @returns {Promise} Resultado da deleção
   */
  delete: (boardId: string, columnId: string) =>
    api.delete(`/boards/${boardId}/columns/${columnId}`),

  /**
   * Reordena as colunas de um board
   * @param {string} boardId - ID do board
   * @param {string[]} orderedIds - IDs de todas as colunas do board na nova ordem desejada
   * @returns {Promise} Resultado da reordenação
   */
  reorder: (boardId: string, orderedIds: string[]) =>
    api.patch(`/boards/${boardId}/columns/reorder`, { orderedIds }),
};
