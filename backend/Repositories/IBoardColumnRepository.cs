using backend.Models;

namespace backend.Repositories
{
    /// <summary>
    /// Interface para o repositório de colunas de boards
    /// </summary>
    public interface IBoardColumnRepository
    {
        /// <summary>
        /// Obtém todas as colunas
        /// </summary>
        /// <returns>Enumeração de todas as colunas</returns>
        IEnumerable<BoardColumn> GetAll();

        /// <summary>
        /// Obtém todas as colunas de um board específico
        /// </summary>
        /// <param name="boardId">ID do board</param>
        /// <returns>Enumeração de colunas do board ordenadas</returns>
        IEnumerable<BoardColumn> GetByBoardId(Guid boardId);

        /// <summary>
        /// Obtém uma coluna pelo seu ID
        /// </summary>
        /// <param name="id">ID da coluna a recuperar</param>
        /// <returns>Coluna com o ID especificado ou null se não encontrada</returns>
        BoardColumn? GetById(Guid id);

        /// <summary>
        /// Adiciona uma nova coluna
        /// </summary>
        /// <param name="column">Coluna a adicionar</param>
        void Add(BoardColumn column);

        /// <summary>
        /// Atualiza uma coluna existente
        /// </summary>
        /// <param name="column">Coluna com dados atualizados</param>
        void Update(BoardColumn column);

        /// <summary>
        /// Deleta uma coluna
        /// </summary>
        /// <param name="id">ID da coluna a deletar</param>
        void Delete(Guid id);
    }
}