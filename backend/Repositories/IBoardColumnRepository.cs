using backend.Models;

namespace backend.Repositories
{
    public interface IBoardColumnRepository
    {
        IEnumerable<BoardColumn> GetAll();

        IEnumerable<BoardColumn> GetByBoardId(Guid boardId);

        BoardColumn? GetById(Guid id);

        void Add(BoardColumn column);

        void Update(BoardColumn column);

        void Delete(Guid id);
    }
}