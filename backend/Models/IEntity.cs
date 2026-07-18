namespace backend.Models
{
    /// <summary>
    /// Contrato comum para entidades identificáveis por Guid, usado pelo repositório genérico em memória
    /// </summary>
    public interface IEntity
    {
        Guid Id { get; set; }
    }
}
