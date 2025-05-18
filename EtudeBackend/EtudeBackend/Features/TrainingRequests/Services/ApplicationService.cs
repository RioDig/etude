using AutoMapper;
using EtudeBackend.Features.TrainingRequests.DTOs;
using EtudeBackend.Features.TrainingRequests.Entities;
using EtudeBackend.Features.TrainingRequests.Repositories;
using EtudeBackend.Features.Users.Repositories;
using EtudeBackend.Shared.Exceptions;
using EtudeBackend.Shared.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using System.Text.Json;
using System.Transactions;
using EtudeBackend.Shared.Data;
using Microsoft.AspNetCore.Identity;

namespace EtudeBackend.Features.TrainingRequests.Services;

public class ApplicationService : IApplicationService
{
    private readonly IApplicationRepository _applicationRepository;
    private readonly ICourseRepository _courseRepository;
    private readonly IStatusRepository _statusRepository;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IMapper _mapper;
    private readonly ILogger<ApplicationService> _logger;

    public ApplicationService(
        IApplicationRepository applicationRepository,
        ICourseRepository courseRepository,
        IStatusRepository statusRepository,
        UserManager<ApplicationUser> userManager,
        IMapper mapper,
        ILogger<ApplicationService> logger)
    {
        _applicationRepository = applicationRepository;
        _courseRepository = courseRepository;
        _statusRepository = statusRepository;
        _userManager = userManager;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<PagedResult<ApplicationDto>> GetApplicationsAsync(
        int page = 1,
        int perPage = 10,
        string? sortBy = null,
        string? orderBy = null,
        Dictionary<string, string>? filters = null)
    {
        if (page < 1) page = 1;
        if (perPage < 1) perPage = 10;
        if (perPage > 100) perPage = 100;

        // Начинаем с базового запроса
        IQueryable<Application> query = _applicationRepository.GetAllQuery()
            .Include(a => a.Status)
            .Include(a => a.Course);

        if (filters != null && filters.Count > 0)
        {
            query = ApplyFilters(query, filters);
        }

        var totalCount = await query.CountAsync();

        query = ApplySorting(query, sortBy, orderBy);

        var items = await query
            .Skip((page - 1) * perPage)
            .Take(perPage)
            .ToListAsync();

        var applicationDtos = _mapper.Map<List<ApplicationDto>>(items);

        return new PagedResult<ApplicationDto>(applicationDtos, totalCount, page, perPage);
    }

    public async Task<ApplicationDetailDto?> GetApplicationByIdAsync(Guid id)
    {
        var application = await _applicationRepository.GetApplicationWithDetailsAsync(id);
        if (application == null)
            return null;

        return _mapper.Map<ApplicationDetailDto>(application);
    }

    public async Task<ApplicationDetailDto> CreateApplicationAsync(CreateApplicationDto applicationDto, string userId)
    {
        using var transaction = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled);
        
        try 
        {
            // Получаем данные обучающегося
            var learner = await _userManager.FindByIdAsync(applicationDto.LearnerId);
            if (learner == null)
            {
                throw new ApiException($"Обучающийся с ID {applicationDto.LearnerId} не найден в системе", 400);
            }
            
            _logger.LogInformation("Найден обучающийся: {LearnerId} - {Name} {Surname}", 
                learner.Id, learner.Name, learner.Surname);
            
            var course = new Course
            {
                Id = Guid.NewGuid(),
                Name = applicationDto.Name,
                Description = applicationDto.Description,
                Type = ParseEnum<CourseType>(applicationDto.Type),
                Track = ParseEnum<CourseTrack>(applicationDto.Track),
                Format = ParseEnum<CourseFormat>(applicationDto.Format),
                TrainingCenter = applicationDto.TrainingCenter,
                EmployeeId = Guid.Parse(applicationDto.LearnerId), // Преобразуем строку ID в Guid
                StartDate = applicationDto.StartDate,
                EndDate = applicationDto.EndDate,
                Link = applicationDto.Link,
                Price = applicationDto.Price,
                EducationGoal = applicationDto.EducationGoal,
                IsActive = true,
                CreatedAt = DateTimeOffset.UtcNow, 
                Learner = learner
            };
            
            _logger.LogInformation("Создаем курс для обучающегося {LearnerId}, EmployeeId: {EmployeeId}", 
                applicationDto.LearnerId, course.EmployeeId);
            
            await _courseRepository.AddAsync(course);
            
            // Получаем статус по умолчанию, если не указан другой
            Guid statusId = applicationDto.StatusId;
            if (statusId == Guid.Empty)
            {
                var confirmationStatus = await _statusRepository.GetByTypeAsync("Confirmation");
                if (confirmationStatus == null)
                {
                    throw new ApiException("Статус с типом 'Confirmation' не найден в системе", 500);
                }
                statusId = confirmationStatus.Id;
            }
            
            // Сериализуем список ID согласующих
            var application = new Application
            {
                Id = Guid.NewGuid(),
                CourseId = course.Id,
                AuthorId = userId,
                StatusId = statusId,
                ApprovalHistory = string.Empty,
                Approvers = applicationDto.ApproverIds,
                CreatedAt = DateTimeOffset.UtcNow,
                SoloDocId = Guid.NewGuid() 
            };
            
            await _applicationRepository.AddAsync(application);

            var createdApplication = await GetApplicationByIdAsync(application.Id);
            if (createdApplication == null)
                throw new ApiException("Ошибка при создании заявки", 500);
            
            transaction.Complete();
            
            _logger.LogInformation("Создана новая заявка с ID {ApplicationId} пользователем {UserId}", 
                application.Id, userId);
            
            return createdApplication;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при создании заявки пользователем {UserId}: {Message}", userId, ex.Message);
            
            throw;
        }
    }
    

    public async Task<ApplicationDetailDto?> UpdateApplicationAsync(Guid id, UpdateApplicationDto applicationDto)
    {
        var application = await _applicationRepository.GetByIdAsync(id);
        if (application == null)
            return null;

        var course = await _courseRepository.GetByIdAsync(application.CourseId);
        if (course == null)
            throw new ApiException("Связанный курс не найден", 404);

        if (applicationDto.Name != null)
            course.Name = applicationDto.Name;

        if (applicationDto.Description != null)
            course.Description = applicationDto.Description;

        if (applicationDto.Type != null)
            course.Type = ParseEnum<CourseType>(applicationDto.Type);

        if (applicationDto.Track != null)
            course.Track = ParseEnum<CourseTrack>(applicationDto.Track);

        if (applicationDto.Format != null)
            course.Format = ParseEnum<CourseFormat>(applicationDto.Format);

        if (applicationDto.TrainingCenter != null)
            course.TrainingCenter = applicationDto.TrainingCenter;

        if (applicationDto.StartDate.HasValue)
            course.StartDate = applicationDto.StartDate.Value;

        if (applicationDto.EndDate.HasValue)
            course.EndDate = applicationDto.EndDate.Value;

        if (!string.IsNullOrEmpty(applicationDto.Price))
            course.Price = applicationDto.Price;

        if (applicationDto.Link != null)
            course.Link = applicationDto.Link;

        if (applicationDto.EducationGoal != null)
            course.EducationGoal = applicationDto.EducationGoal;

        course.UpdatedAt = DateTimeOffset.UtcNow;
        await _courseRepository.UpdateAsync(course);

        if (applicationDto.Approvers != null)
        {
            application.Approvers = applicationDto.Approvers;
            string approversJson = System.Text.Json.JsonSerializer.Serialize(applicationDto.Approvers);
        }

        application.UpdatedAt = DateTimeOffset.UtcNow;
        await _applicationRepository.UpdateAsync(application);

        return await GetApplicationByIdAsync(id);
    }

    public async Task<ApplicationDetailDto?> ChangeApplicationStatusAsync(Guid id, ChangeStatusDto statusDto)
    {
        var application = await _applicationRepository.GetByIdAsync(id);
        if (application == null)
            return null;

        var newStatus = await _statusRepository.GetByIdAsync(statusDto.StatusId);
        if (newStatus == null)
            throw new ApiException("Указанный статус не найден", 404);

        application.StatusId = statusDto.StatusId;

        if (!string.IsNullOrEmpty(statusDto.Comment))
        {
            var historyEntry = new
            {
                Date = DateTimeOffset.UtcNow,
                StatusId = statusDto.StatusId,
                StatusName = newStatus.Name,
                Comment = statusDto.Comment
            };

            string historyJson = System.Text.Json.JsonSerializer.Serialize(historyEntry);
            application.ApprovalHistory += (string.IsNullOrEmpty(application.ApprovalHistory) ? "" : "\n") + historyJson;
        }

        application.UpdatedAt = DateTimeOffset.UtcNow;
        await _applicationRepository.UpdateAsync(application);


        return await GetApplicationByIdAsync(id);
    }

    public async Task<bool> DeleteApplicationAsync(Guid id)
    {
        var application = await _applicationRepository.GetByIdAsync(id);
        if (application == null)
            return false;


        var course = await _courseRepository.GetByIdAsync(application.CourseId);


        await _applicationRepository.RemoveAsync(application);


        if (course != null)
        {
            await _courseRepository.RemoveAsync(course);
        }

        return true;
    }


    private IQueryable<Application> ApplyFilters(IQueryable<Application> query, Dictionary<string, string> filters)
    {
        foreach (var filter in filters)
        {
            switch (filter.Key.ToLower())
            {
                case "status":
                    // Проверяем сначала точное совпадение по типу
                    if (query.Any(a => a.Status.Type == filter.Value))
                    {
                        query = query.Where(a => a.Status.Type == filter.Value);
                    }
                    // Затем проверяем точное совпадение по имени
                    else if (query.Any(a => a.Status.Name == filter.Value))
                    {
                        query = query.Where(a => a.Status.Name == filter.Value);
                    }
                    // Если точных совпадений нет, ищем частичные совпадения
                    else
                    {
                        query = query.Where(a => a.Status.Type.Contains(filter.Value) || 
                                                a.Status.Name.Contains(filter.Value));
                    }
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

    private static T ParseEnum<T>(string value) where T : struct, Enum
    {
        if (Enum.TryParse<T>(value, true, out var result))
            return result;

        throw new ApiException($"Недопустимое значение '{value}' для типа {typeof(T).Name}", 400);
    }


    public async Task<string> GetLatestCommentAsync(Guid applicationId)
    {
        var application = await _applicationRepository.GetApplicationWithDetailsAsync(applicationId);
        if (application == null || string.IsNullOrEmpty(application.ApprovalHistory))
            return string.Empty;

        try
        {
            // Разделяем историю по строкам
            var historyEntries = application.ApprovalHistory.Split('\n', StringSplitOptions.RemoveEmptyEntries);

            if (historyEntries.Length == 0)
                return string.Empty;

            // Берем последнюю запись
            var lastEntryJson = historyEntries[historyEntries.Length - 1];

            // Десериализуем последнюю запись
            var lastEntry = System.Text.Json.JsonSerializer.Deserialize<ApprovalHistoryEntry>(
                lastEntryJson,
                new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true }
            );

            return lastEntry?.Comment ?? string.Empty;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при извлечении комментария из истории одобрения");
            return string.Empty;
        }
    }

    private string MapCourseType(CourseType type)
    {
        return type switch
        {
            CourseType.Course => "Course",
            CourseType.Conference => "Conference",
            CourseType.Certification => "Certification",
            CourseType.Workshop => "Workshop",
            _ => "Course"
        };
    }

    private string MapCourseTrack(CourseTrack track)
    {
        return track switch
        {
            CourseTrack.SoftSkills => "SoftSkills Skills",
            CourseTrack.HardSkills => "HardSkills Skills",
            CourseTrack.ManagementSkills => "ManagementSkills Skills",
            _ => "HardSkills Skills"
        };
    }
}
