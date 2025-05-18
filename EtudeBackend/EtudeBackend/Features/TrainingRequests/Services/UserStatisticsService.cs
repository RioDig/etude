using System.Security.Claims;
using AutoMapper;
using EtudeBackend.Features.TrainingRequests.DTOs;
using EtudeBackend.Features.TrainingRequests.Entities;
using EtudeBackend.Features.TrainingRequests.Repositories;
using EtudeBackend.Shared.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace EtudeBackend.Features.TrainingRequests.Services;

public class UserStatisticsService : IUserStatisticsService
{
    private readonly IApplicationRepository _applicationRepository;
    private readonly ICourseRepository _courseRepository;
    private readonly IStatusRepository _statusRepository;
    private readonly IMapper _mapper;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<UserStatisticsService> _logger;

    public UserStatisticsService(
        IApplicationRepository applicationRepository,
        ICourseRepository courseRepository,
        IStatusRepository statusRepository,
        IMapper mapper,
        UserManager<ApplicationUser> userManager,
        IHttpContextAccessor httpContextAccessor,
        ILogger<UserStatisticsService> logger)
    {
        _applicationRepository = applicationRepository;
        _courseRepository = courseRepository;
        _statusRepository = statusRepository;
        _mapper = mapper;
        _userManager = userManager;
        _httpContextAccessor = httpContextAccessor;
        _logger = logger;
    }

    public async Task<List<CompetencyDto>> GetCompetenciesAsync()
    {
        var userId = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            _logger.LogWarning("Попытка получения компетенций без авторизации");
            throw new UnauthorizedAccessException("Пользователь не авторизован");
        }

        var allCompetencies = new List<CompetencyDto>
        {
            new CompetencyDto { Id = Guid.NewGuid(), Name = "Разработка на C#" },
            new CompetencyDto { Id = Guid.NewGuid(), Name = "ASP.NET Core" },
            new CompetencyDto { Id = Guid.NewGuid(), Name = "Entity Framework Core" },
            new CompetencyDto { Id = Guid.NewGuid(), Name = "Управление проектами" },
            new CompetencyDto { Id = Guid.NewGuid(), Name = "Agile методологии" },
            new CompetencyDto { Id = Guid.NewGuid(), Name = "Базы данных SQL" },
            new CompetencyDto { Id = Guid.NewGuid(), Name = "Микросервисная архитектура" },
            new CompetencyDto { Id = Guid.NewGuid(), Name = "DevOps практики" },
            new CompetencyDto { Id = Guid.NewGuid(), Name = "Контейнеризация (Docker)" },
            new CompetencyDto { Id = Guid.NewGuid(), Name = "Azure Cloud Services" },
            new CompetencyDto { Id = Guid.NewGuid(), Name = "Лидерство в команде" },
            new CompetencyDto { Id = Guid.NewGuid(), Name = "Автоматизированное тестирование" },
            new CompetencyDto { Id = Guid.NewGuid(), Name = "Паттерны проектирования" },
            new CompetencyDto { Id = Guid.NewGuid(), Name = "Непрерывная интеграция (CI/CD)" },
            new CompetencyDto { Id = Guid.NewGuid(), Name = "Функциональное программирование" }
        };

        var random = new Random();
        int count = random.Next(3, 7);

        var shuffledCompetencies = allCompetencies.OrderBy(c => random.Next()).Take(count).ToList();

        return shuffledCompetencies;
    }

    public async Task<List<PastEventDto>> GetPastEventsAsync()
    {
        var userId = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            _logger.LogWarning("Попытка получения прошедших мероприятий без авторизации");
            throw new UnauthorizedAccessException("Пользователь не авторизован");
        }

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            _logger.LogWarning("Пользователь не найден при получении прошедших мероприятий");
            return new List<PastEventDto>();
        }

        var userApplications = await _applicationRepository.GetByAuthorIdAsync(userId);

        var currentDate = DateOnly.FromDateTime(DateTime.UtcNow);
        var pastEvents = new List<PastEventDto>();

        foreach (var application in userApplications)
        {
            var course = await _courseRepository.GetByIdAsync(application.CourseId);
            var status = await _statusRepository.GetByIdAsync(application.StatusId);

            if (course == null || status == null)
            {
                continue;
            }

            if (course.EndDate < currentDate)
            {
                try
                {
                    // Создаем DTO для прошедшего мероприятия
                    var learner = await _userManager.FindByIdAsync(userId);
                    var pastEvent = new PastEventDto
                    {
                        Id = application.Id,
                        CreatedAt = application.CreatedAt,
                        Status = new StatusDto
                        {
                            Id = status.Id,
                            Name = status.Name,
                            // Определяем тип статуса в зависимости от названия
                            Type = DetermineStatusType(status.Name)
                        },
                        Course = new CourseDetailDto
                        {
                            Id = course.Id,
                            Name = course.Name,
                            Description = course.Description,
                            Type = course.Type.ToString(),
                            Track = course.Track.ToString(),
                            Format = course.Format.ToString(),
                            TrainingCenter = course.TrainingCenter,
                            StartDate = course.StartDate,
                            EndDate = course.EndDate,
                            Price = course.Price,
                            EducationGoal = course.EducationGoal,
                            Link = course.Link,
                            Learner = learner != null ? new UserBasicDto
                            {
                                Id = learner.Id,
                                Name = learner.Name,
                                Surname = learner.Surname,
                                Patronymic = learner.Patronymic,
                                Position = learner.Position,
                                Department = learner.Department,
                                IsLeader = false
                            } : new UserBasicDto()
                        }
                    };

                    pastEvents.Add(pastEvent);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Ошибка при формировании данных о прошедшем мероприятии. ApplicationId: {ApplicationId}", application.Id);
                }
            }
        }

        return pastEvents.OrderByDescending(e => e.Course.EndDate).ToList();
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
}