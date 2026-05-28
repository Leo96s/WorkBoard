using backend.Enum;

namespace backend.Model
{
    public class TaskCard
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public TaskColumn Column { get; set; } = TaskColumn.Em_Curso;

        public string AssignedTo { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
