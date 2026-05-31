using backend.Model;
using backend.Models;

namespace backend.Repositories
{
    /// <summary>
    /// Implementação em memória do repositório de boards
    /// </summary>
    public class InMemoryBoardRepository : IBoardRepository
    {
        private readonly List<Board> _boards = new();

        /// <summary>
        /// Obtém todos os boards armazenados na memória
        /// </summary>
        /// <returns>Lista de todos os boards</returns>
        public IEnumerable<Board> GetAll()
        {
            return _boards;
        }

        /// <summary>
        /// Obtém um board específico pelo seu ID
        /// </summary>
        /// <param name="id">ID do board a recuperar</param>
        /// <returns>Board encontrado ou null se não existir</returns>
        public Board? GetById(Guid id)
        {
            return _boards.FirstOrDefault(b => b.Id == id);
        }

        /// <summary>
        /// Adiciona um novo board à memória
        /// </summary>
        /// <param name="board">Board a adicionar</param>
        public void Add(Board board)
        {
            _boards.Add(board);
        }

        /// <summary>
        /// Deleta um board da memória
        /// </summary>
        /// <param name="id">ID do board a deletar</param>
        public void Delete(Guid id)
        {
            var board = _boards.FirstOrDefault(b => b.Id == id);
            if (board != null)
            {
                _boards.Remove(board);
            }
        }
    }
}