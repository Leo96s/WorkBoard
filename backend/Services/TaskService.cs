using backend.DTOs;
using backend.Model;
using backend.Repositories;

namespace backend.Services
{
    public class TaskService
    {
        private readonly ITaskRepository _repository;

        public TaskService(ITaskRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<TaskCard> GetAll() => _repository.GetAll();

        public TaskCard? GetById(Guid id) => _repository.GetById(id);

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

        public void Delete(Guid id) => _repository.Delete(id);

        public void Move(Guid id, Guid newColumnId)
        {
            var task = _repository.GetById(id);
            if (task == null) return;

            task.ColumnId = newColumnId;
            _repository.Update(task);
        }

        public IEnumerable<TaskCard> Filter(Guid? boardId, Guid? columnId,string? assignedTo)
            => _repository.Filter(boardId, columnId, assignedTo);
    }
}