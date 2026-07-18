import { useEffect, useState } from "react";
import { Board, BoardColumn } from "@/types";
import { boardApi, columnApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/utils/apiError";

/**
 * Hook para gerir boards
 * Responsável por carregar, atualizar e gerir o estado dos boards
 */
export function useBoards() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [activeBoard, setActiveBoard] = useState<Board | null>(null);

  /**
   * Carrega todos os boards e define o board ativo
   */
  const loadBoards = async () => {
    try {
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
    } catch (error) {
      alert(getErrorMessage(error, "Não foi possível carregar os boards. Tenta novamente."));
    }
  };

  /**
   * Cria um novo board
   * @returns true se criado com sucesso, false caso contrário (já mostra alerta ao utilizador)
   */
  const createBoard = async (name: string): Promise<boolean> => {
    try {
      await boardApi.create({ name });
      await loadBoards();
      return true;
    } catch (error) {
      alert(getErrorMessage(error, "Não foi possível criar o board. Tenta novamente."));
      return false;
    }
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
    } catch (error) {
      alert(getErrorMessage(error, "Não foi possível apagar o board."));
    }
  };

  /**
   * Reordena os boards (drag and drop) com atualização otimista e persistência no backend
   */
  const reorderBoards = async (reordered: Board[]) => {
    setBoards(reordered);
    try {
      await boardApi.reorder(reordered.map((b) => b.id));
    } catch {
      await loadBoards();
    }
  };

  /**
   * Reordena as colunas do board ativo (drag and drop) com atualização otimista e persistência no backend
   */
  const reorderColumns = async (reordered: BoardColumn[]) => {
    if (!activeBoard) return;

    setActiveBoard({ ...activeBoard, columns: reordered });
    try {
      await columnApi.reorder(activeBoard.id, reordered.map((c) => c.id));
    } catch {
      await loadBoards();
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
    reorderBoards,
    reorderColumns,
  };
}
