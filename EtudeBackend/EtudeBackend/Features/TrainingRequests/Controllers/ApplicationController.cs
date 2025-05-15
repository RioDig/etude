using System.Security.Claims;
using EtudeBackend.Features.TrainingRequests.DTOs;
using EtudeBackend.Features.TrainingRequests.Services;
using EtudeBackend.Features.Users.Repositories;
using EtudeBackend.Shared.Data;
using EtudeBackend.Shared.Exceptions;
using EtudeBackend.Shared.Extensions;
using EtudeBackend.Shared.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Extensions.Caching.Distributed;

namespace EtudeBackend.Features.TrainingRequests.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ApplicationController : ControllerBase
{
    private readonly IApplicationService _applicationService;
    private readonly IDistributedCache _cache;
    private readonly ILogger<ApplicationController> _logger;
    private readonly UserManager<ApplicationUser> _userManager;

    public ApplicationController(IApplicationService applicationService, IDistributedCache cache, 
        ILogger<ApplicationController> logger, UserManager<ApplicationUser> userManager)
    {
        _applicationService = applicationService;
        _cache = cache;
        _logger = logger;
        _userManager = userManager;
    }
    
    /// <summary>
    /// Получает список заявок с поддержкой фильтрации, сортировки и пагинации
    /// </summary>
    [HttpGet]
    [ProducesResponseType<PagedResult<ApplicationDto>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetApplications(
        [FromQuery] int page = 1,
        [FromQuery] int perPage = 10,
        [FromQuery] string? sort = null,
        [FromQuery] string? order = null,
        [FromQuery] Dictionary<string, string>? filters = null)
    {
        var applications = await _applicationService.GetApplicationsAsync(page, perPage, sort, order, filters);
        await _cache.SetValue("test", applications, 60, HttpContext.RequestAborted, _logger);
        await _cache.GetValue<PagedResult<ApplicationDto>>("test", HttpContext.RequestAborted, _logger);
        // _logger.LogError("test2");
        return Ok(applications);
    }
    
    /// <summary>
    /// Получает детальную информацию о заявке по идентификатору
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType<PagedResult<ApplicationDto>>(StatusCodes.Status200OK)]
    [ProducesErrorResponseType(typeof(object))]
    public async Task<IActionResult> GetApplicationById(Guid id)
    {
        var application = await _applicationService.GetApplicationByIdAsync(id);
            
        if (application == null)
            return NotFound();
            
        return Ok(application);
    }
    
    /// <summary>
    /// Создает новую заявку на обучение
    /// </summary>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesErrorResponseType(typeof(ModelStateDictionary))]
    public async Task<IActionResult> CreateApplication([FromBody] CreateApplicationDto applicationDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdClaim))
            return Unauthorized(new { message = "Невозможно идентифицировать текущего пользователя" });

        try
        {
            var createdApplication = await _applicationService.CreateApplicationAsync(applicationDto, userIdClaim);
        
            return CreatedAtAction(
                nameof(GetApplicationById), 
                new { id = createdApplication.Id }, 
                createdApplication);
        }
        catch (ApiException ex)
        {
            return StatusCode(ex.StatusCode, new { message = ex.Message });
        }
    }
    
    /// <summary>
    /// Обновляет существующую заявку
    /// </summary>
    [HttpPatch("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateApplication(Guid id, [FromBody] UpdateApplicationDto applicationDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var updatedApplication = await _applicationService.UpdateApplicationAsync(id, applicationDto);
            
        if (updatedApplication == null)
            return NotFound();
            
        return Ok(updatedApplication);
    }
    
    /// <summary>
    /// Изменяет статус заявки
    /// </summary>
    [HttpPatch("{id:guid}/changeStatus")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ChangeApplicationStatus(Guid id, [FromBody] ChangeStatusDto statusDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var updatedApplication = await _applicationService.ChangeApplicationStatusAsync(id, statusDto);
            
        if (updatedApplication == null)
            return NotFound();
            
        return Ok(updatedApplication);
    }
    
    /// <summary>
    /// Удаляет заявку
    /// </summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteApplication(Guid id)
    {
        var result = await _applicationService.DeleteApplicationAsync(id);
            
        if (!result)
            return NotFound();
            
        return NoContent();
    }
}