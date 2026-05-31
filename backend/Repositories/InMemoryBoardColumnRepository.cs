using backend.Model;
using backend.Models;
using System.Xml.Linq;

namespace backend.Repositories
{
    /// <summary>
    /// Implementação em memória do repositório de colunas de boards
    /// </summary>
    public class InMemoryBoardColumnRepository : IBoardColumnRepository
    {
        private readonly List<BoardColumn> _columns = new();

        /// <summary>
        /// Obtém todas as colunas ordenadas
        /// </summary>
        /// <returns>Lista de todas as colunas ordenadas por ordem</returns>
        public IEnumerable<BoardColumn> GetAll()
        {
            return _columns.OrderBy(c => c.Order);
        }

        /// <summary>
        /// Obtém todas as colunas de um board específico ordenadas
        /// </summary>
        /// <param name="boardId">ID do board</param>
        /// <returns>Lista de colunas do board ordenadas por ordem</returns>
        public IEnumerable<BoardColumn> GetByBoardId(Guid boardId)
        {
            return _columns.Where(c => c.BoardId == boardId).OrderBy(c => c.Order);
        }

        /// <summary>
        /// Obtém uma coluna pelo seu ID
        /// </summary>
        /// <param name="id">ID da coluna a recuperar</param>
        /// <returns>Coluna encontrada ou null se não existir</returns>
        public BoardColumn? GetById(Guid id)
        {
            return _columns.FirstOrDefault(c => c.Id == id);
        }

        /// <summary>
        /// Adiciona uma nova coluna à memória
        /// </summary>
        /// <param name="column">Coluna a adicionar</param>
        public void Add(BoardColumn column)
        {
            _columns.Add(column);
        }

        /// <summary>
        /// Atualiza uma coluna existente
        /// </summary>
        /// <param name="column">Coluna com dados atualizados</param>
        public void Update(BoardColumn column)
        {
            var existing = GetById(column.Id);

            if (existing == null)
                return;

            existing.Name = column.Name;
            existing.Color = column.Color;
            existing.Order = column.Order;
        }

        /// <summary>
        /// Deleta uma coluna da memória
        /// </summary>
        /// <param name="id">ID da coluna a deletar</param>
        public void Delete(Guid id)
        {
            var column = GetById(id);

            if (column != null)
                _columns.Remove(column);
        }
    }
}