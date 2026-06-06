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




    }
}
