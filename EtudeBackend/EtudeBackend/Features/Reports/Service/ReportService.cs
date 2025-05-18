using System.Text;
using EtudeBackend.Features.Reports.DTOs;
using EtudeBackend.Features.TrainingRequests.Repositories;
using EtudeBackend.Shared.Data;
using EtudeBackend.Shared.Models;
using Microsoft.EntityFrameworkCore;
using EtudeBackend.Features.TrainingRequests.Entities;
using EtudeBackend.Features.Auth.Services;
using EtudeBackend.Features.Users.DTOs;
using EtudeBackend.Shared.Extensions;

namespace EtudeBackend.Features.Reports.Service;

public class ReportService : IReportService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<ReportService> _logger;
    private readonly IApplicationRepository _applicationRepository;
    private readonly ICourseRepository _courseRepository;
    private readonly IStatusRepository _statusRepository;
    private readonly IOrganizationService _organizationService;
    private readonly string _reportsPath;

    public ReportService(
        ApplicationDbContext context,
        IApplicationRepository applicationRepository,
        ICourseRepository courseRepository,
        IStatusRepository statusRepository,
        IOrganizationService organizationService,
        ILogger<ReportService> logger,
        IWebHostEnvironment environment)
    {
        _context = context;
        _applicationRepository = applicationRepository;
        _courseRepository = courseRepository;
        _statusRepository = statusRepository;
        _organizationService = organizationService;
        _logger = logger;
        _reportsPath = Path.Combine(environment.ContentRootPath, "Reports");

        if (!Directory.Exists(_reportsPath))
        {
            Directory.CreateDirectory(_reportsPath);
        }
    }

    public async Task<List<ReportInfoDto>> GetAllReportsAsync(List<ReportFilterDto>? filters = null)
    {
        IQueryable<Report> query = _context.Reports.OrderByDescending(r => r.CreatedAt);

        if (filters != null && filters.Count > 0)
        {
            foreach (var filter in filters)
            {
                switch (filter.Name.ToLower())
                {
                    case "filter_type":
                        query = query.Where(r => r.ReportType == filter.Value);
                        break;
                    case "date":
                        if (DateOnly.TryParse(filter.Value, out var filterDate))
                        {
                            var startDate = new DateTimeOffset(filterDate.Year, filterDate.Month, filterDate.Day, 0, 0, 0, TimeSpan.Zero);
                            var endDate = startDate.AddDays(1);

                            query = query.Where(r => r.CreatedAt >= startDate && r.CreatedAt < endDate);
                        }
                        break;
                }
            }
        }

        var reports = await query.Select(r => new ReportInfoDto
        {
            Id = r.Id,
            ReportType = r.ReportType,
            ReportCreateDate = r.CreatedAt
        }).ToListAsync();

        return reports;
    }

    public async Task<byte[]> DownloadReportAsync(Guid reportId)
    {
        var report = await _context.Reports.FindAsync(reportId);
        if (report == null)
        {
            throw new KeyNotFoundException($"Отчет с ID {reportId} не найден");
        }

        var filePath = report.FilePath;
        if (!File.Exists(filePath))
        {
            _logger.LogError("Файл отчета не найден: {FilePath}", filePath);
            throw new KeyNotFoundException($"Файл отчета не найден");
        }

        return await File.ReadAllBytesAsync(filePath);
    }

    public async Task<byte[]> GenerateReportAsync()
    {
        var registeredStatus = await _statusRepository.GetByTypeAsync("Registered");
        if (registeredStatus == null)
        {
            _logger.LogError("Статус 'Registered' не найден в системе");
            throw new InvalidOperationException("Статус 'Registered' не найден в системе");
        }
        
        var applications = await _applicationRepository.GetByStatusIdAsync(registeredStatus.Id);
        if (applications == null || applications.Count == 0)
        {
            _logger.LogWarning("Не найдено заявок со статусом 'Registered'");
        }
        
        var trainingItems = new List<TrainingItem>();

        foreach (var application in applications)
        {
            var course = await _courseRepository.GetByIdAsync(application.CourseId);
            if (course == null)
            {
                _logger.LogWarning("Курс с ID {CourseId} не найден", application.CourseId);
                continue;
            }
            
            var authorUser = await _context.Users.FindAsync(application.AuthorId);
            if (authorUser == null)
            {
                _logger.LogWarning("Автор заявки с ID {AuthorId} не найден", application.AuthorId);
                continue;
            }
            
            var learnerEmployee = await _organizationService.GetEmployeeByEmailAsync(authorUser.OrgEmail);
            
            var approversList = new List<User>();
            if (!string.IsNullOrEmpty(application.Approvers))
            {
                try
                {
                    List<string> approverIds;
                    try
                    {
                        var intIds = System.Text.Json.JsonSerializer.Deserialize<List<int>>(application.Approvers);
                        if (intIds != null)
                        {
                            approverIds = intIds.Select(id => id.ToString()).ToList();
                        }
                        else
                        {
                            approverIds = new List<string>();
                        }
                    }
                    catch
                    {
                        approverIds = System.Text.Json.JsonSerializer.Deserialize<List<string>>(application.Approvers) ?? new List<string>();
                    }

                    foreach (var approverId in approverIds)
                    {
                        var approverInfo = await _organizationService.GetEmployeeByIdAsync(approverId);
                        if (approverInfo != null)
                        {
                            approversList.Add(new User
                            {
                                Name = approverInfo.Name,
                                Surname = approverInfo.Surname,
                                Patronymic = approverInfo.Patronymic,
                                Position = approverInfo.Position,
                                Department = approverInfo.Department
                            });
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Ошибка при десериализации списка согласующих");
                }
            }

            var trainingItem = new TrainingItem
            {
                CreatedAt = application.CreatedAt,
                Name = course.Name,
                Description = course.Description,
                Type = course.Type,
                Track = course.Track,
                Format = course.Format,
                TrainingCenter = course.TrainingCenter,
                StartDate = course.StartDate,
                EndDate = course.EndDate,
                Link = course.Link,
                Price = course.Price,
                EducationGoal = course.EducationGoal,
                Learner = new User
                {
                    Name = authorUser.Name,
                    Surname = authorUser.Surname,
                    Patronymic = authorUser.Patronymic,
                    Position = learnerEmployee?.Position ?? authorUser.Position,
                    Department = learnerEmployee?.Department ?? "Не указано"
                },
                Approvers = approversList.ToArray()
            };

            trainingItems.Add(trainingItem);
        }

        string reportType = "CompletedTraining";
        var reportId = Guid.NewGuid();
        var createdAt = DateTimeOffset.UtcNow;

        var fileName = $"{reportId}.xlsx";
        var filePath = Path.Combine(_reportsPath, fileName);
        
        ReportGenerator.GenerateCompletedTrainingsReport(trainingItems, filePath);
        
        var report = new Report
        {
            Id = reportId,
            ReportType = reportType,
            CreatedAt = createdAt,
            FilePath = filePath
        };

        _context.Reports.Add(report);
        await _context.SaveChangesAsync();

        return await File.ReadAllBytesAsync(filePath);
    }
}