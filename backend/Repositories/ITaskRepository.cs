using backend.Models;

namespace backend.Repositories
{
    /// <summary>
    /// Interface para o repositório de tarefas
    /// </summary>
    public interface ITaskRepository
    {
        /// <summary>
        /// Obtém todas as tarefas
        /// </summary>
        /// <returns>Enumeração de todas as tarefas</returns>
        IEnumerable<TaskCard> GetAll();

        /// <summary>
        /// Obtém uma tarefa pelo seu ID
        /// </summary>
        /// <param name="id">ID da tarefa a recuperar</param>
        /// <returns>Tarefa com o ID especificado ou null se não encontrada</returns>
        TaskCard? GetById(Guid id);

        /// <summary>
        /// Adiciona uma nova tarefa
        /// </summary>
        /// <param name="task">Tarefa a adicionar</param>
        void Add(TaskCard task);

        /// <summary>
        /// Atualiza uma tarefa existente
        /// </summary>
        /// <param name="task">Tarefa com dados atualizados</param>
        void Update(TaskCard task);

        /// <summary>
        /// Deleta uma tarefa
        /// </summary>
        /// <param name="id">ID da tarefa a deletar</param>
        void Delete(Guid id);

        /// <summary>
        /// Filtra tarefas por critérios opcionais
        /// </summary>
        /// <param name="boardId">ID do board (opcional)</param>
        /// <param name="columnId">ID da coluna (opcional)</param>
        /// <param name="assignedTo">Nome do responsável (opcional)</param>
        /// <returns>Enumeração de tarefas que correspondem aos filtros</returns>
        IEnumerable<TaskCard> Filter(Guid? boardId, Guid? columnId, string? search);
    }
}
