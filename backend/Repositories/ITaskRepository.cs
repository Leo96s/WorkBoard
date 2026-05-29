using backend.Model;

namespace backend.Repositories
{
    public interface ITaskRepository
    {
            IEnumerable<TaskCard> GetAll();

            TaskCard? GetById(Guid id);

            void Add(TaskCard task);

            void Update(TaskCard task);

            void Delete(Guid id);

            IEnumerable<TaskCard> Filter(Guid? boardId, Guid? columnId, string? assignedTo);
    }
}
