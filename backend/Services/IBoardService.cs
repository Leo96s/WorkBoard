using backend.DTOs;

namespace backend.Services
{
    public interface IBoardService
    {
        public IEnumerable<BoardDto> GetAll();

        public BoardDto? GetById(Guid id);

        public BoardDto Create(CreateBoardDto dto);

        public bool Delete(Guid id);

        public ColumnDto AddColumn(Guid boardId, CreateBoardColumnDto dto);

        public ColumnDto? UpdateColumn(Guid boardId, Guid columnId, UpdateColumnDto dto);

        public bool DeleteColumn(Guid boardId, Guid columnId);

        /// <summary>
        /// Reordena os boards existentes
        /// </summary>
        /// <param name="orderedIds">Lista de IDs de boards na nova ordem desejada</param>
        /// <returns>true se reordenado com sucesso, false se a lista não corresponder aos boards existentes</returns>
        public bool ReorderBoards(List<Guid> orderedIds);

        /// <summary>
        /// Reordena as colunas de um board
        /// </summary>
        /// <param name="boardId">ID do board proprietário das colunas</param>
        /// <param name="orderedColumnIds">Lista de IDs de colunas na nova ordem desejada</param>
        /// <returns>true se reordenado com sucesso, false se a lista não corresponder às colunas do board</returns>
        public bool ReorderColumns(Guid boardId, List<Guid> orderedColumnIds);

        /// <summary>
        /// Cria o board por defeito com as colunas padrão, caso ainda não exista nenhum board.
        /// Deve ser chamado explicitamente no arranque da aplicação (não no construtor do serviço).
        /// </summary>
        public void SeedDefaultBoardIfNone();
    }
}
