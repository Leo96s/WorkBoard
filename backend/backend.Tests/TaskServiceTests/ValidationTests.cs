using backend.DTOs;
using backend.Models;
using backend.Repositories;
using backend.Services;
using Moq;
using Xunit;

namespace backend.Tests.TaskServiceTests
{
    /// <summary>
    /// Valida que TaskService rejeita relações inconsistentes entre tarefas, boards e colunas
    /// </summary>
    public class ValidationTests
    {
        private readonly Mock<ITaskRepository> _taskRepositoryMock;
        private readonly Mock<IBoardRepository> _boardRepositoryMock;
        private readonly Mock<IBoardColumnRepository> _columnRepositoryMock;
        private readonly TaskService _taskService;

        public ValidationTests()
        {
            _taskRepositoryMock = new Mock<ITaskRepository>();
            _boardRepositoryMock = new Mock<IBoardRepository>();
            _columnRepositoryMock = new Mock<IBoardColumnRepository>();
            _taskService = new TaskService(_taskRepositoryMock.Object, _boardRepositoryMock.Object, _columnRepositoryMock.Object);
        }

        [Fact]
        public void Create_WithNonExistentBoard_ReturnsInvalidBoard()
        {
            var boardId = Guid.NewGuid();
            var columnId = Guid.NewGuid();
            var dto = new CreateTaskDto { Title = "Tarefa", BoardId = boardId, ColumnId = columnId, Tags = new List<string>() };

            _boardRepositoryMock.Setup(r => r.GetById(boardId)).Returns((Board?)null);

            var (task, result) = _taskService.Create(dto);

            Assert.Null(task);
            Assert.Equal(TaskOperationResult.InvalidBoard, result);
            _taskRepositoryMock.Verify(r => r.Add(It.IsAny<TaskCard>()), Times.Never());
        }

        [Fact]
        public void Create_WithNonExistentColumn_ReturnsInvalidColumn()
        {
            var boardId = Guid.NewGuid();
            var columnId = Guid.NewGuid();
            var dto = new CreateTaskDto { Title = "Tarefa", BoardId = boardId, ColumnId = columnId, Tags = new List<string>() };

            _boardRepositoryMock.Setup(r => r.GetById(boardId)).Returns(new Board { Id = boardId });
            _columnRepositoryMock.Setup(r => r.GetById(columnId)).Returns((BoardColumn?)null);

            var (task, result) = _taskService.Create(dto);

            Assert.Null(task);
            Assert.Equal(TaskOperationResult.InvalidColumn, result);
            _taskRepositoryMock.Verify(r => r.Add(It.IsAny<TaskCard>()), Times.Never());
        }

        [Fact]
        public void Create_WithColumnFromDifferentBoard_ReturnsInvalidColumn()
        {
            var boardId = Guid.NewGuid();
            var otherBoardId = Guid.NewGuid();
            var columnId = Guid.NewGuid();
            var dto = new CreateTaskDto { Title = "Tarefa", BoardId = boardId, ColumnId = columnId, Tags = new List<string>() };

            _boardRepositoryMock.Setup(r => r.GetById(boardId)).Returns(new Board { Id = boardId });
            _columnRepositoryMock.Setup(r => r.GetById(columnId)).Returns(new BoardColumn { Id = columnId, BoardId = otherBoardId });

            var (task, result) = _taskService.Create(dto);

            Assert.Null(task);
            Assert.Equal(TaskOperationResult.InvalidColumn, result);
            _taskRepositoryMock.Verify(r => r.Add(It.IsAny<TaskCard>()), Times.Never());
        }

        [Fact]
        public void Update_WithColumnFromDifferentBoard_ReturnsInvalidColumn()
        {
            var taskId = Guid.NewGuid();
            var boardId = Guid.NewGuid();
            var otherBoardId = Guid.NewGuid();
            var columnId = Guid.NewGuid();

            var task = new TaskCard { Id = taskId, BoardId = boardId, ColumnId = Guid.NewGuid(), Tags = new List<string>() };
            var dto = new UpdateTaskDto { Title = "Novo", ColumnId = columnId, Tags = new List<string>() };

            _taskRepositoryMock.Setup(r => r.GetById(taskId)).Returns(task);
            _columnRepositoryMock.Setup(r => r.GetById(columnId)).Returns(new BoardColumn { Id = columnId, BoardId = otherBoardId });

            var result = _taskService.Update(taskId, dto);

            Assert.Equal(TaskOperationResult.InvalidColumn, result);
            _taskRepositoryMock.Verify(r => r.Update(It.IsAny<TaskCard>()), Times.Never());
        }

        [Fact]
        public void Move_ToColumnFromDifferentBoard_ReturnsInvalidColumn()
        {
            var taskId = Guid.NewGuid();
            var boardId = Guid.NewGuid();
            var otherBoardId = Guid.NewGuid();
            var newColumnId = Guid.NewGuid();

            var task = new TaskCard { Id = taskId, BoardId = boardId, ColumnId = Guid.NewGuid(), Tags = new List<string>() };

            _taskRepositoryMock.Setup(r => r.GetById(taskId)).Returns(task);
            _columnRepositoryMock.Setup(r => r.GetById(newColumnId)).Returns(new BoardColumn { Id = newColumnId, BoardId = otherBoardId });

            var result = _taskService.Move(taskId, newColumnId);

            Assert.Equal(TaskOperationResult.InvalidColumn, result);
            _taskRepositoryMock.Verify(r => r.Update(It.IsAny<TaskCard>()), Times.Never());
        }

        [Fact]
        public void Move_ToNonExistentColumn_ReturnsInvalidColumn()
        {
            var taskId = Guid.NewGuid();
            var boardId = Guid.NewGuid();
            var newColumnId = Guid.NewGuid();

            var task = new TaskCard { Id = taskId, BoardId = boardId, ColumnId = Guid.NewGuid(), Tags = new List<string>() };

            _taskRepositoryMock.Setup(r => r.GetById(taskId)).Returns(task);
            _columnRepositoryMock.Setup(r => r.GetById(newColumnId)).Returns((BoardColumn?)null);

            var result = _taskService.Move(taskId, newColumnId);

            Assert.Equal(TaskOperationResult.InvalidColumn, result);
        }
    }
}
