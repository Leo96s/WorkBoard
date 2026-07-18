using backend.Models;

namespace backend.Repositories
{
    /// <summary>
    /// Implementação em memória do repositório de colunas de boards
    /// </summary>
    public class InMemoryBoardColumnRepository : InMemoryRepository<BoardColumn>, IBoardColumnRepository
    {
        /// <summary>
        /// Obtém todas as colunas ordenadas
        /// </summary>
        /// <returns>Lista de todas as colunas ordenadas por ordem</returns>
        public override IEnumerable<BoardColumn> GetAll() => base.GetAll().OrderBy(c => c.Order);

        /// <summary>
        /// Obtém todas as colunas de um board específico ordenadas
        /// </summary>
        /// <param name="boardId">ID do board</param>
        /// <returns>Lista de colunas do board ordenadas por ordem</returns>
        public IEnumerable<BoardColumn> GetByBoardId(Guid boardId) =>
            base.GetAll().Where(c => c.BoardId == boardId).OrderBy(c => c.Order);
    }
}
