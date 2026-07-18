namespace backend.Services
{
    /// <summary>
    /// Resultado de operações de escrita sobre tarefas, usado para mapear para o código HTTP correto no controller
    /// </summary>
    public enum TaskOperationResult
    {
        Success,
        NotFound,
        InvalidBoard,
        InvalidColumn
    }
}
