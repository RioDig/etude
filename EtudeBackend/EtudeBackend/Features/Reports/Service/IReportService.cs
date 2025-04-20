using EtudeBackend.Features.Reports.DTOs;

namespace EtudeBackend.Features.Reports.Services;

public interface IReportService
{
    Task<List<ReportInfoDto>> GetAllReportsAsync();
    Task<ReportResultDto?> ExecuteReportAsync(Guid reportId);
}