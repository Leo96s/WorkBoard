using backend.Models;
using backend.Repositories;
using backend.Services;
using Moq;
using Xunit;

namespace backend.Tests.BoardServiceTests
{
    public class DeleteTests
    {
        private readonly Mock<IBoardRepository> _boardRepositoryMock;
        private readonly Mock<IBoardColumnRepository> _columnRepositoryMock;
        private readonly Mock<ITaskRepository> _taskRepositoryMock;
        private readonly BoardService _boardService;

        public DeleteTests()
        {
            _boardRepositoryMock = new Mock<IBoardRepository>();
            _columnRepositoryMock = new Mock<IBoardColumnRepository>();
            _taskRepositoryMock = new Mock<ITaskRepository>();

            // Setup default board creation in constructor
            _boardRepositoryMock.Setup(r => r.GetAll()).Returns(new List<Board> { new Board { Id = Guid.NewGuid(), Name = "Meu Quadro" } });
            _boardRepositoryMock.Setup(r => r.Add(It.IsAny<Board>()));

            _boardService = new BoardService(_boardRepositoryMock.Object, _columnRepositoryMock.Object, _taskRepositoryMock.Object);
        }

        /// <summary>
        /// TC_BOARD_004_SPEC: Eliminar Board Único
        /// Validar que não é possível eliminar o único board
        /// </summary>
        [Fact]
        public void TC_BOARD_004_DeleteUniqueBoard_ReturnsFalseAndBoardRemainsSafe()
        {
            // Arrange
            var boardId = Guid.NewGuid();
            var board = new Board { Id = boardId, Name = "Único Board" };

            // Setup: Only one board exists
            _boardRepositoryMock.Setup(r => r.GetAll()).Returns(new List<Board> { board });
            _boardRepositoryMock.Setup(r => r.GetById(boardId)).Returns(board);

            // Act
            var result = _boardService.Delete(boardId);

            // Assert
            Assert.False(result);

            // Verify that Delete was NOT called
            _boardRepositoryMock.Verify(r => r.Delete(It.IsAny<Guid>()), Times.Never());
        }

        /// <summary>
        /// TC_BOARD_005_SPEC: Eliminar Board com Múltiplos Boards
        /// Validar eliminação de board quando existem múltiplos
        /// </summary>
        [Fact]
        public void TC_BOARD_005_DeleteBoardWhenMultipleExist_ReturnsTrueAndDeletesAllRelatedData()
        {
            // Arrange
            var boardId = Guid.NewGuid();
            var otherBoardId = Guid.NewGuid();
            var board = new Board { Id = boardId, Name = "Board a Eliminar" };
            var otherBoard = new Board { Id = otherBoardId, Name = "Outro Board" };

            var columnId1 = Guid.NewGuid();
            var columnId2 = Guid.NewGuid();
            var taskId1 = Guid.NewGuid();
            var taskId2 = Guid.NewGuid();

            var columns = new List<BoardColumn>
            {
                new BoardColumn { Id = columnId1, Name = "Col1", BoardId = boardId, Order = 1 },
                new BoardColumn { Id = columnId2, Name = "Col2", BoardId = boardId, Order = 2 }
            };

            var tasks = new List<TaskCard>
            {
                new TaskCard { Id = taskId1, Title = "Task 1", BoardId = boardId, ColumnId = columnId1, Tags = new List<string>() },
                new TaskCard { Id = taskId2, Title = "Task 2", BoardId = boardId, ColumnId = columnId2, Tags = new List<string>() }
            };

            // Setup: Multiple boards exist
            _boardRepositoryMock.Setup(r => r.GetAll()).Returns(new List<Board> { board, otherBoard });
            _boardRepositoryMock.Setup(r => r.GetById(boardId)).Returns(board);
            _columnRepositoryMock.Setup(r => r.GetByBoardId(boardId)).Returns(columns);
            _taskRepositoryMock.Setup(r => r.GetAll()).Returns(tasks);

            // Act
            var result = _boardService.Delete(boardId);

            // Assert
            Assert.True(result);

            // Verify that all tasks were deleted
            _taskRepositoryMock.Verify(r => r.Delete(taskId1), Times.Once());
            _taskRepositoryMock.Verify(r => r.Delete(taskId2), Times.Once());

            // Verify that all columns were deleted
            _columnRepositoryMock.Verify(r => r.Delete(columnId1), Times.Once());
            _columnRepositoryMock.Verify(r => r.Delete(columnId2), Times.Once());

            // Verify that board was deleted
            _boardRepositoryMock.Verify(r => r.Delete(boardId), Times.Once());
        }

        /// <summary>
        /// TC_BOARD_005: Eliminar Board - Verificação Adicional
        /// Validar que apenas o board desejado é eliminado
        /// </summary>
        [Fact]
        public void TC_BOARD_005_DeleteBoard_OnlyTargetBoardIsDeleted()
        {
            // Arrange
            var boardId = Guid.NewGuid();
            var board1 = new Board { Id = boardId, Name = "Board 1" };
            var board2 = new Board { Id = Guid.NewGuid(), Name = "Board 2" };
            var board3 = new Board { Id = Guid.NewGuid(), Name = "Board 3" };

            _boardRepositoryMock.Setup(r => r.GetAll()).Returns(new List<Board> { board1, board2, board3 });
            _boardRepositoryMock.Setup(r => r.GetById(boardId)).Returns(board1);
            _columnRepositoryMock.Setup(r => r.GetByBoardId(boardId)).Returns(new List<BoardColumn>());
            _taskRepositoryMock.Setup(r => r.GetAll()).Returns(new List<TaskCard>());

            // Act
            var result = _boardService.Delete(boardId);

            // Assert
            Assert.True(result);
            _boardRepositoryMock.Verify(r => r.Delete(boardId), Times.Once());
        }
    }
}