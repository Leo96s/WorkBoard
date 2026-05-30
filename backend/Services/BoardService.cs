using backend.DTOs;
using backend.Models;
using backend.Repositories;

namespace backend.Services
{
    public class BoardService
    {
        private readonly IBoardRepository _boardRepository;
        private readonly IBoardColumnRepository _columnRepository;
        private readonly ITaskRepository _taskRepository;

        private static readonly (string Name, string Color)[] DefaultColumns = new[]
        {
            ("A Fazer", "#3B82F6"),
            ("Em Curso", "#F59E0B"),
            ("Concluído", "#10B981")
        };

        public BoardService(IBoardRepository boardRepository, IBoardColumnRepository columnRepository, ITaskRepository taskRepository)
        {
            _boardRepository = boardRepository;
            _columnRepository = columnRepository;
            _taskRepository = taskRepository;

            // Criar colunas por defeito para o board inicial
            var defaultBoard = new Board { Name = "Meu Quadro" };
            _boardRepository.Add(defaultBoard);
            SeedDefaultColumns(defaultBoard.Id);
        }

        public IEnumerable<BoardDto> GetAll()
            => _boardRepository.GetAll().Select(ToDto);

        public BoardDto? GetById(Guid id)
        {
            var board = _boardRepository.GetById(id);
            return board == null ? null : ToDto(board);
        }

        public BoardDto Create(CreateBoardDto dto)
        {
            var board = new Board { Name = dto.Name };
            _boardRepository.Add(board);
            SeedDefaultColumns(board.Id);
            return ToDto(board);
        }

        public bool Delete(Guid id)
        {
            if (_boardRepository.GetAll().Count() <= 1)
                return false; // não apaga se for o último

            var tasks = _taskRepository.GetAll().Where(t => t.BoardId == id).ToList();
            foreach (var task in tasks)
                _taskRepository.Delete(task.Id);

            var columns = _columnRepository.GetByBoardId(id).ToList();
            foreach (var column in columns)
                _columnRepository.Delete(column.Id);

            _boardRepository.Delete(id);
            return true;
        }

        public ColumnDto AddColumn(Guid boardId, CreateBoardColumnDto dto)
        {
            var existing = _columnRepository.GetByBoardId(boardId);
            var order = existing.Any() ? existing.Max(c => c.Order) + 1 : 1;

            var column = new BoardColumn
            {
                Name = dto.Name,
                Color = dto.Color,
                BoardId = boardId,
                Order = order
            };

            _columnRepository.Add(column);
            return ToColumnDto(column);
        }

        public ColumnDto? UpdateColumn(Guid boardId, Guid columnId, UpdateColumnDto dto)
        {
            var column = _columnRepository.GetById(columnId);
            if (column == null || column.BoardId != boardId) return null;

            column.Name = dto.Name;
            column.Color = dto.Color;
            _columnRepository.Update(column);
            return ToColumnDto(column);
        }

        public bool DeleteColumn(Guid boardId, Guid columnId)
        {
            var column = _columnRepository.GetById(columnId);
            if (column == null || column.BoardId != boardId) return false;

            // Apagar todas as tasks da coluna
            var tasks = _taskRepository.GetAll().Where(t => t.ColumnId == columnId).ToList();
            foreach (var task in tasks)
                _taskRepository.Delete(task.Id);

            _columnRepository.Delete(columnId);
            return true;
        }

        private void SeedDefaultColumns(Guid boardId)
        {
            for (int i = 0; i < DefaultColumns.Length; i++)
            {
                var (name, color) = DefaultColumns[i];
                var column = new BoardColumn
                {
                    Name = name,
                    Color = color,
                    BoardId = boardId,
                    Order = i + 1
                };
                _columnRepository.Add(column);
            }
        }

        private BoardDto ToDto(Board board) => new()
        {
            Id = board.Id,
            Name = board.Name,
            Columns = _columnRepository.GetByBoardId(board.Id).Select(ToColumnDto).ToList()
        };

        private static ColumnDto ToColumnDto(BoardColumn col) => new()
        {
            Id = col.Id,
            Name = col.Name,
            Color = col.Color,
            Order = col.Order,
            BoardId = col.BoardId
        };
    }
}

