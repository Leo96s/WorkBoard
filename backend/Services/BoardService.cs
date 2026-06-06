using backend.DTOs;
using backend.Models;
using backend.Repositories;

namespace backend.Services
{
    /// <summary>
    /// Serviço de negócio para gerenciar operações de boards e suas colunas
    /// </summary>
    public class BoardService : IBoardService
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

        /// <summary>
        /// Inicializa uma nova instância do BoardService com os repositórios necessários
        /// </summary>
        /// <param name="boardRepository">Repositório para gerenciar boards</param>
        /// <param name="columnRepository">Repositório para gerenciar colunas</param>
        /// <param name="taskRepository">Repositório para gerenciar tarefas</param>
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

        /// <summary>
        /// Obtém todos os boards com suas colunas
        /// </summary>
        /// <returns>Enumeração de todos os boards convertidos para DTO</returns>
        public IEnumerable<BoardDto> GetAll()
            => _boardRepository.GetAll().Select(ToDto);

        /// <summary>
        /// Obtém um board específico pelo seu ID
        /// </summary>
        /// <param name="id">ID do board a recuperar</param>
        /// <returns>Board convertido para DTO ou null se não encontrado</returns>
        public BoardDto? GetById(Guid id)
        {
            var board = _boardRepository.GetById(id);
            return board == null ? null : ToDto(board);
        }

        /// <summary>
        /// Cria um novo board com colunas padrão
        /// </summary>
        /// <param name="dto">Dados do novo board</param>
        /// <returns>Board criado convertido para DTO</returns>
        public BoardDto Create(CreateBoardDto dto)
        {
            var board = new Board { Name = dto.Name };
            _boardRepository.Add(board);
            SeedDefaultColumns(board.Id);
            return ToDto(board);
        }

        /// <summary>
        /// Deleta um board, todas as suas colunas e tarefas associadas
        /// </summary>
        /// <param name="id">ID do board a deletar</param>
        /// <returns>true se deletado com sucesso, false se for o único board</returns>
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

        /// <summary>
        /// Adiciona uma nova coluna a um board existente
        /// </summary>
        /// <param name="boardId">ID do board onde adicionar a coluna</param>
        /// <param name="dto">Dados da nova coluna</param>
        /// <returns>Coluna criada convertida para DTO</returns>
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

        /// <summary>
        /// Atualiza os dados de uma coluna existente
        /// </summary>
        /// <param name="boardId">ID do board proprietário da coluna</param>
        /// <param name="columnId">ID da coluna a atualizar</param>
        /// <param name="dto">Novos dados da coluna</param>
        /// <returns>Coluna atualizada convertida para DTO ou null se não encontrada</returns>
        public ColumnDto? UpdateColumn(Guid boardId, Guid columnId, UpdateColumnDto dto)
        {
            var column = _columnRepository.GetById(columnId);
            if (column == null || column.BoardId != boardId) return null;

            column.Name = dto.Name;
            column.Color = dto.Color;
            _columnRepository.Update(column);
            return ToColumnDto(column);
        }

        /// <summary>
        /// Deleta uma coluna e todas as tarefas associadas
        /// </summary>
        /// <param name="boardId">ID do board proprietário da coluna</param>
        /// <param name="columnId">ID da coluna a deletar</param>
        /// <returns>true se deletado com sucesso, false se coluna não encontrada ou pertence a outro board</returns>
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

        /// <summary>
        /// Cria e adiciona as colunas padrão para um novo board
        /// </summary>
        /// <param name="boardId">ID do board onde adicionar as colunas padrão</param>
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

        /// <summary>
        /// Converte um Board para BoardDto, incluindo suas colunas
        /// </summary>
        /// <param name="board">Board a converter</param>
        /// <returns>BoardDto com informações do board e suas colunas</returns>
        private BoardDto ToDto(Board board) => new()
        {
            Id = board.Id,
            Name = board.Name,
            Columns = _columnRepository.GetByBoardId(board.Id).Select(ToColumnDto).ToList()
        };

        /// <summary>
        /// Converte uma BoardColumn para ColumnDto
        /// </summary>
        /// <param name="col">BoardColumn a converter</param>
        /// <returns>ColumnDto com informações da coluna</returns>
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

