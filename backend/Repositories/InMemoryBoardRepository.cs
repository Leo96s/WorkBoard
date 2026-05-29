using backend.Model;
using backend.Models;

namespace backend.Repositories
{
    public class InMemoryBoardRepository : IBoardRepository
    {
        private readonly List<Board> _boards = new();

        public IEnumerable<Board> GetAll()
        {
            return _boards;
        }

        public Board? GetById(Guid id)
        {
            return _boards.FirstOrDefault(b => b.Id == id);
        }

        public void Add(Board board)
        {
            _boards.Add(board);
        }

        public void Delete(Guid id)
        {
            var board = _boards.FirstOrDefault(b => b.Id == id);
            if (board != null)
            {
                _boards.Remove(board);
            }
        }
    }
}