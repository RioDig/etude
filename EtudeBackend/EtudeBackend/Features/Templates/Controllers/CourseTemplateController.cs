using EtudeBackend.Features.Templates.DTOs;
using EtudeBackend.Features.Templates.Services;
using Microsoft.AspNetCore.Mvc;

namespace EtudeBackend.Features.Templates.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CourseTemplateController : ControllerBase
{
    private readonly ICourseTemplateService _templateService;

    public CourseTemplateController(ICourseTemplateService templateService)
    {
        _templateService = templateService;
    }
    
    /// <summary>
    /// Получает список всех шаблонов курсов
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllTemplates()
    {
        var templates = await _templateService.GetAllTemplatesAsync();
        return Ok(templates);
    }
    
    /// <summary>
    /// Получает шаблон курса по идентификатору
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
    /// Создает новый шаблон курса
    /// </summary>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateTemplate([FromBody] CreateCourseTemplateDto templateDto)
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
    /// Обновляет существующий шаблон курса
    /// </summary>
    [HttpPatch("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateTemplate(Guid id, [FromBody] UpdateCourseTemplateDto templateDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var updatedTemplate = await _templateService.UpdateTemplateAsync(id, templateDto);
            
        if (updatedTemplate == null)
            return NotFound();
            
        return Ok(updatedTemplate);
    }
    
    /// <summary>
    /// Удаляет шаблон курса
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