using backend.Enum;
using backend.Model;
using System.Xml.Linq;

namespace backend.Repositories
{
    public class InMemoryTaskRepository : ITaskRepository
    {
        private readonly List<TaskCard> _tasks = new();

        public IEnumerable<TaskCard> GetAll() => _tasks;

        public TaskCard? GetById(Guid id) =>
            _tasks.FirstOrDefault(t => t.Id == id);

        public void Add(TaskCard task) => _tasks.Add(task);

        public void Update(TaskCard task)
        {
            var existing = GetById(task.Id);
            if (existing == null) return;

            existing.Title = task.Title;
            existing.Description = task.Description;
            existing.AssignedTo = task.AssignedTo;
            existing.Column = task.Column;
        }

        public void Delete(Guid id)
        {
            var task = GetById(id);
            if (task != null)
                _tasks.Remove(task);
        }

        public IEnumerable<TaskCard> Filter(TaskColumn? column, string? assignedTo)
        {
            return _tasks.Where(t =>
                (!column.HasValue || t.Column == column) &&
                (string.IsNullOrEmpty(assignedTo) || t.AssignedTo == assignedTo)
            );
        }
    }
}
