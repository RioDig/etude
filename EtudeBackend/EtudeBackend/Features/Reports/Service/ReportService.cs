using EtudeBackend.Features.Reports.DTOs;
using EtudeBackend.Features.Templates.Repositories;
using EtudeBackend.Features.TrainingRequests.Repositories;
using EtudeBackend.Shared.Exceptions;

namespace EtudeBackend.Features.Reports.Services;

public class ReportService : IReportService
{
    private readonly IReportTemplateRepository _reportTemplateRepository;
    private readonly IApplicationRepository _applicationRepository;
    private readonly ICourseRepository _courseRepository;
    
    public ReportService(
        IReportTemplateRepository reportTemplateRepository,
        IApplicationRepository applicationRepository,
        ICourseRepository courseRepository)
    {
        _reportTemplateRepository = reportTemplateRepository;
        _applicationRepository = applicationRepository;
        _courseRepository = courseRepository;
    }

    public async Task<List<ReportInfoDto>> GetAllReportsAsync()
    {
        var reportTemplates = await _reportTemplateRepository.GetAllAsync();
        
        return reportTemplates.Select(t => new ReportInfoDto
        {
            Id = t.Id,
            Name = t.Name
        }).ToList();
    }

    public async Task<ReportResultDto?> ExecuteReportAsync(Guid reportId)
    {
        var reportTemplate = await _reportTemplateRepository.GetByIdAsync(reportId);
        if (reportTemplate == null)
            return null;
        
        // В зависимости от типа шаблона отчета, вызываем соответствующий метод генерации
        switch (reportTemplate.TemplateType.ToLower())
        {
            case "applications":
                return await GenerateApplicationsReportAsync(reportTemplate.Name, reportTemplate.Attributes);
            
            case "courses":
                return await GenerateCoursesReportAsync(reportTemplate.Name, reportTemplate.Attributes);
            
            case "statistics":
                return await GenerateStatisticsReportAsync(reportTemplate.Name, reportTemplate.Attributes);
            
            default:
                throw new ApiException($"Неподдерживаемый тип отчета: {reportTemplate.TemplateType}", 400);
        }
    }
    
    // Методы для генерации конкретных отчетов
    private async Task<ReportResultDto> GenerateApplicationsReportAsync(string reportName, string attributes)
    {
        // Здесь должна быть реальная логика генерации отчета
        // Для демонстрации просто создаем пустой отчет
        
        var applications = await _applicationRepository.GetAllAsync();
        
        // Генерация XLSX файла
        // В реальном приложении здесь был бы код для формирования Excel-файла
        var fileContent = new byte[0]; // Заглушка
        
        return new ReportResultDto
        {
            FileName = $"{reportName}_{DateTime.Now:yyyyMMdd}.xlsx",
            FileContent = fileContent
        };
    }
    
    private async Task<ReportResultDto> GenerateCoursesReportAsync(string reportName, string attributes)
    {
        // Аналогично для отчета по курсам
        var courses = await _courseRepository.GetAllAsync();
        
        // Генерация XLSX файла
        var fileContent = new byte[0]; // Заглушка
        
        return new ReportResultDto
        {
            FileName = $"{reportName}_{DateTime.Now:yyyyMMdd}.xlsx",
            FileContent = fileContent
        };
    }
    
    private async Task<ReportResultDto> GenerateStatisticsReportAsync(string reportName, string attributes)
    {
        // Аналогично для отчета со статистикой
        
        // Генерация XLSX файла
        var fileContent = new byte[0]; // Заглушка
        
        return new ReportResultDto
        {
            FileName = $"{reportName}_{DateTime.Now:yyyyMMdd}.xlsx",
            FileContent = fileContent
        };
    }
}