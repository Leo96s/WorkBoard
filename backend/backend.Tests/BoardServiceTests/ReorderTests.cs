using backend.Models;
using backend.Repositories;
using backend.Services;
using Moq;
using Xunit;

namespace backend.Tests.BoardServiceTests
{
    public class ReorderTests
    {
        private readonly Mock<IBoardRepository> _boardRepositoryMock;
        private readonly Mock<IBoardColumnRepository> _columnRepositoryMock;
        private readonly Mock<ITaskRepository> _taskRepositoryMock;

        public ReorderTests()
        {
            _boardRepositoryMock = new Mock<IBoardRepository>();
            _columnRepositoryMock = new Mock<IBoardColumnRepository>();
            _taskRepositoryMock = new Mock<ITaskRepository>();

            // Setup default board creation in constructor
            _boardRepositoryMock.Setup(r => r.GetAll()).Returns(new List<Board> { new Board { Id = Guid.NewGuid(), Name = "Meu Quadro" } });
            _boardRepositoryMock.Setup(r => r.Add(It.IsAny<Board>()));
        }

        [Fact]
        public void ReorderBoards_WithValidIds_UpdatesOrderSequentially()
        {
            var board1 = new Board { Id = Guid.NewGuid(), Name = "B1", Order = 1 };
            var board2 = new Board { Id = Guid.NewGuid(), Name = "B2", Order = 2 };
            var board3 = new Board { Id = Guid.NewGuid(), Name = "B3", Order = 3 };

            _boardRepositoryMock.Setup(r => r.GetAll()).Returns(new List<Board> { board1, board2, board3 });

            var boardService = new BoardService(_boardRepositoryMock.Object, _columnRepositoryMock.Object, _taskRepositoryMock.Object);

            var newOrder = new List<Guid> { board3.Id, board1.Id, board2.Id };
            var result = boardService.ReorderBoards(newOrder);

            Assert.True(result);
            Assert.Equal(1, board3.Order);
            Assert.Equal(2, board1.Order);
            Assert.Equal(3, board2.Order);
            _boardRepositoryMock.Verify(r => r.Update(It.IsAny<Board>()), Times.Exactly(3));
        }

        [Fact]
        public void ReorderBoards_WithMismatchedIds_ReturnsFalse()
        {
            var board1 = new Board { Id = Guid.NewGuid(), Name = "B1", Order = 1 };
            var board2 = new Board { Id = Guid.NewGuid(), Name = "B2", Order = 2 };

            _boardRepositoryMock.Setup(r => r.GetAll()).Returns(new List<Board> { board1, board2 });

            var boardService = new BoardService(_boardRepositoryMock.Object, _columnRepositoryMock.Object, _taskRepositoryMock.Object);

            var invalidOrder = new List<Guid> { board1.Id, Guid.NewGuid() };
            var result = boardService.ReorderBoards(invalidOrder);

            Assert.False(result);
            _boardRepositoryMock.Verify(r => r.Update(It.IsAny<Board>()), Times.Never());
        }

        [Fact]
        public void ReorderColumns_WithValidIds_UpdatesOrderSequentially()
        {
            var boardId = Guid.NewGuid();
            var col1 = new BoardColumn { Id = Guid.NewGuid(), Name = "C1", BoardId = boardId, Order = 1 };
            var col2 = new BoardColumn { Id = Guid.NewGuid(), Name = "C2", BoardId = boardId, Order = 2 };

            _columnRepositoryMock.Setup(r => r.GetByBoardId(boardId)).Returns(new List<BoardColumn> { col1, col2 });

            var boardService = new BoardService(_boardRepositoryMock.Object, _columnRepositoryMock.Object, _taskRepositoryMock.Object);

            var newOrder = new List<Guid> { col2.Id, col1.Id };
            var result = boardService.ReorderColumns(boardId, newOrder);

            Assert.True(result);
            Assert.Equal(1, col2.Order);
            Assert.Equal(2, col1.Order);
            _columnRepositoryMock.Verify(r => r.Update(It.IsAny<BoardColumn>()), Times.Exactly(2));
        }

        [Fact]
        public void ReorderColumns_WithIdFromDifferentBoard_ReturnsFalse()
        {
            var boardId = Guid.NewGuid();
            var col1 = new BoardColumn { Id = Guid.NewGuid(), Name = "C1", BoardId = boardId, Order = 1 };

            _columnRepositoryMock.Setup(r => r.GetByBoardId(boardId)).Returns(new List<BoardColumn> { col1 });

            var boardService = new BoardService(_boardRepositoryMock.Object, _columnRepositoryMock.Object, _taskRepositoryMock.Object);

            var invalidOrder = new List<Guid> { col1.Id, Guid.NewGuid() };
            var result = boardService.ReorderColumns(boardId, invalidOrder);

            Assert.False(result);
            _columnRepositoryMock.Verify(r => r.Update(It.IsAny<BoardColumn>()), Times.Never());
        }
    }
}
