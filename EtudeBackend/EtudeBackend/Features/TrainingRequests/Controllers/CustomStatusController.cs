using EtudeBackend.Features.TrainingRequests.DTOs;
using EtudeBackend.Features.TrainingRequests.Services;
using Microsoft.AspNetCore.Mvc;

namespace EtudeBackend.Features.TrainingRequests.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomStatusController : ControllerBase
{
    private readonly ICustomStatusService _statusService;

    public CustomStatusController(ICustomStatusService statusService)
    {
        _statusService = statusService;
    }
    
    /// <summary>
    /// Получает список всех кастомных статусов
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllStatuses()
    {
        var statuses = await _statusService.GetAllStatusesAsync();
        return Ok(statuses);
    }
    
    /// <summary>
    /// Получает кастомный статус по идентификатору
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetStatusById(Guid id)
    {
        var status = await _statusService.GetStatusByIdAsync(id);
            
        if (status == null)
            return NotFound();
            
        return Ok(status);
    }
    
    /// <summary>
    /// Создает новый кастомный статус
    /// </summary>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateStatus([FromBody] CreateStatusDto statusDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var createdStatus = await _statusService.CreateStatusAsync(statusDto);
            
        return CreatedAtAction(
            nameof(GetStatusById), 
            new { id = createdStatus.Id }, 
            createdStatus);
    }
    
    /// <summary>
    /// Обновляет существующий кастомный статус
    /// </summary>
    [HttpPatch("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateStatusDto statusDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var updatedStatus = await _statusService.UpdateStatusAsync(id, statusDto);
            
        if (updatedStatus == null)
            return NotFound();
            
        return Ok(updatedStatus);
    }
    
    /// <summary>
    /// Удаляет кастомный статус
    /// </summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> DeleteStatus(Guid id)
    {
        var result = await _statusService.DeleteStatusAsync(id);
            
        if (!result)
            return NotFound();
            
        return NoContent();
    }
}