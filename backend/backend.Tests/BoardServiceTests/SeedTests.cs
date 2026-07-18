using backend.Models;
using backend.Repositories;
using backend.Services;
using Moq;
using Xunit;

namespace backend.Tests.BoardServiceTests
{
    /// <summary>
    /// Valida que o seed do board por defeito é explícito (SeedDefaultBoardIfNone) e não um efeito
    /// secundário do construtor do BoardService
    /// </summary>
    public class SeedTests
    {
        private readonly Mock<IBoardRepository> _boardRepositoryMock;
        private readonly Mock<IBoardColumnRepository> _columnRepositoryMock;
        private readonly Mock<ITaskRepository> _taskRepositoryMock;

        public SeedTests()
        {
            _boardRepositoryMock = new Mock<IBoardRepository>();
            _columnRepositoryMock = new Mock<IBoardColumnRepository>();
            _taskRepositoryMock = new Mock<ITaskRepository>();
        }

        [Fact]
        public void Constructor_DoesNotCreateAnyBoard()
        {
            var boardService = new BoardService(_boardRepositoryMock.Object, _columnRepositoryMock.Object, _taskRepositoryMock.Object);

            _boardRepositoryMock.Verify(r => r.Add(It.IsAny<Board>()), Times.Never());
            _columnRepositoryMock.Verify(r => r.Add(It.IsAny<BoardColumn>()), Times.Never());
        }

        [Fact]
        public void SeedDefaultBoardIfNone_WithNoBoards_CreatesBoardWithDefaultColumns()
        {
            _boardRepositoryMock.Setup(r => r.GetAll()).Returns(new List<Board>());

            var boardService = new BoardService(_boardRepositoryMock.Object, _columnRepositoryMock.Object, _taskRepositoryMock.Object);

            boardService.SeedDefaultBoardIfNone();

            _boardRepositoryMock.Verify(r => r.Add(It.IsAny<Board>()), Times.Once());
            _columnRepositoryMock.Verify(r => r.Add(It.IsAny<BoardColumn>()), Times.Exactly(3));
        }

        [Fact]
        public void SeedDefaultBoardIfNone_WithExistingBoards_DoesNothing()
        {
            _boardRepositoryMock.Setup(r => r.GetAll()).Returns(new List<Board> { new Board { Id = Guid.NewGuid(), Name = "Já existe" } });

            var boardService = new BoardService(_boardRepositoryMock.Object, _columnRepositoryMock.Object, _taskRepositoryMock.Object);

            boardService.SeedDefaultBoardIfNone();

            _boardRepositoryMock.Verify(r => r.Add(It.IsAny<Board>()), Times.Never());
            _columnRepositoryMock.Verify(r => r.Add(It.IsAny<BoardColumn>()), Times.Never());
        }
    }
}
