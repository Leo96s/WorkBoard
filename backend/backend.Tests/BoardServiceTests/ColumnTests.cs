using backend.DTOs;
using backend.Models;
using backend.Repositories;
using backend.Services;
using Moq;
using Xunit;

namespace backend.Tests.BoardServiceTests
{
    public class ColumnTests
    {
        private readonly Mock<IBoardRepository> _boardRepositoryMock;
        private readonly Mock<IBoardColumnRepository> _columnRepositoryMock;
        private readonly Mock<ITaskRepository> _taskRepositoryMock;

        public ColumnTests()
        {
            _boardRepositoryMock = new Mock<IBoardRepository>();
            _columnRepositoryMock = new Mock<IBoardColumnRepository>();
            _taskRepositoryMock = new Mock<ITaskRepository>();

            // Setup default board creation in constructor
            _boardRepositoryMock.Setup(r => r.GetAll()).Returns(new List<Board> { new Board { Id = Guid.NewGuid(), Name = "Meu Quadro" } });
            _boardRepositoryMock.Setup(r => r.Add(It.IsAny<Board>()));
        }

        /// <summary>
        /// TC_BOARD_006_SPEC: Adicionar Coluna com Dados Válidos
        /// Validar adição de coluna com sucesso
        /// </summary>
        [Fact]
        public void TC_BOARD_006_AddColumn_WithValidData_ReturnsColumnDtoWithIncrementedOrder()
        {
            // Arrange
            var boardId = Guid.NewGuid();
            var newColumnId = Guid.NewGuid();

            var existingColumns = new List<BoardColumn>
            {
                new BoardColumn { Id = Guid.NewGuid(), Name = "A Fazer", Color = "#3B82F6", BoardId = boardId, Order = 1 },
                new BoardColumn { Id = Guid.NewGuid(), Name = "Em Curso", Color = "#F59E0B", BoardId = boardId, Order = 2 },
                new BoardColumn { Id = Guid.NewGuid(), Name = "Concluído", Color = "#10B981", BoardId = boardId, Order = 3 }
            };

            var dto = new CreateBoardColumnDto { Name = "Em Revisão", Color = "#9B59B6" };

            _columnRepositoryMock.Setup(r => r.GetByBoardId(boardId)).Returns(existingColumns);
            _columnRepositoryMock.Setup(r => r.Add(It.IsAny<BoardColumn>())).Callback<BoardColumn>(c => c.Id = newColumnId);

            var boardService = new BoardService(_boardRepositoryMock.Object, _columnRepositoryMock.Object, _taskRepositoryMock.Object);

            _columnRepositoryMock.Invocations.Clear();

            // Act
            var result = boardService.AddColumn(boardId, dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Em Revisão", result.Name);
            Assert.Equal("#9B59B6", result.Color);
            Assert.Equal(4, result.Order);
            Assert.Equal(boardId, result.BoardId);

            _columnRepositoryMock.Verify(r => r.Add(It.IsAny<BoardColumn>()), Times.Once());
        }

        /// <summary>
        /// TC_BOARD_007: Adicionar Coluna com Cor Inválida
        /// Validar adição de coluna com cor em formato inválido
        /// </summary>
        [Fact]
        public void TC_BOARD_007_AddColumn_WithInvalidColor_ReturnsColumnWithProvidedColor()
        {
            // Arrange
            var boardId = Guid.NewGuid();
            var newColumnId = Guid.NewGuid();

            _columnRepositoryMock.Setup(r => r.GetByBoardId(boardId)).Returns(new List<BoardColumn>());
            _columnRepositoryMock.Setup(r => r.Add(It.IsAny<BoardColumn>())).Callback<BoardColumn>(c => c.Id = newColumnId);

            var dto = new CreateBoardColumnDto { Name = "Nova", Color = "RED" };

            var boardService = new BoardService(_boardRepositoryMock.Object, _columnRepositoryMock.Object, _taskRepositoryMock.Object);

            // Act
            var result = boardService.AddColumn(boardId, dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Nova", result.Name);
            Assert.Equal("RED", result.Color);
            Assert.Equal(1, result.Order);
        }

        /// <summary>
        /// TC_BOARD_008_SPEC: Atualizar Coluna - Dados Válidos
        /// Validar atualização de coluna com dados válidos
        /// </summary>
        [Fact]
        public void TC_BOARD_008_UpdateColumn_WithValidData_UpdatesSuccessfully()
        {
            // Arrange
            var boardId = Guid.NewGuid();
            var columnId = Guid.NewGuid();
            var column = new BoardColumn { Id = columnId, Name = "Original", Color = "#000000", BoardId = boardId, Order = 1 };
            var dto = new UpdateColumnDto { Name = "Atualizado", Color = "#00FF00" };

            _columnRepositoryMock.Setup(r => r.GetById(columnId)).Returns(column);
            _columnRepositoryMock.Setup(r => r.Update(It.IsAny<BoardColumn>()));

            var boardService = new BoardService(_boardRepositoryMock.Object, _columnRepositoryMock.Object, _taskRepositoryMock.Object);

            // Act
            var result = boardService.UpdateColumn(boardId, columnId, dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Atualizado", result.Name);
            Assert.Equal("#00FF00", result.Color);

            _columnRepositoryMock.Verify(r => r.Update(It.IsAny<BoardColumn>()), Times.Once());
        }

        /// <summary>
        /// TC_BOARD_009_SPEC: Atualizar Coluna - Board Inválido
        /// Validar que atualização falha com board inválido
        /// </summary>
        [Fact]
        public void TC_BOARD_009_UpdateColumn_WithInvalidBoard_ReturnsNull()
        {
            // Arrange
            var boardId = Guid.NewGuid();
            var invalidBoardId = Guid.NewGuid();
            var columnId = Guid.NewGuid();
            var column = new BoardColumn { Id = columnId, Name = "Original", Color = "#000000", BoardId = boardId, Order = 1 };
            var dto = new UpdateColumnDto { Name = "Atualizado", Color = "#00FF00" };

            _columnRepositoryMock.Setup(r => r.GetById(columnId)).Returns(column);

            var boardService = new BoardService(_boardRepositoryMock.Object, _columnRepositoryMock.Object, _taskRepositoryMock.Object);

            // Act
            var result = boardService.UpdateColumn(invalidBoardId, columnId, dto);

            // Assert
            Assert.Null(result);
            _columnRepositoryMock.Verify(r => r.Update(It.IsAny<BoardColumn>()), Times.Never());
        }

        /// <summary>
        /// TC_BOARD_010_SPEC: Eliminar Coluna com Tarefas
        /// Validar eliminação de coluna e todas as tarefas associadas
        /// </summary>
        [Fact]
        public void TC_BOARD_010_DeleteColumn_WithTasks_DeletesColumnAndAllTasks()
        {
            // Arrange
            var boardId = Guid.NewGuid();
            var columnId = Guid.NewGuid();
            var column = new BoardColumn { Id = columnId, Name = "Col", BoardId = boardId, Order = 1 };

            var taskIds = new[] { Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid() };
            var tasks = taskIds.Select(id => new Models.TaskCard { Id = id, Title = "Task", ColumnId = columnId, BoardId = boardId }).ToList();

            _columnRepositoryMock.Setup(r => r.GetById(columnId)).Returns(column);
            _taskRepositoryMock.Setup(r => r.GetAll()).Returns(tasks);
            _columnRepositoryMock.Setup(r => r.Delete(columnId));
            _taskRepositoryMock.Setup(r => r.Delete(It.IsAny<Guid>()));
            
            var boardService = new BoardService(_boardRepositoryMock.Object, _columnRepositoryMock.Object, _taskRepositoryMock.Object);

            // Act
            var result = boardService.DeleteColumn(boardId, columnId);

            // Assert
            Assert.True(result);

            // Verify all tasks were deleted
            foreach (var taskId in taskIds)
            {
                _taskRepositoryMock.Verify(r => r.Delete(taskId), Times.Once());
            }

            // Verify column was deleted
            _columnRepositoryMock.Verify(r => r.Delete(columnId), Times.Once());
        }

        /// <summary>
        /// TC_BOARD_011_SPEC: Eliminar Coluna - IDs Inválidos
        /// Validar eliminação com IDs inválidos
        /// </summary>
        [Fact]
        public void TC_BOARD_011_DeleteColumn_WithInvalidIds_ReturnsFalse()
        {
            // Arrange
            var boardId = Guid.NewGuid();
            var columnId = Guid.NewGuid();

            _columnRepositoryMock.Setup(r => r.GetById(columnId)).Returns((BoardColumn?)null);
            
            var boardService = new BoardService(_boardRepositoryMock.Object, _columnRepositoryMock.Object, _taskRepositoryMock.Object);

            // Act
            var result = boardService.DeleteColumn(boardId, columnId);

            // Assert
            Assert.False(result);
            _columnRepositoryMock.Verify(r => r.Delete(It.IsAny<Guid>()), Times.Never());
        }

        /// <summary>
        /// TC_BOARD_011: Eliminar Coluna - Verificação Adicional
        /// Validar que coluna de outro board não é eliminada
        /// </summary>
        [Fact]
        public void TC_BOARD_011_DeleteColumn_FromDifferentBoard_ReturnsFalse()
        {
            // Arrange
            var boardId = Guid.NewGuid();
            var otherBoardId = Guid.NewGuid();
            var columnId = Guid.NewGuid();
            var column = new BoardColumn { Id = columnId, Name = "Col", BoardId = otherBoardId, Order = 1 };

            _columnRepositoryMock.Setup(r => r.GetById(columnId)).Returns(column);

            var boardService = new BoardService(_boardRepositoryMock.Object, _columnRepositoryMock.Object, _taskRepositoryMock.Object);

            // Act
            var result = boardService.DeleteColumn(boardId, columnId);

            // Assert
            Assert.False(result);
            _columnRepositoryMock.Verify(r => r.Delete(It.IsAny<Guid>()), Times.Never());
        }
    }
}
