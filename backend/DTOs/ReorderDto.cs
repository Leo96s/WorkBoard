namespace backend.DTOs
{
    public class ReorderDto
    {
        public List<Guid> OrderedIds { get; set; } = new();
    }
}
