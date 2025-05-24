using System.Security.Claims;
using System.Text;
using System.Text.Json;
using AutoMapper;
using EtudeBackend.Features.Auth.Models;
using EtudeBackend.Features.Auth.Services;
using EtudeBackend.Features.TrainingRequests.DTOs;
using EtudeBackend.Features.TrainingRequests.Entities;
using EtudeBackend.Features.TrainingRequests.Models;
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
using Microsoft.EntityFrameworkCore;
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
    private readonly IMapper _mapper;
    private readonly IApplicationRepository _applicationRepository;
    private readonly ICourseRepository _courseRepository;
    private readonly ICalendarService _calendarService;

    public ApplicationController(IApplicationService applicationService, IDistributedCache cache,
        ILogger<ApplicationController> logger, UserManager<ApplicationUser> userManager, IOrganizationService organizationService,
        EtudeAuthApiService etudeAuthApiService, IStatusRepository statusRepository, IMapper mapper,
        IApplicationRepository applicationRepository, ICourseRepository courseRepository,
        ICalendarService calendarService)
    {
        _applicationService = applicationService;
        _cache = cache;
        _logger = logger;
        _userManager = userManager;
        _organizationService = organizationService;
        _etudeAuthApiService = etudeAuthApiService;
        _statusRepository = statusRepository;
        _mapper = mapper;
        _applicationRepository = applicationRepository;
        _courseRepository = courseRepository;
        _calendarService = calendarService;
    }

    /// <summary>
    /// Получает список заявок с поддержкой фильтрации, сортировки и пагинации
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(List<ApplicationResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetApplications([FromQuery][JsonFilters] List<FilterItem>? filter = null)
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
            if (filter != null && filter.Count > 0)
            {
                foreach (var fltr in filter)
                {
                    ConvertFilter(fltr, filterDict);
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
                try
                {
                    // Для каждой заявки используем общий метод для получения детальной информации
                    var detailedResponse = await GetDetailedApplicationResponse(app.Id);

                    // Преобразуем формат для списка заявок
                    responseItems.Add(new ApplicationResponseDto
                    {
                        ApplicationId = detailedResponse.ApplicationId,
                        CreatedAt = detailedResponse.CreatedAt,
                        Status = detailedResponse.Status,
                        Course = detailedResponse.Course
                    });
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Ошибка при обработке заявки {ApplicationId}", app.Id);
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

    private void ConvertFilter(FilterItem filter, Dictionary<string, string> filterDict)
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
            case "employee":
                filterDict["employee"] = filter.Value;
                break;
            case "coursename":
                filterDict["coursename"] = filter.Value;
                break;
            case "datefrom":
                filterDict["datefrom"] = filter.Value;
                break;
            case "dateto":
                filterDict["dateto"] = filter.Value;
                break;
            case "author":
                filterDict["author"] = filter.Value;
                break;
        }
    }

    private IQueryable<Application> ApplyFilters(IQueryable<Application> query, Dictionary<string, string> filters)
    {
        foreach (var filter in filters)
        {
            switch (filter.Key.ToLower())
            {
                case "status":
                    // Фильтруем только по полю type статуса
                    query = query.Where(a => a.Status.Type == filter.Value);
                    break;
                case "author":
                case "authorid":
                    query = query.Where(a => a.AuthorId == filter.Value);
                    break;
                case "type":
                    // Проверяем тип курса
                    if (Enum.TryParse<CourseType>(filter.Value, true, out var courseType))
                    {
                        query = query.Where(a => a.Course.Type == courseType);
                    }
                    else
                    {
                        // Если не удалось распарсить как enum, пробуем искать по строковому значению
                        query = query.Where(a => a.Course.Type.ToString().Contains(filter.Value));
                    }
                    break;
                case "track":
                    // Проверяем направление курса
                    if (Enum.TryParse<CourseTrack>(filter.Value, true, out var courseTrack))
                    {
                        query = query.Where(a => a.Course.Track == courseTrack);
                    }
                    else
                    {
                        query = query.Where(a => a.Course.Track.ToString().Contains(filter.Value));
                    }
                    break;
                case "format":
                    // Проверяем формат курса
                    if (Enum.TryParse<CourseFormat>(filter.Value, true, out var courseFormat))
                    {
                        query = query.Where(a => a.Course.Format == courseFormat);
                    }
                    else
                    {
                        query = query.Where(a => a.Course.Format.ToString().Contains(filter.Value));
                    }
                    break;
                case "employee":
                case "learner":
                    // Если это поиск по сотруднику, проверяем EmployeeId в курсе
                    Guid employeeId;
                    if (Guid.TryParse(filter.Value, out employeeId))
                    {
                        query = query.Where(a => a.Course.EmployeeId == employeeId);
                    }
                    break;
                case "coursename":
                    query = query.Where(a => a.Course.Name.Contains(filter.Value));
                    break;
                case "datefrom":
                    if (DateTimeOffset.TryParse(filter.Value, out var dateFrom))
                        query = query.Where(a => a.CreatedAt >= dateFrom);
                    break;
                case "dateto":
                    if (DateTimeOffset.TryParse(filter.Value, out var dateTo))
                        query = query.Where(a => a.CreatedAt <= dateTo);
                    break;
            }
        }

        return query;
    }

    private IQueryable<Application> ApplySorting(IQueryable<Application> query, string? sortBy, string? orderBy)
    {
        if (string.IsNullOrEmpty(sortBy))
            return query.OrderByDescending(a => a.CreatedAt);

        bool isAscending = string.IsNullOrEmpty(orderBy) || orderBy.ToLower() != "desc";

        switch (sortBy.ToLower())
        {
            case "createdat":
                return isAscending
                    ? query.OrderBy(a => a.CreatedAt)
                    : query.OrderByDescending(a => a.CreatedAt);
            case "status":
                return isAscending
                    ? query.OrderBy(a => a.Status.Name)
                    : query.OrderByDescending(a => a.Status.Name);
            case "author":
                return isAscending
                    ? query.OrderBy(a => a.Author.Surname).ThenBy(a => a.Author.Name)
                    : query.OrderByDescending(a => a.Author.Surname).ThenByDescending(a => a.Author.Name);
            case "course":
                return isAscending
                    ? query.OrderBy(a => a.Course.Name)
                    : query.OrderByDescending(a => a.Course.Name);
            default:
                return query.OrderByDescending(a => a.CreatedAt);
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
                Name = detail.Status.Name,
                Type = detail.Status.Type
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
                Link = detail.Course.Link ?? string.Empty,
                Price = detail.Course.Price,
                EducationGoal = detail.Course.EducationGoal,
                Learner = detail.Course.Learner ?? new UserBasicDto()
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

            // Используем общий метод для получения детальной информации о заявке
            var detailedResponse = await GetDetailedApplicationResponse(id);
            return Ok(detailedResponse);
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

            // Валидация согласующих через EtudeAuth
            var validApprovers = new List<string>();
            var invalidApprovers = new List<string>();

            foreach (var approverId in requestDto.Approvers)
            {
                // Проверяем существование согласующего через EtudeAuth API
                var approver = await _organizationService.GetEmployeeByUserIdAsync(approverId);

                if (approver != null)
                {
                    _logger.LogInformation("Согласующий с ID {ApproverId} найден в EtudeAuth", approverId);
                    validApprovers.Add(approverId);
                }
                else
                {
                    _logger.LogWarning("Согласующий с ID {ApproverId} не найден в EtudeAuth", approverId);
                    invalidApprovers.Add(approverId);
                }
            }

            if (invalidApprovers.Count > 0)
            {
                return BadRequest(new
                {
                    message = "Следующие согласующие не найдены в системе EtudeAuth:",
                    missingApprovers = invalidApprovers
                });
            }

            // Получаем статус "Confirmation" для новой заявки
            var confirmationStatus = await _statusRepository.GetByTypeAsync("Confirmation");
            if (confirmationStatus == null)
            {
                _logger.LogError("Статус 'Confirmation' не найден в системе");
                return StatusCode(500, new { message = "Не удалось создать заявку: статус Confirmation не найден" });
            }

            // Проверяем обучающегося только в локальной БД
            var learnerUser = await _userManager.FindByIdAsync(requestDto.LearnerId);
            if (learnerUser == null)
            {
                _logger.LogWarning("Обучающийся с ID {LearnerId} не найден в локальной БД", requestDto.LearnerId);
                return BadRequest(new { message = $"Обучающийся с ID '{requestDto.LearnerId}' не найден в системе" });
            }

            // Создаем DTO для передачи в сервис, с правильными ID согласующих и обучающегося
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
                Link = requestDto.Link ?? string.Empty,
                Price = requestDto.Price ?? "0",
                EducationGoal = requestDto.EducationGoal ?? string.Empty,
                AuthorId = userIdClaim, // Используем ID текущего пользователя как автора
                ApproverIds = validApprovers, // Используем проверенный список согласующих из EtudeAuth
                StatusId = confirmationStatus.Id,
                LearnerId = requestDto.LearnerId // Сохраняем ID обучающегося из локальной БД
            };

            // Вызываем сервис для создания заявки
            var createdApplication = await _applicationService.CreateApplicationAsync(applicationDto, userIdClaim);

            _logger.LogInformation("Пользователь {UserId} успешно создал заявку на обучение {ApplicationId}",
                userIdClaim, createdApplication.Id);

            // Получаем расширенную информацию о заявке для ответа
            var detailedResponse = await GetDetailedApplicationResponse(createdApplication.Id);

            // Возвращаем созданную заявку с кодом 201 Created
            return CreatedAtAction(
                nameof(GetApplicationById),
                new { id = createdApplication.Id },
                detailedResponse);
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

    // Вспомогательный метод для получения детальной информации о заявке с правильным заполнением департаментов
    private async Task<ApplicationDetailResponseDto> GetDetailedApplicationResponse(Guid applicationId)
    {
        var application = await _applicationService.GetApplicationByIdAsync(applicationId);
        if (application == null)
        {
            throw new ApiException($"Не удалось найти созданную заявку с ID {applicationId}", 500);
        }

        // Получаем статус для получения его типа
        var status = await _statusRepository.GetByIdAsync(application.Status.Id);
        string statusType = status?.Type ?? "Processed";

        // Получаем курс
        var course = await _courseRepository.GetByIdAsync(application.Course.Id);

        // Получаем обучающегося из локальной БД
        UserBasicDto learner = new UserBasicDto();

        if (course != null && course.EmployeeId != Guid.Empty)
        {
            // Получаем обучающегося из базы данных
            var learnerUser = await _userManager.FindByIdAsync(course.EmployeeId.ToString());

            if (learnerUser != null)
            {
                learner = new UserBasicDto
                {
                    Id = learnerUser.Id,
                    Name = learnerUser.Name,
                    Surname = learnerUser.Surname,
                    Patronymic = learnerUser.Patronymic,
                    Position = learnerUser.Position,
                    Department = string.Empty,
                    IsLeader = false
                };

                // Обогащаем данными о департаменте при наличии email
                if (!string.IsNullOrEmpty(learnerUser.OrgEmail))
                {
                    var orgEmployee = await _organizationService.GetEmployeeByEmailAsync(learnerUser.OrgEmail);
                    if (orgEmployee != null)
                    {
                        learner.Department = orgEmployee.Department;
                        learner.IsLeader = orgEmployee.IsLeader;
                    }
                }
            }
        }

        // Получаем последний комментарий
        string comment = await _applicationService.GetLatestCommentAsync(applicationId);

        // Получаем полную информацию о заявке
        var detailedApplication = await _applicationRepository.GetByIdAsync(applicationId);

        // Получаем и заполняем список согласующих
        List<UserBasicDto> approvers = new List<UserBasicDto>();

        if (detailedApplication != null && detailedApplication.Approvers.Count > 0)
        {
            try
            {
                // Десериализуем список ID согласующих
                var approverIds = detailedApplication.Approvers;

                if (approverIds.Count > 0)
                {
                    foreach (var approverId in approverIds)
                    {
                        // Проверяем сначала в локальной БД
                        var approverUser = await _userManager.FindByIdAsync(approverId);

                        if (approverUser != null)
                        {
                            var approver = new UserBasicDto
                            {
                                Id = approverUser.Id,
                                Name = approverUser.Name,
                                Surname = approverUser.Surname,
                                Patronymic = approverUser.Patronymic,
                                Position = approverUser.Position,
                                Department = string.Empty,
                                IsLeader = false
                            };

                            // Обогащаем данными из EtudeAuth
                            var extendedApprover = await _organizationService.GetEmployeeByUserIdAsync(approverId);
                            if (extendedApprover != null)
                            {
                                approver.Department = extendedApprover.Department;
                                approver.IsLeader = extendedApprover.IsLeader;
                            }

                            approvers.Add(approver);
                        }
                        else
                        {
                            // Если не найден в локальной БД, попробуем получить данные через EtudeAuth
                            var extendedApprover = await _organizationService.GetEmployeeByUserIdAsync(approverId);
                            if (extendedApprover != null)
                            {
                                approvers.Add(new UserBasicDto
                                {
                                    Id = extendedApprover.Id,
                                    Name = extendedApprover.Name,
                                    Surname = extendedApprover.Surname,
                                    Patronymic = extendedApprover.Patronymic,
                                    Position = extendedApprover.Position,
                                    Department = extendedApprover.Department,
                                    IsLeader = extendedApprover.IsLeader
                                });
                            }
                            else
                            {
                                // Если согласующий не найден нигде, добавляем только его ID
                                approvers.Add(new UserBasicDto
                                {
                                    Id = approverId,
                                    Name = "Неизвестный пользователь",
                                    Surname = "",
                                    Position = "",
                                    Department = "",
                                    IsLeader = false
                                });
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при десериализации списка согласующих: {ApproversJson}", detailedApplication.Approvers);
            }
        }

        return new ApplicationDetailResponseDto
        {
            ApplicationId = application.Id,
            CreatedAt = application.CreatedAt,
            AttachmentLink = detailedApplication?.AttachmentLink ?? string.Empty,
            Comment = comment,
            Status = new ApplicationStatusDto
            {
                Name = application.StatusName,
                Type = statusType
            },
            Author = application.Author,
            Approvers = approvers, // Заполняем список согласующих
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
                Learner = learner
            }
        };
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

    [HttpPatch("changeStatus")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ChangeApplicationStatus([FromBody] ChangeStatusDto statusDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var application = await _applicationService.GetApplicationByIdAsync(statusDto.Id);
            if (application == null)
                return NotFound(new { message = "Заявка не найдена" });

            // Получаем текущий статус
            var currentStatus = await _statusRepository.GetByIdAsync(application.Status.Id);
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
                    // var result = await _etudeAuthApiService.CreateDocumentAsync(docModel);

                    // if (!result.Success)
                    // {
                    //     return BadRequest(new { message = "Не удалось создать документ в системе согласования: " + result.Message });
                    // }
                    //
                    // // Если нужно сохранить DocumentId из EtudeAuth
                    // if (!string.IsNullOrEmpty(result.DocumentId))
                    // {
                    //     // Здесь можно было бы сохранить полученный DocumentId если это нужно
                    //     _logger.LogInformation("Документ создан в EtudeAuth с ID: {DocumentId}", result.DocumentId);
                    // }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Ошибка при создании документа в EtudeAuth");
                    return StatusCode(500, new { message = "Ошибка при создании документа в системе согласования" });
                }
            }

            // Меняем статус заявки
            var updatedApplication = await _applicationService.ChangeApplicationStatusAsync(statusDto.Id, statusDto);
            if (updatedApplication == null)
                return NotFound(new { message = "Не удалось обновить статус заявки" });

            return Ok(updatedApplication);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Неожиданная ошибка при изменении статуса заявки {ApplicationId}", statusDto.Id);
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
    
    
    /// <summary>
    /// Генерирует ICS файл для заявок в указанном диапазоне дат
    /// </summary>
    [HttpPost("downloadICS")]
    [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> DownloadICS([FromBody] DownloadIcsRequestDto request)
    {
        try
        {
            if (request.StartDate > request.EndDate)
            {
                return BadRequest(new { message = "Дата начала не может быть позже даты окончания" });
            }

            var icsContent = await _calendarService.GenerateIcsCalendarAsync(request.StartDate, request.EndDate);
            
            return new FileContentResult(Encoding.UTF8.GetBytes(icsContent), "text/calendar")
            {
                FileDownloadName = $"training_events_{request.StartDate:yyyyMMdd}_to_{request.EndDate:yyyyMMdd}.ics"
            };
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Заявки не найдены для диапазона дат: {StartDate} - {EndDate}", 
                request.StartDate, request.EndDate);
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при генерации ICS файла");
            return StatusCode(500, new { message = "Внутренняя ошибка сервера" });
        }
    }
    
    /// <summary>
    /// Добавляет или обновляет вложение для заявки
    /// </summary>
    [HttpPost("addAttachments")]
[ProducesResponseType(StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status403Forbidden)]
[ProducesResponseType(StatusCodes.Status404NotFound)]
[ProducesResponseType(StatusCodes.Status400BadRequest)]
public async Task<IActionResult> AddAttachment([FromBody] AddAttachmentRequestDto request)
{
    try
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { message = "Необходима аутентификация" });
        }

        var application = await _applicationRepository
            .GetAllQuery()
            .Include(a => a.Course) // Загружаем курс
            .Include(a => a.Status) // Загружаем статус
            .FirstOrDefaultAsync(a => a.Id == request.Id);

        if (application == null)
        {
            return NotFound(new { message = "Заявка не найдена" });
        }

        if (application.Status.Type != "Registered")
        {
            return StatusCode(StatusCodes.Status403Forbidden, 
                new { message = "Добавление вложений разрешено только для заявок со статусом 'Registered'" });
        }

        if (application.Course.EmployeeId.ToString() != userId)
        {
            return StatusCode(StatusCodes.Status403Forbidden, 
                new { message = "Добавление вложений разрешено только для обучающегося по этой заявке" });
        }
        
        application.AttachmentLink = request.Link;
        application.UpdatedAt = DateTimeOffset.UtcNow;

        await _applicationRepository.UpdateAsync(application);

        return Ok(new { message = "Вложение успешно добавлено/обновлено" });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Ошибка при добавлении вложения для заявки {ApplicationId}", request.Id);
        return StatusCode(500, new { message = "Внутренняя ошибка сервера" });
    }
}
    
}
