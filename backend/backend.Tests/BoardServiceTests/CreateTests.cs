using backend.DTOs;
using backend.Models;
using backend.Repositories;
using backend.Services;
using Moq;
using Xunit;

namespace backend.Tests.BoardServiceTests
{
    public class CreateTests
    {
        private readonly Mock<IBoardRepository> _boardRepositoryMock;
        private readonly Mock<IBoardColumnRepository> _columnRepositoryMock;
        private readonly Mock<ITaskRepository> _taskRepositoryMock;

        public CreateTests()
        {
            _boardRepositoryMock = new Mock<IBoardRepository>();
            _columnRepositoryMock = new Mock<IBoardColumnRepository>();
            _taskRepositoryMock = new Mock<ITaskRepository>();

            // Setup default board creation in constructor
            _boardRepositoryMock.Setup(r => r.GetAll()).Returns(new List<Board> { new Board { Id = Guid.NewGuid(), Name = "Meu Quadro" } });
            _boardRepositoryMock.Setup(r => r.Add(It.IsAny<Board>()));
        }

        /// <summary>
        /// TC_BOARD_001_SPEC: Criar Board com Nome Válido
        /// Validar criação bem-sucedida de board com nome válido
        /// </summary>
        [Fact]
        public void TC_BOARD_001_CreateValidBoard_ReturnsNonNullBoardDtoWithDefaultColumns()
        {
            // Arrange
            var boardId = Guid.NewGuid();
            var dto = new CreateBoardDto { Name = "Projeto X" };

            _boardRepositoryMock.Setup(r => r.GetAll()).Returns(new List<Board>());
            _boardRepositoryMock.Setup(r => r.Add(It.IsAny<Board>())).Callback<Board>(b => b.Id = boardId);

            var columnIds = new[] { Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid() };
            var defaultColumns = new List<BoardColumn>
            {
                new BoardColumn { Id = columnIds[0], Name = "A Fazer", Color = "#3B82F6", BoardId = boardId, Order = 1 },
                new BoardColumn { Id = columnIds[1], Name = "Em Curso", Color = "#F59E0B", BoardId = boardId, Order = 2 },
                new BoardColumn { Id = columnIds[2], Name = "Concluído", Color = "#10B981", BoardId = boardId, Order = 3 }
            };

            _columnRepositoryMock.Setup(r => r.GetByBoardId(boardId)).Returns(defaultColumns);
            _columnRepositoryMock.Setup(r => r.Add(It.IsAny<BoardColumn>()));

            var boardService = new BoardService(_boardRepositoryMock.Object, _columnRepositoryMock.Object, _taskRepositoryMock.Object);

            // Reset para ignorar chamadas feitas pelo construtor do BoardService
            _columnRepositoryMock.Invocations.Clear();
            _boardRepositoryMock.Invocations.Clear();

            // Act
            var result = boardService.Create(dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Projeto X", result.Name);
            Assert.Equal(3, result.Columns.Count);

            _boardRepositoryMock.Verify(r => r.Add(It.IsAny<Board>()), Times.Once());
            _columnRepositoryMock.Verify(r => r.Add(It.IsAny<BoardColumn>()), Times.Exactly(3));
        }

        /// <summary>
        /// TC_BOARD_002: Criar Board com Nome Vazio
        /// Validar comportamento ao criar board com nome vazio
        /// </summary>
        [Fact]
        public void TC_BOARD_002_CreateBoardWithEmptyName_ReturnsBoard()
        {
            // Arrange
            var boardId = Guid.NewGuid();
            var dto = new CreateBoardDto { Name = "" };

            _boardRepositoryMock.Setup(r => r.GetAll()).Returns(new List<Board>());
            _boardRepositoryMock.Setup(r => r.Add(It.IsAny<Board>())).Callback<Board>(b => b.Id = boardId);

            _columnRepositoryMock.Setup(r => r.GetByBoardId(boardId)).Returns(new List<BoardColumn>
            {
                new BoardColumn { Id = Guid.NewGuid(), Name = "A Fazer", Color = "#3B82F6", BoardId = boardId, Order = 1 },
                new BoardColumn { Id = Guid.NewGuid(), Name = "Em Curso", Color = "#F59E0B", BoardId = boardId, Order = 2 },
                new BoardColumn { Id = Guid.NewGuid(), Name = "Concluído", Color = "#10B981", BoardId = boardId, Order = 3 }
            });
            _columnRepositoryMock.Setup(r => r.Add(It.IsAny<BoardColumn>()));

            var boardService = new BoardService(_boardRepositoryMock.Object, _columnRepositoryMock.Object, _taskRepositoryMock.Object);

            // Reset para ignorar chamadas feitas pelo construtor do BoardService
            _columnRepositoryMock.Invocations.Clear();
            _boardRepositoryMock.Invocations.Clear();

            // Act
            var result = boardService.Create(dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("", result.Name);
            Assert.Equal(3, result.Columns.Count);
        }

        /// <summary>
        /// TC_BOARD_003: Criar Board com Nome muito Longo
        /// Validar criação de board com nome muito longo
        /// </summary>
        [Fact]
        public void TC_BOARD_003_CreateBoardWithVeryLongName_ReturnsBoard()
        {
            // Arrange
            var boardId = Guid.NewGuid();
            var longName = new string('A', 300);
            var dto = new CreateBoardDto { Name = longName };

            _boardRepositoryMock.Setup(r => r.GetAll()).Returns(new List<Board>());
            _boardRepositoryMock.Setup(r => r.Add(It.IsAny<Board>())).Callback<Board>(b => b.Id = boardId);

            _columnRepositoryMock.Setup(r => r.GetByBoardId(boardId)).Returns(new List<BoardColumn>
            {
                new BoardColumn { Id = Guid.NewGuid(), Name = "A Fazer", Color = "#3B82F6", BoardId = boardId, Order = 1 },
                new BoardColumn { Id = Guid.NewGuid(), Name = "Em Curso", Color = "#F59E0B", BoardId = boardId, Order = 2 },
                new BoardColumn { Id = Guid.NewGuid(), Name = "Concluído", Color = "#10B981", BoardId = boardId, Order = 3 }
            });
            _columnRepositoryMock.Setup(r => r.Add(It.IsAny<BoardColumn>()));

            var boardService = new BoardService(_boardRepositoryMock.Object, _columnRepositoryMock.Object, _taskRepositoryMock.Object);

            // Reset para ignorar chamadas feitas pelo construtor do BoardService
            _columnRepositoryMock.Invocations.Clear();
            _boardRepositoryMock.Invocations.Clear();

            // Act
            var result = boardService.Create(dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(longName, result.Name);
            Assert.Equal(3, result.Columns.Count);
        }
    }
}