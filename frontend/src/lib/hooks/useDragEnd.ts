import { Board, TaskCard } from "@/types";
import { DropResult } from "@hello-pangea/dnd";
import { taskApi } from "@/lib/api";

/**
 * Hook para gerenciar o fim do drag and drop
 * Responsável por reordenar boards, colunas e mover tarefas
 */
export function useDragEnd() {
  /**
   * Gerencia o fim do drag and drop
   */
  const handleDragEnd = async (
    result: DropResult,
    {
      boards,
      setBoards,
      activeBoard,
      setActiveBoard,
      tasks,
      updateTaskLocally,
    }: {
      boards: Board[];
      setBoards: (boards: Board[]) => void;
      activeBoard: Board | null;
      setActiveBoard: (board: Board) => void;
      tasks: TaskCard[];
      updateTaskLocally: (id: string, columnId: string) => void;
    }
  ) => {
    const { source, destination, draggableId, type } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    // Reordenar boards
    if (type === "BOARD") {
      const reordered = Array.from(boards);
      const [moved] = reordered.splice(source.index, 1);
      reordered.splice(destination.index, 0, moved);
      setBoards(reordered);
      return;
    }

    // Reordenar colunas
    if (type === "COLUMN") {
      if (!activeBoard) return;
      const reordered = Array.from(activeBoard.columns);
      const [moved] = reordered.splice(source.index, 1);
      reordered.splice(destination.index, 0, moved);
      setActiveBoard({ ...activeBoard, columns: reordered });
      return;
    }

    // Mover tarefa entre colunas
    if (!activeBoard) return;
    updateTaskLocally(draggableId, destination.droppableId);
    await taskApi.move(draggableId, destination.droppableId);
  };

  return { handleDragEnd };
}
