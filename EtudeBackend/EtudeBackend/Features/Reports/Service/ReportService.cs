using System.Text;
using EtudeBackend.Features.Reports.DTOs;
using EtudeBackend.Shared.Data;
using Microsoft.EntityFrameworkCore;

namespace EtudeBackend.Features.Reports.Service;

public class ReportService : IReportService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<ReportService> _logger;
    private readonly string _reportsPath;

    public ReportService(
        ApplicationDbContext context,
        ILogger<ReportService> logger,
        IWebHostEnvironment environment)
    {
        _context = context;
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
        string reportType = "CompletedTraining";

        var reportId = Guid.NewGuid();
        var createdAt = DateTimeOffset.UtcNow;

        var fileName = $"{reportId}-{createdAt:yyyyMMdd}.txt";
        var filePath = Path.Combine(_reportsPath, fileName);

        string reportContent = $"Отчет по завершенным обучениям\r\n" +
                              $"ID: {reportId}\r\n" +
                              $"Дата создания: {createdAt:dd.MM.yyyy HH:mm:ss}\r\n\r\n" +
                              $"Это текстовый файл отчета.\r\n" +
                              $"В реальной реализации здесь будут данные отчета.";

        byte[] fileContent = Encoding.UTF8.GetBytes(reportContent);

        await File.WriteAllBytesAsync(filePath, fileContent);

        var report = new Report
        {
            Id = reportId,
            ReportType = reportType,
            CreatedAt = createdAt,
            FilePath = filePath
        };

        _context.Reports.Add(report);
        await _context.SaveChangesAsync();

        return fileContent;
    }
}