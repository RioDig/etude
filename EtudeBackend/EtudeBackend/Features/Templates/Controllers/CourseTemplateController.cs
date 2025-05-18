using EtudeBackend.Features.Templates.DTOs;
using EtudeBackend.Features.Templates.Services;
using EtudeBackend.Features.TrainingRequests.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EtudeBackend.Features.Templates.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CourseTemplateController : ControllerBase
{
    private readonly ICourseTemplateService _templateService;
    private readonly ILogger<CourseTemplateController> _logger;

    public CourseTemplateController(
        ICourseTemplateService templateService,
        ILogger<CourseTemplateController> logger)
    {
        _templateService = templateService;
        _logger = logger;
    }

    /// <summary>
    /// Получает список всех шаблонов курсов с возможностью фильтрации
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllTemplates([FromQuery][JsonFilters] List<FilterItem>? filter = null)
    {
        try
        {
            List<CourseTemplateFilterDto>? templateFilters = null;

            if (filter != null && filter.Count > 0)
            {
                templateFilters = new List<CourseTemplateFilterDto>();

                foreach (var fltr in filter)
                {
                    switch (fltr.Name.ToLower())
                    {
                        case "name":
                            templateFilters.Add(new CourseTemplateFilterDto { Name = "name", Value = fltr.Value });
                            break;
                        case "type":
                            templateFilters.Add(new CourseTemplateFilterDto { Name = "type", Value = fltr.Value });
                            break;
                        case "format":
                            templateFilters.Add(new CourseTemplateFilterDto { Name = "format", Value = fltr.Value });
                            break;
                        case "track":
                            templateFilters.Add(new CourseTemplateFilterDto { Name = "track", Value = fltr.Value });
                            break;
                        case "trainingcenter":
                            templateFilters.Add(new CourseTemplateFilterDto { Name = "trainingcenter", Value = fltr.Value });
                            break;
                        case "startdate":
                            templateFilters.Add(new CourseTemplateFilterDto { Name = "startdate", Value = fltr.Value });
                            break;
                        case "enddate":
                            templateFilters.Add(new CourseTemplateFilterDto { Name = "enddate", Value = fltr.Value });
                            break;
                        default:
                            _logger.LogWarning("Неизвестный фильтр: {FilterName}", fltr.Name);
                            break;
                    }
                }
            }

            if (templateFilters != null && templateFilters.Count > 0)
            {
                var templates = await _templateService.GetTemplatesByFiltersAsync(templateFilters);
                return Ok(templates);
            }
            else
            {
                var templates = await _templateService.GetAllTemplatesAsync();
                return Ok(templates);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при получении списка шаблонов курсов");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { message = "Произошла внутренняя ошибка сервера" });
        }
    }

    /// <summary>
    /// Получает шаблон курса по идентификатору
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetTemplateById(Guid id)
    {
        try
        {
            var template = await _templateService.GetTemplateByIdAsync(id);

            if (template == null)
                return NotFound();

            return Ok(template);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при получении шаблона курса с ID: {Id}", id);
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { message = "Произошла внутренняя ошибка сервера" });
        }
    }

    /// <summary>
    /// Создает новый шаблон курса
    /// </summary>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateTemplate([FromBody] CreateCourseTemplateDto templateDto)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var createdTemplate = await _templateService.CreateTemplateAsync(templateDto);

            return CreatedAtAction(
                nameof(GetTemplateById),
                new { id = createdTemplate.Id },
                createdTemplate);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при создании шаблона курса");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { message = "Произошла внутренняя ошибка сервера" });
        }
    }

    /// <summary>
    /// Обновляет существующий шаблон курса
    /// </summary>
    [HttpPatch]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateTemplate([FromBody] UpdateCourseTemplateDto templateDto)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updatedTemplate = await _templateService.UpdateTemplateAsync(templateDto);

            if (updatedTemplate == null)
                return NotFound();

            return Ok(updatedTemplate);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при обновлении шаблона курса с ID: {Id}", templateDto.Id);
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { message = "Произошла внутренняя ошибка сервера" });
        }
    }

    /// <summary>
    /// Удаляет шаблон курса
    /// </summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteTemplate(Guid id)
    {
        try
        {
            var result = await _templateService.DeleteTemplateAsync(id);

            if (!result)
                return NotFound();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при удалении шаблона курса с ID: {Id}", id);
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { message = "Произошла внутренняя ошибка сервера" });
        }
    }
}