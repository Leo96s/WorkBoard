import { Board, BoardColumn } from "@/types";
import { DropResult } from "@hello-pangea/dnd";

/**
 * Hook para gerir o fim do drag and drop
 * Calcula a nova ordem/posição e delega a persistência para quem gere o estado (useBoards/useTasks)
 */
export function useDragEnd() {
  /**
   * Gere o fim do drag and drop
   */
  const handleDragEnd = async (
    result: DropResult,
    {
      boards,
      activeBoard,
      onReorderBoards,
      onReorderColumns,
      moveTask,
    }: {
      boards: Board[];
      activeBoard: Board | null;
      onReorderBoards: (reordered: Board[]) => void | Promise<void>;
      onReorderColumns: (reordered: BoardColumn[]) => void | Promise<void>;
      moveTask: (id: string, columnId: string) => void | Promise<void>;
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
      await onReorderBoards(reordered);
      return;
    }

    // Reordenar colunas
    if (type === "COLUMN") {
      if (!activeBoard) return;
      const reordered = Array.from(activeBoard.columns);
      const [moved] = reordered.splice(source.index, 1);
      reordered.splice(destination.index, 0, moved);
      await onReorderColumns(reordered);
      return;
    }

    // Mover tarefa entre colunas
    if (!activeBoard) return;
    await moveTask(draggableId, destination.droppableId);
  };

  return { handleDragEnd };
}
