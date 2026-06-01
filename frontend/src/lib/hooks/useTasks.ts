import { useEffect, useState } from "react";
import { TaskCard, UpdateTaskDto, CreateTaskDto } from "@/types";
import { taskApi } from "@/lib/api";

/**
 * Hook para gerenciar tarefas
 * Responsável por carregar, atualizar, deletar e mover tarefas
 */
export function useTasks(boardId: string | null) {
  const [tasks, setTasks] = useState<TaskCard[]>([]);

  /**
   * Carrega as tarefas de um board específico
   */
  const loadTasks = async (id: string) => {
    const res = await taskApi.filterByBoard(id);
    setTasks(res.data);
  };

  /**
   * Cria uma nova tarefa
   */
  const createTask = async (data: CreateTaskDto) => {
    await taskApi.create(data);
    if (boardId) await loadTasks(boardId);
  };

  /**
   * Atualiza uma tarefa existente
   */
  const updateTask = async (id: string, data: UpdateTaskDto) => {
    await taskApi.update(id, data);
    if (boardId) await loadTasks(boardId);
  };

  /**
   * Deleta uma tarefa
   */
  const deleteTask = async (id: string) => {
    await taskApi.delete(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  /**
   * Move uma tarefa para outra coluna
   */
  const moveTask = async (id: string, columnId: string) => {
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, columnId } : t)
    );
    await taskApi.move(id, columnId);
  };

  /**
   * Atualiza o estado local de uma tarefa (para drag and drop)
   */
  const updateTaskLocally = (id: string, columnId: string) => {
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, columnId } : t)
    );
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
    updateTaskLocally,
  };
}
