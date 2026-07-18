import { columnApi } from "@/lib/api";
import { getRandomColor } from "@/lib/utils/colors";
import { getErrorMessage } from "@/lib/utils/apiError";

/**
 * Hook para gerir colunas
 * Responsável por criar e deletar colunas
 */
export function useColumns() {
  /**
   * Cria uma nova coluna em um board
   * @returns true se criada com sucesso, false caso contrário (já mostra alerta ao utilizador)
   */
  const createColumn = async (boardId: string, name: string): Promise<boolean> => {
    const color = getRandomColor();
    try {
      await columnApi.create(boardId, { name, color });
      return true;
    } catch (error) {
      alert(getErrorMessage(error, "Não foi possível criar a coluna. Tenta novamente."));
      return false;
    }
  };

  /**
   * Deleta uma coluna de um board
   */
  const deleteColumn = async (boardId: string, columnId: string) => {
    if (!boardId || !columnId) {
      alert("Erro: IDs de board ou coluna inválidos");
      return false;
    }

    try {
      await columnApi.delete(boardId, columnId);
      return true;
    } catch {
      alert("Erro ao apagar a coluna. Tenta novamente.");
      return false;
    }
  };

  return {
    createColumn,
    deleteColumn,
  };
}
