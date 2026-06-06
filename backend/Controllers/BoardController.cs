using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/boards")]
    public class BoardsController : ControllerBase
    {
        private readonly IBoardService _service;

        /// <summary>
        /// Inicializa uma nova instância do BoardsController com o serviço de boards
        /// </summary>
        /// <param name="service">Serviço de negócio para operações de boards</param>
        public BoardsController(BoardService service)
        {
            _service = service;
        }

        /// <summary>
        /// Obtém todos os boards existentes
        /// </summary>
        /// <returns>Lista de todos os boards com suas colunas</returns>
        [HttpGet]
        public IActionResult GetAll()
            => Ok(_service.GetAll());

        /// <summary>
        /// Obtém um board específico pelo seu ID
        /// </summary>
        /// <param name="id">ID do board a recuperar</param>
        /// <returns>Board com o ID especificado ou NotFound se não existir</returns>
        [HttpGet("{id}")]
        public IActionResult GetById(Guid id)
        {
            var board = _service.GetById(id);
            return board == null ? NotFound() : Ok(board);
        }

        /// <summary>
        /// Cria um novo board com colunas padrão
        /// </summary>
        /// <param name="dto">Dados para criar o novo board</param>
        /// <returns>Board criado com status 201</returns>
        [HttpPost]
        public IActionResult Create([FromBody] CreateBoardDto dto)
        {
            var board = _service.Create(dto);
            return CreatedAtAction(nameof(GetById), new { id = board.Id }, board);

        }

        /// <summary>
        /// Deleta um board e todas as suas tarefas e colunas associadas
        /// </summary>
        /// <param name="id">ID do board a deletar</param>
        /// <returns>NoContent se deletado com sucesso, BadRequest se for o único board</returns>
        [HttpDelete("{id}")]
        public IActionResult Delete(Guid id)
        {
            var deleted = _service.Delete(id);
            if (!deleted)
                return BadRequest(new { message = "Não é possível apagar o único board existente." });
            return NoContent();
        }

        /// <summary>
        /// Adiciona uma nova coluna a um board existente
        /// </summary>
        /// <param name="boardId">ID do board onde adicionar a coluna</param>
        /// <param name="dto">Dados da nova coluna</param>
        /// <returns>Coluna criada</returns>
        [HttpPost("{boardId}/columns")]
        public IActionResult AddColumn(Guid boardId, [FromBody] CreateBoardColumnDto dto)
        {
            var column = _service.AddColumn(boardId, dto);
            return Ok(column);
        }

        /// <summary>
        /// Atualiza os dados de uma coluna existente
        /// </summary>
        /// <param name="boardId">ID do board proprietário da coluna</param>
        /// <param name="columnId">ID da coluna a atualizar</param>
        /// <param name="dto">Novos dados da coluna</param>
        /// <returns>Coluna atualizada ou NotFound se não existir</returns>
        [HttpPut("{boardId}/columns/{columnId}")]
        public IActionResult UpdateColumn(Guid boardId, Guid columnId, [FromBody] UpdateColumnDto dto)
        {
            var column = _service.UpdateColumn(boardId, columnId, dto);
            return column == null ? NotFound() : Ok(column);
        }

        /// <summary>
        /// Deleta uma coluna e todas as tarefas associadas
        /// </summary>
        /// <param name="boardId">ID do board proprietário da coluna</param>
        /// <param name="columnId">ID da coluna a deletar</param>
        /// <returns>NoContent se deletado com sucesso, NotFound se não encontrado</returns>
        [HttpDelete("{boardId}/columns/{columnId}")]
        public IActionResult DeleteColumn(Guid boardId, Guid columnId)
        {
            var ok = _service.DeleteColumn(boardId, columnId);
            return ok ? NoContent() : NotFound();
        }
    }
}