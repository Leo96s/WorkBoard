using backend.Models;

namespace backend.Repositories
{
    /// <summary>
    /// Implementação em memória do repositório de tarefas
    /// </summary>
    public class InMemoryTaskRepository : InMemoryRepository<TaskCard>, ITaskRepository
    {
        /// <summary>
        /// Filtra tarefas por board, coluna e/ou responsável/tag
        /// </summary>
        /// <param name="boardId">ID do board (opcional)</param>
        /// <param name="columnId">ID da coluna (opcional)</param>
        /// <param name="search">Filtro ajustável entre responsável e tags (opcional)</param>
        /// <returns>Lista de tarefas que correspondem aos filtros especificados</returns>
        public IEnumerable<TaskCard> Filter(Guid? boardId, Guid? columnId, string? search)
        {
            return GetAll().Where(t =>
                (!boardId.HasValue || t.BoardId == boardId.Value) &&
                (!columnId.HasValue || t.ColumnId == columnId.Value) &&
                (
                    string.IsNullOrWhiteSpace(search)
                    ||
                    t.AssignedTo.Contains(search, StringComparison.OrdinalIgnoreCase)
                    ||
                    t.Tags.Any(tag =>
                        tag.Contains(search, StringComparison.OrdinalIgnoreCase))
                )
            );
        }
    }
}
