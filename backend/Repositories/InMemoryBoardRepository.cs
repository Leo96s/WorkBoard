using backend.Models;

namespace backend.Repositories
{
    /// <summary>
    /// Implementação em memória do repositório de boards
    /// </summary>
    public class InMemoryBoardRepository : InMemoryRepository<Board>, IBoardRepository
    {
        /// <summary>
        /// Obtém todos os boards armazenados, ordenados pela sua ordem de exibição
        /// </summary>
        /// <returns>Lista de todos os boards ordenados</returns>
        public override IEnumerable<Board> GetAll() => base.GetAll().OrderBy(b => b.Order);
    }
}
