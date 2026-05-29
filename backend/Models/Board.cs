namespace backend.Models
{
    public class Board
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public string Name { get; set; } = "Meu Board";

    }
}
