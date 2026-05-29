using backend.DTOs;
using backend.Enum;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly TaskService _service;

        public TasksController(TaskService service)
        {
            _service = service;
        }

        [HttpGet]
        public IActionResult GetAll() => Ok(_service.GetAll());

        [HttpGet("{id}")]
        public IActionResult GetById(Guid id)
        {
            var task = _service.GetById(id);
            return task == null ? NotFound() : Ok(task);
        }

        [HttpPost]
        public IActionResult Create(CreateTaskDto dto)
        {
            var task = _service.Create(dto);
            return Ok(task);
        }

        [HttpPut("{id}")]
        public IActionResult Update(Guid id, [FromBody] UpdateTaskDto dto)
        {
            _service.Update(id, dto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(Guid id)
        {
            _service.Delete(id);
            return NoContent();
        }

        [HttpPatch("{id}/move")]
        public IActionResult Move(Guid id, [FromBody] MoveTaskDto dto)
        {
            _service.Move(id, dto.NewColumnId);
            return NoContent();
        }

        // GET /api/tasks/filter?boardId=...&columnId=...&assignedTo=...
        [HttpGet("filter")]
        public IActionResult Filter(
            [FromQuery] Guid? boardId,
            [FromQuery] Guid? columnId,
            [FromQuery] string? assignedTo)
        {
            return Ok(_service.Filter(boardId, columnId, assignedTo));
        }
    }

}
