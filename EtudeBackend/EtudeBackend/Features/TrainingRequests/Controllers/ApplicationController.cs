using System.Security.Claims;
using EtudeBackend.Features.Auth.Services;
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
    private readonly IOrganizationService _organizationService;

    public ApplicationController(IApplicationService applicationService, IDistributedCache cache, 
        ILogger<ApplicationController> logger, UserManager<ApplicationUser> userManager, IOrganizationService organizationService)
    {
        _applicationService = applicationService;
        _cache = cache;
        _logger = logger;
        _userManager = userManager;
        _organizationService = organizationService;
    }
    
    /// <summary>
    /// Получает список заявок с поддержкой фильтрации, сортировки и пагинации
    /// </summary>
    [HttpGet]
[ProducesResponseType(typeof(List<ApplicationResponseDto>), StatusCodes.Status200OK)]
public async Task<IActionResult> GetApplications(
    [FromQuery] List<ApplicationFilterDto>? filters = null)
{
    try 
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var isAdmin = User.FindFirstValue(ClaimTypes.Role) == "admin";
        
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { message = "Необходима аутентификация" });
        }
        
        // Преобразуем фильтры
        var filterDict = new Dictionary<string, string>();
        if (filters != null && filters.Count > 0)
        {
            foreach (var filter in filters)
            {
                ConvertFilter(filter, filterDict);
            }
        }
        
        if (!isAdmin)
        {
            filterDict["AuthorId"] = userId;
        }
        
        var applications = await _applicationService.GetApplicationsAsync(
            page: 1,
            perPage: 1000, // Большое значение, чтобы получить все
            sortBy: "CreatedAt",
            orderBy: "desc",
            filters: filterDict
        );
        
        var responseItems = new List<ApplicationResponseDto>();
        
        foreach (var app in applications.Items)
        {
            var details = await _applicationService.GetApplicationByIdAsync(app.Id);
            if (details != null)
            {
                responseItems.Add(MapToApplicationResponseDto(details));
            }
        }
        
        return Ok(responseItems);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Ошибка при получении заявок на обучение");
        return StatusCode(500, new { message = "Внутренняя ошибка сервера" });
    }
}

private void ConvertFilter(ApplicationFilterDto filter, Dictionary<string, string> filterDict)
{
    switch (filter.Name.ToLower())
    {
        case "status":
            filterDict["status"] = filter.Value;
            break;
        case "type":
            filterDict["type"] = filter.Value;
            break;
        case "format":
            filterDict["format"] = filter.Value;
            break;
        case "track":
            filterDict["track"] = filter.Value;
            break;
        case "learner":
            filterDict["employee"] = filter.Value;
            break;
    }
}

private ApplicationResponseDto MapToApplicationResponseDto(ApplicationDetailDto detail)
{
    return new ApplicationResponseDto
    {
        ApplicationId = detail.Id,
        CreatedAt = detail.CreatedAt,
        Status = new ApplicationStatusDto
        {
            Name = detail.StatusName,
            Type = DetermineStatusType(detail.StatusName)
        },
        Course = new ApplicationCourseDto
        {
            Id = detail.Course.Id,
            Name = detail.Course.Name,
            Description = detail.Course.Description,
            Type = detail.Course.Type,
            Track = detail.Course.Track,
            Format = detail.Course.Format,
            TrainingCenter = detail.Course.TrainingCenter,
            StartDate = detail.Course.StartDate,
            EndDate = detail.Course.EndDate,
            Link = detail.Course.Link,
            Price = detail.Course.Price,
            EducationGoal = detail.Course.EducationGoal,
            Learner = detail.Course.Learner
        }
    };
}

private string DetermineStatusType(string statusName)
{
    return statusName.ToLower() switch
    {
        "подтверждено" => "Confirmation",
        "отклонено" => "Rejected",
        "согласовано" => "Approvement",
        "обработано" => "Processed",
        "зарегистрировано" => "Registered",
        _ => "Processed"
    };
}
    
 /// <summary>
/// Получает детальную информацию о заявке по идентификатору
/// </summary>
[HttpGet("{id:guid}")]
[ProducesResponseType(typeof(ApplicationDetailResponseDto), StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status404NotFound)]
[ProducesResponseType(StatusCodes.Status401Unauthorized)]
public async Task<IActionResult> GetApplicationById(Guid id)
{
    try
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var isAdmin = User.FindFirstValue(ClaimTypes.Role) == "admin";
        
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { message = "Необходима аутентификация" });
        }
        
        var application = await _applicationService.GetApplicationByIdAsync(id);
            
        if (application == null)
            return NotFound(new { message = "Заявка не найдена" });
        
        if (!isAdmin && application.Author.Id != userId)
        {
            bool isApprover = application.Approvers.Any(a => a.Id == userId);
            
            if (!isApprover)
            {
                return StatusCode(StatusCodes.Status403Forbidden, 
                    new { message = "У вас нет доступа к этой заявке" });
            }
        }

        string comment = await _applicationService.GetLatestCommentAsync(id);

        var response = new ApplicationDetailResponseDto
        {
            ApplicationId = application.Id,
            CreatedAt = application.CreatedAt,
            Comment = comment,
            Status = new ApplicationStatusDto
            {
                Name = application.StatusName,
                Type = DetermineStatusType(application.StatusName)
            },
            Author = application.Author,
            Approvers = application.Approvers ?? new List<UserBasicDto>(),
            Course = new ApplicationCourseDto
            {
                Id = application.Course.Id,
                Name = application.Course.Name,
                Description = application.Course.Description,
                Type = application.Course.Type,
                Track = application.Course.Track,
                Format = application.Course.Format,
                TrainingCenter = application.Course.TrainingCenter,
                StartDate = application.Course.StartDate,
                EndDate = application.Course.EndDate,
                Link = application.Course.Link ?? string.Empty,
                Price = application.Course.Price,
                EducationGoal = application.Course.EducationGoal,
                Learner = application.Course.Learner
            }
        };
        
        return Ok(response);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Ошибка при получении заявки по ID: {Id}", id);
        return StatusCode(500, new { message = "Внутренняя ошибка сервера" });
    }
}
 
 
private List<int> ParseApproverIds(List<string> approverIds)
{
    var result = new List<int>();
    
    foreach (var id in approverIds)
    {
        if (int.TryParse(id, out var intId))
        {
            result.Add(intId);
            continue;
        }
        
        if (Guid.TryParse(id, out var guidId))
        {
            var bytes = guidId.ToByteArray();
            var intValue = BitConverter.ToInt32(bytes, 0);
            result.Add(Math.Abs(intValue));
        }
    }
    
    return result;
}

    /// <summary>
/// Создает новую заявку на обучение
    /// </summary>
[HttpPost]
[ProducesResponseType(StatusCodes.Status201Created)]
[ProducesErrorResponseType(typeof(ModelStateDictionary))]
public async Task<IActionResult> CreateApplication([FromBody] CreateApplicationRequestDto requestDto)
    {
    if (!ModelState.IsValid)
        return BadRequest(ModelState);
    
    var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (string.IsNullOrEmpty(userIdClaim))
        return Unauthorized(new { message = "Невозможно идентифицировать текущего пользователя" });

    try
    {
        var applicationDto = new CreateApplicationDto
        {
            Name = requestDto.Name,
            Description = requestDto.Description,
            Type = requestDto.Type,
            Track = requestDto.Track,
            Format = requestDto.Format,
            TrainingCenter = requestDto.TrainingCenter,
            StartDate = requestDto.StartDate,
            EndDate = requestDto.EndDate,
            Price = requestDto.Price,
            EducationGoal = requestDto.EducationGoal,
            ApproverIds = ParseApproverIds(requestDto.Approvers)
        };

        if (Guid.TryParse(requestDto.LearnerId, out var learnerId))
        {
            applicationDto.EmployeeId = learnerId;
        }
        else
        {
            if (int.TryParse(requestDto.LearnerId, out var learnerIntId))
            {
                applicationDto.EmployeeId = new Guid(learnerIntId, 0, 0, new byte[8]);
            }
            else
            {
                return BadRequest(new { message = "Некорректный формат идентификатора обучающегося" });
            }
        }

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
