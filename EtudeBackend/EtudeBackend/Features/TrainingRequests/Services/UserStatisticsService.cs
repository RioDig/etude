using AutoMapper;
using EtudeBackend.Features.TrainingRequests.DTOs;
using EtudeBackend.Features.TrainingRequests.Entities;
using EtudeBackend.Features.TrainingRequests.Repositories;
using EtudeBackend.Shared.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace EtudeBackend.Features.TrainingRequests.Services
{
    public class UserStatisticsService : IUserStatisticsService
    {
        private readonly ICourseRepository _courseRepository;
        private readonly IMapper _mapper;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserStatisticsService(
            ICourseRepository courseRepository,
            IMapper mapper,
            UserManager<ApplicationUser> userManager,
            IHttpContextAccessor httpContextAccessor)
        {
            _courseRepository = courseRepository;
            _mapper = mapper;
            _userManager = userManager;
            _httpContextAccessor = httpContextAccessor;
        }

    public async Task<List<CompetencyDto>> GetCompetenciesAsync()
    {
    var userId = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (string.IsNullOrEmpty(userId))
    {
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
                throw new UnauthorizedAccessException("Пользователь не авторизован");
            }
            
            var user = await _userManager.FindByIdAsync(userId);
            if (user is not { SoloUserId: not null })
            {
                return new List<PastEventDto>();
            }
            
            var employeeId = Guid.Parse(userId);
            
            var userCourses = await _courseRepository.GetByEmployeeIdAsync(employeeId);
            
            var currentDate = DateOnly.FromDateTime(DateTime.UtcNow);
            var pastCourses = userCourses
                .Where(c => c.EndDate < currentDate)
                .ToList();
            
            var pastEvents = pastCourses.Select(course => new PastEventDto
            {
                Id = course.Id,
                Name = course.Name,
                Type = course.Type.ToString(),
                Format = course.Format.ToString(),
                Track = course.Track.ToString(),
                StartDate = course.StartDate,
                EndDate = course.EndDate
            }).ToList();

            return pastEvents;
        }
    }
}