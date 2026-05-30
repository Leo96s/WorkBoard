namespace backend.DTOs
{
    public class CreateTaskDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string AssignedTo { get; set; } = string.Empty;

        public Guid ColumnId { get; set; }
        
        public Guid BoardId { get; set; }

        public List<string> Tags { get; set; } = new();
    }
}
