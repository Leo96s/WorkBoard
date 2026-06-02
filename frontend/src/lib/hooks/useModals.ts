import { useState } from "react";
import { TaskCard } from "@/types";

/**
 * Hook para gerir o estado dos modais
 * Responsável por abrir, fechar e controlar os modais da aplicação
 */
export function useModals() {
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskCard | undefined>();
  const [boardModalOpen, setBoardModalOpen] = useState(false);
  const [columnModalOpen, setColumnModalOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");

  /**
   * Abre o modal de tarefa para criar uma nova
   */
  const openNewTaskModal = () => {
    setEditingTask(undefined);
    setTaskModalOpen(true);
  };

  /**
   * Abre o modal de tarefa para editar uma existente
   */
  const openEditTaskModal = (task: TaskCard) => {
    setEditingTask(task);
    setTaskModalOpen(true);
  };

  /**
   * Fecha o modal de tarefa
   */
  const closeTaskModal = () => {
    setTaskModalOpen(false);
    setEditingTask(undefined);
  };

  /**
   * Abre o modal de board
   */
  const openBoardModal = () => {
    setBoardModalOpen(true);
  };

  /**
   * Fecha o modal de board
   */
  const closeBoardModal = () => {
    setBoardModalOpen(false);
  };

  /**
   * Abre o modal de coluna
   */
  const openColumnModal = () => {
    setColumnModalOpen(true);
  };

  /**
   * Fecha o modal de coluna
   */
  const closeColumnModal = () => {
    setColumnModalOpen(false);
    setNewColumnName("");
  };

  return {
    taskModalOpen,
    setTaskModalOpen,
    editingTask,
    setEditingTask,
    openNewTaskModal,
    openEditTaskModal,
    closeTaskModal,
    boardModalOpen,
    openBoardModal,
    closeBoardModal,
    columnModalOpen,
    openColumnModal,
    closeColumnModal,
    newColumnName,
    setNewColumnName,
  };
}
