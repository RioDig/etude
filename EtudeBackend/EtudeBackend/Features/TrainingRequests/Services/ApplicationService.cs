using AutoMapper;
using EtudeBackend.Features.TrainingRequests.DTOs;
using EtudeBackend.Features.TrainingRequests.Entities;
using EtudeBackend.Features.TrainingRequests.Repositories;
using EtudeBackend.Features.Users.Repositories;
using EtudeBackend.Shared.Exceptions;
using EtudeBackend.Shared.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
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
        
        // Создаем базовый запрос
        IQueryable<Application> query = _applicationRepository.GetAllQuery()
            .Include(a => a.Status)
            .Include(a => a.Course);
        
        // Применяем фильтры, если они указаны
        if (filters != null && filters.Count > 0)
        {
            query = ApplyFilters(query, filters);
        }
        
        // Получаем общее количество элементов после фильтрации
        var totalCount = await query.CountAsync();
        
        // Применяем сортировку
        query = ApplySorting(query, sortBy, orderBy);
        
        // Применяем пагинацию
        var items = await query
            .Skip((page - 1) * perPage)
            .Take(perPage)
            .ToListAsync();
        
        // Маппим результаты в DTO
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
    // Используем TransactionScope для обеспечения атомарности операции
    using var transaction = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled);
    
    try 
    {
        // Создаем новый курс
        var course = new Course
        {
            Id = Guid.NewGuid(),
            Name = applicationDto.Name,
            Description = applicationDto.Description,
            Type = ParseEnum<CourseType>(applicationDto.Type),
            Track = ParseEnum<CourseTrack>(applicationDto.Track),
            Format = ParseEnum<CourseFormat>(applicationDto.Format),
            TrainingCenter = applicationDto.TrainingCenter,
            StartDate = applicationDto.StartDate,
            EndDate = applicationDto.EndDate,
            Price = applicationDto.Price,
            EducationGoal = applicationDto.EducationGoal,
            IsActive = true,
            CreatedAt = DateTimeOffset.UtcNow
        };
        
        // Сохраняем курс
        await _courseRepository.AddAsync(course);
        
        // Получаем статус "Новая заявка"
        var newStatus = await _statusRepository.GetByNameAsync("Новая") 
            ?? throw new ApiException("Статус 'Новая' не найден", 500);
        
        // Преобразуем идентификаторы согласующих в строку JSON
        // Проверяем, что ApproverIds - это список строк, если нет - конвертируем в строковый формат
        var approverIdStrings = applicationDto.ApproverIds
            .Select(id => id.ToString())
            .ToList();
            
        string approversJson = System.Text.Json.JsonSerializer.Serialize(approverIdStrings);
        
        // Создаем новую заявку с полем Approvers
        var application = new Application
        {
            Id = Guid.NewGuid(),
            CourseId = course.Id,
            AuthorId = userId,
            StatusId = newStatus.Id,
            ApprovalHistory = string.Empty,
            Approvers = approversJson, // Добавляем список согласующих в JSON формате
            CreatedAt = DateTimeOffset.UtcNow,
            SoloDocId = Guid.NewGuid() // Генерируем временный ID для документа Solo
        };
        
        // Сохраняем заявку
        await _applicationRepository.AddAsync(application);
        
        // Проверяем, что заявка была успешно создана
        var createdApplication = await GetApplicationByIdAsync(application.Id);
        if (createdApplication == null)
            throw new ApiException("Ошибка при создании заявки", 500);
            
        // Если всё прошло успешно, завершаем транзакцию
        transaction.Complete();
        
        // Для логирования
        _logger.LogInformation("Создана новая заявка с ID {ApplicationId} пользователем {UserId}", 
            application.Id, userId);
        
        return createdApplication;
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Ошибка при создании заявки пользователем {UserId}", userId);
        
        throw; // Пробрасываем исключение дальше
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
        
        // Обновляем поля курса
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
            
        if (applicationDto.Price.HasValue)
            course.Price = applicationDto.Price.Value;
            
        course.UpdatedAt = DateTimeOffset.UtcNow;
        await _courseRepository.UpdateAsync(course);
        
        // Обновляем поле согласующих в заявке, если оно предоставлено
        if (applicationDto.ApproverIds != null)
        {
            string approversJson = System.Text.Json.JsonSerializer.Serialize(applicationDto.ApproverIds);
            // Здесь должна быть логика обновления согласующих
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
        
        // Обновляем статус заявки
        application.StatusId = statusDto.StatusId;
        
        // Добавляем запись в историю обработки заявки
        if (!string.IsNullOrEmpty(statusDto.Comment))
        {
            var historyEntry = new
            {
                Date = DateTimeOffset.UtcNow,
                StatusId = statusDto.StatusId,
                StatusName = newStatus.Name,
                Comment = statusDto.Comment
            };
            
            // Добавляем запись в историю
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
                    query = query.Where(a => a.Status.Name.Contains(filter.Value));
                    break;
                case "author":
                    query = query.Where(a => a.Author.Surname.Contains(filter.Value) || 
                                           a.Author.Name.Contains(filter.Value) ||
                                           a.Author.Patronymic.Contains(filter.Value));
                    break;
                case "course":
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
            return query.OrderByDescending(a => a.CreatedAt); // По умолчанию сортируем по дате создания
        
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
}