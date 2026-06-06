using backend.DTOs;
using backend.Models;
using backend.Repositories;

namespace backend.Services
{
    public interface ITaskService
    {
        public IEnumerable<TaskCard> GetAll();

        public TaskCard? GetById(Guid id);

        public TaskCard Create(CreateTaskDto dto);

        public void Update(Guid id, UpdateTaskDto dto);

        public void Delete(Guid id);

        public void Move(Guid id, Guid newColumnId);

        public IEnumerable<TaskCard> Filter(Guid? boardId, Guid? columnId, string? search);

    }
}
