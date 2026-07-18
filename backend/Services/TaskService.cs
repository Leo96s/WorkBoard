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
        private readonly IBoardRepository _boardRepository;
        private readonly IBoardColumnRepository _columnRepository;

        /// <summary>
        /// Inicializa uma nova instância do TaskService com os repositórios necessários
        /// </summary>
        /// <param name="repository">Repositório para gerenciar tarefas</param>
        /// <param name="boardRepository">Repositório para validar a existência de boards</param>
        /// <param name="columnRepository">Repositório para validar a existência e pertença de colunas</param>
        public TaskService(ITaskRepository repository, IBoardRepository boardRepository, IBoardColumnRepository columnRepository)
        {
            _repository = repository;
            _boardRepository = boardRepository;
            _columnRepository = columnRepository;
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
        /// <returns>Tarefa criada e o resultado da operação, ou null com o motivo da falha se o board/coluna forem inválidos</returns>
        public (TaskCard? Task, TaskOperationResult Result) Create(CreateTaskDto dto)
        {
            if (_boardRepository.GetById(dto.BoardId) == null)
                return (null, TaskOperationResult.InvalidBoard);

            var column = _columnRepository.GetById(dto.ColumnId);
            if (column == null || column.BoardId != dto.BoardId)
                return (null, TaskOperationResult.InvalidColumn);

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
            return (task, TaskOperationResult.Success);
        }

        /// <summary>
        /// Atualiza os dados de uma tarefa existente
        /// </summary>
        /// <param name="id">ID da tarefa a atualizar</param>
        /// <param name="dto">Novos dados da tarefa</param>
        /// <returns>Resultado da operação</returns>
        public TaskOperationResult Update(Guid id, UpdateTaskDto dto)
        {
            var task = _repository.GetById(id);
            if (task == null) return TaskOperationResult.NotFound;

            if (dto.ColumnId.HasValue)
            {
                var column = _columnRepository.GetById(dto.ColumnId.Value);
                if (column == null || column.BoardId != task.BoardId)
                    return TaskOperationResult.InvalidColumn;

                task.ColumnId = dto.ColumnId.Value;
            }

            task.Title = dto.Title;
            task.Description = dto.Description;
            task.AssignedTo = dto.AssignedTo;
            task.Tags = dto.Tags;

            _repository.Update(task);
            return TaskOperationResult.Success;
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
        /// <returns>Resultado da operação</returns>
        public TaskOperationResult Move(Guid id, Guid newColumnId)
        {
            var task = _repository.GetById(id);
            if (task == null) return TaskOperationResult.NotFound;

            var column = _columnRepository.GetById(newColumnId);
            if (column == null || column.BoardId != task.BoardId)
                return TaskOperationResult.InvalidColumn;

            task.ColumnId = newColumnId;
            _repository.Update(task);
            return TaskOperationResult.Success;
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