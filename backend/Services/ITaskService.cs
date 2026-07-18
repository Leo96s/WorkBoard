using backend.DTOs;
using backend.Models;
using backend.Repositories;

namespace backend.Services
{
    public interface ITaskService
    {
        public IEnumerable<TaskCard> GetAll();

        public TaskCard? GetById(Guid id);

        public (TaskCard? Task, TaskOperationResult Result) Create(CreateTaskDto dto);

        public TaskOperationResult Update(Guid id, UpdateTaskDto dto);

        public void Delete(Guid id);

        public TaskOperationResult Move(Guid id, Guid newColumnId);

        public IEnumerable<TaskCard> Filter(Guid? boardId, Guid? columnId, string? search);

    }
}
