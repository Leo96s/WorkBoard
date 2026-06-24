using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _service;

        /// <summary>
        /// Inicializa uma nova instância do TasksController com o serviço de tarefas
        /// </summary>
        /// <param name="service">Serviço de negócio para operações de tarefas</param>
        public TasksController(ITaskService service)
        {
            _service = service;
        }

        /// <summary>
        /// Obtém todas as tarefas existentes
        /// </summary>
        /// <returns>Lista de todas as tarefas</returns>
        [HttpGet]
        public IActionResult GetAll() => Ok(_service.GetAll());

        /// <summary>
        /// Obtém uma tarefa específica pelo seu ID
        /// </summary>
        /// <param name="id">ID da tarefa a recuperar</param>
        /// <returns>Tarefa com o ID especificado ou NotFound se não existir</returns>
        [HttpGet("{id}")]
        public IActionResult GetById(Guid id)
        {
            var task = _service.GetById(id);
            return task == null ? NotFound() : Ok(task);
        }

        /// <summary>
        /// Cria uma nova tarefa
        /// </summary>
        /// <param name="dto">Dados para criar a nova tarefa</param>
        /// <returns>Tarefa criada</returns>
        [HttpPost]
        public IActionResult Create(CreateTaskDto dto)
        {
            var task = _service.Create(dto);
            return Ok(task);
        }

        /// <summary>
        /// Atualiza os dados de uma tarefa existente
        /// </summary>
        /// <param name="id">ID da tarefa a atualizar</param>
        /// <param name="dto">Novos dados da tarefa</param>
        /// <returns>NoContent se atualizado com sucesso</returns>
        [HttpPut("{id}")]
        public IActionResult Update(Guid id, [FromBody] UpdateTaskDto dto)
        {
            _service.Update(id, dto);
            return NoContent();
        }

        /// <summary>
        /// Deleta uma tarefa
        /// </summary>
        /// <param name="id">ID da tarefa a deletar</param>
        /// <returns>NoContent se deletado com sucesso</returns>
        [HttpDelete("{id}")]
        public IActionResult Delete(Guid id)
        {
            _service.Delete(id);
            return NoContent();
        }

        /// <summary>
        /// Move uma tarefa para uma coluna diferente
        /// </summary>
        /// <param name="id">ID da tarefa a mover</param>
        /// <param name="dto">Dados com o ID da nova coluna</param>
        /// <returns>NoContent se movida com sucesso</returns>
        [HttpPatch("{id}/move")]
        public IActionResult Move(Guid id, [FromBody] MoveTaskDto dto)
        {
            _service.Move(id, dto.NewColumnId);
            return NoContent();
        }

        /// <summary>
        /// Filtra tarefas por board, coluna e/ou responsável
        /// </summary>
        /// <param name="boardId">ID do board (opcional)</param>
        /// <param name="columnId">ID da coluna (opcional)</param>
        /// <param name="assignedTo">Nome do responsável (opcional)</param>
        /// <returns>Lista de tarefas que correspondem aos filtros</returns>
        [HttpGet("filter")]
        public IActionResult Filter(
            [FromQuery] Guid? boardId,
            [FromQuery] Guid? columnId,
            [FromQuery] string? search)
        {
            return Ok(_service.Filter(boardId, columnId, search));
        }
    }

}
