using backend.Models;

namespace backend.Repositories
{
    /// <summary>
    /// Interface para o repositório de boards
    /// </summary>
    public interface IBoardRepository
    {
        /// <summary>
        /// Obtém todos os boards
        /// </summary>
        /// <returns>Enumeração de todos os boards</returns>
        IEnumerable<Board> GetAll();

        /// <summary>
        /// Obtém um board pelo seu ID
        /// </summary>
        /// <param name="id">ID do board a recuperar</param>
        /// <returns>Board com o ID especificado ou null se não encontrado</returns>
        Board? GetById(Guid id);

        /// <summary>
        /// Adiciona um novo board
        /// </summary>
        /// <param name="board">Board a adicionar</param>
        void Add(Board board);

        /// <summary>
        /// Atualiza um board existente
        /// </summary>
        /// <param name="board">Board com dados atualizados</param>
        void Update(Board board);

        /// <summary>
        /// Deleta um board
        /// </summary>
        /// <param name="id">ID do board a deletar</param>
        void Delete(Guid id);
    }
}