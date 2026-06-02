using backend.Models;
using backend.Repositories;
using backend.Services;
using Moq;
using Xunit;

namespace backend.Tests.TaskServiceTests
{
    public class FilterTests
    {
        private readonly Mock<ITaskRepository> _taskRepositoryMock;
        private readonly TaskService _taskService;

        public FilterTests()
        {
            _taskRepositoryMock = new Mock<ITaskRepository>();
            _taskService = new TaskService(_taskRepositoryMock.Object);
        }

        /// <summary>
        /// TC_TASK_008_SPEC: Filtrar por Board
        /// Validar filtro por boardId
        /// </summary>
        [Fact]
        public void TC_TASK_008_Filter_ByBoardId_ReturnsOnlyTasksFromBoard()
        {
            // Arrange
            var board1Id = Guid.NewGuid();
            var board2Id = Guid.NewGuid();
            var col1Id = Guid.NewGuid();
            var col2Id = Guid.NewGuid();

            var tasks = new List<TaskCard>
            {
                new TaskCard { Id = Guid.NewGuid(), Title = "Task 1", BoardId = board1Id, ColumnId = col1Id, Tags = new List<string>() },
                new TaskCard { Id = Guid.NewGuid(), Title = "Task 2", BoardId = board1Id, ColumnId = col2Id, Tags = new List<string>() },
                new TaskCard { Id = Guid.NewGuid(), Title = "Task 3", BoardId = board1Id, ColumnId = col1Id, Tags = new List<string>() },
                new TaskCard { Id = Guid.NewGuid(), Title = "Task 4", BoardId = board1Id, ColumnId = col2Id, Tags = new List<string>() },
                new TaskCard { Id = Guid.NewGuid(), Title = "Task 5", BoardId = board1Id, ColumnId = col1Id, Tags = new List<string>() },
                new TaskCard { Id = Guid.NewGuid(), Title = "Task 6", BoardId = board2Id, ColumnId = col1Id, Tags = new List<string>() },
                new TaskCard { Id = Guid.NewGuid(), Title = "Task 7", BoardId = board2Id, ColumnId = col2Id, Tags = new List<string>() },
                new TaskCard { Id = Guid.NewGuid(), Title = "Task 8", BoardId = board2Id, ColumnId = col1Id, Tags = new List<string>() },
                new TaskCard { Id = Guid.NewGuid(), Title = "Task 9", BoardId = board2Id, ColumnId = col2Id, Tags = new List<string>() },
                new TaskCard { Id = Guid.NewGuid(), Title = "Task 10", BoardId = board2Id, ColumnId = col1Id, Tags = new List<string>() }
            };

            _taskRepositoryMock.Setup(r => r.Filter(board1Id, null, null))
                .Returns(tasks.Where(t => t.BoardId == board1Id).ToList());

            // Act
            var result = _taskService.Filter(board1Id, null, null);

            // Assert
            Assert.Equal(5, result.Count());
            Assert.All(result, t => Assert.Equal(board1Id, t.BoardId));
            _taskRepositoryMock.Verify(r => r.Filter(board1Id, null, null), Times.Once());
        }

        /// <summary>
        /// TC_TASK_009_SPEC: Filtrar por Coluna
        /// Validar filtro por columnId
        /// </summary>
        [Fact]
        public void TC_TASK_009_Filter_ByColumnId_ReturnsOnlyTasksFromColumn()
        {
            // Arrange
            var boardId = Guid.NewGuid();
            var col1Id = Guid.NewGuid();
            var col2Id = Guid.NewGuid();
            var col3Id = Guid.NewGuid();

            var tasks = new List<TaskCard>
            {
                new TaskCard { Id = Guid.NewGuid(), Title = "Task 1", BoardId = boardId, ColumnId = col1Id, Tags = new List<string>() },
                new TaskCard { Id = Guid.NewGuid(), Title = "Task 2", BoardId = boardId, ColumnId = col1Id, Tags = new List<string>() },
                new TaskCard { Id = Guid.NewGuid(), Title = "Task 3", BoardId = boardId, ColumnId = col1Id, Tags = new List<string>() },
                new TaskCard { Id = Guid.NewGuid(), Title = "Task 4", BoardId = boardId, ColumnId = col2Id, Tags = new List<string>() },
                new TaskCard { Id = Guid.NewGuid(), Title = "Task 5", BoardId = boardId, ColumnId = col2Id, Tags = new List<string>() },
                new TaskCard { Id = Guid.NewGuid(), Title = "Task 6", BoardId = boardId, ColumnId = col3Id, Tags = new List<string>() }
            };

            _taskRepositoryMock.Setup(r => r.Filter(null, col1Id, null))
                .Returns(tasks.Where(t => t.ColumnId == col1Id).ToList());

            // Act
            var result = _taskService.Filter(null, col1Id, null);

            // Assert
            Assert.Equal(3, result.Count());
            Assert.All(result, t => Assert.Equal(col1Id, t.ColumnId));
        }

        /// <summary>
        /// TC_TASK_010_SPEC: Filtrar por Responsável
        /// Validar filtro por assignedTo
        /// </summary>
        [Fact]
        public void TC_TASK_010_Filter_ByAssignedTo_ReturnsOnlyTasksAssignedToUser()
        {
            // Arrange
            var boardId = Guid.NewGuid();
            var columnId = Guid.NewGuid();

            var tasks = new List<TaskCard>
            {
                new TaskCard { Id = Guid.NewGuid(), Title = "Task 1", BoardId = boardId, ColumnId = columnId, AssignedTo = "João", Tags = new List<string>() },
                new TaskCard { Id = Guid.NewGuid(), Title = "Task 2", BoardId = boardId, ColumnId = columnId, AssignedTo = "João", Tags = new List<string>() },
                new TaskCard { Id = Guid.NewGuid(), Title = "Task 3", BoardId = boardId, ColumnId = columnId, AssignedTo = "Maria", Tags = new List<string>() },
                new TaskCard { Id = Guid.NewGuid(), Title = "Task 4", BoardId = boardId, ColumnId = columnId, AssignedTo = "Pedro", Tags = new List<string>() },
                new TaskCard { Id = Guid.NewGuid(), Title = "Task 5", BoardId = boardId, ColumnId = columnId, AssignedTo = "João", Tags = new List<string>() }
            };

            _taskRepositoryMock.Setup(r => r.Filter(null, null, "João"))
                .Returns(tasks.Where(t => t.AssignedTo == "João").ToList());

            // Act
            var result = _taskService.Filter(null, null, "João");

            // Assert
            Assert.Equal(3, result.Count());
            Assert.All(result, t => Assert.Equal("João", t.AssignedTo));
        }

        /// <summary>
        /// TC_TASK_011_SPEC: Filtrar com Múltiplos Critérios
        /// Validar combinação de filtros (AND)
        /// </summary>
        [Fact]
        public void TC_TASK_011_Filter_WithMultipleCriteria_ReturnsTasksMatchingAllCriteria()
        {
            // Arrange
            var board1Id = Guid.NewGuid();
            var col1Id = Guid.NewGuid();
            var col2Id = Guid.NewGuid();
            var col3Id = Guid.NewGuid();

            var tasks = new List<TaskCard>
            {
                // Col1 - João
                new TaskCard { Id = Guid.NewGuid(), Title = "Task 1", BoardId = board1Id, ColumnId = col1Id, AssignedTo = "João", Tags = new List<string>() },
                new TaskCard { Id = Guid.NewGuid(), Title = "Task 2", BoardId = board1Id, ColumnId = col1Id, AssignedTo = "Maria", Tags = new List<string>() },
                new TaskCard { Id = Guid.NewGuid(), Title = "Task 3", BoardId = board1Id, ColumnId = col1Id, AssignedTo = "Pedro", Tags = new List<string>() },

                // Col2 - João, Maria, João
                new TaskCard { Id = Guid.NewGuid(), Title = "Task 4", BoardId = board1Id, ColumnId = col2Id, AssignedTo = "João", Tags = new List<string>() },
                new TaskCard { Id = Guid.NewGuid(), Title = "Task 5", BoardId = board1Id, ColumnId = col2Id, AssignedTo = "Maria", Tags = new List<string>() },
                new TaskCard { Id = Guid.NewGuid(), Title = "Task 6", BoardId = board1Id, ColumnId = col2Id, AssignedTo = "João", Tags = new List<string>() },

                // Col3 - Pedro
                new TaskCard { Id = Guid.NewGuid(), Title = "Task 7", BoardId = board1Id, ColumnId = col3Id, AssignedTo = "Pedro", Tags = new List<string>() }
            };

            _taskRepositoryMock.Setup(r => r.Filter(board1Id, col2Id, "João"))
                .Returns(tasks.Where(t => t.BoardId == board1Id && t.ColumnId == col2Id && t.AssignedTo == "João").ToList());

            // Act
            var result = _taskService.Filter(board1Id, col2Id, "João");

            // Assert
            Assert.Equal(2, result.Count());
            Assert.All(result, t =>
            {
                Assert.Equal(board1Id, t.BoardId);
                Assert.Equal(col2Id, t.ColumnId);
                Assert.Equal("João", t.AssignedTo);
            });
        }

        /// <summary>
        /// TC_TASK_011: Filtrar com Múltiplos Critérios - Verificação Adicional
        /// Validar que filtro retorna vazio quando nenhum task corresponde
        /// </summary>
        [Fact]
        public void TC_TASK_011_Filter_WithMultipleCriteria_ReturnsEmptyWhenNoMatch()
        {
            // Arrange
            var board1Id = Guid.NewGuid();
            var col1Id = Guid.NewGuid();
            var nonExistentColumnId = Guid.NewGuid();

            _taskRepositoryMock.Setup(r => r.Filter(board1Id, nonExistentColumnId, "NonExistent"))
                .Returns(new List<TaskCard>());

            // Act
            var result = _taskService.Filter(board1Id, nonExistentColumnId, "NonExistent");

            // Assert
            Assert.Empty(result);
        }

        /// <summary>
        /// TC_TASK_008: Filtrar por Board - Verificação Adicional
        /// Validar que apenas o board filtrado é retornado
        /// </summary>
        [Fact]
        public void TC_TASK_008_Filter_ByBoardId_ExcludesOtherBoards()
        {
            // Arrange
            var board1Id = Guid.NewGuid();
            var board2Id = Guid.NewGuid();

            var tasks = new List<TaskCard>
            {
                new TaskCard { Id = Guid.NewGuid(), Title = "B1-T1", BoardId = board1Id, ColumnId = Guid.NewGuid(), Tags = new List<string>() },
                new TaskCard { Id = Guid.NewGuid(), Title = "B2-T1", BoardId = board2Id, ColumnId = Guid.NewGuid(), Tags = new List<string>() }
            };

            _taskRepositoryMock.Setup(r => r.Filter(board1Id, null, null))
                .Returns(tasks.Where(t => t.BoardId == board1Id).ToList());

            // Act
            var result = _taskService.Filter(board1Id, null, null);

            // Assert
            Assert.Single(result);
            Assert.Equal(board1Id, result.First().BoardId);
        }
    }
}
