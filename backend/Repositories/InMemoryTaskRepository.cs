using backend.Enum;
using backend.Model;
using System.Xml.Linq;

namespace backend.Repositories
{
    /// <summary>
    /// Implementação em memória do repositório de tarefas
    /// </summary>
    public class InMemoryTaskRepository : ITaskRepository
    {
        private readonly List<TaskCard> _tasks = new();

        /// <summary>
        /// Obtém todas as tarefas armazenadas na memória
        /// </summary>
        /// <returns>Lista de todas as tarefas</returns>
        public IEnumerable<TaskCard> GetAll() => _tasks;

        /// <summary>
        /// Obtém uma tarefa específica pelo seu ID
        /// </summary>
        /// <param name="id">ID da tarefa a recuperar</param>
        /// <returns>Tarefa encontrada ou null se não existir</returns>
        public TaskCard? GetById(Guid id) =>
            _tasks.FirstOrDefault(t => t.Id == id);

        /// <summary>
        /// Adiciona uma nova tarefa à memória
        /// </summary>
        /// <param name="task">Tarefa a adicionar</param>
        public void Add(TaskCard task)
        {
            _tasks.Add(task);
        }

        /// <summary>
        /// Atualiza uma tarefa existente
        /// </summary>
        /// <param name="task">Tarefa com dados atualizados</param>
        public void Update(TaskCard task)
        {
            var existing = GetById(task.Id);

            if (existing == null)
                return;

            existing.Title = task.Title;
            existing.Description = task.Description;
            existing.AssignedTo = task.AssignedTo;
            existing.ColumnId = task.ColumnId;
            existing.Tags = task.Tags;
        }

        /// <summary>
        /// Deleta uma tarefa da memória
        /// </summary>
        /// <param name="id">ID da tarefa a deletar</param>
        public void Delete(Guid id)
        {
            var task = GetById(id);

            if (task != null)
                _tasks.Remove(task);
        }

        /// <summary>
        /// Filtra tarefas por board, coluna e/ou responsável
        /// </summary>
        /// <param name="boardId">ID do board (opcional)</param>
        /// <param name="columnId">ID da coluna (opcional)</param>
        /// <param name="assignedTo">Nome do responsável (opcional)</param>
        /// <returns>Lista de tarefas que correspondem aos filtros especificados</returns>
        public IEnumerable<TaskCard> Filter(Guid? boardId, Guid? columnId, string? assignedTo)
        {
            return _tasks.Where(t =>
                (!boardId.HasValue || t.BoardId == boardId.Value) &&
                (!columnId.HasValue || t.ColumnId == columnId.Value) &&
                (string.IsNullOrEmpty(assignedTo) || t.AssignedTo == assignedTo)
            );
        }
    }
}
