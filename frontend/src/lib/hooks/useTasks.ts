import { useEffect, useState } from "react";
import { TaskCard, UpdateTaskDto, CreateTaskDto } from "@/types";
import { taskApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/utils/apiError";

/**
 * Hook para gerir tarefas
 * Responsável por carregar, atualizar, deletar e mover tarefas
 */
export function useTasks(boardId: string | null) {
  const [tasks, setTasks] = useState<TaskCard[]>([]);

  /**
   * Carrega as tarefas de um board específico
   */
  const loadTasks = async (id: string) => {
    try {
      const res = await taskApi.filterByBoard(id);
      setTasks(res.data);
    } catch (error) {
      alert(getErrorMessage(error, "Não foi possível carregar as tarefas. Tenta novamente."));
    }
  };

  /**
   * Pesquisa tarefas por responsável ou tag
   */
  const searchTasks = async (id: string, search: string) => {
    try {
      const res = await taskApi.filter({ boardId: id, search });
      setTasks(res.data);
    } catch (error) {
      alert(getErrorMessage(error, "Não foi possível pesquisar as tarefas. Tenta novamente."));
    }
  };

  /**
   * Cria uma nova tarefa
   * @returns true se criada com sucesso, false caso contrário (já mostra alerta ao utilizador)
   */
  const createTask = async (data: CreateTaskDto): Promise<boolean> => {
    try {
      await taskApi.create(data);
      if (boardId) await loadTasks(boardId);
      return true;
    } catch (error) {
      alert(getErrorMessage(error, "Não foi possível criar a tarefa. Tenta novamente."));
      return false;
    }
  };

  /**
   * Atualiza uma tarefa existente
   * @returns true se atualizada com sucesso, false caso contrário (já mostra alerta ao utilizador)
   */
  const updateTask = async (id: string, data: UpdateTaskDto): Promise<boolean> => {
    try {
      await taskApi.update(id, data);
      if (boardId) await loadTasks(boardId);
      return true;
    } catch (error) {
      alert(getErrorMessage(error, "Não foi possível atualizar a tarefa. Tenta novamente."));
      return false;
    }
  };

  /**
   * Deleta uma tarefa
   */
  const deleteTask = async (id: string) => {
    try {
      await taskApi.delete(id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      alert(getErrorMessage(error, "Não foi possível apagar a tarefa. Tenta novamente."));
    }
  };

  /**
   * Move uma tarefa para outra coluna, com atualização otimista e reversão em caso de falha
   */
  const moveTask = async (id: string, columnId: string) => {
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, columnId } : t)
    );
    try {
      await taskApi.move(id, columnId);
    } catch (error) {
      alert(getErrorMessage(error, "Não foi possível mover a tarefa. Tenta novamente."));
      if (boardId) await loadTasks(boardId);
    }
  };

  useEffect(() => {
    if (boardId) {
      loadTasks(boardId);
    }
  }, [boardId]);

  return {
    tasks,
    setTasks,
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    searchTasks,
  };
}
