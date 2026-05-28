using backend.DTOs;
using backend.Enum;
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
                Column = TaskColumn.Em_Curso
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

            _repository.Update(task);
        }

        public void Delete(Guid id) => _repository.Delete(id);

        public void Move(Guid id, TaskColumn newColumn)
        {
            var task = _repository.GetById(id);
            if (task == null) return;

            task.Column = newColumn;
            _repository.Update(task);
        }

        public IEnumerable<TaskCard> Filter(TaskColumn? column, string? assignedTo)
            => _repository.Filter(column, assignedTo);
    }
}
