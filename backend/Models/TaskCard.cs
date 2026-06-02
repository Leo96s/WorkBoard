namespace backend.Models
{
    public class TaskCard
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public Guid ColumnId { get; set; }

        public Guid BoardId { get; set; }

        public string AssignedTo { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public List<string> Tags { get; set; } = new();
    }
}
