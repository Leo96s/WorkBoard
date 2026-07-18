using backend.DTOs;
using backend.Models;
using backend.Repositories;
using backend.Services;
using Moq;
using Xunit;

namespace backend.Tests.TaskServiceTests
{
    public class CreateTests
    {
        private readonly Mock<ITaskRepository> _taskRepositoryMock;
        private readonly Mock<IBoardRepository> _boardRepositoryMock;
        private readonly Mock<IBoardColumnRepository> _columnRepositoryMock;
        private readonly TaskService _taskService;

        public CreateTests()
        {
            _taskRepositoryMock = new Mock<ITaskRepository>();
            _boardRepositoryMock = new Mock<IBoardRepository>();
            _columnRepositoryMock = new Mock<IBoardColumnRepository>();
            _taskService = new TaskService(_taskRepositoryMock.Object, _boardRepositoryMock.Object, _columnRepositoryMock.Object);
        }

        /// <summary>
        /// Configura board e coluna válidos e pertencentes um ao outro, para os testes de "caminho feliz"
        /// </summary>
        private void SetupValidBoardAndColumn(Guid boardId, Guid columnId)
        {
            _boardRepositoryMock.Setup(r => r.GetById(boardId)).Returns(new Board { Id = boardId });
            _columnRepositoryMock.Setup(r => r.GetById(columnId)).Returns(new BoardColumn { Id = columnId, BoardId = boardId });
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
            SetupValidBoardAndColumn(boardId, columnId);

            // Act
            var (result, opResult) = _taskService.Create(dto);

            // Assert
            Assert.Equal(TaskOperationResult.Success, opResult);
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
            SetupValidBoardAndColumn(boardId, columnId);

            // Act
            var (result, opResult) = _taskService.Create(dto);

            // Assert
            Assert.Equal(TaskOperationResult.Success, opResult);
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
            SetupValidBoardAndColumn(boardId, columnId);

            // Act
            var (result, opResult) = _taskService.Create(dto);

            // Assert
            Assert.Equal(TaskOperationResult.Success, opResult);
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
            SetupValidBoardAndColumn(boardId, columnId);

            // Act
            var (result, opResult) = _taskService.Create(dto);

            // Assert
            Assert.Equal(TaskOperationResult.Success, opResult);
            Assert.NotNull(result);
            _taskRepositoryMock.Verify(r => r.Add(It.IsAny<Models.TaskCard>()), Times.Once());
            Assert.NotNull(capturedTask);
            Assert.Equal(result.Id, capturedTask.Id);
        }
    }
}
