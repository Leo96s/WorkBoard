namespace backend.Models
{
    public class BoardColumn : IEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public string Name { get; set; } = string.Empty;

        public string Color { get; set; } = "#3B82F6";

        public int Order { get; set; }

        public Guid BoardId { get; set; }
    }
}
