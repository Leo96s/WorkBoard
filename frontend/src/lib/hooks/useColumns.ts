import { columnApi } from "@/lib/api";
import { getRandomColor } from "@/lib/utils/colors";

/**
 * Hook para gerenciar colunas
 * Responsável por criar e deletar colunas
 */
export function useColumns() {
  /**
   * Cria uma nova coluna em um board
   */
  const createColumn = async (boardId: string, name: string) => {
    const color = getRandomColor();
    await columnApi.create(boardId, { name, color });
  };

  /**
   * Deleta uma coluna de um board
   */
  const deleteColumn = async (boardId: string, columnId: string) => {
    try {
      if (!boardId || !columnId) {
        console.error("IDs inválidos - boardId:", boardId, "columnId:", columnId);
        alert("Erro: IDs de board ou coluna inválidos");
        return false;
      }
      console.log("Deletando coluna:", { boardId, columnId });
      await columnApi.delete(boardId, columnId);
      return true;
    } catch (error) {
      console.error("Erro ao deletar coluna:", error);
      alert("Erro ao deletar coluna");
      return false;
    }
  };

  return {
    createColumn,
    deleteColumn,
  };
}
