using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class CreateBoardColumnDto
    {
        [Required]
        [StringLength(50, MinimumLength = 1)]
        public string Name { get; set; } = string.Empty;

        [RegularExpression("^#[0-9A-Fa-f]{6}$", ErrorMessage = "Cor deve ser um hexadecimal válido, ex: #3B82F6")]
        public string Color { get; set; } = "#3B82F6";
    }
}
