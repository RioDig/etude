using System.Security.Claims;
using EtudeBackend.Features.Auth.Models;
using EtudeBackend.Features.Auth.Services;
using EtudeBackend.Features.TrainingRequests.DTOs;
using EtudeBackend.Features.TrainingRequests.Entities;
using EtudeBackend.Features.TrainingRequests.Repositories;
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
    private readonly EtudeAuthApiService _etudeAuthApiService;
    private readonly IStatusRepository _statusRepository;

    public ApplicationController(IApplicationService applicationService, IDistributedCache cache,
        ILogger<ApplicationController> logger, UserManager<ApplicationUser> userManager, IOrganizationService organizationService,
        EtudeAuthApiService etudeAuthApiService, IStatusRepository statusRepository)
    {
        _applicationService = applicationService;
        _cache = cache;
        _logger = logger;
        _userManager = userManager;
        _organizationService = organizationService;
        _etudeAuthApiService = etudeAuthApiService;
        _statusRepository = statusRepository;
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
[ProducesResponseType(StatusCodes.Status400BadRequest)]
[ProducesResponseType(StatusCodes.Status401Unauthorized)]
[ProducesResponseType(StatusCodes.Status500InternalServerError)]
public async Task<IActionResult> CreateApplication([FromBody] CreateApplicationRequestDto requestDto)
{
    // Проверка валидности модели запроса
    if (!ModelState.IsValid)
        return BadRequest(ModelState);
    
    // Получаем ID текущего пользователя
    var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (string.IsNullOrEmpty(userIdClaim))
        return Unauthorized(new { message = "Невозможно идентифицировать текущего пользователя" });

    try
    {
        // Проверяем, что все необходимые поля заполнены
        if (string.IsNullOrEmpty(requestDto.Name))
            return BadRequest(new { message = "Имя курса обязательно для заполнения" });
            
        if (requestDto.Approvers == null || requestDto.Approvers.Count == 0)
            return BadRequest(new { message = "Необходимо указать хотя бы одного согласующего" });
            
        if (string.IsNullOrEmpty(requestDto.LearnerId))
            return BadRequest(new { message = "Необходимо указать обучающегося" });

        // Валидация согласующих с использованием EtudeAuthApiService
        var invalidApprovers = await _etudeAuthApiService.ValidateEmployeeIdsAsync(requestDto.Approvers);
        
        if (invalidApprovers.Count > 0)
        {
            return BadRequest(new { 
                message = "Один или несколько указанных согласующих не найдены в системе", 
                missingApprovers = invalidApprovers 
            });
        }

        // Получаем статус "Confirmation" для новой заявки
        var confirmationStatus = await _statusRepository.GetByNameAsync("Confirmation");
        if (confirmationStatus == null)
        {
            _logger.LogError("Статус 'Confirmation' не найден в системе");
            return StatusCode(500, new { message = "Не удалось создать заявку: статус Confirmation не найден" });
        }

        // Проверяем обучающегося
        Guid learnerId;
        if (!Guid.TryParse(requestDto.LearnerId, out learnerId))
        {
            if (int.TryParse(requestDto.LearnerId, out var learnerIntId))
            {
                // Преобразуем int ID в GUID, если это необходимо
                learnerId = new Guid(learnerIntId, 0, 0, new byte[8]);
            }
            else
            {
                return BadRequest(new { message = "Некорректный формат идентификатора обучающегося" });
            }
        }

        // Создаем DTO для передачи в сервис
        var applicationDto = new CreateApplicationDto
        {
            Name = requestDto.Name,
            Description = requestDto.Description ?? string.Empty,
            Type = requestDto.Type ?? "Course", // Значение по умолчанию, если не указано
            Track = requestDto.Track ?? "HardSkills", // Значение по умолчанию, если не указано
            Format = requestDto.Format ?? "Online", // Значение по умолчанию, если не указано
            TrainingCenter = requestDto.TrainingCenter ?? string.Empty,
            StartDate = requestDto.StartDate,
            EndDate = requestDto.EndDate,
            Price = requestDto.Price ?? "0",
            EducationGoal = requestDto.EducationGoal ?? string.Empty,
            ApproverIds = ParseApproverIds(requestDto.Approvers),
            StatusId = confirmationStatus.Id,
            EmployeeId = learnerId
        };

        // Вызываем сервис для создания заявки
        var createdApplication = await _applicationService.CreateApplicationAsync(applicationDto, userIdClaim);
        
        _logger.LogInformation("Пользователь {UserId} успешно создал заявку на обучение {ApplicationId}", 
            userIdClaim, createdApplication.Id);
    
        // Возвращаем созданную заявку с кодом 201 Created
        return CreatedAtAction(
            nameof(GetApplicationById), 
            new { id = createdApplication.Id }, 
            MapToApplicationDetailResponseDto(createdApplication));
    }
    catch (ApiException ex)
    {
        _logger.LogError(ex, "Ошибка API при создании заявки: {Message}", ex.Message);
        return StatusCode(ex.StatusCode, new { message = ex.Message, errors = ex.Errors });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Неожиданная ошибка при создании заявки: {Message}", ex.Message);
        return StatusCode(500, new { message = "Произошла внутренняя ошибка сервера при создании заявки" });
    }
}
    

private ApplicationDetailResponseDto MapToApplicationDetailResponseDto(ApplicationDetailDto detail)
{
    return new ApplicationDetailResponseDto
    {
        ApplicationId = detail.Id,
        CreatedAt = detail.CreatedAt,
        Comment = string.Empty, // Комментарий получаем отдельно при необходимости
        Status = new ApplicationStatusDto
        {
            Name = detail.StatusName,
            Type = DetermineStatusType(detail.StatusName)
        },
        Author = detail.Author,
        Approvers = detail.Approvers ?? new List<UserBasicDto>(),
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
            Link = detail.Course.Link ?? string.Empty,
            Price = detail.Course.Price,
            EducationGoal = detail.Course.EducationGoal,
            Learner = detail.Course.Learner
        }
    };
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

    [HttpPatch("{id:guid}/changeStatus")]
[ProducesResponseType(StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status404NotFound)]
[ProducesResponseType(StatusCodes.Status400BadRequest)]
public async Task<IActionResult> ChangeApplicationStatus(Guid id, [FromBody] ChangeStatusDto statusDto)
{
    if (!ModelState.IsValid)
        return BadRequest(ModelState);

    try
    {
        var application = await _applicationService.GetApplicationByIdAsync(id);
        if (application == null)
            return NotFound(new { message = "Заявка не найдена" });

        // Получаем текущий статус
        var currentStatus = await _statusRepository.GetByIdAsync(application.StatusId);
        if (currentStatus == null)
            return StatusCode(500, new { message = "Текущий статус заявки не найден" });

        // Получаем новый статус
        var newStatus = await _statusRepository.GetByIdAsync(statusDto.StatusId);
        if (newStatus == null)
            return BadRequest(new { message = "Указанный статус не найден" });

        // Проверяем корректность перехода статусов
        bool validStatusTransition = await ValidateStatusTransitionAsync(currentStatus, newStatus, application);
        if (!validStatusTransition)
        {
            return BadRequest(new { message = $"Недопустимый переход статуса из '{currentStatus.Name}' в '{newStatus.Name}'" });
        }

        // Если меняем статус на "Approvement"
        if (newStatus.Type == "Approvement" || DetermineStatusType(newStatus.Type) == "Approvement")
        {
            try
            {
                // Создаем документ в EtudeAuth
                var docModel = new CreateDocumentModel
                {
                    EtudeDocID = application.Id.ToString(),
                    DocInfo = new DocumentInfo
                    {
                        Title = application.Course.Name,
                        Description = application.Course.Description,
                        Type = "TrainingRequest",
                        CreatedAt = DateTime.UtcNow,
                        AdditionalInfo = new Dictionary<string, string>
                        {
                            { "CourseType", application.Course.Type },
                            { "StartDate", application.Course.StartDate.ToString("yyyy-MM-dd") },
                            { "EndDate", application.Course.EndDate.ToString("yyyy-MM-dd") },
                            { "TrainingCenter", application.Course.TrainingCenter }
                        }
                    },
                    Coordinating = application.Approvers.ToDictionary(
                        a => a.Id, 
                        a => a.Id)
                };

                // Вызов сервиса EtudeAuth для создания документа
                var result = await _etudeAuthApiService.CreateDocumentAsync(docModel);
                
                if (!result.Success)
                {
                    return BadRequest(new { message = "Не удалось создать документ в системе согласования: " + result.Message });
                }
                
                // Если нужно сохранить DocumentId из EtudeAuth
                if (!string.IsNullOrEmpty(result.DocumentId))
                {
                    // Здесь можно было бы сохранить полученный DocumentId если это нужно
                    _logger.LogInformation("Документ создан в EtudeAuth с ID: {DocumentId}", result.DocumentId);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при создании документа в EtudeAuth");
                return StatusCode(500, new { message = "Ошибка при создании документа в системе согласования" });
            }
        }

        // Меняем статус заявки
        var updatedApplication = await _applicationService.ChangeApplicationStatusAsync(id, statusDto);
        if (updatedApplication == null)
            return NotFound(new { message = "Не удалось обновить статус заявки" });
                
        return Ok(updatedApplication);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Неожиданная ошибка при изменении статуса заявки {ApplicationId}", id);
        return StatusCode(500, new { message = "Произошла внутренняя ошибка сервера" });
    }
}

private async Task<bool> ValidateStatusTransitionAsync(Status currentStatusObj, Status newStatusObj, ApplicationDetailDto application)
{
    try
    {
        // Проверка корректности перехода статусов
        if (currentStatusObj.Type == "Confirmation" && newStatusObj.Type == "Approvement")
            return true; // Переход из Confirmation в Approvement разрешен
        
        if (currentStatusObj.Type == "Confirmation" && newStatusObj.Type == "Rejected")
            return true; // Переход из Confirmation в Rejected разрешен
        
        if (currentStatusObj.Type == "Processed")
        {
            // Переход из Processed в кастомный статус или Registered
            var newStatus = await _statusRepository.GetByNameAsync(newStatusObj.Name);
            if (newStatus == null)
                return false;
                
            // Если статус не защищен или это Registered
            return !newStatus.IsProtected || newStatusObj.Type == "Registered";
        }
        
        // Запрещаем переход из Approvement в другие статусы вручную
        // (переход из Approvement в Processed должен происходить автоматически)
        if (currentStatusObj.Type == "Approvement")
            return false;
            
        // По умолчанию запрещаем переход
        return false;
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Ошибка при проверке валидности перехода статуса из {CurrentStatus} в {NewStatus}", 
            currentStatusObj, newStatusObj.Name);
        return false;
    }
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
