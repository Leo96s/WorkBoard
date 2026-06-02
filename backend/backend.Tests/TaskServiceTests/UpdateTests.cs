using backend.DTOs;
using backend.Models;
using backend.Repositories;
using backend.Services;
using Moq;
using Xunit;

namespace backend.Tests.TaskServiceTests
{
    public class UpdateTests
    {
        private readonly Mock<ITaskRepository> _taskRepositoryMock;
        private readonly TaskService _taskService;

        public UpdateTests()
        {
            _taskRepositoryMock = new Mock<ITaskRepository>();
            _taskService = new TaskService(_taskRepositoryMock.Object);
        }

        /// <summary>
        /// TC_TASK_004_SPEC: Atualizar Tarefa - Todos os Campos
        /// Validar atualização de tarefa com novos valores
        /// </summary>
        [Fact]
        public void TC_TASK_004_UpdateTask_WithAllFields_UpdatesSuccessfully()
        {
            // Arrange
            var taskId = Guid.NewGuid();
            var col1Id = Guid.NewGuid();
            var col2Id = Guid.NewGuid();
            var boardId = Guid.NewGuid();

            var originalTask = new TaskCard
            {
                Id = taskId,
                Title = "Título Original",
                Description = "Descrição Original",
                AssignedTo = "João",
                ColumnId = col1Id,
                BoardId = boardId,
                Tags = new List<string> { "old" }
            };

            var updateDto = new UpdateTaskDto
            {
                Title = "Novo Título da Tarefa",
                Description = "Nova descrição",
                AssignedTo = "Maria",
                ColumnId = col2Id,
                Tags = new List<string> { "fixed", "testing" }
            };

            _taskRepositoryMock.Setup(r => r.GetById(taskId)).Returns(originalTask);
            _taskRepositoryMock.Setup(r => r.Update(It.IsAny<TaskCard>()));

            // Act
            _taskService.Update(taskId, updateDto);
            var updated = _taskService.GetById(taskId);

            // Assert
            Assert.NotNull(updated);
            Assert.Equal("Novo Título da Tarefa", updated.Title);
            Assert.Equal("Nova descrição", updated.Description);
            Assert.Equal("Maria", updated.AssignedTo);
            Assert.Equal(col2Id, updated.ColumnId);
            Assert.Equal(new List<string> { "fixed", "testing" }, updated.Tags);

            _taskRepositoryMock.Verify(r => r.Update(It.IsAny<TaskCard>()), Times.Once());
        }

        /// <summary>
        /// TC_TASK_005_SPEC: Atualizar Tarefa - Sem Alterar Coluna
        /// Validar que ColumnId permanece se não for informado
        /// </summary>
        [Fact]
        public void TC_TASK_005_UpdateTask_WithoutColumnId_KeepsOriginalColumn()
        {
            // Arrange
            var taskId = Guid.NewGuid();
            var columnId = Guid.NewGuid();
            var boardId = Guid.NewGuid();

            var originalTask = new TaskCard
            {
                Id = taskId,
                Title = "Título Original",
                ColumnId = columnId,
                BoardId = boardId,
                AssignedTo = "João",
                Tags = new List<string>()
            };

            var updateDto = new UpdateTaskDto
            {
                Title = "Novo Título",
                ColumnId = null, // Não altera a coluna
                Tags = new List<string>()
            };

            _taskRepositoryMock.Setup(r => r.GetById(taskId)).Returns(originalTask);
            _taskRepositoryMock.Setup(r => r.Update(It.IsAny<TaskCard>()));

            // Act
            _taskService.Update(taskId, updateDto);
            var updated = _taskService.GetById(taskId);

            // Assert
            Assert.NotNull(updated);
            Assert.Equal("Novo Título", updated.Title);
            Assert.Equal(columnId, updated.ColumnId); // ColumnId mantém-se

            _taskRepositoryMock.Verify(r => r.Update(It.IsAny<TaskCard>()), Times.Once());
        }

        /// <summary>
        /// TC_TASK_012_SPEC: Atualizar Tarefa Inexistente
        /// Validar Update com ID inválido
        /// </summary>
        [Fact]
        public void TC_TASK_012_UpdateTask_WithInvalidId_DoesNothing()
        {
            // Arrange
            var taskId = Guid.NewGuid();
            var invalidTaskId = Guid.NewGuid();

            var updateDto = new UpdateTaskDto
            {
                Title = "Novo Título",
                Tags = new List<string>()
            };

            _taskRepositoryMock.Setup(r => r.GetById(invalidTaskId)).Returns((TaskCard?)null);

            // Act
            _taskService.Update(invalidTaskId, updateDto);

            // Assert
            _taskRepositoryMock.Verify(r => r.Update(It.IsAny<TaskCard>()), Times.Never());
        }

        /// <summary>
        /// TC_TASK_004: Atualizar Tarefa - Verificação Adicional
        /// Validar que ID da tarefa permanece inalterado
        /// </summary>
        [Fact]
        public void TC_TASK_004_UpdateTask_MaintainsTaskId()
        {
            // Arrange
            var taskId = Guid.NewGuid();
            var boardId = Guid.NewGuid();
            var columnId = Guid.NewGuid();

            var originalTask = new TaskCard
            {
                Id = taskId,
                Title = "Original",
                ColumnId = columnId,
                BoardId = boardId,
                Tags = new List<string>()
            };

            var updateDto = new UpdateTaskDto
            {
                Title = "Atualizado",
                Tags = new List<string>()
            };

            _taskRepositoryMock.Setup(r => r.GetById(taskId)).Returns(originalTask);
            _taskRepositoryMock.Setup(r => r.Update(It.IsAny<TaskCard>()));

            // Act
            _taskService.Update(taskId, updateDto);

            // Assert
            _taskRepositoryMock.Verify(
                r => r.Update(It.Is<TaskCard>(t => t.Id == taskId)), 
                Times.Once()
            );
        }
    }
}
