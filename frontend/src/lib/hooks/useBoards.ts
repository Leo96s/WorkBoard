import { useEffect, useState } from "react";
import { Board } from "@/types";
import { boardApi } from "@/lib/api";

/**
 * Hook para gerenciar boards
 * Responsável por carregar, atualizar e gerenciar o estado dos boards
 */
export function useBoards() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [activeBoard, setActiveBoard] = useState<Board | null>(null);

  /**
   * Carrega todos os boards e define o board ativo
   */
  const loadBoards = async () => {
    const res = await boardApi.getAll();
    setBoards(res.data);

    if (res.data.length > 0) {
      if (!activeBoard) {
        setActiveBoard(res.data[0]);
      } else {
        const fresh = res.data.find((b: Board) => b.id === activeBoard.id);
        setActiveBoard(fresh ?? res.data[0]);
      }
    }
  };

  /**
   * Cria um novo board
   */
  const createBoard = async (name: string) => {
    await boardApi.create({ name });
    await loadBoards();
  };

  /**
   * Deleta um board
   */
  const deleteBoard = async (boardId: string, boardName: string) => {
    if (!confirm(`Apagar "${boardName}"? Todas as tarefas e colunas serão eliminadas.`)) return;
    try {
      await boardApi.delete(boardId);
      if (activeBoard?.id === boardId) {
        setActiveBoard(null);
      }
      await loadBoards();
    } catch {
      alert("Não foi possível apagar o board.");
    }
  };

  useEffect(() => {
    loadBoards();
  }, []);

  return {
    boards,
    activeBoard,
    setActiveBoard,
    loadBoards,
    createBoard,
    deleteBoard,
  };
}
