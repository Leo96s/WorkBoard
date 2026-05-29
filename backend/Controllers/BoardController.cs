using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/boards")]
    public class BoardsController : ControllerBase
    {
        private readonly BoardService _service;

        public BoardsController(BoardService service)
        {
            _service = service;
        }

        [HttpGet]
        public IActionResult GetAll()
            => Ok(_service.GetAll());

        [HttpGet("{id}")]
        public IActionResult GetById(Guid id)
        {
            var board = _service.GetById(id);
            return board == null ? NotFound() : Ok(board);
        }

        [HttpPost]
        public IActionResult Create([FromBody] CreateBoardDto dto)
        {
            var board = _service.Create(dto);
            return CreatedAtAction(nameof(GetById), new { id = board.Id }, board);

        }

        [HttpDelete("{id}")]
        public IActionResult Delete(Guid id)
        {
            _service.Delete(id);
            return NoContent();
        }

        [HttpPost("{boardId}/columns")]
        public IActionResult AddColumn(Guid boardId, [FromBody] CreateBoardColumnDto dto)
        {
            var column = _service.AddColumn(boardId, dto);
            return Ok(column);
        }

        [HttpPut("{boardId}/columns/{columnId}")]
        public IActionResult UpdateColumn(Guid boardId, Guid columnId, [FromBody] UpdateColumnDto dto)
        {
            var column = _service.UpdateColumn(boardId, columnId, dto);
            return column == null ? NotFound() : Ok(column);
        }

        [HttpDelete("{boardId}/columns/{columnId}")]
        public IActionResult DeleteColumn(Guid boardId, Guid columnId)
        {
            var ok = _service.DeleteColumn(boardId, columnId);
            return ok ? NoContent() : NotFound();
        }
    }
}