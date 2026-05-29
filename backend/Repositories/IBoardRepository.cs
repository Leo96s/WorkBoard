using backend.Models;

namespace backend.Repositories
{
    public interface IBoardRepository
    {
        IEnumerable<Board> GetAll();

        Board? GetById(Guid id);

        void Add(Board board);

        void Delete(Guid id);
    }
}