using backend.DTOs;
using backend.Repositories;
using backend.Services;
using Moq;
using Xunit;

namespace backend.Tests.TaskServiceTests
{
    public class CreateTests
    {
        private readonly Mock<ITaskRepository> _taskRepositoryMock;
        private readonly TaskService _taskService;

        public CreateTests()
        {
            _taskRepositoryMock = new Mock<ITaskRepository>();
            _taskService = new TaskService(_taskRepositoryMock.Object);
        }

        /// <summary>
        /// TC_TASK_001_SPEC: Criar Tarefa com Dados Válidos
        /// Validar criação bem-sucedida de tarefa com dados completos
        /// </summary>
        [Fact]
        public void TC_TASK_001_CreateTask_WithValidData_ReturnsTaskCardWithAllData()
        {
            // Arrange
            var taskId = Guid.NewGuid();
            var boardId = Guid.NewGuid();
            var columnId = Guid.NewGuid();
            var tags = new List<string> { "feature", "auth" };

            var dto = new CreateTaskDto
            {
                Title = "Implementar Login",
                Description = "Adicionar autenticação OAuth",
                AssignedTo = "João",
                ColumnId = columnId,
                BoardId = boardId,
                Tags = tags
            };

            _taskRepositoryMock.Setup(r => r.Add(It.IsAny<Models.TaskCard>())).Callback<Models.TaskCard>(t => t.Id = taskId);

            // Act
            var result = _taskService.Create(dto);

            // Assert
            Assert.NotNull(result);
            Assert.NotEqual(Guid.Empty, result.Id);
            Assert.Equal("Implementar Login", result.Title);
            Assert.Equal("Adicionar autenticação OAuth", result.Description);
            Assert.Equal("João", result.AssignedTo);
            Assert.Equal(columnId, result.ColumnId);
            Assert.Equal(boardId, result.BoardId);
            Assert.Contains("feature", result.Tags);
            Assert.Contains("auth", result.Tags);

            _taskRepositoryMock.Verify(r => r.Add(It.IsAny<Models.TaskCard>()), Times.Once());
        }

        /// <summary>
        /// TC_TASK_002: Criar Tarefa com Título Vazio
        /// Validar criação de tarefa com título vazio
        /// </summary>
        [Fact]
        public void TC_TASK_002_CreateTask_WithEmptyTitle_ReturnsTaskCard()
        {
            // Arrange
            var taskId = Guid.NewGuid();
            var boardId = Guid.NewGuid();
            var columnId = Guid.NewGuid();

            var dto = new CreateTaskDto
            {
                Title = "",
                ColumnId = columnId,
                BoardId = boardId,
                Tags = new List<string>()
            };

            _taskRepositoryMock.Setup(r => r.Add(It.IsAny<Models.TaskCard>())).Callback<Models.TaskCard>(t => t.Id = taskId);

            // Act
            var result = _taskService.Create(dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("", result.Title);
        }

        /// <summary>
        /// TC_TASK_003: Criar Tarefa com Múltiplos Tags
        /// Validar criação com lista de tags
        /// </summary>
        [Fact]
        public void TC_TASK_003_CreateTask_WithMultipleTags_ReturnsTaskWithAllTags()
        {
            // Arrange
            var taskId = Guid.NewGuid();
            var boardId = Guid.NewGuid();
            var columnId = Guid.NewGuid();
            var tags = new List<string> { "bug", "urgent", "feature", "documentation" };

            var dto = new CreateTaskDto
            {
                Title = "Corrigir Bug",
                ColumnId = columnId,
                BoardId = boardId,
                Tags = tags
            };

            _taskRepositoryMock.Setup(r => r.Add(It.IsAny<Models.TaskCard>())).Callback<Models.TaskCard>(t => t.Id = taskId);

            // Act
            var result = _taskService.Create(dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(4, result.Tags.Count);
            Assert.Contains("bug", result.Tags);
            Assert.Contains("urgent", result.Tags);
            Assert.Contains("feature", result.Tags);
            Assert.Contains("documentation", result.Tags);
        }

        /// <summary>
        /// TC_TASK_001: Criar Tarefa - Verificação Adicional
        /// Validar que tarefa é adicionada ao repositório
        /// </summary>
        [Fact]
        public void TC_TASK_001_CreateTask_VerifiesAddToRepository()
        {
            // Arrange
            var taskId = Guid.NewGuid();
            var boardId = Guid.NewGuid();
            var columnId = Guid.NewGuid();

            var dto = new CreateTaskDto
            {
                Title = "Tarefa Teste",
                ColumnId = columnId,
                BoardId = boardId,
                Tags = new List<string>()
            };

            Models.TaskCard? capturedTask = null;
            _taskRepositoryMock.Setup(r => r.Add(It.IsAny<Models.TaskCard>()))
                .Callback<Models.TaskCard>(t => 
                {
                    t.Id = taskId;
                    capturedTask = t;
                });

            // Act
            var result = _taskService.Create(dto);

            // Assert
            _taskRepositoryMock.Verify(r => r.Add(It.IsAny<Models.TaskCard>()), Times.Once());
            Assert.NotNull(capturedTask);
            Assert.Equal(result.Id, capturedTask.Id);
        }
    }
}
