namespace backend.Models
{
    public class Board : IEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public string Name { get; set; } = "Meu Board";

        public int Order { get; set; }

    }
}
