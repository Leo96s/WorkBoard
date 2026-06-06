using backend.DTOs;
using backend.Models;
using backend.Repositories;

namespace backend.Services
{
    /// <summary>
    /// Serviço de negócio para gerenciar operações de tarefas
    /// </summary>
    public class TaskService : ITaskService
    {
        private readonly ITaskRepository _repository;

        /// <summary>
        /// Inicializa uma nova instância do TaskService com o repositório de tarefas
        /// </summary>
        /// <param name="repository">Repositório para gerenciar tarefas</param>
        public TaskService(ITaskRepository repository)
        {
            _repository = repository;
        }

        /// <summary>
        /// Obtém todas as tarefas existentes
        /// </summary>
        /// <returns>Enumeração de todas as tarefas</returns>
        public IEnumerable<TaskCard> GetAll() => _repository.GetAll();

        /// <summary>
        /// Obtém uma tarefa específica pelo seu ID
        /// </summary>
        /// <param name="id">ID da tarefa a recuperar</param>
        /// <returns>Tarefa com o ID especificado ou null se não encontrada</returns>
        public TaskCard? GetById(Guid id) => _repository.GetById(id);

        /// <summary>
        /// Cria uma nova tarefa
        /// </summary>
        /// <param name="dto">Dados para criar a nova tarefa</param>
        /// <returns>Tarefa criada</returns>
        public TaskCard Create(CreateTaskDto dto)
        {
            var task = new TaskCard
            {
                Title = dto.Title,
                Description = dto.Description,
                AssignedTo = dto.AssignedTo,
                ColumnId = dto.ColumnId,
                BoardId = dto.BoardId,
                Tags = dto.Tags,
            };

            _repository.Add(task);
            return task;
        }

        /// <summary>
        /// Atualiza os dados de uma tarefa existente
        /// </summary>
        /// <param name="id">ID da tarefa a atualizar</param>
        /// <param name="dto">Novos dados da tarefa</param>
        public void Update(Guid id, UpdateTaskDto dto)
        {
            var task = _repository.GetById(id);
            if (task == null) return;

            task.Title = dto.Title;
            task.Description = dto.Description;
            task.AssignedTo = dto.AssignedTo;
            task.Tags = dto.Tags;

            if (dto.ColumnId.HasValue)
                task.ColumnId = dto.ColumnId.Value;

            _repository.Update(task);
        }

        /// <summary>
        /// Deleta uma tarefa
        /// </summary>
        /// <param name="id">ID da tarefa a deletar</param>
        public void Delete(Guid id) => _repository.Delete(id);

        /// <summary>
        /// Move uma tarefa para uma coluna diferente
        /// </summary>
        /// <param name="id">ID da tarefa a mover</param>
        /// <param name="newColumnId">ID da nova coluna</param>
        public void Move(Guid id, Guid newColumnId)
        {
            var task = _repository.GetById(id);
            if (task == null) return;

            task.ColumnId = newColumnId;
            _repository.Update(task);
        }

        /// <summary>
        /// Filtra tarefas por board, coluna e/ou responsável
        /// </summary>
        /// <param name="boardId">ID do board (opcional)</param>
        /// <param name="columnId">ID da coluna (opcional)</param>
        /// <param name="assignedTo">Nome do responsável (opcional)</param>
        /// <returns>Enumeração de tarefas que correspondem aos filtros</returns>
        public IEnumerable<TaskCard> Filter(Guid? boardId,Guid? columnId, string? search)
             => _repository.Filter(boardId, columnId, search);
    }
}