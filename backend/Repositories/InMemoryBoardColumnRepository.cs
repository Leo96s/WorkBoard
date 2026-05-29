using backend.Model;
using backend.Models;
using System.Xml.Linq;

namespace backend.Repositories
{
    public class InMemoryBoardColumnRepository : IBoardColumnRepository
    {
        private readonly List<BoardColumn> _columns = new();

        public IEnumerable<BoardColumn> GetAll()
        {
            return _columns.OrderBy(c => c.Order);
        }

        public IEnumerable<BoardColumn> GetByBoardId(Guid boardId)
        {
            return _columns.Where(c => c.BoardId == boardId).OrderBy(c => c.Order);
        }

        public BoardColumn? GetById(Guid id)
        {
            return _columns.FirstOrDefault(c => c.Id == id);
        }

        public void Add(BoardColumn column)
        {
            _columns.Add(column);
        }

        public void Update(BoardColumn column)
        {
            var existing = GetById(column.Id);

            if (existing == null)
                return;

            existing.Name = column.Name;
            existing.Color = column.Color;
            existing.Order = column.Order;
        }

        public void Delete(Guid id)
        {
            var column = GetById(id);

            if (column != null)
                _columns.Remove(column);
        }
    }
}