using backend.Models;
using backend.Repositories;
using backend.Services;
using Moq;
using Xunit;

namespace backend.Tests.TaskServiceTests
{
    public class MoveAndDeleteTests
    {
        private readonly Mock<ITaskRepository> _taskRepositoryMock;
        private readonly Mock<IBoardRepository> _boardRepositoryMock;
        private readonly Mock<IBoardColumnRepository> _columnRepositoryMock;
        private readonly TaskService _taskService;

        public MoveAndDeleteTests()
        {
            _taskRepositoryMock = new Mock<ITaskRepository>();
            _boardRepositoryMock = new Mock<IBoardRepository>();
            _columnRepositoryMock = new Mock<IBoardColumnRepository>();
            _taskService = new TaskService(_taskRepositoryMock.Object, _boardRepositoryMock.Object, _columnRepositoryMock.Object);
        }

        /// <summary>
        /// TC_TASK_006_SPEC: Mover Tarefa para Outra Coluna
        /// Validar movimento de tarefa entre colunas
        /// </summary>
        [Fact]
        public void TC_TASK_006_MoveTask_ToAnotherColumn_UpdatesColumnIdSuccessfully()
        {
            // Arrange
            var taskId = Guid.NewGuid();
            var col1Id = Guid.NewGuid();
            var col2Id = Guid.NewGuid();
            var boardId = Guid.NewGuid();

            var task = new TaskCard
            {
                Id = taskId,
                Title = "Tarefa",
                ColumnId = col1Id,
                BoardId = boardId,
                Tags = new List<string>()
            };

            _taskRepositoryMock.Setup(r => r.GetById(taskId)).Returns(task);
            _taskRepositoryMock.Setup(r => r.Update(It.IsAny<TaskCard>()));
            _columnRepositoryMock.Setup(r => r.GetById(col2Id)).Returns(new BoardColumn { Id = col2Id, BoardId = boardId });

            // Act
            var opResult = _taskService.Move(taskId, col2Id);
            var moved = _taskService.GetById(taskId);

            // Assert
            Assert.Equal(TaskOperationResult.Success, opResult);
            Assert.NotNull(moved);
            Assert.Equal(col2Id, moved.ColumnId);
            Assert.Equal(taskId, moved.Id);

            _taskRepositoryMock.Verify(
                r => r.Update(It.Is<TaskCard>(t => t.ColumnId == col2Id)),
                Times.Once()
            );
        }

        /// <summary>
        /// TC_TASK_006: Mover Tarefa - Verificação Adicional
        /// Validar que outros dados da tarefa permanecem inalterados
        /// </summary>
        [Fact]
        public void TC_TASK_006_MoveTask_PreservesOtherData()
        {
            // Arrange
            var taskId = Guid.NewGuid();
            var col1Id = Guid.NewGuid();
            var col2Id = Guid.NewGuid();
            var boardId = Guid.NewGuid();

            var task = new TaskCard
            {
                Id = taskId,
                Title = "Tarefa Importante",
                Description = "Descrição",
                AssignedTo = "João",
                ColumnId = col1Id,
                BoardId = boardId,
                Tags = new List<string> { "urgent" }
            };

            _taskRepositoryMock.Setup(r => r.GetById(taskId)).Returns(task);
            _taskRepositoryMock.Setup(r => r.Update(It.IsAny<TaskCard>()));
            _columnRepositoryMock.Setup(r => r.GetById(col2Id)).Returns(new BoardColumn { Id = col2Id, BoardId = boardId });

            // Act
            _taskService.Move(taskId, col2Id);
            var moved = _taskService.GetById(taskId);

            // Assert
            Assert.NotNull(moved);
            Assert.Equal("Tarefa Importante", moved.Title);
            Assert.Equal("Descrição", moved.Description);
            Assert.Equal("João", moved.AssignedTo);
            Assert.Equal(boardId, moved.BoardId);
            Assert.Contains("urgent", moved.Tags);
        }

        /// <summary>
        /// TC_TASK_007_SPEC: Eliminar Tarefa - ID Válido
        /// Validar eliminação de tarefa
        /// </summary>
        [Fact]
        public void TC_TASK_007_DeleteTask_WithValidId_DeletesSuccessfully()
        {
            // Arrange
            var taskId = Guid.NewGuid();

            _taskRepositoryMock.Setup(r => r.Delete(taskId));

            // Act
            _taskService.Delete(taskId);

            // Assert
            _taskRepositoryMock.Verify(r => r.Delete(taskId), Times.Once());
        }

        /// <summary>
        /// TC_TASK_007: Eliminar Tarefa - Verificação Adicional
        /// Validar que GetById retorna null após deletar
        /// </summary>
        [Fact]
        public void TC_TASK_007_DeleteTask_GetByIdReturnsNull()
        {
            // Arrange
            var taskId = Guid.NewGuid();

            _taskRepositoryMock.Setup(r => r.GetById(taskId)).Returns((TaskCard?)null);
            _taskRepositoryMock.Setup(r => r.Delete(taskId));

            // Act
            _taskService.Delete(taskId);
            var deleted = _taskService.GetById(taskId);

            // Assert
            Assert.Null(deleted);
        }

        /// <summary>
        /// TC_TASK_006: Mover Tarefa - Verificação com ID Inválido
        /// Validar que Move com ID inválido não executa Update
        /// </summary>
        [Fact]
        public void TC_TASK_006_MoveTask_WithInvalidId_DoesNothing()
        {
            // Arrange
            var invalidTaskId = Guid.NewGuid();
            var newColumnId = Guid.NewGuid();

            _taskRepositoryMock.Setup(r => r.GetById(invalidTaskId)).Returns((TaskCard?)null);

            // Act
            var opResult = _taskService.Move(invalidTaskId, newColumnId);

            // Assert
            Assert.Equal(TaskOperationResult.NotFound, opResult);
            _taskRepositoryMock.Verify(r => r.Update(It.IsAny<TaskCard>()), Times.Never());
        }
    }
}
