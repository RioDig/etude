using EtudeBackend.Features.Reports.DTOs;

namespace EtudeBackend.Features.Reports.Service;

public interface IReportService
{
    Task<List<ReportInfoDto>> GetAllReportsAsync(List<ReportFilterDto>? filters = null);
    Task<byte[]> DownloadReportAsync(Guid reportId);
    Task<byte[]> GenerateReportAsync();
}