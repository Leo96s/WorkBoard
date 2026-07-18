using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class UpdateTaskDto
    {
        [Required]
        [StringLength(200, MinimumLength = 1)]
        public string Title { get; set; } = string.Empty;

        [StringLength(2000)]
        public string Description { get; set; } = string.Empty;

        [StringLength(100)]
        public string AssignedTo { get; set; } = string.Empty;

        public Guid? ColumnId { get; set; }

        public List<string> Tags { get; set; } = new();
    }
}
