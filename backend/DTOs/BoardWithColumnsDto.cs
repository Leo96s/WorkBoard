namespace backend.DTOs
{
    public class BoardDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public List<ColumnDto> Columns { get; set; } = new();
    }

    public class ColumnDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
        public int Order { get; set; }
        public Guid BoardId { get; set; }
    }
}


