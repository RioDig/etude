using EtudeBackend.Features.Templates.DTOs;
using EtudeBackend.Features.Templates.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EtudeBackend.Features.Templates.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReportTemplateController : ControllerBase
{
    private readonly IReportTemplateService _templateService;

    public ReportTemplateController(IReportTemplateService templateService)
    {
        _templateService = templateService;
    }
    
    /// <summary>
    /// Получает список всех шаблонов отчетов
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllTemplates()
    {
        var templates = await _templateService.GetAllTemplatesAsync();
        return Ok(templates);
    }
    
    /// <summary>
    /// Получает шаблон отчета по идентификатору
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetTemplateById(Guid id)
    {
        var template = await _templateService.GetTemplateByIdAsync(id);
            
        if (template == null)
            return NotFound();
            
        return Ok(template);
    }
    
    /// <summary>
    /// Создает новый шаблон отчета
    /// </summary>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateTemplate([FromBody] CreateReportTemplateDto templateDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var createdTemplate = await _templateService.CreateTemplateAsync(templateDto);
            
        return CreatedAtAction(
            nameof(GetTemplateById), 
            new { id = createdTemplate.Id }, 
            createdTemplate);
    }
    
    /// <summary>
    /// Обновляет существующий шаблон отчета
    /// </summary>
    [HttpPatch("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateTemplate(Guid id, [FromBody] UpdateReportTemplateDto templateDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var updatedTemplate = await _templateService.UpdateTemplateAsync(id, templateDto);
            
        if (updatedTemplate == null)
            return NotFound();
            
        return Ok(updatedTemplate);
    }
    
    /// <summary>
    /// Удаляет шаблон отчета
    /// </summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteTemplate(Guid id)
    {
        var result = await _templateService.DeleteTemplateAsync(id);
            
        if (!result)
            return NotFound();
            
        return NoContent();
    }
}